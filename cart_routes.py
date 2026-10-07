from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from auth import get_current_user

router = APIRouter(prefix="/cart", tags=["cart"])

def cart_json(item, db):
    p = db.query(models.Product).filter(models.Product.id == item.product_id).first()
    v = db.query(models.ProductVariant).filter(models.ProductVariant.id == item.variant_id).first() \
        if item.variant_id else None
    unit = item.bargained_price or (p.price + (v.additional_price if v else 0))
    return {"id": item.id, "product_id": p.id, "name": p.name, "image_url": p.image_url,
            "variant": f"{v.variant_type}: {v.variant_value}" if v else None,
            "quantity": item.quantity, "unit_price": unit, "total": round(unit * item.quantity, 2)}

@router.get("")
def get_cart(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(models.CartItem).filter(models.CartItem.user_id == user.id).all()
    data = [cart_json(i, db) for i in items]
    return {"items": data, "total": round(sum(i["total"] for i in data), 2)}

@router.post("")
def add_to_cart(data: schemas.CartAdd, user: models.User = Depends(get_current_user),
                db: Session = Depends(get_db)):
    existing = db.query(models.CartItem).filter(
        models.CartItem.user_id == user.id,
        models.CartItem.product_id == data.product_id,
        models.CartItem.variant_id == data.variant_id).first()
    if existing:
        existing.quantity += data.quantity
    else:
        db.add(models.CartItem(user_id=user.id, product_id=data.product_id,
                               variant_id=data.variant_id, quantity=data.quantity))
    # Günlük görev: 1 ürün sepete ekle
    quest = db.query(models.DailyQuest).filter(
        models.DailyQuest.user_id == user.id,
        models.DailyQuest.quest_type == "add_cart1").first()
    if quest and not quest.completed:
        quest.completed = True
        user.virtual_balance += quest.reward
    db.commit()
    return {"ok": True}

@router.put("/{item_id}")
def update_cart(item_id: int, data: schemas.CartUpdate,
                user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(models.CartItem).filter(
        models.CartItem.id == item_id, models.CartItem.user_id == user.id).first()
    if not item:
        raise HTTPException(404, "Sepet öğesi yok")
    if data.quantity <= 0:
        db.delete(item)
    else:
        item.quantity = data.quantity
    db.commit()
    return {"ok": True}

@router.delete("/{item_id}")
def delete_cart(item_id: int, user: models.User = Depends(get_current_user),
                db: Session = Depends(get_db)):
    item = db.query(models.CartItem).filter(
        models.CartItem.id == item_id, models.CartItem.user_id == user.id).first()
    if item:
        db.delete(item); db.commit()
    return {"ok": True}

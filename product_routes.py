from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from auth import get_current_user
import random

router = APIRouter(prefix="/products", tags=["products"])

@router.get("")
def list_products(
    page: int = 1, limit: int = 12, category: str = None,
    search: str = None, db: Session = Depends(get_db)
):
    q = db.query(models.Product)
    if category:
        q = q.filter(models.Product.category == category)
    if search:
        q = q.filter(models.Product.name.contains(search))
    total = q.count()
    items = q.offset((page - 1) * limit).limit(limit).all()
    for p in items:
        p.views += 1   # Her listeleme görüntülenme sayar
    db.commit()
    return {"total": total, "page": page, "items": [
        {"id": p.id, "name": p.name, "price": p.price, "category": p.category,
         "image_url": p.image_url, "rating_avg": p.rating_avg,
         "stock": p.stock, "views_now": random.randint(2, 20),  # Sayaç canlı tutulsun diye
         "is_flash": p.is_flash, "flash_discount": p.flash_discount} for p in items]}

@router.get("/flash")
def flash_product(db: Session = Depends(get_db)):
    """Her çağrılda rastgele bir ürünü %20-70 indirimli yapar."""
    p = db.query(models.Product).filter(models.Product.stock > 0).order_by(models.func.random()).first()
    if not p:
        raise HTTPException(404, "Ürün yok")
    p.is_flash = True
    p.flash_discount = random.randint(20, 70)
    db.commit()
    return {"id": p.id, "name": p.name, "price": p.price,
            "discounted_price": round(p.price * (1 - p.flash_discount / 100), 2),
            "discount": p.flash_discount, "image_url": p.image_url}

@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    p = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not p:
        raise HTTPException(404, "Ürün bulunamadı!")
    reviews = db.query(models.Review).filter(models.Review.product_id == product_id).all()
    variants = db.query(models.ProductVariant).filter(models.ProductVariant.product_id == product_id).all()
    # Aynı kategoriden 4 benzer ürün
    similar = db.query(models.Product).filter(
        models.Product.category == p.category, models.Product.id != p.id
    ).limit(4).all()
    p.views_now = random.randint(2, 20)
    db.commit()
    return {
        "id": p.id, "name": p.name, "description": p.description, "price": p.price,
        "category": p.category, "brand": p.brand, "image_url": p.image_url,
        "stock": p.stock, "rating_avg": p.rating_avg, "views": p.views, "views_now": p.views_now,
        "reviews": [{"id": r.id, "rating": r.rating, "comment": r.comment,
                      "username": db.query(models.User).filter(models.User.id == r.user_id).first().username,
                      "avatar": db.query(models.User).filter(models.User.id == r.user_id).first().avatar_emoji,
                      "created_at": r.created_at.isoformat()} for r in reviews],
        "variants": [{"id": v.id, "variant_type": v.variant_type,
                       "variant_value": v.variant_value, "additional_price": v.additional_price} for v in variants],
        "similar": [{"id": s.id, "name": s.name, "price": s.price, "image_url": s.image_url} for s in similar],
    }

@router.post("/{product_id}/reviews")
def add_review(product_id: int, data: schemas.ReviewCreate,
               user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not 1 <= data.rating <= 5:
        raise HTTPException(400, "Puan 1-5 arası olmalı")
    db.add(models.Review(user_id=user.id, product_id=product_id,
                         rating=data.rating, comment=data.comment))
    # Görev ilerlemesi: yorum yaz
    quest = db.query(models.DailyQuest).filter(
        models.DailyQuest.user_id == user.id,
        models.DailyQuest.quest_type == "comment2",
        models.DailyQuest.completed == False).first()
    db.commit()
    # Ortalama puanı güncelle
    reviews = db.query(models.Review).filter(models.Review.product_id == product_id).all()
    p = db.query(models.Product).filter(models.Product.id == product_id).first()
    p.rating_avg = round(sum(r.rating for r in reviews) / len(reviews), 1)
    db.commit()
    return {"ok": True}

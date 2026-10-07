from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas, random
from auth import get_current_user
from datetime import datetime, timedelta

router = APIRouter(prefix="/orders", tags=["orders"])

@router.get("")
def my_orders(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    orders = db.query(models.Order).filter(models.Order.user_id == user.id)\
        .order_by(models.Order.order_date.desc()).all()
    result = []
    for o in orders:
        items = db.query(models.OrderItem).filter(models.OrderItem.order_id == o.id).all()
        result.append({"id": o.id, "total_amount": o.total_amount, "status": o.status,
                       "tracking_number": o.tracking_number,
                       "order_date": o.order_date.isoformat(),
                       "delivery_date": o.delivery_date.isoformat() if o.delivery_date else None,
                       "items": [{"name": db.query(models.Product).filter(
                           models.Product.id == i.product_id).first().name,
                           "quantity": i.quantity, "unit_price": i.unit_price} for i in items]})
    return result

@router.post("/payment")
def pay(data: schemas.PaymentSchema, user: models.User = Depends(get_current_user),
        db: Session = Depends(get_db)):
    """SANAL ödeme — gerçek kart yok, bakiyeden düşülür. Bakiye yetmezse reddedilir."""
    items = db.query(models.CartItem).filter(models.CartItem.user_id == user.id).all()
    if not items:
        raise HTTPException(400, "Sepetin boş!")
    total = 0
    for it in items:
        p = db.query(models.Product).filter(models.Product.id == it.product_id).first()
        v = db.query(models.ProductVariant).filter(models.ProductVariant.id == it.variant_id).first() \
            if it.variant_id else None
        total += (it.bargained_price or (p.price + (v.additional_price if v else 0))) * it.quantity
        p.stock -= it.quantity
    total = round(total, 2)
    if user.virtual_balance < total:
        raise HTTPException(402, f"Bakiye yetersiz! Gerekli: {total} TL, Bakiyen: {user.virtual_balance} TL")
    user.virtual_balance -= total
    order = models.Order(
        user_id=user.id, total_amount=total, status="Hazırlanıyor",
        tracking_number=f"BC{random.randint(100000000, 999999999)}",
        shipping_address=data.shipping_address,
        delivery_date=datetime.utcnow() + timedelta(days=random.randint(1, 5)),
    )
    db.add(order); db.commit(); db.refresh(order)
    for it in items:
        p = db.query(models.Product).filter(models.Product.id == it.product_id).first()
        v = db.query(models.ProductVariant).filter(models.ProductVariant.id == it.variant_id).first() \
            if it.variant_id else None
        unit = it.bargained_price or (p.price + (v.additional_price if v else 0))
        db.add(models.OrderItem(order_id=order.id, product_id=it.product_id,
                                quantity=it.quantity, unit_price=unit))
        db.delete(it)
    db.commit()
    return {"ok": True, "order_id": order.id, "remaining_balance": user.virtual_balance}

@router.get("/{order_id}/track")
def track(order_id: int, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    o = db.query(models.Order).filter(models.Order.id == order_id,
                                      models.Order.user_id == user.id).first()
    if not o:
        raise HTTPException(404, "Sipariş yok")
    # Basit sahte konum üretimi
    cities = ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya"]
    return {"status": o.status, "tracking_number": o.tracking_number,
            "location": f"{random.choice(cities)} Aktarma Merkezi",
            "delivery_date": o.delivery_date.isoformat() if o.delivery_date else None,
            "timeline": [
                {"step": "Sipariş Alındı", "done": True},
                {"step": "Hazırlanıyor", "done": o.status != "Hazırlanıyor"},
                {"step": "Kargoya Verildi", "done": o.status in ["Yolda", "Teslim Edildi"]},
                {"step": "Yolda", "done": o.status == "Yolda"},
                {"step": "Teslim Edildi", "done": o.status == "Teslim Edildi"},
            ]}

@router.post("/{order_id}/return")
def return_order(order_id: int, data: schemas.ReturnSchema,
                 user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    o = db.query(models.Order).filter(models.Order.id == order_id,
                                      models.Order.user_id == user.id).first()
    if not o:
        raise HTTPException(404, "Sipariş yok")
    existing = db.query(models.Return).filter(models.Return.order_id == order_id).first()
    if existing:
        raise HTTPException(400, "Bu sipariş için iade talebi zaten var!")
    db.add(models.Return(order_id=order_id, user_id=user.id, reason=data.reason))
    user.virtual_balance += o.total_amount  # Anında sanal iade
    db.commit()
    return {"ok": True, "refund": o.total_amount, "balance": user.virtual_balance}

@router.post("/{order_id}/deliver")
def mark_delivered(order_id: int, user: models.User = Depends(get_current_user),
                   db: Session = Depends(get_db)):
    """Kullanıcı 'Teslim Al' dediğinde — unboxing tetiklenir."""
    o = db.query(models.Order).filter(models.Order.id == order_id,
                                      models.Order.user_id == user.id).first()
    if not o:
        raise HTTPException(404, "Sipariş yok")
    o.status = "Teslim Edildi"
    # Siparişteki ürünleri Sanal Dolaba ekle
    items = db.query(models.OrderItem).filter(models.OrderItem.order_id == order_id).all()
    for it in items:
        if not db.query(models.Closet).filter(
            models.Closet.user_id == user.id, models.Closet.product_id == it.product_id).first():
            db.add(models.Closet(user_id=user.id, product_id=it.product_id))
    db.commit()
    return {"ok": True}

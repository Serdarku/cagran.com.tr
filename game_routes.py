from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from auth import get_current_user
from datetime import datetime, timedelta
import random

router = APIRouter(tags=["game"])

DILIMLER = ["100 TL", "500 TL", "2000 TL", "10000 TL", "X2", "BOŞ"]

def bugun(db, user_id):
    return datetime.utcnow().date()

@router.get("/daily-quest")
def get_quests(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Bugünün görevlerini getir, yoksa oluştur."""
    today = bugun(db, user.id)
    quests = db.query(models.DailyQuest).filter(
        models.DailyQuest.user_id == user.id,
        models.DailyQuest.date >= datetime.combine(today, datetime.min.time())).all()
    if not quests:
        for qtype, reward in [("like5", 500), ("comment2", 1000), ("add_cart1", 200)]:
            db.add(models.DailyQuest(user_id=user.id, quest_type=qtype, reward=reward))
        db.commit()
        quests = db.query(models.DailyQuest).filter(
            models.DailyQuest.user_id == user.id,
            models.DailyQuest.date >= datetime.combine(today, datetime.min.time())).all()
    hepsi = all(q.completed for q in quests)
    return {"quests": [{"id": q.id, "type": q.quest_type, "completed": q.completed,
                         "reward": q.reward} for q in quests],
            "all_done": hepsi,
            "badge": "🏆 Günlük Uzman" if hepsi else None}

@router.post("/spin-wheel")
def spin(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Günde 1 kez çark çevirme."""
    today = bugun(db, user.id)
    spun = db.query(models.SpinResult).filter(
        models.SpinResult.user_id == user.id,
        models.SpinResult.date >= datetime.combine(today, datetime.min.time())).first()
    if spun:
        raise HTTPException(400, "Bugün zaten çevirdin! Yarın tekrar gel 🎡")
    result = random.choice(DILIMLER)
    kazanc = 0
    if result == "X2":
        kazanc = user.virtual_balance  # Bakiye iki katına çıkar
        user.virtual_balance *= 2
    elif result != "BOŞ":
        kazanc = int(result.split(" ")[0])
        user.virtual_balance += kazanc
    db.add(models.SpinResult(user_id=user.id, result=result))
    db.commit()
    return {"result": result, "won": kazanc, "balance": user.virtual_balance}

@router.post("/bargain")
def bargain(data: schemas.BargainSchema, user: models.User = Depends(get_current_user),
            db: Session = Depends(get_db)):
    """Pazarlık algoritması: %70 altı red, %70-85 pazarlık, %85-95 kabul, %95+ red."""
    p = db.query(models.Product).filter(models.Product.id == data.product_id).first()
    if not p:
        raise HTTPException(404, "Ürün yok")
    ratio = data.offer / p.price * 100
    if ratio < 70:
        return {"accepted": False, "counter": None,
                "message": "Kurtarmaz kardeşim! Bu fiyata malı bile çıkmaz 😤"}
    elif ratio < 85:
        counter = round(p.price * 0.9, 2)
        return {"accepted": False, "counter": counter,
                "message": f"Olur mu öyle şey? {counter:.0f} TL ver, el sıkışalım 🤝"}
    elif ratio <= 95:
        item = db.query(models.CartItem).filter(
            models.CartItem.user_id == user.id,
            models.CartItem.product_id == data.product_id).first()
        if item:
            item.bargained_price = data.offer
        db.commit()
        return {"accepted": True, "counter": None,
                "message": "Tamam, senin hatırına! Sepetteki fiyat güncellendi 😎"}
    else:
        return {"accepted": False, "counter": None,
                "message": "Zaten indirimli bu fiyat! Daha ne istiyorsun? 😅"}

@router.post("/gift")
def gift(data: schemas.GiftSchema, user: models.User = Depends(get_current_user),
         db: Session = Depends(get_db)):
    """Arkadaşa sanal hediye gönder."""
    friend = db.query(models.Friend).filter(
        models.Friend.user_id == user.id,
        models.Friend.friend_id == data.friend_id).first()
    if not friend:
        raise HTTPException(400, "Bu kişi arkadaşın değil!")
    p = db.query(models.Product).filter(models.Product.id == data.product_id).first()
    if user.virtual_balance < p.price:
        raise HTTPException(402, "Bakiye yetersiz!")
    user.virtual_balance -= p.price
    friend_user = db.query(models.User).filter(models.User.id == data.friend_id).first()
    friend_user.virtual_balance += p.price  # Hediye parasını karşı tarafa aktar
    friend.gift_sent = True
    db.commit()
    return {"ok": True, "balance": user.virtual_balance}

@router.get("/profile/{user_id}")
def get_profile(user_id: int, user: models.User = Depends(get_current_user),
                db: Session = Depends(get_db)):
    target = db.query(models.User).filter(models.User.id == user_id).first()
    if not target:
        raise HTTPException(404, "Kullanıcı yok")
    closet = db.query(models.Closet).filter(models.Closet.user_id == user_id).all()
    review_count = db.query(models.Review).filter(models.Review.user_id == user_id).count()
    view_count = db.query(models.Product).count()  # Basitleştirilmiş rozet kriteri
    friends = db.query(models.Friend).filter(models.Friend.user_id == user_id).all()
    quests_today = db.query(models.DailyQuest).filter(
        models.DailyQuest.user_id == user_id).all()
    badges = []
    if view_count >= 100: badges.append("👀 Ürün Avcısı (100 ürün inceledi)")
    if review_count >= 50: badges.append("✍️ Kritik Deha (50 yorum)")
    if review_count >= 1: badges.append("🗣️ İlk Yorum")
    if all(q.completed for q in quests_today) and quests_today:
        badges.append("🏆 Günlük Uzman")
    return {"username": target.username, "avatar_emoji": target.avatar_emoji,
            "virtual_balance": target.virtual_balance,
            "virtual_card_last4": target.virtual_card_last4,
            "closet": [{"id": c.id, "name": db.query(models.Product).filter(
                models.Product.id == c.product_id).first().name,
                "image_url": db.query(models.Product).filter(
                models.Product.id == c.product_id).first().image_url} for c in closet],
            "badges": badges,
            "friends": [{"id": f.friend_id, "username": db.query(models.User).filter(
                models.User.id == f.friend_id).first().username,
                "avatar": db.query(models.User).filter(
                models.User.id == f.friend_id).first().avatar_emoji,
                "gift_sent": f.gift_sent} for f in friends]}

@router.put("/profile/{user_id}")
def update_profile(user_id: int, data: schemas.ProfileUpdate,
                   user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user.id != user_id:
        raise HTTPException(403, "Sadece kendi profilini düzenleyebilirsin!")
    if data.avatar_emoji: user.avatar_emoji = data.avatar_emoji
    if data.email: user.email = data.email
    db.commit()
    return {"ok": True}

@router.get("/friends")
def list_friends(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    friends = db.query(models.Friend).filter(models.Friend.user_id == user.id).all()
    return [{"friend_id": f.friend_id,
              "username": db.query(models.User).filter(models.User.id == f.friend_id).first().username,
              "avatar": db.query(models.User).filter(models.User.id == f.friend_id).first().avatar_emoji,
              "gift_sent": f.gift_sent} for f in friends]

@router.post("/friends")
def add_friend(data: schemas.FriendAdd, user: models.User = Depends(get_current_user),
               db: Session = Depends(get_db)):
    if data.friend_id == user.id:
        raise HTTPException(400, "Kendine arkadaşlık isteği atamazsın 😅")
    if not db.query(models.User).filter(models.User.id == data.friend_id).first():
        raise HTTPException(404, "Kullanıcı yok")
    if db.query(models.Friend).filter(models.Friend.user_id == user.id,
                                      models.Friend.friend_id == data.friend_id).first():
        raise HTTPException(400, "Zaten arkadaşsınız!")
    db.add(models.Friend(user_id=user.id, friend_id=data.friend_id))
    db.add(models.Friend(user_id=data.friend_id, friend_id=user.id))  # Karşılıklı
    db.commit()
    return {"ok": True}

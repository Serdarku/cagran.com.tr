from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
def register(data: schemas.RegisterSchema, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.username == data.username).first():
        raise HTTPException(400, "Bu kullanıcı adı alınmış!")
    user = models.User(
        username=data.username, email=data.email,
        password_hash=hash_password(data.password),
        avatar_emoji=data.avatar_emoji,
        virtual_balance=1000,  # Hoş geldin hediyesi: 1000 sanal TL
        virtual_card_last4=f"{hash(data.username) % 10000:04d}",
    )
    db.add(user); db.commit(); db.refresh(user)
    return {"token": create_access_token({"user_id": user.id}), "user": schemas.UserOut.model_validate(user)}

@router.post("/login")
def login(data: schemas.LoginSchema, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == data.username).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(401, "Kullanıcı adı veya şifre hatalı!")
    return {"token": create_access_token({"user_id": user.id}), "user": schemas.UserOut.model_validate(user)}

from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, Header
from sqlalchemy.orm import Session
from database import get_db
import models

SECRET_KEY = "boscuzdan-gizli-anahtar-2026"  # Üretimde environment variable kullan!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(p): return pwd_context.hash(p)
def verify_password(p, h): return pwd_context.verify(p, h)

def create_access_token(data: dict):
    to_encode = data.copy()
    to_encode["exp"] = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    # JWT token'dan giriş yapmış kullanıcıyı bulur
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Giriş yapmalısın!")
    try:
        payload = jwt.decode(authorization.split(" ")[1], SECRET_KEY, algorithms=[ALGORITHM])
        user = db.query(models.User).filter(models.User.id == payload["user_id"]).first()
        if not user:
            raise HTTPException(401, "Kullanıcı bulunamadı!")
        return user
    except JWTError:
        raise HTTPException(401, "Geçersiz token!")

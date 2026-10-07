from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class RegisterSchema(BaseModel):
    username: str
    email: str
    password: str
    avatar_emoji: str = "🙂"

class LoginSchema(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    virtual_balance: float
    virtual_card_last4: str
    avatar_emoji: str
    class Config: from_attributes = True

class ReviewCreate(BaseModel):
    rating: int
    comment: str

class CartAdd(BaseModel):
    product_id: int
    variant_id: Optional[int] = None
    quantity: int = 1

class CartUpdate(BaseModel):
    quantity: int

class PaymentSchema(BaseModel):
    shipping_address: str

class ReturnSchema(BaseModel):
    reason: str

class BargainSchema(BaseModel):
    product_id: int
    offer: float

class GiftSchema(BaseModel):
    friend_id: int
    product_id: int

class ProfileUpdate(BaseModel):
    avatar_emoji: Optional[str] = None
    email: Optional[str] = None

class FriendAdd(BaseModel):
    friend_id: int

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    virtual_balance = Column(Float, default=0)          # Sanal bakiye (gerçek para DEĞİL!)
    virtual_card_last4 = Column(String, default="0000") # Sistem üretimi sahte kart
    avatar_emoji = Column(String, default="🙂")
    created_at = Column(DateTime, default=datetime.utcnow)

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    price = Column(Float, nullable=False)
    category = Column(String)          # Elektronik, Giyim, Kozmetik, Ev, Mizahi
    brand = Column(String)
    image_url = Column(String)
    stock = Column(Integer, default=100)
    rating_avg = Column(Float, default=4.5)
    is_flash = Column(Boolean, default=False)
    flash_discount = Column(Float, default=0)   # % indirim
    flash_end_time = Column(DateTime, nullable=True)
    views = Column(Integer, default=0)
    views_now = Column(Integer, default=5)      # "X kişi inceliyor" sayacı

class ProductVariant(Base):
    __tablename__ = "product_variants"
    id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    variant_type = Column(String)      # "Renk", "Beden" vb.
    variant_value = Column(String)     # "Kırmızı", "XL" vb.
    additional_price = Column(Float, default=0)

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    rating = Column(Integer)           # 1-5
    comment = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class CartItem(Base):
    __tablename__ = "cart_items"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    variant_id = Column(Integer, ForeignKey("product_variants.id"), nullable=True)
    quantity = Column(Integer, default=1)
    bargained_price = Column(Float, nullable=True)  # Pazarlıkla indirilen fiyat

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    total_amount = Column(Float)
    status = Column(String, default="Hazırlanıyor")  # Hazırlanıyor/Kargoya Verildi/Yolda/Teslim Edildi
    tracking_number = Column(String)
    shipping_address = Column(String)
    order_date = Column(DateTime, default=datetime.utcnow)
    delivery_date = Column(DateTime, nullable=True)

class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)
    unit_price = Column(Float)

class Return(Base):
    __tablename__ = "returns"
    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    reason = Column(String)
    status = Column(String, default="İncelemede")    # İncelemede/Onaylandı/İade Edildi
    request_date = Column(DateTime, default=datetime.utcnow)
    refund_date = Column(DateTime, nullable=True)

class DailyQuest(Base):
    __tablename__ = "daily_quests"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    quest_type = Column(String)        # "like5", "comment2", "add_cart1"
    completed = Column(Boolean, default=False)
    reward = Column(Float, default=0)
    date = Column(DateTime, default=datetime.utcnow)

class Friend(Base):
    __tablename__ = "friends"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    friend_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String, default="Kabul Edildi")
    gift_sent = Column(Boolean, default=False)
    gift_received = Column(Boolean, default=False)

class Closet(Base):  # "Sanal Dolabım"
    __tablename__ = "closet"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    added_at = Column(DateTime, default=datetime.utcnow)

class SpinResult(Base):  # Günlük çark takibi
    __tablename__ = "spin_results"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime, default=datetime.utcnow)
    result = Column(String)

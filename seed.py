from faker import Faker
import random
from datetime import datetime, timedelta
from database import SessionLocal, engine, Base
import models
from auth import hash_password

fake = Faker("tr_TR")
random.seed(42)

# Mizahi ürün havuzu — BoşCüzdan'ın ruhu burada 😄
MIZAHI_URUNLER = [
    ("Görünmez Takım Elbise", 999999, "Giyince kimse görmüyor. Yorumlar da yok zaten, gören yok."),
    ("Yat Kiralama (Hayali)", 45000, "Hafta sonu Marmaris'te hayali yatınız hazır. Fotoğraf çektirip story atın."),
    ("Dertsiz Baş", 5000, "TÜKENDİ! Çok talep vardı. Derdi olanlar alamadı maalesef."),
    ("Pazartesi Motivasyonu", 250, "Şişe içinde bir tutam 'yeni haftaya hazırım' hissi."),
    ("Komşunun WiFi Şifresi", 350, "Garantili değil ama denemeye değer."),
    ("Uyku Borcu Ödeme Planı", 780, "3 taksitli uyku. Faizi sabah uyanamama şeklinde işler."),
    ("Saç Dökülme Önleyici (Terk)", 499, "Kullanıldıktan sonra saçlarınız 'terk ettiğiniz hayallerinize' döner."),
    ("Egzoz Sesi Simülatörü", 899, "Araban yok mu? Problem değil. Telefonu cama daya."),
]

KATEGORILER = ["Elektronik", "Giyim", "Kozmetik", "Ev"]
EMOJILER = ["😎", "🦄", "🐺", "🦊", "🐸", "🐼", "🐯", "🦁", "🐨", "🐰", "🐹", "🐙", "🦖", "👾", "🤖", "👻"]
URUN_IKONLARI = ["📱", "💻", "🎧", "⌚", "👟", "👕", "🧥", "💄", "🧴", "🕯️", "🛋️", "🍳", "🪴", "🧺", "🎮"]

def seed():
    Base.metadata.drop_all(engine)   # Temiz başla
    Base.metadata.create_all(engine)
    db = SessionLocal()

    # 50 kullanıcı (Türkçe isimler, rastgele emoji + 1.000-15.000 TL sahte bakiye)
    users = []
    for i in range(50):
        u = models.User(
            username=fake.unique.user_name(),
            email=fake.unique.email(),
            password_hash=hash_password("sifre123"),
            virtual_balance=random.randint(1000, 15000),
            virtual_card_last4=f"{random.randint(1000,9999)}",
            avatar_emoji=random.choice(EMOJILER),
        )
        db.add(u); users.append(u)
    db.commit()

    # 100 ürün (92 normal + 8 mizahi)
    products = []
    for i in range(92):
        cat = random.choice(KATEGORILER)
        p = models.Product(
            name=f"{fake.word().capitalize()} {random.choice(['Pro', 'Max', 'Ultra', 'Lite', 'X'])}",
            description=fake.sentence(nb_words=10),
            price=round(random.uniform(50, 20000), 2),
            category=cat,
            brand=fake.company(),
            image_url=f"https://picsum.photos/seed/bos{i}/400/400",
            stock=random.randint(0, 200),
            rating_avg=round(random.uniform(2.0, 5.0), 1),
            views_now=random.randint(2, 20),
        )
        db.add(p); products.append(p)

    for name, price, desc in MIZAHI_URUNLER:
        p = models.Product(
            name=name, description=desc, price=price, category="Mizahi",
            brand="BoşCüzdan Originals",
            image_url=f"https://picsum.photos/seed/miz{abs(hash(name))%100}/400/400",
            stock=0 if "TÜKENDİ" in desc else random.randint(1, 50),
            rating_avg=4.8, views_now=random.randint(2, 20),
        )
        db.add(p); products.append(p)
    db.commit()

    # Her ürüne varyantlar (renk/beden)
    for p in products:
        for renk in random.sample(["Kırmızı", "Mavi", "Siyah", "Beyaz", "Yeşil"], k=random.randint(1, 3)):
            db.add(models.ProductVariant(product_id=p.id, variant_type="Renk",
                                         variant_value=renk, additional_price=0))
        if p.category == "Giyim":
            for beden in ["S", "M", "L", "XL"]:
                db.add(models.ProductVariant(product_id=p.id, variant_type="Beden",
                                             variant_value=beden, additional_price=random.choice([0, 50, 100])))
    db.commit()

    # 200 Türkçe yorum
    yorumlar = [
        "Fiyatına göre fena değil, tavsiye ederim.",
        "Beklediğimden kaliteli çıktı, teşekkürler!",
        "Kargo hızlıydı ama paketleme kötüydü.",
        "Tavsiye etmem, pişman oldum.",
        "İnanılmaz güzel, herkese aldım 😄",
        "Fiyat/performans ürünü, gayet iyi.",
        "İkinci kez alıyorum, memnunum.",
        "Resimdekinden farklı geldi, dikkat!",
    ]
    for _ in range(200):
        p = random.choice(products)
        db.add(models.Review(
            user_id=random.choice(users).id, product_id=p.id,
            rating=random.randint(1, 5),
            comment=random.choice(yorumlar),
            created_at=datetime.utcnow() - timedelta(days=random.randint(0, 90)),
        ))
    db.commit()

    # İlk kullanıcıyı demo kullanıcı yap (frontend'de kolay giriş için)
    demo = users[0]
    demo.username = "demo"
    demo.password_hash = hash_password("demo123")
    db.commit()
    print("✅ Seed tamamlandı! Demo giriş: demo / demo123")
    db.close()

if __name__ == "__main__":
    seed()

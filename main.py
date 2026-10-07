from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth_routes, product_routes, cart_routes, order_routes, game_routes

# Tabloları oluştur (yoksa)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="🪙 BoşCüzdan API", description="Tamamen eğlence amaçlı sanal alışveriş simülasyonu!")

# React frontend'den gelen isteklere izin ver
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://senin-siten.vercel.app"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(product_routes.router)
app.include_router(cart_routes.router)
app.include_router(order_routes.router)
app.include_router(game_routes.router)

@app.get("/")
def root():
    return {"msg": "🪙 BoşCüzdan API çalışıyor! Gerçek para YOK, eğlence VAR 😄"}
________________________________________
5 & 6 & 7. FRONTEND

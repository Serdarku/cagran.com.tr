from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite veritabanı — dosya tabanlı, kurulum gerektirmez
SQLALCHEMY_DATABASE_URL = "sqlite:///./boscuzdan.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Her istekte bağımsız oturum üretmek için
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

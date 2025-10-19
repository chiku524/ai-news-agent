# Database Models and Configuration
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# Database URL - supports multiple providers
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ai_news_agent.db")

# For Cloudflare, we'll use D1 (SQLite-compatible) or external DB
if os.getenv("CLOUDFLARE_D1_DATABASE_ID"):
    # Cloudflare D1 Database
    DATABASE_URL = f"sqlite:///d1://{os.getenv('CLOUDFLARE_D1_DATABASE_ID')}"
elif os.getenv("DATABASE_URL"):
    # External database (PostgreSQL, MySQL, etc.)
    DATABASE_URL = os.getenv("DATABASE_URL")
else:
    # Local SQLite for development
    DATABASE_URL = "sqlite:///./ai_news_agent.db"

# Create engine
engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# User Model
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True)  # OAuth provider user ID
    email = Column(String, unique=True, index=True)
    name = Column(String)
    picture = Column(String)
    provider = Column(String)  # google, github, twitter
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    # User preferences
    preferences = Column(JSON, default=dict)
    interests = Column(JSON, default=list)
    reading_history = Column(JSON, default=list)

# News Article Model
class NewsArticle(Base):
    __tablename__ = "news_articles"
    
    id = Column(Integer, primary_key=True, index=True)
    article_id = Column(String, unique=True, index=True)
    title = Column(String)
    url = Column(String)
    source = Column(String)
    published_at = Column(DateTime)
    summary = Column(Text)
    image_url = Column(String)
    categories = Column(JSON, default=list)
    tags = Column(JSON, default=list)
    relevance_score = Column(String, default="0.0")
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

# User Reading History Model
class UserReadingHistory(Base):
    __tablename__ = "user_reading_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    article_id = Column(String, index=True)
    read_at = Column(DateTime, default=datetime.utcnow)
    time_spent = Column(Integer, default=0)  # seconds
    rating = Column(Integer)  # 1-5 stars

# Create tables
def create_tables():
    Base.metadata.create_all(bind=engine)

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# User CRUD operations
class UserService:
    @staticmethod
    def create_user(db, user_data: dict):
        user = User(
            user_id=user_data["id"],
            email=user_data["email"],
            name=user_data["name"],
            picture=user_data.get("picture"),
            provider=user_data["provider"]
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def get_user_by_id(db, user_id: str):
        return db.query(User).filter(User.user_id == user_id).first()
    
    @staticmethod
    def get_user_by_email(db, email: str):
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def update_user_last_login(db, user_id: str):
        user = db.query(User).filter(User.user_id == user_id).first()
        if user:
            user.last_login = datetime.utcnow()
            db.commit()
        return user
    
    @staticmethod
    def update_user_preferences(db, user_id: str, preferences: dict):
        user = db.query(User).filter(User.user_id == user_id).first()
        if user:
            user.preferences = preferences
            db.commit()
        return user

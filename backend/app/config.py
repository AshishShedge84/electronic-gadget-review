import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "pbl-secret-dev-key-2026")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "pbl-jwt-dev-key-2026")
    JWT_EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", 24))
    
    # Primary: PostgreSQL 18. Fallback: SQLite for seamless standalone running if PG is offline.
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://ashishmac@localhost:5433/gadget_reviews")
    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # NLP & AI Settings
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    LLM_API_KEY = os.getenv("LLM_API_KEY", "")
    
    UPLOAD_FOLDER = BASE_DIR / "uploads"
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max upload

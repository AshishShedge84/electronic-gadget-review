from datetime import datetime, timedelta
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
from flask import current_app
from ..models import db, User, Role

class AuthService:
    @staticmethod
    def register_user(name: str, email: str, password: str, role_name: str = "USER") -> dict:
        email = email.strip().lower()
        if User.query.filter_by(email=email).first():
            raise ValueError("An account with this email address already exists.")

        role = Role.query.filter_by(name=role_name.upper()).first()
        if not role:
            # Default to USER if specified role doesn't exist
            role = Role.query.filter_by(name="USER").first()
            if not role:
                role = Role(name="USER")
                db.session.add(role)
                db.session.flush()

        password_hash = generate_password_hash(password)
        user = User(
            name=name.strip(),
            email=email,
            password_hash=password_hash,
            role_id=role.id
        )
        db.session.add(user)
        db.session.commit()

        token = AuthService.generate_token(user)
        return {
            "user": user.to_dict(),
            "token": token
        }

    @staticmethod
    def authenticate_user(email: str, password: str) -> dict:
        email = email.strip().lower()
        user = User.query.filter_by(email=email).first()
        if not user or not check_password_hash(user.password_hash, password):
            raise ValueError("Invalid email or password.")

        token = AuthService.generate_token(user)
        return {
            "user": user.to_dict(),
            "token": token
        }

    @staticmethod
    def generate_token(user: User) -> str:
        expiry_hours = current_app.config.get("JWT_EXPIRATION_HOURS", 24)
        payload = {
            "user_id": user.id,
            "email": user.email,
            "role": user.role.name if user.role else "USER",
            "exp": datetime.utcnow() + timedelta(hours=expiry_hours),
            "iat": datetime.utcnow()
        }
        return jwt.encode(payload, current_app.config["JWT_SECRET_KEY"], algorithm="HS256")

from functools import wraps
import jwt
from flask import request, jsonify, current_app
from ..models import User

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"status": "error", "message": "Missing authentication token in Authorization header."}), 401
        
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return jsonify({"status": "error", "message": "Invalid token header format. Use 'Bearer <token>'."}), 401
        
        token = parts[1]
        try:
            payload = jwt.decode(token, current_app.config["JWT_SECRET_KEY"], algorithms=["HS256"])
            user_id = payload.get("user_id")
            user = User.query.get(user_id)
            if not user:
                return jsonify({"status": "error", "message": "User associated with token no longer exists."}), 401
            request.current_user = user
        except jwt.ExpiredSignatureError:
            return jsonify({"status": "error", "message": "Authentication token has expired. Please log in again."}), 401
        except Exception as e:
            return jsonify({"status": "error", "message": "Invalid authentication token."}), 401

        return f(*args, **kwargs)
    return decorated

def role_required(*allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            user = getattr(request, "current_user", None)
            if not user or not user.role:
                return jsonify({"status": "error", "message": "Authentication required."}), 401
            
            user_role = user.role.name.upper()
            allowed = [r.upper() for r in allowed_roles]
            if user_role not in allowed and "ADMIN" not in user_role:
                return jsonify({
                    "status": "error",
                    "message": f"Access denied. Requires one of roles: {', '.join(allowed)}. Your role is {user_role}."
                }), 403

            return f(*args, **kwargs)
        return decorated
    return decorator

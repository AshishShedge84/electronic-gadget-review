from flask import Blueprint, request
from ..services.auth_service import AuthService
from ..utils.helpers import api_response, error_response
from ..utils.decorators import token_required

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "USER")

    if not name or not email or not password:
        return error_response("Name, email, and password are required.", 400)

    if len(password) < 6:
        return error_response("Password must be at least 6 characters long.", 400)

    try:
        res = AuthService.register_user(name, email, password, role)
        return api_response(res, "User registered successfully.", 201)
    except ValueError as ve:
        return error_response(str(ve), 400)
    except Exception as e:
        return error_response("Registration failed due to a server error.", 500, str(e))

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return error_response("Email and password are required.", 400)

    try:
        res = AuthService.authenticate_user(email, password)
        return api_response(res, "Login successful.")
    except ValueError as ve:
        return error_response(str(ve), 401)
    except Exception as e:
        return error_response("Authentication failed due to a server error.", 500, str(e))

@auth_bp.route("/me", methods=["GET"])
@token_required
def get_current_user():
    user = getattr(request, "current_user")
    return api_response(user.to_dict(), "Current user profile.")

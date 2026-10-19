from flask import Blueprint, request
from ..models import db, User, Role, Product, Review, ReviewAnalysis, Aspect, Keyword, Topic, Summary
from ..utils.helpers import api_response, error_response
from ..utils.decorators import token_required, role_required

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

@admin_bp.route("/users", methods=["GET"])
@token_required
@role_required("ADMIN")
def list_users():
    users = User.query.order_by(User.id.asc()).all()
    return api_response([u.to_dict() for u in users], "Users retrieved.")

@admin_bp.route("/users/<int:user_id>/role", methods=["PUT"])
@token_required
@role_required("ADMIN")
def update_user_role(user_id):
    data = request.get_json() or {}
    role_name = data.get("role")
    if not role_name:
        return error_response("Field 'role' is required.", 400)

    user = User.query.get(user_id)
    if not user:
        return error_response("User not found.", 404)

    role = Role.query.filter_by(name=role_name.upper()).first()
    if not role:
        return error_response(f"Role '{role_name}' does not exist.", 400)

    user.role_id = role.id
    db.session.commit()
    return api_response(user.to_dict(), f"User {user.name} role updated to {role.name}.")

@admin_bp.route("/system-stats", methods=["GET"])
@token_required
@role_required("ADMIN")
def get_system_stats():
    stats = {
        "users_count": User.query.count(),
        "products_count": Product.query.count(),
        "reviews_count": Review.query.count(),
        "analyses_count": ReviewAnalysis.query.count(),
        "aspects_count": Aspect.query.count(),
        "keywords_count": Keyword.query.count(),
        "topics_count": Topic.query.count(),
        "summaries_count": Summary.query.count(),
        "database_engine": str(db.engine.url.drivername),
        "status": "Operational"
    }
    return api_response(stats, "Enterprise system operational statistics.")

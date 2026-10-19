from flask import Blueprint, request
from ..services.product_service import ProductService
from ..models import Category
from ..utils.helpers import api_response, error_response
from ..utils.decorators import token_required, role_required

product_bp = Blueprint("products", __name__, url_prefix="/api")

@product_bp.route("/products", methods=["GET"])
def list_products():
    search = request.args.get("search")
    category_id = request.args.get("category_id", type=int)
    brand = request.args.get("brand")
    sort_by = request.args.get("sort_by", "name")
    sort_dir = request.args.get("sort_dir", "asc")

    products = ProductService.list_products(search, category_id, brand, sort_by, sort_dir)
    return api_response(products, "Products retrieved successfully.")

@product_bp.route("/products/<int:product_id>", methods=["GET"])
def get_product(product_id):
    product = ProductService.get_product_by_id(product_id)
    if not product:
        return error_response("Product not found.", 404)
    return api_response(product, "Product details retrieved.")

@product_bp.route("/products", methods=["POST"])
@token_required
@role_required("ADMIN", "ANALYST")
def create_product():
    data = request.get_json() or {}
    try:
        product = ProductService.create_product(data)
        return api_response(product, "Product created successfully.", 201)
    except ValueError as ve:
        return error_response(str(ve), 400)
    except Exception as e:
        return error_response("Failed to create product.", 500, str(e))

@product_bp.route("/products/<int:product_id>", methods=["PUT"])
@token_required
@role_required("ADMIN")
def update_product(product_id):
    data = request.get_json() or {}
    try:
        product = ProductService.update_product(product_id, data)
        return api_response(product, "Product updated successfully.")
    except ValueError as ve:
        return error_response(str(ve), 400)
    except Exception as e:
        return error_response("Failed to update product.", 500, str(e))

@product_bp.route("/products/<int:product_id>", methods=["DELETE"])
@token_required
@role_required("ADMIN")
def delete_product(product_id):
    try:
        ProductService.delete_product(product_id)
        return api_response(None, "Product deleted successfully.")
    except ValueError as ve:
        return error_response(str(ve), 404)
    except Exception as e:
        return error_response("Failed to delete product.", 500, str(e))

@product_bp.route("/categories", methods=["GET"])
def list_categories():
    categories = Category.query.all()
    return api_response([c.to_dict() for c in categories], "Categories retrieved.")

from flask import Blueprint, request
from ..services.analytics_service import AnalyticsService
from ..utils.helpers import api_response, error_response

comparison_bp = Blueprint("comparison", __name__, url_prefix="/api")

@comparison_bp.route("/products/compare", methods=["POST"])
def compare_products():
    data = request.get_json() or {}
    product_ids = data.get("product_ids", [])
    if not isinstance(product_ids, list) or len(product_ids) < 2:
        return error_response("Please provide at least 2 product IDs in 'product_ids' array.", 400)

    try:
        comparison_res = AnalyticsService.compare_products(product_ids)
        return api_response(comparison_res, "Product comparative analysis generated successfully.")
    except ValueError as ve:
        return error_response(str(ve), 400)
    except Exception as e:
        return error_response("Comparative analysis failed.", 500, str(e))

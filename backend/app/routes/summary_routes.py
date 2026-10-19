from flask import Blueprint, request
from ..services.summary_service import SummaryService
from ..utils.helpers import api_response, error_response
from ..utils.decorators import token_required, role_required

summary_bp = Blueprint("summaries", __name__, url_prefix="/api")

@summary_bp.route("/summaries/<int:product_id>", methods=["GET"])
def get_summary(product_id):
    try:
        summary = SummaryService.get_or_generate_summary(product_id, force=False)
        return api_response(summary, "Product summary retrieved.")
    except ValueError as ve:
        return error_response(str(ve), 404)
    except Exception as e:
        return error_response("Failed to retrieve summary.", 500, str(e))

@summary_bp.route("/summaries/<int:product_id>/generate", methods=["POST"])
@token_required
@role_required("ADMIN", "ANALYST")
def regenerate_summary(product_id):
    try:
        summary = SummaryService.get_or_generate_summary(product_id, force=True)
        return api_response(summary, "Product summary generated successfully.")
    except ValueError as ve:
        return error_response(str(ve), 404)
    except Exception as e:
        return error_response("Failed to generate summary.", 500, str(e))

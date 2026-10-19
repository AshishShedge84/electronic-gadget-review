from flask import Blueprint, request
from ..services.review_service import ReviewService
from ..models import db, Review
from ..utils.helpers import api_response, error_response
from ..utils.decorators import token_required, role_required

review_bp = Blueprint("reviews", __name__, url_prefix="/api")

@review_bp.route("/reviews", methods=["GET"])
def list_reviews():
    product_id = request.args.get("product_id", type=int)
    rating = request.args.get("rating", type=int)
    sentiment = request.args.get("sentiment")
    aspect = request.args.get("aspect")
    search = request.args.get("search")
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)

    data = ReviewService.get_reviews(product_id, rating, sentiment, aspect, search, page, per_page)
    return api_response(data, "Reviews retrieved successfully.")

@review_bp.route("/reviews", methods=["POST"])
@token_required
def create_review():
    data = request.get_json() or {}
    product_id = data.get("product_id")
    review_text = data.get("review_text")
    rating = data.get("rating")
    reviewer_name = data.get("reviewer_name") or getattr(request.current_user, "name", "User")
    source = data.get("source", "Web Platform")
    review_date = data.get("review_date")

    if not product_id or not review_text or rating is None:
        return error_response("Product ID, review text, and rating are required.", 400)

    try:
        new_review = ReviewService.create_review(
            product_id=product_id,
            review_text=review_text,
            rating=rating,
            reviewer_name=reviewer_name,
            source=source,
            review_date=review_date
        )
        return api_response(new_review, "Review submitted and analyzed successfully.", 201)
    except ValueError as ve:
        return error_response(str(ve), 400)
    except Exception as e:
        return error_response("Failed to submit review.", 500, str(e))

@review_bp.route("/reviews/import-csv", methods=["POST"])
@token_required
@role_required("ADMIN", "ANALYST")
def import_csv():
    if "file" not in request.files:
        return error_response("No CSV file provided in upload request.", 400)

    file = request.files["file"]
    if not file.filename.lower().endswith(".csv"):
        return error_response("Only .csv files are supported.", 400)

    product_id = request.form.get("product_id", type=int)

    try:
        file_bytes = file.read()
        result = ReviewService.batch_import_csv(file_bytes, product_id_override=product_id)
        return api_response(result, f"Import complete: {result['imported_count']} reviews imported, {result['rejected_count']} rejected.")
    except ValueError as ve:
        return error_response(str(ve), 400)
    except Exception as e:
        return error_response("Failed to process CSV file.", 500, str(e))

@review_bp.route("/reviews/<int:review_id>", methods=["DELETE"])
@token_required
@role_required("ADMIN")
def delete_review(review_id):
    review = Review.query.get(review_id)
    if not review:
        return error_response("Review not found.", 404)
    pid = review.product_id
    db.session.delete(review)
    db.session.commit()
    # Refresh product artifacts
    ReviewService.update_product_nlp_artifacts(pid)
    return api_response(None, "Review deleted successfully.")

@review_bp.route("/reviews/reprocess-product/<int:product_id>", methods=["POST"])
@token_required
@role_required("ADMIN", "ANALYST")
def reprocess_product_reviews(product_id):
    reviews = Review.query.filter_by(product_id=product_id).all()
    for r in reviews:
        ReviewService.process_single_review(r)
    ReviewService.update_product_nlp_artifacts(product_id)
    return api_response({"reprocessed_count": len(reviews)}, f"Reprocessed {len(reviews)} reviews for product {product_id}.")

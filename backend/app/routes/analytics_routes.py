from flask import Blueprint, request
from ..services.analytics_service import AnalyticsService
from ..nlp.preprocessor import preprocess_text
from ..nlp.sentiment_engine import analyze_sentiment
from ..nlp.aspect_extractor import extract_aspect_sentiments
from ..utils.helpers import api_response, error_response

analytics_bp = Blueprint("analytics", __name__, url_prefix="/api")

@analytics_bp.route("/dashboard", methods=["GET"])
def get_dashboard():
    data = AnalyticsService.get_dashboard_metrics()
    return api_response(data, "Dashboard metrics retrieved.")

@analytics_bp.route("/analytics/sentiment", methods=["GET"])
def get_sentiment_analytics():
    data = AnalyticsService.get_dashboard_metrics()
    return api_response({
        "sentiment_distribution": data["sentiment_distribution"],
        "positive_percentage": data["positive_percentage"],
        "negative_percentage": data["negative_percentage"],
        "neutral_percentage": data["neutral_percentage"],
    }, "Sentiment analytics retrieved.")

@analytics_bp.route("/analytics/aspects", methods=["GET"])
def get_aspect_analytics():
    data = AnalyticsService.get_dashboard_metrics()
    return api_response({
        "aspect_sentiments": data["aspect_sentiments"],
        "most_mentioned_aspect": data["most_mentioned_aspect"],
        "most_positive_aspect": data["most_positive_aspect"],
        "most_negative_aspect": data["most_negative_aspect"],
    }, "Aspect analytics retrieved.")

@analytics_bp.route("/analytics/keywords", methods=["GET"])
def get_keyword_analytics():
    data = AnalyticsService.get_dashboard_metrics()
    return api_response({
        "top_keywords": data["top_keywords"]
    }, "Keyword analytics retrieved.")

@analytics_bp.route("/analytics/trends", methods=["GET"])
def get_trend_analytics():
    data = AnalyticsService.get_dashboard_metrics()
    return api_response({
        "review_trend": data["review_trend"]
    }, "Trend analytics retrieved.")

@analytics_bp.route("/products/<int:product_id>/analytics", methods=["GET"])
def get_product_analytics(product_id):
    data = AnalyticsService.get_product_analytics(product_id)
    if not data:
        return error_response("Product not found.", 404)
    return api_response(data, "Product analytics retrieved.")

@analytics_bp.route("/nlp/preprocess-demo", methods=["POST"])
def nlp_preprocess_demo():
    """
    Interactive ASTMA demonstration endpoint.
    Accepts arbitrary text and returns transparent breakdown of each pipeline step:
    Raw -> Cleaned -> Tokenized -> Stopwords Removed -> Stemmed -> Sentiment -> Aspects.
    """
    body = request.get_json() or {}
    text = body.get("text", "")
    if not text:
        return error_response("Text input is required for NLP preprocessing demonstration.", 400)

    preprocessed = preprocess_text(text)
    sentiment = analyze_sentiment(preprocessed["cleaned_text"] or text)
    aspects = extract_aspect_sentiments(text)

    return api_response({
        "pipeline_stages": {
            "1_raw_text": preprocessed["raw_text"],
            "2_cleaned_text": preprocessed["cleaned_text"],
            "3_tokens": preprocessed["tokens"],
            "4_filtered_tokens": preprocessed["filtered_tokens"],
            "5_stemmed_tokens": preprocessed["stemmed_tokens"],
            "6_normalized_text": preprocessed["normalized_text"],
        },
        "sentiment_analysis": sentiment,
        "aspect_analysis": aspects,
    }, "NLP pipeline transformation complete.")

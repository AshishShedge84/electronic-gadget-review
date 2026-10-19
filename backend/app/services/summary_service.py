from collections import defaultdict
from datetime import datetime
from ..models import db, Product, Review, Summary, AspectSentiment, Aspect
from ..nlp.summarizer import generate_product_summary

class SummaryService:
    @staticmethod
    def get_or_generate_summary(product_id: int, force: bool = False):
        product = Product.query.get(product_id)
        if not product:
            raise ValueError("Product not found.")

        # Check existing summary if not forced
        if not force:
            existing = Summary.query.filter_by(product_id=product.id).order_by(Summary.generated_at.desc()).first()
            if existing:
                return existing.to_dict()

        # Collect reviews
        reviews = Review.query.filter_by(product_id=product.id).all()
        review_dicts = []
        for r in reviews:
            r_dict = {
                "review_text": r.review_text,
                "rating": r.rating,
                "sentiment": r.analysis.sentiment if r.analysis else "Neutral"
            }
            review_dicts.append(r_dict)

        # Aggregate aspects for the product
        aspect_aggregates = defaultdict(lambda: {"positive_count": 0, "negative_count": 0, "neutral_count": 0})
        for r in reviews:
            for asp in r.aspect_sentiments:
                asp_name = asp.aspect.name if asp.aspect else "General"
                if asp.sentiment == "Positive":
                    aspect_aggregates[asp_name]["positive_count"] += 1
                elif asp.sentiment == "Negative":
                    aspect_aggregates[asp_name]["negative_count"] += 1
                else:
                    aspect_aggregates[asp_name]["neutral_count"] += 1

        summary_data = generate_product_summary(
            product_name=product.name,
            reviews=review_dicts,
            aspect_aggregates=dict(aspect_aggregates)
        )

        summary_obj = Summary(
            product_id=product.id,
            summary=summary_data.get("summary", ""),
            positive_points=summary_data.get("positive_points", []),
            negative_points=summary_data.get("negative_points", []),
            common_complaints=summary_data.get("common_complaints", []),
            strengths=summary_data.get("strengths", []),
            weaknesses=summary_data.get("weaknesses", []),
            aspect_summary=summary_data.get("aspect_summary", {}),
            overall_sentiment=summary_data.get("overall_sentiment", "Neutral"),
            is_ai_generated=summary_data.get("is_ai_generated", False),
            generated_at=datetime.utcnow()
        )
        db.session.add(summary_obj)
        db.session.commit()

        return summary_obj.to_dict()

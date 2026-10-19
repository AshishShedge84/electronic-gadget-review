from collections import defaultdict
from sqlalchemy import func
from ..models import db, Product, Review, ReviewAnalysis, Aspect, AspectSentiment, Keyword, Topic

class AnalyticsService:
    @staticmethod
    def get_dashboard_metrics():
        total_products = Product.query.count()
        total_reviews = Review.query.count()

        if total_reviews == 0:
            return {
                "total_products": total_products,
                "total_reviews": 0,
                "average_rating": 0.0,
                "positive_percentage": 0.0,
                "negative_percentage": 0.0,
                "neutral_percentage": 0.0,
                "rating_distribution": [{"rating": r, "count": 0} for r in range(1, 6)],
                "sentiment_distribution": [
                    {"name": "Positive", "value": 0, "color": "#10b981"},
                    {"name": "Negative", "value": 0, "color": "#ef4444"},
                    {"name": "Neutral", "value": 0, "color": "#6b7280"}
                ],
                "review_trend": [],
                "aspect_sentiments": [],
                "most_mentioned_aspect": "None",
                "most_positive_aspect": "None",
                "most_negative_aspect": "None",
                "top_keywords": []
            }

        # Average rating
        avg_rating = db.session.query(func.avg(Review.rating)).scalar() or 0.0
        
        # Rating distribution
        ratings_data = db.session.query(Review.rating, func.count(Review.id))\
            .group_by(Review.rating).all()
        rating_counts = {r: 0 for r in range(1, 6)}
        for r, cnt in ratings_data:
            if r in rating_counts:
                rating_counts[r] = cnt
        rating_dist = [{"rating": f"{r} Stars", "count": rating_counts[r]} for r in range(1, 6)]

        # Sentiment distribution
        sentiments_data = db.session.query(ReviewAnalysis.sentiment, func.count(ReviewAnalysis.id))\
            .group_by(ReviewAnalysis.sentiment).all()
        sent_counts = {"Positive": 0, "Negative": 0, "Neutral": 0}
        for s_label, cnt in sentiments_data:
            if s_label in sent_counts:
                sent_counts[s_label] = cnt

        total_analyzed = sum(sent_counts.values()) or total_reviews
        pos_pct = round((sent_counts["Positive"] / total_analyzed) * 100, 1)
        neg_pct = round((sent_counts["Negative"] / total_analyzed) * 100, 1)
        neu_pct = round((sent_counts["Neutral"] / total_analyzed) * 100, 1)

        sentiment_dist = [
            {"name": "Positive", "value": sent_counts["Positive"], "color": "#10b981"},
            {"name": "Negative", "value": sent_counts["Negative"], "color": "#ef4444"},
            {"name": "Neutral", "value": sent_counts["Neutral"], "color": "#6b7280"}
        ]

        # Review Trend over time
        trends_query = db.session.query(
            Review.review_date,
            ReviewAnalysis.sentiment,
            func.count(Review.id)
        ).outerjoin(ReviewAnalysis, Review.id == ReviewAnalysis.review_id)\
         .group_by(Review.review_date, ReviewAnalysis.sentiment)\
         .order_by(Review.review_date.asc()).all()

        timeline_map = defaultdict(lambda: {"date": "", "Positive": 0, "Negative": 0, "Neutral": 0, "total": 0})
        for r_date, sent, cnt in trends_query:
            d_str = r_date.strftime("%b %Y") if r_date else "Recent"
            timeline_map[d_str]["date"] = d_str
            sent_key = sent if sent in {"Positive", "Negative", "Neutral"} else "Neutral"
            timeline_map[d_str][sent_key] += cnt
            timeline_map[d_str]["total"] += cnt

        review_trend = list(timeline_map.values())

        # Aspect Sentiments
        aspects_query = db.session.query(
            Aspect.name,
            AspectSentiment.sentiment,
            func.count(AspectSentiment.id)
        ).join(AspectSentiment, Aspect.id == AspectSentiment.aspect_id)\
         .group_by(Aspect.name, AspectSentiment.sentiment).all()

        aspect_map = defaultdict(lambda: {"aspect": "", "Positive": 0, "Negative": 0, "Neutral": 0, "total": 0})
        for asp_name, sent, cnt in aspects_query:
            aspect_map[asp_name]["aspect"] = asp_name
            sent_key = sent if sent in {"Positive", "Negative", "Neutral"} else "Neutral"
            aspect_map[asp_name][sent_key] += cnt
            aspect_map[asp_name]["total"] += cnt

        aspect_sentiments = list(aspect_map.values())
        aspect_sentiments.sort(key=lambda x: x["total"], reverse=True)

        most_mentioned = aspect_sentiments[0]["aspect"] if aspect_sentiments else "N/A"
        
        # Most positive aspect (highest positive ratio with at least 1 mention)
        pos_sorted = sorted(
            [a for a in aspect_sentiments if a["total"] > 0],
            key=lambda x: (x["Positive"] / x["total"], x["Positive"]),
            reverse=True
        )
        most_positive = pos_sorted[0]["aspect"] if pos_sorted else "N/A"

        # Most negative aspect
        neg_sorted = sorted(
            [a for a in aspect_sentiments if a["total"] > 0],
            key=lambda x: (x["Negative"] / x["total"], x["Negative"]),
            reverse=True
        )
        most_negative = neg_sorted[0]["aspect"] if neg_sorted else "N/A"

        # Top keywords from keywords table
        keywords = db.session.query(
            Keyword.keyword,
            func.sum(Keyword.frequency).label("total_freq"),
            func.avg(Keyword.score).label("avg_score")
        ).group_by(Keyword.keyword).order_by(func.sum(Keyword.frequency).desc()).limit(15).all()

        top_keywords = [
            {"keyword": kw, "frequency": int(freq), "score": round(float(sc), 4)}
            for kw, freq, sc in keywords
        ]

        return {
            "total_products": total_products,
            "total_reviews": total_reviews,
            "average_rating": round(float(avg_rating), 2),
            "positive_percentage": pos_pct,
            "negative_percentage": neg_pct,
            "neutral_percentage": neu_pct,
            "rating_distribution": rating_dist,
            "sentiment_distribution": sentiment_dist,
            "review_trend": review_trend,
            "aspect_sentiments": aspect_sentiments[:10],
            "most_mentioned_aspect": most_mentioned,
            "most_positive_aspect": most_positive,
            "most_negative_aspect": most_negative,
            "top_keywords": top_keywords
        }

    @staticmethod
    def get_product_analytics(product_id: int):
        product = Product.query.get(product_id)
        if not product:
            return None

        reviews = Review.query.filter_by(product_id=product.id).all()
        total_reviews = len(reviews)
        if total_reviews == 0:
            return {
                "product": product.to_dict(),
                "total_reviews": 0,
                "average_rating": 0.0,
                "sentiment_distribution": [],
                "aspect_sentiments": [],
                "keywords": [],
                "topics": []
            }

        avg_rating = sum(r.rating for r in reviews) / total_reviews

        # Sentiment breakdown
        sent_counts = {"Positive": 0, "Negative": 0, "Neutral": 0}
        for r in reviews:
            if r.analysis:
                sent_counts[r.analysis.sentiment] = sent_counts.get(r.analysis.sentiment, 0) + 1

        sentiment_dist = [
            {"name": "Positive", "value": sent_counts["Positive"], "color": "#10b981"},
            {"name": "Negative", "value": sent_counts["Negative"], "color": "#ef4444"},
            {"name": "Neutral", "value": sent_counts["Neutral"], "color": "#6b7280"}
        ]

        # Aspects for this product
        aspect_map = defaultdict(lambda: {"aspect": "", "Positive": 0, "Negative": 0, "Neutral": 0, "total": 0})
        for r in reviews:
            for asp in r.aspect_sentiments:
                aspect_name = asp.aspect.name if asp.aspect else "General"
                aspect_map[aspect_name]["aspect"] = aspect_name
                aspect_map[aspect_name][asp.sentiment] += 1
                aspect_map[aspect_name]["total"] += 1

        aspect_sentiments = list(aspect_map.values())
        aspect_sentiments.sort(key=lambda x: x["total"], reverse=True)

        # Keywords for this product
        keywords = Keyword.query.filter_by(product_id=product.id).order_by(Keyword.score.desc()).limit(15).all()
        # Topics for this product
        topics = Topic.query.filter_by(product_id=product.id).all()

        return {
            "product": product.to_dict(),
            "total_reviews": total_reviews,
            "average_rating": round(avg_rating, 2),
            "sentiment_distribution": sentiment_dist,
            "aspect_sentiments": aspect_sentiments,
            "keywords": [k.to_dict() for k in keywords],
            "topics": [t.to_dict() for t in topics]
        }

    @staticmethod
    def compare_products(product_ids: list):
        if not product_ids or len(product_ids) < 2:
            raise ValueError("Select at least 2 products for comparative intelligence.")

        comparison_data = []
        for pid in product_ids:
            p = Product.query.get(pid)
            if not p:
                continue
            analytics = AnalyticsService.get_product_analytics(p.id)
            summary_obj = p.summaries.order_by(db.desc("generated_at")).first()
            
            p_data = {
                "id": p.id,
                "name": p.name,
                "brand": p.brand,
                "price": float(p.price) if p.price else 0.0,
                "category": p.category.name if p.category else "Electronics",
                "average_rating": analytics["average_rating"],
                "total_reviews": analytics["total_reviews"],
                "sentiment_distribution": analytics["sentiment_distribution"],
                "aspect_sentiments": analytics["aspect_sentiments"],
                "top_keywords": [k["keyword"] for k in analytics["keywords"][:6]],
                "strengths": summary_obj.strengths if summary_obj else [],
                "weaknesses": summary_obj.weaknesses if summary_obj else [],
                "positive_percentage": 0.0,
                "negative_percentage": 0.0
            }
            
            # Positive %
            tot_sent = sum(item["value"] for item in analytics["sentiment_distribution"])
            if tot_sent > 0:
                pos_val = next((item["value"] for item in analytics["sentiment_distribution"] if item["name"] == "Positive"), 0)
                neg_val = next((item["value"] for item in analytics["sentiment_distribution"] if item["name"] == "Negative"), 0)
                p_data["positive_percentage"] = round((pos_val / tot_sent) * 100, 1)
                p_data["negative_percentage"] = round((neg_val / tot_sent) * 100, 1)

            comparison_data.append(p_data)

        if len(comparison_data) < 2:
            raise ValueError("Could not find sufficient products to generate comparison.")

        # Compute Decision Support Insights mathematically
        best_rated = max(comparison_data, key=lambda x: x["average_rating"])
        best_sentiment = max(comparison_data, key=lambda x: x["positive_percentage"])

        decision_support = {
            "better_rated": {
                "product_name": best_rated["name"],
                "rating": best_rated["average_rating"],
                "rationale": f"Leads with an average verified rating of {best_rated['average_rating']}/5 across {best_rated['total_reviews']} reviews."
            },
            "better_sentiment": {
                "product_name": best_sentiment["name"],
                "positive_pct": best_sentiment["positive_percentage"],
                "rationale": f"Secured the highest customer satisfaction score with {best_sentiment['positive_percentage']}% positive review polarity."
            },
            "key_differences": [],
            "strength_areas": {},
            "weakness_areas": {}
        }

        # Compare aspects between the products
        for prod in comparison_data:
            decision_support["strength_areas"][prod["name"]] = prod["strengths"][:3]
            decision_support["weakness_areas"][prod["name"]] = prod["weaknesses"][:3]

        if len(comparison_data) == 2:
            p1, p2 = comparison_data[0], comparison_data[1]
            diff_rating = round(p1["average_rating"] - p2["average_rating"], 2)
            diff_sent = round(p1["positive_percentage"] - p2["positive_percentage"], 1)
            diff_price = round(p1["price"] - p2["price"], 2)

            diff_points = [
                f"{p1['name']} is rated {p1['average_rating']} vs {p2['name']} at {p2['average_rating']} (difference of {abs(diff_rating)}).",
                f"Customer sentiment favorability: {p1['name']} ({p1['positive_percentage']}%) vs {p2['name']} ({p2['positive_percentage']}%).",
                f"Price point: {p1['name']} (${p1['price']}) vs {p2['name']} (${p2['price']})."
            ]
            decision_support["key_differences"] = diff_points

        return {
            "products": comparison_data,
            "decision_support": decision_support
        }

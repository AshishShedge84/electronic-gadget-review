import io
import csv
from datetime import datetime
import pandas as pd
from sqlalchemy import func
from ..models import db, Review, ReviewAnalysis, Product, Category, Aspect, AspectSentiment, Keyword, Topic
from ..nlp.preprocessor import preprocess_text
from ..nlp.sentiment_engine import analyze_sentiment
from ..nlp.aspect_extractor import extract_aspect_sentiments
from ..nlp.keyword_extractor import extract_keywords_from_corpus
from ..nlp.topic_modeler import extract_topics

class ReviewService:
    @staticmethod
    def process_single_review(review: Review):
        """
        Runs the full ASTMA NLP pipeline on an individual review:
        1. Text Preprocessing (Clean, Normalize, Tokenize)
        2. VADER Sentiment Analysis
        3. Aspect-Based Extraction and Local Sentiment Scoring
        """
        prep = preprocess_text(review.review_text)
        cleaned_text = prep["cleaned_text"]

        # 2. Sentiment Engine
        sentiment_res = analyze_sentiment(cleaned_text or review.review_text)

        # Upsert ReviewAnalysis
        if review.analysis:
            review.analysis.cleaned_text = cleaned_text
            review.analysis.sentiment = sentiment_res["sentiment"]
            review.analysis.sentiment_score = sentiment_res["sentiment_score"]
            review.analysis.processed_at = datetime.utcnow()
        else:
            analysis = ReviewAnalysis(
                review_id=review.id,
                cleaned_text=cleaned_text,
                sentiment=sentiment_res["sentiment"],
                sentiment_score=sentiment_res["sentiment_score"],
                processed_at=datetime.utcnow()
            )
            db.session.add(analysis)

        # 3. Aspect-Based Sentiment Analysis (ABSA)
        # Clear existing aspect links for this review
        AspectSentiment.query.filter_by(review_id=review.id).delete()
        
        detected_aspects = extract_aspect_sentiments(review.review_text)
        for asp_info in detected_aspects:
            aspect_name = asp_info["aspect"]
            # Ensure Aspect exists in DB
            aspect_rec = Aspect.query.filter_by(name=aspect_name).first()
            if not aspect_rec:
                aspect_rec = Aspect(name=aspect_name)
                db.session.add(aspect_rec)
                db.session.flush()

            asp_sentiment = AspectSentiment(
                review_id=review.id,
                aspect_id=aspect_rec.id,
                sentiment=asp_info["sentiment"],
                score=asp_info["score"]
            )
            db.session.add(asp_sentiment)

        db.session.commit()

    @staticmethod
    def create_review(product_id: int, review_text: str, rating: int, reviewer_name="Anonymous Customer", source="Manual Entry", review_date=None):
        if not review_text or not review_text.strip():
            raise ValueError("Review text is required.")
        try:
            rating = int(rating)
            if rating < 1 or rating > 5:
                raise ValueError()
        except Exception:
            raise ValueError("Rating must be an integer between 1 and 5.")

        product = Product.query.get(product_id)
        if not product:
            raise ValueError("Product not found.")

        parsed_date = datetime.utcnow().date()
        if review_date:
            try:
                parsed_date = datetime.strptime(str(review_date), "%Y-%m-%d").date()
            except Exception:
                pass

        review = Review(
            product_id=product.id,
            review_text=review_text.strip(),
            rating=rating,
            reviewer_name=reviewer_name.strip() if reviewer_name else "Anonymous Customer",
            source=source.strip() if source else "Web",
            review_date=parsed_date
        )
        db.session.add(review)
        db.session.commit()

        # Execute NLP pipeline
        ReviewService.process_single_review(review)
        # Update product aggregate artifacts (keywords, topics)
        ReviewService.update_product_nlp_artifacts(product.id)

        return review.to_dict()

    @staticmethod
    def update_product_nlp_artifacts(product_id: int):
        """
        Recomputes TF-IDF keywords and topic models across all reviews of a product.
        """
        reviews = Review.query.filter_by(product_id=product_id).all()
        texts = [r.review_text for r in reviews if r.review_text]
        if not texts:
            return

        # 1. Keywords via TF-IDF
        Keyword.query.filter_by(product_id=product_id).delete()
        keywords_data = extract_keywords_from_corpus(texts, top_n=20)
        for kw in keywords_data:
            k_obj = Keyword(
                product_id=product_id,
                keyword=kw["keyword"],
                frequency=kw["frequency"],
                score=kw["score"]
            )
            db.session.add(k_obj)

        # 2. Topics via Clustering
        Topic.query.filter_by(product_id=product_id).delete()
        topics_data = extract_topics(texts, n_topics=4)
        for tp in topics_data:
            t_obj = Topic(
                product_id=product_id,
                topic=tp["topic"],
                description=tp["description"],
                score=tp["score"]
            )
            db.session.add(t_obj)

        db.session.commit()

    @staticmethod
    def batch_import_csv(file_bytes: bytes, product_id_override=None):
        """
        Processes and imports reviews from CSV data with thorough error reporting.
        Expected/Supported columns:
        product_name, category, review_text, rating, review_date, reviewer_name, source
        """
        try:
            df = pd.read_csv(io.BytesIO(file_bytes))
        except Exception as e:
            raise ValueError(f"Unable to parse CSV file: {str(e)}")

        # Normalize column names
        df.columns = [str(c).strip().lower().replace(" ", "_") for c in df.columns]

        # Check required field
        if "review_text" not in df.columns:
            raise ValueError("CSV must contain a 'review_text' column.")

        total_rows = len(df)
        imported_count = 0
        rejections = []

        products_to_update = set()

        for idx, row in df.iterrows():
            row_num = idx + 2  # 1-indexed header offset
            review_text = str(row.get("review_text", "")).strip()
            
            if not review_text or review_text.lower() == "nan":
                rejections.append({"row": row_num, "reason": "Missing or empty review text."})
                continue

            # Rating validation
            try:
                rating = int(float(row.get("rating", 5)))
                if rating < 1 or rating > 5:
                    rejections.append({"row": row_num, "reason": f"Rating {rating} outside valid 1-5 range."})
                    continue
            except Exception:
                rejections.append({"row": row_num, "reason": "Invalid non-numeric rating value."})
                continue

            # Determine product
            product = None
            if product_id_override:
                product = Product.query.get(product_id_override)
            elif "product_name" in row and pd.notna(row["product_name"]) and str(row["product_name"]).strip():
                p_name = str(row["product_name"]).strip()
                product = Product.query.filter(Product.name.ilike(p_name)).first()
                if not product:
                    # Create product if not existing
                    cat_name = str(row.get("category", "Other Electronics")).strip()
                    category = Category.query.filter(Category.name.ilike(cat_name)).first()
                    if not category:
                        category = Category(name=cat_name)
                        db.session.add(category)
                        db.session.flush()
                    
                    product = Product(
                        name=p_name,
                        brand="General",
                        category_id=category.id,
                        description=f"Auto-imported product {p_name}"
                    )
                    db.session.add(product)
                    db.session.flush()

            if not product:
                rejections.append({"row": row_num, "reason": "Could not identify or associate a valid product."})
                continue

            # Parse date safely
            review_date = datetime.utcnow().date()
            if "review_date" in row and pd.notna(row["review_date"]):
                try:
                    review_date = pd.to_datetime(row["review_date"]).date()
                except Exception:
                    pass

            reviewer_name = str(row.get("reviewer_name", "Anonymous Customer")).strip()
            source = str(row.get("source", "CSV Import")).strip()

            # Prevent duplicate review text for the same product
            duplicate = Review.query.filter_by(product_id=product.id, review_text=review_text).first()
            if duplicate:
                rejections.append({"row": row_num, "reason": "Duplicate review text already exists for this product."})
                continue

            review = Review(
                product_id=product.id,
                review_text=review_text,
                rating=rating,
                review_date=review_date,
                reviewer_name=reviewer_name if reviewer_name != "nan" else "Anonymous Customer",
                source=source if source != "nan" else "CSV Import"
            )
            db.session.add(review)
            db.session.flush()

            # Process through NLP pipeline
            ReviewService.process_single_review(review)
            imported_count += 1
            products_to_update.add(product.id)

        db.session.commit()

        # Update TF-IDF keywords and topics for affected products
        for pid in products_to_update:
            ReviewService.update_product_nlp_artifacts(pid)

        return {
            "total_rows": total_rows,
            "imported_count": imported_count,
            "rejected_count": len(rejections),
            "rejections": rejections
        }

    @staticmethod
    def get_reviews(product_id=None, rating=None, sentiment=None, aspect=None, search=None, page=1, per_page=20):
        query = Review.query

        if product_id:
            query = query.filter(Review.product_id == product_id)

        if rating:
            query = query.filter(Review.rating == rating)

        if search:
            query = query.filter(Review.review_text.ilike(f"%{search.strip()}%"))

        if sentiment:
            query = query.join(ReviewAnalysis).filter(ReviewAnalysis.sentiment.ilike(sentiment))

        if aspect:
            query = query.join(AspectSentiment).join(Aspect).filter(Aspect.name.ilike(aspect))

        query = query.order_by(Review.created_at.desc())

        total = query.count()
        reviews = query.offset((page - 1) * per_page).limit(per_page).all()

        return {
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": (total + per_page - 1) // per_page if per_page else 1,
            "reviews": [r.to_dict() for r in reviews]
        }

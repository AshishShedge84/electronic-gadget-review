from sqlalchemy import func
from ..models import db, Product, Category, Review, ReviewAnalysis

class ProductService:
    @staticmethod
    def list_products(search=None, category_id=None, brand=None, sort_by="name", sort_dir="asc"):
        query = Product.query

        if search:
            search_term = f"%{search.strip()}%"
            query = query.filter(
                (Product.name.ilike(search_term)) | 
                (Product.brand.ilike(search_term)) | 
                (Product.description.ilike(search_term))
            )

        if category_id:
            query = query.filter(Product.category_id == category_id)

        if brand:
            query = query.filter(Product.brand.ilike(f"%{brand.strip()}%"))

        products = query.all()
        result = []

        for p in products:
            p_dict = p.to_dict()
            
            # Compute live rating and sentiment aggregates
            reviews = Review.query.filter_by(product_id=p.id).all()
            review_count = len(reviews)
            if review_count > 0:
                avg_rating = sum(r.rating for r in reviews) / review_count
                
                # Sentiment counts
                analyses = [r.analysis for r in reviews if r.analysis]
                pos_count = sum(1 for a in analyses if a.sentiment == "Positive")
                neg_count = sum(1 for a in analyses if a.sentiment == "Negative")
                neu_count = sum(1 for a in analyses if a.sentiment == "Neutral")
                
                if pos_count > neg_count and pos_count >= neg_count:
                    sentiment = "Positive"
                elif neg_count > pos_count:
                    sentiment = "Negative"
                else:
                    sentiment = "Neutral"

                p_dict["review_count"] = review_count
                p_dict["average_rating"] = round(avg_rating, 2)
                p_dict["overall_sentiment"] = sentiment
                p_dict["sentiment_counts"] = {"positive": pos_count, "negative": neg_count, "neutral": neu_count}
            else:
                p_dict["review_count"] = 0
                p_dict["average_rating"] = 0.0
                p_dict["overall_sentiment"] = "Neutral"
                p_dict["sentiment_counts"] = {"positive": 0, "negative": 0, "neutral": 0}

            result.append(p_dict)

        # In-memory sorting
        reverse = (sort_dir.lower() == "desc")
        if sort_by == "rating":
            result.sort(key=lambda x: x["average_rating"], reverse=reverse)
        elif sort_by == "reviews":
            result.sort(key=lambda x: x["review_count"], reverse=reverse)
        elif sort_by == "price":
            result.sort(key=lambda x: x["price"], reverse=reverse)
        else:
            result.sort(key=lambda x: x["name"].lower(), reverse=reverse)

        return result

    @staticmethod
    def get_product_by_id(product_id: int):
        product = Product.query.get(product_id)
        if not product:
            return None
        
        p_dict = product.to_dict()
        reviews = Review.query.filter_by(product_id=product.id).all()
        review_count = len(reviews)
        if review_count > 0:
            avg_rating = sum(r.rating for r in reviews) / review_count
            analyses = [r.analysis for r in reviews if r.analysis]
            pos_count = sum(1 for a in analyses if a.sentiment == "Positive")
            neg_count = sum(1 for a in analyses if a.sentiment == "Negative")
            neu_count = sum(1 for a in analyses if a.sentiment == "Neutral")
            
            p_dict["review_count"] = review_count
            p_dict["average_rating"] = round(avg_rating, 2)
            p_dict["sentiment_counts"] = {"positive": pos_count, "negative": neg_count, "neutral": neu_count}
            p_dict["overall_sentiment"] = "Positive" if pos_count > neg_count else ("Negative" if neg_count > pos_count else "Neutral")
        else:
            p_dict["review_count"] = 0
            p_dict["average_rating"] = 0.0
            p_dict["sentiment_counts"] = {"positive": 0, "negative": 0, "neutral": 0}
            p_dict["overall_sentiment"] = "Neutral"
            
        return p_dict

    @staticmethod
    def create_product(data: dict):
        name = data.get("name", "").strip()
        brand = data.get("brand", "").strip()
        category_id = data.get("category_id")
        description = data.get("description", "").strip()
        price = data.get("price", 0.0)

        if not name or not brand or not category_id:
            raise ValueError("Product name, brand, and category are required.")

        category = Category.query.get(category_id)
        if not category:
            raise ValueError("Specified category does not exist.")

        product = Product(
            name=name,
            brand=brand,
            category_id=category_id,
            description=description,
            price=price
        )
        db.session.add(product)
        db.session.commit()
        return product.to_dict()

    @staticmethod
    def update_product(product_id: int, data: dict):
        product = Product.query.get(product_id)
        if not product:
            raise ValueError("Product not found.")

        if "name" in data and data["name"].strip():
            product.name = data["name"].strip()
        if "brand" in data and data["brand"].strip():
            product.brand = data["brand"].strip()
        if "category_id" in data and data["category_id"]:
            product.category_id = data["category_id"]
        if "description" in data:
            product.description = data["description"]
        if "price" in data:
            product.price = data["price"]

        db.session.commit()
        return product.to_dict()

    @staticmethod
    def delete_product(product_id: int):
        product = Product.query.get(product_id)
        if not product:
            raise ValueError("Product not found.")
        db.session.delete(product)
        db.session.commit()
        return True

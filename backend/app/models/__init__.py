from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Role(db.Model):
    __tablename__ = "roles"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    users = db.relationship("User", back_populates="role", lazy="dynamic")

    def to_dict(self):
        return {"id": self.id, "name": self.name}


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey("roles.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    role = db.relationship("Role", back_populates="users")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role.name if self.role else "USER",
            "role_id": self.role_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)

    products = db.relationship("Product", back_populates="category", lazy="dynamic")

    def to_dict(self):
        return {"id": self.id, "name": self.name}


class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(180), nullable=False, index=True)
    brand = db.Column(db.String(100), nullable=False, index=True)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Numeric(10, 2), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    category = db.relationship("Category", back_populates="products")
    reviews = db.relationship("Review", back_populates="product", cascade="all, delete-orphan", lazy="dynamic")
    keywords = db.relationship("Keyword", back_populates="product", cascade="all, delete-orphan", lazy="dynamic")
    topics = db.relationship("Topic", back_populates="product", cascade="all, delete-orphan", lazy="dynamic")
    summaries = db.relationship("Summary", back_populates="product", cascade="all, delete-orphan", lazy="dynamic")

    def to_dict(self, include_stats=False):
        data = {
            "id": self.id,
            "name": self.name,
            "brand": self.brand,
            "category_id": self.category_id,
            "category_name": self.category.name if self.category else "Other Electronics",
            "description": self.description,
            "price": float(self.price) if self.price is not None else 0.0,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
        return data


class Review(db.Model):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False, index=True)
    review_text = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1 to 5
    review_date = db.Column(db.Date, nullable=True)
    source = db.Column(db.String(100), default="Online Platform")
    reviewer_name = db.Column(db.String(120), default="Anonymous Customer")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    product = db.relationship("Product", back_populates="reviews")
    analysis = db.relationship("ReviewAnalysis", back_populates="review", uselist=False, cascade="all, delete-orphan")
    aspect_sentiments = db.relationship("AspectSentiment", back_populates="review", cascade="all, delete-orphan", lazy="dynamic")

    def to_dict(self):
        analysis_data = self.analysis.to_dict() if self.analysis else None
        aspects_data = [asp.to_dict() for asp in self.aspect_sentiments.all()]
        return {
            "id": self.id,
            "product_id": self.product_id,
            "product_name": self.product.name if self.product else "",
            "review_text": self.review_text,
            "rating": self.rating,
            "review_date": self.review_date.isoformat() if self.review_date else None,
            "source": self.source,
            "reviewer_name": self.reviewer_name,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "analysis": analysis_data,
            "aspects": aspects_data,
        }


class ReviewAnalysis(db.Model):
    __tablename__ = "review_analysis"

    id = db.Column(db.Integer, primary_key=True)
    review_id = db.Column(db.Integer, db.ForeignKey("reviews.id"), unique=True, nullable=False, index=True)
    cleaned_text = db.Column(db.Text, nullable=False)
    sentiment = db.Column(db.String(20), nullable=False)  # Positive, Negative, Neutral
    sentiment_score = db.Column(db.Float, nullable=False)  # Compound score [-1.0 to 1.0]
    processed_at = db.Column(db.DateTime, default=datetime.utcnow)

    review = db.relationship("Review", back_populates="analysis")

    def to_dict(self):
        return {
            "id": self.id,
            "review_id": self.review_id,
            "cleaned_text": self.cleaned_text,
            "sentiment": self.sentiment,
            "sentiment_score": round(self.sentiment_score, 4),
            "processed_at": self.processed_at.isoformat() if self.processed_at else None,
        }


class Aspect(db.Model):
    __tablename__ = "aspects"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)

    aspect_sentiments = db.relationship("AspectSentiment", back_populates="aspect", lazy="dynamic")

    def to_dict(self):
        return {"id": self.id, "name": self.name}


class AspectSentiment(db.Model):
    __tablename__ = "aspect_sentiments"

    id = db.Column(db.Integer, primary_key=True)
    review_id = db.Column(db.Integer, db.ForeignKey("reviews.id"), nullable=False, index=True)
    aspect_id = db.Column(db.Integer, db.ForeignKey("aspects.id"), nullable=False, index=True)
    sentiment = db.Column(db.String(20), nullable=False)  # Positive, Negative, Neutral
    score = db.Column(db.Float, nullable=False)

    review = db.relationship("Review", back_populates="aspect_sentiments")
    aspect = db.relationship("Aspect", back_populates="aspect_sentiments")

    def to_dict(self):
        return {
            "id": self.id,
            "review_id": self.review_id,
            "aspect_id": self.aspect_id,
            "aspect": self.aspect.name if self.aspect else "",
            "sentiment": self.sentiment,
            "score": round(self.score, 4),
        }


class Keyword(db.Model):
    __tablename__ = "keywords"

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False, index=True)
    keyword = db.Column(db.String(100), nullable=False)
    frequency = db.Column(db.Integer, default=1)
    score = db.Column(db.Float, nullable=False)  # TF-IDF weight

    product = db.relationship("Product", back_populates="keywords")

    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "keyword": self.keyword,
            "frequency": self.frequency,
            "score": round(self.score, 4),
        }


class Topic(db.Model):
    __tablename__ = "topics"

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False, index=True)
    topic = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    score = db.Column(db.Float, default=1.0)

    product = db.relationship("Product", back_populates="topics")

    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "topic": self.topic,
            "description": self.description,
            "score": round(self.score, 4),
        }


class Summary(db.Model):
    __tablename__ = "summaries"

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False, index=True)
    summary = db.Column(db.Text, nullable=False)
    positive_points = db.Column(db.JSON, default=list)
    negative_points = db.Column(db.JSON, default=list)
    common_complaints = db.Column(db.JSON, default=list)
    strengths = db.Column(db.JSON, default=list)
    weaknesses = db.Column(db.JSON, default=list)
    aspect_summary = db.Column(db.JSON, default=dict)
    overall_sentiment = db.Column(db.String(20), default="Neutral")
    is_ai_generated = db.Column(db.Boolean, default=False)
    generated_at = db.Column(db.DateTime, default=datetime.utcnow)

    product = db.relationship("Product", back_populates="summaries")

    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "product_name": self.product.name if self.product else "",
            "summary": self.summary,
            "positive_points": self.positive_points or [],
            "negative_points": self.negative_points or [],
            "common_complaints": self.common_complaints or [],
            "strengths": self.strengths or [],
            "weaknesses": self.weaknesses or [],
            "aspect_summary": self.aspect_summary or {},
            "overall_sentiment": self.overall_sentiment,
            "is_ai_generated": self.is_ai_generated,
            "generated_at": self.generated_at.isoformat() if self.generated_at else None,
        }

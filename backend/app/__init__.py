import os
from flask import Flask, jsonify
from flask_cors import CORS
from .config import Config
from .models import db

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize CORS for local and cross-origin requests
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Database initialization with automatic resilient fallback
    try:
        db.init_app(app)
        with app.app_context():
            # Test connection
            db.engine.connect()
    except Exception as e:
        print(f"[WARN] Primary Database connection failed ({e}). Falling back to SQLite for local reliability.")
        sqlite_fallback = "sqlite:///gadget_reviews.db"
        app.config["SQLALCHEMY_DATABASE_URI"] = sqlite_fallback
        db.init_app(app)

    # Register Blueprints
    from .routes.auth_routes import auth_bp
    from .routes.product_routes import product_bp
    from .routes.review_routes import review_bp
    from .routes.analytics_routes import analytics_bp
    from .routes.summary_routes import summary_bp
    from .routes.comparison_routes import comparison_bp
    from .routes.admin_routes import admin_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(product_bp)
    app.register_blueprint(review_bp)
    app.register_blueprint(analytics_bp)
    app.register_blueprint(summary_bp)
    app.register_blueprint(comparison_bp)
    app.register_blueprint(admin_bp)

    # Health check route
    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({
            "status": "healthy",
            "service": "Electronic Gadget Review Summarizer API",
            "version": "1.0.0",
            "database_engine": str(db.engine.url.drivername) if hasattr(db, "engine") else "unknown"
        }), 200

    # Global Error Handlers
    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({"status": "error", "message": "Resource not found.", "code": 404}), 404

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({"status": "error", "message": "Internal server error.", "code": 500}), 500

    @app.errorhandler(413)
    def request_entity_too_large(error):
        return jsonify({"status": "error", "message": "File exceeds maximum upload size limit (16MB).", "code": 413}), 413

    return app

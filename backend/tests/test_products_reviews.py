import io
import pytest
from app import create_app
from app.models import db, Product, Category, Review

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        with app.app_context():
            yield client

def test_product_listing_and_retrieval(client):
    res = client.get("/api/products")
    assert res.status_code == 200
    products = res.get_json()["data"]
    assert isinstance(products, list)
    assert len(products) > 0

    first_id = products[0]["id"]
    detail_res = client.get(f"/api/products/{first_id}")
    assert detail_res.status_code == 200
    assert detail_res.get_json()["data"]["name"] == products[0]["name"]

def test_review_creation_and_pipeline(client):
    # Fetch admin token
    login_res = client.post("/api/auth/login", json={"email": "admin@gadgetintel.com", "password": "admin123"})
    token = login_res.get_json()["data"]["token"]

    prod_res = client.get("/api/products")
    first_id = prod_res.get_json()["data"][0]["id"]

    create_res = client.post("/api/reviews", json={
        "product_id": first_id,
        "review_text": "The battery endurance is stellar but low-light camera is disappointing.",
        "rating": 4,
        "reviewer_name": "Integration Tester"
    }, headers={"Authorization": f"Bearer {token}"})

    assert create_res.status_code == 201
    review_data = create_res.get_json()["data"]
    assert review_data["analysis"] is not None
    assert len(review_data["aspects"]) > 0

def test_csv_import(client):
    login_res = client.post("/api/auth/login", json={"email": "admin@gadgetintel.com", "password": "admin123"})
    token = login_res.get_json()["data"]["token"]

    csv_content = """review_id,product_name,category,review_text,rating,review_date,reviewer_name,source
999,Apex Pro 15 Ultra,Smartphones,"Screen brightness is magnificent in daylight and battery lasts long.",5,2026-10-05,CSV Tester,TestPlatform
"""
    data = {
        "file": (io.BytesIO(csv_content.encode("utf-8")), "test_reviews.csv")
    }

    res = client.post("/api/reviews/import-csv", data=data, content_type="multipart/form-data", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    assert res.get_json()["data"]["imported_count"] >= 0

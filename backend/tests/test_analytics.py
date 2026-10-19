import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        with app.app_context():
            yield client

def test_dashboard_metrics(client):
    res = client.get("/api/dashboard")
    assert res.status_code == 200
    data = res.get_json()["data"]
    assert data["total_products"] > 0
    assert data["total_reviews"] > 0
    assert data["average_rating"] > 0
    assert "rating_distribution" in data
    assert "sentiment_distribution" in data
    assert "aspect_sentiments" in data

def test_product_comparison(client):
    prod_res = client.get("/api/products")
    prods = prod_res.get_json()["data"]
    assert len(prods) >= 2
    p1_id = prods[0]["id"]
    p2_id = prods[1]["id"]

    cmp_res = client.post("/api/products/compare", json={"product_ids": [p1_id, p2_id]})
    assert cmp_res.status_code == 200
    cmp_data = cmp_res.get_json()["data"]
    assert len(cmp_data["products"]) == 2
    assert "decision_support" in cmp_data
    assert "better_rated" in cmp_data["decision_support"]
    assert "better_sentiment" in cmp_data["decision_support"]

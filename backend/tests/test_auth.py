import pytest
from app import create_app
from app.models import db, User, Role

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        with app.app_context():
            yield client

def test_user_registration_and_login(client):
    # Unique email for test
    email = "testuser_auth@gadgetintel.com"
    reg_res = client.post("/api/auth/register", json={
        "name": "Auth Tester",
        "email": email,
        "password": "password123",
        "role": "USER"
    })
    assert reg_res.status_code in [201, 400]  # 201 if first time, 400 if already exists

    # Login
    login_res = client.post("/api/auth/login", json={
        "email": email,
        "password": "password123"
    })
    assert login_res.status_code == 200
    token = login_res.get_json()["data"]["token"]
    assert token is not None

    # Protected me endpoint
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.get_json()["data"]["email"] == email

def test_invalid_login(client):
    res = client.post("/api/auth/login", json={
        "email": "nonexistent@user.com",
        "password": "wrongpassword"
    })
    assert res.status_code == 401

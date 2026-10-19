import sys
import os
from pathlib import Path
from datetime import datetime, date, timedelta

# Ensure backend path is on sys.path
backend_path = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_path))

from app import create_app
from app.models import db, Role, User, Category, Product, Review, ReviewAnalysis, Aspect, AspectSentiment, Keyword, Topic, Summary
from app.services.review_service import ReviewService
from app.services.summary_service import SummaryService
from werkzeug.security import generate_password_hash

def seed_database():
    app = create_app()
    with app.app_context():
        print("[SEED] Creating database tables...")
        db.create_all()

        # 1. Seed Roles
        roles_dict = {}
        for role_name in ["ADMIN", "ANALYST", "USER"]:
            r = Role.query.filter_by(name=role_name).first()
            if not r:
                r = Role(name=role_name)
                db.session.add(r)
                db.session.flush()
            roles_dict[role_name] = r
        print("[SEED] Roles created/verified.")

        # 2. Seed Users
        users_seed = [
            ("Admin User", "admin@gadgetintel.com", "admin123", "ADMIN"),
            ("Data Analyst", "analyst@gadgetintel.com", "analyst123", "ANALYST"),
            ("Demo Customer", "user@gadgetintel.com", "user123", "USER"),
        ]
        for name, email, pwd, r_name in users_seed:
            u = User.query.filter_by(email=email).first()
            if not u:
                u = User(
                    name=name,
                    email=email,
                    password_hash=generate_password_hash(pwd),
                    role_id=roles_dict[r_name].id
                )
                db.session.add(u)
        db.session.commit()
        print("[SEED] Demo users created/verified.")

        # 3. Seed Categories
        categories_list = [
            "Smartphones", "Laptops", "Smartwatches", "Earbuds", "Headphones",
            "Tablets", "Cameras", "Smart TVs", "Gaming Devices", "Other Electronics"
        ]
        cat_dict = {}
        for c_name in categories_list:
            c = Category.query.filter_by(name=c_name).first()
            if not c:
                c = Category(name=c_name)
                db.session.add(c)
                db.session.flush()
            cat_dict[c_name] = c
        db.session.commit()
        print("[SEED] Categories created/verified.")

        # 4. Seed Gadget Products
        products_seed = [
            {
                "name": "Apex Pro 15 Ultra",
                "brand": "NovaTech",
                "category": "Smartphones",
                "price": 999.00,
                "description": "Flagship 5G smartphone featuring a 120Hz LTPO AMOLED display, triple 50MP camera system, 5000mAh battery, and Snapdragon 8 Gen 3 chipset."
            },
            {
                "name": "ZenithBook Pro 16 M3",
                "brand": "ApexByte",
                "category": "Laptops",
                "price": 1899.00,
                "description": "Premium 16-inch creator laptop engineered with aluminum unibody build, mini-LED display, 32GB unified RAM, and high-efficiency thermal architecture."
            },
            {
                "name": "AuraPod ANC 3",
                "brand": "SoundWave",
                "category": "Earbuds",
                "price": 179.00,
                "description": "Wireless noise-cancelling earbuds equipped with customized 11mm dynamic drivers, spatial audio tracking, and ergonomic silicone ear tips."
            },
            {
                "name": "Vanguard Chrono Active 2",
                "brand": "ChronoFit",
                "category": "Smartwatches",
                "price": 299.00,
                "description": "Titanium sports smartwatch with sapphire crystal glass, continuous optical heart rate and SpO2 tracking, multi-band GPS, and 7-day battery life."
            },
            {
                "name": "SlateTab Ultra OLED",
                "brand": "PixelTech",
                "category": "Tablets",
                "price": 749.00,
                "description": "Ultra-slim 12.4-inch productivity tablet featuring vibrant OLED screen, precision stylus support, quad stereo speakers, and fast 45W charging."
            }
        ]

        prod_dict = {}
        for p_data in products_seed:
            p = Product.query.filter_by(name=p_data["name"]).first()
            if not p:
                p = Product(
                    name=p_data["name"],
                    brand=p_data["brand"],
                    category_id=cat_dict[p_data["category"]].id,
                    price=p_data["price"],
                    description=p_data["description"]
                )
                db.session.add(p)
                db.session.flush()
            prod_dict[p_data["name"]] = p
        db.session.commit()
        print("[SEED] Products created/verified.")

        # 5. Seed Diverse Reviews for Each Product
        reviews_data = [
            # Product 1: Apex Pro 15 Ultra (Smartphones)
            ("Apex Pro 15 Ultra", "The battery life is exceptional, lasting almost two full days on heavy usage. The 120Hz display is gorgeous and super smooth, though the price is slightly steep.", 5, "2026-08-10", "Michael Chen"),
            ("Apex Pro 15 Ultra", "Camera quality in low light is mind-blowing! Photos are crisp and colors look true to life. Performance is lightning fast with zero lag in heavy games.", 5, "2026-08-14", "Sarah Jenkins"),
            ("Apex Pro 15 Ultra", "Good phone overall, but the software has noticeable bloatware that cannot be uninstalled. Charging speed is fast though.", 3, "2026-08-20", "David Ross"),
            ("Apex Pro 15 Ultra", "Disappointing thermal performance. The phone overheats noticeably after 20 minutes of 4K video recording, which drains the battery very quickly.", 2, "2026-09-02", "Alex Kumar"),
            ("Apex Pro 15 Ultra", "Stunning screen and sleek industrial design. Comfortable to hold and the stereo speakers have rich audio with punchy bass.", 4, "2026-09-12", "Emma Watson"),
            ("Apex Pro 15 Ultra", "The telephoto camera lens is great for portraits. Face unlock is instant and 5G connectivity is strong everywhere.", 5, "2026-09-18", "Robert Taylor"),
            ("Apex Pro 15 Ultra", "Too expensive for what it offers. Build quality feels a bit slippery without a case, and customer support was unhelpful when my charger broke.", 2, "2026-09-25", "Daniel Martinez"),

            # Product 2: ZenithBook Pro 16 M3 (Laptops)
            ("ZenithBook Pro 16 M3", "Unbelievable processing power. Video rendering in DaVinci Resolve takes half the time. The mini-LED display is the best screen I have ever seen on a laptop.", 5, "2026-07-28", "Jessica Lee"),
            ("ZenithBook Pro 16 M3", "The aluminum build quality is top tier and the keyboard feels super comfortable. Battery endurance easily lasts 14 hours of programming.", 5, "2026-08-05", "Brian Clark"),
            ("ZenithBook Pro 16 M3", "Performance is great, but it is quite heavy to carry around every day in a backpack. Audio speakers are loud and crystal clear.", 4, "2026-08-18", "Chloe Bennett"),
            ("ZenithBook Pro 16 M3", "Thermal fans get excessively loud under heavy compile tasks. Also, the price tag is exorbitant for college students.", 2, "2026-08-27", "Vikram Patel"),
            ("ZenithBook Pro 16 M3", "Exceptional multi-tasking with 32GB RAM. Fast charging via USB-C is very convenient. Perfect machine for software engineering.", 5, "2026-09-11", "Amanda Scott"),
            ("ZenithBook Pro 16 M3", "Trackpad is responsive and spacious. However, I noticed occasional software stutter after the recent OS update.", 3, "2026-09-22", "Marcus Wright"),

            # Product 3: AuraPod ANC 3 (Earbuds)
            ("AuraPod ANC 3", "Active Noise Cancellation is stunning. It completely silences loud airplane and metro background noise. The audio bass is punchy without distorting vocals.", 5, "2026-08-01", "Olivia Green"),
            ("AuraPod ANC 3", "Comfortable fit in my ears even during long 3-hour workout sessions. Bluetooth connectivity paired instantly with my phone and laptop.", 5, "2026-08-12", "Kevin Zhao"),
            ("AuraPod ANC 3", "Sound quality is decent, but the microphone is muffled during phone calls in windy outdoor environments.", 3, "2026-08-25", "Rachel Adams"),
            ("AuraPod ANC 3", "Poor battery life. The earbuds drain completely in less than 4 hours with ANC enabled, which is well below the advertised specs.", 2, "2026-09-04", "Justin Miller"),
            ("AuraPod ANC 3", "Great compact design and charging case fits right into coin pocket. Good value for money compared to pricier rivals.", 4, "2026-09-15", "Sophia Turner"),
            ("AuraPod ANC 3", "Frequent Bluetooth disconnection issues with Android devices. Audio cuts out randomly every 15 minutes. Very frustrating.", 1, "2026-09-28", "Lucas Garcia"),

            # Product 4: Vanguard Chrono Active 2 (Smartwatches)
            ("Vanguard Chrono Active 2", "Battery backup is remarkable! I only need to charge it once a week. The GPS tracking during outdoor runs is extremely accurate.", 5, "2026-08-07", "Hannah White"),
            ("Vanguard Chrono Active 2", "Titanium build feels indestructible and sapphire screen has zero scratches after mountain climbing. Heart rate monitor is very reliable.", 5, "2026-08-22", "Carlos Mendez"),
            ("Vanguard Chrono Active 2", "Display brightness is sharp in direct sunlight. However, the companion mobile software UI feels sluggish and needs better sync.", 3, "2026-09-05", "Emily Davis"),
            ("Vanguard Chrono Active 2", "The wrist strap is uncomfortable and causes skin irritation during sweaty workouts. Sleep tracking data is inconsistent.", 2, "2026-09-16", "Tyler King"),
            ("Vanguard Chrono Active 2", "Superb health metrics and water resistance. Swam multiple laps with it and works flawlessly.", 5, "2026-09-29", "Zack Nelson"),

            # Product 5: SlateTab Ultra OLED (Tablets)
            ("SlateTab Ultra OLED", "The OLED screen is breathtaking for watching movies and reading digital comics. Stylus latency is practically zero, making note-taking wonderful.", 5, "2026-08-15", "Natalie Evans"),
            ("SlateTab Ultra OLED", "Quad audio speakers produce rich cinematic sound. Slim and lightweight design makes it effortless to hold in bed.", 4, "2026-08-29", "Derek Morgan"),
            ("SlateTab Ultra OLED", "Multitasking works well for split-screen browsing. Battery life lasts about 8 hours on moderate screen brightness.", 4, "2026-09-08", "Stephanie Hughes"),
            ("SlateTab Ultra OLED", "Software updates are slow and Android tablet app ecosystem still lags behind iPad. Charging takes over two hours.", 2, "2026-09-19", "George King"),
            ("SlateTab Ultra OLED", "Premium build quality and reasonable price for an OLED screen. Highly recommended for students and designers.", 5, "2026-10-01", "Priya Sharma"),
        ]

        print(f"[SEED] Ingesting and processing {len(reviews_data)} realistic reviews...")
        for p_name, r_text, rating, r_date, r_author in reviews_data:
            prod = prod_dict.get(p_name)
            if not prod:
                continue
            # Check existing
            exist = Review.query.filter_by(product_id=prod.id, review_text=r_text).first()
            if not exist:
                r_obj = Review(
                    product_id=prod.id,
                    review_text=r_text,
                    rating=rating,
                    review_date=datetime.strptime(r_date, "%Y-%m-%d").date(),
                    reviewer_name=r_author,
                    source="Verified Buyer"
                )
                db.session.add(r_obj)
                db.session.flush()
                # Run NLP pipeline on review
                ReviewService.process_single_review(r_obj)

        db.session.commit()

        # Update product level artifacts (TF-IDF keywords, topics, and initial summaries)
        for p_name, prod in prod_dict.items():
            ReviewService.update_product_nlp_artifacts(prod.id)
            SummaryService.get_or_generate_summary(prod.id, force=True)

        print("[SEED] Successfully seeded products, reviews, NLP analyses, and summaries!")

if __name__ == "__main__":
    seed_database()

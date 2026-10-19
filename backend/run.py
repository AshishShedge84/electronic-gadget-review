import os
import sys
from pathlib import Path

# Add backend directory to Python path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from app import create_app
from app.models import db

app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_ENV", "development") == "development"
    print(f"🚀 Electronic Gadget Review Summarizer API starting on http://127.0.0.1:{port}")
    app.run(host="127.0.0.1", port=port, debug=debug)

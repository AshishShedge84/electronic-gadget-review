import pytest
from app.nlp.preprocessor import preprocess_text, clean_text
from app.nlp.sentiment_engine import analyze_sentiment
from app.nlp.aspect_extractor import extract_aspect_sentiments
from app.nlp.keyword_extractor import extract_keywords_from_corpus
from app.nlp.topic_modeler import extract_topics
from app.nlp.summarizer import generate_algorithmic_summary

def test_preprocessing():
    raw = "<div>The <b>BATTERY</b> life is amazing! http://test.com/review</div>"
    res = preprocess_text(raw)
    assert res["cleaned_text"] == "The BATTERY life is amazing!"
    assert "battery" in res["tokens"]
    assert "the" not in res["filtered_tokens"]  # Stopword removed
    assert res["token_count"] > 0

def test_sentiment_vader():
    pos = analyze_sentiment("This phone is amazing and battery lasts forever!")
    assert pos["sentiment"] == "Positive"
    assert pos["sentiment_score"] > 0.05

    neg = analyze_sentiment("Horrible product, overheating constantly and lagging.")
    assert neg["sentiment"] == "Negative"
    assert neg["sentiment_score"] < -0.05

def test_aspect_extraction_and_sentiment():
    text = "The battery is fantastic and lasts two days, but the camera is disappointing in low light."
    aspects = extract_aspect_sentiments(text)
    
    aspect_names = [a["aspect"] for a in aspects]
    assert "Battery" in aspect_names
    assert "Camera" in aspect_names

    battery_asp = next(a for a in aspects if a["aspect"] == "Battery")
    camera_asp = next(a for a in aspects if a["aspect"] == "Camera")

    assert battery_asp["sentiment"] == "Positive"
    assert camera_asp["sentiment"] == "Negative"

def test_keyword_extraction():
    corpus = [
        "The battery life is exceptional and fast charging works well.",
        "Stunning display with vibrant colors and great battery.",
        "Camera sensor captures crisp photos in daylight."
    ]
    keywords = extract_keywords_from_corpus(corpus, top_n=5)
    assert len(keywords) > 0
    kw_names = [k["keyword"] for k in keywords]
    assert any("battery" in k for k in kw_names)

def test_algorithmic_summary():
    reviews = [
        {"review_text": "Battery is outstanding.", "rating": 5, "sentiment": "Positive"},
        {"review_text": "Camera is blurry.", "rating": 2, "sentiment": "Negative"}
    ]
    aspects = {
        "Battery": {"positive_count": 1, "negative_count": 0, "neutral_count": 0},
        "Camera": {"positive_count": 0, "negative_count": 1, "neutral_count": 0}
    }
    summary = generate_algorithmic_summary("Test Device", reviews, aspects)
    assert summary["summary"] is not None
    assert len(summary["strengths"]) > 0
    assert len(summary["weaknesses"]) > 0

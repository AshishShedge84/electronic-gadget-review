"""
ASTMA Pipeline - Natural Language Processing Engine for Gadget Reviews
"""

from .preprocessor import preprocess_text, clean_text
from .sentiment_engine import analyze_sentiment
from .aspect_extractor import extract_aspect_sentiments, ASPECT_TAXONOMY
from .keyword_extractor import extract_keywords_from_corpus
from .topic_modeler import extract_topics
from .summarizer import generate_product_summary, generate_algorithmic_summary

__all__ = [
    "preprocess_text",
    "clean_text",
    "analyze_sentiment",
    "extract_aspect_sentiments",
    "ASPECT_TAXONOMY",
    "extract_keywords_from_corpus",
    "extract_topics",
    "generate_product_summary",
    "generate_algorithmic_summary",
]

"""
ASTMA Layer - AI Review Summarization Engine
Generates structured multi-dimensional intelligence:
Executive Summary, Positive Points, Negative Points, Common Complaints,
Frequently Praised Features, Strengths, Weaknesses, and Aspect-wise Summaries.
Supports algorithmic extractive summarization and optional LLM generative summarization.
"""

import os
import json
import requests
from typing import List, Dict, Any
from .sentiment_engine import analyze_sentiment
from .aspect_extractor import extract_aspect_sentiments
from .preprocessor import clean_text

def generate_algorithmic_summary(
    product_name: str,
    reviews: List[Dict[str, Any]],
    aspect_aggregates: Dict[str, Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Extractive, deterministic NLP summarizer built from sentence ranking,
    aspect polarities, and sentiment distributions.
    """
    if not reviews:
        return {
            "summary": f"No reviews currently available for {product_name}.",
            "positive_points": [],
            "negative_points": [],
            "common_complaints": [],
            "frequently_praised_features": [],
            "strengths": [],
            "weaknesses": [],
            "aspect_summary": {},
            "overall_sentiment": "Neutral",
            "is_ai_generated": False
        }

    total_reviews = len(reviews)
    positive_reviews = [r for r in reviews if r.get("sentiment") == "Positive"]
    negative_reviews = [r for r in reviews if r.get("sentiment") == "Negative"]
    neutral_reviews = [r for r in reviews if r.get("sentiment") == "Neutral"]

    pos_ratio = len(positive_reviews) / total_reviews
    neg_ratio = len(negative_reviews) / total_reviews

    if pos_ratio > 0.55:
        overall_sentiment = "Positive"
    elif neg_ratio > 0.40:
        overall_sentiment = "Negative"
    else:
        overall_sentiment = "Neutral"

    # Extract high-scoring sentences
    strengths = []
    weaknesses = []
    complaints = []
    praised = []
    aspect_summary = {}

    for aspect, data in aspect_aggregates.items():
        pos_count = data.get("positive_count", 0)
        neg_count = data.get("negative_count", 0)
        total_asp = pos_count + neg_count + data.get("neutral_count", 0)
        
        if total_asp == 0:
            continue

        if pos_count > neg_count and pos_count >= 1:
            praised.append(f"{aspect}: Praised by {pos_count} users for reliable performance and quality.")
            strengths.append(f"Strong customer satisfaction regarding {aspect.lower()}.")
            aspect_summary[aspect] = f"Predominantly positive feedback ({pos_count} positive mentions)."
        elif neg_count > pos_count and neg_count >= 1:
            complaints.append(f"{aspect}: Multiple users expressed concerns regarding {aspect.lower()}.")
            weaknesses.append(f"Areas of improvement required in {aspect.lower()}.")
            aspect_summary[aspect] = f"Frequent customer friction and complaints ({neg_count} negative mentions)."
        else:
            aspect_summary[aspect] = f"Balanced sentiment with mixed opinions recorded."

    # Extract specific review quotes
    for r in positive_reviews[:3]:
        text = r.get("review_text", "").strip()
        if text and len(text) > 20:
            # First sentence
            sent = text.split(".")[0].strip()
            if sent and sent not in strengths:
                strengths.append(f"User praise: \"{sent}\"")

    for r in negative_reviews[:3]:
        text = r.get("review_text", "").strip()
        if text and len(text) > 20:
            sent = text.split(".")[0].strip()
            if sent and sent not in complaints:
                complaints.append(f"Critical feedback: \"{sent}\"")

    positive_points = praised[:4] if praised else ["Reliable general functionality based on customer feedback."]
    negative_points = complaints[:4] if complaints else ["Minor occasional user observations regarding price or software."]
    common_complaints = complaints[:4]
    strengths_list = strengths[:4]
    weaknesses_list = weaknesses[:4]

    summary_text = (
        f"Analysis of {total_reviews} verified reviews for {product_name} indicates an overall {overall_sentiment.lower()} "
        f"customer consensus ({int(pos_ratio*100)}% positive, {int(neg_ratio*100)}% negative). "
        f"Key highlights center on {', '.join(list(aspect_aggregates.keys())[:3]) if aspect_aggregates else 'core specifications'}, "
        f"with consumers appreciating key features while identifying selective areas for enhancement."
    )

    return {
        "summary": summary_text,
        "positive_points": positive_points,
        "negative_points": negative_points,
        "common_complaints": common_complaints,
        "frequently_praised_features": praised[:5],
        "strengths": strengths_list,
        "weaknesses": weaknesses_list,
        "aspect_summary": aspect_summary,
        "overall_sentiment": overall_sentiment,
        "is_ai_generated": False
    }

def generate_product_summary(
    product_name: str,
    reviews: List[Dict[str, Any]],
    aspect_aggregates: Dict[str, Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Main summarization entrypoint.
    Attempts generative LLM call if API key configured, otherwise falls back smoothly
    to algorithmic extractive summarization.
    """
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("LLM_API_KEY")
    
    if api_key and len(reviews) > 0:
        try:
            # Prepare review sample for prompt
            review_snippets = "\n".join([
                f"- [Rating: {r.get('rating')}/5, Sentiment: {r.get('sentiment')}]: {r.get('review_text')[:250]}"
                for r in reviews[:25]
            ])
            
            prompt = f"""
You are an expert review intelligence analyst evaluating customer feedback for the electronic gadget: "{product_name}".
Analyze the following customer reviews and return a JSON object ONLY with the exact schema:
{{
  "summary": "2-3 sentence executive review summary synthesized strictly from the reviews",
  "positive_points": ["point 1", "point 2", "point 3"],
  "negative_points": ["point 1", "point 2"],
  "common_complaints": ["complaint 1", "complaint 2"],
  "frequently_praised_features": ["feature 1", "feature 2"],
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "aspect_summary": {{"Battery": "summary", "Camera": "summary", "Display": "summary"}},
  "overall_sentiment": "Positive" | "Negative" | "Neutral"
}}

Reviews:
{review_snippets}

Output raw JSON only without markdown code blocks.
"""
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"temperature": 0.2, "responseMimeType": "application/json"}
            }
            res = requests.post(url, json=payload, timeout=8)
            if res.status_code == 200:
                data = res.json()
                text_out = data["candidates"][0]["content"]["parts"][0]["text"]
                parsed = json.loads(text_out)
                parsed["is_ai_generated"] = True
                return parsed
        except Exception:
            # Graceful fallback to algorithmic summarizer
            pass

    # Algorithmic fallback
    return generate_algorithmic_summary(product_name, reviews, aspect_aggregates)

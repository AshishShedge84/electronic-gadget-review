"""
ASTMA Layer - Sentiment Analysis Engine
Implements Rule-Based Valence Aware Dictionary and sEntiment Reasoner (VADER)
specifically tuned for review text, micro-contexts, and aspect valuations.
"""

from typing import Dict, Any

_sia_instance = None

def get_vader_analyzer():
    global _sia_instance
    if _sia_instance is None:
        try:
            from nltk.sentiment.vader import SentimentIntensityAnalyzer
            _sia_instance = SentimentIntensityAnalyzer()
        except Exception:
            _sia_instance = "FALLBACK"
    return _sia_instance

# Fallback lexical scores for key terms if NLTK is initializing
LEXICAL_FALLBACK = {
    "great": 0.8, "excellent": 0.9, "amazing": 0.9, "good": 0.6, "love": 0.85, "best": 0.9,
    "fast": 0.5, "smooth": 0.6, "stunning": 0.85, "crisp": 0.6, "long-lasting": 0.7, "reliable": 0.7,
    "poor": -0.7, "bad": -0.6, "terrible": -0.9, "awful": -0.9, "slow": -0.6, "lag": -0.7,
    "laggy": -0.7, "drain": -0.6, "overheating": -0.8, "heating": -0.6, "heavy": -0.4, "disappointing": -0.8,
    "cheap": -0.3, "expensive": -0.4, "waste": -0.9, "flimsy": -0.7, "worst": -0.95, "mediocre": -0.4
}

def analyze_sentiment(text: str) -> Dict[str, Any]:
    """
    Computes sentiment compound score and classification.
    Classification threshold:
      compound >= 0.05 -> Positive
      compound <= -0.05 -> Negative
      else -> Neutral
    """
    if not text or not text.strip():
        return {
            "sentiment": "Neutral",
            "sentiment_score": 0.0,
            "pos": 0.0,
            "neg": 0.0,
            "neu": 1.0,
            "compound": 0.0,
            "confidence": 0.5
        }

    sia = get_vader_analyzer()
    if sia != "FALLBACK":
        try:
            scores = sia.polarity_scores(text)
            compound = float(scores["compound"])
            pos = float(scores["pos"])
            neg = float(scores["neg"])
            neu = float(scores["neu"])
            
            if compound >= 0.05:
                label = "Positive"
            elif compound <= -0.05:
                label = "Negative"
            else:
                label = "Neutral"

            confidence = round(max(abs(compound), neu if label == "Neutral" else (pos if label == "Positive" else neg)), 4)
            return {
                "sentiment": label,
                "sentiment_score": round(compound, 4),
                "pos": round(pos, 4),
                "neg": round(neg, 4),
                "neu": round(neu, 4),
                "compound": round(compound, 4),
                "confidence": confidence
            }
        except Exception:
            pass

    # Heuristic fallback if VADER instance failed to load
    lowered = text.lower()
    score = 0.0
    matches = 0
    for word, val in LEXICAL_FALLBACK.items():
        if word in lowered:
            score += val
            matches += 1

    if matches > 0:
        score = max(-1.0, min(1.0, score / max(1, matches ** 0.5)))
    else:
        score = 0.0

    if score >= 0.05:
        label = "Positive"
    elif score <= -0.05:
        label = "Negative"
    else:
        label = "Neutral"

    return {
        "sentiment": label,
        "sentiment_score": round(score, 4),
        "pos": round(max(0.0, score), 4),
        "neg": round(max(0.0, -score), 4),
        "neu": round(1.0 - abs(score), 4),
        "compound": round(score, 4),
        "confidence": round(abs(score) if label != "Neutral" else 0.6, 4)
    }

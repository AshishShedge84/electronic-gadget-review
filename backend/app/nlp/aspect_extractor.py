"""
ASTMA Layer - Aspect-Based Sentiment Analysis (ABSA)
Identifies domain-specific electronic gadget aspects, extracts local sentence contexts,
and evaluates aspect-specific sentiment polarity.
"""

import re
from typing import List, Dict, Any
from .sentiment_engine import analyze_sentiment

# Pre-defined electronic gadget aspects and their associated keywords/patterns
ASPECT_TAXONOMY: Dict[str, List[str]] = {
    "Battery": ["battery", "battery life", "charging", "charger", "mah", "drain", "backup", "endurance", "power"],
    "Camera": ["camera", "photo", "picture", "sensor", "lens", "video", "portrait", "selfie", "low light", "night mode", "zoom", "megapixel"],
    "Display": ["display", "screen", "oled", "amoled", "lcd", "refresh rate", "hz", "brightness", "resolution", "panel", "bezel"],
    "Performance": ["performance", "speed", "processor", "chipset", "cpu", "gpu", "snapdragon", "bionic", "ram", "lag", "fps", "stutter", "multitasking"],
    "Design": ["design", "look", "aesthetic", "slim", "sleek", "finish", "color", "form factor", "appearance", "ergonomics"],
    "Build Quality": ["build quality", "build", "sturdy", "durability", "durable", "aluminum", "hinge", "creak", "flimsy", "premium build", "materials"],
    "Price & Value": ["price", "cost", "value", "expensive", "affordable", "budget", "money", "worth", "deal", "overpriced", "pricing"],
    "Audio & Sound": ["audio", "sound", "speaker", "bass", "treble", "volume", "microphone", "mic", "anc", "noise cancellation", "earcup"],
    "Software & OS": ["software", "os", "ui", "android", "ios", "macos", "windows", "firmware", "update", "bloatware", "bug", "glitch"],
    "Connectivity": ["connectivity", "bluetooth", "wifi", "cellular", "5g", "range", "pairing", "disconnect", "signal", "connection", "port"],
    "Comfort & Ergonomics": ["comfort", "comfortable", "fit", "ear tips", "weight", "heavy", "lightweight", "earbuds fit", "wearing"],
    "Gaming": ["gaming", "game", "games", "thermals", "cooling", "heating", "temperature", "overheating"]
}

def split_into_clauses_and_sentences(text: str) -> List[str]:
    """
    Splits text into sentences and contrastive clauses (e.g., using 'but', 'however', 'although', ';')
    to preserve distinct aspect sentiments.
    """
    if not text:
        return []
    
    # Split by standard sentence boundaries
    sentences = re.split(r"[.!?\n]+", text)
    clauses = []
    
    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue
        # Split further by contrastive conjunctions
        sub_parts = re.split(r"\b(but|however|although|whereas|though|while|yet|except)\b", sentence, flags=re.IGNORECASE)
        current_chunk = ""
        for part in sub_parts:
            part = part.strip()
            if not part:
                continue
            if part.lower() in {"but", "however", "although", "whereas", "though", "while", "yet", "except"}:
                if current_chunk:
                    clauses.append(current_chunk)
                    current_chunk = ""
            else:
                current_chunk = f"{current_chunk} {part}".strip()
        if current_chunk:
            clauses.append(current_chunk)
            
    return clauses if clauses else [text]

def extract_aspect_sentiments(text: str) -> List[Dict[str, Any]]:
    """
    Extracts all mentioned aspects from the review text along with aspect-level sentiment.
    """
    if not text or not text.strip():
        return []

    clauses = split_into_clauses_and_sentences(text)
    detected_aspects: Dict[str, Dict[str, Any]] = {}

    for clause in clauses:
        lowered_clause = clause.lower()
        clause_sentiment = analyze_sentiment(clause)
        
        for aspect_name, keywords in ASPECT_TAXONOMY.items():
            for kw in keywords:
                # Word boundary search for precision
                pattern = r"\b" + re.escape(kw) + r"\b"
                if re.search(pattern, lowered_clause):
                    # Aspect matched in this clause!
                    score = clause_sentiment["sentiment_score"]
                    label = clause_sentiment["sentiment"]
                    
                    if aspect_name not in detected_aspects:
                        detected_aspects[aspect_name] = {
                            "aspect": aspect_name,
                            "keyword_matched": kw,
                            "sentiment": label,
                            "score": score,
                            "evidence_clause": clause,
                            "occurrences": 1
                        }
                    else:
                        # Aggregate if mentioned in multiple clauses
                        prev = detected_aspects[aspect_name]
                        prev["occurrences"] += 1
                        # Weighted combination of sentiment scores
                        new_score = (prev["score"] + score) / 2.0
                        prev["score"] = round(new_score, 4)
                        if new_score >= 0.05:
                            prev["sentiment"] = "Positive"
                        elif new_score <= -0.05:
                            prev["sentiment"] = "Negative"
                        else:
                            prev["sentiment"] = "Neutral"
                        prev["evidence_clause"] += " | " + clause
                    break  # Break keyword loop for this aspect in this clause

    return list(detected_aspects.values())

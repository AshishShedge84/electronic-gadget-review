"""
ASTMA Layer - Text Preprocessing Module
Implements standard text cleaning, normalization, tokenization, stopword removal, and lemmatization/stemming.
"""

import re
import string

# Standard English stopwords fallback list
STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are",
    "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both",
    "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't",
    "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't",
    "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here",
    "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll",
    "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's",
    "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once",
    "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same",
    "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such",
    "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there",
    "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those",
    "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd",
    "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where",
    "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't",
    "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours",
    "yourself", "yourselves"
}

# Simple suffix rule-based stemmer for reliability and speed
def simple_stem(word: str) -> str:
    word = word.lower()
    if len(word) <= 3:
        return word
    for suffix in ["ies", "es", "s", "ing", "ed", "ly", "tion", "able", "ment"]:
        if word.endswith(suffix) and len(word) - len(suffix) >= 3:
            if suffix == "ies":
                return word[:-3] + "y"
            return word[:-len(suffix)]
    return word

def clean_text(text: str) -> str:
    """Cleans raw text by stripping HTML, non-ASCII chars, extra whitespaces."""
    if not text or not isinstance(text, str):
        return ""
    # Strip HTML tags
    text = re.sub(r"<[^>]+>", " ", text)
    # Strip URLs
    text = re.sub(r"http\S+|www\.\S+", " ", text)
    # Remove emojis and non-standard symbols while keeping basic punctuation for sentence splitting
    text = re.sub(r"[^\x00-\x7F]+", " ", text)
    # Normalize whitespaces
    text = re.sub(r"\s+", " ", text).strip()
    return text

def preprocess_text(text: str) -> dict:
    """
    Executes end-to-end preprocessing pipeline:
    Raw -> Cleaned -> Tokenized -> Stopwords Removed -> Stemmed/Normalized
    """
    raw_text = text if text and isinstance(text, str) else ""
    cleaned = clean_text(raw_text)
    
    # Lowercase & strip punctuation for token stream
    lowered = cleaned.lower()
    # Replace punctuation with spaces
    no_punct = lowered.translate(str.maketrans(string.punctuation, " " * len(string.punctuation)))
    tokens = [t.strip() for t in no_punct.split() if t.strip()]
    
    # Stopword removal
    filtered_tokens = [t for t in tokens if t not in STOPWORDS and len(t) > 1]
    
    # Stemming / normalization
    stemmed_tokens = [simple_stem(t) for t in filtered_tokens]
    
    normalized_text = " ".join(filtered_tokens)
    
    return {
        "raw_text": raw_text,
        "cleaned_text": cleaned,
        "tokens": tokens,
        "filtered_tokens": filtered_tokens,
        "stemmed_tokens": stemmed_tokens,
        "normalized_text": normalized_text,
        "token_count": len(tokens),
        "filtered_count": len(filtered_tokens)
    }

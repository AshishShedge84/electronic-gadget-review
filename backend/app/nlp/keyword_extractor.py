"""
ASTMA Layer - Keyword Extraction Engine
Implements TF-IDF (Term Frequency-Inverse Document Frequency)
and statistical n-gram frequency extraction over product reviews.
"""

from typing import List, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from collections import Counter
from .preprocessor import clean_text, STOPWORDS

# Domain-specific stopwords to prune generic gadget terms
DOMAIN_STOPWORDS = STOPWORDS.union({
    "product", "device", "item", "gadget", "bought", "buy", "purchase", "purchased",
    "using", "used", "use", "day", "days", "week", "weeks", "month", "months", "year",
    "years", "thing", "really", "very", "much", "also", "just", "get", "got", "one", "amazon"
})

def extract_keywords_from_corpus(texts: List[str], top_n: int = 15) -> List[Dict[str, Any]]:
    """
    Computes TF-IDF across all reviews for a product or dataset.
    Returns keywords sorted by highest TF-IDF weight and raw occurrence frequency.
    """
    cleaned_corpus = [clean_text(t) for t in texts if t and clean_text(t)]
    if not cleaned_corpus:
        return []

    try:
        vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            stop_words=list(DOMAIN_STOPWORDS),
            max_features=100,
            min_df=1
        )
        tfidf_matrix = vectorizer.fit_transform(cleaned_corpus)
        feature_names = vectorizer.get_feature_names_out()
        
        # Calculate mean TF-IDF score across documents
        mean_scores = tfidf_matrix.mean(axis=0).A1
        
        # Calculate raw frequency across corpus
        word_freq = Counter()
        for doc in cleaned_corpus:
            tokens = [w.lower() for w in doc.split() if w.lower() not in DOMAIN_STOPWORDS and len(w) > 2]
            word_freq.update(tokens)
            # Add bigrams
            for i in range(len(tokens) - 1):
                bigram = f"{tokens[i]} {tokens[i+1]}"
                word_freq[bigram] += 1

        results = []
        for idx, feature in enumerate(feature_names):
            score = float(mean_scores[idx])
            freq = int(word_freq.get(feature, 1))
            results.append({
                "keyword": feature,
                "score": round(score, 4),
                "frequency": max(freq, 1)
            })

        # Sort by TF-IDF score descending
        results.sort(key=lambda x: (x["score"], x["frequency"]), reverse=True)
        return results[:top_n]

    except Exception:
        # Fallback to simple term frequency if corpus is too small or uniform
        word_freq = Counter()
        for doc in cleaned_corpus:
            tokens = [w.lower() for w in doc.split() if w.lower() not in DOMAIN_STOPWORDS and len(w) > 2]
            word_freq.update(tokens)
        
        total = sum(word_freq.values()) or 1
        results = [
            {"keyword": kw, "frequency": count, "score": round(count / total, 4)}
            for kw, count in word_freq.most_common(top_n)
        ]
        return results

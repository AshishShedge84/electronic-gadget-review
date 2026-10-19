import React, { useState, useEffect } from "react";
import { Search, Star, Filter, Sliders, Calendar, User, Quote, Cpu } from "lucide-react";
import { getReviewsApi, getProductsApi } from "../services/api";

export default function ReviewExplorerPage({ selectedProductId: initialProdId }) {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [productId, setProductId] = useState(initialProdId || "");
  const [rating, setRating] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [aspect, setAspect] = useState("");
  const [search, setSearch] = useState("");

  const aspectsList = [
    "Battery", "Camera", "Display", "Performance", "Design",
    "Build Quality", "Price & Value", "Audio & Sound", "Software & OS",
    "Connectivity", "Comfort & Ergonomics", "Gaming"
  ];

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await getReviewsApi({
        product_id: productId,
        rating,
        sentiment,
        aspect,
        search,
        per_page: 50,
      });
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error("Failed to load reviews in explorer:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadProducts() {
      const pRes = await getProductsApi();
      setProducts(pRes.data || []);
    }
    loadProducts();
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [productId, rating, sentiment, aspect]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReviews();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Page Header */}
      <div>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff" }}>Granular Review Explorer</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
          Filter multi-aspect reviews by product, star rating, sentiment polarity, and specific hardware aspect.
        </p>
      </div>

      {/* Multi-Dimensional Filter Bar */}
      <div className="card" style={{ padding: "18px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, alignItems: "center" }}>
          {/* Search */}
          <form onSubmit={handleSearchSubmit} style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search text..."
              className="input-field"
              style={{ width: "100%", paddingLeft: 34 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={14} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          </form>

          {/* Product Filter */}
          <select
            className="input-field"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            <option value="">All Products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Sentiment Filter */}
          <select
            className="input-field"
            value={sentiment}
            onChange={(e) => setSentiment(e.target.value)}
          >
            <option value="">All Sentiments</option>
            <option value="Positive">Positive Only</option>
            <option value="Negative">Negative Only</option>
            <option value="Neutral">Neutral Only</option>
          </select>

          {/* Aspect Filter */}
          <select
            className="input-field"
            value={aspect}
            onChange={(e) => setAspect(e.target.value)}
          >
            <option value="">All Aspects</option>
            {aspectsList.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          {/* Rating Filter */}
          <select
            className="input-field"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="">All Star Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Review Cards Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)" }}>
          Querying review records...
        </div>
      ) : reviews.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "60px 20px" }}>
          <Quote size={40} color="var(--text-muted)" style={{ margin: "0 auto 12px" }} />
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>No reviews matched</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: 4 }}>
            Try broadening your aspect or sentiment filter parameters.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {reviews.map((r) => {
            const sent = r.analysis?.sentiment || "Neutral";
            const score = r.analysis?.sentiment_score || 0;
            return (
              <div key={r.id} className="card" style={{ padding: "20px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontWeight: 700, color: "#fff", fontSize: "0.95rem" }}>
                      {r.product_name}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 3, background: "#1e293b", padding: "2px 8px", borderRadius: 4 }}>
                      <Star size={13} fill="#f59e0b" color="#f59e0b" />
                      <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>{r.rating}/5</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className={`badge badge-${sent.toLowerCase()}`}>
                      {sent} (Compound: {score > 0 ? `+${score}` : score})
                    </span>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      {r.review_date || "Recent"}
                    </span>
                  </div>
                </div>

                {/* Review Text */}
                <p style={{ fontSize: "0.92rem", lineHeight: 1.6, color: "#e2e8f0", marginBottom: 14 }}>
                  "{r.review_text}"
                </p>

                {/* Detected Aspects Chips & Author */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, paddingTop: 10, borderTop: "1px solid var(--border-subtle)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
                      Detected Aspects:
                    </span>
                    {r.aspects?.length > 0 ? (
                      r.aspects.map((asp, idx) => (
                        <span
                          key={idx}
                          className={`badge badge-${asp.sentiment.toLowerCase()}`}
                          style={{ fontSize: "0.72rem", padding: "2px 8px" }}
                        >
                          {asp.aspect}: {asp.sentiment} ({asp.score > 0 ? `+${asp.score}` : asp.score})
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>None detected</span>
                    )}
                  </div>

                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    Reviewer: <span style={{ color: "var(--text-secondary)" }}>{r.reviewer_name}</span> &bull; Source: <span style={{ color: "var(--text-secondary)" }}>{r.source}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

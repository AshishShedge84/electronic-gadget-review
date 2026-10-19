import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, CheckCircle2, AlertTriangle, Star, Search } from "lucide-react";
import { getProducts, getProductReviews } from "../services/firestoreService";
import { INITIAL_PRODUCTS } from "../services/seedData";
import { formatNumberIN } from "../utils/currency";

export default function SentimentAnalysisPage({ setCurrentTab, setSelectedProductId }) {
  const [products, setProducts] = useState([]);
  const [activeProdId, setActiveProdId] = useState(INITIAL_PRODUCTS[0]?.id);
  const [reviews, setReviews] = useState([]);
  const [selectedSentiment, setSelectedSentiment] = useState("all");

  useEffect(() => {
    async function load() {
      const prods = await getProducts();
      setProducts(prods);
      if (prods.length > 0 && !activeProdId) {
        setActiveProdId(prods[0].id);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (activeProdId) {
      getProductReviews(activeProdId).then(setReviews);
    }
  }, [activeProdId]);

  const activeProduct = products.find((p) => p.id === activeProdId) || products[0] || INITIAL_PRODUCTS[0];
  const stats = activeProduct?.sentimentStats || { positivePct: 85, neutralPct: 10, negativePct: 5, positiveCount: 3000, neutralCount: 300, negativeCount: 150 };

  const filteredReviews = reviews.filter((r) => {
    if (selectedSentiment === "positive") return r.sentiment === "positive" || r.rating >= 4;
    if (selectedSentiment === "neutral") return r.sentiment === "neutral" || r.rating === 3;
    if (selectedSentiment === "negative") return r.sentiment === "negative" || r.rating <= 2;
    return true;
  });

  return (
    <div className="page-container">
      <div style={{ marginBottom: "28px" }}>
        <span style={{ fontSize: "12px", fontWeight: "700", color: "#0071E3", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Polarity Analytics
        </span>
        <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#1D1D1F", letterSpacing: "-0.02em", marginTop: "4px" }}>
          Sentiment Insights
        </h1>
        <p style={{ fontSize: "14px", color: "#86868B", marginTop: "4px" }}>
          Distribution of positive, neutral, and critical sentiments across monitored electronics.
        </p>
      </div>

      {/* Gadget Switcher */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "12px", marginBottom: "28px" }}>
        {products.map((p) => {
          const isSelected = p.id === activeProduct?.id;
          return (
            <button
              key={p.id}
              onClick={() => setActiveProdId(p.id)}
              style={{
                padding: "8px 16px",
                borderRadius: "9999px",
                fontSize: "13px",
                fontWeight: isSelected ? "600" : "500",
                backgroundColor: isSelected ? "#0071E3" : "#FFFFFF",
                color: isSelected ? "#FFFFFF" : "#5E5E63",
                border: isSelected ? "1px solid #0071E3" : "1px solid #E5E5EA",
                whiteSpace: "nowrap"
              }}
            >
              {p.name.split(" (")[0]}
            </button>
          );
        })}
      </div>

      {/* Sentiment Overview Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "28px" }}>
        <div className="reviewly-card" style={{ padding: "24px", borderLeft: "4px solid #34C759" }}>
          <span style={{ fontSize: "12px", color: "#248A3D", fontWeight: "700", textTransform: "uppercase" }}>
            Positive Valence
          </span>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: "6px" }}>
            <span style={{ fontSize: "28px", fontWeight: "700", color: "#1D1D1F" }}>{stats.positivePct}%</span>
            <span style={{ fontSize: "13px", color: "#248A3D" }}>{formatNumberIN(stats.positiveCount)} reviews</span>
          </div>
          <p style={{ fontSize: "12px", color: "#86868B", marginTop: "4px" }}>
            Unconditional recommendations, ergonomic praise, performance benchmarks.
          </p>
        </div>

        <div className="reviewly-card" style={{ padding: "24px", borderLeft: "4px solid #86868B" }}>
          <span style={{ fontSize: "12px", color: "#5E5E63", fontWeight: "700", textTransform: "uppercase" }}>
            Neutral / Mixed
          </span>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: "6px" }}>
            <span style={{ fontSize: "28px", fontWeight: "700", color: "#1D1D1F" }}>{stats.neutralPct}%</span>
            <span style={{ fontSize: "13px", color: "#5E5E63" }}>{formatNumberIN(stats.neutralCount)} reviews</span>
          </div>
          <p style={{ fontSize: "12px", color: "#86868B", marginTop: "4px" }}>
            Acceptable battery stamina, standard pricing, situational trade-offs.
          </p>
        </div>

        <div className="reviewly-card" style={{ padding: "24px", borderLeft: "4px solid #D70015" }}>
          <span style={{ fontSize: "12px", color: "#D70015", fontWeight: "700", textTransform: "uppercase" }}>
            Critical / Negative
          </span>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: "6px" }}>
            <span style={{ fontSize: "28px", fontWeight: "700", color: "#1D1D1F" }}>{stats.negativePct}%</span>
            <span style={{ fontSize: "13px", color: "#D70015" }}>{formatNumberIN(stats.negativeCount)} reviews</span>
          </div>
          <p style={{ fontSize: "12px", color: "#86868B", marginTop: "4px" }}>
            Software glitches, non-folding form factor, headband pressure hotspots.
          </p>
        </div>
      </div>

      {/* Review Sentence Polarity Explorer */}
      <div className="reviewly-card" style={{ padding: "28px", backgroundColor: "#FFFFFF" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1D1D1F" }}>
              Extracted Review Evidence for {activeProduct?.name}
            </h3>
            <p style={{ fontSize: "12.5px", color: "#86868B" }}>Filtered by algorithmic sentiment scoring</p>
          </div>

          <div style={{ display: "flex", gap: "6px", backgroundColor: "#F0EDEF", padding: "3px", borderRadius: "9999px" }}>
            {["all", "positive", "neutral", "negative"].map((f) => (
              <button
                key={f}
                onClick={() => setSelectedSentiment(f)}
                style={{
                  padding: "5px 12px",
                  borderRadius: "9999px",
                  fontSize: "12px",
                  fontWeight: selectedSentiment === f ? "600" : "500",
                  backgroundColor: selectedSentiment === f ? "#FFFFFF" : "transparent",
                  color: selectedSentiment === f ? "#1D1D1F" : "#86868B",
                  textTransform: "capitalize"
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              style={{
                padding: "16px",
                borderRadius: "12px",
                backgroundColor: "#FBFBFD",
                border: "1px solid #E5E5EA"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "13.5px", fontWeight: "600", color: "#1D1D1F" }}>{rev.author}</span>
                <span className={`sentiment-chip ${rev.sentiment || (rev.rating >= 4 ? "positive" : rev.rating === 3 ? "neutral" : "negative")}`}>
                  {rev.sentiment || (rev.rating >= 4 ? "Positive" : "Critical")} (★ {rev.rating})
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "#5E5E63", lineHeight: 1.45 }}>"{rev.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

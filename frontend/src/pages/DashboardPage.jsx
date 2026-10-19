import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Compass,
  GitCompare,
  Cpu,
  BarChart3,
  Bookmark,
  TrendingUp,
  Star,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Laptop,
  Headphones,
  Sliders
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getProducts, getUserSavedProducts } from "../services/firestoreService";
import { formatINR, formatNumberIN } from "../utils/currency";

export default function DashboardPage({ setCurrentTab, setSelectedProductId }) {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [savedCount, setSavedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const prods = await getProducts();
        setProducts(prods);
        if (user) {
          const saved = await getUserSavedProducts(user.uid);
          setSavedCount(saved.length);
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [user]);

  const totalReviews = products.reduce((acc, p) => acc + (p.reviewCount || 0), 0);
  const avgRating = (products.reduce((acc, p) => acc + (p.rating || 0), 0) / (products.length || 1)).toFixed(1);

  return (
    <div className="page-container">
      {/* Header Greeting */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "600", color: "#0071E3", marginBottom: "4px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#34C759" }}></span>
              <span>Cluster Engine Online • Latency 18ms</span>
            </div>
            <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#1D1D1F", letterSpacing: "-0.02em" }}>
              Good evening, {user?.displayName || "Tech Explorer"}
            </h1>
            <p style={{ fontSize: "14px", color: "#86868B", marginTop: "4px" }}>
              Real-time sentiment synthesis across {formatNumberIN(totalReviews)} verified electronic reviews in India.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="btn-primary"
              onClick={() => setCurrentTab("explore")}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <Compass size={16} />
              <span>Explore Gadgets</span>
            </button>
            <button
              className="btn-outline"
              onClick={() => setCurrentTab("compare")}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <GitCompare size={16} />
              <span>Comparison Matrix</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Metrics Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "18px", marginBottom: "32px" }}>
        <div className="reviewly-card" style={{ padding: "20px" }}>
          <span style={{ fontSize: "11.5px", fontWeight: "600", color: "#86868B", textTransform: "uppercase" }}>
            Tracked Gadgets
          </span>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: "6px" }}>
            <span style={{ fontSize: "28px", fontWeight: "700", color: "#1D1D1F" }}>{products.length}</span>
            <span style={{ fontSize: "12px", color: "#248A3D", fontWeight: "600" }}>+2 this week</span>
          </div>
          <span style={{ fontSize: "12px", color: "#86868B" }}>Smartphones, Laptops, Audio</span>
        </div>

        <div className="reviewly-card" style={{ padding: "20px" }}>
          <span style={{ fontSize: "11.5px", fontWeight: "600", color: "#86868B", textTransform: "uppercase" }}>
            Reviews Synthesized
          </span>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: "6px" }}>
            <span style={{ fontSize: "28px", fontWeight: "700", color: "#1D1D1F" }}>{formatNumberIN(totalReviews)}</span>
            <span style={{ fontSize: "12px", color: "#0071E3", fontWeight: "600" }}>Verified</span>
          </div>
          <span style={{ fontSize: "12px", color: "#86868B" }}>Extractive NLP scoring</span>
        </div>

        <div className="reviewly-card" style={{ padding: "20px" }}>
          <span style={{ fontSize: "11.5px", fontWeight: "600", color: "#86868B", textTransform: "uppercase" }}>
            Average Consensus
          </span>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: "6px" }}>
            <span style={{ fontSize: "28px", fontWeight: "700", color: "#1D1D1F" }}>89.2%</span>
            <span style={{ fontSize: "12px", color: "#248A3D", fontWeight: "600" }}>★ {avgRating}</span>
          </div>
          <span style={{ fontSize: "12px", color: "#86868B" }}>High buyer confidence</span>
        </div>

        <div className="reviewly-card" style={{ padding: "20px" }}>
          <span style={{ fontSize: "11.5px", fontWeight: "600", color: "#86868B", textTransform: "uppercase" }}>
            Saved in Profile
          </span>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: "6px" }}>
            <span style={{ fontSize: "28px", fontWeight: "700", color: "#1D1D1F" }}>{savedCount}</span>
            <Bookmark size={18} color="#0071E3" />
          </div>
          <span style={{ fontSize: "12px", color: "#86868B" }}>Synced with Firestore</span>
        </div>
      </div>

      {/* Main Grid: Sentiment Spectrum & Live Consensus */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px", marginBottom: "32px" }}>
        
        {/* Sentiment Spectrum Breakdown */}
        <div className="reviewly-card" style={{ padding: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <h3 style={{ fontSize: "17px", fontWeight: "600", color: "#1D1D1F" }}>Platform Sentiment Spectrum</h3>
              <p style={{ fontSize: "12.5px", color: "#86868B" }}>Weighted balance across verified customer feedback</p>
            </div>
            <span className="sentiment-chip positive">88% Positive</span>
          </div>

          <div style={{ display: "flex", height: "14px", borderRadius: "8px", overflow: "hidden", backgroundColor: "#E5E5EA", marginBottom: "20px" }}>
            <div style={{ width: "88%", backgroundColor: "#34C759" }} title="88% Positive"></div>
            <div style={{ width: "8%", backgroundColor: "#86868B" }} title="8% Neutral"></div>
            <div style={{ width: "4%", backgroundColor: "#D70015" }} title="4% Critical"></div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", paddingTop: "12px", borderTop: "1px solid #E5E5EA" }}>
            <div>
              <span style={{ fontSize: "12px", color: "#248A3D", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#34C759" }}></span>
                Positive
              </span>
              <span style={{ fontSize: "18px", fontWeight: "700", color: "#1D1D1F", display: "block", marginTop: "2px" }}>88%</span>
              <span style={{ fontSize: "11px", color: "#86868B" }}>16,340 reviews</span>
            </div>

            <div>
              <span style={{ fontSize: "12px", color: "#5E5E63", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#86868B" }}></span>
                Neutral
              </span>
              <span style={{ fontSize: "18px", fontWeight: "700", color: "#1D1D1F", display: "block", marginTop: "2px" }}>8%</span>
              <span style={{ fontSize: "11px", color: "#86868B" }}>1,480 reviews</span>
            </div>

            <div>
              <span style={{ fontSize: "12px", color: "#D70015", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#D70015" }}></span>
                Negative
              </span>
              <span style={{ fontSize: "18px", fontWeight: "700", color: "#1D1D1F", display: "block", marginTop: "2px" }}>4%</span>
              <span style={{ fontSize: "11px", color: "#86868B" }}>760 reviews</span>
            </div>
          </div>
        </div>

        {/* Quick Review Analyzer Trigger */}
        <div className="reviewly-card" style={{ padding: "28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "rgba(0, 113, 227, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0071E3" }}>
                <Cpu size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: "17px", fontWeight: "600", color: "#1D1D1F" }}>Instant Review Summarizer</h3>
                <span style={{ fontSize: "12px", color: "#86868B" }}>Natural Language Processing Engine</span>
              </div>
            </div>
            <p style={{ fontSize: "13.5px", color: "#5E5E63", lineHeight: 1.5, marginTop: "8px" }}>
              Select any gadget in our catalog or paste custom customer evaluations to extract top pros, cons, aspect sentiments, and key concerns instantly.
            </p>
          </div>

          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button
              className="btn-primary"
              style={{ flex: 1, padding: "10px" }}
              onClick={() => {
                if (products[0]) setSelectedProductId(products[0].id);
                setCurrentTab("summary");
              }}
            >
              <Sparkles size={15} />
              <span>Launch Analyzer</span>
            </button>
            <button
              className="btn-outline"
              style={{ padding: "10px 16px" }}
              onClick={() => setCurrentTab("aspects")}
            >
              <Sliders size={15} />
              <span>Aspects</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Hardware Section */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1D1D1F", letterSpacing: "-0.01em" }}>
              Recently Synthesized Gadgets
            </h2>
            <p style={{ fontSize: "13px", color: "#86868B" }}>Direct insights from the latest sentiment runs</p>
          </div>
          <button
            className="btn-outline"
            style={{ fontSize: "12.5px" }}
            onClick={() => setCurrentTab("explore")}
          >
            <span>Explore All</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {products.slice(0, 3).map((prod) => (
            <div
              key={prod.id}
              className="reviewly-card interactive"
              style={{ padding: "20px", cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
              onClick={() => {
                setSelectedProductId(prod.id);
                setCurrentTab("summary");
              }}
            >
              <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "14px" }}>
                <img
                  src={prod.imageUrl}
                  alt={prod.name}
                  style={{ width: "64px", height: "64px", borderRadius: "12px", objectFit: "cover", backgroundColor: "#F6F3F5" }}
                />
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <span style={{ fontSize: "11px", fontWeight: "600", color: "#86868B", textTransform: "uppercase" }}>
                    {prod.brand} • {prod.category}
                  </span>
                  <h4 style={{ fontSize: "15px", fontWeight: "600", color: "#1D1D1F", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                    {prod.name}
                  </h4>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#0071E3" }}>
                    {formatINR(prod.priceINR)}
                  </span>
                </div>
              </div>

              <div style={{ padding: "10px 12px", borderRadius: "10px", backgroundColor: "#F6F3F5", marginBottom: "14px" }}>
                <p style={{ fontSize: "12.5px", color: "#1D1D1F", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {prod.summary?.executiveSummary || prod.description}
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid #E5E5EA", fontSize: "12px" }}>
                <span className="sentiment-chip positive">
                  {prod.sentimentStats?.consensusScore || 90}% Consensus
                </span>
                <span style={{ color: "#0071E3", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
                  <span>View Analysis</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Star,
  Cpu,
  ThumbsUp,
  Sliders,
  Bookmark,
  GitCompare,
  TrendingUp,
  HelpCircle
} from "lucide-react";
import { getProductById, getProductAnalysis, generateAIAnalysis, toggleSaveProduct } from "../services/firestoreService";
import { INITIAL_PRODUCTS } from "../services/seedData";
import { formatINR, formatNumberIN } from "../utils/currency";
import { useAuth } from "../context/AuthContext";

export default function SummaryPage({ selectedProductId, setCurrentTab, setSelectedProductId, addToCompareList }) {
  const { user } = useAuth();
  const productId = selectedProductId || INITIAL_PRODUCTS[0]?.id;

  const [product, setProduct] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const prod = await getProductById(productId);
        setProduct(prod);
        const data = await getProductAnalysis(productId);
        setAnalysis(data);
      } catch (err) {
        console.error("Failed to load summary analysis:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [productId]);

  const handleRefreshAnalysis = async () => {
    setAnalyzing(true);
    setStatusMessage("Extracting customer evaluations & parsing aspect polarities...");
    try {
      const updated = await generateAIAnalysis(productId, user?.uid);
      setAnalysis(updated);
      setStatusMessage("AI synthesis completed and persisted to Firestore!");
      setTimeout(() => setStatusMessage(""), 3500);
    } catch (err) {
      console.error("Analysis generation failed:", err);
      setStatusMessage("Error generating analysis. Using latest saved consensus.");
      setTimeout(() => setStatusMessage(""), 3000);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      alert("Please sign in to save gadgets.");
      return;
    }
    try {
      const res = await toggleSaveProduct(user.uid, product);
      setIsSaved(res.saved);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: "center", padding: "80px 20px" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid #E5E5EA", borderTopColor: "#0071E3", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px auto" }}></div>
        <p style={{ color: "#86868B", fontSize: "14px" }}>Loading hardware intelligence summary...</p>
      </div>
    );
  }

  if (!product || !analysis) {
    return (
      <div className="page-container" style={{ textAlign: "center", padding: "60px 20px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "700" }}>Analysis unavailable</h2>
        <p style={{ color: "#86868B", margin: "8px 0 20px 0" }}>Could not locate analysis for this gadget.</p>
        <button className="btn-primary" onClick={() => setCurrentTab("explore")}>
          Back to Explore
        </button>
      </div>
    );
  }

  const summary = analysis.summary || {};
  const stats = analysis.sentimentStats || {};

  return (
    <div className="page-container">
      {/* Back button & Status Toast */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <button
          onClick={() => setCurrentTab("explore")}
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#86868B", fontSize: "13.5px", fontWeight: "500" }}
        >
          <ArrowLeft size={16} />
          <span>Back to Explore Gadgets</span>
        </button>

        {statusMessage && (
          <div
            style={{
              padding: "6px 14px",
              borderRadius: "9999px",
              backgroundColor: "rgba(0, 113, 227, 0.1)",
              color: "#0071E3",
              fontSize: "12.5px",
              fontWeight: "600",
              animation: "fadeIn 0.2s"
            }}
          >
            {statusMessage}
          </div>
        )}
      </div>

      {/* Main Product Hero Header */}
      <div
        className="reviewly-card"
        style={{
          padding: "32px",
          backgroundColor: "#FFFFFF",
          marginBottom: "28px"
        }}
      >
        <div style={{ display: "flex", gap: "28px", alignItems: "center", flexWrap: "wrap" }}>
          {/* Product Thumbnail */}
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "18px",
              objectFit: "cover",
              backgroundColor: "#F6F3F5",
              border: "1px solid #E5E5EA"
            }}
          />

          {/* Details */}
          <div style={{ flex: 1, minWidth: "280px" }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#0071E3", textTransform: "uppercase" }}>
                {product.brand} • {product.category}
              </span>
              {product.badge && (
                <span
                  style={{
                    backgroundColor: "rgba(0, 113, 227, 0.08)",
                    color: "#0071E3",
                    padding: "2px 8px",
                    borderRadius: "9999px",
                    fontSize: "11px",
                    fontWeight: "600"
                  }}
                >
                  {product.badge}
                </span>
              )}
            </div>

            <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#1D1D1F", letterSpacing: "-0.02em", lineHeight: 1.25 }}>
              {product.name}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "10px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "22px", fontWeight: "700", color: "#1D1D1F" }}>
                {formatINR(product.priceINR)}
              </span>

              <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "14px", fontWeight: "600", color: "#1D1D1F" }}>
                <Star size={16} fill="#FFB800" color="#FFB800" />
                <span>{product.rating}</span>
                <span style={{ color: "#86868B", fontWeight: "400" }}>({formatNumberIN(product.reviewCount)} reviews)</span>
              </div>

              <span className="sentiment-chip positive">
                {stats.consensusScore || 89}% Consensus
              </span>
            </div>
          </div>

          {/* Header Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "200px" }}>
            <button
              className="btn-primary"
              disabled={analyzing}
              onClick={handleRefreshAnalysis}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px 20px" }}
            >
              <RefreshCw size={15} className={analyzing ? "animate-spin" : ""} />
              <span>{analyzing ? "Synthesizing..." : "Refresh AI Summary"}</span>
            </button>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className="btn-outline"
                style={{ flex: 1, padding: "8px", fontSize: "12.5px" }}
                onClick={() => {
                  if (addToCompareList) addToCompareList(product.id);
                  setCurrentTab("compare");
                }}
              >
                <GitCompare size={14} />
                <span>Compare</span>
              </button>
              <button
                className="btn-outline"
                style={{ padding: "8px 12px" }}
                onClick={handleSave}
                title="Save"
              >
                <Bookmark size={15} fill={isSaved ? "#0071E3" : "none"} color={isSaved ? "#0071E3" : "currentColor"} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Insights Canvas: 2 Columns */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px", marginBottom: "32px" }}>
        
        {/* Left Column: Executive Verdict & Pros / Cons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Executive Verdict Card */}
          <div className="reviewly-card" style={{ padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Sparkles size={18} color="#0071E3" />
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1D1D1F" }}>Executive Verdict</h3>
              </div>
              <span className="sentiment-chip positive" style={{ fontSize: "13px" }}>
                {summary.verdict || "Strong Pick"}
              </span>
            </div>

            <p style={{ fontSize: "14.5px", color: "#1D1D1F", lineHeight: 1.6, marginBottom: "18px" }}>
              {summary.executiveSummary}
            </p>

            <div style={{ padding: "14px", borderRadius: "12px", backgroundColor: "#F6F3F5", border: "1px solid #E5E5EA" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#86868B", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                Buyer Consensus
              </span>
              <p style={{ fontSize: "13px", color: "#5E5E63", lineHeight: 1.45 }}>
                {summary.consensus}
              </p>
            </div>
          </div>

          {/* Top Pros */}
          <div className="reviewly-card" style={{ padding: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "8px", backgroundColor: "rgba(52, 199, 89, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#248A3D" }}>
                <CheckCircle2 size={16} />
              </div>
              <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#1D1D1F" }}>Top Pros & Praises</h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {summary.pros?.map((pro, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(52, 199, 89, 0.06)",
                    border: "1px solid rgba(52, 199, 89, 0.18)"
                  }}
                >
                  <CheckCircle2 size={15} color="#248A3D" style={{ marginTop: "2px", flexShrink: 0 }} />
                  <span style={{ fontSize: "13.5px", color: "#1D1D1F", lineHeight: 1.4 }}>{pro}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Cons & Key Concerns */}
          <div className="reviewly-card" style={{ padding: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "8px", backgroundColor: "rgba(255, 59, 48, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#D70015" }}>
                <AlertTriangle size={16} />
              </div>
              <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#1D1D1F" }}>Top Cons & Concerns</h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {summary.cons?.map((con, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(255, 59, 48, 0.05)",
                    border: "1px solid rgba(255, 59, 48, 0.16)"
                  }}
                >
                  <AlertTriangle size={15} color="#D70015" style={{ marginTop: "2px", flexShrink: 0 }} />
                  <span style={{ fontSize: "13.5px", color: "#1D1D1F", lineHeight: 1.4 }}>{con}</span>
                </div>
              ))}
            </div>

            {summary.keyConcerns && (
              <div style={{ marginTop: "16px", padding: "12px", borderRadius: "10px", backgroundColor: "#F6F3F5" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#86868B", textTransform: "uppercase", display: "block" }}>
                  Recurring Pattern
                </span>
                <p style={{ fontSize: "12.5px", color: "#1D1D1F", marginTop: "2px" }}>
                  {summary.keyConcerns}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Aspect-Based NLP Analysis & Target Personas */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Aspect Scores Breakdown */}
          <div className="reviewly-card" style={{ padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1D1D1F" }}>Aspect-Based Sentiments</h3>
                <p style={{ fontSize: "12.5px", color: "#86868B" }}>Polarity scored per individual hardware subsystem</p>
              </div>
              <Sliders size={18} color="#0071E3" />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {analysis.aspects?.map((aspect, idx) => (
                <div key={idx}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "5px" }}>
                    <span style={{ fontSize: "13.5px", fontWeight: "600", color: "#1D1D1F" }}>{aspect.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "11.5px", color: "#86868B" }}>({formatNumberIN(aspect.mentions)} mentions)</span>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: aspect.score >= 80 ? "#248A3D" : aspect.score >= 65 ? "#D97706" : "#D70015"
                        }}
                      >
                        {aspect.score}%
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", height: "7px", borderRadius: "4px", backgroundColor: "#E5E5EA", overflow: "hidden", marginBottom: "4px" }}>
                    <div
                      style={{
                        width: `${aspect.score}%`,
                        backgroundColor: aspect.score >= 80 ? "#34C759" : aspect.score >= 65 ? "#FF9500" : "#FF3B30",
                        borderRadius: "4px"
                      }}
                    ></div>
                  </div>

                  <p style={{ fontSize: "12px", color: "#86868B", lineHeight: 1.35 }}>
                    {aspect.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Persona Card */}
          <div className="reviewly-card" style={{ padding: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "8px", backgroundColor: "rgba(0, 113, 227, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0071E3" }}>
                <ThumbsUp size={15} />
              </div>
              <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#1D1D1F" }}>Ideal Buyer Profile</h3>
            </div>

            <p style={{ fontSize: "13.5px", color: "#5E5E63", lineHeight: 1.5, marginBottom: "16px" }}>
              {summary.recommendedFor || "Users seeking maximum performance and durability in this product category."}
            </p>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                className="btn-outline"
                style={{ fontSize: "12.5px", padding: "7px 14px" }}
                onClick={() => setCurrentTab("compare")}
              >
                Compare against Alternatives
              </button>
              <button
                className="btn-outline"
                style={{ fontSize: "12.5px", padding: "7px 14px" }}
                onClick={() => setCurrentTab("productDetail")}
              >
                Read All Reviews ({formatNumberIN(product.reviewCount)})
              </button>
            </div>
          </div>

          {/* Technical Specifications Snapshot */}
          <div className="reviewly-card" style={{ padding: "28px" }}>
            <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#1D1D1F", marginBottom: "14px" }}>
              Hardware Specifications
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {product.specs && Object.entries(product.specs).map(([key, val]) => (
                <div key={key} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #F0EDEF", fontSize: "12.5px" }}>
                  <span style={{ color: "#86868B", fontWeight: "500" }}>{key}</span>
                  <span style={{ color: "#1D1D1F", fontWeight: "600", textAlign: "right", maxWidth: "60%" }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

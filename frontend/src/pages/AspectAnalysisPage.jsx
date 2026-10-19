import React, { useState, useEffect } from "react";
import { Sliders, Sparkles, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { getProducts } from "../services/firestoreService";
import { INITIAL_PRODUCTS } from "../services/seedData";
import { formatNumberIN } from "../utils/currency";

export default function AspectAnalysisPage({ setCurrentTab, setSelectedProductId }) {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setLocalSelectedProductId] = useState(INITIAL_PRODUCTS[0]?.id);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const prods = await getProducts();
        setProducts(prods);
        if (prods.length > 0 && !selectedProductId) {
          setLocalSelectedProductId(prods[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const currentProduct = products.find((p) => p.id === selectedProductId) || products[0] || INITIAL_PRODUCTS[0];

  return (
    <div className="page-container">
      <div style={{ marginBottom: "28px" }}>
        <span style={{ fontSize: "12px", fontWeight: "700", color: "#0071E3", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          NLP Deep Dive
        </span>
        <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#1D1D1F", letterSpacing: "-0.02em", marginTop: "4px" }}>
          Aspect-Based Sentiment Analysis
        </h1>
        <p style={{ fontSize: "14px", color: "#86868B", marginTop: "4px" }}>
          Clause-level polarity extraction across battery, performance, acoustic clarity, ergonomics, and build.
        </p>
      </div>

      {/* Gadget Selector Tabs */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "12px", marginBottom: "28px" }}>
        {products.map((p) => {
          const isSelected = p.id === currentProduct?.id;
          return (
            <button
              key={p.id}
              onClick={() => setLocalSelectedProductId(p.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
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
              <span>{p.name.split(" (")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Current Gadget Aspect Showcase */}
      {currentProduct && (
        <div>
          {/* Header */}
          <div className="reviewly-card" style={{ padding: "24px 28px", backgroundColor: "#FFFFFF", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <img
                src={currentProduct.imageUrl}
                alt={currentProduct.name}
                style={{ width: "54px", height: "54px", borderRadius: "12px", objectFit: "cover", backgroundColor: "#F6F3F5" }}
              />
              <div>
                <span style={{ fontSize: "11px", fontWeight: "600", color: "#86868B", textTransform: "uppercase" }}>
                  {currentProduct.brand} • {currentProduct.category}
                </span>
                <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#1D1D1F" }}>{currentProduct.name}</h3>
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={() => {
                if (setSelectedProductId) setSelectedProductId(currentProduct.id);
                setCurrentTab("summary");
              }}
            >
              <span>View Full Summary</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Aspect Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
            {currentProduct.aspects?.map((aspect, idx) => (
              <div key={idx} className="reviewly-card" style={{ padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Sliders size={16} color="#0071E3" />
                    <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#1D1D1F" }}>{aspect.name}</h4>
                  </div>
                  <span
                    className="sentiment-chip"
                    style={{
                      backgroundColor: aspect.score >= 80 ? "rgba(52, 199, 89, 0.12)" : aspect.score >= 65 ? "rgba(245, 158, 11, 0.12)" : "rgba(255, 59, 48, 0.10)",
                      color: aspect.score >= 80 ? "#248A3D" : aspect.score >= 65 ? "#D97706" : "#D70015",
                      border: `1px solid ${aspect.score >= 80 ? "rgba(52, 199, 89, 0.25)" : aspect.score >= 65 ? "rgba(245, 158, 11, 0.25)" : "rgba(255, 59, 48, 0.22)"}`
                    }}
                  >
                    {aspect.score}% Approval
                  </span>
                </div>

                <div style={{ height: "6px", borderRadius: "4px", backgroundColor: "#E5E5EA", overflow: "hidden", marginBottom: "12px" }}>
                  <div
                    style={{
                      width: `${aspect.score}%`,
                      height: "100%",
                      backgroundColor: aspect.score >= 80 ? "#34C759" : aspect.score >= 65 ? "#FF9500" : "#D70015"
                    }}
                  ></div>
                </div>

                <p style={{ fontSize: "13px", color: "#5E5E63", lineHeight: 1.45, marginBottom: "12px" }}>
                  {aspect.summary}
                </p>

                <div style={{ fontSize: "11.5px", color: "#86868B", paddingTop: "10px", borderTop: "1px solid #F0EDEF" }}>
                  Extracted from {formatNumberIN(aspect.mentions)} individual review sentences
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

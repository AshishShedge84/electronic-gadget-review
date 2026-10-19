import React, { useState, useEffect } from "react";
import {
  GitCompare,
  Plus,
  Trash2,
  CheckCircle2,
  Star,
  Sparkles,
  ArrowRight,
  Share2,
  AlertCircle
} from "lucide-react";
import { getProducts, getProductById } from "../services/firestoreService";
import { INITIAL_PRODUCTS } from "../services/seedData";
import { formatINR, formatNumberIN } from "../utils/currency";

export default function ProductComparisonPage({ compareList = [], setCompareList, setCurrentTab, setSelectedProductId }) {
  const [allProducts, setAllProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [comparedProducts, setComparedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Initialize selected products
  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      try {
        const prods = await getProducts();
        setAllProducts(prods);

        let initialIds = compareList;
        if (!initialIds || initialIds.length === 0) {
          // Default to first 2 products for rich demonstration
          initialIds = [INITIAL_PRODUCTS[0]?.id, INITIAL_PRODUCTS[1]?.id].filter(Boolean);
        }
        setSelectedIds(initialIds);
      } catch (err) {
        console.error("Failed to load products for comparison:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, [compareList]);

  // Load detailed items for selected IDs
  useEffect(() => {
    if (selectedIds.length > 0 && allProducts.length > 0) {
      const items = selectedIds
        .map((id) => allProducts.find((p) => p.id === id))
        .filter(Boolean);
      setComparedProducts(items);
    } else {
      setComparedProducts([]);
    }
  }, [selectedIds, allProducts]);

  const handleAddProduct = (productId) => {
    if (!productId) return;
    if (selectedIds.length >= 4) {
      alert("You can compare up to 4 devices simultaneously.");
      return;
    }
    if (!selectedIds.includes(productId)) {
      setSelectedIds([...selectedIds, productId]);
    }
  };

  const handleRemoveProduct = (productId) => {
    setSelectedIds(selectedIds.filter((id) => id !== productId));
  };

  const handleClearAll = () => {
    setSelectedIds([]);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Determine algorithmic winner among selected items
  const winner = comparedProducts.length >= 2
    ? [...comparedProducts].sort((a, b) => (b.sentimentStats?.consensusScore || 0) - (a.sentimentStats?.consensusScore || 0))[0]
    : null;

  // Extract all unique spec keys
  const allSpecKeys = Array.from(
    new Set(comparedProducts.flatMap((p) => (p.specs ? Object.keys(p.specs) : [])))
  );

  return (
    <div className="page-container">
      {/* Title & Actions Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
        <div>
          <span style={{ fontSize: "12px", fontWeight: "700", color: "#0071E3", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Decision Intelligence
          </span>
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#1D1D1F", letterSpacing: "-0.02em", marginTop: "4px" }}>
            Hardware Comparison Matrix
          </h1>
          <p style={{ fontSize: "14px", color: "#86868B", marginTop: "4px" }}>
            Objective side-by-side analysis of specifications, consensus metrics, and price differential in INR (₹).
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {comparedProducts.length > 0 && (
            <>
              <button
                className="btn-outline"
                onClick={handleShare}
                style={{ fontSize: "13px", padding: "8px 16px" }}
              >
                <Share2 size={15} />
                <span>{copied ? "Link Copied!" : "Share Matrix"}</span>
              </button>
              <button
                className="btn-outline"
                onClick={handleClearAll}
                style={{ fontSize: "13px", padding: "8px 16px", color: "#D70015" }}
              >
                <Trash2 size={15} />
                <span>Clear All</span>
              </button>
            </>
          )}

          {/* Add device selector */}
          {selectedIds.length < 4 && (
            <select
              onChange={(e) => {
                handleAddProduct(e.target.value);
                e.target.value = "";
              }}
              defaultValue=""
              style={{
                height: "38px",
                padding: "0 14px",
                borderRadius: "9999px",
                border: "1px solid #0071E3",
                backgroundColor: "#0071E3",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: "500",
                cursor: "pointer",
                outline: "none"
              }}
            >
              <option value="" disabled>+ Add Gadget to Compare</option>
              {allProducts
                .filter((p) => !selectedIds.includes(p.id))
                .map((p) => (
                  <option key={p.id} value={p.id} style={{ color: "#1D1D1F", backgroundColor: "#FFFFFF" }}>
                    {p.name} ({formatINR(p.priceINR)})
                  </option>
                ))}
            </select>
          )}
        </div>
      </div>

      {/* Empty State */}
      {comparedProducts.length === 0 ? (
        <div className="reviewly-card" style={{ padding: "64px 24px", textAlign: "center" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "rgba(0, 113, 227, 0.1)", color: "#0071E3", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto" }}>
            <GitCompare size={26} />
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1D1D1F" }}>No gadgets in comparison matrix</h3>
          <p style={{ fontSize: "13.5px", color: "#86868B", maxWidth: "420px", margin: "6px auto 20px auto" }}>
            Select 2 or more products from the catalog to evaluate hardware differences, sentiment scores, and value for money.
          </p>
          <button className="btn-primary" onClick={() => setCurrentTab("explore")}>
            Browse Gadget Catalog
          </button>
        </div>
      ) : (
        <>
          {/* AI Decision Consensus Verdict Banner */}
          {winner && (
            <div
              className="reviewly-card"
              style={{
                padding: "24px 28px",
                backgroundColor: "#FFFFFF",
                borderLeft: "4px solid #0071E3",
                marginBottom: "28px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px"
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <Sparkles size={16} color="#0071E3" />
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#0071E3", textTransform: "uppercase" }}>
                    Algorithmic Decision Verdict
                  </span>
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1D1D1F" }}>
                  {winner.name} leads current selection with {winner.sentimentStats?.consensusScore || 90}% sentiment approval.
                </h3>
                <p style={{ fontSize: "13.5px", color: "#5E5E63", marginTop: "4px" }}>
                  Offers stronger consensus on {winner.aspects?.[0]?.name || "build"} and {winner.aspects?.[1]?.name || "battery endurance"} relative to compared alternatives.
                </p>
              </div>

              <button
                className="btn-primary"
                onClick={() => {
                  if (setSelectedProductId) setSelectedProductId(winner.id);
                  setCurrentTab("summary");
                }}
                style={{ fontSize: "13px" }}
              >
                <span>Read Full Verdict</span>
                <ArrowRight size={15} />
              </button>
            </div>
          )}

          {/* Horizontally Scrollable Comparison Table Container */}
          <div
            className="reviewly-card"
            style={{
              overflowX: "auto",
              backgroundColor: "#FFFFFF",
              marginBottom: "32px",
              border: "1px solid #E5E5EA"
            }}
          >
            <table style={{ width: "100%", minWidth: `${Math.max(680, comparedProducts.length * 280)}px`, borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #E5E5EA" }}>
                  <th style={{ padding: "24px 20px", width: "200px", verticalAlign: "top", backgroundColor: "#FBFBFD" }}>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#86868B", textTransform: "uppercase" }}>
                      Products ({comparedProducts.length})
                    </span>
                  </th>
                  {comparedProducts.map((p) => (
                    <th key={p.id} style={{ padding: "24px 20px", verticalAlign: "top", borderLeft: "1px solid #E5E5EA" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "600", color: "#0071E3", textTransform: "uppercase" }}>
                          {p.brand}
                        </span>
                        <button
                          onClick={() => handleRemoveProduct(p.id)}
                          style={{ color: "#86868B", padding: "4px", borderRadius: "6px" }}
                          title="Remove from comparison"
                          aria-label={`Remove ${p.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        style={{ width: "100%", height: "130px", objectFit: "cover", borderRadius: "12px", backgroundColor: "#F6F3F5", marginBottom: "12px" }}
                      />

                      <h4 style={{ fontSize: "15px", fontWeight: "600", color: "#1D1D1F", lineHeight: 1.3, marginBottom: "8px" }}>
                        {p.name}
                      </h4>

                      <div style={{ fontSize: "18px", fontWeight: "700", color: "#1D1D1F", marginBottom: "8px" }}>
                        {formatINR(p.priceINR)}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px" }}>
                        <Star size={14} fill="#FFB800" color="#FFB800" />
                        <span style={{ fontWeight: "700" }}>{p.rating}</span>
                        <span style={{ color: "#86868B" }}>({formatNumberIN(p.reviewCount)})</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* Consensus Score Row */}
                <tr style={{ borderBottom: "1px solid #E5E5EA", backgroundColor: "#FBFBFD" }}>
                  <td style={{ padding: "16px 20px", fontWeight: "600", fontSize: "13px", color: "#1D1D1F" }}>
                    Consensus Score
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} style={{ padding: "16px 20px", borderLeft: "1px solid #E5E5EA" }}>
                      <span className="sentiment-chip positive">
                        {p.sentimentStats?.consensusScore || 85}% Positive
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Verdict Row */}
                <tr style={{ borderBottom: "1px solid #E5E5EA" }}>
                  <td style={{ padding: "16px 20px", fontWeight: "600", fontSize: "13px", color: "#1D1D1F" }}>
                    AI Summary Verdict
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} style={{ padding: "16px 20px", borderLeft: "1px solid #E5E5EA", fontSize: "13px", color: "#5E5E63" }}>
                      {p.summary?.verdict || "Strong Pick"}
                    </td>
                  ))}
                </tr>

                {/* Top Advantage */}
                <tr style={{ borderBottom: "1px solid #E5E5EA", backgroundColor: "#FBFBFD" }}>
                  <td style={{ padding: "16px 20px", fontWeight: "600", fontSize: "13px", color: "#1D1D1F" }}>
                    Key Strength
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} style={{ padding: "16px 20px", borderLeft: "1px solid #E5E5EA", fontSize: "13px", color: "#248A3D" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <CheckCircle2 size={14} color="#248A3D" />
                        <span>{p.summary?.pros?.[0] || "Solid hardware benchmark scores"}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Key Caveat */}
                <tr style={{ borderBottom: "1px solid #E5E5EA" }}>
                  <td style={{ padding: "16px 20px", fontWeight: "600", fontSize: "13px", color: "#1D1D1F" }}>
                    Key Caution / Caveat
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} style={{ padding: "16px 20px", borderLeft: "1px solid #E5E5EA", fontSize: "13px", color: "#D70015" }}>
                      <span>{p.summary?.cons?.[0] || "Premium price point"}</span>
                    </td>
                  ))}
                </tr>

                {/* Specifications Rows */}
                {allSpecKeys.map((key) => (
                  <tr key={key} style={{ borderBottom: "1px solid #E5E5EA" }}>
                    <td style={{ padding: "14px 20px", fontWeight: "500", fontSize: "13px", color: "#86868B" }}>
                      {key}
                    </td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} style={{ padding: "14px 20px", borderLeft: "1px solid #E5E5EA", fontSize: "13px", color: "#1D1D1F", fontWeight: "500" }}>
                        {p.specs?.[key] || <span style={{ color: "#A1A1A6" }}>Not applicable</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Bookmark, Trash2, GitCompare, Sparkles, Star, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getUserSavedProducts, toggleSaveProduct } from "../services/firestoreService";
import { formatINR } from "../utils/currency";

export default function SavedProductsPage({ setCurrentTab, setSelectedProductId, addToCompareList }) {
  const { user } = useAuth();
  const [savedProducts, setSavedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSaved() {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const saved = await getUserSavedProducts(user.uid);
        setSavedProducts(saved);
      } catch (err) {
        console.error("Failed to load saved products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSaved();
  }, [user]);

  const handleRemove = async (product) => {
    if (!user) return;
    try {
      await toggleSaveProduct(user.uid, product);
      setSavedProducts(savedProducts.filter((p) => p.id !== product.id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: "28px" }}>
        <span style={{ fontSize: "12px", fontWeight: "700", color: "#0071E3", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          User Library
        </span>
        <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#1D1D1F", letterSpacing: "-0.02em", marginTop: "4px" }}>
          Saved Gadgets
        </h1>
        <p style={{ fontSize: "14px", color: "#86868B", marginTop: "4px" }}>
          Your bookmarked devices synchronized with Firebase Firestore.
        </p>
      </div>

      {!user ? (
        <div className="reviewly-card" style={{ padding: "64px 24px", textAlign: "center" }}>
          <Bookmark size={40} color="#86868B" style={{ margin: "0 auto 16px auto" }} />
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1D1D1F" }}>Sign in to access saved gadgets</h3>
          <p style={{ fontSize: "13.5px", color: "#86868B", maxWidth: "400px", margin: "6px auto 20px auto" }}>
            Create a free account or sign in with Google to bookmark electronics and track consensus shifts over time.
          </p>
          <button className="btn-primary" onClick={() => setCurrentTab("login")}>
            Sign In to Electronic Gadget Review
          </button>
        </div>
      ) : loading ? (
        <div style={{ textAlign: "center", padding: "60px" }}>
          <p style={{ color: "#86868B" }}>Retrieving saved items from Firestore...</p>
        </div>
      ) : savedProducts.length === 0 ? (
        <div className="reviewly-card" style={{ padding: "64px 24px", textAlign: "center" }}>
          <Bookmark size={40} color="#86868B" style={{ margin: "0 auto 16px auto" }} />
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1D1D1F" }}>No saved gadgets yet</h3>
          <p style={{ fontSize: "13.5px", color: "#86868B", maxWidth: "400px", margin: "6px auto 20px auto" }}>
            Explore the catalog and tap the bookmark icon on any smartphone, laptop, or headphone to save it here.
          </p>
          <button className="btn-primary" onClick={() => setCurrentTab("explore")}>
            Explore Electronics
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
          {savedProducts.map((prod) => (
            <div
              key={prod.id}
              className="reviewly-card interactive"
              style={{ padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
            >
              <div>
                <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "14px" }}>
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    style={{ width: "70px", height: "70px", borderRadius: "12px", objectFit: "cover", backgroundColor: "#F6F3F5" }}
                  />
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "#86868B", textTransform: "uppercase" }}>
                      {prod.brand} • {prod.category}
                    </span>
                    <h4 style={{ fontSize: "15px", fontWeight: "600", color: "#1D1D1F", lineHeight: 1.3 }}>
                      {prod.name}
                    </h4>
                    <span style={{ fontSize: "16px", fontWeight: "700", color: "#0071E3", display: "block", marginTop: "2px" }}>
                      {formatINR(prod.priceINR)}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", paddingTop: "14px", borderTop: "1px solid #E5E5EA" }}>
                <button
                  className="btn-primary"
                  style={{ flex: 1, padding: "8px", fontSize: "12px" }}
                  onClick={() => {
                    if (setSelectedProductId) setSelectedProductId(prod.id);
                    setCurrentTab("summary");
                  }}
                >
                  <Sparkles size={13} />
                  <span>AI Summary</span>
                </button>

                <button
                  className="btn-outline"
                  style={{ padding: "8px 12px", fontSize: "12px" }}
                  onClick={() => {
                    if (addToCompareList) addToCompareList(prod.id);
                    setCurrentTab("compare");
                  }}
                  title="Add to Comparison"
                >
                  <GitCompare size={14} />
                </button>

                <button
                  className="btn-outline"
                  style={{ padding: "8px 12px", color: "#D70015" }}
                  onClick={() => handleRemove(prod)}
                  title="Remove from saved"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { History, Trash2, ArrowRight, Sparkles, Clock, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getUserHistory, deleteHistoryEntry } from "../services/firestoreService";

export default function HistoryPage({ setCurrentTab, setSelectedProductId }) {
  const { user } = useAuth();
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const items = await getUserHistory(user.uid);
        setHistoryItems(items);
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this analysis entry?")) return;
    try {
      await deleteHistoryEntry(user.uid, id);
      setHistoryItems(historyItems.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: "28px" }}>
        <span style={{ fontSize: "12px", fontWeight: "700", color: "#0071E3", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          User Activity
        </span>
        <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#1D1D1F", letterSpacing: "-0.02em", marginTop: "4px" }}>
          Analysis History
        </h1>
        <p style={{ fontSize: "14px", color: "#86868B", marginTop: "4px" }}>
          Record of all your AI review synthesis runs and consensus checks.
        </p>
      </div>

      {!user ? (
        <div className="reviewly-card" style={{ padding: "64px 24px", textAlign: "center" }}>
          <History size={40} color="#86868B" style={{ margin: "0 auto 16px auto" }} />
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1D1D1F" }}>Sign in to view your analysis history</h3>
          <p style={{ fontSize: "13.5px", color: "#86868B", maxWidth: "400px", margin: "6px auto 20px auto" }}>
            Analyses generated while signed in are permanently synchronized in Firestore.
          </p>
          <button className="btn-primary" onClick={() => setCurrentTab("login")}>
            Sign In
          </button>
        </div>
      ) : loading ? (
        <div style={{ textAlign: "center", padding: "60px" }}>
          <p style={{ color: "#86868B" }}>Retrieving activity from Firestore...</p>
        </div>
      ) : historyItems.length === 0 ? (
        <div className="reviewly-card" style={{ padding: "64px 24px", textAlign: "center" }}>
          <Clock size={40} color="#86868B" style={{ margin: "0 auto 16px auto" }} />
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1D1D1F" }}>No analyses recorded yet</h3>
          <p style={{ fontSize: "13.5px", color: "#86868B", maxWidth: "420px", margin: "6px auto 20px auto" }}>
            When you view or refresh an AI review summary for any gadget, the result will appear here.
          </p>
          <button className="btn-primary" onClick={() => setCurrentTab("explore")}>
            Explore Gadgets
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {historyItems.map((item) => (
            <div
              key={item.id}
              className="reviewly-card"
              style={{
                padding: "20px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "10px", backgroundColor: "#F0EDEF", display: "flex", alignItems: "center", justifyContent: "center", color: "#0071E3" }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#1D1D1F" }}>
                    {item.productName || "Hardware Analysis"}
                  </h4>
                  <span style={{ fontSize: "12px", color: "#86868B" }}>
                    {item.date ? new Date(item.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recent"}
                    {" • "}
                    Verdict: <strong style={{ color: "#248A3D" }}>{item.verdict || "Strong Pick"}</strong>
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  className="btn-outline"
                  style={{ fontSize: "12.5px", padding: "8px 14px" }}
                  onClick={() => {
                    if (setSelectedProductId) setSelectedProductId(item.productId);
                    setCurrentTab("summary");
                  }}
                >
                  <span>Open Summary</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  className="btn-outline"
                  style={{ padding: "8px 10px", color: "#D70015" }}
                  onClick={() => handleDelete(item.id)}
                  title="Delete record"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

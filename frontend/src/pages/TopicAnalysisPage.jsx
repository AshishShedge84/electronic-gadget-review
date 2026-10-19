import React, { useState, useEffect } from "react";
import { Layers, Smartphone, Tag, CheckCircle2 } from "lucide-react";
import { getProductsApi, getProductAnalyticsApi } from "../services/api";

export default function TopicAnalysisPage() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const pRes = await getProductsApi();
        setProducts(pRes.data || []);
        if (pRes.data?.length > 0) {
          setSelectedProductId(pRes.data[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  useEffect(() => {
    async function loadTopics() {
      if (!selectedProductId) return;
      setLoading(true);
      try {
        const res = await getProductAnalyticsApi(selectedProductId);
        setTopics(res.data.topics || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTopics();
  }, [selectedProductId]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div className="badge badge-indigo" style={{ marginBottom: 8 }}>ASTMA Topic Clustering</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>
            Unsupervised Topic & Theme Modeling
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            Discover latent themes and customer conversation clusters derived via TF-IDF centroid grouping.
          </p>
        </div>

        <div style={{ minWidth: 220 }}>
          <select
            className="input-field"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.brand})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
          Clustering customer reviews into thematic vectors...
        </div>
      ) : topics.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 40 }}>
          No topics discovered for this gadget yet.
        </div>
      ) : (
        <div className="grid-2">
          {topics.map((tp, idx) => (
            <div key={idx} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Layers size={18} color="var(--accent-primary)" />
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff" }}>{tp.topic}</h3>
                  </div>
                  <span className="badge badge-indigo">
                    Weight: {Math.round((tp.score || 0.25) * 100)}%
                  </span>
                </div>

                <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16 }}>
                  {tp.description}
                </p>
              </div>

              <div style={{ paddingTop: 12, borderTop: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: 6 }}>
                <Tag size={13} color="var(--text-muted)" />
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  Unsupervised Cluster #{idx + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

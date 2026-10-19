import React, { useState, useEffect } from "react";
import { Hash, BookOpen, Layers } from "lucide-react";
import { getKeywordAnalyticsApi } from "../services/api";
import KeywordBadgeList from "../charts/KeywordBadgeList";

export default function KeywordAnalysisPage() {
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await getKeywordAnalyticsApi();
        setKeywords(res.data.top_keywords || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <div className="badge badge-indigo" style={{ marginBottom: 8 }}>ASTMA Statistical NLP</div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>
          TF-IDF Keyword Extraction Engine
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
          Term Frequency-Inverse Document Frequency isolates statistically distinguishing hardware descriptors.
        </p>
      </div>

      <div className="card">
        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: 12 }}>
          Salient Keywords Cloud
        </h3>
        <KeywordBadgeList keywords={keywords} />
      </div>

      {/* TF-IDF Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Extracted Keyword / N-Gram</th>
              <th>Occurrence Frequency</th>
              <th>Mean TF-IDF Weight</th>
              <th>Feature Salience</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ textAlign: "center", padding: 30 }}>Loading keywords...</td></tr>
            ) : (
              keywords.map((kw, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, color: "#fff" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.88rem" }}>{kw.keyword}</span>
                  </td>
                  <td>{kw.frequency} occurrences</td>
                  <td style={{ color: "var(--accent-primary)", fontWeight: 600 }}>{kw.score}</td>
                  <td>
                    <span className={`badge ${kw.score >= 0.4 ? "badge-indigo" : "badge-neutral"}`}>
                      {kw.score >= 0.4 ? "High Weight" : "Moderate Weight"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Formula & Methodological Documentation */}
      <div className="card" style={{ background: "#0c1322", borderColor: "#1e293b" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <BookOpen size={18} color="var(--accent-primary)" />
          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#fff" }}>
            Mathematical Definition of TF-IDF
          </h3>
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "#93c5fd", background: "var(--bg-primary)", padding: 12, borderRadius: 6, marginBottom: 10 }}>
          TF-IDF(t, d, D) = TF(t, d) &times; ln((1 + |D|) / (1 + DF(t, D))) + 1
        </div>
        <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          Terms appearing abundantly across all documents (e.g. general words) are penalized by the inverse document frequency term, ensuring only product-discriminating feature words receive high scores.
        </p>
      </div>
    </div>
  );
}

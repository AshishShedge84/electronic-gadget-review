import React from "react";
import { Hash } from "lucide-react";

export default function KeywordBadgeList({ keywords = [] }) {
  if (!keywords || keywords.length === 0) {
    return (
      <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", padding: "12px 0" }}>
        No TF-IDF extracted keywords found.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", maxHeight: 220, overflowY: "auto", padding: "4px" }}>
      {keywords.map((kw, idx) => {
        // Vary badge opacity/color by score
        const score = typeof kw.score === "number" ? kw.score : 0.5;
        const isHigh = score >= 0.4;
        return (
          <div
            key={idx}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: isHigh ? "rgba(99, 102, 241, 0.2)" : "var(--bg-surface)",
              border: `1px solid ${isHigh ? "#6366f1" : "var(--border-color)"}`,
              borderRadius: "var(--radius-sm)",
              padding: "5px 10px",
              fontSize: "0.82rem",
              color: isHigh ? "#c7d2fe" : "var(--text-secondary)",
              transition: "transform 0.1s",
            }}
            title={`TF-IDF Score: ${kw.score} | Frequency: ${kw.frequency}`}
          >
            <Hash size={12} color={isHigh ? "#818cf8" : "var(--text-muted)"} />
            <span style={{ fontWeight: 600 }}>{kw.keyword}</span>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", background: "#0f172a", padding: "1px 5px", borderRadius: "4px" }}>
              {kw.frequency}
            </span>
          </div>
        );
      })}
    </div>
  );
}

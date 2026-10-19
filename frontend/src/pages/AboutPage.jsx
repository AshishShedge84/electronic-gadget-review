import React from "react";
import { Sparkles, Cpu, Layers, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

export default function AboutPage({ setCurrentTab }) {
  return (
    <div className="page-container" style={{ maxWidth: "920px" }}>
      <div style={{ marginBottom: "32px", textAlign: "center" }}>
        <span style={{ fontSize: "12px", fontWeight: "700", color: "#0071E3", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Platform Architecture
        </span>
        <h1 style={{ fontSize: "36px", fontWeight: "700", color: "#1D1D1F", letterSpacing: "-0.02em", marginTop: "4px" }}>
          About Electronic Gadget Review
        </h1>
        <p style={{ fontSize: "16px", color: "#86868B", maxWidth: "600px", margin: "8px auto 0 auto", lineHeight: 1.5 }}>
          Engineering transparency and objective consensus in consumer hardware evaluations.
        </p>
      </div>

      {/* Core Mission */}
      <div className="reviewly-card" style={{ padding: "36px", backgroundColor: "#FFFFFF", marginBottom: "28px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#1D1D1F", marginBottom: "12px" }}>
          The Consumer Electronics Dilemma
        </h2>
        <p style={{ fontSize: "14.5px", color: "#5E5E63", lineHeight: 1.6, marginBottom: "16px" }}>
          Modern gadget purchasing is paralyzed by thousands of unstructured, conflicting online reviews and sponsored creator videos. Buyers cannot reliably tell whether a negative review represents a systemic battery defect or a single damaged shipment.
        </p>
        <p style={{ fontSize: "14.5px", color: "#5E5E63", lineHeight: 1.6 }}>
          <strong>Electronic Gadget Review</strong> applies an academic tri-layer synthesis—combining Enterprise Relational Systems (ES), IT Project Quality Governance (ITPM), and Advanced Text & Media Analytics (ASTMA)—to transform raw customer feedback into calibrated, weighted consensus verdicts.
        </p>
      </div>

      {/* 3 Pillars */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", marginBottom: "32px" }}>
        <div className="reviewly-card" style={{ padding: "24px" }}>
          <div style={{ width: "38px", height: "38px", borderRadius: "10px", backgroundColor: "rgba(0, 113, 227, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0071E3", marginBottom: "14px" }}>
            <Cpu size={20} />
          </div>
          <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1D1D1F", marginBottom: "6px" }}>7-Stage NLP Pipeline</h3>
          <p style={{ fontSize: "13px", color: "#86868B", lineHeight: 1.45 }}>
            Tokenization, clause-level stopword removal, suffix stemming, VADER valence scoring, and ABSA topic extraction.
          </p>
        </div>

        <div className="reviewly-card" style={{ padding: "24px" }}>
          <div style={{ width: "38px", height: "38px", borderRadius: "10px", backgroundColor: "rgba(52, 199, 89, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#248A3D", marginBottom: "14px" }}>
            <ShieldCheck size={20} />
          </div>
          <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1D1D1F", marginBottom: "6px" }}>Verified Attribution</h3>
          <p style={{ fontSize: "13px", color: "#86868B", lineHeight: 1.45 }}>
            Spam filtering and verified purchase weighting ensure algorithmic verdicts cannot be gamed by artificial bot floods.
          </p>
        </div>

        <div className="reviewly-card" style={{ padding: "24px" }}>
          <div style={{ width: "38px", height: "38px", borderRadius: "10px", backgroundColor: "rgba(217, 119, 6, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#D97706", marginBottom: "14px" }}>
            <Layers size={20} />
          </div>
          <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1D1D1F", marginBottom: "6px" }}>India-First Pricing</h3>
          <p style={{ fontSize: "13px", color: "#86868B", lineHeight: 1.45 }}>
            Every specification and price differential is formatted strictly in Indian Rupees (₹) with realistic local availability.
          </p>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "24px" }}>
        <button className="btn-primary" onClick={() => setCurrentTab("explore")}>
          <span>Explore Synthesized Gadgets</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

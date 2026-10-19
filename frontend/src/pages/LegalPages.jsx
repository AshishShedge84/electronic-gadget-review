import React from "react";
import { ArrowLeft, Shield } from "lucide-react";

export function PrivacyPage({ setCurrentTab }) {
  return (
    <div className="page-container" style={{ maxWidth: "800px" }}>
      <div style={{ marginBottom: "20px", minHeight: "44px", display: "flex", alignItems: "center" }}>
        <button
          onClick={() => setCurrentTab("landing")}
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#86868B", fontSize: "13.5px", fontWeight: "500", minHeight: "44px", padding: "0 8px" }}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="reviewly-card" style={{ padding: "36px", backgroundColor: "#FFFFFF" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1D1D1F", marginBottom: "16px" }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: "13.5px", color: "#86868B", marginBottom: "20px" }}>
          Last updated: October 2026
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "14px", color: "#5E5E63", lineHeight: 1.6 }}>
          <p>
            At <strong>Electronic Gadget Review</strong>, we respect user privacy. This policy outlines how information is handled when using our electronics review synthesis platform.
          </p>
          <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1D1D1F" }}>1. Data Storage & Authentication</h3>
          <p>
            User authentication and profile storage are handled securely through Firebase Authentication and Google Cloud Firestore. We do not store plain-text passwords or sell personal data to advertisers.
          </p>
          <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1D1D1F" }}>2. Review Processing</h3>
          <p>
            Review evaluations are processed purely for algorithmic sentiment calculation, topic clustering, and consensus summaries.
          </p>
          <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1D1D1F" }}>3. Data Control</h3>
          <p>
            You can delete your review analysis history or saved gadgets at any time from within your account settings.
          </p>
        </div>
      </div>
    </div>
  );
}

export function TermsPage({ setCurrentTab }) {
  return (
    <div className="page-container" style={{ maxWidth: "800px" }}>
      <div style={{ marginBottom: "20px", minHeight: "44px", display: "flex", alignItems: "center" }}>
        <button
          onClick={() => setCurrentTab("landing")}
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#86868B", fontSize: "13.5px", fontWeight: "500", minHeight: "44px", padding: "0 8px" }}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="reviewly-card" style={{ padding: "36px", backgroundColor: "#FFFFFF" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1D1D1F", marginBottom: "16px" }}>
          Terms of Service
        </h1>
        <p style={{ fontSize: "13.5px", color: "#86868B", marginBottom: "20px" }}>
          Last updated: October 2026
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "14px", color: "#5E5E63", lineHeight: 1.6 }}>
          <p>
            Welcome to <strong>Electronic Gadget Review</strong>. By accessing our platform, you agree to these Terms of Service.
          </p>
          <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1D1D1F" }}>1. Algorithmic Recommendations</h3>
          <p>
            Hardware consensus ratings and sentiment breakdowns are provided for consumer guidance only. Specifications are derived from official hardware tear-downs and manufacturer data sheets.
          </p>
          <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1D1D1F" }}>2. Account Responsibility</h3>
          <p>
            Users are responsible for maintaining the confidentiality of their credentials and all activities occurring under their accounts.
          </p>
          <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1D1D1F" }}>3. Intellectual Property</h3>
          <p>
            All Electronic Gadget Review proprietary consensus algorithms, ABSA classification weights, and platform designs are protected under applicable intellectual property laws.
          </p>
        </div>
      </div>
    </div>
  );
}

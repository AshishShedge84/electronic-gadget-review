import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, Sliders, GitCompare } from "lucide-react";

export default function HelpPage({ setCurrentTab }) {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "How does Electronic Gadget Review calculate the Consensus Score?",
      a: "Our consensus engine parses verified customer evaluations using a multi-stage NLP pipeline. We weigh reviews by verification status, extract sentiment polarity scores (ranging from -1.0 to +1.0) using VADER and clause-level ABSA, and compute a normalized approval percentage. A score above 85% denotes a 'Strong Pick'."
    },
    {
      q: "What is Aspect-Based Sentiment Analysis (ABSA)?",
      a: "Standard star ratings fail when a user loves the camera but hates the battery. ABSA breaks complex sentences into individual hardware clauses—evaluating Battery Life, Display, Sound Quality, and Thermal Performance independently so you see granular strengths and flaws."
    },
    {
      q: "Are the gadget prices always in Indian Rupees (INR)?",
      a: "Yes. In adherence to our India-First architecture, all pricing, budget comparisons, and savings calculations across smartphones, laptops, headphones, smartwatches, and tablets are explicitly formatted in Indian Rupees (₹ / INR)."
    },
    {
      q: "How does the Comparison Matrix choose a winner?",
      a: "The comparison engine dynamically sorts selected devices by their underlying consensus scores, aspect ratings, and verified review sample depth. It highlights key differences and calls out situational advantages (e.g. clamp comfort vs battery life)."
    },
    {
      q: "Where is my profile, history, and saved data stored?",
      a: "All user accounts, saved gadgets, and analysis history are securely stored in Google Cloud Firestore and authenticated via Firebase Auth. Your data persists across reloads, browser restarts, and authorized devices."
    }
  ];

  return (
    <div className="page-container" style={{ maxWidth: "840px" }}>
      <div style={{ marginBottom: "32px", textAlign: "center" }}>
        <span style={{ fontSize: "12px", fontWeight: "700", color: "#0071E3", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Documentation & Support
        </span>
        <h1 style={{ fontSize: "36px", fontWeight: "700", color: "#1D1D1F", letterSpacing: "-0.02em", marginTop: "4px" }}>
          Help & Frequently Asked Questions
        </h1>
        <p style={{ fontSize: "15px", color: "#86868B", marginTop: "6px" }}>
          Learn how to get the most out of Electronic Gadget Review's review synthesis tools.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="reviewly-card"
              style={{
                padding: "20px 24px",
                backgroundColor: "#FFFFFF",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: "44px" }}>
                <h3 style={{ fontSize: "15.5px", fontWeight: "600", color: "#1D1D1F", paddingRight: "16px" }}>
                  {faq.q}
                </h3>
                <div style={{ minWidth: "44px", minHeight: "44px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {isOpen ? <ChevronUp size={20} color="#0071E3" /> : <ChevronDown size={20} color="#86868B" />}
                </div>
              </div>

              {isOpen && (
                <p style={{ fontSize: "14px", color: "#5E5E63", lineHeight: 1.55, marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #F0EDEF" }}>
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="reviewly-card" style={{ marginTop: "36px", padding: "28px", backgroundColor: "#F6F3F5", textAlign: "center" }}>
        <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#1D1D1F" }}>Still have questions?</h3>
        <p style={{ fontSize: "13.5px", color: "#86868B", margin: "4px 0 16px 0" }}>
          Reach out directly to our engineering support team.
        </p>
        <button className="btn-primary" style={{ minHeight: "44px", padding: "0 22px" }} onClick={() => setCurrentTab("contact")}>
          Contact Support
        </button>
      </div>
    </div>
  );
}

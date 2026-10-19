import React, { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactPage({ setCurrentTab }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="page-container" style={{ maxWidth: "720px" }}>
      <div style={{ marginBottom: "32px", textAlign: "center" }}>
        <span style={{ fontSize: "12px", fontWeight: "700", color: "#0071E3", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Support & Inquiries
        </span>
        <h1 style={{ fontSize: "36px", fontWeight: "700", color: "#1D1D1F", letterSpacing: "-0.02em", marginTop: "4px" }}>
          Contact Electronic Gadget Review
        </h1>
        <p style={{ fontSize: "15px", color: "#86868B", marginTop: "6px" }}>
          Have feedback on an electronic review analysis or want to integrate custom catalog feeds?
        </p>
      </div>

      <div className="reviewly-card" style={{ padding: "36px", backgroundColor: "#FFFFFF" }}>
        {submitted ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", backgroundColor: "rgba(52, 199, 89, 0.15)", color: "#248A3D", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto" }}>
              <CheckCircle2 size={28} />
            </div>
            <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#1D1D1F", marginBottom: "8px" }}>
              Message Received
            </h3>
            <p style={{ fontSize: "14px", color: "#86868B", lineHeight: 1.5, marginBottom: "24px" }}>
              Thank you, <strong>{name}</strong>. Our engineering team has logged your inquiry and will respond to <strong>{email}</strong> within 24 business hours.
            </p>
            <button className="btn-primary" onClick={() => setCurrentTab("explore")}>
              Back to Catalog
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1D1D1F", marginBottom: "6px" }}>
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Rahul Mehta"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1D1D1F", marginBottom: "6px" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1D1D1F", marginBottom: "6px" }}>
                Subject
              </label>
              <input
                type="text"
                required
                placeholder="Inquiry regarding Sony XM5 consensus calculations"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1D1D1F", marginBottom: "6px" }}>
                Message
              </label>
              <textarea
                required
                rows={5}
                placeholder="Describe your question, dataset feedback, or feature request..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  border: "1px solid #E5E5EA",
                  fontSize: "14px",
                  color: "#1D1D1F",
                  outline: "none",
                  fontFamily: "inherit"
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ padding: "12px 24px", fontSize: "14px", alignSelf: "flex-start", marginTop: "8px" }}
            >
              <Send size={15} />
              <span>{loading ? "Sending..." : "Submit Message"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

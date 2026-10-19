import React, { useState } from "react";
import { Sparkles, Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ForgotPasswordPage({ setCurrentTab }) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSubmitted(true);
    } catch (err) {
      console.error("Password reset error:", err);
      // For security, show friendly confirmation
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FBFBFD", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <header style={{ padding: "16px 32px", minHeight: "64px", display: "flex", alignItems: "center" }}>
        <button
          onClick={() => setCurrentTab("login")}
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#86868B", fontSize: "13.5px", fontWeight: "500", minHeight: "44px", padding: "0 8px" }}
        >
          <ArrowLeft size={16} />
          <span>Back to Sign In</span>
        </button>
      </header>

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 24px" }}>
        <div style={{ maxWidth: "440px", width: "100%" }}>
          <div className="reviewly-card" style={{ padding: "36px 32px", backgroundColor: "#FFFFFF" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <img
                src="/branding/electronic-gadget-review-icon.png"
                alt="Electronic Gadget Review"
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  objectFit: "contain",
                  boxShadow: "0 2px 8px rgba(0, 113, 227, 0.25)"
                }}
              />
              <span style={{ fontSize: "16px", fontWeight: "700", color: "#1D1D1F" }}>Reset Password</span>
            </div>

            {submitted ? (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "rgba(52, 199, 89, 0.15)", color: "#248A3D", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto" }}>
                  <CheckCircle2 size={26} />
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1D1D1F", marginBottom: "8px" }}>
                  Instructions Sent
                </h3>
                <p style={{ fontSize: "13.5px", color: "#86868B", lineHeight: 1.5, marginBottom: "24px" }}>
                  If an account exists for <strong>{email}</strong>, you will receive password reset instructions in your inbox shortly.
                </p>
                <button
                  className="btn-primary"
                  style={{ width: "100%", minHeight: "44px", padding: "0 16px" }}
                  onClick={() => setCurrentTab("login")}
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: "13.5px", color: "#86868B", lineHeight: 1.5, marginBottom: "20px" }}>
                  Enter the email associated with your Electronic Gadget Review account and we'll send you a secure Firebase recovery link.
                </p>

                {error && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px", borderRadius: "8px", backgroundColor: "rgba(255, 59, 48, 0.08)", color: "#D70015", fontSize: "12.5px", marginBottom: "16px" }}>
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1D1D1F", marginBottom: "6px" }}>
                      Registered email
                    </label>
                    <div style={{ position: "relative" }}>
                      <Mail size={17} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#86868B" }} />
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                        style={{ paddingLeft: "40px", height: "44px" }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{ width: "100%", minHeight: "44px", padding: "0 16px", fontSize: "14px", marginTop: "4px" }}
                  >
                    <span>{loading ? "Sending..." : "Send Reset Link"}</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer style={{ padding: "20px 32px", textAlign: "center", fontSize: "12px", color: "#86868B" }}>
        © {new Date().getFullYear()} Electronic Gadget Review. Precision Hardware Evaluation Platform.
      </footer>
    </div>
  );
}

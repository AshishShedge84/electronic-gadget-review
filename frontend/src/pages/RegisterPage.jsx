import React, { useState } from "react";
import {
  Sparkles,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage({ setCurrentTab }) {
  const { register, loginWithGoogle } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreeTerms) {
      setError("Please agree to the Terms of Service.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      let intended = "dashboard";
      try {
        const saved = sessionStorage.getItem("reviewly_intended_dest");
        if (saved) {
          intended = saved;
          sessionStorage.removeItem("reviewly_intended_dest");
        }
      } catch (e) {}
      setCurrentTab(intended);
    } catch (err) {
      console.error("Registration failed:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("This email address is already registered. Please sign in.");
      } else {
        setError(err.message || "Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      let intended = "dashboard";
      try {
        const saved = sessionStorage.getItem("reviewly_intended_dest");
        if (saved) {
          intended = saved;
          sessionStorage.removeItem("reviewly_intended_dest");
        }
      } catch (e) {}
      setCurrentTab(intended);
    } catch (err) {
      console.error("Google signup failed:", err);
      setError(err.message || "Google registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FBFBFD", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      {/* Top Header */}
      <header style={{ padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: "64px" }}>
        <button
          onClick={() => setCurrentTab("landing")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "#86868B",
            fontSize: "13.5px",
            fontWeight: "500",
            minHeight: "44px",
            padding: "0 8px"
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Electronic Gadget Review</span>
        </button>

        <span style={{ fontSize: "12px", color: "#86868B", display: "inline-flex", alignItems: "center", gap: "6px", minHeight: "44px" }}>
          <span>Already a member?</span>
          <button onClick={() => setCurrentTab("login")} style={{ color: "#0071E3", fontWeight: "600", minHeight: "44px", display: "inline-flex", alignItems: "center" }}>
            Sign In
          </button>
        </span>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 24px" }}>
        <div style={{ maxWidth: "480px", width: "100%", margin: "0 auto" }}>
          <div
            className="reviewly-card"
            style={{
              padding: "36px 32px",
              backgroundColor: "#FFFFFF",
              boxShadow: "0 4px 24px -2px rgba(0, 0, 0, 0.04)"
            }}
          >
            {/* Brand Title */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
              <img
                src="/branding/electronic-gadget-review-icon.png"
                alt="Electronic Gadget Review"
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  objectFit: "contain",
                  boxShadow: "0 2px 8px rgba(0, 113, 227, 0.25)"
                }}
              />
              <div>
                <span style={{ fontSize: "16px", fontWeight: "700", color: "#1D1D1F", letterSpacing: "-0.02em", display: "block" }}>
                  Create Account
                </span>
                <span style={{ fontSize: "11px", fontWeight: "600", color: "#86868B", textTransform: "uppercase" }}>
                  Electronic Gadget Review
                </span>
              </div>
            </div>

            {error && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(255, 59, 48, 0.08)",
                  border: "1px solid rgba(255, 59, 48, 0.2)",
                  color: "#D70015",
                  fontSize: "12.5px",
                  marginBottom: "18px"
                }}
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1D1D1F", marginBottom: "6px" }}>
                  Full Name
                </label>
                <div style={{ position: "relative" }}>
                  <User size={17} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#86868B" }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: "40px", height: "44px" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1D1D1F", marginBottom: "6px" }}>
                  Work or personal email
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

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1D1D1F", marginBottom: "6px" }}>
                  Password (6+ characters)
                </label>
                <div style={{ position: "relative" }}>
                  <Lock size={17} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#86868B" }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: "40px", paddingRight: "48px", height: "44px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: "2px", top: "50%", transform: "translateY(-50%)", color: "#86868B", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center" }}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1D1D1F", marginBottom: "6px" }}>
                  Confirm Password
                </label>
                <div style={{ position: "relative" }}>
                  <Lock size={17} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#86868B" }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: "40px", height: "44px" }}
                  />
                </div>
              </div>

              {/* Terms checkbox */}
              <div style={{ display: "flex", alignItems: "center", minHeight: "44px" }}>
                <label htmlFor="terms" style={{ display: "inline-flex", alignItems: "center", gap: "8px", cursor: "pointer", userSelect: "none", minHeight: "44px" }}>
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    style={{ accentColor: "#0071E3", width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <span style={{ fontSize: "12px", color: "#5E5E63" }}>
                    I agree to the Terms of Service and Privacy Policy
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: "100%", minHeight: "44px", padding: "0 16px", fontSize: "14px", marginTop: "4px" }}
              >
                <span>{loading ? "Creating Account..." : "Create Account"}</span>
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Divider */}
            <div style={{ position: "relative", margin: "20px 0", textAlign: "center" }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: "50%", borderTop: "1px solid #E5E5EA" }}></div>
              <span style={{ position: "relative", backgroundColor: "#FFFFFF", padding: "0 12px", fontSize: "11px", fontWeight: "600", color: "#86868B", textTransform: "uppercase" }}>
                Or register with
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                width: "100%",
                minHeight: "44px",
                padding: "0 16px",
                borderRadius: "9999px",
                border: "1px solid #E5E5EA",
                backgroundColor: "#FFFFFF",
                fontSize: "13.5px",
                fontWeight: "500",
                color: "#1D1D1F"
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z" fill="#4285F4"/>
                <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.33 24 12 24z" fill="#34A853"/>
                <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15z" fill="#FBBC05"/>
                <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        </div>
      </main>

      <footer style={{ padding: "20px 32px", textAlign: "center", fontSize: "12px", color: "#86868B" }}>
        © {new Date().getFullYear()} Electronic Gadget Review. Precision Hardware Evaluation Platform.
      </footer>
    </div>
  );
}

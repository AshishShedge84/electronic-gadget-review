import React, { useState } from "react";
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Headphones,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage({ setCurrentTab }) {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login(email, password);
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
      console.error("Login failed:", err);
      let msg = "Failed to sign in. Please check your credentials.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        msg = "Invalid email or password. Please verify credentials or create an account.";
      } else if (err.code === "auth/too-many-requests") {
        msg = "Too many failed attempts. Please reset password or try again later.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
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
      console.error("Google sign in failed:", err);
      setError(err.message || "Google sign in failed. Please try again.");
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
            padding: "0 8px",
            transition: "color 0.15s"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#1D1D1F")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#86868B")}
        >
          <ArrowLeft size={16} />
          <span>Back to Electronic Gadget Review</span>
        </button>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            height: "44px",
            padding: "0 14px",
            borderRadius: "9999px",
            backgroundColor: "#F0EDEF",
            fontSize: "12px",
            color: "#5E5E63"
          }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#34C759" }}></span>
          <span>Cluster v4.8 Active</span>
        </div>
      </header>

      {/* Main Split Grid */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 24px" }}>
        <div style={{ width: "100%", maxWidth: "1240px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "48px", alignItems: "center" }}>
          
          {/* Left Form Card */}
          <div style={{ maxWidth: "480px", width: "100%", margin: "0 auto" }}>
            <div
              className="reviewly-card"
              style={{
                padding: "36px 32px",
                backgroundColor: "#FFFFFF",
                boxShadow: "0 4px 24px -2px rgba(0, 0, 0, 0.04), 0 2px 8px -1px rgba(0, 0, 0, 0.02)"
              }}
            >
              {/* Brand Title */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
                <img
                  src="/branding/electronic-gadget-review-icon.png"
                  alt="Electronic Gadget Review"
                  width="44"
                  height="44"
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    objectFit: "contain",
                    boxShadow: "0 2px 8px rgba(0, 113, 227, 0.2)"
                  }}
                />
                <div>
                  <span style={{ fontSize: "16px", fontWeight: "700", color: "#1D1D1F", letterSpacing: "-0.02em", display: "block" }}>
                    Electronic Gadget Review
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: "600", color: "#86868B", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Hardware Intelligence Platform
                  </span>
                </div>
              </div>

              {/* Title */}
              <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#1D1D1F", letterSpacing: "-0.02em" }}>
                  Welcome back
                </h1>
                <p style={{ fontSize: "13.5px", color: "#86868B", marginTop: "4px", lineHeight: 1.45 }}>
                  Sign in to access your synthesized gadget intelligence, saved comparisons, and custom review analyzers.
                </p>
              </div>

              {/* Intended destination notice if redirected */}
              {sessionStorage.getItem("reviewly_intended_dest") && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(0, 113, 227, 0.08)",
                    border: "1px solid rgba(0, 113, 227, 0.2)",
                    color: "#0071E3",
                    fontSize: "12.5px",
                    marginBottom: "18px"
                  }}
                >
                  <ShieldCheck size={16} />
                  <span>Authentication required to access the requested feature. Sign in below.</span>
                </div>
              )}

              {/* Error feedback */}
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

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Email Field */}
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

                {/* Password Field */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", minHeight: "32px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#1D1D1F" }}>
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setCurrentTab("forgotPassword")}
                      style={{ fontSize: "12.5px", color: "#0071E3", fontWeight: "500", minHeight: "44px", display: "inline-flex", alignItems: "center" }}
                    >
                      Forgot password?
                    </button>
                  </div>
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

                {/* Remember Me */}
                <div style={{ display: "flex", alignItems: "center", minHeight: "44px" }}>
                  <label htmlFor="remember" style={{ display: "inline-flex", alignItems: "center", gap: "8px", cursor: "pointer", userSelect: "none", minHeight: "44px" }}>
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ accentColor: "#0071E3", width: "18px", height: "18px", cursor: "pointer" }}
                    />
                    <span style={{ fontSize: "13px", color: "#5E5E63" }}>Remember me on this device</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ width: "100%", minHeight: "44px", padding: "0 16px", fontSize: "14px", marginTop: "4px" }}
                >
                  <span>{loading ? "Authenticating..." : "Sign In to Electronic Gadget Review"}</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              {/* Divider */}
              <div style={{ position: "relative", margin: "24px 0", textAlign: "center" }}>
                <div style={{ position: "absolute", left: 0, right: 0, top: "50%", borderTop: "1px solid #E5E5EA" }}></div>
                <span style={{ position: "relative", backgroundColor: "#FFFFFF", padding: "0 12px", fontSize: "11px", fontWeight: "600", color: "#86868B", textTransform: "uppercase" }}>
                  Or continue with
                </span>
              </div>

              {/* SSO / Google Sign In */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
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
                    color: "#1D1D1F",
                    transition: "background-color 0.15s ease"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F6F3F5")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFFFFF")}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z" fill="#4285F4"/>
                    <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.33 24 12 24z" fill="#34A853"/>
                    <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15z" fill="#FBBC05"/>
                    <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335"/>
                  </svg>
                  <span>Sign in with Google</span>
                </button>
              </div>

              {/* Production Auth Policy Advisory */}
              <div style={{ marginTop: "18px", padding: "12px", borderRadius: "10px", backgroundColor: "#F6F3F5", textAlign: "center", border: "1px solid #E5E5EA" }}>
                <span style={{ fontSize: "11.5px", color: "#5E5E63", display: "block", lineHeight: 1.4 }}>
                  🔒 <strong>Firebase Production Auth:</strong> Client bypasses are disabled. Sign in with Google OAuth or create an authenticated account to access private intelligence tools.
                </span>
              </div>

              {/* Sign up prompt */}
              <div style={{ marginTop: "24px", textAlign: "center" }}>
                <p style={{ fontSize: "13px", color: "#86868B", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  <span>Don't have an account?</span>
                  <button
                    onClick={() => setCurrentTab("register")}
                    style={{ color: "#0071E3", fontWeight: "600", minHeight: "44px", display: "inline-flex", alignItems: "center" }}
                  >
                    Create an account
                  </button>
                </p>
              </div>

              {/* Trust Badge */}
              <div style={{ marginTop: "20px", paddingTop: "14px", borderTop: "1px solid #E5E5EA", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "11px", color: "#86868B", minHeight: "32px" }}>
                <ShieldCheck size={14} color="#34C759" />
                <span>256-bit SSL encrypted • Firebase Firestore Authenticated</span>
              </div>
            </div>
          </div>

          {/* Right Showcase Card */}
          <div className="hidden lg:flex" style={{ flexDirection: "column", justifyContent: "center" }}>
            <div
              className="reviewly-card"
              style={{
                padding: "40px",
                backgroundColor: "#FFFFFF",
                background: "linear-gradient(135deg, #FFFFFF 0%, #F6F3F5 100%)",
                position: "relative",
                overflow: "hidden"
              }}
            >
              {/* Live Status Badge */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", minHeight: "36px" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    height: "36px",
                    padding: "0 14px",
                    borderRadius: "9999px",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E5EA",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#1D1D1F"
                  }}
                >
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#0071E3" }}></span>
                  <span>Real-time Consensus Engine</span>
                </div>
                <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#86868B" }}>LATENCY: 18ms</span>
              </div>

              {/* Showcase Title */}
              <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#1D1D1F", letterSpacing: "-0.02em", lineHeight: 1.25, marginBottom: "12px" }}>
                Synthesizing millions of tech evaluations into instant clarity.
              </h2>
              <p style={{ fontSize: "14px", color: "#86868B", lineHeight: 1.5, marginBottom: "32px" }}>
                Unbiased algorithmic verdicts extracted from authentic verified buyers, audiophile benchmarks, and teardown metrics.
              </p>

              {/* Live Preview Card */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "16px",
                  border: "1px solid #E5E5EA",
                  padding: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid #E5E5EA", minHeight: "54px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "44px", height: "44px", minWidth: "44px", borderRadius: "10px", backgroundColor: "#F0EDEF", display: "flex", alignItems: "center", justifyContent: "center", color: "#0071E3" }}>
                      <Headphones size={22} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: "15px", fontWeight: "600", color: "#1D1D1F" }}>
                        Sony WH-1000XM5 vs. Bose QC Ultra
                      </h4>
                      <p style={{ fontSize: "12px", color: "#86868B", display: "flex", alignItems: "center", gap: "4px" }}>
                        <CheckCircle2 size={13} color="#248A3D" />
                        <span>14,820 verified reviews synthesized</span>
                      </p>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "11px", color: "#86868B", display: "block" }}>Sentiment</span>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: "#248A3D" }}>89% Strong Pick</span>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", paddingTop: "16px" }}>
                  <div style={{ padding: "12px", borderRadius: "10px", backgroundColor: "rgba(52, 199, 89, 0.08)", border: "1px solid rgba(52, 199, 89, 0.18)" }}>
                    <span style={{ fontSize: "11.5px", fontWeight: "700", color: "#248A3D", display: "block", marginBottom: "4px" }}>
                      Consensus Advantage
                    </span>
                    <p style={{ fontSize: "12px", color: "#1D1D1F", lineHeight: 1.4 }}>
                      Bose leads by 14% on comfort clamp force; Sony dominates multipoint switching & battery life (30h vs 24h).
                    </p>
                  </div>

                  <div style={{ padding: "12px", borderRadius: "10px", backgroundColor: "rgba(255, 59, 48, 0.06)", border: "1px solid rgba(255, 59, 48, 0.18)" }}>
                    <span style={{ fontSize: "11.5px", fontWeight: "700", color: "#D70015", display: "block", marginBottom: "4px" }}>
                      Caveat Flag
                    </span>
                    <p style={{ fontSize: "12px", color: "#1D1D1F", lineHeight: 1.4 }}>
                      Non-folding headband on XM5 requires larger travel case footprint; Bose Immersive Audio reduces battery to 18h.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer style={{ padding: "20px 32px", textAlign: "center", fontSize: "12px", color: "#86868B" }}>
        © {new Date().getFullYear()} Electronic Gadget Review. Precision Hardware Evaluation Platform.
      </footer>
    </div>
  );
}

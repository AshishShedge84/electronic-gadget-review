import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, Lock } from "lucide-react";

/**
 * Reusable ProtectedRoute Guard
 * Strictly prevents mounting of private children or execution of data-fetching hooks
 * until Firebase authentication has verified the user's session.
 */
export default function ProtectedRoute({ children, routeId, onRedirectToLogin }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      // Store intended route safely in sessionStorage for post-login return
      try {
        sessionStorage.setItem("reviewly_intended_dest", routeId || "dashboard");
      } catch (e) {
        console.warn("Could not save intended destination:", e);
      }
      if (onRedirectToLogin) {
        onRedirectToLogin(routeId);
      }
    }
  }, [loading, user, routeId, onRedirectToLogin]);

  // 1. While Firebase resolves authentication state, show full loading skeleton
  if (loading) {
    return (
      <div
        style={{
          minHeight: "75vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          textAlign: "center"
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: "3px solid #E5E5EA",
            borderTopColor: "#0071E3",
            animation: "spin 0.9s cubic-bezier(0.5, 0.1, 0.4, 0.9) infinite",
            marginBottom: "20px"
          }}
        />
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: "600",
            color: "#0071E3",
            backgroundColor: "rgba(0, 113, 227, 0.08)",
            padding: "4px 14px",
            borderRadius: "9999px",
            marginBottom: "12px"
          }}
        >
          <ShieldCheck size={16} />
          <span>Firebase Session Verification</span>
        </div>
        <h2 style={{ fontSize: "19px", fontWeight: "700", color: "#1D1D1F", letterSpacing: "-0.02em" }}>
          Resolving Security Context
        </h2>
        <p style={{ fontSize: "13.5px", color: "#86868B", marginTop: "6px", maxWidth: "340px", lineHeight: 1.45 }}>
          Validating authorization token and restoring encrypted session state...
        </p>
      </div>
    );
  }

  // 2. Unauthenticated state: strictly block private children and display redirect notice
  if (!user) {
    return (
      <div
        style={{
          minHeight: "75vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          textAlign: "center"
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            backgroundColor: "rgba(215, 0, 21, 0.08)",
            color: "#D70015",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px"
          }}
        >
          <Lock size={26} />
        </div>
        <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1D1D1F", letterSpacing: "-0.02em" }}>
          Authentication Required
        </h2>
        <p style={{ fontSize: "13.5px", color: "#86868B", marginTop: "6px", maxWidth: "380px", lineHeight: 1.45 }}>
          The requested intelligence feature is protected. Redirecting you to sign in to restore access...
        </p>
        <button
          onClick={() => onRedirectToLogin && onRedirectToLogin(routeId)}
          className="btn-primary"
          style={{ marginTop: "20px", padding: "10px 22px", fontSize: "13.5px" }}
        >
          Proceed to Sign In
        </button>
      </div>
    );
  }

  // 3. User is authenticated: Render protected children
  return children;
}

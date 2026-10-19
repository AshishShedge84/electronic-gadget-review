import React, { useState, useEffect } from "react";
import { User, Mail, Shield, CheckCircle2, AlertCircle, Sparkles, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage({ setCurrentTab }) {
  const { user, updateUserData, logout } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setPhotoURL(user.photoURL || "");
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await updateUserData({
        displayName: displayName.trim(),
        photoURL: photoURL.trim()
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Profile update error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setCurrentTab("login");
  };

  if (!user) {
    return (
      <div className="page-container" style={{ textAlign: "center", padding: "64px 20px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "700" }}>Sign in to view your profile</h2>
        <p style={{ color: "#86868B", margin: "8px 0 20px 0" }}>Manage your account, preferences, and saved gadget list.</p>
        <button className="btn-primary" onClick={() => setCurrentTab("login")}>
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: "800px" }}>
      <div style={{ marginBottom: "28px" }}>
        <span style={{ fontSize: "12px", fontWeight: "700", color: "#0071E3", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Account Management
        </span>
        <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#1D1D1F", letterSpacing: "-0.02em", marginTop: "4px" }}>
          User Profile
        </h1>
        <p style={{ fontSize: "14px", color: "#86868B", marginTop: "4px" }}>
          Manage your personal details and cloud synchronization preferences.
        </p>
      </div>

      <div className="reviewly-card" style={{ padding: "32px", backgroundColor: "#FFFFFF", marginBottom: "24px" }}>
        {/* Profile Avatar Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", paddingBottom: "24px", borderBottom: "1px solid #E5E5EA", marginBottom: "24px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              backgroundColor: "rgba(0, 113, 227, 0.12)",
              color: "#0071E3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "700",
              border: "2px solid #E5E5EA"
            }}
          >
            {photoURL ? (
              <img src={photoURL} alt="Avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              displayName?.charAt(0)?.toUpperCase() || "U"
            )}
          </div>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1D1D1F" }}>{displayName || "Tech Explorer"}</h3>
            <span style={{ fontSize: "13px", color: "#86868B" }}>{user.email}</span>
            <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
              <span className="sentiment-chip positive" style={{ fontSize: "11px" }}>
                Role: {user.role || "USER"}
              </span>
              <span style={{ fontSize: "11.5px", color: "#86868B", padding: "2px 8px", backgroundColor: "#F0EDEF", borderRadius: "4px" }}>
                Firebase Authenticated
              </span>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {success && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "10px", backgroundColor: "rgba(52, 199, 89, 0.1)", color: "#248A3D", fontSize: "13px", marginBottom: "20px" }}>
            <CheckCircle2 size={16} />
            <span>Profile updated and synchronized to Firestore successfully!</span>
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1D1D1F", marginBottom: "6px" }}>
              Display Name
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1D1D1F", marginBottom: "6px" }}>
              Email Address
            </label>
            <input
              type="email"
              disabled
              value={user.email || ""}
              className="input-field"
              style={{ backgroundColor: "#F6F3F5", color: "#86868B", cursor: "not-allowed" }}
            />
            <span style={{ fontSize: "11.5px", color: "#86868B", marginTop: "4px", display: "block" }}>
              Email is managed securely through Firebase Authentication.
            </span>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1D1D1F", marginBottom: "6px" }}>
              Avatar Image URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              className="input-field"
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", borderTop: "1px solid #E5E5EA" }}>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
              style={{ padding: "10px 24px", fontSize: "13.5px" }}
            >
              <span>{saving ? "Saving Changes..." : "Save Profile Details"}</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="btn-outline"
              style={{ color: "#D70015", fontSize: "13px" }}
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

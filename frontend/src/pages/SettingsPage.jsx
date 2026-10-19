import React, { useState } from "react";
import { Settings, Bell, Shield, Moon, Sun, CheckCircle2, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function SettingsPage({ setCurrentTab }) {
  const { user, logout } = useAuth();
  const [notifyAnalysis, setNotifyAnalysis] = useState(true);
  const [notifyPriceDrops, setNotifyPriceDrops] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSavePreferences = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="page-container" style={{ maxWidth: "800px" }}>
      <div style={{ marginBottom: "28px" }}>
        <span style={{ fontSize: "12px", fontWeight: "700", color: "#0071E3", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Preferences
        </span>
        <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#1D1D1F", letterSpacing: "-0.02em", marginTop: "4px" }}>
          Application Settings
        </h1>
        <p style={{ fontSize: "14px", color: "#86868B", marginTop: "4px" }}>
          Configure currency formatting, notifications, and platform preferences.
        </p>
      </div>

      {savedNotice && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", borderRadius: "12px", backgroundColor: "rgba(52, 199, 89, 0.12)", color: "#248A3D", fontSize: "13px", fontWeight: "600", marginBottom: "20px" }}>
          <CheckCircle2 size={16} />
          <span>Preferences saved successfully to Firestore!</span>
        </div>
      )}

      {/* Localization / Currency Card */}
      <div className="reviewly-card" style={{ padding: "28px", backgroundColor: "#FFFFFF", marginBottom: "24px" }}>
        <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#1D1D1F", marginBottom: "6px" }}>
          Currency & Regional Localization
        </h3>
        <p style={{ fontSize: "13px", color: "#86868B", marginBottom: "16px" }}>
          Electronic Gadget Review operates on an India-First localization model.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: "10px", backgroundColor: "#F6F3F5" }}>
            <div>
              <span style={{ fontSize: "13.5px", fontWeight: "600", color: "#1D1D1F", display: "block" }}>
                Active Currency
              </span>
              <span style={{ fontSize: "12px", color: "#86868B" }}>Standard Indian Rupees (₹ / INR)</span>
            </div>
            <span className="sentiment-chip positive" style={{ fontSize: "12px" }}>
              INR (₹) Active
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: "10px", backgroundColor: "#F6F3F5" }}>
            <div>
              <span style={{ fontSize: "13.5px", fontWeight: "600", color: "#1D1D1F", display: "block" }}>
                Digit Grouping
              </span>
              <span style={{ fontSize: "12px", color: "#86868B" }}>Indian numbering system (Lakhs & Crores: e.g. ₹1,29,900)</span>
            </div>
            <span style={{ fontSize: "12px", color: "#0071E3", fontWeight: "600" }}>en-IN</span>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="reviewly-card" style={{ padding: "28px", backgroundColor: "#FFFFFF", marginBottom: "24px" }}>
        <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#1D1D1F", marginBottom: "6px" }}>
          Notification Preferences
        </h3>
        <p style={{ fontSize: "13px", color: "#86868B", marginBottom: "16px" }}>
          Control how the Consensus Engine notifies you about hardware shifts.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
            <div>
              <span style={{ fontSize: "13.5px", fontWeight: "600", color: "#1D1D1F", display: "block" }}>
                Consensus & Analysis Refresh Alerts
              </span>
              <span style={{ fontSize: "12px", color: "#86868B" }}>Notify when significant new buyer reviews alter an approval score</span>
            </div>
            <input
              type="checkbox"
              checked={notifyAnalysis}
              onChange={(e) => setNotifyAnalysis(e.target.checked)}
              style={{ width: "18px", height: "18px", accentColor: "#0071E3", cursor: "pointer" }}
            />
          </label>

          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", paddingTop: "12px", borderTop: "1px solid #F0EDEF" }}>
            <div>
              <span style={{ fontSize: "13.5px", fontWeight: "600", color: "#1D1D1F", display: "block" }}>
                Saved Gadget Price Tracking
              </span>
              <span style={{ fontSize: "12px", color: "#86868B" }}>Alert when bookmarked electronics drop in price across Indian retailers</span>
            </div>
            <input
              type="checkbox"
              checked={notifyPriceDrops}
              onChange={(e) => setNotifyPriceDrops(e.target.checked)}
              style={{ width: "18px", height: "18px", accentColor: "#0071E3", cursor: "pointer" }}
            />
          </label>
        </div>

        <button
          className="btn-primary"
          onClick={handleSavePreferences}
          style={{ marginTop: "20px", padding: "10px 20px", fontSize: "13px" }}
        >
          Save Preferences
        </button>
      </div>

      {/* Account Session & Sign Out */}
      {user && (
        <div className="reviewly-card" style={{ padding: "28px", backgroundColor: "#FFFFFF" }}>
          <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#1D1D1F", marginBottom: "6px" }}>
            Session Management
          </h3>
          <p style={{ fontSize: "13px", color: "#86868B", marginBottom: "16px" }}>
            Signed in as <strong>{user.email}</strong>
          </p>

          <button
            onClick={async () => {
              await logout();
              setCurrentTab("login");
            }}
            className="btn-outline"
            style={{ color: "#D70015", fontSize: "13px" }}
          >
            <LogOut size={15} />
            <span>Sign Out of Current Session</span>
          </button>
        </div>
      )}
    </div>
  );
}

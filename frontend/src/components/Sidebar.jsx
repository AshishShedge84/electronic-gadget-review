import React from "react";
import {
  Sparkles,
  LayoutDashboard,
  Search,
  FileText,
  Heart,
  GitCompare,
  History,
  User,
  Settings,
  HelpCircle,
  LogOut,
  X,
  PieChart,
  BarChart2
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ currentTab, setCurrentTab, mobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth();

  const navItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "explore", label: "Explore Gadgets", icon: Search },
    { id: "summary", label: "Review Analyzer", icon: FileText },
    { id: "sentiment", label: "Sentiment Insights", icon: PieChart },
    { id: "aspects", label: "Aspect Breakdown", icon: BarChart2 },
    { id: "compare", label: "Compare Products", icon: GitCompare },
    { id: "saved", label: "Saved Gadgets", icon: Heart },
    { id: "history", label: "Recent Activity", icon: History },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "help", label: "Help & Support", icon: HelpCircle }
  ];

  const handleNavClick = (tabId) => {
    setCurrentTab(tabId);
    if (setMobileOpen) setMobileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setCurrentTab("landing");
      if (setMobileOpen) setMobileOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(4px)",
            zIndex: 45
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        style={{
          width: "260px",
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #E5E5EA",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          padding: "20px 16px",
          transform: mobileOpen ? "translateX(0)" : undefined,
          transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
        className={`sidebar-root ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Top Header & Brand */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", padding: "0 4px", minHeight: "44px" }}>
            <div
              style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", minHeight: "44px" }}
              onClick={() => handleNavClick("landing")}
            >
              <img
                src="/branding/electronic-gadget-review-icon.png"
                alt="Electronic Gadget Review"
                width="38"
                height="38"
                style={{
                  width: "38px",
                  height: "38px",
                  minWidth: "38px",
                  borderRadius: "10px",
                  objectFit: "contain",
                  boxShadow: "0 2px 8px rgba(0, 113, 227, 0.2)"
                }}
              />
              <div>
                <span style={{ fontSize: "14.5px", fontWeight: "700", color: "#1D1D1F", letterSpacing: "-0.02em", display: "block", lineHeight: 1.2 }}>
                  Electronic Gadget
                </span>
                <span style={{ fontSize: "10.5px", fontWeight: "600", color: "#0071E3", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Review Platform
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            {setMobileOpen && (
              <button
                className="lg:hidden"
                style={{
                  minWidth: "44px",
                  minHeight: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#86868B",
                  borderRadius: "8px"
                }}
                onClick={() => setMobileOpen(false)}
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    width: "100%",
                    minHeight: "44px",
                    padding: "0 12px",
                    borderRadius: "10px",
                    fontSize: "13.5px",
                    fontWeight: isActive ? "600" : "500",
                    color: isActive ? "#0071E3" : "#5E5E63",
                    backgroundColor: isActive ? "rgba(0, 113, 227, 0.08)" : "transparent",
                    transition: "all 0.15s ease",
                    textAlign: "left"
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = "#F6F3F5";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} color={isActive ? "#0071E3" : "#86868B"} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Pro Cluster */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingTop: "16px", borderTop: "1px solid #E5E5EA" }}>
          {/* Consensus Engine Status Capsule */}
          <div
            style={{
              padding: "12px 14px",
              backgroundColor: "#F6F3F5",
              borderRadius: "14px",
              border: "1px solid rgba(229, 229, 234, 0.7)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#0071E3", letterSpacing: "0.03em", textTransform: "uppercase" }}>
                Consensus v4.8
              </span>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#34C759", display: "inline-block" }}></span>
            </div>
            <p style={{ fontSize: "11.5px", color: "#86868B", lineHeight: 1.35 }}>
              Neural extraction of 15k+ verified gadget evaluations.
            </p>
          </div>

          {/* User Profile / Auth Action */}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 6px", minHeight: "44px" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", overflow: "hidden", minHeight: "44px" }}
                onClick={() => handleNavClick("profile")}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(0, 113, 227, 0.12)",
                    color: "#0071E3",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "600",
                    fontSize: "13px",
                    flexShrink: 0
                  }}
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    user.displayName?.charAt(0)?.toUpperCase() || "U"
                  )}
                </div>
                <div style={{ overflow: "hidden" }}>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "#1D1D1F", display: "block", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                    {user.displayName || "User"}
                  </span>
                  <span style={{ fontSize: "11px", color: "#86868B", display: "block", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                    {user.email}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  minWidth: "44px",
                  minHeight: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#86868B",
                  borderRadius: "8px",
                  transition: "color 0.15s ease"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#D70015")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#86868B")}
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                className="btn-primary"
                style={{ flex: 1, minHeight: "44px", padding: "0 12px", fontSize: "13px" }}
                onClick={() => handleNavClick("login")}
              >
                Sign In
              </button>
              <button
                className="btn-secondary"
                style={{ flex: 1, minHeight: "44px", padding: "0 12px", fontSize: "13px" }}
                onClick={() => handleNavClick("register")}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

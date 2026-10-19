import React, { useState } from "react";
import { Search, Menu, Bell, GitCompare } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Header({ currentTab, setCurrentTab, setMobileOpen, compareCount = 0 }) {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const mockNotifications = [
    {
      id: "n1",
      title: "Sony WH-1000XM5 Analysis Refreshed",
      time: "10m ago",
      text: "Synthesized 40 new reviews. Consensus score shifted to 89% positive.",
      unread: true
    },
    {
      id: "n2",
      title: "MacBook Pro M3 Added to Comparisons",
      time: "1h ago",
      text: "Comparison matrix updated with battery benchmarks.",
      unread: false
    }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setCurrentTab("explore");
    }
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        right: 0,
        height: "64px",
        width: "100%",
        zIndex: 30,
        backgroundColor: "rgba(251, 251, 253, 0.82)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid #E5E5EA",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px"
      }}
    >
      {/* Left: Mobile Toggle & Search */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, maxWidth: "480px" }}>
        <button
          className="lg:hidden"
          style={{
            minWidth: "44px",
            minHeight: "44px",
            color: "#1D1D1F",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E5EA"
          }}
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <form onSubmit={handleSearchSubmit} style={{ position: "relative", width: "100%" }}>
          <Search
            size={16}
            style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#86868B" }}
          />
          <input
            type="text"
            placeholder="Search phones, laptops, audio... (Press Enter)"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{
              width: "100%",
              height: "44px",
              paddingLeft: "38px",
              paddingRight: "54px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E5EA",
              borderRadius: "9999px",
              fontSize: "13px",
              color: "#1D1D1F",
              outline: "none",
              transition: "border-color 0.15s ease, box-shadow 0.15s ease"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#0071E3";
              e.target.style.boxShadow = "0 0 0 3px rgba(0, 113, 227, 0.12)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#E5E5EA";
              e.target.style.boxShadow = "none";
            }}
          />
          <span
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "11px",
              fontWeight: "600",
              color: "#86868B",
              backgroundColor: "#F0EDEF",
              padding: "2px 6px",
              borderRadius: "4px"
            }}
          >
            ⌘K
          </span>
        </form>
      </div>

      {/* Right Cluster - Harmonized 44px Row */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Consensus Engine Status Capsule */}
        <div
          className="hidden md:flex"
          style={{
            alignItems: "center",
            gap: "8px",
            height: "44px",
            padding: "0 14px",
            borderRadius: "9999px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E5EA",
            fontSize: "12px",
            color: "#5E5E63"
          }}
        >
          <span style={{ display: "flex", height: "8px", width: "8px", position: "relative" }}>
            <span
              style={{
                position: "absolute",
                height: "100%",
                width: "100%",
                borderRadius: "50%",
                backgroundColor: "#34C759",
                opacity: 0.75,
                animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite"
              }}
            ></span>
            <span style={{ position: "relative", height: "8px", width: "8px", borderRadius: "50%", backgroundColor: "#34C759" }}></span>
          </span>
          <span style={{ fontWeight: "500" }}>Neural Index Active</span>
        </div>

        {/* Comparison Trigger Pill */}
        {compareCount > 0 && (
          <button
            onClick={() => setCurrentTab("compare")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              height: "44px",
              padding: "0 16px",
              borderRadius: "9999px",
              backgroundColor: "rgba(0, 113, 227, 0.1)",
              color: "#0071E3",
              fontWeight: "600",
              fontSize: "12.5px"
            }}
          >
            <GitCompare size={15} />
            <span>Compare ({compareCount})</span>
          </button>
        )}

        {/* Notifications Button & Dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: "44px",
              height: "44px",
              minWidth: "44px",
              minHeight: "44px",
              borderRadius: "50%",
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E5EA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#5E5E63",
              position: "relative",
              transition: "all 0.15s ease"
            }}
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell size={17} />
            <span
              style={{
                position: "absolute",
                top: "10px",
                right: "11px",
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                backgroundColor: "#0071E3"
              }}
            ></span>
          </button>

          {showNotifications && (
            <div
              style={{
                position: "absolute",
                right: 0,
                marginTop: "8px",
                width: "320px",
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                border: "1px solid #E5E5EA",
                boxShadow: "0 12px 36px -4px rgba(0, 0, 0, 0.12)",
                padding: "16px",
                zIndex: 50
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#1D1D1F" }}>Activity Alerts</span>
                <span style={{ fontSize: "11px", color: "#0071E3", fontWeight: "500", cursor: "pointer" }}>Mark all read</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {mockNotifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: "10px",
                      borderRadius: "10px",
                      backgroundColor: n.unread ? "rgba(0, 113, 227, 0.04)" : "#F6F3F5",
                      border: "1px solid rgba(229, 229, 234, 0.6)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: "12px", fontWeight: "600", color: "#1D1D1F" }}>{n.title}</span>
                      <span style={{ fontSize: "10px", color: "#86868B" }}>{n.time}</span>
                    </div>
                    <p style={{ fontSize: "11.5px", color: "#5E5E63", marginTop: "3px" }}>{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar / Login */}
        {user ? (
          <div
            onClick={() => setCurrentTab("profile")}
            style={{
              width: "44px",
              height: "44px",
              minWidth: "44px",
              minHeight: "44px",
              borderRadius: "50%",
              backgroundColor: "rgba(0, 113, 227, 0.12)",
              color: "#0071E3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "600",
              fontSize: "13px",
              cursor: "pointer",
              border: "1px solid #E5E5EA"
            }}
            title={user.displayName || "Profile"}
          >
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              user.displayName?.charAt(0)?.toUpperCase() || "U"
            )}
          </div>
        ) : (
          <button
            className="btn-primary"
            style={{ minHeight: "44px", padding: "0 18px", fontSize: "13px" }}
            onClick={() => setCurrentTab("login")}
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}

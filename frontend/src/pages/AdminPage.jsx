import React, { useState, useEffect } from "react";
import { ShieldCheck, Users, Database, Server, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { getAdminUsersApi, updateUserRoleApi, getAdminStatsApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function AdminPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [uRes, sRes] = await Promise.all([getAdminUsersApi(), getAdminStatsApi()]);
      setUsers(uRes.data || []);
      setStats(sRes.data || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setMessage("");
    try {
      await updateUserRoleApi(userId, newRole);
      setMessage(`Updated user role to ${newRole}`);
      loadAdminData();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      alert(err.message || "Failed to update role.");
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: 60 }}>Loading system telemetry and user registry...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <div className="badge badge-indigo" style={{ marginBottom: 8 }}>ES Governance</div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>
          Enterprise Administration & Governance
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
          User role-based access control (RBAC), repository telemetry, and database infrastructure status.
        </p>
      </div>

      {message && (
        <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "var(--color-positive)", padding: 12, borderRadius: 6, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle size={16} /> {message}
        </div>
      )}

      {/* System Telemetry Cards */}
      {stats && (
        <div className="grid-4">
          <div className="stat-card">
            <span className="stat-label">Registered Users</span>
            <div className="stat-value">{stats.users_count}</div>
            <div className="stat-subtext">RBAC accounts</div>
          </div>

          <div className="stat-card">
            <span className="stat-label">Catalog Products</span>
            <div className="stat-value">{stats.products_count}</div>
            <div className="stat-subtext">Active electronic devices</div>
          </div>

          <div className="stat-card">
            <span className="stat-label">Ingested Reviews</span>
            <div className="stat-value">{stats.reviews_count}</div>
            <div className="stat-subtext">Processed through NLP</div>
          </div>

          <div className="stat-card positive">
            <span className="stat-label">Database Engine</span>
            <div className="stat-value" style={{ fontSize: "1.3rem", color: "var(--color-positive)" }}>
              {stats.database_engine.toUpperCase()}
            </div>
            <div className="stat-subtext">PostgreSQL 18 Connected</div>
          </div>
        </div>
      )}

      {/* User Governance Table */}
      <div className="card">
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", marginBottom: 14 }}>
          User Role & Authorization Governance
        </h3>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Current Role</th>
                <th>Assign Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>#{u.id}</td>
                  <td style={{ fontWeight: 600, color: "#fff" }}>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === "ADMIN" ? "badge-indigo" : u.role === "ANALYST" ? "badge-positive" : "badge-neutral"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <select
                      className="input-field"
                      style={{ padding: "4px 8px", fontSize: "0.8rem" }}
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    >
                      <option value="USER">USER</option>
                      <option value="ANALYST">ANALYST</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

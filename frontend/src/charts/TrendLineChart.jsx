import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function TrendLineChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ height: 260, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
        No historical review trend records available.
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 15, right: 20, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={12} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              borderColor: "#334155",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "0.85rem",
            }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => <span style={{ color: "#cbd5e1", fontSize: "0.82rem" }}>{value}</span>}
          />
          <Area type="monotone" dataKey="Positive" stroke="#10b981" fillOpacity={1} fill="url(#colorPos)" strokeWidth={2} />
          <Area type="monotone" dataKey="Negative" stroke="#f43f5e" fillOpacity={1} fill="url(#colorNeg)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

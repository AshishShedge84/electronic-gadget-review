import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function RatingBarChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ height: 260, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
        No rating distribution records available.
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
          <XAxis dataKey="rating" stroke="#64748b" fontSize={12} tickLine={false} />
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
          <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#6366f1">
            {data.map((entry, index) => (
              <Cell
                key={`bar-${index}`}
                fill={
                  index >= 3
                    ? "#10b981"
                    : index === 2
                    ? "#f59e0b"
                    : "#f43f5e"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

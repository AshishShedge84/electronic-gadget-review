import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function SentimentPieChart({ data = [] }) {
  if (!data || data.length === 0 || data.every((d) => d.value === 0)) {
    return (
      <div style={{ height: 260, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
        No sentiment distribution data recorded.
      </div>
    );
  }

  const COLORS = {
    Positive: "#10b981",
    Negative: "#f43f5e",
    Neutral: "#64748b",
  };

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || entry.color || "#8884d8"} />
            ))}
          </Pie>
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
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span style={{ color: "#cbd5e1", fontSize: "0.82rem" }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

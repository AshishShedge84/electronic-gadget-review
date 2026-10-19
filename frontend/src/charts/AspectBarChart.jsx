import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function AspectBarChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
        No aspect sentiment records detected.
      </div>
    );
  }

  // Format data for stacked/grouped bar chart
  const formattedData = data.slice(0, 8).map((d) => ({
    aspect: d.aspect,
    Positive: d.Positive || 0,
    Negative: d.Negative || 0,
    Neutral: d.Neutral || 0,
  }));

  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <BarChart data={formattedData} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
          <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} />
          <YAxis dataKey="aspect" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} width={80} />
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
          <Bar dataKey="Positive" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Neutral" stackId="a" fill="#64748b" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Negative" stackId="a" fill="#f43f5e" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

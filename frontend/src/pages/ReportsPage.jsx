import React, { useState, useEffect } from "react";
import { Printer, Download, FileText, CheckCircle, Smartphone } from "lucide-react";
import { getProductsApi, getProductAnalyticsApi, getSummaryApi, getDashboardApi } from "../services/api";
import { formatINR } from "../utils/currency";

export default function ReportsPage() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [reportData, setReportData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [globalData, setGlobalData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [pRes, dRes] = await Promise.all([getProductsApi(), getDashboardApi()]);
        setProducts(pRes.data || []);
        setGlobalData(dRes.data);
        if (pRes.data?.length > 0) {
          setSelectedProductId(pRes.data[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    async function loadSelected() {
      if (!selectedProductId) return;
      try {
        const [aRes, sRes] = await Promise.all([
          getProductAnalyticsApi(selectedProductId),
          getSummaryApi(selectedProductId).catch(() => ({ data: null })),
        ]);
        setReportData(aRes.data);
        setSummaryData(sRes.data);
      } catch (err) {
        console.error(err);
      }
    }
    loadSelected();
  }, [selectedProductId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: 60 }}>Generating report artifact...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Action Bar (hidden during printing) */}
      <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff" }}>Executive Decision Reports</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            Audit-ready reporting artifact printable for academic PBL evaluation and project vivas.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <select
            className="input-field"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            style={{ minWidth: 200 }}
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <button onClick={handlePrint} className="btn btn-primary btn-sm">
            <Printer size={15} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document */}
      <div
        className="card report-print-container"
        style={{
          background: "#fff",
          color: "#0f172a",
          padding: "40px",
          borderRadius: 8,
          borderColor: "#cbd5e1",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        {/* Document Header */}
        <div style={{ borderBottom: "2px solid #0f172a", paddingBottom: 16, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              GadgetIntel PBL Evaluation Dossier
            </div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f172a" }}>
              Electronic Gadget Review Intelligence Report
            </h1>
          </div>
          <div style={{ textAlign: "right", fontSize: "0.8rem", color: "#64748b" }}>
            <div>Date: {new Date().toLocaleDateString()}</div>
            <div>Classification: Individual PBL Artifact</div>
          </div>
        </div>

        {reportData && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Gadget Specs Table */}
            <div style={{ background: "#f8fafc", padding: 16, borderRadius: 6, border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 8, color: "#0f172a" }}>
                Target Gadget: {reportData.product.name}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, fontSize: "0.85rem" }}>
                <div><strong>Brand:</strong> {reportData.product.brand}</div>
                <div><strong>Category:</strong> {reportData.product.category_name}</div>
                <div><strong>MSRP:</strong> {formatINR(reportData.product.price)}</div>
                <div><strong>Reviews Ingested:</strong> {reportData.total_reviews}</div>
              </div>
            </div>

            {/* Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              <div style={{ border: "1px solid #e2e8f0", padding: 14, borderRadius: 6 }}>
                <div style={{ fontSize: "0.78rem", color: "#64748b", textTransform: "uppercase" }}>Average Rating</div>
                <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#d97706" }}>{reportData.average_rating} / 5.0</div>
              </div>
              <div style={{ border: "1px solid #e2e8f0", padding: 14, borderRadius: 6 }}>
                <div style={{ fontSize: "0.78rem", color: "#64748b", textTransform: "uppercase" }}>Verified Feedback</div>
                <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#059669" }}>
                  {reportData.total_reviews} Reviews
                </div>
              </div>
              <div style={{ border: "1px solid #e2e8f0", padding: 14, borderRadius: 6 }}>
                <div style={{ fontSize: "0.78rem", color: "#64748b", textTransform: "uppercase" }}>Consensus Sentiment</div>
                <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0f172a" }}>
                  {summaryData?.overall_sentiment || "Neutral"}
                </div>
              </div>
            </div>

            {/* Executive Synthesis */}
            {summaryData && (
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, borderBottom: "1px solid #e2e8f0", paddingBottom: 6, marginBottom: 10, color: "#0f172a" }}>
                  Executive Review Synthesis
                </h3>
                <p style={{ fontSize: "0.92rem", lineHeight: 1.6, color: "#334155" }}>
                  {summaryData.summary}
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
                  <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: 14, borderRadius: 6 }}>
                    <h4 style={{ color: "#166534", fontWeight: 700, fontSize: "0.9rem", marginBottom: 6 }}>
                      Product Strengths
                    </h4>
                    <ul style={{ paddingLeft: 18, fontSize: "0.85rem", color: "#1e293b" }}>
                      {summaryData.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>

                  <div style={{ background: "#fef2f2", border: "1px solid #fecaca", padding: 14, borderRadius: 6 }}>
                    <h4 style={{ color: "#991b1b", fontWeight: 700, fontSize: "0.9rem", marginBottom: 6 }}>
                      Identified Weaknesses & Complaints
                    </h4>
                    <ul style={{ paddingLeft: 18, fontSize: "0.85rem", color: "#1e293b" }}>
                      {summaryData.weaknesses?.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Aspects Breakdown Table */}
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, borderBottom: "1px solid #e2e8f0", paddingBottom: 6, marginBottom: 10, color: "#0f172a" }}>
                Aspect-Based Evaluation Matrix
              </h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                    <th style={{ padding: "8px 12px", border: "1px solid #cbd5e1" }}>Aspect</th>
                    <th style={{ padding: "8px 12px", border: "1px solid #cbd5e1" }}>Positive</th>
                    <th style={{ padding: "8px 12px", border: "1px solid #cbd5e1" }}>Negative</th>
                    <th style={{ padding: "8px 12px", border: "1px solid #cbd5e1" }}>Neutral</th>
                    <th style={{ padding: "8px 12px", border: "1px solid #cbd5e1" }}>Total Mentions</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.aspect_sentiments?.map((asp, i) => (
                    <tr key={i}>
                      <td style={{ padding: "8px 12px", border: "1px solid #cbd5e1", fontWeight: 600 }}>{asp.aspect}</td>
                      <td style={{ padding: "8px 12px", border: "1px solid #cbd5e1", color: "#166534" }}>{asp.Positive}</td>
                      <td style={{ padding: "8px 12px", border: "1px solid #cbd5e1", color: "#991b1b" }}>{asp.Negative}</td>
                      <td style={{ padding: "8px 12px", border: "1px solid #cbd5e1" }}>{asp.Neutral}</td>
                      <td style={{ padding: "8px 12px", border: "1px solid #cbd5e1", fontWeight: 600 }}>{asp.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sign-off Footer */}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #cbd5e1", display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "#64748b" }}>
              <div>Evaluated with: NLTK VADER &bull; TF-IDF &bull; PostgreSQL 18</div>
              <div>B.Tech CSBS PBL Project &bull; Academic Year 2026</div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media print {
          .sidebar, .header, .no-print { display: none !important; }
          .main-content { margin-left: 0 !important; }
          .page-body { padding: 0 !important; }
          .report-print-container { box-shadow: none !important; border: none !important; }
        }
      `}</style>
    </div>
  );
}

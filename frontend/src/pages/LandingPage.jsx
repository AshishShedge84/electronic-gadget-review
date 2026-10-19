import React from "react";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  BarChart3,
  GitCompare,
  Headphones,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { INITIAL_PRODUCTS } from "../services/seedData";
import { formatINR, formatNumberIN } from "../utils/currency";

export default function LandingPage({ setCurrentTab, setSelectedProductId }) {
  const featured = INITIAL_PRODUCTS.slice(0, 3);

  return (
    <div className="public-viewport">
      {/* Top Public Navbar */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          backgroundColor: "rgba(251, 251, 253, 0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid #E5E5EA",
          padding: "0 24px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", height: "44px" }}
          onClick={() => setCurrentTab("landing")}
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
            <span style={{ fontSize: "16px", fontWeight: "700", color: "#1D1D1F", letterSpacing: "-0.02em", display: "block", lineHeight: 1.2 }}>
              Electronic Gadget Review
            </span>
            <span style={{ fontSize: "11px", color: "#86868B", display: "block", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Smart Electronics Evaluation & Consensus
            </span>
          </div>
        </div>

        {/* Center/Right Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", height: "44px" }}>
          <div className="hidden md:flex" style={{ alignItems: "center", gap: "16px", height: "44px" }}>
            <button
              onClick={() => setCurrentTab("explore")}
              style={{ minHeight: "44px", padding: "0 12px", fontSize: "13.5px", fontWeight: "500", color: "#5E5E63", display: "inline-flex", alignItems: "center" }}
            >
              Explore Gadgets
            </button>
            <button
              onClick={() => setCurrentTab("about")}
              style={{ minHeight: "44px", padding: "0 12px", fontSize: "13.5px", fontWeight: "500", color: "#5E5E63", display: "inline-flex", alignItems: "center" }}
            >
              About NLP Engine
            </button>
            <button
              onClick={() => setCurrentTab("contact")}
              style={{ minHeight: "44px", padding: "0 12px", fontSize: "13.5px", fontWeight: "500", color: "#5E5E63", display: "inline-flex", alignItems: "center" }}
            >
              Contact
            </button>
            <div style={{ height: "20px", width: "1px", backgroundColor: "#E5E5EA" }}></div>
          </div>

          <button
            className="btn-outline"
            style={{ minHeight: "44px", padding: "0 16px", fontSize: "13px" }}
            onClick={() => setCurrentTab("login")}
          >
            Sign In
          </button>
          <button
            className="btn-primary"
            style={{ minHeight: "44px", padding: "0 18px", fontSize: "13px" }}
            onClick={() => setCurrentTab("explore")}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: "72px 24px 48px 24px", maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            height: "36px",
            padding: "0 14px",
            borderRadius: "9999px",
            backgroundColor: "rgba(0, 113, 227, 0.08)",
            color: "#0071E3",
            fontSize: "12.5px",
            fontWeight: "600",
            marginBottom: "24px"
          }}
        >
          <Sparkles size={14} />
          <span>Next-Generation Hardware Intelligence</span>
        </div>

        <h1
          style={{
            fontSize: "clamp(34px, 5vw, 54px)",
            fontWeight: "700",
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            color: "#1D1D1F",
            maxWidth: "920px",
            margin: "0 auto 20px auto"
          }}
        >
          Synthesizing millions of tech evaluations into instant clarity.
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "#86868B",
            maxWidth: "680px",
            margin: "0 auto 36px auto",
            lineHeight: 1.5
          }}
        >
          Unbiased algorithmic verdicts extracted from authentic verified buyers, benchmark data, and tear-down metrics. No sponsored fluff.
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
          <button
            className="btn-primary"
            style={{ minHeight: "48px", padding: "0 28px", fontSize: "15px" }}
            onClick={() => setCurrentTab("explore")}
          >
            <span>Explore All Gadgets</span>
            <ArrowRight size={17} />
          </button>
          <button
            className="btn-outline"
            style={{ minHeight: "48px", padding: "0 26px", fontSize: "15px" }}
            onClick={() => setCurrentTab("compare")}
          >
            <span>Compare Devices</span>
          </button>
        </div>

        {/* Live Interactive Consensus Showcase Preview */}
        <div style={{ marginTop: "56px" }}>
          <div
            className="reviewly-card"
            style={{
              padding: "32px",
              textAlign: "left",
              maxWidth: "880px",
              margin: "0 auto",
              backgroundColor: "#FFFFFF"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", borderBottom: "1px solid #E5E5EA", paddingBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "48px", height: "48px", minWidth: "48px", borderRadius: "14px", backgroundColor: "#F0EDEF", display: "flex", alignItems: "center", justifyContent: "center", color: "#0071E3" }}>
                  <Headphones size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#1D1D1F" }}>
                    Sony WH-1000XM5 vs. Bose QuietComfort Ultra
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
                    <span className="sentiment-chip positive">Strong Consensus</span>
                    <span style={{ fontSize: "12px", color: "#86868B" }}>Based on 14,820 verified evaluations</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "11px", color: "#86868B", display: "block" }}>Consensus Verdict</span>
                  <span style={{ fontSize: "15px", fontWeight: "700", color: "#248A3D" }}>Sony Leads Overall</span>
                </div>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(52, 199, 89, 0.12)",
                    border: "2px solid #34C759",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                    fontSize: "14px",
                    color: "#248A3D"
                  }}
                >
                  89%
                </div>
              </div>
            </div>

            {/* Pros / Cons Highlights */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", paddingTop: "24px" }}>
              <div style={{ padding: "16px", borderRadius: "14px", backgroundColor: "rgba(52, 199, 89, 0.08)", border: "1px solid rgba(52, 199, 89, 0.2)" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#248A3D", display: "block", marginBottom: "6px" }}>
                  Consensus Advantage (Sony)
                </span>
                <p style={{ fontSize: "13.5px", color: "#1D1D1F", lineHeight: 1.45 }}>
                  Sony dominates multipoint reliability and battery endurance (30h vs 24h), while Bose leads by 14% on ear cushion clamp force.
                </p>
              </div>

              <div style={{ padding: "16px", borderRadius: "14px", backgroundColor: "rgba(255, 59, 48, 0.06)", border: "1px solid rgba(255, 59, 48, 0.18)" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#D70015", display: "block", marginBottom: "6px" }}>
                  Caveat Flag
                </span>
                <p style={{ fontSize: "13.5px", color: "#1D1D1F", lineHeight: 1.45 }}>
                  The non-folding headband on the XM5 requires a noticeably bulkier travel footprint compared to folding QC Ultra hinges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section style={{ backgroundColor: "#FFFFFF", padding: "64px 24px", borderTop: "1px solid #E5E5EA", borderBottom: "1px solid #E5E5EA" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#0071E3", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Precision Analytics
            </span>
            <h2 style={{ fontSize: "32px", fontWeight: "700", color: "#1D1D1F", letterSpacing: "-0.02em", marginTop: "6px" }}>
              Designed for serious gadget buyers.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "28px" }}>
            <div className="reviewly-card" style={{ padding: "28px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "rgba(0, 113, 227, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0071E3", marginBottom: "16px" }}>
                <Cpu size={22} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1D1D1F", marginBottom: "8px" }}>
                Aspect-Based NLP (ABSA)
              </h3>
              <p style={{ fontSize: "14px", color: "#86868B", lineHeight: 1.5 }}>
                Clause-level sentiment extraction separates praise for battery life from complaints about software bugs or chassis thermals.
              </p>
            </div>

            <div className="reviewly-card" style={{ padding: "28px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "rgba(52, 199, 89, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#248A3D", marginBottom: "16px" }}>
                <BarChart3 size={22} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1D1D1F", marginBottom: "8px" }}>
                Consensus Scoring
              </h3>
              <p style={{ fontSize: "14px", color: "#86868B", lineHeight: 1.5 }}>
                Aggregates thousands of verified purchase ratings into an honest consensus score, filtering out suspicious bot spikes.
              </p>
            </div>

            <div className="reviewly-card" style={{ padding: "28px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "rgba(217, 119, 6, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#D97706", marginBottom: "16px" }}>
                <GitCompare size={22} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1D1D1F", marginBottom: "8px" }}>
                Mathematical Decision Matrix
              </h3>
              <p style={{ fontSize: "14px", color: "#86868B", lineHeight: 1.5 }}>
                Side-by-side spec and sentiment differential. Clearly spotlights whether paying extra ₹15,000 translates into real real-world utility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Gadgets Showcase */}
      <section style={{ padding: "64px 24px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "36px", minHeight: "44px" }}>
          <div>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#0071E3", textTransform: "uppercase" }}>Featured Electronics</span>
            <h2 style={{ fontSize: "30px", fontWeight: "700", color: "#1D1D1F", letterSpacing: "-0.02em", marginTop: "4px" }}>
              Analyzed hardware leaders
            </h2>
          </div>
          <button
            className="btn-outline"
            style={{ minHeight: "44px", padding: "0 18px", fontSize: "13px" }}
            onClick={() => setCurrentTab("explore")}
          >
            <span>View All ({INITIAL_PRODUCTS.length})</span>
            <ChevronRight size={15} />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
          {featured.map((prod) => (
            <div
              key={prod.id}
              className="reviewly-card interactive"
              style={{ overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column" }}
              onClick={() => {
                setSelectedProductId(prod.id);
                setCurrentTab("productDetail");
              }}
            >
              <div style={{ height: "200px", position: "relative", backgroundColor: "#F6F3F5", overflow: "hidden" }}>
                <img
                  src={prod.imageUrl}
                  alt={prod.name}
                  width="380"
                  height="200"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
                <span
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    backgroundColor: "rgba(255, 255, 255, 0.92)",
                    backdropFilter: "blur(8px)",
                    padding: "4px 10px",
                    borderRadius: "9999px",
                    fontSize: "11.5px",
                    fontWeight: "600",
                    color: "#0071E3",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.06)"
                  }}
                >
                  {prod.badge || prod.category}
                </span>
              </div>

              <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: "600", color: "#86868B", textTransform: "uppercase" }}>
                    {prod.brand} • {prod.category}
                  </span>
                  <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#1D1D1F", margin: "6px 0 8px 0", lineHeight: 1.3 }}>
                    {prod.name}
                  </h4>
                  <p style={{ fontSize: "13px", color: "#86868B", lineHeight: 1.5, minHeight: "40px" }}>
                    {prod.description}
                  </p>
                </div>

                <div style={{ marginTop: "20px", paddingTop: "14px", borderTop: "1px solid #E5E5EA", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ fontSize: "11px", color: "#86868B", display: "block" }}>Price (INR)</span>
                    <span style={{ fontSize: "18px", fontWeight: "700", color: "#1D1D1F" }}>
                      {formatINR(prod.priceINR)}
                    </span>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span className="sentiment-chip positive">
                      ★ {prod.rating} ({formatNumberIN(prod.reviewCount)})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Public Footer */}
      <footer style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid #E5E5EA", padding: "48px 24px 32px 24px", marginTop: "auto" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img
                src="/branding/electronic-gadget-review-icon.png"
                alt="Electronic Gadget Review"
                width="30"
                height="30"
                style={{ width: "30px", height: "30px", borderRadius: "8px", objectFit: "contain" }}
              />
              <span style={{ fontWeight: "700", fontSize: "15px", color: "#1D1D1F" }}>Electronic Gadget Review</span>
            </div>
            <p style={{ fontSize: "12px", color: "#86868B", marginTop: "6px" }}>
              Multi-Source Electronic Gadget Review Discovery, Ingestion & Consensus Platform
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", fontSize: "13px", color: "#5E5E63" }}>
            <button style={{ minHeight: "44px", padding: "0 10px", display: "inline-flex", alignItems: "center" }} onClick={() => setCurrentTab("about")}>About</button>
            <button style={{ minHeight: "44px", padding: "0 10px", display: "inline-flex", alignItems: "center" }} onClick={() => setCurrentTab("contact")}>Contact</button>
            <button style={{ minHeight: "44px", padding: "0 10px", display: "inline-flex", alignItems: "center" }} onClick={() => setCurrentTab("privacy")}>Privacy Policy</button>
            <button style={{ minHeight: "44px", padding: "0 10px", display: "inline-flex", alignItems: "center" }} onClick={() => setCurrentTab("terms")}>Terms of Service</button>
          </div>
        </div>

        <div style={{ maxWidth: "1200px", margin: "24px auto 0 auto", paddingTop: "20px", borderTop: "1px solid #F0EDEF", fontSize: "11.5px", color: "#A1A1A6", textAlign: "center" }}>
          © {new Date().getFullYear()} Electronic Gadget Review. All gadget specifications, ratings, and INR currency values are grounded in verified reviews.
        </div>
      </footer>
    </div>
  );
}

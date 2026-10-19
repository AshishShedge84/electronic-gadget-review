import React, { useState } from "react";
import { Terminal, Play, CheckCircle2, Cpu, ArrowDown, Hash, Sliders, Shield } from "lucide-react";
import { runNlpDemoApi } from "../services/api";

export default function NlpPipelinePage() {
  const [inputText, setInputText] = useState(
    "The battery endurance is truly amazing lasting 2 full days, but the camera is disappointing in low light and the software has bloatware!"
  );
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const sampleReviews = [
    "The battery endurance is truly amazing lasting 2 full days, but the camera is disappointing in low light and the software has bloatware!",
    "Incredible OLED display with vibrant colors! The sound quality from the quad speakers is cinematic, but the price is too high.",
    "Fast charging works like a charm. Lightweight comfortable design, zero lag in heavy gaming.",
    "Worst purchase ever. The phone constantly overheats, Bluetooth disconnects every 5 minutes, and build feels cheap.",
  ];

  const handleRunPipeline = async (textToRun) => {
    const text = textToRun || inputText;
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await runNlpDemoApi(text);
      setResult(res.data);
    } catch (err) {
      alert(err.message || "Pipeline execution failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div>
        <div className="badge badge-indigo" style={{ marginBottom: 8 }}>ASTMA Pipeline Visualizer</div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>
          End-to-End NLP Text Analytics Engine
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", maxWidth: 850 }}>
          Inspect the multi-stage linguistic transformation pipeline in real time: Raw Input &rarr; Cleaning &rarr; Tokenization &rarr; Stopword Removal &rarr; Stemming &rarr; VADER Sentiment &rarr; Aspect-Based ABSA.
        </p>
      </div>

      {/* Input Section */}
      <div className="card">
        <label className="input-label" style={{ marginBottom: 8, display: "block" }}>
          Input Review Text for Pipeline Execution
        </label>
        <textarea
          rows={3}
          className="input-field"
          style={{ width: "100%", fontSize: "0.92rem", marginBottom: 12 }}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type or paste any electronic gadget review..."
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Sample Presets:</span>
            {sampleReviews.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputText(sample);
                  handleRunPipeline(sample);
                }}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: "0.72rem", padding: "4px 8px" }}
              >
                Sample #{idx + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleRunPipeline(inputText)}
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: "8px 20px" }}
          >
            <Play size={15} fill="#fff" />
            <span>{loading ? "Processing Stages..." : "Execute Pipeline"}</span>
          </button>
        </div>
      </div>

      {/* Interactive Pipeline Stages */}
      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>
            Sequential Pipeline Stage Breakdown
          </h3>

          {/* Stage 1 & 2: Raw vs Cleaned */}
          <div className="grid-2">
            <div className="card" style={{ background: "#0c1322", borderColor: "#1e293b" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase" }}>
                <span>Stage 1</span> &bull; <span>Raw Text Input</span>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "#e2e8f0", background: "var(--bg-primary)", padding: 12, borderRadius: 6, minHeight: 60 }}>
                {result.pipeline_stages["1_raw_text"]}
              </div>
            </div>

            <div className="card" style={{ background: "#0c1322", borderColor: "#1e293b" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: "var(--accent-primary)", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase" }}>
                <span>Stage 2</span> &bull; <span>Text Cleaning & Stripping</span>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "#93c5fd", background: "var(--bg-primary)", padding: 12, borderRadius: 6, minHeight: 60 }}>
                {result.pipeline_stages["2_cleaned_text"]}
              </div>
            </div>
          </div>

          {/* Stage 3 & 4: Tokens vs Filtered Tokens */}
          <div className="grid-2">
            <div className="card" style={{ background: "#0c1322", borderColor: "#1e293b" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase" }}>
                <span>Stage 3</span> &bull; <span>Tokenization ({result.pipeline_stages["3_tokens"].length} tokens)</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, background: "var(--bg-primary)", padding: 12, borderRadius: 6, maxHeight: 110, overflowY: "auto" }}>
                {result.pipeline_stages["3_tokens"].map((tok, i) => (
                  <span key={i} style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", background: "#1e293b", padding: "2px 6px", borderRadius: 4, color: "#cbd5e1" }}>
                    {tok}
                  </span>
                ))}
              </div>
            </div>

            <div className="card" style={{ background: "#0c1322", borderColor: "#1e293b" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: "#f59e0b", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase" }}>
                <span>Stage 4</span> &bull; <span>Stopwords Filtered ({result.pipeline_stages["4_filtered_tokens"].length} tokens)</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, background: "var(--bg-primary)", padding: 12, borderRadius: 6, maxHeight: 110, overflowY: "auto" }}>
                {result.pipeline_stages["4_filtered_tokens"].map((tok, i) => (
                  <span key={i} style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.3)", padding: "2px 6px", borderRadius: 4, color: "#fcd34d" }}>
                    {tok}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stage 5: Normalization / Stemming */}
          <div className="card" style={{ background: "#0c1322", borderColor: "#1e293b" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: "var(--accent-primary)", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase" }}>
              <span>Stage 5</span> &bull; <span>Stemmed / Normalized Lexical Stream</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, background: "var(--bg-primary)", padding: 12, borderRadius: 6 }}>
              {result.pipeline_stages["5_stemmed_tokens"].map((tok, i) => (
                <span key={i} style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", background: "rgba(99, 102, 241, 0.15)", border: "1px solid rgba(99, 102, 241, 0.3)", padding: "2px 6px", borderRadius: 4, color: "#c7d2fe" }}>
                  {tok}
                </span>
              ))}
            </div>
          </div>

          {/* Stage 6 & 7: VADER Sentiment & Aspect-Based ABSA */}
          <div className="grid-2">
            <div className="card" style={{ border: "1px solid var(--border-color)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-positive)" }}>
                  Stage 6 &bull; VADER Sentiment Polarity
                </span>
                <span className={`badge badge-${result.sentiment_analysis.sentiment.toLowerCase()}`}>
                  {result.sentiment_analysis.sentiment}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, textAlign: "center", marginBottom: 12 }}>
                <div style={{ background: "var(--bg-input)", padding: 8, borderRadius: 6 }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Compound</div>
                  <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.95rem" }}>
                    {result.sentiment_analysis.sentiment_score}
                  </div>
                </div>
                <div style={{ background: "var(--bg-input)", padding: 8, borderRadius: 6 }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--color-positive)" }}>Positive</div>
                  <div style={{ fontWeight: 700, color: "var(--color-positive)", fontSize: "0.95rem" }}>
                    {result.sentiment_analysis.pos}
                  </div>
                </div>
                <div style={{ background: "var(--bg-input)", padding: 8, borderRadius: 6 }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--color-negative)" }}>Negative</div>
                  <div style={{ fontWeight: 700, color: "var(--color-negative)", fontSize: "0.95rem" }}>
                    {result.sentiment_analysis.neg}
                  </div>
                </div>
                <div style={{ background: "var(--bg-input)", padding: 8, borderRadius: 6 }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Neutral</div>
                  <div style={{ fontWeight: 700, color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                    {result.sentiment_analysis.neu}
                  </div>
                </div>
              </div>

              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                VADER rule engine calculates valence based on contrastive conjunctions and lexical intensity.
              </p>
            </div>

            <div className="card" style={{ border: "1px solid var(--border-color)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", color: "var(--accent-primary)" }}>
                  Stage 7 &bull; Aspect-Based ABSA
                </span>
                <span className="badge badge-indigo">
                  {result.aspect_analysis.length} Aspects Detected
                </span>
              </div>

              {result.aspect_analysis.length === 0 ? (
                <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", padding: 12 }}>
                  No domain gadget aspects identified in this sample.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {result.aspect_analysis.map((asp, i) => (
                    <div key={i} style={{ background: "var(--bg-input)", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 600, color: "#fff", fontSize: "0.85rem" }}>
                          {asp.aspect} <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>({asp.keyword_matched})</span>
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 2 }}>
                          "{asp.evidence_clause}"
                        </div>
                      </div>
                      <span className={`badge badge-${asp.sentiment.toLowerCase()}`}>
                        {asp.sentiment} ({asp.score > 0 ? `+${asp.score}` : asp.score})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

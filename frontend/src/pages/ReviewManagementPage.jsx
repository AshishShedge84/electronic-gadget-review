import React, { useState, useEffect } from "react";
import {
  Upload,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  Star,
  CheckCircle,
  AlertCircle,
  FileText,
  SlidersHorizontal
} from "lucide-react";
import {
  getReviewsApi,
  getProductsApi,
  createReviewApi,
  uploadReviewsCsvApi,
  deleteReviewApi,
  reprocessProductReviewsApi
} from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function ReviewManagementPage() {
  const { isAnalyst, isAdmin } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [search, setSearch] = useState("");

  // Add Single Review Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newReviewText, setNewReviewText] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newReviewerName, setNewReviewerName] = useState("");
  const [newProductId, setNewProductId] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [addMsg, setAddMsg] = useState("");

  // CSV Import Modal & State
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [csvUploadTargetProduct, setCsvUploadTargetProduct] = useState("");
  const [uploadResult, setUploadResult] = useState(null);
  const [uploading, setUploading] = useState(false);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await getReviewsApi({
        product_id: selectedProductId,
        rating: selectedRating,
        search,
        page,
        per_page: 15,
      });
      setReviews(res.data.reviews || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      const pRes = await getProductsApi();
      setProducts(pRes.data || []);
      if (pRes.data?.length > 0 && !newProductId) {
        setNewProductId(pRes.data[0].id);
      }
    }
    init();
  }, []);

  useEffect(() => {
    loadReviews();
  }, [selectedProductId, selectedRating, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadReviews();
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddMsg("");
    try {
      await createReviewApi({
        product_id: parseInt(newProductId),
        review_text: newReviewText,
        rating: parseInt(newRating),
        reviewer_name: newReviewerName || "Verified Customer",
        source: "Manual Analyst Entry",
      });
      setAddMsg("Review added and ASTMA NLP pipeline executed successfully!");
      setNewReviewText("");
      setTimeout(() => {
        setIsAddModalOpen(false);
        setAddMsg("");
        loadReviews();
      }, 1000);
    } catch (err) {
      setAddMsg(err.message || "Failed to add review.");
    } finally {
      setAddLoading(false);
    }
  };

  const handleCsvUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) return;

    setUploading(true);
    setUploadResult(null);

    const formData = new FormData();
    formData.append("file", csvFile);
    if (csvUploadTargetProduct) {
      formData.append("product_id", csvUploadTargetProduct);
    }

    try {
      const res = await uploadReviewsCsvApi(formData);
      setUploadResult(res.data);
      loadReviews();
    } catch (err) {
      setUploadResult({ error: err.message || "CSV processing failure." });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review and its NLP analysis?")) {
      try {
        await deleteReviewApi(id);
        loadReviews();
      } catch (err) {
        alert(err.message || "Failed to delete review.");
      }
    }
  };

  const handleReprocess = async () => {
    if (!selectedProductId) {
      alert("Please select a specific product in the filter to reprocess its reviews.");
      return;
    }
    if (window.confirm("Reprocess all reviews and recalculate TF-IDF keywords, topics, and sentiment?")) {
      try {
        setLoading(true);
        await reprocessProductReviewsApi(selectedProductId);
        alert("Product reviews successfully reprocessed through ASTMA pipeline!");
        loadReviews();
      } catch (err) {
        alert(err.message || "Reprocessing failed.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff" }}>Review Repository & Ingestion</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            Centralized data repository: ingest single reviews, batch import CSV datasets, and manage pipelines.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {selectedProductId && isAnalyst && (
            <button onClick={handleReprocess} className="btn btn-secondary btn-sm" title="Re-run NLP on selected product">
              <RefreshCw size={14} />
              <span>Reprocess Product</span>
            </button>
          )}

          {isAnalyst && (
            <>
              <button onClick={() => setIsCsvModalOpen(true)} className="btn btn-secondary btn-sm">
                <Upload size={14} />
                <span>Upload CSV</span>
              </button>
              <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary btn-sm">
                <Plus size={14} />
                <span>Add Review</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
          <form onSubmit={handleSearch} style={{ flex: 1, minWidth: 240, position: "relative" }}>
            <input
              type="text"
              placeholder="Search inside review texts..."
              className="input-field"
              style={{ width: "100%", paddingLeft: 38 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          </form>

          <div style={{ minWidth: 180 }}>
            <select
              className="input-field"
              value={selectedProductId}
              onChange={(e) => {
                setSelectedProductId(e.target.value);
                setPage(1);
              }}
              style={{ width: "100%" }}
            >
              <option value="">All Products</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ minWidth: 140 }}>
            <select
              className="input-field"
              value={selectedRating}
              onChange={(e) => {
                setSelectedRating(e.target.value);
                setPage(1);
              }}
              style={{ width: "100%" }}
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 180 }}>Product</th>
              <th style={{ width: 90 }}>Rating</th>
              <th style={{ width: 110 }}>Sentiment</th>
              <th>Review Text & Evidence</th>
              <th style={{ width: 160 }}>Detected Aspects</th>
              <th style={{ width: 110 }}>Date / Source</th>
              {isAdmin && <th style={{ width: 60 }}>Action</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={isAdmin ? 7 : 6} style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
                  Loading review records...
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 7 : 6} style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
                  No reviews match your query.
                </td>
              </tr>
            ) : (
              reviews.map((r) => {
                const sentiment = r.analysis?.sentiment || "Neutral";
                const score = r.analysis?.sentiment_score || 0;
                return (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600, color: "#fff", fontSize: "0.85rem" }}>
                      {r.product_name}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Star size={13} fill="#f59e0b" color="#f59e0b" />
                        <span style={{ fontWeight: 600 }}>{r.rating}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${sentiment.toLowerCase()}`}>
                        {sentiment} ({score > 0 ? `+${score}` : score})
                      </span>
                    </td>
                    <td style={{ fontSize: "0.84rem", lineHeight: 1.5, color: "#e2e8f0" }}>
                      {r.review_text}
                    </td>
                    <td>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {r.aspects?.length > 0 ? (
                          r.aspects.map((asp, i) => (
                            <span
                              key={i}
                              className={`badge badge-${asp.sentiment.toLowerCase()}`}
                              style={{ padding: "2px 6px", fontSize: "0.7rem" }}
                            >
                              {asp.aspect}
                            </span>
                          ))
                        ) : (
                          <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>None</span>
                        )}
                      </div>
                    </td>
                    <td style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      <div>{r.review_date || "Recent"}</div>
                      <div style={{ color: "var(--text-secondary)" }}>{r.reviewer_name}</div>
                    </td>
                    {isAdmin && (
                      <td>
                        <button
                          onClick={() => handleDelete(r.id)}
                          style={{ color: "var(--text-muted)", padding: 4 }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-negative)")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                          title="Delete review"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem", color: "var(--text-muted)" }}>
        <span>Showing {reviews.length} of {total} total verified reviews</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn btn-secondary btn-sm"
          >
            Previous
          </button>
          <span style={{ display: "flex", alignItems: "center", padding: "0 8px" }}>Page {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={reviews.length < 15}
            className="btn btn-secondary btn-sm"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal: Add Single Review */}
      {isAddModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 16 }}>
          <div className="card" style={{ width: "100%", maxWidth: 540 }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fff", marginBottom: 16 }}>
              Add Review with Immediate NLP Analysis
            </h3>

            {addMsg && (
              <div style={{ background: addMsg.includes("success") ? "var(--color-positive-bg)" : "var(--color-negative-bg)", color: addMsg.includes("success") ? "var(--color-positive)" : "var(--color-negative)", padding: "10px", borderRadius: "6px", marginBottom: 14, fontSize: "0.85rem" }}>
                {addMsg}
              </div>
            )}

            <form onSubmit={handleAddReview}>
              <div className="input-group">
                <label className="input-label">Product</label>
                <select
                  required
                  className="input-field"
                  value={newProductId}
                  onChange={(e) => setNewProductId(e.target.value)}
                  style={{ width: "100%" }}
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.brand})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="input-group">
                  <label className="input-label">Rating</label>
                  <select
                    className="input-field"
                    value={newRating}
                    onChange={(e) => setNewRating(e.target.value)}
                    style={{ width: "100%" }}
                  >
                    <option value={5}>5 Stars - Outstanding</option>
                    <option value={4}>4 Stars - Very Good</option>
                    <option value={3}>3 Stars - Average / Mixed</option>
                    <option value={2}>2 Stars - Subpar</option>
                    <option value={1}>1 Star - Poor / Defective</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Reviewer Name</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Alex Morgan"
                    value={newReviewerName}
                    onChange={(e) => setNewReviewerName(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Review Feedback Text</label>
                <textarea
                  rows={4}
                  required
                  className="input-field"
                  placeholder="Detail battery life, camera quality, screen brightness, performance, or thermal behavior..."
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={addLoading} className="btn btn-primary">
                  {addLoading ? "Processing NLP..." : "Submit & Run NLP"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: CSV Upload */}
      {isCsvModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 16 }}>
          <div className="card" style={{ width: "100%", maxWidth: 560 }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fff", marginBottom: 12 }}>
              Batch Review Dataset Ingestion (CSV)
            </h3>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: 16, lineHeight: 1.5 }}>
              Upload review datasets. Columns supported: <code>review_id, product_name, category, review_text, rating, review_date, reviewer_name, source</code>.
            </p>

            {uploadResult && (
              <div style={{ marginBottom: 16 }}>
                {uploadResult.error ? (
                  <div style={{ background: "var(--color-negative-bg)", color: "var(--color-negative)", padding: 10, borderRadius: 6, fontSize: "0.85rem" }}>
                    {uploadResult.error}
                  </div>
                ) : (
                  <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: 6, padding: 12, fontSize: "0.85rem" }}>
                    <div style={{ color: "var(--color-positive)", fontWeight: 700, marginBottom: 4 }}>
                      Import Completed Successfully!
                    </div>
                    <div>&bull; {uploadResult.imported_count} reviews inserted & analyzed.</div>
                    <div>&bull; {uploadResult.rejected_count} rows rejected (duplicates or invalid format).</div>
                    {uploadResult.rejections?.length > 0 && (
                      <div style={{ marginTop: 8, maxHeight: 100, overflowY: "auto", fontSize: "0.75rem", color: "#cbd5e1" }}>
                        {uploadResult.rejections.map((rej, i) => (
                          <div key={i}>Row {rej.row}: {rej.reason}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleCsvUpload}>
              <div className="input-group">
                <label className="input-label">Associate to Specific Product (Optional)</label>
                <select
                  className="input-field"
                  value={csvUploadTargetProduct}
                  onChange={(e) => setCsvUploadTargetProduct(e.target.value)}
                  style={{ width: "100%" }}
                >
                  <option value="">Infer Product from CSV 'product_name' Column</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ border: "2px dashed var(--border-color)", borderRadius: 8, padding: "28px 16px", textAlign: "center", marginBottom: 16, background: "var(--bg-input)" }}>
                <Upload size={32} color="var(--accent-primary)" style={{ margin: "0 auto 8px" }} />
                <input
                  type="file"
                  accept=".csv"
                  required
                  id="csv-file-input"
                  style={{ display: "none" }}
                  onChange={(e) => setCsvFile(e.target.files[0])}
                />
                <label htmlFor="csv-file-input" style={{ cursor: "pointer", color: "var(--accent-primary)", fontWeight: 600, fontSize: "0.88rem" }}>
                  {csvFile ? csvFile.name : "Choose CSV file to upload"}
                </label>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>
                  Maximum file size: 16 MB
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button type="button" onClick={() => setIsCsvModalOpen(false)} className="btn btn-secondary">
                  Close
                </button>
                <button type="submit" disabled={uploading || !csvFile} className="btn btn-primary">
                  {uploading ? "Ingesting & Analyzing..." : "Start Import"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

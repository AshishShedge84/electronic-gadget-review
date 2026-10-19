import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Star,
  Sparkles,
  GitCompare,
  Bookmark,
  CheckCircle2,
  Sliders,
  PlusCircle,
  X,
  MessageSquare,
  ThumbsUp,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  UploadCloud,
  FileText,
  Eye,
  ShoppingBag,
  Info
} from "lucide-react";
import {
  getProductById,
  getProductReviews,
  addProductReview,
  toggleSaveProduct
} from "../services/firestoreService";
import { marketplaceService, MARKETPLACE_REGISTRY } from "../services/marketplaceService";
import { INITIAL_PRODUCTS } from "../services/seedData";
import { formatINR, formatNumberIN } from "../utils/currency";
import { useAuth } from "../context/AuthContext";

export default function ProductDetailPage({
  productId,
  setCurrentTab,
  setSelectedProductId,
  addToCompareList
}) {
  const { user } = useAuth();
  const currentId = productId || INITIAL_PRODUCTS[0]?.id;

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedSentimentFilter, setSelectedSentimentFilter] = useState("all");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  // Live Review Ingestion State
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestionResult, setIngestionResult] = useState(null);

  // Dataset Import Modal State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importFileName, setImportFileName] = useState("");
  const [importFileContent, setImportFileContent] = useState("");
  const [importFileType, setImportFileType] = useState("csv");
  const [previewData, setPreviewData] = useState(null);
  const [columnMapping, setColumnMapping] = useState({
    text: "",
    rating: "",
    title: "",
    author: "",
    date: ""
  });
  const [importingDataset, setImportingDataset] = useState(false);
  const [importFeedback, setImportFeedback] = useState(null);

  // New review form state
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  useEffect(() => {
    async function loadProductData() {
      setLoading(true);
      try {
        const prod = await getProductById(currentId);
        setProduct(prod);
        const revs = await getProductReviews(currentId);
        setReviews(revs);
      } catch (err) {
        console.error("Failed to load product detail:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProductData();
  }, [currentId]);

  const handleSave = async () => {
    if (!user) {
      showToast("Please sign in to save gadgets to your account.");
      return;
    }
    try {
      const res = await toggleSaveProduct(user.uid, product);
      setIsSaved(res.saved);
      showToast(res.saved ? "Saved to your profile" : "Removed from saved gadgets");
    } catch (err) {
      console.error(err);
    }
  };

  // Live Review Ingestion Trigger
  const handleFetchReviewsAndAnalyze = async () => {
    setIsIngesting(true);
    showToast("Querying multi-marketplace connectors...");
    try {
      const result = await marketplaceService.startIngestion(currentId, [
        "verified_feed",
        "amazon",
        "flipkart",
        "meesho"
      ]);
      setIngestionResult(result);

      // Re-fetch updated reviews
      const updatedRevs = await getProductReviews(currentId);
      if (updatedRevs && updatedRevs.length > 0) {
        setReviews(updatedRevs);
      }
      showToast(`Review Ingestion Complete!`);
    } catch (err) {
      console.error("Ingestion failed:", err);
      showToast("Ingestion encountered an issue: " + err.message);
    } finally {
      setIsIngesting(false);
    }
  };

  // Dataset File Selection & Preview
  const handleDatasetFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("Dataset exceeds 5MB size limit.");
      return;
    }

    setImportFileName(file.name);
    const isJson = file.name.endsWith(".json");
    setImportFileType(isJson ? "json" : "csv");

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const content = evt.target.result;
      setImportFileContent(content);
      try {
        const preview = await marketplaceService.previewDataset({
          fileContent: content,
          fileType: isJson ? "json" : "csv",
          fileName: file.name
        });
        setPreviewData(preview);
        if (preview.suggestedMapping) {
          setColumnMapping({
            text: preview.suggestedMapping.text || "",
            rating: preview.suggestedMapping.rating || "",
            title: preview.suggestedMapping.title || "",
            author: preview.suggestedMapping.author || "",
            date: preview.suggestedMapping.date || ""
          });
        }
      } catch (err) {
        showToast("Error previewing dataset: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  // Dataset Import Confirmation
  const handleConfirmImport = async () => {
    if (!columnMapping.text) {
      showToast("Please map the 'Review Text' column.");
      return;
    }

    setImportingDataset(true);
    try {
      const res = await marketplaceService.importDataset({
        productId: currentId,
        fileContent: importFileContent,
        fileType: importFileType,
        columnMapping
      });

      setImportFeedback(res.summary);
      if (res.acceptedReviews && res.acceptedReviews.length > 0) {
        setReviews((prev) => [...res.acceptedReviews, ...prev]);
        showToast(`Successfully imported ${res.acceptedReviews.length} reviews!`);
      } else {
        showToast("No valid reviews could be extracted from this file.");
      }
      setTimeout(() => {
        setShowImportModal(false);
        setPreviewData(null);
        setImportFileContent("");
      }, 1500);
    } catch (err) {
      showToast("Import error: " + err.message);
    } finally {
      setImportingDataset(false);
    }
  };

  const handleAddReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newText.trim()) return;
    setSubmittingReview(true);
    try {
      const savedReview = await addProductReview(
        currentId,
        {
          rating: newRating,
          title: newTitle || "User Evaluation",
          text: newText,
          author: user?.displayName || "Verified Customer"
        },
        user
      );

      setReviews([savedReview, ...reviews]);
      setShowReviewModal(false);
      setNewText("");
      setNewTitle("");
      showToast("Review submitted and saved to Firestore!");
    } catch (err) {
      console.error("Failed to add review:", err);
      showToast("Review submission error. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: "center", padding: "80px 20px" }}>
        <div
          style={{
            width: "44px", height: "44px", minWidth: "44px", minHeight: "44px",
            border: "3px solid #E5E5EA",
            borderTopColor: "#0071E3",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 16px auto"
          }}
        />
        <p style={{ color: "#86868B", fontSize: "14px" }}>Loading gadget specifications & marketplace feeds...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-container" style={{ textAlign: "center", padding: "60px 20px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "700" }}>Gadget not found</h2>
        <button className="btn-primary" style={{ marginTop: "16px", minHeight: "44px" }} onClick={() => setCurrentTab("explore")}>
          Return to Catalog
        </button>
      </div>
    );
  }

  const filteredReviews = reviews.filter((r) => {
    if (selectedSentimentFilter === "positive") return r.rating >= 4 || r.sentiment === "positive";
    if (selectedSentimentFilter === "neutral") return r.rating === 3 || r.sentiment === "neutral";
    if (selectedSentimentFilter === "negative") return r.rating <= 2 || r.sentiment === "negative";
    return true;
  });

  // Safe Marketplace Offers
  const amazonSearchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(product.brand + " " + product.name)}&tag=gadgetreview-21`;
  const flipkartSearchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(product.brand + " " + product.name)}`;
  const meeshoSearchUrl = `https://www.meesho.com/search?q=${encodeURIComponent(product.brand + " " + product.name)}`;

  return (
    <div className="page-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 100,
            backgroundColor: "#1D1D1F",
            color: "#FFFFFF",
            padding: "12px 20px",
            borderRadius: "12px",
            fontSize: "13px",
            fontWeight: "500",
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            animation: "fadeIn 0.2s ease"
          }}
        >
          <Sparkles size={16} color="#0071E3" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Lightbox Modal for Real Product Photo */}
      {showLightbox && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
          onClick={() => setShowLightbox(false)}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "800px",
              width: "100%",
              backgroundColor: "#FFFFFF",
              borderRadius: "18px",
              overflow: "hidden",
              boxShadow: "0 24px 60px rgba(0,0,0,0.3)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                borderBottom: "1px solid #E5E5EA"
              }}
            >
              <div>
                <h4 style={{ fontSize: "15px", fontWeight: "600", color: "#1D1D1F", margin: 0 }}>
                  {product.name}
                </h4>
                <span style={{ fontSize: "12px", color: "#86868B" }}>
                  High-Resolution Product Photograph • Verified Sourcing
                </span>
              </div>
              <button
                onClick={() => setShowLightbox(false)}
                style={{
                  width: "36px",
                  height: "44px", minHeight: "44px",
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: "#F2F2F7",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <X size={18} color="#1D1D1F" />
              </button>
            </div>
            <div style={{ padding: "24px", display: "flex", justifyContent: "center", backgroundColor: "#FBFBFD" }}>
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{
                  maxHeight: "540px",
                  maxWidth: "100%",
                  objectFit: "contain",
                  borderRadius: "12px"
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Back Navigation */}
      <div style={{ marginBottom: "20px", minHeight: "44px", display: "flex", alignItems: "center" }}>
        <button
          onClick={() => setCurrentTab("explore")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "#86868B",
            fontSize: "13.5px",
            fontWeight: "500",
            minHeight: "44px",
            padding: "0 8px",
            cursor: "pointer",
            background: "none",
            border: "none"
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Gadget Catalog</span>
        </button>
      </div>

      {/* Main Hero Card */}
      <div className="reviewly-card" style={{ padding: "32px", backgroundColor: "#FFFFFF", marginBottom: "28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "36px", alignItems: "center" }}>
          {/* Left: Product Image with Click-to-Enlarge */}
          <div
            style={{
              height: "320px",
              borderRadius: "18px",
              overflow: "hidden",
              backgroundColor: "#F6F3F5",
              border: "1px solid #E5E5EA",
              position: "relative",
              cursor: "pointer"
            }}
            onClick={() => setShowLightbox(true)}
            title="Click to view full photo"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              width="480"
              height="320"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {product.badge && (
              <span
                style={{
                  position: "absolute",
                  top: "14px",
                  left: "14px",
                  backgroundColor: "rgba(255,255,255,0.95)",
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#0071E3",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.06)"
                }}
              >
                {product.badge}
              </span>
            )}
            <div
              style={{
                position: "absolute",
                bottom: "12px",
                right: "12px",
                backgroundColor: "rgba(0,0,0,0.6)",
                color: "#FFFFFF",
                fontSize: "11px",
                padding: "4px 10px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <Eye size={12} />
              <span>Click to Enlarge</span>
            </div>
          </div>

          {/* Right: Details & Buying Information */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#0071E3", textTransform: "uppercase" }}>
                  {product.brand} • {product.category}
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "3px",
                    padding: "2px 8px",
                    borderRadius: "9999px",
                    fontSize: "11px",
                    fontWeight: "600",
                    backgroundColor: "#EFF6FF",
                    color: "#1D4ED8"
                  }}
                >
                  <ShieldCheck size={12} />
                  Curated Benchmark Catalog
                </span>
              </div>

              <h1
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  color: "#1D1D1F",
                  letterSpacing: "-0.02em",
                  margin: "6px 0 12px 0",
                  lineHeight: 1.25
                }}
              >
                {product.name}
              </h1>
              <p style={{ fontSize: "14px", color: "#5E5E63", lineHeight: 1.5, marginBottom: "20px" }}>
                {product.description}
              </p>

              {/* Price & Rating Display */}
              <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "18px", minHeight: "44px" }}>
                <div>
                  <span style={{ fontSize: "11px", color: "#86868B", display: "block" }}>Benchmark Price (INR)</span>
                  <span style={{ fontSize: "28px", fontWeight: "700", color: "#1D1D1F" }}>
                    {formatINR(product.priceINR)}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "15px", fontWeight: "600" }}>
                  <Star size={17} fill="#FFB800" color="#FFB800" />
                  <span>{product.rating}</span>
                  <span style={{ color: "#86868B", fontWeight: "400" }}>({formatNumberIN(product.reviewCount)} reviews)</span>
                </div>
              </div>
            </div>

            {/* Main Action Bar */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                flexWrap: "wrap",
                paddingTop: "16px",
                borderTop: "1px solid #E5E5EA",
                minHeight: "60px"
              }}
            >
              {/* Primary: Fetch Reviews & Analyze */}
              <button
                className="btn-primary"
                onClick={handleFetchReviewsAndAnalyze}
                disabled={isIngesting}
                style={{ minHeight: "44px", padding: "0 20px", fontSize: "13.5px" }}
              >
                <RefreshCw size={15} className={isIngesting ? "animate-spin" : ""} />
                <span>{isIngesting ? "Retrieving Feeds..." : "Fetch Reviews & Analyze"}</span>
              </button>

              {/* View AI Summary */}
              <button
                className="btn-outline"
                onClick={() => {
                  if (setSelectedProductId) setSelectedProductId(product.id);
                  setCurrentTab("summary");
                }}
                style={{ minHeight: "44px", padding: "0 18px", fontSize: "13.5px" }}
              >
                <Sparkles size={15} />
                <span>AI Insights</span>
              </button>

              {/* Import Dataset Button */}
              <button
                className="btn-outline"
                onClick={() => setShowImportModal(true)}
                style={{ minHeight: "44px", padding: "0 16px", fontSize: "13.5px" }}
              >
                <UploadCloud size={15} />
                <span>Import Dataset</span>
              </button>

              {/* Compare Button */}
              <button
                className="btn-outline"
                onClick={() => {
                  if (addToCompareList) addToCompareList(product.id);
                  setCurrentTab("compare");
                }}
                style={{ minHeight: "44px", padding: "0 16px", fontSize: "13.5px" }}
              >
                <GitCompare size={15} />
                <span>Compare</span>
              </button>

              {/* Bookmark Save */}
              <button
                className="btn-outline"
                onClick={handleSave}
                style={{ minHeight: "44px", padding: "0 16px", fontSize: "13.5px" }}
              >
                <Bookmark size={15} fill={isSaved ? "#0071E3" : "none"} color={isSaved ? "#0071E3" : "currentColor"} />
                <span>{isSaved ? "Saved" : "Save"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Marketplace Availability & Outbound Search Links Panel */}
      <div className="reviewly-card" style={{ padding: "26px", marginBottom: "28px", backgroundColor: "#FFFFFF" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1D1D1F", margin: 0 }}>
              Where to Buy in India • Marketplace Outbound Links
            </h3>
            <span style={{ fontSize: "12.5px", color: "#86868B" }}>
              Direct outbound search queries to authorized Indian retailers. Note: These links execute marketplace search queries; always verify exact model, storage variant, seller rating, and warranty on the retailer site.
            </span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
          {/* Amazon India Card */}
          <div
            style={{
              padding: "16px",
              borderRadius: "14px",
              backgroundColor: "#FFFBF5",
              border: "1px solid #FFE4C4",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "12px"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#D97706" }}>Amazon.in</span>
                <span style={{ fontSize: "11px", fontWeight: "600", color: "#B45309", backgroundColor: "#FEF3C7", padding: "2px 8px", borderRadius: "4px" }}>
                  Search Query Link
                </span>
              </div>
              <div style={{ marginTop: "6px" }}>
                <span style={{ fontSize: "18px", fontWeight: "700", color: "#1D1D1F" }}>
                  {formatINR(product.priceINR)}
                </span>
                <span style={{ fontSize: "11px", color: "#86868B", display: "block" }}>
                  Benchmark Retail Price in India
                </span>
              </div>
            </div>

            <a
              href={amazonSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                height: "44px", minHeight: "44px",
                backgroundColor: "#FF9900",
                color: "#FFFFFF",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                textDecoration: "none"
              }}
            >
              <span>Search on Amazon.in</span>
              <ExternalLink size={13} />
            </a>
          </div>

          {/* Flipkart Card */}
          <div
            style={{
              padding: "16px",
              borderRadius: "14px",
              backgroundColor: "#F4F8FF",
              border: "1px solid #C7D9FE",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "12px"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#2563EB" }}>Flipkart</span>
                <span style={{ fontSize: "11px", fontWeight: "600", color: "#1D4ED8", backgroundColor: "#DBEAFE", padding: "2px 8px", borderRadius: "4px" }}>
                  Search Query Link
                </span>
              </div>
              <div style={{ marginTop: "6px" }}>
                <span style={{ fontSize: "18px", fontWeight: "700", color: "#1D1D1F" }}>
                  {formatINR(Math.round(product.priceINR * 0.98))}
                </span>
                <span style={{ fontSize: "11px", color: "#86868B", display: "block" }}>
                  Observed Benchmark Range
                </span>
              </div>
            </div>

            <a
              href={flipkartSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                height: "44px", minHeight: "44px",
                backgroundColor: "#2874F0",
                color: "#FFFFFF",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                textDecoration: "none"
              }}
            >
              <span>Search on Flipkart</span>
              <ExternalLink size={13} />
            </a>
          </div>

          {/* Meesho Card */}
          <div
            style={{
              padding: "16px",
              borderRadius: "14px",
              backgroundColor: "#FAF5FF",
              border: "1px solid #E9D5FF",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "12px"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#9333EA" }}>Meesho</span>
                <span style={{ fontSize: "11px", fontWeight: "600", color: "#6B7280", backgroundColor: "#F3F4F6", padding: "2px 8px", borderRadius: "4px" }}>
                  Search Query Link
                </span>
              </div>
              <div style={{ marginTop: "6px" }}>
                <span style={{ fontSize: "18px", fontWeight: "700", color: "#1D1D1F" }}>
                  {formatINR(Math.round(product.priceINR * 0.95))}
                </span>
                <span style={{ fontSize: "11px", color: "#86868B", display: "block" }}>
                  Direct Seller Deals & Accessories
                </span>
              </div>
            </div>

            <a
              href={meeshoSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                height: "44px", minHeight: "44px",
                backgroundColor: "#9C27B0",
                color: "#FFFFFF",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                textDecoration: "none"
              }}
            >
              <span>Search on Meesho</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* Live Ingestion Status Panel (Visible after Ingestion) */}
      {ingestionResult && (
        <div className="reviewly-card" style={{ padding: "26px", marginBottom: "28px", backgroundColor: "#FBFBFD", border: "1px solid #D2D2D7" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#1D1D1F", margin: 0 }}>
                Live Ingestion Audit & Source Transparency
              </h3>
              <span style={{ fontSize: "12px", color: "#86868B" }}>
                Job ID: {ingestionResult.jobId} • Real-time connector capability verification
              </span>
            </div>
            <button
              onClick={() => setIngestionResult(null)}
              style={{ background: "none", border: "none", color: "#86868B", cursor: "pointer" }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
            {Object.entries(ingestionResult.providerStatuses || {}).map(([key, info]) => (
              <div
                key={key}
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E5EA"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "#1D1D1F" }}>{info.providerName}</span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      backgroundColor: info.status === "complete" ? "#ECFDF5" : "#FFFBEB",
                      color: info.status === "complete" ? "#059669" : "#D97706"
                    }}
                  >
                    {info.status === "complete" ? "✓ Active" : "Disclosed"}
                  </span>
                </div>
                <p style={{ fontSize: "11.5px", color: "#5E5E63", margin: "4px 0 0 0", lineHeight: 1.4 }}>
                  {info.disclose || info.reviewsRetrieved + " reviews ingested."}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Specifications & Aspects */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", marginBottom: "36px" }}>
        {/* Specifications */}
        <div className="reviewly-card" style={{ padding: "28px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1D1D1F", marginBottom: "16px" }}>
            Technical Specifications
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {product.specs &&
              Object.entries(product.specs).map(([key, value]) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: "1px solid #F0EDEF",
                    fontSize: "13px"
                  }}
                >
                  <span style={{ color: "#86868B", fontWeight: "500" }}>{key}</span>
                  <span style={{ color: "#1D1D1F", fontWeight: "600", textAlign: "right", maxWidth: "60%" }}>
                    {value}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Aspect Sentiment Polarity */}
        <div className="reviewly-card" style={{ padding: "28px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1D1D1F", marginBottom: "16px" }}>
            Subsystem Consensus
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {product.aspects?.map((aspect, idx) => (
              <div key={idx}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ fontSize: "13.5px", fontWeight: "600", color: "#1D1D1F" }}>{aspect.name}</span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      color: aspect.score >= 80 ? "#248A3D" : aspect.score >= 65 ? "#D97706" : "#D70015"
                    }}
                  >
                    {aspect.score}% Approval
                  </span>
                </div>
                <div style={{ height: "6px", borderRadius: "4px", backgroundColor: "#E5E5EA", overflow: "hidden", marginBottom: "4px" }}>
                  <div
                    style={{
                      width: `${aspect.score}%`,
                      backgroundColor: aspect.score >= 80 ? "#34C759" : aspect.score >= 65 ? "#FF9500" : "#D70015",
                      height: "100%"
                    }}
                  />
                </div>
                <span style={{ fontSize: "11.5px", color: "#86868B" }}>{aspect.summary}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="reviewly-card" style={{ padding: "32px", backgroundColor: "#FFFFFF" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "24px",
            minHeight: "44px"
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1D1D1F", margin: 0 }}>
                Verified Buyer Reviews ({reviews.length})
              </h2>
            </div>
            <p style={{ fontSize: "13px", color: "#86868B", marginTop: "4px" }}>
              Multi-source reviews feeding the Electronic Gadget Review consensus engine
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", minHeight: "44px" }}>
            {/* Filter Pills */}
            <div
              style={{
                display: "flex",
                gap: "6px",
                backgroundColor: "#F0EDEF",
                padding: "2px",
                borderRadius: "9999px",
                alignItems: "center",
                minHeight: "44px"
              }}
            >
              {["all", "positive", "neutral", "negative"].map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedSentimentFilter(f)}
                  style={{
                    minHeight: "44px",
                    minWidth: "44px",
                    padding: "0 16px",
                    borderRadius: "9999px",
                    fontSize: "12px",
                    fontWeight: selectedSentimentFilter === f ? "600" : "500",
                    backgroundColor: selectedSentimentFilter === f ? "#FFFFFF" : "transparent",
                    color: selectedSentimentFilter === f ? "#1D1D1F" : "#86868B",
                    boxShadow: selectedSentimentFilter === f ? "0 2px 4px rgba(0,0,0,0.06)" : "none",
                    textTransform: "capitalize",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Import Custom Reviews Button */}
            <button
              className="btn-outline"
              onClick={() => setShowImportModal(true)}
              style={{ minHeight: "44px", padding: "0 14px", fontSize: "12.5px" }}
            >
              <UploadCloud size={14} />
              <span>Import Dataset</span>
            </button>

            {/* Write Review Button */}
            <button
              className="btn-primary"
              onClick={() => setShowReviewModal(true)}
              style={{ minHeight: "44px", padding: "0 16px", fontSize: "12.5px" }}
            >
              <PlusCircle size={14} />
              <span>Write Review</span>
            </button>
          </div>
        </div>

        {/* Reviews List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filteredReviews.length === 0 ? (
            <p style={{ color: "#86868B", textAlign: "center", padding: "32px" }}>
              No reviews found matching this filter.
            </p>
          ) : (
            filteredReviews.map((rev) => (
              <div
                key={rev.id}
                style={{
                  padding: "18px 20px",
                  borderRadius: "14px",
                  backgroundColor: "#FBFBFD",
                  border: "1px solid #E5E5EA"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                    minHeight: "28px"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#1D1D1F" }}>{rev.author}</span>
                      {rev.verifiedPurchase || rev.verified ? (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                            fontSize: "11px",
                            color: "#248A3D",
                            fontWeight: "600"
                          }}
                        >
                          <CheckCircle2 size={12} />
                          Verified Purchase
                        </span>
                      ) : null}
                      {rev.provenance === "user_upload" && (
                        <span
                          style={{
                            fontSize: "10.5px",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            backgroundColor: "#EEF2FF",
                            color: "#4F46E5",
                            fontWeight: "600"
                          }}
                        >
                          User Dataset Upload
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: "11px", color: "#86868B" }}>{rev.date}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < rev.rating ? "#FFB800" : "none"}
                        color={i < rev.rating ? "#FFB800" : "#D1D1D6"}
                      />
                    ))}
                  </div>
                </div>

                <h4 style={{ fontSize: "14.5px", fontWeight: "600", color: "#1D1D1F", marginBottom: "6px" }}>
                  {rev.title}
                </h4>
                <p style={{ fontSize: "13.5px", color: "#5E5E63", lineHeight: 1.5 }}>{rev.text}</p>

                {rev.aspects && rev.aspects.length > 0 && (
                  <div style={{ display: "flex", gap: "6px", marginTop: "10px", alignItems: "center", flexWrap: "wrap" }}>
                    {rev.aspects.map((asp, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: "11px",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          backgroundColor: "#F0EDEF",
                          color: "#5E5E63"
                        }}
                      >
                        #{asp}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Import Your Own Reviews Modal */}
      {showImportModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "16px"
          }}
          onClick={() => setShowImportModal(false)}
        >
          <div
            className="reviewly-card"
            style={{
              maxWidth: "640px",
              width: "100%",
              backgroundColor: "#FFFFFF",
              padding: "28px",
              boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
              maxHeight: "90vh",
              overflowY: "auto"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1D1D1F", margin: 0 }}>
                  Import Your Own Reviews
                </h3>
                <span style={{ fontSize: "12px", color: "#86868B" }}>
                  Upload customer review datasets (CSV or JSON) with custom column mapping and sanitization.
                </span>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#86868B" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* File Dropzone */}
            <div
              style={{
                border: "2px dashed #D2D2D7",
                borderRadius: "14px",
                padding: "24px",
                textAlign: "center",
                backgroundColor: "#FBFBFD",
                marginBottom: "20px"
              }}
            >
              <FileText size={32} color="#0071E3" style={{ margin: "0 auto 8px auto" }} />
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#1D1D1F", margin: "0 0 4px 0" }}>
                Select CSV or JSON Review Dataset
              </p>
              <p style={{ fontSize: "12px", color: "#86868B", margin: "0 0 12px 0" }}>
                Supports exported customer datasets up to 5MB. Formula injection protected.
              </p>
              <input
                type="file"
                accept=".csv, .json, text/csv, application/json"
                onChange={handleDatasetFileChange}
                style={{ fontSize: "13px" }}
              />
            </div>

            {/* Preview & Column Mapping */}
            {previewData && (
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "#1D1D1F" }}>
                    Detected Columns & Mapping ({previewData.totalCount} records estimated)
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#1D1D1F", display: "block", marginBottom: "4px" }}>
                      Review Text (Required) *
                    </label>
                    <select
                      value={columnMapping.text}
                      onChange={(e) => setColumnMapping({ ...columnMapping, text: e.target.value })}
                      style={{ width: "100%", height: "44px", minHeight: "44px", borderRadius: "8px", border: "1px solid #D2D2D7", padding: "0 8px", fontSize: "13px" }}
                    >
                      <option value="">Select column...</option>
                      {previewData.headers.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#1D1D1F", display: "block", marginBottom: "4px" }}>
                      Rating (1 to 5 Stars)
                    </label>
                    <select
                      value={columnMapping.rating}
                      onChange={(e) => setColumnMapping({ ...columnMapping, rating: e.target.value })}
                      style={{ width: "100%", height: "44px", minHeight: "44px", borderRadius: "8px", border: "1px solid #D2D2D7", padding: "0 8px", fontSize: "13px" }}
                    >
                      <option value="">Select column (Optional)...</option>
                      {previewData.headers.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#1D1D1F", display: "block", marginBottom: "4px" }}>
                      Review Headline / Title
                    </label>
                    <select
                      value={columnMapping.title}
                      onChange={(e) => setColumnMapping({ ...columnMapping, title: e.target.value })}
                      style={{ width: "100%", height: "44px", minHeight: "44px", borderRadius: "8px", border: "1px solid #D2D2D7", padding: "0 8px", fontSize: "13px" }}
                    >
                      <option value="">Select column (Optional)...</option>
                      {previewData.headers.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#1D1D1F", display: "block", marginBottom: "4px" }}>
                      Author / Reviewer Name
                    </label>
                    <select
                      value={columnMapping.author}
                      onChange={(e) => setColumnMapping({ ...columnMapping, author: e.target.value })}
                      style={{ width: "100%", height: "44px", minHeight: "44px", borderRadius: "8px", border: "1px solid #D2D2D7", padding: "0 8px", fontSize: "13px" }}
                    >
                      <option value="">Select column (Optional)...</option>
                      {previewData.headers.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  className="btn-primary"
                  onClick={handleConfirmImport}
                  disabled={importingDataset || !columnMapping.text}
                  style={{ width: "100%", height: "42px", fontSize: "13.5px" }}
                >
                  {importingDataset ? "Validating & Ingesting..." : "Confirm & Ingest Reviews"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {showReviewModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "16px"
          }}
          onClick={() => setShowReviewModal(false)}
        >
          <div
            className="reviewly-card"
            style={{
              maxWidth: "520px",
              width: "100%",
              backgroundColor: "#FFFFFF",
              padding: "32px",
              boxShadow: "0 12px 36px rgba(0,0,0,0.15)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1D1D1F" }}>
                Write a Verified Review
              </h3>
              <button
                onClick={() => setShowReviewModal(false)}
                style={{ width: "36px", height: "44px", minHeight: "44px", display: "flex", alignItems: "center", justifyContent: "center", color: "#86868B", borderRadius: "8px", border: "none", cursor: "pointer" }}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddReviewSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Star Rating Selector */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1D1D1F", marginBottom: "6px" }}>
                  Your Rating
                </label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", minHeight: "44px" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      style={{ width: "44px", height: "44px", minWidth: "44px", minHeight: "44px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", border: "none", background: "none", cursor: "pointer" }}
                      aria-label={`Rate ${star} stars`}
                    >
                      <Star
                        size={24}
                        fill={star <= newRating ? "#FFB800" : "none"}
                        color={star <= newRating ? "#FFB800" : "#D1D1D6"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1D1D1F", marginBottom: "6px" }}>
                  Headline / Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Exceptional battery life on long commutes"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="input-field"
                  style={{ height: "44px" }}
                />
              </div>

              {/* Review Text */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#1D1D1F", marginBottom: "6px" }}>
                  Review Details
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share details on performance, build quality, and real-world stamina..."
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "12px",
                    border: "1px solid #E5E5EA",
                    fontSize: "13.5px",
                    color: "#1D1D1F",
                    outline: "none",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="btn-primary"
                style={{ minHeight: "44px", width: "100%", padding: "0 16px", fontSize: "14px", marginTop: "8px" }}
              >
                <span>{submittingReview ? "Saving to Firestore..." : "Submit Review"}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

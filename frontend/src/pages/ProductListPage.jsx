import React, { useState, useEffect, useTransition } from "react";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Bookmark,
  GitCompare,
  ArrowRight,
  Star,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Tablet,
  Layers,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
  RefreshCw,
  Eye,
  X
} from "lucide-react";
import { getProducts, toggleSaveProduct, getUserSavedProducts } from "../services/firestoreService";
import { marketplaceService, MARKETPLACE_REGISTRY } from "../services/marketplaceService";
import { CATEGORIES } from "../services/seedData";
import { formatINR, formatNumberIN } from "../utils/currency";
import { useAuth } from "../context/AuthContext";

const SUGGESTED_SEARCHES = [
  "iPhone 16 Pro Max",
  "Samsung Galaxy S24 Ultra",
  "Sony WH-1000XM5",
  "MacBook Pro 14-inch",
  "Apple Watch Ultra 2"
];

export default function ProductListPage({
  setCurrentTab,
  setSelectedProductId,
  addToCompareList,
  compareList = []
}) {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMarketplace, setSelectedMarketplace] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [savedIds, setSavedIds] = useState(new Set());
  const [toastMessage, setToastMessage] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [isPending, startTransition] = useTransition();

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3200);
  };

  // Debounce search query input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Query catalog & marketplace connectors
  useEffect(() => {
    let isMounted = true;
    async function fetchProducts() {
      setLoading(true);
      try {
        const searchRes = await marketplaceService.searchProducts({
          query: debouncedQuery,
          category: selectedCategory,
          marketplace: selectedMarketplace
        });

        if (isMounted && searchRes && searchRes.items) {
          let items = [...searchRes.items];

          // Sort client-side
          if (sortBy === "rating") {
            items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          } else if (sortBy === "reviews") {
            items.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
          } else if (sortBy === "price-low") {
            items.sort((a, b) => (a.priceINR || 0) - (b.priceINR || 0));
          } else if (sortBy === "price-high") {
            items.sort((a, b) => (b.priceINR || 0) - (a.priceINR || 0));
          }

          setProducts(items);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory, selectedMarketplace, debouncedQuery, sortBy]);

  // Load user saved gadgets
  useEffect(() => {
    if (user) {
      getUserSavedProducts(user.uid).then((saved) => {
        setSavedIds(new Set(saved.map((s) => s.id)));
      });
    }
  }, [user]);

  const handleToggleSave = async (e, product) => {
    e.stopPropagation();
    if (!user) {
      showToast("Please sign in to save gadgets to your account.");
      return;
    }
    try {
      const res = await toggleSaveProduct(user.uid, product);
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (res.saved) {
          next.add(product.id);
          showToast(`Saved ${product.name} to your profile`);
        } else {
          next.delete(product.id);
          showToast(`Removed from saved gadgets`);
        }
        return next;
      });
    } catch (err) {
      console.error("Save toggle error:", err);
    }
  };

  const handleCompareClick = (e, productId) => {
    e.stopPropagation();
    addToCompareList(productId);
    showToast("Added to Comparison Matrix");
  };

  const getCategoryIcon = (catName) => {
    switch (catName?.toLowerCase()) {
      case "smartphones":
        return Smartphone;
      case "laptops":
        return Laptop;
      case "headphones":
        return Headphones;
      case "smartwatches":
        return Watch;
      case "tablets":
        return Tablet;
      default:
        return Layers;
    }
  };

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
      {previewImage && (
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
          onClick={() => setPreviewImage(null)}
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
                  {previewImage.title}
                </h4>
                <span style={{ fontSize: "12px", color: "#86868B" }}>
                  Verified Product Photograph • Aspect Ratio Preserved
                </span>
              </div>
              <button
                onClick={() => setPreviewImage(null)}
                style={{
                  width: "44px", height: "44px", minWidth: "44px", minHeight: "44px",
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
            <div style={{ padding: "20px", display: "flex", justifyContent: "center", backgroundColor: "#FBFBFD" }}>
              <img
                src={previewImage.url}
                alt={previewImage.title}
                style={{
                  maxHeight: "520px",
                  maxWidth: "100%",
                  objectFit: "contain",
                  borderRadius: "12px"
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Page Title & Hero Bar */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            minHeight: "44px"
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#0071E3",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase"
                }}
              >
                Multi-Source Gadget Discovery
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "2px 8px",
                  borderRadius: "9999px",
                  fontSize: "11px",
                  fontWeight: "600",
                  backgroundColor: "#EFF6FF",
                  color: "#1D4ED8"
                }}
              >
                <ShieldCheck size={12} />
                Curated Catalog Active
              </span>
            </div>
            <h1
              style={{
                fontSize: "30px",
                fontWeight: "700",
                color: "#1D1D1F",
                letterSpacing: "-0.02em",
                marginTop: "4px"
              }}
            >
              Explore Electronics & Live Ingestion
            </h1>
            <p style={{ fontSize: "14px", color: "#86868B", marginTop: "4px" }}>
              Search gadgets across Amazon, Flipkart, Meesho & our Verified Review Intelligence Feed. All prices in Indian Rupees (₹).
            </p>
          </div>

          {compareList.length > 0 && (
            <button
              className="btn-primary"
              onClick={() => setCurrentTab("compare")}
              style={{ display: "flex", alignItems: "center", gap: "8px", minHeight: "44px" }}
            >
              <GitCompare size={16} />
              <span>Compare Selected ({compareList.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Bar + Suggested Search Chips */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ position: "relative", marginBottom: "12px" }}>
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#86868B"
            }}
          />
          <input
            type="text"
            placeholder="Search gadget by name, brand, or model (e.g., iPhone 16 Pro Max, Sony WH-1000XM5)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{
              paddingLeft: "48px",
              paddingRight: "80px",
              height: "50px",
              fontSize: "14.5px",
              borderRadius: "14px",
              border: "1px solid #D2D2D7",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "12.5px",
                color: "#86868B",
                fontWeight: "600",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px 8px"
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Suggested Quick Searches */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: "#86868B", fontWeight: "500" }}>Popular Searches:</span>
          {SUGGESTED_SEARCHES.map((queryText) => (
            <button
              key={queryText}
              onClick={() => setSearchQuery(queryText)}
              style={{
                background: "#FFFFFF",
                border: "1px solid #E5E5EA",
                borderRadius: "9999px",
                padding: "4px 12px",
                fontSize: "12px",
                color: "#1D1D1F",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#0071E3")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E5E5EA")}
            >
              {queryText}
            </button>
          ))}
        </div>
      </div>

      {/* Filters Bar: Category Pills & Marketplace Selector */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "28px" }}>
        {/* Category Pills */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            paddingBottom: "4px",
            alignItems: "center"
          }}
        >
          {CATEGORIES.map((cat) => {
            const Icon = getCategoryIcon(cat.id);
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  height: "40px",
                  padding: "0 16px",
                  borderRadius: "9999px",
                  fontSize: "13px",
                  fontWeight: isSelected ? "600" : "500",
                  backgroundColor: isSelected ? "#0071E3" : "#FFFFFF",
                  color: isSelected ? "#FFFFFF" : "#5E5E63",
                  border: isSelected ? "1px solid #0071E3" : "1px solid #E5E5EA",
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap",
                  cursor: "pointer"
                }}
              >
                <Icon size={15} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Marketplace Filter & Sorting Controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px"
          }}
        >
          {/* Marketplace Pill Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", color: "#86868B", fontWeight: "600", marginRight: "4px" }}>
              Source Filter:
            </span>
            {[
              { id: "all", label: "All Connectors" },
              { id: "amazon", label: "Amazon.in", color: "#FF9900" },
              { id: "flipkart", label: "Flipkart", color: "#2874F0" },
              { id: "meesho", label: "Meesho", color: "#9C27B0" },
              { id: "verified_feed", label: "Verified Feed", color: "#10B981" }
            ].map((mkt) => {
              const isSelected = selectedMarketplace === mkt.id;
              return (
                <button
                  key={mkt.id}
                  onClick={() => setSelectedMarketplace(mkt.id)}
                  style={{
                    height: "44px", minHeight: "44px",
                    padding: "0 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: isSelected ? "600" : "500",
                    backgroundColor: isSelected ? "#1D1D1F" : "#FFFFFF",
                    color: isSelected ? "#FFFFFF" : "#5E5E63",
                    border: isSelected ? "1px solid #1D1D1F" : "1px solid #E5E5EA",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  {mkt.color && (
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: mkt.color
                      }}
                    />
                  )}
                  <span>{mkt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sort By Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <SlidersHorizontal size={15} color="#86868B" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                height: "44px", minHeight: "44px",
                padding: "0 12px",
                borderRadius: "10px",
                border: "1px solid #E5E5EA",
                backgroundColor: "#FFFFFF",
                fontSize: "13px",
                color: "#1D1D1F",
                outline: "none",
                cursor: "pointer"
              }}
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="rating">Sort: Highest Rating</option>
              <option value="reviews">Sort: Most Reviews</option>
              <option value="price-low">Price: Low to High (₹)</option>
              <option value="price-high">Price: High to Low (₹)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Products */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="reviewly-card"
              style={{ height: "380px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div className="skeleton-box" style={{ height: "180px", width: "100%", borderRadius: "14px" }} />
              <div className="skeleton-box" style={{ height: "20px", width: "60%", borderRadius: "6px" }} />
              <div className="skeleton-box" style={{ height: "16px", width: "90%", borderRadius: "6px" }} />
              <div className="skeleton-box" style={{ height: "24px", width: "40%", borderRadius: "6px", marginTop: "auto" }} />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="reviewly-card" style={{ padding: "64px 24px", textAlign: "center" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "#F2F2F7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px auto",
              color: "#86868B"
            }}
          >
            <Search size={26} />
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1D1D1F" }}>No matching gadgets found</h3>
          <p
            style={{
              fontSize: "13.5px",
              color: "#86868B",
              marginTop: "4px",
              maxWidth: "440px",
              margin: "4px auto 20px auto"
            }}
          >
            We couldn't find any electronics matching "{searchQuery}". Try searching for another model, brand, or resetting your connector filter.
          </p>
          <button
            className="btn-outline"
            style={{ minHeight: "44px" }}
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedMarketplace("all");
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
          {products.map((prod) => {
            const isSaved = savedIds.has(prod.id);
            const isInCompare = compareList.includes(prod.id);

            // Find Amazon and Flipkart offers if present
            const amazonOffer = prod.offers?.find((o) => o.providerId === "amazon");
            const flipkartOffer = prod.offers?.find((o) => o.providerId === "flipkart");
            const meeshoOffer = prod.offers?.find((o) => o.providerId === "meesho");

            return (
              <div
                key={prod.id}
                className="reviewly-card interactive"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  overflow: "hidden",
                  position: "relative"
                }}
                onClick={() => {
                  setSelectedProductId(prod.id);
                  setCurrentTab("productDetail");
                }}
              >
                {/* Image and Badges Header */}
                <div
                  style={{
                    height: "210px",
                    position: "relative",
                    backgroundColor: "#F6F3F5",
                    overflow: "hidden"
                  }}
                >
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    width="380"
                    height="210"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    loading="lazy"
                  />

                  {/* Badge */}
                  {prod.badge && (
                    <span
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        backgroundColor: "rgba(255, 255, 255, 0.94)",
                        backdropFilter: "blur(8px)",
                        padding: "4px 10px",
                        borderRadius: "9999px",
                        fontSize: "11px",
                        fontWeight: "600",
                        color: "#0071E3",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.06)"
                      }}
                    >
                      {prod.badge}
                    </span>
                  )}

                  {/* Photo Preview / Lightbox Action */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewImage({ url: prod.imageUrl, title: prod.name });
                    }}
                    style={{
                      position: "absolute",
                      bottom: "12px",
                      left: "12px",
                      height: "44px", minHeight: "44px",
                      padding: "0 10px",
                      borderRadius: "6px",
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      backdropFilter: "blur(4px)",
                      border: "none",
                      color: "#FFFFFF",
                      fontSize: "11.5px",
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer"
                    }}
                    title="Enlarge Product Photo"
                  >
                    <Eye size={13} />
                    <span>Photo</span>
                  </button>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => handleToggleSave(e, prod)}
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      width: "44px", height: "44px", minWidth: "44px", minHeight: "44px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(255, 255, 255, 0.92)",
                      backdropFilter: "blur(8px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isSaved ? "#0071E3" : "#5E5E63",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                      border: "none",
                      cursor: "pointer",
                      transition: "transform 0.15s ease"
                    }}
                    title={isSaved ? "Saved" : "Save Product"}
                    aria-label="Save Product"
                  >
                    <Bookmark size={17} fill={isSaved ? "#0071E3" : "none"} />
                  </button>
                </div>

                {/* Content Body */}
                <div
                  style={{
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    justifyContent: "space-between"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "600", color: "#86868B", textTransform: "uppercase" }}>
                        {prod.brand} • {prod.category}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#1D1D1F",
                        margin: "4px 0 8px 0",
                        lineHeight: 1.3
                      }}
                    >
                      {prod.name}
                    </h3>

                    {/* Source & Capabilities Indicator */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        flexWrap: "wrap",
                        margin: "8px 0"
                      }}
                    >
                      <span
                        style={{
                          fontSize: "10.5px",
                          fontWeight: "600",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          backgroundColor: "#EFF6FF",
                          color: "#1D4ED8",
                          border: "1px solid #BFDBFE"
                        }}
                      >
                        Curated Reference
                      </span>

                      {amazonOffer && (
                        <span
                          style={{
                            fontSize: "10.5px",
                            fontWeight: "500",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            backgroundColor: "#FFFBEB",
                            color: "#D97706",
                            border: "1px solid #FDE68A"
                          }}
                        >
                          Amazon Search Link
                        </span>
                      )}

                      {flipkartOffer && (
                        <span
                          style={{
                            fontSize: "10.5px",
                            fontWeight: "500",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            backgroundColor: "#EFF6FF",
                            color: "#2563EB",
                            border: "1px solid #BFDBFE"
                          }}
                        >
                          Flipkart Search Link
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price, Rating & Actions */}
                  <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid #E5E5EA" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                        minHeight: "32px"
                      }}
                    >
                      <div>
                        <span style={{ fontSize: "11px", color: "#86868B", display: "block" }}>Price in INR</span>
                        <span style={{ fontSize: "19px", fontWeight: "700", color: "#1D1D1F" }}>
                          {formatINR(prod.priceINR)}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "12.5px",
                          fontWeight: "600",
                          color: "#1D1D1F"
                        }}
                      >
                        <Star size={14} fill="#FFB800" color="#FFB800" />
                        <span>{prod.rating}</span>
                        <span style={{ color: "#86868B", fontWeight: "400" }}>({formatNumberIN(prod.reviewCount)})</span>
                      </div>
                    </div>

                    {/* Direct Outbound Marketplace Links */}
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        marginBottom: "10px",
                        flexWrap: "wrap"
                      }}
                    >
                      {amazonOffer && (
                        <a
                          href={amazonOffer.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            flex: 1,
                            minWidth: "100px",
                            height: "44px", minHeight: "44px",
                            backgroundColor: "#FFF8F0",
                            border: "1px solid #FFE0B2",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: "600",
                            color: "#D97706",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "4px",
                            textDecoration: "none"
                          }}
                        >
                          <span>Search Amazon</span>
                          <ExternalLink size={10} />
                        </a>
                      )}

                      {flipkartOffer && (
                        <a
                          href={flipkartOffer.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            flex: 1,
                            minWidth: "100px",
                            height: "44px", minHeight: "44px",
                            backgroundColor: "#F0F6FF",
                            border: "1px solid #BFDBFE",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: "600",
                            color: "#2563EB",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "4px",
                            textDecoration: "none"
                          }}
                        >
                          <span>Search Flipkart</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                    </div>

                    {/* Main CTA Actions */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", minHeight: "44px" }}>
                      <button
                        onClick={(e) => handleCompareClick(e, prod.id)}
                        className={isInCompare ? "btn-secondary" : "btn-outline"}
                        style={{ minHeight: "44px", padding: "0 10px", fontSize: "12.5px" }}
                      >
                        <GitCompare size={14} />
                        <span>{isInCompare ? "In Matrix" : "Compare"}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProductId(prod.id);
                          setCurrentTab("summary");
                        }}
                        className="btn-primary"
                        style={{ minHeight: "44px", padding: "0 10px", fontSize: "12.5px" }}
                      >
                        <Sparkles size={14} />
                        <span>Analyze Reviews</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

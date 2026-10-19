import React, { useState, useEffect, useCallback } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

// Routing definitions
import {
  ROUTES,
  isRouteProtected,
  getRouteFromPathname,
  getPathForRoute
} from "./router/routes";

// Pages
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import SummaryPage from "./pages/SummaryPage";
import SentimentAnalysisPage from "./pages/SentimentAnalysisPage";
import AspectAnalysisPage from "./pages/AspectAnalysisPage";
import ProductComparisonPage from "./pages/ProductComparisonPage";
import SavedProductsPage from "./pages/SavedProductsPage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import HelpPage from "./pages/HelpPage";
import { PrivacyPage, TermsPage } from "./pages/LegalPages";
import NlpPipelinePage from "./pages/NlpPipelinePage";
import ReportsPage from "./pages/ReportsPage";
import { seedInitialProductsIfEmpty } from "./services/firestoreService";

function AppContent() {
  const { user, loading } = useAuth();

  // Initialize route from current window.location.pathname
  const [currentTab, setCurrentTabState] = useState(() => {
    return getRouteFromPathname(window.location.pathname);
  });

  const [selectedProductId, setSelectedProductId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("product") || params.get("id") || "sony-wh1000xm5";
  });

  const [compareList, setCompareList] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Centralized navigation handler that updates both state and browser URL history
  const navigate = useCallback((routeId, productId = null) => {
    const targetRoute = ROUTES[routeId] ? routeId : "landing";
    setCurrentTabState(targetRoute);

    if (productId) {
      setSelectedProductId(productId);
    }

    // Synchronize browser history URL
    try {
      const query = (targetRoute === "productDetail" && (productId || selectedProductId))
        ? { product: productId || selectedProductId }
        : {};
      const newPath = getPathForRoute(targetRoute, query);
      if (window.location.pathname + window.location.search !== newPath) {
        window.history.pushState({ routeId: targetRoute, productId }, "", newPath);
      }
    } catch (e) {
      console.warn("History pushState error:", e);
    }

    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedProductId]);

  // Synchronize on browser Back/Forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const routeFromUrl = getRouteFromPathname(window.location.pathname);
      const params = new URLSearchParams(window.location.search);
      const prodFromUrl = params.get("product") || params.get("id");
      if (prodFromUrl) {
        setSelectedProductId(prodFromUrl);
      }
      setCurrentTabState(routeFromUrl);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Update document title dynamically based on route
  useEffect(() => {
    const activeRouteConfig = ROUTES[currentTab];
    if (activeRouteConfig && activeRouteConfig.title) {
      document.title = activeRouteConfig.title;
    }
  }, [currentTab]);

  // Mandatory Authentication Gate:
  // If an unauthenticated visitor attempts to access a protected route, redirect to /login
  useEffect(() => {
    if (!loading) {
      const isProtected = isRouteProtected(currentTab);
      if (isProtected && !user) {
        try {
          sessionStorage.setItem("reviewly_intended_dest", currentTab);
        } catch (e) {}
        navigate("login");
      } else if (user && (currentTab === "login" || currentTab === "register")) {
        // Authenticated user opening auth screens -> redirect to intended destination or dashboard
        let intended = "dashboard";
        try {
          const savedIntended = sessionStorage.getItem("reviewly_intended_dest");
          if (savedIntended && ROUTES[savedIntended]) {
            intended = savedIntended;
            sessionStorage.removeItem("reviewly_intended_dest");
          }
        } catch (e) {}
        navigate(intended);
      }
    }
  }, [loading, user, currentTab, navigate]);

  // Initial database seeding in background
  useEffect(() => {
    seedInitialProductsIfEmpty();
  }, []);

  // Global Keyboard shortcuts (Cmd+K / Ctrl+K and Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        navigate("explore");
      }
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, navigate]);

  const addToCompareList = (productId) => {
    setCompareList((prev) => {
      if (!prev.includes(productId)) {
        return [...prev, productId];
      }
      return prev;
    });
  };

  const handleRedirectToLogin = (intended) => {
    try {
      sessionStorage.setItem("reviewly_intended_dest", intended || "dashboard");
    } catch (e) {}
    navigate("login");
  };

  // Full-page standalone screens (no persistent dashboard sidebar)
  const isPublicStandalone = [
    "landing",
    "login",
    "register",
    "forgotPassword",
    "privacy",
    "terms",
    "about",
    "contact"
  ].includes(currentTab);

  // Render Page Content with ProtectedRoute guard enforcement
  const renderContent = () => {
    switch (currentTab) {
      // Public Pages
      case "landing":
        return (
          <LandingPage
            setCurrentTab={navigate}
            setSelectedProductId={setSelectedProductId}
          />
        );
      case "explore":
      case "products":
        return (
          <ProductListPage
            setCurrentTab={navigate}
            setSelectedProductId={setSelectedProductId}
            addToCompareList={addToCompareList}
            compareList={compareList}
          />
        );
      case "productDetail":
        return (
          <ProductDetailPage
            productId={selectedProductId}
            setCurrentTab={navigate}
            setSelectedProductId={setSelectedProductId}
            addToCompareList={addToCompareList}
          />
        );
      case "login":
        return <LoginPage setCurrentTab={navigate} />;
      case "register":
        return <RegisterPage setCurrentTab={navigate} />;
      case "forgotPassword":
        return <ForgotPasswordPage setCurrentTab={navigate} />;
      case "about":
        return <AboutPage setCurrentTab={navigate} />;
      case "contact":
        return <ContactPage setCurrentTab={navigate} />;
      case "help":
        return <HelpPage setCurrentTab={navigate} />;
      case "privacy":
        return <PrivacyPage setCurrentTab={navigate} />;
      case "terms":
        return <TermsPage setCurrentTab={navigate} />;

      // Protected Pages (Wrapped in ProtectedRoute Guard)
      case "dashboard":
        return (
          <ProtectedRoute routeId="dashboard" onRedirectToLogin={handleRedirectToLogin}>
            <DashboardPage
              setCurrentTab={navigate}
              setSelectedProductId={setSelectedProductId}
            />
          </ProtectedRoute>
        );
      case "summary":
      case "analysis":
        return (
          <ProtectedRoute routeId="summary" onRedirectToLogin={handleRedirectToLogin}>
            <SummaryPage
              selectedProductId={selectedProductId}
              setCurrentTab={navigate}
              setSelectedProductId={setSelectedProductId}
              addToCompareList={addToCompareList}
            />
          </ProtectedRoute>
        );
      case "sentiment":
        return (
          <ProtectedRoute routeId="sentiment" onRedirectToLogin={handleRedirectToLogin}>
            <SentimentAnalysisPage
              setCurrentTab={navigate}
              setSelectedProductId={setSelectedProductId}
            />
          </ProtectedRoute>
        );
      case "aspects":
        return (
          <ProtectedRoute routeId="aspects" onRedirectToLogin={handleRedirectToLogin}>
            <AspectAnalysisPage
              setCurrentTab={navigate}
              setSelectedProductId={setSelectedProductId}
            />
          </ProtectedRoute>
        );
      case "compare":
        return (
          <ProtectedRoute routeId="compare" onRedirectToLogin={handleRedirectToLogin}>
            <ProductComparisonPage
              compareList={compareList}
              setCompareList={setCompareList}
              setCurrentTab={navigate}
              setSelectedProductId={setSelectedProductId}
            />
          </ProtectedRoute>
        );
      case "saved":
        return (
          <ProtectedRoute routeId="saved" onRedirectToLogin={handleRedirectToLogin}>
            <SavedProductsPage
              setCurrentTab={navigate}
              setSelectedProductId={setSelectedProductId}
              addToCompareList={addToCompareList}
            />
          </ProtectedRoute>
        );
      case "history":
        return (
          <ProtectedRoute routeId="history" onRedirectToLogin={handleRedirectToLogin}>
            <HistoryPage
              setCurrentTab={navigate}
              setSelectedProductId={setSelectedProductId}
            />
          </ProtectedRoute>
        );
      case "profile":
        return (
          <ProtectedRoute routeId="profile" onRedirectToLogin={handleRedirectToLogin}>
            <ProfilePage setCurrentTab={navigate} />
          </ProtectedRoute>
        );
      case "settings":
        return (
          <ProtectedRoute routeId="settings" onRedirectToLogin={handleRedirectToLogin}>
            <SettingsPage setCurrentTab={navigate} />
          </ProtectedRoute>
        );
      case "nlp":
        return (
          <ProtectedRoute routeId="nlp" onRedirectToLogin={handleRedirectToLogin}>
            <NlpPipelinePage />
          </ProtectedRoute>
        );
      case "reports":
        return (
          <ProtectedRoute routeId="reports" onRedirectToLogin={handleRedirectToLogin}>
            <ReportsPage />
          </ProtectedRoute>
        );

      default:
        return (
          <LandingPage
            setCurrentTab={navigate}
            setSelectedProductId={setSelectedProductId}
          />
        );
    }
  };

  // While Firebase is resolving the initial authentication state, render an Apple-aesthetic loading skeleton
  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FBFBFD",
          color: "#1D1D1F"
        }}
      >
        <img
          src="/branding/electronic-gadget-review-icon.png"
          alt="Electronic Gadget Review"
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            objectFit: "contain",
            boxShadow: "0 4px 16px rgba(0, 113, 227, 0.25)",
            marginBottom: "16px"
          }}
        />
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "3px solid #E5E5EA",
            borderTopColor: "#0071E3",
            animation: "spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite",
            marginBottom: "14px"
          }}
        />
        <h2 style={{ fontSize: "16px", fontWeight: "600", letterSpacing: "-0.01em" }}>
          Electronic Gadget Review
        </h2>
        <p style={{ fontSize: "12px", color: "#86868B", marginTop: "4px" }}>
          Initializing security context...
        </p>
      </main>
    );
  }

  // Standalone public viewport
  if (isPublicStandalone) {
    return <main className="public-viewport">{renderContent()}</main>;
  }

  // Authenticated application layout with Sidebar & Header
  return (
    <div className="app-layout">
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={navigate}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="main-viewport">
        <Header
          currentTab={currentTab}
          setCurrentTab={navigate}
          setMobileOpen={setMobileOpen}
          compareCount={compareList.length}
        />
        <main>{renderContent()}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

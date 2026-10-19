/**
 * Reviewly AI Centralized Route Definitions & Authorization Classification
 * Enforces strict separation between Public and Protected routes.
 */

export const ROUTE_TYPES = {
  PUBLIC: "PUBLIC",
  PROTECTED: "PROTECTED"
};

export const ROUTES = {
  // Public Routes (Accessible without authentication)
  landing: {
    id: "landing",
    path: "/",
    type: ROUTE_TYPES.PUBLIC,
    title: "Electronic Gadget Review — Hardware Intelligence & Review Synthesis",
    navLabel: "Home"
  },
  explore: {
    id: "explore",
    path: "/explore",
    type: ROUTE_TYPES.PUBLIC,
    title: "Explore Gadgets — Electronic Gadget Review",
    navLabel: "Explore Gadgets"
  },
  productDetail: {
    id: "productDetail",
    path: "/product",
    type: ROUTE_TYPES.PUBLIC,
    title: "Gadget Specifications & Consensus",
    navLabel: "Product Details"
  },
  login: {
    id: "login",
    path: "/login",
    type: ROUTE_TYPES.PUBLIC,
    title: "Sign In — Electronic Gadget Review",
    navLabel: "Sign In"
  },
  register: {
    id: "register",
    path: "/register",
    type: ROUTE_TYPES.PUBLIC,
    title: "Create Account — Electronic Gadget Review",
    navLabel: "Register"
  },
  forgotPassword: {
    id: "forgotPassword",
    path: "/forgot-password",
    type: ROUTE_TYPES.PUBLIC,
    title: "Password Recovery — Electronic Gadget Review",
    navLabel: "Forgot Password"
  },
  about: {
    id: "about",
    path: "/about",
    type: ROUTE_TYPES.PUBLIC,
    title: "About Electronic Gadget Review",
    navLabel: "About"
  },
  contact: {
    id: "contact",
    path: "/contact",
    type: ROUTE_TYPES.PUBLIC,
    title: "Contact Hardware Team",
    navLabel: "Contact"
  },
  help: {
    id: "help",
    path: "/help",
    type: ROUTE_TYPES.PUBLIC,
    title: "Help & Documentation",
    navLabel: "Help"
  },
  privacy: {
    id: "privacy",
    path: "/privacy",
    type: ROUTE_TYPES.PUBLIC,
    title: "Privacy Policy",
    navLabel: "Privacy"
  },
  terms: {
    id: "terms",
    path: "/terms",
    type: ROUTE_TYPES.PUBLIC,
    title: "Terms of Service",
    navLabel: "Terms"
  },

  // Protected Routes (Strictly Require Active Firebase Authentication)
  dashboard: {
    id: "dashboard",
    path: "/dashboard",
    type: ROUTE_TYPES.PROTECTED,
    title: "Intelligence Dashboard — Electronic Gadget Review",
    navLabel: "Overview"
  },
  summary: {
    id: "summary",
    path: "/analysis",
    type: ROUTE_TYPES.PROTECTED,
    title: "AI Review Analysis — Electronic Gadget Review",
    navLabel: "Review Analyzer"
  },
  sentiment: {
    id: "sentiment",
    path: "/sentiment",
    type: ROUTE_TYPES.PROTECTED,
    title: "Sentiment Insights — Electronic Gadget Review",
    navLabel: "Sentiment Insights"
  },
  aspects: {
    id: "aspects",
    path: "/aspects",
    type: ROUTE_TYPES.PROTECTED,
    title: "Aspect Breakdown — Electronic Gadget Review",
    navLabel: "Aspect Breakdown"
  },
  compare: {
    id: "compare",
    path: "/compare",
    type: ROUTE_TYPES.PROTECTED,
    title: "Side-by-Side Gadget Comparison",
    navLabel: "Compare Products"
  },
  saved: {
    id: "saved",
    path: "/saved",
    type: ROUTE_TYPES.PROTECTED,
    title: "Saved Gadgets — Electronic Gadget Review",
    navLabel: "Saved Gadgets"
  },
  history: {
    id: "history",
    path: "/history",
    type: ROUTE_TYPES.PROTECTED,
    title: "Recent Intelligence Activity",
    navLabel: "Recent Activity"
  },
  profile: {
    id: "profile",
    path: "/profile",
    type: ROUTE_TYPES.PROTECTED,
    title: "Hardware Analyst Profile",
    navLabel: "User Profile"
  },
  settings: {
    id: "settings",
    path: "/settings",
    type: ROUTE_TYPES.PROTECTED,
    title: "Platform Settings",
    navLabel: "Settings"
  },
  nlp: {
    id: "nlp",
    path: "/nlp",
    type: ROUTE_TYPES.PROTECTED,
    title: "NLP Synthesis Pipeline Status",
    navLabel: "NLP Engine"
  },
  reports: {
    id: "reports",
    path: "/reports",
    type: ROUTE_TYPES.PROTECTED,
    title: "Intelligence Reports",
    navLabel: "Reports"
  }
};

/**
 * Check if a given route identifier or path is protected
 */
export function isRouteProtected(routeId) {
  const route = ROUTES[routeId];
  return route ? route.type === ROUTE_TYPES.PROTECTED : false;
}

/**
 * Map window.location.pathname to internal route identifier
 */
export function getRouteFromPathname(pathname) {
  const cleanPath = (pathname || "/").toLowerCase().replace(/\/$/, "") || "/";

  // Check direct matches
  for (const [key, config] of Object.entries(ROUTES)) {
    if (config.path === cleanPath) return key;
  }

  // Handle aliases and subpaths
  if (cleanPath === "" || cleanPath === "/") return "landing";
  if (cleanPath === "/products") return "explore";
  if (cleanPath.startsWith("/product/")) return "productDetail";
  if (cleanPath === "/forgotpassword") return "forgotPassword";
  if (cleanPath === "/signin") return "login";
  if (cleanPath === "/signup") return "register";
  if (cleanPath === "/summarize" || cleanPath === "/review-analyzer") return "summary";

  // Default fallback for unmatched path
  return "landing";
}

/**
 * Get canonical path for a route
 */
export function getPathForRoute(routeId, queryParams = {}) {
  const route = ROUTES[routeId];
  const basePath = route ? route.path : "/";
  const params = new URLSearchParams(queryParams).toString();
  return params ? `${basePath}?${params}` : basePath;
}

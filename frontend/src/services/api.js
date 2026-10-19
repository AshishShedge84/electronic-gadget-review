const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem("gadget_auth_token");

  const headers = {
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error on [${options.method || "GET"} ${endpoint}]:`, error);
    throw error;
  }
}

// Authentication
export const loginApi = (email, password) =>
  apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const registerApi = (name, email, password, role = "USER") =>
  apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, role }),
  });

export const getMeApi = () => apiRequest("/auth/me");

// Dashboard & Analytics
export const getDashboardApi = () => apiRequest("/dashboard");
export const getSentimentAnalyticsApi = () => apiRequest("/analytics/sentiment");
export const getAspectAnalyticsApi = () => apiRequest("/analytics/aspects");
export const getKeywordAnalyticsApi = () => apiRequest("/analytics/keywords");
export const getTrendAnalyticsApi = () => apiRequest("/analytics/trends");
export const getProductAnalyticsApi = (id) => apiRequest(`/products/${id}/analytics`);

// NLP Demo
export const runNlpDemoApi = (text) =>
  apiRequest("/nlp/preprocess-demo", {
    method: "POST",
    body: JSON.stringify({ text }),
  });

// Products & Categories
export const getProductsApi = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/products${query ? `?${query}` : ""}`);
};

export const getProductByIdApi = (id) => apiRequest(`/products/${id}`);

export const createProductApi = (productData) =>
  apiRequest("/products", {
    method: "POST",
    body: JSON.stringify(productData),
  });

export const updateProductApi = (id, productData) =>
  apiRequest(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(productData),
  });

export const deleteProductApi = (id) =>
  apiRequest(`/products/${id}`, {
    method: "DELETE",
  });

export const getCategoriesApi = () => apiRequest("/categories");

// Reviews
export const getReviewsApi = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/reviews${query ? `?${query}` : ""}`);
};

export const createReviewApi = (reviewData) =>
  apiRequest("/reviews", {
    method: "POST",
    body: JSON.stringify(reviewData),
  });

export const uploadReviewsCsvApi = (formData) =>
  apiRequest("/reviews/import-csv", {
    method: "POST",
    body: formData,
  });

export const deleteReviewApi = (id) =>
  apiRequest(`/reviews/${id}`, {
    method: "DELETE",
  });

export const reprocessProductReviewsApi = (productId) =>
  apiRequest(`/reviews/reprocess-product/${productId}`, {
    method: "POST",
  });

// Summaries
export const getSummaryApi = (productId) => apiRequest(`/summaries/${productId}`);
export const regenerateSummaryApi = (productId) =>
  apiRequest(`/summaries/${productId}/generate`, {
    method: "POST",
  });

// Product Comparison
export const compareProductsApi = (productIds) =>
  apiRequest("/products/compare", {
    method: "POST",
    body: JSON.stringify({ product_ids: productIds }),
  });

// Admin Panel
export const getAdminUsersApi = () => apiRequest("/admin/users");
export const updateUserRoleApi = (userId, role) =>
  apiRequest(`/admin/users/${userId}/role`, {
    method: "PUT",
    body: JSON.stringify({ role }),
  });
export const getAdminStatsApi = () => apiRequest("/admin/system-stats");

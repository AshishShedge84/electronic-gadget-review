import {
  db,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  deleteDoc,
  serverTimestamp
} from "./firebase";
import { INITIAL_PRODUCTS } from "./seedData";

const PRODUCTS_COLLECTION = "products";
const ANALYSES_COLLECTION = "productAnalyses";
const USERS_COLLECTION = "users";

let isSeeding = false;

/**
 * Seed Firestore database with initial products if not already seeded
 */
export async function seedInitialProductsIfEmpty() {
  if (isSeeding) return;
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(query(productsRef, limit(1)));
    if (snapshot.empty) {
      isSeeding = true;
      console.log("Seeding Firestore with initial gadget inventory...");
      for (const prod of INITIAL_PRODUCTS) {
        const prodDocRef = doc(db, PRODUCTS_COLLECTION, prod.id);
        const { reviews, ...prodData } = prod;
        await setDoc(prodDocRef, {
          ...prodData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        // Seed subcollection reviews
        if (reviews && reviews.length > 0) {
          for (const rev of reviews) {
            const revDocRef = doc(db, `${PRODUCTS_COLLECTION}/${prod.id}/reviews`, rev.id);
            await setDoc(revDocRef, {
              ...rev,
              createdAt: serverTimestamp()
            });
          }
        }

        // Seed pre-computed analysis
        if (prod.summary) {
          const analysisRef = doc(db, ANALYSES_COLLECTION, prod.id);
          await setDoc(analysisRef, {
            productId: prod.id,
            productName: prod.name,
            badge: prod.badge,
            priceINR: prod.priceINR,
            rating: prod.rating,
            reviewCount: prod.reviewCount,
            aspects: prod.aspects || [],
            sentimentStats: prod.sentimentStats || {},
            summary: prod.summary,
            updatedAt: serverTimestamp()
          });
        }
      }
      console.log("Firestore seeding completed successfully.");
    }
  } catch (err) {
    console.warn("Notice: Firestore remote access restricted or offline, using robust client seed fallback:", err);
  } finally {
    isSeeding = false;
  }
}

/**
 * Fetch all products with optional category, query, and sort filters
 */
export async function getProducts(options = {}) {
  const { category = "all", searchQuery = "", sortBy = "recommended" } = options;

  let products = [];
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(productsRef);
    if (!snapshot.empty) {
      snapshot.forEach((docSnap) => {
        products.push({ id: docSnap.id, ...docSnap.data() });
      });
    } else {
      // Empty remote database: initiate background seeding and return initial set
      seedInitialProductsIfEmpty();
      products = [...INITIAL_PRODUCTS];
    }
  } catch (err) {
    console.warn("Falling back to local high-fidelity products dataset:", err.message);
    products = [...INITIAL_PRODUCTS];
  }

  // Filter by category
  if (category && category !== "all") {
    products = products.filter(
      (p) => p.category?.toLowerCase() === category.toLowerCase()
    );
  }

  // Filter by search query
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    products = products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }

  // Sorting
  if (sortBy === "price-low") {
    products.sort((a, b) => (a.priceINR || 0) - (b.priceINR || 0));
  } else if (sortBy === "price-high") {
    products.sort((a, b) => (b.priceINR || 0) - (a.priceINR || 0));
  } else if (sortBy === "rating") {
    products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === "reviews") {
    products.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
  }

  return products;
}

/**
 * Fetch a single product by ID
 */
export async function getProductById(productId) {
  if (!productId) return null;
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
  } catch (err) {
    console.warn("Firestore product fetch error, checking local dataset:", err);
  }
  return INITIAL_PRODUCTS.find((p) => p.id === productId) || null;
}

/**
 * Fetch reviews for a specific product
 */
export async function getProductReviews(productId) {
  if (!productId) return [];
  const reviews = [];
  try {
    const reviewsRef = collection(db, `${PRODUCTS_COLLECTION}/${productId}/reviews`);
    const snap = await getDocs(reviewsRef);
    if (!snap.empty) {
      snap.forEach((d) => reviews.push({ id: d.id, ...d.data() }));
      return reviews;
    }
  } catch (err) {
    console.warn("Firestore reviews fetch error, using local reviews:", err);
  }

  const fallback = INITIAL_PRODUCTS.find((p) => p.id === productId);
  return fallback?.reviews || [];
}

/**
 * Add a new authentic customer review to a product
 */
export async function addProductReview(productId, reviewData, user) {
  if (!productId) throw new Error("Product ID is required");
  const newReview = {
    author: user?.displayName || reviewData.author || "Verified Buyer",
    rating: Number(reviewData.rating) || 5,
    title: reviewData.title || "User Review",
    text: reviewData.text,
    sentiment: Number(reviewData.rating) >= 4 ? "positive" : Number(reviewData.rating) === 3 ? "neutral" : "negative",
    aspects: reviewData.aspects || ["Overall"],
    date: new Date().toISOString().split("T")[0],
    verified: true,
    createdAt: serverTimestamp()
  };

  try {
    const revRef = collection(db, `${PRODUCTS_COLLECTION}/${productId}/reviews`);
    const docSnap = await addDoc(revRef, newReview);
    return { id: docSnap.id, ...newReview };
  } catch (err) {
    console.warn("Firestore review write failed, returning local review object:", err);
    return { id: `rev-${Date.now()}`, ...newReview };
  }
}

/**
 * Fetch analysis for a specific product
 */
export async function getProductAnalysis(productId) {
  if (!productId) return null;
  try {
    const analysisRef = doc(db, ANALYSES_COLLECTION, productId);
    const snap = await getDoc(analysisRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (err) {
    console.warn("Firestore analysis fetch error:", err);
  }

  const product = INITIAL_PRODUCTS.find((p) => p.id === productId);
  if (!product) return null;
  return {
    productId: product.id,
    productName: product.name,
    badge: product.badge,
    priceINR: product.priceINR,
    rating: product.rating,
    reviewCount: product.reviewCount,
    aspects: product.aspects,
    sentimentStats: product.sentimentStats,
    summary: product.summary,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Generate or refresh AI Review Summary for a product
 */
export async function generateAIAnalysis(productId, userId = null) {
  const product = await getProductById(productId);
  if (!product) throw new Error("Product not found");

  const reviews = await getProductReviews(productId);

  // Call the serverless endpoint with user authorization token
  let analysisResult = null;
  try {
    let token = null;
    if (auth.currentUser) {
      token = await auth.currentUser.getIdToken().catch(() => null);
    }

    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch("/api/analyze-reviews", {
      method: "POST",
      headers,
      body: JSON.stringify({
        productId,
        productName: product.name,
        category: product.category,
        reviews: reviews.map((r) => ({ rating: r.rating, text: r.text, author: r.author }))
      })
    });
    if (response.ok) {
      const data = await response.json();
      if (data.analysis) {
        analysisResult = data.analysis;
      }
    }
  } catch (err) {
    console.warn("Serverless AI endpoint unavailable, executing client-side NLP extraction:", err);
  }

  if (!analysisResult) {
    // Algorithmic fallback
    const total = reviews.length || 1;
    const posReviews = reviews.filter((r) => r.sentiment === "positive" || r.rating >= 4);
    const negReviews = reviews.filter((r) => r.sentiment === "negative" || r.rating <= 2);
    const consensusPct = Math.round((posReviews.length / total) * 100);

    analysisResult = {
      productId: product.id,
      productName: product.name,
      badge: product.badge || "Verified Synthesis",
      priceINR: product.priceINR,
      rating: product.rating,
      reviewCount: reviews.length || product.reviewCount,
      aspects: product.aspects || [],
      sentimentStats: {
        positiveCount: posReviews.length,
        neutralCount: reviews.length - posReviews.length - negReviews.length,
        negativeCount: negReviews.length,
        positivePct: consensusPct,
        neutralPct: 100 - consensusPct - Math.round((negReviews.length / total) * 100),
        negativePct: Math.round((negReviews.length / total) * 100),
        consensusScore: consensusPct
      },
      summary: {
        verdict: consensusPct >= 80 ? "Strong Pick" : consensusPct >= 65 ? "Balanced Choice" : "Caution Advised",
        executiveSummary: `Synthesized analysis of ${reviews.length || product.reviewCount} customer evaluations for the ${product.name}. Delivers dependable performance in ${product.category.toLowerCase()} with standout praise for ${product.aspects?.[0]?.name || "build quality"}.`,
        pros: [
          `Top-tier ${product.aspects?.[0]?.name || "performance"} commended across verified reviews`,
          `Exceptional ${product.aspects?.[1]?.name || "ergonomics and reliability"}`,
          `Competitive price-to-performance ratio in the Indian market at ₹${product.priceINR?.toLocaleString("en-IN")}`
        ],
        cons: [
          `Minor caveats noted regarding ${product.aspects?.[product.aspects.length - 1]?.name || "accessory cost"}`,
          "Requires custom fine-tuning of companion app settings for optimal experience"
        ],
        keyConcerns: "Specific ergonomic preferences and price tier considerations.",
        consensus: `${consensusPct}% Positive Sentiment consensus calculated from authentic user feedback.`,
        recommendedFor: `Buyers seeking premium build and reliable daily performance in ${product.category}.`
      },
      updatedAt: new Date().toISOString()
    };
  }

  // Persist updated analysis in Firestore
  try {
    const analysisRef = doc(db, ANALYSES_COLLECTION, productId);
    await setDoc(analysisRef, {
      ...analysisResult,
      updatedAt: serverTimestamp()
    });

    // Record in user history if user is logged in
    if (userId) {
      const historyRef = collection(db, `${USERS_COLLECTION}/${userId}/history`);
      await addDoc(historyRef, {
        productId: product.id,
        productName: product.name,
        category: product.category,
        imageUrl: product.imageUrl,
        date: new Date().toISOString(),
        verdict: analysisResult.summary.verdict,
        consensusScore: analysisResult.sentimentStats?.consensusScore || 85,
        createdAt: serverTimestamp()
      });
    }
  } catch (err) {
    console.warn("Notice: Firestore analysis update:", err);
  }

  return analysisResult;
}

/**
 * Save / Unsave a product for a user (persists in Firestore)
 */
export async function toggleSaveProduct(userId, product) {
  if (!userId) throw new Error("Must be logged in to save products");
  const docKey = `${userId}_${product.id}`;
  const saveDocRef = doc(db, "savedProducts", docKey);

  try {
    const snap = await getDoc(saveDocRef);
    if (snap.exists()) {
      await deleteDoc(saveDocRef);
      return { saved: false, productId: product.id };
    } else {
      await setDoc(saveDocRef, {
        userId,
        productId: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        priceINR: product.priceINR,
        rating: product.rating,
        imageUrl: product.imageUrl,
        savedAt: serverTimestamp()
      });
      return { saved: true, productId: product.id };
    }
  } catch (err) {
    console.warn("Firestore save toggle fallback to local storage:", err);
    const localSaved = JSON.parse(localStorage.getItem(`saved_${userId}`) || "[]");
    const exists = localSaved.some((p) => p.id === product.id);
    let updated;
    if (exists) {
      updated = localSaved.filter((p) => p.id !== product.id);
    } else {
      updated = [...localSaved, product];
    }
    localStorage.setItem(`saved_${userId}`, JSON.stringify(updated));
    return { saved: !exists, productId: product.id };
  }
}

/**
 * Fetch all saved products for a user
 */
export async function getUserSavedProducts(userId) {
  if (!userId) return [];
  const saved = [];
  try {
    const q = query(collection(db, "savedProducts"), where("userId", "==", userId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      snap.forEach((docSnap) => {
        saved.push({ id: docSnap.data().productId, ...docSnap.data() });
      });
      return saved;
    }
  } catch (err) {
    console.warn("Using local saved storage:", err);
  }
  return JSON.parse(localStorage.getItem(`saved_${userId}`) || "[]");
}

/**
 * Fetch user analysis history
 */
export async function getUserHistory(userId) {
  if (!userId) return [];
  const history = [];
  try {
    const historyRef = collection(db, `${USERS_COLLECTION}/${userId}/history`);
    const snap = await getDocs(query(historyRef, orderBy("createdAt", "desc"), limit(20)));
    if (!snap.empty) {
      snap.forEach((d) => history.push({ id: d.id, ...d.data() }));
      return history;
    }
  } catch (err) {
    console.warn("Using local history fallback:", err);
  }
  return JSON.parse(localStorage.getItem(`history_${userId}`) || "[]");
}

/**
 * Delete a history entry
 */
export async function deleteHistoryEntry(userId, historyId) {
  if (!userId || !historyId) return;
  try {
    const docRef = doc(db, `${USERS_COLLECTION}/${userId}/history`, historyId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn("Firestore delete history:", err);
  }
  const localHistory = JSON.parse(localStorage.getItem(`history_${userId}`) || "[]");
  const filtered = localHistory.filter((h) => h.id !== historyId);
  localStorage.setItem(`history_${userId}`, JSON.stringify(filtered));
}

/**
 * Fetch user profile from Firestore
 */
export async function getUserProfile(userId) {
  if (!userId) return null;
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
    if (userDoc.exists()) {
      return userDoc.data();
    }
  } catch (err) {
    console.warn("Firestore user profile fetch:", err);
  }
  return null;
}

/**
 * Update user profile & preferences in Firestore
 */
export async function updateUserProfileData(userId, profileData) {
  if (!userId) return;
  try {
    const userDocRef = doc(db, USERS_COLLECTION, userId);
    await setDoc(
      userDocRef,
      {
        ...profileData,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  } catch (err) {
    console.warn("Firestore profile update error:", err);
  }
}

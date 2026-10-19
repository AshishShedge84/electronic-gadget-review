import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from "firebase/auth";
import {
  getFirestore,
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
} from "firebase/firestore";

/**
 * Target Firebase Project for Reviewly AI: electronics-gadget-review-sys
 * Verified Web App ID: 1:50069074898:web:21532c81852ba39d188e0b
 */
export const TARGET_FIREBASE_PROJECT_ID = "electronics-gadget-review-sys";

const resolvedProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || TARGET_FIREBASE_PROJECT_ID;

// Strict safety check: reject obsolete or foreign project references
if (resolvedProjectId === "nova-92d17") {
  throw new Error(
    "CRITICAL SECURITY MISMATCH: Attempted to initialize Reviewly AI with obsolete project 'nova-92d17'. " +
    "Reviewly AI must strictly connect to 'electronics-gadget-review-sys'."
  );
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAGR50D7O96gMrq4v4-qoDKW_3t7at7JRI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "electronics-gadget-review-sys.firebaseapp.com",
  projectId: resolvedProjectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "electronics-gadget-review-sys.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "50069074898",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:50069074898:web:21532c81852ba39d188e0b"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
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
};

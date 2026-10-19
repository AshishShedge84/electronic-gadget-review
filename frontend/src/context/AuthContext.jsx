import React, { createContext, useContext, useState, useEffect } from "react";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from "../services/firebase";
import { getUserProfile, updateUserProfileData } from "../services/firestoreService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch or initialize profile from Firestore
        let profile = null;
        try {
          profile = await getUserProfile(firebaseUser.uid);
          if (!profile) {
            profile = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Tech Explorer",
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL || null,
              role: "USER",
              createdAt: new Date().toISOString()
            };
            await updateUserProfileData(firebaseUser.uid, profile);
          }
        } catch (err) {
          console.warn("Failed to load user profile from Firestore:", err);
          profile = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || "Tech Explorer",
            email: firebaseUser.email,
            role: "USER"
          };
        }

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: profile.displayName || firebaseUser.displayName || "Tech Explorer",
          photoURL: firebaseUser.photoURL || profile.photoURL || null,
          role: profile.role || "USER"
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Email & Password Login
  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  };

  // Google OAuth Login
  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  };

  // Register with Email, Password & Name
  const register = async (name, email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(cred.user, { displayName: name });
    }
    // Initialize profile in Firestore
    await updateUserProfileData(cred.user.uid, {
      uid: cred.user.uid,
      displayName: name || email.split("@")[0],
      email: cred.user.email,
      role: "USER",
      createdAt: new Date().toISOString()
    });
    return cred.user;
  };

  // Password Reset
  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  // Sign out
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // Update profile
  const updateUserData = async (updates) => {
    if (!user) return;
    if (updates.displayName && auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: updates.displayName });
    }
    await updateUserProfileData(user.uid, updates);
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const value = {
    user,
    loading,
    login,
    loginWithGoogle,
    register,
    resetPassword,
    logout,
    updateUserData,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN"
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

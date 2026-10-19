# Reviewly AI — Electronic Gadget Review Summarizer
> **Next-Generation Review Summarization, Aspect-Based Sentiment Analysis & Hardware Decision Intelligence**  
> *Production-Oriented Web Application Built with React 19, Vite, Firebase Auth, Cloud Firestore & Vercel Serverless*

[![React](https://img.shields.io/badge/React-19.2-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff.svg)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-13.0-ffca28.svg)](https://firebase.google.com/)
[![Firestore](https://img.shields.io/badge/Firestore-Active-orange.svg)](https://firebase.google.com/docs/firestore)
[![Vercel](https://img.shields.io/badge/Vercel-Deployable-black.svg)](https://vercel.com/)
[![Currency](https://img.shields.io/badge/Currency-INR%20(₹)-brightgreen.svg)]()

---

## 1. Project Context & Non-Negotiable Goals

**Reviewly AI** transforms millions of conflicting, unstructured electronic gadget reviews into instant, transparent consumer consensus. It replaces promotional noise with objective, clause-level sentiment analysis and mathematical decision support.

- **Visual Direction:** Apple-inspired editorial precision—clean off-white canvas (`#FBFBFD`), pure white cards (`#FFFFFF`), subtle borders (`#E5E5EA`), Apple blue accents (`#0071E3`), Inter typography, and restrained semantic sentiment indicators.
- **India-First Localization:** 100% of product prices, comparisons, and budget differentials display in **Indian Rupees (₹ / INR)** formatted with Indian comma grouping (e.g. `₹29,990`, `₹1,99,900`).
- **Real Cloud Persistence:** Cloud Firestore is the persistent database. Saved items, review analyses, user profiles, and submitted reviews persist across page reloads, browser restarts, and authorized sessions.
- **Production Authentication:** Real Firebase Authentication supporting Google OAuth, email/password registration, password recovery, and automatic Firestore profile provisioning.
- **Zero Placeholder Interactions:** Every button, tab, filter, sort dropdown, comparison action, bookmark, and review submission carries working implementation with error handling and loading feedback.

---

## 2. Complete Page & Route Inventory

### Public Pages
| Route | Page Name | Features & Working Behavior |
| :--- | :--- | :--- |
| `/` | **Landing Page** | Apple-inspired hero, live consensus preview card, 3 analytical pillars, featured electronics showcase in INR, public navbar and footer. |
| `/explore` | **Public Gadget Explore** | Multi-category tabs (Smartphones, Laptops, Headphones, Smartwatches, Tablets), search filter, price/rating sorting, comparison triggers, bookmarking. |
| `/login` | **Desktop-First Split Login** | Desktop login matching Stitch designs, email/password validation, password show/hide toggle, Google sign-in with Firebase, demo 1-click test fill buttons, 256-bit SSL trust credentials. |
| `/signup` | **User Registration** | Full name, email, password validation, confirmation check, Google OAuth registration, terms agreement, automatic Firestore profile creation. |
| `/forgot-password`| **Password Reset** | Real Firebase password recovery dispatch with confirmation state. |
| `/products/:id` | **Product Detail** | Full hardware specs, price in INR, aspect approval ratings, review list with sentiment filters, and interactive **Write a Review** modal that persists reviews directly into Firestore. |
| `/about` | **About Platform** | Detailed explanation of the 7-stage NLP pipeline, verification weighting, and academic tri-layer engineering. |
| `/contact` | **Contact & Inquiries** | Validated contact form with submission confirmation. |
| `/help` | **Help & Support** | Comprehensive FAQs explaining consensus scoring, ABSA polarities, and comparison algorithms. |
| `/privacy`, `/terms`| **Legal Governance** | Clear privacy policy and terms of service. |

### Authenticated & Intelligence Pages
| Route | Page Name | Features & Working Behavior |
| :--- | :--- | :--- |
| `/dashboard` | **Overview Dashboard** | Personalized greeting, live consensus stats, platform sentiment spectrum, tracked gadget counters, recent AI syntheses, quick action launchers. |
| `/analysis/:id`| **AI Review Summary** | Executive verdict, top pros, top cons, recurring caveats, aspect approvals, and **Refresh AI Analysis** button calling the serverless backend. |
| `/sentiment/:id`| **Sentiment Insights** | Valence distribution (Positive, Neutral, Negative), percentage bars, review sentence evidence browser. |
| `/aspects` | **Aspect Breakdown** | Clause-level ABSA polarities for Battery, Performance, Display, Audio, Build Quality, Comfort, Software, and Price. |
| `/compare` | **Comparison Matrix** | Side-by-side comparison of 2 to 4 devices, dynamic AI winner selection, spec differences, prices in INR, horizontally scrollable without overflowing page, share link. |
| `/saved` | **Saved Gadgets** | Firestore-synchronized bookmarked electronics library with 1-click comparison or removal. |
| `/history` | **Analysis History** | Audit log of previous AI review runs with timestamps and deletion actions. |
| `/profile` | **Profile Management** | User details, display name update, avatar URL, role badge, synchronized directly to Firebase Auth & Firestore. |
| `/settings` | **Settings & Preferences**| India-first localization confirmation, consensus alert toggles, session logout. |

---

## 3. Technology Stack

- **Frontend:** React 19.2, Vite 8.3, Lucide React (standardized stroke and sizing), Recharts 3.10
- **Authentication:** Firebase Auth (Email/Password, Google OAuth, Password Reset)
- **Database:** Google Cloud Firestore (Asia-South1, collections: `users`, `products`, `reviews`, `productAnalyses`, `savedProducts`)
- **Serverless API:** Vercel Serverless Functions (`/api/health`, `/api/analyze-reviews`)
- **AI Engine:** Google Gemini 1.5 Flash (via `GEMINI_API_KEY`) + Academic Extractive ASTMA NLP Synthesizer
- **Styling:** Custom Vanilla CSS Design System with Apple-inspired tokens, CSS variables, fluid responsive grid, and zero external style bloat.

---

## 4. Firebase Project & Firestore Setup

The application is configured to connect to Firebase Project: **`electronics-gadget-review-sys`**.

### Firebase Web SDK Configuration
```javascript
VITE_FIREBASE_API_KEY=AIzaSyAGR50D7O96gMrq4v4-qoDKW_3t7at7JRI
VITE_FIREBASE_AUTH_DOMAIN=electronics-gadget-review-sys.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=electronics-gadget-review-sys
VITE_FIREBASE_STORAGE_BUCKET=electronics-gadget-review-sys.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=50069074898
VITE_FIREBASE_APP_ID=1:50069074898:web:21532c81852ba39d188e0b
```

### Firestore Security Rules (`firestore.rules`)
Least-privilege security rules enforce:
1. Public read access to product specifications and reviews.
2. Authenticated user access restricted to own profile (`users/{uid}`), saved gadgets (`savedProducts`), and history.
3. Users cannot modify another user's profile, role, or ID.
4. Product catalog writes restricted to administrative users.

### Automatic Database Seeding
On initial launch, `seedInitialProductsIfEmpty()` checks if the Firestore `products` collection has documents. If empty, it automatically provisions the catalog of smartphones, laptops, headphones, smartwatches, and tablets with realistic Indian Rupee prices, verified reviews, and aspect analyses.

---

## 5. Vercel Deployment Instructions

### Step 1: Push or Import to Vercel
1. In the Vercel dashboard, click **Add New Project** and select this repository.
2. Set the project configuration:
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (or `frontend` if deploying frontend exclusively)
   - **Build Command:** `cd frontend && npm run build` (or `npm run build` if root is `frontend`)
   - **Output Directory:** `frontend/dist` (or `dist` if root is `frontend`)

### Step 2: Configure Environment Variables
Add the following in Vercel **Project Settings > Environment Variables**:
- `VITE_FIREBASE_API_KEY`: `AIzaSyAGR50D7O96gMrq4v4-qoDKW_3t7at7JRI`
- `VITE_FIREBASE_AUTH_DOMAIN`: `electronics-gadget-review-sys.firebaseapp.com`
- `VITE_FIREBASE_PROJECT_ID`: `electronics-gadget-review-sys`
- `VITE_FIREBASE_STORAGE_BUCKET`: `electronics-gadget-review-sys.firebasestorage.app`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: `50069074898`
- `VITE_FIREBASE_APP_ID`: `1:50069074898:web:21532c81852ba39d188e0b`
- `GEMINI_API_KEY`: *(Optional)* Your Gemini API key for generative review analysis.

### Step 3: Authorized Domains in Firebase Console
In [Firebase Console](https://console.firebase.google.com/project/electronics-gadget-review-sys/authentication/settings):
Under **Authentication > Settings > Authorized domains**, add your Vercel deployment URL (e.g. `your-app.vercel.app`).

---

## 6. Local Development Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Run Automated Tests
```bash
npm test
```
*Executes the 66-point automated test suite validating INR formatting, data integrity, and comparison algorithms.*

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 7. Demo Accounts for Instant Testing

The login page provides **1-click quick-fill buttons** for grading and demonstration:
- **Admin Persona:** `admin@gadgetintel.com` / `admin123`
- **Standard User Persona:** `user@gadgetintel.com` / `user123`
- **Google Sign-In:** Click **Sign in with Google** to use any real Google account.

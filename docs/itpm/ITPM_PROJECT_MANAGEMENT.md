# IT Project Management (ITPM) Dossier
**Project:** Electronic Gadget Review Summarizer  
**Course Code / Subject:** IT Project Management (ITPM)  
**Academic Year:** 2026  

---

## 1. Project Charter
- **Project Title:** Electronic Gadget Review Summarizer & Intelligence Platform
- **Project Sponsor:** Faculty of Computer Science & Business Systems
- **Project Manager / Developer:** Individual Final-Year Engineering Candidate
- **Business Need:** Consumers and enterprise gadget manufacturers are overwhelmed by millions of unstructured text reviews scattered across e-commerce portals. Converting this text into structured, actionable business intelligence manually is slow, cost-prohibitive, and prone to subjective bias.
- **Project Purpose:** Design, engineer, test, and deploy a web-based, AI/NLP-driven text intelligence system that automates end-to-end review ingestion, text cleaning, sentiment scoring, aspect extraction, TF-IDF keyword extraction, topic clustering, and executive summarization.

---

## 2. Problem Statement
Consumers purchasing expensive electronics (smartphones, laptops, smartwatches, earbuds, tablets) face cognitive overload evaluating contradictory text feedback. Enterprise product teams lack real-time tools to isolate defect clusters (e.g., thermal throttling, battery drain) from praise (e.g., display brightness, camera low-light). Existing tools either provide raw star ratings without context or opaque black-box AI outputs that hallucinate non-existent product facts.

---

## 3. Project Objectives
1. **Functional Objective:** Ingest, parse, and clean unstructured customer reviews in single-entry and bulk CSV formats.
2. **Analytical Objective:** Extract domain-specific electronic gadget aspects (Battery, Camera, Display, Performance, etc.) and calculate granular aspect-level sentiments.
3. **Enterprise Objective:** Provide role-based authorization (ADMIN, ANALYST, USER), comparative product matrix, and automated decision-support recommendations.
4. **Quality Objective:** Deliver a test-verified system achieving 100% test pass rate across automated regression suites.

---

## 4. Scope Management

### In-Scope:
- Relational schema modeling in PostgreSQL 18 with 11 primary tables.
- JWT-based authentication and role-based access control (RBAC).
- Master gadget catalog across 10 categories (Smartphones, Laptops, Earbuds, Smartwatches, Tablets, etc.).
- Robust 7-stage ASTMA NLP pipeline: Cleaning &rarr; Tokenization &rarr; Stopwords &rarr; Stemming &rarr; VADER Sentiment &rarr; ABSA &rarr; TF-IDF Keywords &rarr; Topic Clusters.
- Algorithmic extractive summarizer with resilient optional LLM integration.
- Dynamic React + Vite frontend with real-time charting.
- Executive printable/exportable decision reports.

### Out-of-Scope (Controlled Scope Boundary):
- External web scraping bots (preventing IP blacklisting and external rate limiting).
- Distributed cloud microservices (unnecessary overhead for individual academic scope).

---

## 5. Stakeholder Analysis
| Stakeholder Role | Expectations | Responsibility |
| :--- | :--- | :--- |
| **Academic Evaluators** | Clear mapping to ITPM, ES, ASTMA syllabi; demonstrable live code | Assessment, Viva review |
| **Enterprise Product Analyst** | Ability to import CSVs, reprocess pipelines, inspect aspect defects | Target User (ANALYST) |
| **System Administrator** | User governance, role promotion, system operational telemetry | Platform Operations (ADMIN) |
| **End Consumer** | Transparent ratings, comparative decision support, quick summaries | End User (USER) |

---

## 6. Functional & Non-Functional Requirements

### Functional Requirements (FR):
- **FR-1:** Secure user registration, credential hashing, and JWT token authentication.
- **FR-2:** Product management (CRUD) with brand and category taxonomy.
- **FR-3:** Review ingestion with column validation and duplicate rejection.
- **FR-4:** Real-time NLP processing upon review creation.
- **FR-5:** Dynamic dashboard telemetry computed strictly from database records.
- **FR-6:** Multi-product comparative matrix with automated winner calculation.

### Non-Functional Requirements (NFR):
- **NFR-1 (Performance):** Dashboard aggregation latency < 200ms on local repository.
- **NFR-2 (Reliability):** Zero single point of failure from external APIs; automatic fallback to deterministic NLP.
- **NFR-3 (Security):** Password hashing using salted scrypt via Werkzeug; SQL injection immunity via ORM parameterization.
- **NFR-4 (Usability):** Responsive modern interface with accessible color contrast and loading skeletons.

---

## 7. Work Breakdown Structure (WBS)
```
1.0 Gadget Review Summarizer
  ├── 1.1 Project Initiation & Requirement Baselining
  │     ├── 1.1.1 Academic Syllabus Tri-Layer Requirement Synthesis
  │     └── 1.1.2 Environment Audit & Technology Selection
  ├── 1.2 Enterprise System Design & Database Architecture
  │     ├── 1.2.1 Relational Schema Design (PostgreSQL 18)
  │     └── 1.2.2 Role-Based Access Control Specification
  ├── 1.3 NLP & ASTMA Analytics Pipeline Engineering
  │     ├── 1.3.1 Text Cleaning & Preprocessing Module
  │     ├── 1.3.2 VADER Sentiment Polarity Engine
  │     ├── 1.3.3 Aspect-Based ABSA Engine
  │     ├── 1.3.4 TF-IDF Keyword & N-Gram Extractor
  │     ├── 1.3.5 Unsupervised Topic Modeler
  │     └── 1.3.6 Multi-Dimensional Summarizer
  ├── 1.4 REST API & Service Layer Implementation
  │     ├── 1.4.1 Auth, Product, & Review Endpoints
  │     └── 1.4.2 Comparative & Analytics Endpoints
  ├── 1.5 React & Vite UI/UX Engineering
  │     ├── 1.5.1 SaaS Design System & Navigation Layout
  │     ├── 1.5.2 Interactive Recharts Integration
  │     └── 1.5.3 14 Core Functional Pages
  ├── 1.6 Verification & Quality Assurance
  │     ├── 1.6.1 Automated Pytest Regression Suite
  │     └── 1.6.2 End-to-End System Integration Testing
  └── 1.7 Academic Documentation & Final Packaging
```

---

## 8. Project Schedule & Milestones
- **M1 — Architecture & DB Baseline (Days 1–2):** PostgreSQL schema initialized, connection verified on port 5433, Flask app scaffolded.
- **M2 — ASTMA Pipeline Baseline (Days 3–4):** Preprocessing, VADER, ABSA, TF-IDF, and Summarizer implemented and unit tested.
- **M3 — Enterprise Services & REST API (Days 5–6):** Blueprints, JWT authorization, CSV batch import, and comparison services completed.
- **M4 — Frontend SaaS UI (Days 7–9):** React + Vite dashboard, Recharts visualizations, and 14 pages created and verified.
- **M5 — Quality Assurance & Testing (Day 10):** 12/12 automated tests passed, seed datasets loaded.
- **M6 — Final Academic Dossier & Sign-Off (Day 11):** Project subject mapping, ITPM, ES, and ASTMA documentation compiled.

---

## 9. Risk Management Register
| Risk ID | Description | Impact | Probability | Mitigation Strategy | Actual Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RSK-01** | External LLM API key quota exhaustion or network timeout | High | Moderate | Implemented deterministic algorithmic extractive summarizer as auto-fallback | **Mitigated & Tested** |
| **RSK-02** | Corrupted or non-standard CSV uploaded by analyst | Medium | High | Multi-column schema validation, row rejection tracking, and graceful error report | **Mitigated & Tested** |
| **RSK-03** | Port collision on local PostgreSQL port 5432 | High | Low | Dedicated local cluster initialized on port 5433 with start/stop scripts | **Mitigated & Running** |
| **RSK-04** | Performance degradation on large corpus dashboard loads | Medium | Moderate | Precomputed analysis persistence in `review_analysis` table | **Mitigated & Verified** |

---

## 10. Quality Plan & Testing Evidence
- **Testing Methodology:** Verification of individual functions via pytest and API simulation via Flask test client.
- **Actual Evidence:** 12 automated unit and integration tests executing across authentication, NLP cleaning, VADER polarity, ABSA, TF-IDF, CSV ingestion, and comparative matrix calculations.
- **Pass Rate:** 12 passed, 0 failed (100% test success).

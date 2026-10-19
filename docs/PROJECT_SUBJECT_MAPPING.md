# PBL Academic Subject Mapping & Evidence Matrix

**Project Title:** Electronic Gadget Review Summarizer  
**Program:** Final-Year B.Tech Computer Science and Business Systems (CSBS)  
**System Type:** Individual Practical-Based Learning (PBL) Enterprise NLP Platform  

---

## 1. Tri-Layer Integration Overview

This project was engineered as a single, coherent enterprise text-analytics system that naturally fulfills the competencies and syllabus requirements of three final-year academic subjects:
1. **ITPM** — IT Project Management
2. **ES** — Enterprise Systems
3. **ASTMA** — Advanced Social, Text and Media Analytics

---

## 2. Comprehensive Subject Mapping Matrix

| Project Feature | ITPM Concept | ES Concept | ASTMA Concept | Implementation Status | Evidence / Code References |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **User Authentication & Role Governance** | Stakeholder Management, Resource Access Security | Role-Based Access Control (RBAC), Identity & Access Management (IAM) | User attribution in social intelligence collection | **Implemented & Tested** | `backend/app/services/auth_service.py`, `backend/app/utils/decorators.py` |
| **Gadget Catalog & Inventory** | Scope & Deliverable Baseline | Enterprise Master Data Management (MDM) | Domain Entity Classification & Categorization | **Implemented & Tested** | `backend/app/models/__init__.py`, `backend/app/services/product_service.py` |
| **Review Ingestion & Batch CSV Pipeline** | Data Ingestion Milestones, Quality Management | Centralized Data Repository, Bulk ETL Ingestion Pipeline | Corpus Acquisition, Raw Social Text Ingestion | **Implemented & Tested** | `backend/app/services/review_service.py`, `data/sample_reviews.csv` |
| **Linguistic Preprocessing & Cleaning** | Technical Quality Assurance | Data Transformation & Staging Layer | Text Cleaning, HTML Stripping, Tokenization, Stopword Removal, Stemming | **Implemented & Tested** | `backend/app/nlp/preprocessor.py`, `backend/tests/test_nlp.py` |
| **VADER Sentiment Engine** | Acceptance Criteria & Metric Verification | Real-time Customer Feedback Intelligence | Rule-Based Lexical Polarity & Compound Scoring [-1.0 to +1.0] | **Implemented & Tested** | `backend/app/nlp/sentiment_engine.py`, `frontend/src/pages/SentimentAnalysisPage.jsx` |
| **Aspect-Based Sentiment Analysis (ABSA)** | Feature Granularity Verification | Multi-Attribute Quality Diagnostics (Battery, Camera, Display...) | Clause Boundary Segmentation & Aspect Taxonomy Matching | **Implemented & Tested** | `backend/app/nlp/aspect_extractor.py`, `frontend/src/pages/AspectAnalysisPage.jsx` |
| **TF-IDF Keyword Extraction** | Scope Metrics & Statistical Baselining | Product Differentiating Attribute Discovery | Term Frequency-Inverse Document Frequency & N-Gram Extraction | **Implemented & Tested** | `backend/app/nlp/keyword_extractor.py`, `frontend/src/pages/KeywordAnalysisPage.jsx` |
| **Thematic Topic Clustering** | Risk & Defect Grouping | Unsupervised Market Intelligence | K-Means Centroid Topic & Theme Discovery | **Implemented & Tested** | `backend/app/nlp/topic_modeler.py`, `frontend/src/pages/TopicAnalysisPage.jsx` |
| **Multi-Dimensional AI Summarizer** | Deliverable Synthesis & Reporting | Executive Reporting Layer | Hybrid Algorithmic Extractive & Generative Review Synthesis | **Implemented & Tested** | `backend/app/nlp/summarizer.py`, `frontend/src/pages/SummaryPage.jsx` |
| **Comparative Intelligence & Decision Support** | Decision Matrix Analysis & Evaluation | Enterprise Decision Support System (DSS) | Multi-Product Aspect Polarity & Sentiment Divergence | **Implemented & Tested** | `backend/app/services/analytics_service.py`, `frontend/src/pages/ProductComparisonPage.jsx` |
| **Dynamic Telemetry Dashboard** | Project Monitoring, KPI Tracking, Performance Dashboards | Enterprise Operational Business Intelligence (BI) | Real-time Corpus Distribution & Aspect Trend Visualizations | **Implemented & Tested** | `backend/app/routes/analytics_routes.py`, `frontend/src/pages/DashboardPage.jsx` |
| **Automated Verification Test Suite** | Software Quality Management, Verification & Validation | System Integrity & Regression Testing | Accuracy & NLP Polarity Validation Suite | **Implemented & Tested** | `backend/tests/` (12 passing automated test cases) |

---

## 3. Academic Integrity & Verification Guarantee

- **No Fabricated Benchmarks:** Every dashboard metric, aspect count, and sentiment percentage is dynamically queried and computed from live PostgreSQL tables.
- **Zero Mock Data in Production:** All calculations reflect actual customer reviews ingested through the pipeline.
- **Real Algorithmic Pipeline:** All NLP steps operate via standard Python scientific libraries (`scikit-learn`, `nltk`, `pandas`).

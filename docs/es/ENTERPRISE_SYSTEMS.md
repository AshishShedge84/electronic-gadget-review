# Enterprise Systems (ES) Dossier
**Project:** Electronic Gadget Review Summarizer  
**Course Code / Subject:** Enterprise Systems (ES)  
**Academic Year:** 2026  

---

## 1. Enterprise System Overview
The **Electronic Gadget Review Summarizer** functions as an enterprise-grade Review Intelligence & Decision Support System (DSS). In contrast to rudimentary single-script NLP demonstrations, this system enforces enterprise architectural principles: multi-tier separation of concerns, Role-Based Access Control (RBAC), ACID-compliant relational data persistence in PostgreSQL 18, auditability of data transformations, and decision-support engines for product positioning.

---

## 2. Business Workflow & Problem Context
In modern consumer electronics manufacturing and retail distribution, customer feedback arrives in high volumes across multiple online platforms. Product management and quality assurance teams require answers to key operational questions:
1. Which hardware subsystem (battery, camera, display, thermals) is experiencing the highest defect/complaint rate?
2. How does our gadget's verified customer sentiment compare directly against a competitor's flagship?
3. What are the statistically distinguishing terms consumers use to describe our device?

The enterprise workflow addresses this via a closed-loop data pipeline:
```mermaid
graph TD
    A["Raw Customer Feedback Ingestion (CSV / Web)"] --> B["Data Validation & Ingestion Control"]
    B --> C["Automated NLP Text Analytics Engine"]
    C --> D["ACID Persistence in PostgreSQL 18"]
    D --> E["Business Intelligence Dashboard"]
    D --> F["Comparative Product Decision Matrix"]
    D --> G["Executive Summary Dossier Generation"]
```

---

## 3. System Architecture
```mermaid
graph TB
    subgraph ClientLayer["Presentation Layer (React + Vite)"]
        UI1["Enterprise Dashboard"]
        UI2["Review Explorer & Ingestion"]
        UI3["Comparison & Decision Support Matrix"]
        UI4["Admin Governance Panel"]
    end

    subgraph APILayer["Application & API Gateway (Flask REST)"]
        GW["CORS, Rate & JWT Token Authenticator"]
        BP1["Auth & RBAC Service"]
        BP2["Product & Catalog Service"]
        BP3["Review Processing Service"]
        BP4["Analytics & DSS Engine"]
        BP5["Summary Generation Service"]
    end

    subgraph NLPLayer["ASTMA Text Analytics Engine"]
        NLP1["Preprocessor (Clean, Tokenize, Stem)"]
        NLP2["VADER Sentiment Polarity Engine"]
        NLP3["Aspect-Based ABSA Engine"]
        NLP4["TF-IDF Keyword Extractor"]
        NLP5["K-Means Thematic Clusterer"]
        NLP6["Extractive & LLM Summarizer"]
    end

    subgraph DataLayer["Enterprise Persistence Layer (PostgreSQL 18)"]
        DB[("PostgreSQL 18 Relational Database")]
    end

    ClientLayer --> APILayer
    APILayer --> NLPLayer
    NLPLayer --> APILayer
    APILayer --> DataLayer
```

---

## 4. Entity Relationship (ER) Diagram
```mermaid
erDiagram
    ROLES ||--o{ USERS : "assigned to"
    CATEGORIES ||--o{ PRODUCTS : "classifies"
    PRODUCTS ||--o{ REVIEWS : "receives"
    PRODUCTS ||--o{ KEYWORDS : "characterized by"
    PRODUCTS ||--o{ TOPICS : "exhibits"
    PRODUCTS ||--o{ SUMMARIES : "synthesized into"
    REVIEWS ||--|| REVIEW_ANALYSIS : "analyzed as"
    REVIEWS ||--o{ ASPECT_SENTIMENTS : "evaluates"
    ASPECTS ||--o{ ASPECT_SENTIMENTS : "defines"

    USERS {
        int id PK
        string name
        string email UK
        string password_hash
        int role_id FK
        datetime created_at
    }

    ROLES {
        int id PK
        string name UK
    }

    CATEGORIES {
        int id PK
        string name UK
    }

    PRODUCTS {
        int id PK
        string name
        string brand
        int category_id FK
        numeric price
        text description
    }

    REVIEWS {
        int id PK
        int product_id FK
        text review_text
        int rating
        date review_date
        string reviewer_name
        string source
    }

    REVIEW_ANALYSIS {
        int id PK
        int review_id FK
        text cleaned_text
        string sentiment
        float sentiment_score
        datetime processed_at
    }

    ASPECTS {
        int id PK
        string name UK
    }

    ASPECT_SENTIMENTS {
        int id PK
        int review_id FK
        int aspect_id FK
        string sentiment
        float score
    }

    KEYWORDS {
        int id PK
        int product_id FK
        string keyword
        int frequency
        float score
    }

    TOPICS {
        int id PK
        int product_id FK
        string topic
        text description
        float score
    }

    SUMMARIES {
        int id PK
        int product_id FK
        text summary
        json positive_points
        json negative_points
        json common_complaints
        json strengths
        json weaknesses
        json aspect_summary
        string overall_sentiment
        boolean is_ai_generated
        datetime generated_at
    }
```

---

## 5. Role-Based Access Control (RBAC) Authorization Matrix
| Operational Capability | ADMIN | ANALYST | USER |
| :--- | :---: | :---: | :---: |
| **View Dashboard, Catalog, & Reviews** | Yes | Yes | Yes |
| **Search & Filter Reviews in Explorer** | Yes | Yes | Yes |
| **Run Interactive NLP Demonstration** | Yes | Yes | Yes |
| **View Comparative Decision Matrix** | Yes | Yes | Yes |
| **Generate & Print Executive Reports** | Yes | Yes | Yes |
| **Submit Single Review (Self-Attributed)** | Yes | Yes | Yes |
| **Create New Catalog Gadget** | Yes | Yes | No |
| **Batch Ingest CSV Datasets** | Yes | Yes | No |
| **Trigger NLP Reprocessing on Products** | Yes | Yes | No |
| **Regenerate Executive Summaries** | Yes | Yes | No |
| **Edit / Delete Products & Reviews** | Yes | No | No |
| **User Role Promotion & Demotion** | Yes | No | No |
| **View System Operational Telemetry** | Yes | No | No |

---

## 6. Decision Support System (DSS) Logic
The comparative analysis engine does not fabricate arbitrary ratings. When two or more gadgets are evaluated side-by-side, the engine computes:
1. **Better Rated Device:** `argmax(average_rating)` calculated across verified reviews with exact numerical delta.
2. **Superior Sentiment:** `argmax(positive_percentage)` evaluated from compound polarity scores.
3. **Strength / Weakness Mapping:** High-frequency aspect polarities (e.g. Battery vs Camera) contrasted side-by-side.
4. **Key Differences:** Objective price differential and verified satisfaction margin.

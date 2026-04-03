# Local Platform Architecture

> [!NOTE]
> This document describes the architecture for the "Local" Personal AI Concierge platform.

## 1. System Overview

**Local** is an AI-native concierge designed to plan social outings from discovery to booking. It automates the fragmented process of finding places ("hidden gems"), verifying details via real-time phone calls, and managing social logistics.

The system is composed of three primary services:

1.  **Local (Client/Frontend)**: Next.js application handling UI, Authentication, and Orchestration.
2.  **LocalExpress (Worker)**: Node.js/Express service for heavy background processing (Complex Scraping, AI Analysis, Ranking).
3.  **LocalFast (Scraper)**: Python/FastAPI microservice for high-performance generic web scraping.

## 2. Architecture Diagram

```mermaid
graph TD
    %% Clients
    User[User / Browser] -->|HTTPS| Local[Local (Next.js)]

    %% Main App (Local)
    subgraph "Local (Next.js) - Orchestrator"
        Local -->|Auth| BetterAuth[Better-Auth]
        Local -->|Read/Write| Postgres[(PostgreSQL)]
        Local -->|Sub Progress| Redis[(Redis)]
        Local -->|Trigger Job| LE_API[LocalExpress API]
    end

    %% Background Worker (LocalExpress)
    subgraph "LocalExpress (Node.js) - Worker"
        LE_API -->|Queue| Worker[Job Worker]
        Worker -->|Update Status| Redis
        Worker -->|Store Results| Postgres
        Worker -->|Vector Search| PGVector[(pgvector)]

        %% Complex Scraping (Puppeteer)
        Worker -->|Puppeteer| IG[Instagram/Complex Sites]
        Worker -->|Upload Media| GCS[Google Cloud Storage]

        %% AI Processing
        Worker -->|Analysis| Gemini[Google Gemini 2.0]

        %% Fast Scraping Delegation
        Worker -->|Batch Scrape| LF_API[LocalFast API]
    end

    %% Fast Scraper (LocalFast)
    subgraph "LocalFast (Python) - Scraper"
        LF_API -->|Crawl4AI| Web[Generic Web Pages]
    end

    %% Inter-Service Communication
    Local -- "HTTP: Job Creation" --> LocalExpress
    LocalExpress -- "HTTP: Batch Scrape" --> LocalFast
    Local -- "Redis: Real-time Updates" --> LocalExpress

```

## 3. Service Details

### 3.1. Local (`/local`)

**Tech Stack**: Next.js 15, React 19, TailwindCSS, Drizzle ORM, Better-Auth.

**Role**:

- **System of Engagement**: Primary user interface for chat, maps, and itinerary planning.
- **Orchestrator**: Manages user sessions and initiates complex backend workflows.
- **Direct Data Access**: Reads directly from PostgreSQL for rendered views (lists, profiles, historical data).
- **Real-time Updates**: Subscribes to Redis channels to show live progress bars for background jobs (e.g., "Scraping menus... 45%").

**Key Directories**:

- `src/app`: App Router pages.
- `src/db`: Shared Drizzle schema (often synchronized with LocalExpress).
- `src/lib/auth`: Authentication configuration.

### 3.2. LocalExpress (`/localexpress`)

**Tech Stack**: Node.js, Express, Puppeteer, Google Gemini SDK.

**Role**:

- **Heavy Lifter**: asynchronous background worker.
- **Search Engine**: Executes the 3-phase location search pipeline (Scrape -> Enhance -> Rank).
- **Rolodex Processor**: Handles "Save to Rolodex" feature, including downloading Instagram Reels, uploading to GCS, and generating multimodal AI embeddings.

**Key Components**:

- **Job Pipeline**:
  1.  **Scraping Phase**: Checks cache -> Calls `LocalFast` for generic sites -> Uses `Puppeteer` for difficult sites (SPA/Instagram).
  2.  **Enhancement Phase**: Feeds raw content to Gemini 2.0 Flash to extract structured data (Vibe, Dietary restrictions, Hours).
  3.  **Ranking Phase**: Scores locations based on user intent.
- **Rolodex Service**:
  - Downloads IG Reels via Puppeteer network interception.
  - Generates embeddings (768d or 1536d) for semantic search.

### 3.3. LocalFast (`/localfast`)

**Tech Stack**: Python 3.12, FastAPI, Crawl4AI.

**Role**:

- **Speed**: Specialized purely for high-speed, low-overhead fetching of static or simple dynamic content.
- **Normalization**: Converts raw HTML into clean Markdown for LLM consumption.

**API**:

- `POST /api/scrape`: Single URL scrape.
- `POST /api/scrape/batch`: Server-Sent Events (SSE) stream for concurrent bulk scraping.

## 4. Key Workflows

### 4.1. The "Search" Workflow

1.  **User** enters a prompt ("Patio bars in Williamsburg") in **Local**.
2.  **Local** creates a job record in Postgres (`status: pending`) and calls `LocalExpress` (`POST /process-job`).
3.  **LocalExpress** starts the job asynchronously and returns `202 Accepted`.
4.  **Local** UI polls Redis or subscribes to updates.
5.  **LocalExpress**:
    - Identifies candidate URLs (Google Maps API / Serper).
    - Sends batch of URLs to **LocalFast** (`POST /api/scrape/batch`).
    - **LocalFast** streams back Markdown content.
    - **LocalExpress** sends Markdown to **Gemini** for "Enhancement" (Extraction & Scoring).
    - Updates Postgres with final sorted results.
    - Sets Redis key `job:{id}:status` to `completed`.
6.  **Local** displays the results card list.

### 4.2. The "Rolodex" Workflow (Instagram Reel)

1.  **User** pastes an Instagram URL into **Local**.
2.  **Local** calls `LocalExpress` (`POST /rolodex`).
3.  **LocalExpress**:
    - Launches **Puppeteer**.
    - Intercepts network traffic to find the `.mp4` stream.
    - Streams video to **Google Cloud Storage (GCS)**.
    - Generates a signed URL.
    - Sends Video + Metadata to **Gemini 2.0** for analysis.
    - Generates vector embedding.
    - Saves to `rolodex_items` table in Postgres (including `vector` column).
4.  **User** can now "Chat" with their Rolodex (Semantic search via `pgvector`).

## 5. Infrastructure & Data

### Databases

- **PostgreSQL**: Primary source of truth.
  - Shared Schema: Drizzle is used in both `local` and `localexpress`. Care must be taken to keep `schema.ts` in sync or move to a shared package.
  - Extensions: `pgvector` for semantic search.
- **Redis**: Ephemeral state.
  - Job progress percentages.
  - Real-time status flags.

### External Services

- **Google Gemini**: Intelligence layer (Text & Multimodal).
- **Google Cloud Storage**: Object storage for user-uploaded or scraped media (Rolodex videos).
- **Better-Auth**: Auth provider integration.

# Local Platform - Technical Overview

> **Last Updated:** January 2026

## Executive Summary

**Local** is an AI-native personal concierge platform for discovering and planning social outings. It transforms the fragmented process of finding "hidden gem" restaurants and bars into an intelligent, unified experience powered by web scraping, multimodal AI, and semantic search.

The platform is composed of **5 microservices** working together:

| Service | Technology | Purpose |
|---------|------------|---------|
| **Local** | Next.js 15 / React 19 | Frontend UI, orchestration, authentication |
| **LocalExpress** | Node.js / Express | Background worker for AI processing & scraping |
| **LocalFast** | Python / FastAPI | High-performance web scraping microservice |
| **LocalInsightEngine** | Python / SQLAlchemy | B2B analytics & PDF report generation |
| **LocalTrendingJob** | Python / yt-dlp | TikTok video ingestion pipeline (cron job) |

---

## System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              USER / BROWSER                                   │
└─────────────────────────────────┬────────────────────────────────────────────┘
                                  │ HTTPS
                                  ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                        LOCAL (Next.js Orchestrator)                           │
│  ┌────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐    │
│  │  Better-Auth   │  │  Drizzle ORM    │  │   Redis Subscriptions       │    │
│  │  (OAuth/SSO)   │  │  (PostgreSQL)   │  │   (Real-time updates)       │    │
│  └────────────────┘  └─────────────────┘  └─────────────────────────────┘    │
│                                                                               │
│  Routes: /chat, /trending, /rolodex, /api/*                                  │
└──────────────────────────────────┬───────────────────────────────────────────┘
                                   │ HTTP
       ┌───────────────────────────┼───────────────────────────┐
       ▼                           ▼                           ▼
┌────────────────┐        ┌────────────────┐         ┌──────────────────┐
│ LocalExpress   │        │ LocalFast      │         │ LocalTrendingJob │
│ (Node.js)      │◄──────▶│ (Python)       │         │ (Python/Cron)    │
│                │        │                │         │                  │
│ • AI Analysis  │        │ • Crawl4AI     │         │ • yt-dlp         │
│ • Puppeteer    │        │ • Markdown     │         │ • Gemini AI      │
│ • Embeddings   │        │   Conversion   │         │ • GCS Upload     │
└───────┬────────┘        └────────────────┘         └────────┬─────────┘
        │                                                      │
        └──────────────────────┬───────────────────────────────┘
                               ▼
              ┌─────────────────────────────────────┐
              │           SHARED DATA LAYER          │
              │  ┌──────────────┐ ┌──────────────┐  │
              │  │  PostgreSQL  │ │    Redis     │  │
              │  │  + pgvector  │ │  (Ephemeral) │  │
              │  └──────────────┘ └──────────────┘  │
              │                                      │
              │  ┌──────────────────────────────┐   │
              │  │  Google Cloud Storage (GCS)  │   │
              │  │  (Videos, Media Assets)      │   │
              │  └──────────────────────────────┘   │
              └─────────────────────────────────────┘
                               ▲
                               │
              ┌────────────────┴──────────────────┐
              │         LocalInsightEngine        │
              │         (Python / Offline)        │
              │                                   │
              │  • ETL Pipeline                   │
              │  • Google Trends Integration      │
              │  • PDF Report Generation          │
              └───────────────────────────────────┘
```

---

## 1. Local (Frontend & Orchestrator)

### Technology Stack

- **Framework:** Next.js 15 with App Router
- **UI:** React 19, TailwindCSS 4, Framer Motion
- **Database:** Drizzle ORM with PostgreSQL
- **Auth:** Better-Auth (OAuth/SSO support)
- **State:** SWR for data fetching
- **Maps:** Mapbox GL
- **Analytics:** PostHog
- **Monitoring:** Sentry

### Directory Structure

```
Local/src/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/               # Better-Auth handlers
│   │   ├── newsletter/         # Email collection
│   │   ├── places/             # Google Places proxy
│   │   ├── rolodex/            # Personal content management
│   │   ├── search/             # Job submission & polling
│   │   └── video/              # Trending video endpoints
│   ├── chat/                   # Main search interface
│   │   ├── components/         # Map, results, search context
│   │   ├── hooks/              # Job polling, location
│   │   └── context/            # Search state management
│   ├── rolodex/                # Personal "saves" feature
│   ├── trending/               # Viral video discovery feed
│   └── components/             # Shared UI components
├── lib/
│   ├── auth/                   # Auth configuration
│   ├── database/               # Postgres & Redis clients
│   ├── places/                 # Places API utilities
│   ├── video/                  # Video embeddings & queries
│   └── security/               # Rate limiting, identity
└── db/
    ├── schema.ts               # Drizzle schema (shared with LocalExpress)
    └── relations.ts            # Table relationships
```

### Core Database Tables

| Table | Purpose |
|-------|---------|
| `user`, `session`, `account` | Better-Auth user management |
| `location` | Cached Google Places data |
| `restaurant_profile` | AI-enhanced venue profiles with vector embeddings |
| `search_jobs` | Async search job state & results |
| `location_cache` | Scraped markdown cache (7-day TTL) |
| `trending_videos` | TikTok videos with AI summaries |
| `rolodex_items` | User-saved content with embeddings |
| `rolodex_categories` | User-defined content folders |

### Key Features

1. **Chat-based Search Interface**
   - Natural language queries ("Patio bars in Williamsburg")
   - Real-time job progress via Redis subscriptions
   - Map visualization with Mapbox

2. **Trending Feed**
   - TikTok-style video discovery for restaurants/bars
   - Personalized via location radius
   - Engagement tracking (watch time, impressions)

3. **Rolodex**
   - Save Instagram Reels, articles, any URL
   - AI-powered categorization and tagging
   - Semantic search via pgvector

---

## 2. LocalExpress (Background Worker)

### Technology Stack

- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Scraping:** Puppeteer (for Instagram/SPAs)
- **AI:** Google Gemini 2.0 (Flash & Embedding models)
- **Storage:** Google Cloud Storage
- **Database:** Drizzle ORM (PostgreSQL)
- **Monitoring:** Sentry

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/process-job` | Trigger async search job processing |
| `POST` | `/rolodex/process` | Process & analyze a saved URL |
| `POST` | `/rolodex/chat` | Semantic search across saved items |
| `GET` | `/rolodex/items` | Retrieve user's Rolodex items |
| `POST` | `/rolodex/sms` | Twilio webhook for SMS saves |

### Search Pipeline (3-Phase)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       PHASE 1: SCRAPING                                  │
│                                                                          │
│  1. Receive job from Local (POST /process-job)                          │
│  2. Check location_cache for recent scrapes (< 7 days)                  │
│  3. Batch scrape uncached URLs via LocalFast SSE stream                 │
│  4. Update Redis with real-time progress                                │
│  5. Store scraped markdown in location_cache                            │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       PHASE 2: AI ENHANCEMENT                            │
│                                                                          │
│  1. Send scraped markdown to Gemini 2.0 Flash                           │
│  2. Extract structured data:                                            │
│     - Vibe & atmosphere                                                 │
│     - Dietary restrictions (vegan, halal, kosher)                       │
│     - Noise level, dress code, seating type                             │
│     - Operating hours                                                   │
│  3. Compute relevance score (0-10) against user query                   │
│  4. Validate responses with Zod schemas                                 │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       PHASE 3: RANKING & FILTERING                       │
│                                                                          │
│  1. Filter out irrelevant locations (shouldInclude: false)              │
│  2. Rank by AI confidence score + query match                           │
│  3. Store final_results in search_jobs table                            │
│  4. Set Redis status to 'completed'                                     │
└─────────────────────────────────────────────────────────────────────────┘
```

### Rolodex Pipeline

```
User pastes URL → LocalExpress:
  1. Detect type (Instagram Reel, article, other)
  2. If Instagram:
     - Launch Puppeteer
     - Intercept network traffic for .mp4 stream
     - Download video → Upload to GCS
  3. If article:
     - Call LocalFast for markdown extraction
  4. Send content to Gemini 2.0 (multimodal for videos)
  5. Extract: title, summary, keywords, tags
  6. Generate 1536-dimensional embedding
  7. Store in rolodex_items with HNSW vector index
```

### Key Services

| Service | File | Purpose |
|---------|------|---------|
| `scrapingService` | `src/services/scrapingService.ts` | Orchestrates batch scraping with caching |
| `aiEnhancementService` | `src/services/aiEnhancementService.ts` | Gemini API integration for analysis |
| `rankingService` | `src/services/rankingService.ts` | Scoring and filtering logic |
| `rolodexScraper` | `src/services/rolodexScraper.ts` | Puppeteer-based media extraction |
| `rolodexAI` | `src/services/rolodexAI.ts` | Video analysis & embeddings |

---

## 3. LocalFast (Scraping Microservice)

### Technology Stack

- **Framework:** FastAPI (Python 3.12)
- **Scraper:** Crawl4AI (async browser automation)
- **Monitoring:** Sentry

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/scrape` | Scrape single URL → markdown |
| `POST` | `/api/scrape/batch` | SSE stream for concurrent bulk scraping |
| `GET` | `/api/health` | Health check |

### Architecture

```
app/
├── main.py              # FastAPI app with lifespan management
├── api/
│   ├── health.py        # Health check endpoint
│   └── scraper.py       # Scrape endpoints
├── core/
│   ├── config.py        # Settings from environment
│   ├── logging.py       # Structured logging
│   └── scraper.py       # CrawlerManager singleton
└── types/
    └── scrape.py        # Pydantic request/response models
```

### Scraping Flow

```python
# Single URL scrape
async def scrape_website(url: str, timeout: int) -> str:
    crawler = await CrawlerManager.get_crawler()
    result = await crawler.arun(
        url=url,
        timeout=timeout,
        word_count_threshold=10,
        excluded_tags=["nav", "footer", "aside"],
        remove_overlay_elements=True,
    )
    return result.markdown

# Batch scrape with SSE
async def scrape_batch(urls: list[str], timeout: int, concurrency: int):
    semaphore = asyncio.Semaphore(concurrency)
    for url in urls:
        result = await scrape_url_with_result(url, timeout, semaphore)
        yield result  # SSE stream to client
```

---

## 4. LocalInsightEngine (B2B Analytics)

### Technology Stack

- **Framework:** Python with SQLAlchemy
- **PDF Generation:** ReportLab
- **External APIs:** Google Trends, Yelp, Google Generative AI
- **Database:** PostgreSQL via Alembic migrations

### Purpose

Generates professional PDF insight reports for restaurants/bars, transforming consumer discovery data into actionable business intelligence.

### ETL Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           EXTRACT                                        │
│                                                                          │
│  VenueDataExtractor      → Venue profiles from restaurant_profile table │
│  SocialContentExtractor  → Trending videos, popular tags                │
│  GoogleTrendsExtractor   → Search trend data (external API)             │
│  YelpExtractor           → Review sentiment, ratings (external API)     │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          TRANSFORM                                       │
│                                                                          │
│  TrendComputer           → Calculate velocity (MoM growth %)            │
│  RelevanceScorer         → Score trend relevance to venue (0-100)       │
│  RecommendationGenerator → Generate actionable business suggestions     │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            LOAD                                          │
│                                                                          │
│  VenueInsightData        → Complete data model for reports              │
│  VenueInsightReportGen   → PDF generation via ReportLab                 │
└─────────────────────────────────────────────────────────────────────────┘
```

### Data Models

```python
@dataclass
class VenueInsightData:
    # Identity
    venue_name: str
    venue_address: str
    venue_neighborhood: str
    cuisine_type: str
    price_level: str
    
    # Analytics
    executive_summary: str
    top_demand_trends: list[TrendMetric]      # Top 5 relevant trends
    competitor_context: list[CompetitorMention]
    actionable_recommendations: list[ActionableRecommendation]
    predictive_outlook: PredictiveOutlook
    
    # Metadata
    report_generated_at: datetime
    data_sources: list[str]
    confidence_level: str
```

### Report Sections

1. **Executive Summary** - One-paragraph headline insight
2. **Top Demand Trends** - Velocity %, volume, relevance score
3. **Competitive Context** - Co-mentioned venues, positioning
4. **Actionable Recommendations** - Menu, marketing, operations, experience
5. **Predictive Outlook** - 30-60 day forecast, seasonal insights

---

## 5. LocalTrendingJob (Video Pipeline)

### Technology Stack

- **Video Download:** yt-dlp
- **AI Analysis:** Google Gemini (multimodal)
- **Storage:** Google Cloud Storage
- **Database:** PostgreSQL (direct psycopg2)
- **Orchestration:** Railway cron (Sundays @ 12:00 AM UTC)

### Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│  1. DOWNLOAD                                                             │
│     - Get today's creator subset (1/7th of 60+ NYC food influencers)   │
│     - Download videos from past 7 days via yt-dlp                       │
│     - Extract metadata (views, likes, comments, reposts)                │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  2. ANALYZE                                                              │
│     - Upload video to Gemini Files API                                  │
│     - Process with gemini-2.0-flash-exp (multimodal)                    │
│     - Extract: summary, when_to_go_here, tags, location_name           │
│     - Generate 1536-dimensional embedding for semantic search           │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  3. UPLOAD                                                               │
│     - Upload video to GCS bucket                                        │
│     - Insert into trending_videos table                                 │
│     - Store embedding in summary_vector column (HNSW indexed)           │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  4. CLEANUP                                                              │
│     - Remove local downloads directory                                  │
│     - Log completion                                                    │
└─────────────────────────────────────────────────────────────────────────┘
```

### Creator Coverage

- 60+ NYC food influencers tracked
- Distributed across 7 days for load balancing
- Examples: @jeffreyinnyc, @karissaeats, @chewyorkcity, @devourpower

---

## Shared Database Schema

### Vector Search (pgvector)

All vector columns use 1536-dimensional embeddings with HNSW indexes:

```sql
-- Restaurant profiles (4 semantic vectors)
description_general_overview_vector VECTOR(1536)
description_vibe_and_crowd_vector VECTOR(1536)
description_food_and_diet_vector VECTOR(1536)
description_occasion_and_unique_vector VECTOR(1536)

-- Trending videos
summary_vector VECTOR(1536)

-- Rolodex items
embedding VECTOR(1536)
```

### Core Enums

```typescript
// Venue characteristics
dress_code_enum: ['CASUAL', 'SMART_CASUAL', 'FORMAL', 'UNKNOWN']
noise_level_enum: ['QUIET', 'MODERATE', 'LOUD', 'UNKNOWN']
price_level_enum: ['CHEAP', 'MODERATE', 'EXPENSIVE', 'LUXURY', 'UNKNOWN']
seating_type_enum: ['SOFT', 'HARD', 'MIXED', 'INCONCLUSIVE', 'UNKNOWN']

// Boolean with uncertainty
tri_state_enum: ['YES', 'NO', 'PARTIAL', 'UNKNOWN']

// Processing states
processing_status_enum: ['pending', 'processing', 'completed', 'failed']
item_type_enum: ['article', 'video', 'social', 'other']
```

---

## Infrastructure

### External Services

| Service | Purpose | Used By |
|---------|---------|---------|
| **PostgreSQL** | Primary data store | All services |
| **Redis** | Job progress, real-time state | Local, LocalExpress |
| **Google Gemini 2.0** | AI analysis (Flash), embeddings | LocalExpress, LocalTrendingJob |
| **Google Cloud Storage** | Video/media storage | LocalExpress, LocalTrendingJob |
| **Google Maps/Places API** | Location data | Local |
| **Google Trends API** | Search trend data | LocalInsightEngine |
| **Yelp API** | Review data | LocalInsightEngine |
| **Twilio** | SMS integration | LocalExpress |
| **PostHog** | Analytics | Local |
| **Sentry** | Error monitoring | All services |

### Deployment

| Service | Platform | Notes |
|---------|----------|-------|
| Local | Vercel | Next.js optimized hosting |
| LocalExpress | Railway | Background worker |
| LocalFast | Railway | Stateless scraper |
| LocalTrendingJob | Railway | Cron job (weekly) |
| PostgreSQL | Supabase/Neon | Managed Postgres with pgvector |
| Redis | Upstash | Serverless Redis |

---

## Development Setup

### Prerequisites

- Node.js 20+
- Python 3.12+
- Docker (optional)
- PostgreSQL with pgvector extension

### Environment Variables

```bash
# Shared
POSTGRES_URL=postgresql://...
REDIS_URL=redis://...
GOOGLE_GEMINI_API_KEY=...

# Local
GOOGLE_AI_API_KEY=...
BETTER_AUTH_SECRET=...

# LocalExpress
GOOGLE_CLOUD_BUCKET=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...

# LocalFast
SENTRY_DSN=...

# LocalTrendingJob
GOOGLE_APPLICATION_CREDENTIALS=...
```

### Running Services

```bash
# Local (Next.js)
cd Local && npm run dev

# LocalExpress (Worker)
cd LocalExpress && npm run dev

# LocalFast (Scraper)
cd LocalFast && uvicorn app.main:app --port 8001

# LocalInsightEngine (Reports)
cd LocalInsightEngine && python src/main.py

# LocalTrendingJob (Manual run)
cd LocalTrendingJob && python -m src.tiktok.main
```

---

## Key Workflows

### 1. User Search Flow

```
User: "Romantic Italian restaurants with a patio in Brooklyn"
  ↓
Local: Create search_job, call LocalExpress POST /process-job
  ↓
LocalExpress: Phase 1 - Scrape ~20 candidate URLs via LocalFast
  ↓ (SSE stream, ~30s)
LocalExpress: Phase 2 - Analyze with Gemini, extract vibe/dietary/hours
  ↓
LocalExpress: Phase 3 - Rank by relevance, filter irrelevant
  ↓
Local: Poll Redis for progress, display results on map
```

### 2. Rolodex Save Flow

```
User: Pastes Instagram Reel URL
  ↓
Local: POST /rolodex/process
  ↓
LocalExpress:
  - Puppeteer → intercept .mp4 stream
  - Upload video → GCS
  - Gemini multimodal → title, summary, tags
  - Generate embedding (1536d)
  - Store in rolodex_items
  ↓
User: Can semantic search "that rooftop bar video"
```

### 3. Trending Feed Flow

```
Weekly: LocalTrendingJob cron
  - Download 60+ influencer videos
  - Gemini analysis per video
  - Upload to GCS + PostgreSQL
  ↓
User: Opens /trending
  - Fetch videos by location radius
  - Track engagement (watch time)
  - Videos ranked by engagement_score
```

---

## Performance Considerations

1. **Scraping Concurrency:** LocalFast uses semaphore-controlled concurrency (default: 10)
2. **Caching:** 7-day TTL on location_cache reduces redundant scrapes
3. **Vector Indexes:** HNSW indexes on all vector columns for sub-100ms similarity search
4. **SSE Streaming:** Batch scrape results stream to client in real-time
5. **Batch Processing:** TrendingJob processes 1/7th of creators daily

---

## Security

- **Authentication:** Better-Auth with OAuth support
- **API Security:** JWT validation on protected endpoints
- **Rate Limiting:** Redis-based rate limiting on public APIs
- **Input Validation:** Zod schemas on all API inputs

---

## Monitoring

- **Sentry:** Error tracking across all services
- **PostHog:** User analytics (Local frontend)
- **Redis:** Job status monitoring
- **Health Checks:** `/health` endpoints on all services

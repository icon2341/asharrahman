# Local — AI Capabilities Business Review

> **Date:** February 2026  
> **Status:** Live Product | Pre-Seed Stage

---

## Executive Summary

**Local** is an AI-native personal concierge platform that transforms fragmented social planning into automated, intelligent workflows. Unlike traditional discovery apps that provide static data, Local deploys **autonomous AI agents** to execute the "last mile" of real-world planning—from discovery through booking.

**Core Value Proposition:** Replace the 5-app planning nightmare with a single AI agent that actually *does the work*.

---

## Market Position & Traction

| Metric | Value |
|--------|-------|
| **Weekly Active Users** | 100+ |
| **Total Website Traffic** | 10,000+ visits |
| **Proprietary Dataset** | 30,000 NYC venues |
| **Revenue** | Pre-revenue (growth focus) |
| **Incorporation** | Delaware C Corp |
| **Fundraising Status** | Active (Angels + Tier 2 VCs interested) |

### Growth Trajectory
- **122 peak WAUs** achieved
- **73%** of users report frustration with current solutions
- **100% organic** acquisition (no paid ads)

---

## AI Technology Stack

### Models & Providers

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Primary LLM** | GPT-5.2 | Complex reasoning, concierge conversations |
| **Secondary LLM** | Gemini 2.0 Flash/Pro | Multimodal analysis, video understanding |
| **Embeddings** | Gemini Embedding (1536d) | Semantic search across all entities |
| **Vector DB** | PostgreSQL + pgvector | HNSW-indexed similarity search |
| **Voice AI** | Pipecat + Twilio + ElevenLabs | Outbound call orchestration (STT/TTS) |

### Development Velocity
- **90%** of unreleased iOS app built via autonomous coding agents
- Using Claude Code + Linear MCP for AI-native development workflow

---

## AI-Powered Product Capabilities

### 1. Intelligent Search Engine

**What it does:** Users enter natural language queries like *"Romantic Italian restaurants with a patio in Brooklyn"* and receive AI-ranked, real-time verified results.

**Technical Implementation:**

```
┌─────────────────────────────────────────────────────────────┐
│                  3-PHASE AI PIPELINE                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PHASE 1: DATA AGGREGATION                                   │
│  ├─ Proprietary 30k venue database (bypasses Google Places) │
│  ├─ Real-time web scraping via Crawl4AI                     │
│  └─ 7-day intelligent caching layer                         │
│                                                              │
│  PHASE 2: AI ENHANCEMENT (Gemini 2.0)                        │
│  ├─ Extract vibe & atmosphere descriptors                   │
│  ├─ Identify dietary restrictions (halal, vegan, kosher)    │
│  ├─ Classify noise level, dress code, seating type          │
│  ├─ Parse operating hours                                   │
│  └─ Compute relevance score (0-10) per user query           │
│                                                              │
│  PHASE 3: INTELLIGENT RANKING                                │
│  ├─ Filter irrelevant results via AI confidence             │
│  └─ Rank by semantic match + freshness + verified data      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Unique Differentiator:** While Google returns *"halal carts"* for *"halal burgers"*, Local's semantic understanding distinguishes between cuisine types and dietary restrictions.

---

### 2. AI Voice Agents (Outbound Calls)

**What it does:** Automated phone calls to venues to verify real-time data that APIs cannot capture—wait times, patio status, walk-in availability.

**The "Last Mile" Problem Solved:**
- APIs provide *static* data (often outdated)
- User manually calls venue to verify → **friction**
- Local's agent makes the call on user's behalf → **automation**

**Technical Stack:**
- **Pipecat:** Call orchestration framework
- **Twilio:** Telephony infrastructure
- **ElevenLabs:** Natural speech synthesis (TTS)
- **Deepgram/Whisper:** Speech recognition (STT)
- **GPT-5.2:** Conversational agent with tool calling

**Call Script Generation:**
```typescript
// AI generates dynamic call scripts based on user intent
interface CallScript {
  objective: string;           // "Verify patio availability for 8 people"
  questions: string[];         // Dynamic based on venue type
  fallbackResponses: Map<string, string>;
  terminationCondition: string; // When to end call
}
```

**Why This Matters:**
- Piggybacks on genuine user intent → minimizes venue spam
- Captures *perishable data* no API can provide
- Creates proprietary signals for venue intelligence

---

### 3. Concierge Chat Agent

**What it does:** Agentic conversational AI with tool-calling capabilities to orchestrate the full planning workflow.

**Agent Architecture:**
```
User Query → Concierge Agent
                │
                ├──▶ search_restaurants_rag (proprietary DB)
                ├──▶ search_restaurants_places (Google fallback)
                ├──▶ get_venue_details (real-time scraping)
                ├──▶ initiate_phone_call (voice agent)
                └──▶ create_itinerary (multi-venue planning)
```

**SSE Streaming:** Real-time tool execution visibility for transparent UX.

---

### 4. Multimodal Video Intelligence

**What it does:** Ingests TikTok/Instagram content from 60+ NYC food influencers, analyzes videos with vision AI, and surfaces trending spots.

**Pipeline (LocalTrendingJob):**

1. **Download:** yt-dlp fetches videos from creator network
2. **Analyze:** Gemini 2.0 multimodal extracts:
   - Venue name & location
   - Summary & "vibe"
   - Optimal visit times
   - Cuisine tags
3. **Embed:** 1536d vector for semantic search
4. **Store:** GCS for video, PostgreSQL for metadata

**Weekly Processing:**
- 60+ influencers tracked
- Distributed 1/7th per day for load balancing
- Engagement scoring (watch time, impressions)

---

### 5. Rolodex (AI-Powered Personal Saves)

**What it does:** Users save any URL (Instagram Reels, articles, TikToks) and Local's AI extracts, categorizes, and makes content searchable.

**Technical Flow:**
```
User → Pastes Instagram Reel URL
         │
         ▼
    LocalExpress
         │
         ├───▶ Puppeteer intercepts .mp4 stream
         ├───▶ Upload video → Google Cloud Storage
         ├───▶ Gemini Multimodal → title, summary, tags
         ├───▶ Generate 1536d embedding
         └───▶ Store in rolodex_items (pgvector indexed)
         
User → "that rooftop bar video" → Semantic search → Instant retrieval
```

**SMS Integration:** Save via text message (Twilio webhook).

---

### 6. Proprietary Data Moat

**The Google Places Bypass:**

| Metric | Google Places API | Local Proprietary |
|--------|-------------------|-------------------|
| Coverage | ~70% of venues | 30,000 NYC venues (100%) |
| Data freshness | Static snapshots | AI-enriched continuously |
| "Essence" data | ❌ | ✅ Vibe, crowd, noise, dress code |
| Cost | $17 per 1,000 requests | $0 (owned data) |

**How We Built It:**
- AI agent "food bloggers" scrape and synthesize venue data
- Custom data techniques combining public/private sources
- Continuous enrichment via user queries and voice calls

---

### 7. B2B Analytics Engine (LocalInsightEngine)

**What it does:** Transforms consumer discovery data into actionable intelligence for restaurant owners.

**ETL Pipeline:**
```
EXTRACT
├─ Venue profiles (30k database)
├─ Trending videos & social signals
├─ Google Trends API
└─ Yelp review sentiment

TRANSFORM
├─ Calculate trend velocity (MoM %)
├─ Score relevance to venue (0-100)
└─ Generate AI recommendations

LOAD
└─ PDF reports via ReportLab
```

**Report Sections:**
1. Executive Summary (AI-written)
2. Top Demand Trends (velocity, volume)
3. Competitive Context (co-mentions)
4. Actionable Recommendations (menu, marketing, ops)
5. Predictive Outlook (30-60 day forecast)

**Market Opportunity:** $3.2B global restaurant analytics market → $12B by 2033

---

## Technical Moats & Defensibility

### 1. **Proprietary Dataset**
- 30,000 venue "essence" profiles
- Impossible to replicate without AI agents + time
- Continuous enrichment flywheel

### 2. **Voice Agent Infrastructure**
- Captures data no API provides
- Builds unique signal database
- High barrier to replicate (telephony + AI + venue relationships)

### 3. **Vertical Integration**
- Discovery → Verification → Booking in one agent
- Competitors solve only one slice

### 4. **Autonomous Development Velocity**
- 90% of iOS app built via AI agents
- 2-person team shipping faster than funded competitors

---

## Competitive Landscape

| Segment | Competitors | Their Gap | Our Solution |
|---------|-------------|-----------|--------------|
| **Discovery** | Beli, Corner | Cold start problem, manual lists | AI + proprietary data |
| **Search** | Google Maps, Perplexity | Static/outdated data | Real-time voice verification |
| **Booking** | Resy, OpenTable | Only 40% of venues | Works everywhere via phone |

**Key Insight:** Planning is a *workflow* problem, not a *search* problem. Competitors provide data points; we provide *execution*.

---

## Monetization Strategy

### Phase 1: Consumer Freemium
- Free concierge captures high-signal user behaviors
- **Pro Tier ($12/mo):** Power users, unlimited calls, priority

### Phase 2: SMB Analytics
- Sell verified demand insights to restaurants ($50-$100/mo)
- Lead generation for venues without reservations

### Phase 3: Enterprise
- Corporate services: catering, team events
- API licensing for hospitality platforms

---

## Team

| Name | Role | Background |
|------|------|------------|
| **Ashar Rahman** | CEO (50%) | Founding Engineer @ Aviary AI (YC S22) |
| **Liam Stamper** | CTO (50%) | Founding Engineer @ Aviary AI (YC S22), Launch Founder University |

**Relevant Experience:**
- Built scalable RAG systems at YC company to $2.6M ARR
- Deep expertise in multi-agent workflows and phone orchestration
- Shipped production AI across consumer and B2B

---

## Infrastructure Summary

| Service | Technology | Deployment |
|---------|------------|------------|
| **Local** | Next.js 15 / React 19 | Vercel |
| **LocalExpress** | Node.js / Express / Puppeteer | Railway |
| **LocalFast** | Python / FastAPI / Crawl4AI | Railway |
| **LocalTrendingJob** | Python / yt-dlp / Gemini | Railway (cron) |
| **LocalInsightEngine** | Python / SQLAlchemy / ReportLab | Offline |
| **Database** | PostgreSQL + pgvector | Supabase/Neon |
| **Cache** | Redis | Upstash |
| **Storage** | Google Cloud Storage | GCS |

---

## What We're Building Next

1. **iOS App Launch:** React Native app (90% complete via AI agents)
2. **Expanded Voice Agents:** Reservation booking, not just verification
3. **Multi-City Expansion:** LA, Miami, SF
4. **B2B Dashboard:** Self-service analytics for venue operators

---

## Summary: Why Local Wins

> **"We don't just search—we execute."**

1. **Proprietary Data:** 30k venues with "essence" data Google doesn't have
2. **Voice Agents:** Verify perishable data in real-time
3. **Full Workflow:** Discovery → Verification → Booking in one agent
4. **AI-Native Velocity:** 2 founders shipping faster than 10-person teams

---

*Document generated for internal review and investor materials.*

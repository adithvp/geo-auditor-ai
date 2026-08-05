# GEO Auditor — Generative Engine Optimization Platform

> **Phaze AI Product Developer Take-Home Task Submission**  
> Role: Product Developer (AI Products) | Stack: Python FastAPI + Next.js 14 (TypeScript & Tailwind CSS)

---

## 🚀 How to Run the Project

You can get the entire full-stack application running locally in **under 3 minutes**:

### Prerequisites
- **Python 3.10+**
- **Node.js 18+**

### 1. Start Python FastAPI Backend

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# (Optional) Provide your OpenAI API key for live GPT-4o AI evaluations.
# If omitted, the engine automatically uses the built-in GEO rule heuristic engine!
export OPENAI_API_KEY="your-openai-api-key"

# Start FastAPI server on port 8000
uvicorn main:app --reload --port 8000
```
- **Backend API**: `http://localhost:8000`
- **Interactive OpenAPI/Swagger Docs**: `http://localhost:8000/docs`

### 2. Start Next.js Frontend

```bash
cd frontend

# Install Node dependencies
npm install

# Start Next.js dev server on port 3000
npm run dev
```
- **Frontend Dashboard**: Open `http://localhost:3000` in your browser.

---

## 🏗️ Architecture

The project follows a modular full-stack architecture separated into a high-performance Python scraping/scoring API and a modern Next.js client interface.

```plaintext
geo-auditor/
├── backend/
│   ├── main.py              <-- FastAPI entrypoint (Exposes POST /api/analyze & GET /api/health)
│   ├── crawler.py           <-- Module 1 & 2: Asynchronous DOM fetcher & JSON-LD parser
│   ├── geo_engine.py        <-- Module 3, 4, 5: OpenAI GPT-4o & Rule-based fallback engine
│   ├── scoring.py           <-- Module 6: Transparent Score & Matrix Calculation
│   ├── test_backend.py      <-- Automated verification suite for backend pipeline
│   ├── requirements.txt     <-- Python dependencies (FastAPI, httpx, BeautifulSoup4, OpenAI)
│   └── .env.example         <-- Environment template
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx     <-- Main Auditor Dashboard Page
│   │   │   ├── layout.tsx   <-- Root Layout & Theme Configuration
│   │   │   └── globals.css  <-- Dark Theme & Glassmorphic Utilities
│   │   ├── components/
│   │   │   ├── ScoreCard.tsx     <-- Overall & Breakdown Metric Cards
│   │   │   ├── IssuesTable.tsx   <-- Actionable Issues Matrix (Impact x Effort)
│   │   │   ├── FixSnippet.tsx    <-- Copy-Paste Code Solution Block
│   │   │   ├── PresetSelector.tsx<-- 1-Click Sample Audit Buttons
│   │   │   └── Header.tsx        <-- Navigation & System Status Bar
│   │   └── utils/
│   │       └── reportGenerator.ts <-- Standalone HTML & JSON Professional Report Exporter
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
└── README.md                <-- Project documentation & evaluation defense
```

### Flow of Data:
1. **User Action**: The user enters a website URL (or clicks a 1-click sample business preset like `stripe.com`) on the Next.js frontend.
2. **Scraping & Parsing**: `crawler.py` asynchronously fetches raw HTML via `httpx`, parses structured JSON-LD schemas, question-formatted headings (`H2`/`H3`), tables count, and meta descriptions using `BeautifulSoup4`.
3. **AI & Heuristic Evaluation**: `geo_engine.py` evaluates the scraped DOM data using OpenAI `gpt-4o` (or the rule-based fallback heuristic if no key/billing credits are present).
4. **Transparent Scoring**: `scoring.py` computes an un-cheatable overall score (0–100) based on weighted pillars.
5. **Dashboard & Report Export**: The Next.js dashboard renders interactive gauges, evidence panels, and handed-to-you fixes, allowing 1-click downloads of **Professional Standalone HTML Reports**, **PDFs**, or **JSON**.

---

## 🎯 Why We Chose These GEO Checks

Rather than building 12 shallow tick-box checks (e.g., generic image alt text or SSL certificates), this auditor focuses on the **top 3 deep checks** that actually dictate whether Generative AI Engines (ChatGPT, Perplexity, Claude, Google AI Overviews) index and cite a website:

### Check 1: Machine-Readable Entity & Schema Infrastructure (Weight: 40%)
- **Why it matters**: LLM crawlers (`PerplexityBot`, `GPTBot`, `ClaudeBot`) do not read web pages like human browsers. They look for explicit Knowledge Graph schemas (`FAQPage`, `Organization`, `Product`, `Article`) to extract verified facts without hallucinating.
- **Evidence Gathered**: Scrapes all `<script type="application/ld+json">` blocks, parses entity types, and checks for missing `sameAs` entity authority references.

### Check 2: Direct-Answer Structural Chunking (Weight: 35%)
- **Why it matters**: RAG retrieval algorithms split web pages into semantic text chunks based on heading tags (`H2`/`H3`). If headings are phrased as exact questions and followed immediately by a direct 1-2 sentence answer, passage retrieval rank increases exponentially.
- **Evidence Gathered**: Scrapes heading tags, counts question-formatted headers (`?`, `how`, `what`, `why`), and checks passage readability.

### Check 3: Source Citation & Verifiability Authority (Weight: 25%)
- **Why it matters**: SearchGPT & Perplexity weight source credibility based on verified author credentials, external `sameAs` entity links (LinkedIn/Twitter/Wikidata), and structured data tables.
- **Evidence Gathered**: Inspects `sameAs` arrays, author metadata, and HTML table elements.

---

## ⚖️ Mathematical Scoring Defense

The overall GEO Health Score (0–100) avoids magic numbers and uses a transparent, weighted formula:

$$\text{GEO Score} = 0.40 \times \text{Schema Score} + 0.35 \times \text{Direct Chunking Score} + 0.25 \times \text{Verifiability Score}$$

Every score is mapped to a clear grade:
- **80–100 (Grade A)**: Optimal AI Visibility
- **60–79 (Grade B)**: Moderate AI Indexation
- **40–59 (Grade C)**: Low AI Citation Rank
- **< 40 (Grade D)**: Invisible to AI Search

---

## 🔍 What is Real and What is Mocked

- **100% REAL**:
  - Real-time HTTP web crawler (`httpx` + `BeautifulSoup4`).
  - DOM parsing of headers, meta tags, schema scripts, and table elements.
  - JSON-LD parsing & syntax validation.
  - Dynamic mathematical score calculation engine.
  - Interactive Next.js dashboard UI, filtering matrix, and copy-paste snippet copy tool.
  - Professional HTML & JSON report generator (`reportGenerator.ts`).

- **LIVE AI vs MOCKED FALLBACK**:
  - **Live OpenAI Engine**: When a valid `OPENAI_API_KEY` with active billing credits is present, live `gpt-4o` models evaluate the content and return structured JSON.
  - **Offline Rule-Based Heuristic Engine**: If no API key is provided (or if API credit limits are reached), the backend automatically falls back to deterministic rule-based analysis on the real scraped HTML markup.
  - **Explicit Labeling**: The backend explicitly returns `"is_mocked": true/false`, and the UI displays a clear status badge (**Live AI Evaluation** vs **Offline Heuristic Engine**).

---

## ⚠️ Limitations

1. **Single-Page Audit Scope**: The current crawler audits a single target URL (e.g. homepage or product page). It does not recursively crawl all 10,000 subpages on massive enterprise domains.
2. **Client-Rendered JavaScript (SPAs)**: The crawler uses fast static HTTP requests (`httpx`). For client-side Single Page Applications that rely heavily on JavaScript rendering before HTML is injected, a headless browser (Playwright/Puppeteer) would be required to execute JS.
3. **No Direct Search Engine Scraping**: The tool evaluates content optimization on the target site itself; it does not scrape live Perplexity or ChatGPT search query result pages in real-time to check live ranking position.

---

## 🔮 What We Would Build With One More Week

1. **Live Perplexity & SearchGPT Probe Engine**: Query Perplexity and ChatGPT APIs with synthetic search questions related to the business, automatically detecting if the target URL appears in the live citation footnotes.
2. **Competitor Benchmarking Matrix**: Compare a target website directly against 3 top market competitors on a side-by-side radar chart showing relative Schema, Direct-Answer, and Citation scores.
3. **Automated CMS Webhook Injector (WordPress/Shopify/Webflow)**: A 1-click webhook button that auto-injects generated JSON-LD schema fixes directly into the customer's website `<head>` tag via CMS API integrations.
4. **Historical Audit Trend Tracking**: Store audit runs over time to visualize a business's GEO Health Score improvement trajectory week-over-week.

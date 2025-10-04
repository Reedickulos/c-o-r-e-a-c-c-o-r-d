# CORE ACCORD V4 - Deployment Instructions

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Backend Deployment (Cloudflare Workers)](#backend-deployment-cloudflare-workers)
4. [Frontend Deployment (React UI)](#frontend-deployment-react-ui)
5. [Environment Configuration](#environment-configuration)
6. [Testing & Verification](#testing--verification)
7. [Production Deployment](#production-deployment)
8. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Overview

CORE ACCORD is a multi-agent AI orchestration platform consisting of:
- **Backend**: Cloudflare Workers function that orchestrates 5 diverse AI models via OpenRouter API
- **Frontend**: React-based dashboard for query submission and results visualization
- **Protocol**: Token-efficient consensus mechanism with standardized evaluation metrics

**Architecture Flow**:
```
User Query → React UI → Cloudflare Worker → OpenRouter API → 5 AI Models
                                ↓
                         Results Processing
                                ↓
                    Consensus/Diversity/Complementarity Metrics
                                ↓
                         Dashboard Visualization
```

---

## Prerequisites

### Required Accounts & Tools
- [ ] **Cloudflare Account** (free tier works for testing)
- [ ] **OpenRouter API Key** ([openrouter.ai](https://openrouter.ai))
- [ ] **Node.js** (v16+ recommended)
- [ ] **npm** or **yarn** package manager
- [ ] **Git** (for version control)
- [ ] **Wrangler CLI** (Cloudflare Workers CLI)

### API & Service Requirements
```bash
# Install Wrangler globally
npm install -g wrangler

# Verify installation
wrangler --version
```

---

## Backend Deployment (Cloudflare Workers)

### Step 1: Configure Wrangler

1. **Authenticate with Cloudflare**:
```bash
wrangler login
```

2. **Update `functions/wrangler.jsonc`**:
```jsonc
{
  "name": "core-accord",
  "compatibility_date": "2025-10-01",
  "main": "src/index.js",
  "vars": {
    "OPENROUTER_API_KEY": "your-openrouter-api-key-here"
  }
}
```

### Step 2: Set Environment Variables

**Option A: Via wrangler.jsonc (not recommended for production)**
- Already configured in the file above

**Option B: Via Cloudflare Dashboard (recommended for production)**
```bash
# Set secret via CLI
wrangler secret put OPENROUTER_API_KEY
# Enter your API key when prompted
```

**Option C: Local development with dev.vars.JSON**
```json
{
  "OPENROUTER_API_KEY": "sk-or-v1-your-key-here"
}
```

### Step 3: Deploy to Cloudflare Workers

```bash
# Navigate to functions directory
cd functions

# Deploy to production
wrangler deploy

# Expected output:
# ✨ Compiled Worker successfully
# ✨ Uploaded core-accord (X.XX sec)
# ✨ Published core-accord (X.XX sec)
#    https://core-accord.YOUR-SUBDOMAIN.workers.dev
```

### Step 4: Verify Backend Deployment

```bash
# Test the worker endpoint
curl https://core-accord.YOUR-SUBDOMAIN.workers.dev

# Should return the HTML visualization dashboard
```

**Test API endpoint**:
```bash
curl -X POST https://core-accord.YOUR-SUBDOMAIN.workers.dev/api/collaborate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_OPENROUTER_KEY" \
  -d '{"query": "What are the benefits of AI?"}'
```

---

## Frontend Deployment (React UI)

### Step 1: Install Dependencies

```bash
# Navigate to React app directory
cd core-accord-ui

# Install dependencies
npm install
```

### Step 2: Configure API Endpoint

**Update the API endpoint in the React app** to point to your deployed Cloudflare Worker:

Edit `src/pages/UnifiedApp.tsx` or the relevant component:
```typescript
const API_ENDPOINT = "https://core-accord.YOUR-SUBDOMAIN.workers.dev/api/collaborate";
```

### Step 3: Build for Production

```bash
# Create production build
npm run build

# Output: build/ directory with optimized static files
```

### Step 4: Deploy Frontend

**Option A: Cloudflare Pages (Recommended)**
```bash
# Install Wrangler if not already installed
npm install -g wrangler

# Deploy to Cloudflare Pages
npx wrangler pages deploy build --project-name=core-accord-ui

# Expected output:
# ✨ Success! Deployed to https://core-accord-ui.pages.dev
```

**Option B: Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Option C: Netlify**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=build
```

**Option D: Static Hosting (S3, GitHub Pages, etc.)**
- Upload contents of `build/` directory to your hosting provider
- Ensure proper routing for React Router (index.html fallback)

---

## Environment Configuration

### Backend Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OPENROUTER_API_KEY` | OpenRouter API authentication key | Yes | None |

### Frontend Environment Variables

Create `.env.production` in `core-accord-ui/`:
```env
REACT_APP_API_ENDPOINT=https://core-accord.YOUR-SUBDOMAIN.workers.dev
REACT_APP_VERSION=4.0
```

### Model Configuration

The 5 AI models are hardcoded in `functions/src/index.js`:
```javascript
const MODELS = [
  { id: "deepseek/deepseek-chat", name: "DeepSeek Chat" },
  { id: "mistralai/mistral-small-latest", name: "Mistral Small" },
  { id: "google/gemini-flash-1.5", name: "Gemini 1.5 Flash" },
  { id: "qwen/qwen-2-72b-instruct", name: "Qwen 2 72B" },
  { id: "meta-llama/llama-3-70b-instruct", name: "Llama 3 70B" }
];
```

To modify models, edit this array and redeploy.

---

## Testing & Verification

### 1. Backend Health Check
```bash
# Test CORS and OPTIONS
curl -X OPTIONS https://core-accord.YOUR-SUBDOMAIN.workers.dev/api/collaborate

# Expected: 200 OK with CORS headers
```

### 2. Full Protocol Test
```bash
curl -X POST https://core-accord.YOUR-SUBDOMAIN.workers.dev/api/collaborate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "query": "What are the ethical implications of autonomous AI systems?"
  }' | jq .
```

**Expected Response Structure**:
```json
{
  "query": "...",
  "analyses": [
    {
      "analysis_id": "DeepSeek Chat",
      "content": "...",
      "tokens": 150,
      "response_time_ms": 1200,
      "success": true
    }
    // ... 4 more analyses
  ],
  "evaluation_metrics": {
    "consensus_score": 72,
    "diversity_score": 68,
    "complementarity_score": 85,
    "key_agreements": ["ethics", "safety", "oversight"],
    "key_disagreements": ["autonomous", "regulation"]
  },
  "token_efficiency": {
    "naive_approach_tokens": 9000,
    "core_accord_tokens": 3370,
    "savings_percentage": 62.5,
    "cost_naive": "0.0045",
    "cost_core_accord": "0.0017"
  },
  "metadata": {
    "total_tokens": 750,
    "total_time_ms": 6500,
    "analyses_completed": 5,
    "analyses_failed": 0
  }
}
```

### 3. Frontend Verification
1. Navigate to deployed frontend URL
2. Enter a test query
3. Verify:
   - [ ] API call succeeds
   - [ ] Metrics display correctly
   - [ ] Individual analyses render
   - [ ] Export functions work (JSON, Markdown, CSV)

---

## Production Deployment

### Security Checklist
- [ ] **Remove API keys from code** - Use Cloudflare Secrets
- [ ] **Enable rate limiting** on Cloudflare Workers
- [ ] **Implement authentication** for production users
- [ ] **Set up CORS whitelist** (replace `*` with specific domains)
- [ ] **Enable HTTPS only** (automatic with Cloudflare)
- [ ] **Add request validation** and input sanitization

### Performance Optimization

**Backend (Cloudflare Workers)**:
```javascript
// Add caching for identical queries (optional)
const cache = await caches.default;
const cacheKey = new Request(url, request);
const cachedResponse = await cache.match(cacheKey);
if (cachedResponse) return cachedResponse;
```

**Frontend**:
```bash
# Optimize build size
npm run build -- --production

# Analyze bundle
npm install -g source-map-explorer
source-map-explorer build/static/js/*.js
```

### Custom Domain Setup

**Backend (Cloudflare Workers)**:
1. Go to Cloudflare Dashboard → Workers
2. Click on `core-accord` worker
3. Navigate to "Triggers" tab
4. Add custom route: `api.core-accord.com/*`

**Frontend (Cloudflare Pages)**:
1. Go to Cloudflare Dashboard → Pages
2. Select `core-accord-ui` project
3. Add custom domain: `app.core-accord.com`

---

## Monitoring & Maintenance

### Cloudflare Workers Analytics
- Navigate to Cloudflare Dashboard → Workers → Analytics
- Monitor:
  - Request count
  - Error rate
  - CPU time
  - Invocation time

### Logging
```javascript
// Add to functions/src/index.js for debugging
console.log('Request received:', {
  query: query,
  timestamp: new Date().toISOString(),
  models: MODELS.length
});
```

View logs:
```bash
wrangler tail
```

### Cost Monitoring

**OpenRouter Costs**:
- Monitor at [openrouter.ai/activity](https://openrouter.ai/activity)
- Set spending limits in OpenRouter dashboard

**Cloudflare Costs**:
- Free tier: 100,000 requests/day
- Workers Paid: $5/month for 10M requests
- Pages: Free for unlimited static hosting

### Update Workflow

**Backend Updates**:
```bash
cd functions
# Make changes to src/index.js
wrangler deploy
```

**Frontend Updates**:
```bash
cd core-accord-ui
npm run build
npx wrangler pages deploy build
```

---

## Troubleshooting

### Common Issues

**1. "API key is required" error**
- Ensure `OPENROUTER_API_KEY` is set in Cloudflare Worker secrets
- Check Authorization header format: `Bearer YOUR_KEY`

**2. CORS errors in browser**
- Verify CORS headers in worker response
- Check that API endpoint matches frontend config

**3. Model timeout/failure**
- Check OpenRouter API status
- Review worker logs: `wrangler tail`
- Verify API key has sufficient credits

**4. Frontend 404 errors**
- Ensure React Router fallback is configured
- Check build output includes all routes

---

## Quick Start Commands

```bash
# BACKEND DEPLOYMENT
cd functions
wrangler login
wrangler secret put OPENROUTER_API_KEY
wrangler deploy

# FRONTEND DEPLOYMENT
cd core-accord-ui
npm install
npm run build
npx wrangler pages deploy build

# VERIFY
curl -X POST https://core-accord.YOUR-SUBDOMAIN.workers.dev/api/collaborate \
  -H "Content-Type: application/json" \
  -d '{"query": "test"}'
```

---

## Support & Resources

- **OpenRouter Docs**: [openrouter.ai/docs](https://openrouter.ai/docs)
- **Cloudflare Workers**: [developers.cloudflare.com/workers](https://developers.cloudflare.com/workers)
- **Wrangler CLI**: [developers.cloudflare.com/workers/wrangler](https://developers.cloudflare.com/workers/wrangler)

---

**Deployment Complete** ✅
Your CORE ACCORD V4 platform is now live and operational.

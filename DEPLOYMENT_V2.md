# CORE ACCORD - Deployment Protocol v2.0

This document provides the instructions for deploying and testing the CORE ACCORD application.

---

### 1. Prerequisites

*   Cloudflare Account
*   OpenRouter API Key
*   Node.js and npm
*   Wrangler CLI (`npm install -g wrangler`)

---

### 2. Backend Deployment (Cloudflare Worker)

The backend contains the core multi-round collaboration protocol.

1.  **Navigate to the functions directory:**
    ```bash
    cd functions
    ```
2.  **Configure API Key:** The backend requires the `OPENROUTER_API_KEY` to be set as a secret.
    ```bash
    wrangler secret put OPENROUTER_API_KEY
    ```
    You will be prompted to paste your API key.
3.  **Deploy the Worker:**
    ```bash
    wrangler deploy
    ```
    Upon successful deployment, you will get a URL for your worker (e.g., `https://core-accord.your-subdomain.workers.dev`).

---

### 3. Frontend Deployment (React UI)

The frontend is a React application that will visualize the output from the backend.

1.  **Navigate to the UI directory:**
    ```bash
    cd core-accord-ui
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Build the Application:**
    ```bash
    npm run build
    ```
4.  **Deploy to Cloudflare Pages:**
    ```bash
    npx wrangler pages deploy build --project-name=core-accord-ui
    ```
    This will give you a URL for the frontend application.

---

### 4. Testing the Backend

You can test the new backend directly using a tool like `curl` or Postman.

**Endpoint:** `POST <your-worker-url>/api/collaborate`
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "query": "Your research question here"
}
```

**Example Request:**
```bash
cURL -X POST https://core-accord.core-accord.workers.dev/api/collaborate \
  -H "Content-Type: application/json" \
  -d '{"query": "Should AI systems be allowed to make autonomous decisions in healthcare without human oversight?"}'
```

The response will be a large JSON object containing the full audit trail of the multi-round collaboration.

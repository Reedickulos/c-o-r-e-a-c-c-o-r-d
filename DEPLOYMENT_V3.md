# CORE ACCORD - Deployment Protocol v3.0

This document provides the instructions for deploying and testing the CORE ACCORD application with its new, asynchronous, real-time architecture.

---

### 1. Prerequisites

*   Cloudflare Account & Wrangler CLI
*   OpenRouter API Key
*   Node.js and npm

---

### 2. Backend Deployment (Cloudflare Worker)

The backend is a Cloudflare Worker that orchestrates the multi-round protocol as a background job.

1.  **Navigate to the functions directory:**
    ```bash
    cd functions
    ```
2.  **Configure API Key:** Ensure the `OPENROUTER_API_KEY` is set as a secret.
    ```bash
    wrangler secret put OPENROUTER_API_KEY
    ```
3.  **Deploy the Worker:**
    ```bash
    wrangler deploy
    ```

---

### 3. Frontend Deployment (React UI)

The frontend is a React application that polls the backend for real-time updates.

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

---

### 4. Testing the Real-Time Backend

Testing the new backend is a two-step process.

**Step 1: Start the Collaboration Job**

Send a `POST` request to the `/api/collaborate` endpoint. This will start the job and return a `job_id`.

*   **Endpoint:** `POST <your-worker-url>/api/collaborate`
*   **Body:** `{"query": "Your research question here"}`

**Example Request:**
```bash
curl -X POST https://core-accord.core-accord.workers.dev/api/collaborate \
  -H "Content-Type: application/json" \
  -d '{"query": "Should AI systems be allowed to make autonomous decisions in healthcare without human oversight?"}'
```

**Example Response:**
```json
{
  "job_id": "some-unique-job-id"
}
```

**Step 2: Poll the Status Endpoint**

Use the `job_id` from Step 1 to poll the `/api/status/{job_id}` endpoint. You will need to call this endpoint multiple times to see the progress.

*   **Endpoint:** `GET <your-worker-url>/api/status/{job_id}`

**Example Request:**
```bash
curl https://core-accord.core-accord.workers.dev/api/status/some-unique-job-id
```

**Example Responses:**
*   **After a few seconds:** `{"status": "processing_round_1", "audit_trail": []}`
*   **After Round 1 is complete:** `{"status": "processing_round_2", "audit_trail": [ ... round 1 data ... ]}`
*   **Final Response:** `{"status": "complete", "conclusion": "...", "final_result": { ... }, "audit_trail": [ ... all rounds data ... ]}`

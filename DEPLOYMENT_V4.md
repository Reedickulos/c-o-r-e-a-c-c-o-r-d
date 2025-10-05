# CORE ACCORD - Deployment Protocol v4.0

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

### 4. Performing a Fresh Test

To ensure we are testing the latest version of the application without any interference from browser cache, please follow these steps.

**Step 1: Prepare Your Browser**

1.  **Open a new browser tab.**
2.  **Open the Developer Console:** Press `F12` or `Ctrl+Shift+I` (or `Cmd+Option+I` on Mac) to open the developer tools.
3.  **Go to the "Console" tab:** This is where we will see the debugging output.
4.  **Disable Cache:** In the developer tools, go to the "Network" tab and check the "Disable cache" box. Keep the developer tools open during the test.

**Step 2: Test the Frontend Application**

1.  **Go to the latest deployment URL:**
    `https://7f509532.core-accord-ui.pages.dev`
2.  **Enter a query** into the input field (e.g., "Should AI systems be allowed to make autonomous decisions in healthcare without human oversight?").
3.  **Click the "Analyze →" button.**
4.  **Observe the Console:** The console should show logs starting with "Starting collaboration...".
5.  **Copy the Console Output:** After the process finishes (or fails), please copy the *entire* content of the console and provide it for analysis.

**Step 3: (Optional) Independent Backend Test**

If you wish to test the backend independently, you can use the following `curl` commands in your terminal.

1.  **Start the job:**
    ```bash
    curl -X POST https://core-accord.core-accord.workers.dev/api/collaborate \
      -H "Content-Type: application/json" \
      -d '{"query": "Your test query here"}'
    ```
    This will return a `jobId`.

2.  **Check the status:**
    Replace `{jobId}` with the ID you received from the previous command.
    ```bash
    curl https://core-accord.core-accord.workers.dev/api/status/{jobId}
    ```
    You can run this command multiple times to see the status change.

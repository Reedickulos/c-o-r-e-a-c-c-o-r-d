# CORE ACCORD - Plan of Action

**Date:** 2025-10-05

**Objective:** Overhaul the CORE ACCORD application to fully implement the official protocol and the agreed-upon user interface.

This document outlines the two-phase plan we have agreed upon to align the application with its strategic vision.

---

### Phase 1: Backend Overhaul - Implement the Full Protocol

**Goal:** Upgrade the Cloudflare Worker from a single-round analysis to the full, dynamic, multi-round consensus protocol.

**Key Steps:**

1.  **Modify API Structure:** The `POST /api/collaborate` endpoint will be updated to manage a stateful, multi-round conversation. This will likely involve creating a job ID to track the status of a collaboration.
2.  **Implement Round 1 (Initial Analysis):**
    *   Accept the initial query.
    *   Orchestrate parallel requests to the five core AI models.
    *   Implement robust error handling for individual model failures (retry logic, graceful degradation).
3.  **Implement the Consensus Loop (Rounds 2+):**
    *   **Consensus Calculation:** After each round, calculate the semantic consensus score.
    *   **Contingency Logic:** Implement the automated decision routing based on the score:
        *   **Strong Consensus (>80%):** Terminate the loop.
        *   **Moderate Consensus (50-80%):** Continue to the next round with compressed context.
        *   **Low Consensus (<50%):** Continue, but with a prompt focused on divergence.
        *   **Stalemate (No Consensus after 3 rounds):** Terminate the loop and flag for human review.
    *   **Self-Policing Prompts:** Engineer the prompts for each round to include the "Universal Self-Assessment Footer" to prevent redundancy and infinite loops.
4.  **Update Response Format:** The final API response will be a comprehensive JSON object containing the full audit trail of all rounds, the final recommendation or disagreement summary, and all calculated metrics.

---

### Phase 2: Frontend Overhaul - Build the New User Interface

**Goal:** Replace the current placeholder UI with a new, production-quality frontend that visualizes the entire multi-round protocol.

**Key Steps:**

1.  **Integrate New Design:** The static HTML design provided by the user will be integrated into the main React component (`UnifiedApp.tsx`). The styling and layout will be replicated.
2.  **Remove API Key Input:** The frontend will be modified to **remove** the requirement for the user to enter an API key. The application will rely on the key configured in the backend, as per the intended architecture.
3.  **Build the Visualization Components:**
    *   Create components to visually represent the different rounds of the analysis.
    *   Design a view that shows the compressed context being passed between rounds.
    *   Develop a "decision dashboard" to display the final consensus, diversity, and complementarity scores.
    *   Build an interactive audit trail that allows the user to explore each model's response at each stage of the process.
4.  **Deployment:** The new, overhauled frontend will be deployed to Cloudflare Pages.

---

### Expected Outcome

The result of executing this plan will be a production-ready version of the CORE ACCORD application that:
*   **Functionally** implements the complete, robust, and efficient multi-round consensus protocol.
*   **Visually** presents the analysis in a clear, intuitive, and powerful interface that matches the agreed-upon design.
*   **Architecturally** aligns with the secure, backend-driven API key management strategy.

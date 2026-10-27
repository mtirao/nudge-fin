# NudgeFin 🧠💸 | Project Guidelines & Commands

Welcome to the **NudgeFin** internal contributor guide. This document establishes standard operational guidelines, architecture design references, and code style definitions across our FinTech repository.

---

## 🛠️ Tech Stack & Architecture Overview

The system architecture is structured as a decoupled Monorepo split into two primary operational runtimes:

*   **Frontend Mobile Hub (`/nudgefin-app`):** Driven by React Native (Expo Go workflow) and TypeScript. Handles native hardware OS notification loops.
*   **Backend Analytical API (`/nudgefin-backend`):** Driven by Python and FastAPI using the Service Layer Pattern. Executes asynchronous data aggregation utilizing Pandas.
*   **Persistence Layer:** PostgreSQL managed via Supabase featuring downward time-series index targets (`idx_transactions_user_timestamp`).

---

## 💻 Operational Run Commands

### Backend Operations (`/nudgefin-backend`)
Always activate the virtual environment (`.venv`) or leverage Docker Compose before executing testing frameworks.

*   **Spin Up Dockerized Stack (Preferred):**
    ```bash
    docker-compose up -d
    ```
*   **Recompile Multi-Layer Caches:**
    ```bash
    docker-compose up -d --build
    ```
*   **Stream Live Logs:**
    ```bash
    docker-compose logs -f api
    ```
*   **Seed PostgreSQL Mock Dataset:**
    ```bash
    python seed.py
    ```
*   **Shutdown Infrastructure:**
    ```bash
    docker-compose down
    ```

### Frontend Operations (`/nudgefin-app`)
Ensure your dev machine IP matches the backend service URL target in `api.ts` when running on physical cellular hardware.

*   **Install Node Dependencies:**
    ```bash
    npm install
    ```
*   **Boot Expo Bundler:**
    ```bash
    npx expo start
    ```

---

## 🛡️ Code Style & Project Rules

### 1. Git & Commit Guidelines
We strictly enforce the international **Conventional Commits** standard. Commits must look like professional startup iterations:
*   `feat: <description>` -> Introducing new features or operational endpoints.
*   `fix: <description>` -> Squashing bugs or resolving connection interface breakdowns.
*   `chore: <description>` -> Tooling configurations, dependency updates, or `.gitignore` adjustments.

### 2. Code Consistency Patterns
*   **TypeScript (Frontend):** All network responses, API interfaces, and state properties must possess explicit type boundaries. Avoid `any` patterns entirely.
*   **Python (Backend):** Adhere strictly to PEP 8 standards. Use explicit type hints for input arguments and output response schemas utilizing Pydantic models.
*   **Privacy Directive:** Never hardcode sensitive production strings or tokens. Consume them dynamically from `.env` environment contexts.
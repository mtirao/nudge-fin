# NudgeFin 🧠💸 | Predictive Behavioral FinTech MVP

NudgeFin is a production-ready mobile personal finance ecosystem driven by behavioral economics. Unlike reactive budget trackers that log transactions post-facto, NudgeFin utilizes a predictive data pipeline to isolate temporal high-risk windows when a user is prone to impulsive spending. 

The platform fires a preventive, contextual native hardware "Nudge" (push notification) 30 minutes prior to the vulnerability window, empowering users to break the impulse loop and instantly route that friction-saved capital toward a motivational goal.

---

## 🏗️ Architecture & System Design
The application is built on a highly decoupled, modern stack optimized for horizontal scaling and clear separation of concerns:

*   **Frontend Mobile App (`/nudgefin-app`):** Developed with **React Native (Expo)** and **TypeScript**. Manages native OS permission flows and interacts directly with the iOS/Android hardware notification scheduler for precise time-based delivery.
*   **Backend REST API (`/nudgefin-backend`):** Engine built on **Python** and **FastAPI** utilizing a strict **Service Layer Pattern** for database isolation. Features automated **OpenAPI (Swagger)** documentation.
*   **Data Science Pipeline:** Leverages **Pandas** and **NumPy** to run a customized mathematical scoring algorithm. It weights transaction frequencies (60%) and cash volume (40%) across non-essential categories to discover recurring weekly spending anomalies.
*   **Persistence Layer:** **PostgreSQL** hosted on **Supabase**, secured using production-grade indices, compound keys, and structured triggers to optimize time-series queries.
*   **DevOps & Infrastructure:** Fully containerized via **Docker**, ensuring isolated, repeatable, and environment-agnostic deployment patterns.

---

## 🛠️ Key Technical Highlights Inside This Repo
- **Advanced Time-Series Aggregation:** Feature engineering that transforms raw transaction ISO timestamps into localized analytical categorical arrays (`day_of_week`, `hour`).
- **SQL Optimization:** Compound indexes (`idx_transactions_user_timestamp`) built specifically to avoid heavy sequential table scans during big batch evaluations.
- **Docker Multi-Layer Caching:** Dockerfile structured to separate system updates, Python wheels installation, and source code transfer to maximize building speed.
- **Hardware Native Sync:** Frontend architecture designed to clear duplicate notification queues on the device before setting new weekly recurring parameters.

---

## 🚀 Quickstart & Environment Setup

### Prerequisites
- Node.js (v18+) & Python (3.10+)
- Docker Desktop installed

### 🐳 Running the Containerized Backend
1. Clone the repository and navigate to the backend directory:
   ```bash
   git clone https://github.com
   cd nudgefin/nudgefin-backend
   ```
2. Build the Docker image:
   ```bash
   docker build -t nudgefin-api .
   ```
3. Run the container by injecting your Supabase keys externally:
   ```bash
   docker run -d -p 8000:8000 \
     -e SUPABASE_URL="https://supabase.co" \
     -e SUPABASE_KEY="your-secret-key" \
     --name nudgefin-service nudgefin-api
   ```
4. Access the fully interactive Swagger API logs at `http://localhost:8000/docs`.

### 📱 Launching the Mobile Frontend
1. Open a new terminal window and navigate to the app folder:
   ```bash
   cd ../nudgefin-app
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Expo environment:
   ```bash
   npx expo start
   ```

---

## 📊 Database Blueprint (SQL Schema)
The PostgreSQL transactional ledger utilizes the following relation constraints:
- `users`: Stores encrypted metrics, North Star goal tracking parameters, and core calculations.
- `transactions`: Log layers optimized with downward indexing for continuous pattern-mining retrieval.
- `nudges_log`: Monitors behavioral efficacy values (`was_expense_avoided`) to continuously benchmark model conversion rates.

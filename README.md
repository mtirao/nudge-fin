# NudgeFin 🧠💸

**NudgeFin** is a mobile personal finance application driven by behavioral economics (*FinTech + Behavioral Economics*). Unlike traditional budget trackers that record expenses reactively, NudgeFin utilizes predictive analytics to identify critical time windows when a user is highly prone to impulsive spending. The platform then deploys a "Nudge" (a preventive, contextual push notification) 30 minutes prior to the spending window, helping users curb the impulse and redirect that capital toward an emotionally rewarding savings goal.

---

## 🚀 MVP Features
- **Emotional Impact Dashboard:** Live visualization of savings progress indexed to tangible real-world goals (e.g., "Trip to Japan") alongside our North Star metric: *Rescued Cash*.
- **Predictive Habit Engine:** A lightweight Python algorithm that analyzes financial history logs to isolate recurring temporal patterns of impulsive spending.
- **Contextual Preventive Alerts:** An asynchronous scheduling system that delivers behavioral interventions exactly when the user is most financially vulnerable.

## 🛠️ Tech Stack
- **Frontend:** React Native (Expo), TypeScript, StyleSheet.
- **Backend:** Python, FastAPI, Pandas (Data Science Pipeline).
- **Database:** PostgreSQL (Hosted on Supabase).
- **Infrastructure:** Firebase Cloud Messaging / Expo Notifications.

---

## 📁 Project Structure

```text
nudgefin/
├── nudgefin-app/       # Frontend - Mobile Application (React Native + Expo)
└── nudgefin-backend/   # Backend - API & Data Engine (FastAPI + Python)
```

## 🛠️ Local Setup

### Prerequisites
- Node.js (v18 or higher)
- Python (3.10 or higher)
- Expo Go app installed on your physical mobile device

### Getting Started
1. **Clone the repository:**
   ```bash
   git clone https://github.com
   cd nudgefin
   ```

2. **Backend Configuration:**
   *Installation instructions coming soon under block 1.3.*

3. **Frontend Configuration:**
   *Installation instructions coming soon under block 1.2.*

---

## 🛡️ Privacy & Security (Startup Guidelines)
As a FinTech application, data privacy is our core foundation:
- End-to-end data security in transit and at rest managed via Supabase/PostgreSQL.
- Data minimization architecture: processed transaction history is optimized into temporal matrices without permanently storing sensitive financial logs.

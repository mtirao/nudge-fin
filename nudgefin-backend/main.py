from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from analytics import analyze_spending_patterns  # Import our Pandas engine


app = FastAPI(
    title="NudgeFin API",
    description="Predictive behavioral engine for personal finance scaling.",
    version="1.0.0"
)

# Configure CORS so React Native can communicate safely with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock Data Schema for portafolio verification
class HealthCheck(BaseModel):
    status: str
    timestamp: datetime
    version: str

@app.get("/", tags=["Root"])
def read_root():
    return {
        "message": "Welcome to NudgeFin Core Behavioral API",
        "docs_url": "/docs"
    }

@app.get("/health", response_model=HealthCheck, tags=["System"])
def get_health():
    """
    System Health Check endpoint for monitoring and DevOps deployments.
    """
    return HealthCheck(
        status="healthy",
        timestamp=datetime.utcnow(),
        version="1.0.0"
    )

# Input Data Schemas
class TransactionInput(BaseModel):
    amount: float
    category: str
    transaction_timestamp: str  # ISO string representation

class AnalyticsPayload(BaseModel):
    user_id: str
    transactions: List[TransactionInput]

# Simplified Input Schemas
class SyncTransactionsRequest(BaseModel):
    user_id: str
    amount: float
    category: str
    merchant_name: str
    transaction_timestamp: str

# Schema for User Profile Metrics
class UserProfileMetrics(BaseModel):
    first_name: str
    saving_goal_name: str
    saving_goal_target: float
    saving_goal_current: float
    rescued_cash_total: float

@app.post("/api/v1/transactions", tags=["Financial Ledger"])
def create_transaction(payload: SyncTransactionsRequest):
    """
    Saves an isolated transaction into Supabase PostgreSQL.
    """
    try:
        data = FinancialService.save_user_transaction(
            user_id=payload.user_id,
            amount=payload.amount,
            category=payload.category,
            merchant_name=payload.merchant_name,
            timestamp=payload.transaction_timestamp
        )
        return {"status": "success", "saved_transaction": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@get_analytics = app.get("/api/v1/analytics/predict/{user_id}", tags=["Machine Learning Engine"])
def predict_spending_window(user_id: str):
    """
    Fetches real transactions from Supabase, processes temporal trends with Pandas, 
    logs the resulting trigger metrics, and returns the actionable Nudge.
    """
    # 1. Fetch real records from PostgreSQL
    db_transactions = FinancialService.get_user_transactions(user_id)
    
    if not db_transactions or len(db_transactions) < 5:
        raise HTTPException(
            status_code=422, 
            detail="Insufficient historical records in database to analyze patterns. Please post more transactions."
        )
    
    # 2. Run our Pandas pattern mining engine
    result = analyze_spending_patterns(db_transactions)
    
    if not result:
        raise HTTPException(status_code=422, detail="No high-risk impulsive patterns identified yet.")
        
    # 3. Log the generated nudge as an active intervention tracking entity
    NudgeBehavioralService.log_generated_nudge(
        user_id=user_id,
        message=result["suggested_nudge_message"],
        category=result["critical_category"],
        estimated_savings=25.00  # Default metric baseline to compute financial ROI
    )
        
    return {
        "user_id": user_id,
        "insights_calculated_at": datetime.utcnow(),
        "nudge_profile": result
    }

@app.post("/api/v1/analytics/predict", tags=["Machine Learning Engine"])
def predict_spending_window(payload: AnalyticsPayload):
    """
    Processes transaction batch logs using Pandas time-series analysis 
    to output target nudge scheduling properties.
    """
    # Convert Pydantic objects to native Python dicts for Pandas processing
    serialized_transactions = [t.dict() for t in payload.transactions]
    
    result = analyze_spending_patterns(serialized_transactions)
    
    if not result:
        raise HTTPException(
            status_code=422, 
            detail="Insufficient historical financial data to safely evaluate impulsive patterns."
        )
        
    return {
        "user_id": payload.user_id,
        "insights_calculated_at": datetime.utcnow(),
        "nudge_profile": result
    }

@app.get("/api/v1/users/{user_id}/metrics", response_model=UserProfileMetrics, tags=["User Profiles"])
def get_user_metrics(user_id: str):
    """
    Retrieves real-time profile metrics and current savings progression 
    directly from the PostgreSQL ledger.
    """
    try:
        profile_data = FinancialService.get_user_profile(user_id)
        if not profile_data:
            raise HTTPException(status_code=404, detail="User profile metrics not found.")
        return profile_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
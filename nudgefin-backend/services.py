from database import supabase
from typing import List, Dict, Any

class FinancialService:
    @staticmethod
    def get_user_transactions(user_id: str) -> List[Dict[str, Any]]:
        """
        Fetches the complete historical transaction log for a specific user from Supabase.
        """
        response = supabase.table("transactions") \
            .select("*") \
            .eq("user_id", user_id) \
            .order("transaction_timestamp", desc=True) \
            .execute()
        return response.data

    @staticmethod
    def save_user_transaction(user_id: str, amount: float, category: str, merchant_name: str, timestamp: str) -> Dict[str, Any]:
        """
        Inserts a new raw transaction entry into the PostgreSQL ledger.
        """
        transaction_data = {
            "user_id": user_id,
            "amount": amount,
            "category": category,
            "merchant_name": merchant_name,
            "transaction_timestamp": timestamp
        }
        response = supabase.table("transactions").insert(transaction_data).execute()
        return response.data[0] if response.data else {}

class NudgeBehavioralService:
    @staticmethod
    def log_generated_nudge(user_id: str, message: str, category: str, estimated_savings: float) -> Dict[str, Any]:
        """
        Logs every predictive behavioral nudge generated into the DB for tracking and metrics.
        """
        nudge_data = {
            "user_id": user_id,
            "nudge_message": message,
            "target_category": category,
            "estimated_saved_amount": estimated_savings
        }
        response = supabase.table("nudges_log").insert(nudge_data).execute()
        return response.data[0] if response.data else {}

    @staticmethod
    def get_user_profile(user_id: str) -> Dict[str, Any]:
        """
        Fetches the global profile metrics for a specific user from Supabase.
        """
        response = supabase.table("users") \
            .select("first_name, saving_goal_name, saving_goal_target, saving_goal_current, rescued_cash_total") \
            .eq("id", user_id) \
            .single() \
            .execute()
        return response.data if response.data else {}
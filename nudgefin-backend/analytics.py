import pandas as pd
import numpy as np
from datetime import datetime
from typing import List, Dict, Any, Optional

def analyze_spending_patterns(transactions_data: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """
    Analyzes historical financial records using Pandas to extract the 
    highest risk temporal windows for impulsive spending behavior.
    """
    if not transactions_data or len(transactions_data) < 5:
        return None  # Insufficient data to train or infer safe behavioral patterns

    # 1. Load data into a Pandas DataFrame
    df = pd.DataFrame(transactions_data)
    
    # 2. Parse timestamps and handle time-series formatting
    df['transaction_timestamp'] = pd.to_datetime(df['transaction_timestamp'])
    df['amount'] = df['amount'].astype(float)
    
    # 3. Filter for high-risk, non-essential categories (Impulsive spending triggers)
    # Essential fixed costs like Rent, Insurance, or Utilities are excluded
    impulsive_categories = ['Restaurants', 'Shopping', 'Entertainment', 'Bars', 'Coffee Shops']
    df_filtered = df[df['category'].isin(impulsive_categories)].copy()
    
    if df_filtered.empty:
        return None

    # 4. Feature Engineering: Extract time metrics
    df_filtered['day_of_week'] = df_filtered['transaction_timestamp'].dt.day_name()
    df_filtered['hour'] = df_filtered['transaction_timestamp'].dt.hour

    # 5. Aggregate: Group by Day and Hour to find highest frequency and volume picos
    pattern_group = df_filtered.groupby(['day_of_week', 'category', 'hour']).agg(
        total_spent=('amount', 'sum'),
        transaction_count=('amount', 'count')
    ).reset_index()

    # 6. Mathematical Scoring System: Weighting frequency (60%) and cash volume (40%)
    # This prevents an isolated heavy purchase from skewing a recurring small habit
    max_count = pattern_group['transaction_count'].max() or 1
    max_spent = pattern_group['total_spent'].max() or 1
    
    pattern_group['vulnerability_score'] = (
        (pattern_group['transaction_count'] / max_count) * 0.6 +
        (pattern_group['total_spent'] / max_spent) * 0.4
    )

    # 7. Isolate the highest risk record
    highest_risk_row = pattern_group.sort_values(by='vulnerability_score', ascending=False).iloc[0]

    # 8. Calculate Nudge Parameters (Trigger alert 30 minutes before the modal hour)
    trigger_hour = int(highest_risk_row['hour'])
    trigger_minute = 30
    
    # Adjust hour boundary if needed
    if trigger_hour == 0:
        trigger_hour = 23
    else:
        trigger_hour -= 1

    return {
        "critical_day": str(highest_risk_row['day_of_week']),
        "critical_category": str(highest_risk_row['category']),
        "average_critical_hour": int(highest_risk_row['hour']),
        "vulnerability_score": float(round(highest_risk_row['vulnerability_score'], 2)),
        "nudge_trigger_time": {
            "hour": trigger_hour,
            "minute": trigger_minute
        },
        "suggested_nudge_message": f"Hey! Fridays usually mean {str(highest_risk_row['category']).lower()} runs. Skip it today and secure your progress towards Japan! 🇯🇵"
    }

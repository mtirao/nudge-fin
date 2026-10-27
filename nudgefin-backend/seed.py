import os
import random
from datetime import datetime, timedelta
from database import supabase

def seed_database():
    print("🚀 Starting NudgeFin database seeding process...")

    # 1. Clean existing mock data to prevent duplication conflicts
    print("🧹 Cleaning old mock records from database...")
    try:
        # We delete by filtering matching mock identifiers if they exist
        supabase.table("users").delete().eq("email", "test.user@nudgefin.com").execute()
    except Exception as e:
        print(f"Note during cleanup: {e}")

    # 2. Insert Mock User
    print("👤 Creating target mock user profile...")
    user_payload = {
        "email": "test.user@nudgefin.com",
        "first_name": "Alex",
        "saving_goal_name": "Trip to Japan 🇯🇵",
        "saving_goal_target": 3000.00,
        "saving_goal_current": 450.00,
        "rescued_cash_total": 75.00
    }
    
    user_response = supabase.table("users").insert(user_payload).execute()
    
    if not user_response.data:
        print("❌ Error creating mock user. Seeding aborted.")
        return
        
    user_id = user_response.data[0]["id"]
    print(f"✅ Mock user created successfully with ID: {user_id}")

    # 3. Generate Time-Series Transactions Data
    print("📊 Generating 30 realistic financial transaction logs...")
    transactions_batch = []
    
    # Establish a baseline timeframe: The last 4 weeks leading up to today (October 2026)
    base_date = datetime.now() - timedelta(days=28)
    
    # Categories catalog
    essential_categories = ["Utilities", "Groceries", "Insurance"]
    impulsive_categories = ["Shopping", "Coffee Shops", "Entertainment"]

    for day_offset in range(28):
        current_date = base_date + timedelta(days=day_offset)
        weekday = current_date.weekday() # 0 = Monday, 4 = Friday, etc.

        # Standard daily expenses (Simulated noise)
        if random.random() > 0.4:
            # Randomly pick between an essential or a light impulsive expense
            cat = random.choice(essential_categories if random.random() > 0.5 else impulsive_categories)
            amt = round(random.uniform(5.00, 45.00), 2)
            # Set a random business hour
            timestamp = current_date.replace(hour=random.randint(9, 17), minute=random.randint(0, 59))
            
            transactions_batch.append({
                "user_id": user_id,
                "amount": amt,
                "category": cat,
                "merchant_name": f"Mock Merchant {cat}",
                "transaction_timestamp": timestamp.isoformat()
            })

        # FORCED PATTERN: Every single Friday (weekday == 4), this user goes to a restaurant/bar at night!
        if weekday == 4:
            # Expense 1: Dinner
            dinner_time = current_date.replace(hour=20, minute=random.randint(15, 45))
            transactions_batch.append({
                "user_id": user_id,
                "amount": round(random.uniform(35.00, 65.00), 2),
                "category": "Restaurants",
                "merchant_name": "Gourmet Impulse Bistro",
                "transaction_timestamp": dinner_time.isoformat()
            })
            
            # Expense 2: Late night bar drinks
            bar_time = current_date.replace(hour=22, minute=random.randint(0, 50))
            transactions_batch.append({
                "user_id": user_id,
                "amount": round(random.uniform(20.00, 50.00), 2),
                "category": "Bars",
                "merchant_name": "The Procrastinator Pub",
                "transaction_timestamp": bar_time.isoformat()
            })

    # 4. Insert Batch into Supabase
    print(f"📦 Uploading {len(transactions_batch)} records to PostgreSQL ledger...")
    tx_response = supabase.table("transactions").insert(transactions_batch).execute()
    
    if tx_response.data:
        print("🎉 Database seeding completed successfully!")
        print(f"💡 Copy this User ID to test your endpoints: {user_id}")
    else:
        print("❌ Error uploading transaction batch layers.")

if __name__ == "__main__":
    seed_database()

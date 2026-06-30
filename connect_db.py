import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load variables from your local .env file
load_dotenv()

URL = os.getenv("SUPABASE_URL")
KEY = os.getenv("SUPABASE_ANON_KEY")

# Initialize the client safely
supabase: Client = create_client(URL, KEY)

def check_connection():
    try:
        # A simple, safe read operation that cannot alter data
        response = supabase.table("profiles").select("id").limit(1).execute()
        print("✅ Securely connected to Supabase!")
        return True
    except Exception as e:
        print(f"❌ Connection shielded or failed: {e}")
        return False

if __name__ == "__main__":
    check_connection()




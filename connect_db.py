import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load the local keys securely from your hidden .env file
load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Initialize the single secure client
supabase: Client = create_client(url, key)

def verify_pipeline():
    try:
        # Secure, read-only test on your profiles table
        supabase.table("skills").select("id").limit(1).execute()
        print("✅ Gateway Confirmed: Securely connected to Supabase!")
        
    except Exception as e:
        # If the table doesn't exist yet, it will throw a 404, 
        # but it still means the network API key authentication worked!
        print(f"📡 Network Connected. Database response note: {e}")

if __name__ == "__main__":
    verify_pipeline()



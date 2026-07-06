import os
import shutil
import json
import pypdf
import requests
import time

# 1. Initialize API Connection
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("ERROR: GEMINI_API_KEY environment variable not found.")
    exit(1)

MODEL_NAME = "gemini-2.0-flash-lite"
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent?key={api_key}"

# 2. Define Directories
EVIDENCE_DIR = "./02_Evidence_Core"
BRIEFS_DIR = "./01_Executive_Briefs"
NARRATIVE_FILE = os.path.join(BRIEFS_DIR, "PARL_SUBMISSION_MAIN_JUNE2026.md")

os.makedirs(BRIEFS_DIR, exist_ok=True)

def extract_text(filepath):
    """Extracts text from the first few pages to speed up processing."""
    text = ""
    try:
        reader = pypdf.PdfReader(filepath)
        num_pages = min(len(reader.pages), 5)
        for i in range(num_pages):
            page_text = reader.pages[i].extract_text()
            if page_text:
                text += page_text + " "
    except Exception as e:
        print(f"  [!] Error reading PDF {filepath}: {e}")
    return text

def analyze_document_with_retry(text_content, max_retries=5, base_delay=4):
    """Sends text to AI via web request with exponential backoff handling for 429s."""
    prompt = f"""
    You are an expert forensic governance auditor analyzing South African legal and regulatory evidence.
    Read the following document text and determine its proper categorization.
    
    Return ONLY a valid JSON object with no markdown formatting, no code blocks, and no extra text.
    Use this exact structure:
    {{
        "folder": "Choose ONE: CCMA, SAPC, DEL, JSE_FSCA_Questco, Judge President BCEA, Parliament V_2, or Uncategorized",
        "committee": "Name the specific Parliamentary Portfolio Committee this concerns.",
        "summary": "Write a highly professional, 2-to-3 sentence executive summary of the document's legal facts and institutional failures."
    }}
    
    Document Text:
    {text_content[:6000]}
    """
    
    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    
    for attempt in range(max_retries):
        try:
            response = requests.post(API_URL, headers={"Content-Type": "application/json"}, json=payload)
            
            # Catch Rate Limit specifically
            if response.status_code == 429:
                delay = base_delay * (2 ** attempt)
                print(f"  [!] Rate limit hit (429). API is throttling us. Sleeping for {delay} seconds before retry...")
                time.sleep(delay)
                continue
                
            response.raise_for_status() 
            data = response.json()
            
            raw_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
            
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:-3].strip()
            elif raw_text.startswith("```"):
                raw_text = raw_text[3:-3].strip()
                
            return json.loads(raw_text)
            
        except Exception as e:
            if attempt == max_retries - 1:
                print(f"  [!] AI Analysis failed after {max_retries} attempts: {e}")
                return None
            time.sleep(base_delay)
    return None

def process_vault():
    print(f"Scanning root of {EVIDENCE_DIR} for unfiled PDFs...\n")
    
    # Filter for files matching the unfiled PDFs we saw in the log
    unfiled_files = [f for f in os.listdir(EVIDENCE_DIR) if os.path.isfile(os.path.join(EVIDENCE_DIR, f)) and f.upper().endswith(".PDF")]
    
    if not unfiled_files:
        print("No unfiled PDFs found in the root directory.")
        return

    for filename in unfiled_files:
        filepath = os.path.join(EVIDENCE_DIR, filename)
        print(f"Processing: {filename}")
        
        text = extract_text(filepath)
        if not text.strip():
            print("  [-] No readable text found. Skipping.")
            continue
            
        print("  [*] Analyzing cognitive context...")
        analysis = analyze_document_with_retry(text)
        
        if analysis:
            target_folder_name = analysis.get("folder", "Uncategorized")
            target_dir = os.path.join(EVIDENCE_DIR, target_folder_name)
            
            os.makedirs(target_dir, exist_ok=True)
            
            target_filepath = os.path.join(target_dir, filename)
            shutil.move(filepath, target_filepath)
            print(f"  [+] Routed to: {target_folder_name}")
            
            with open(NARRATIVE_FILE, "a", encoding="utf-8") as f:
                f.write(f"\n### Evidence: {filename}\n")
                f.write(f"**Target Committee:** {analysis.get('committee', 'N/A')}\n")
                f.write(f"**Executive Summary:** {analysis.get('summary', 'No summary generated.')}\n")
                f.write(f"**Filing Location:** `{target_folder_name}/{filename}`\n")
                f.write("---\n")
        else:
            print("  [-] Categorization failed definitively for this file.")
        
        # Proactive baseline delay between files to avoid hitting standard API windows
        print("  [*] Pacing script... waiting 4 seconds before the next document.")
        time.sleep(4)
        print("-" * 40)

if __name__ == "__main__":
    process_vault()
    print(f"\nAudit pipeline complete. Check {NARRATIVE_FILE} for your updated narrative.")

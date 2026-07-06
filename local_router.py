import os
import shutil
import pypdf

# 1. Define Directories
EVIDENCE_DIR = "./02_Evidence_Core"
BRIEFS_DIR = "./01_Executive_Briefs"
NARRATIVE_FILE = os.path.join(BRIEFS_DIR, "PARL_SUBMISSION_MAIN_JUNE2026.md")

os.makedirs(BRIEFS_DIR, exist_ok=True)

def extract_text(filepath):
    """Extracts text locally to match high-confidence keywords."""
    text = ""
    try:
        reader = pypdf.PdfReader(filepath)
        num_pages = min(len(reader.pages), 5)
        for i in range(num_pages):
            page_text = reader.pages[i].extract_text()
            if page_text:
                text += page_text.upper() + " "
    except Exception as e:
        print(f"  [!] Error reading PDF {filepath}: {e}")
    return text

def determine_route(filename, text_content):
    """Applies strict rule-based routing based on visible forensic markers."""
    fn = filename.upper()
    
    # Marker Group 1: CCMA / Labour (WECT case prefixes, Con-Arb procedures)
    if "WECT" in fn or "CON-ARB" in fn or "WECT" in text_content or "CON-ARB" in text_content or "AFFIDAVIT" in text_content:
        return "CCMA", "Portfolio Committee on Employment and Labour", "Document addresses formal dispute resolution proceedings under CCMA jurisdiction, involving statutory case management files."

    # Marker Group 2: South African Pharmacy Council (SAPC Professional Conduct)
    if "PHARMACIST" in fn or "SAPC" in fn or "PHARMACIST" in text_content or "SAPC" in text_content:
        return "SAPC", "Portfolio Committee on Health", "Document directly concerns professional pharmacy practices, statutory compliance, or professional conduct frameworks under the SAPC."

    # Marker Group 3: Council for Medical Schemes / Managed Care Corporate Oversight
    if "CMS" in fn or "MEDSCHEME" in fn or "AFROCENTRIC" in fn or "CMS" in text_content or "MEDSCHEME" in text_content or "AFROCENTRIC" in text_content:
        return "JSE_FSCA_Questco", "Portfolio Committee on Health / Portfolio Committee on Finance", "Document details institutional escalation, corporate managed care structures, or medical scheme regulatory correspondence."

    return "Uncategorized", "N/A", "Retained in root folder for manual governance classification."

def process_vault_locally():
    print(f"Executing Local Rule-Based Router on {EVIDENCE_DIR}...\n")
    
    unfiled_files = [f for f in os.listdir(EVIDENCE_DIR) if os.path.isfile(os.path.join(EVIDENCE_DIR, f)) and f.upper().endswith(".PDF")]
    
    if not unfiled_files:
        print("No unfiled PDFs found in the root directory.")
        return

    for filename in unfiled_files:
        filepath = os.path.join(EVIDENCE_DIR, filename)
        print(f"Processing: {filename}")
        
        text = extract_text(filepath)
        folder, committee, running_summary = determine_route(filename, text)
        
        target_dir = os.path.join(EVIDENCE_DIR, folder)
        os.makedirs(target_dir, exist_ok=True)
        
        # Move the physical file out of the root
        shutil.move(filepath, os.path.join(target_dir, filename))
        print(f"  [+] Locally Routed to: {folder}")
        
        # Log it directly to your master narrative file
        with open(NARRATIVE_FILE, "a", encoding="utf-8") as f:
            f.write(f"\n### Evidence: {filename}\n")
            f.write(f"**Target Committee:** {committee}\n")
            f.write(f"**Filing Blueprint Summary:** {running_summary}\n")
            f.write(f"**Filing Location:** `{folder}/{filename}`\n")
            f.write("---\n")
            
        print("-" * 40)

if __name__ == "__main__":
    process_vault_locally()
    print(f"\nLocal pipeline complete. Check {NARRATIVE_FILE} for your structured folder manifest.")

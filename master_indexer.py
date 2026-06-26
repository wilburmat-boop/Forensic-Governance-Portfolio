import os, json

def wide_net_index():
    # We define all main folders to scan
    folders_to_scan = ['01_Executive_Briefs', '02_Evidence_Core', '03_Regulatory_Cross_Maps']
    manifest = {"entities": {}}
    total_count = 0
    
    for folder in folders_to_scan:
        if os.path.exists(folder):
            manifest["entities"][folder] = {}
            for root, dirs, files in os.walk(folder):
                if files:
                    # Create a category name based on subfolder path
                    rel_path = os.path.relpath(root, folder)
                    category = rel_path if rel_path != "." else "General"
                    # Capture ALL files
                    manifest["entities"][folder][category] = files
                    total_count += len(files)
        else:
            print(f"WARNING: Folder {folder} not found.")

    with open("public/Forensic_manifest.json", "w") as f:
        json.dump(manifest, f, indent=4)
    print(f"--- Scan Complete. Total files found and indexed: {total_count} ---")

if __name__ == "__main__":
    wide_net_index()

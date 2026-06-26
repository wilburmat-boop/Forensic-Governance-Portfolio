import os, json

def scan_everything():
    manifest = {"entities": {}}
    # Scan from the current directory downwards
    for root, dirs, files in os.walk("."):
        # Skip system and build folders
        if any(bad in root for bad in [".git", "node_modules", "dist", "public", ".vite", "__pycache__"]):
            continue
        
        # Look for documents
        valid_files = [f for f in files if f.endswith(('.pdf', '.docx', '.doc', '.xlsx', '.csv', '.txt'))]
        
        if valid_files:
            # Use the folder path as the category
            category = root.replace("./", "").replace("/", "_") or "Root"
            manifest["entities"][category] = valid_files
            print(f"Indexing {len(valid_files)} files in: {category}")
            
    with open("public/Forensic_manifest.json", "w") as f:
        json.dump(manifest, f, indent=4)
    print("Full index complete. Check public/Forensic_manifest.json")

if __name__ == "__main__":
    scan_everything()

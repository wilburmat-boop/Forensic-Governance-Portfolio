import os, json

def build_deep_manifest():
    root_dirs = ['01_Executive_Briefs', '02_Evidence_Core', '03_Regulatory_Cross_Maps']
    manifest = {"entities": {}}
    
    for category in root_dirs:
        if os.path.exists(category):
            manifest["entities"][category] = {}
            for root, dirs, files in os.walk(category):
                # Filter for useful documents
                docs = [f for f in files if f.endswith(('.pdf', '.csv', '.xlsx', '.docx', '.doc'))]
                if docs:
                    # Use the subfolder name as a key if it's deeper than the root
                    sub_key = os.path.basename(root) if root != category else "Root"
                    manifest["entities"][category][sub_key] = docs
                    
    with open("public/Forensic_manifest.json", "w") as f:
        json.dump(manifest, f, indent=4)
    print("Full manifest generated with deep-crawl.")

build_deep_manifest()

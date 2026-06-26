import os, json

def generate_full_manifest():
    targets = ['01_Executive_Briefs', '02_Evidence_Core', '03_Regulatory_Cross_Maps']
    manifest = {"entities": {}}
    
    for target in targets:
        if os.path.exists(target):
            manifest["entities"][target] = {}
            # Walk the directory tree
            for root, dirs, files in os.walk(target):
                # Filter for document types
                docs = [f for f in files if f.endswith(('.pdf', '.docx', '.doc', '.xlsx', '.csv'))]
                if docs:
                    # Create a clean label for the UI
                    label = root.replace(target, "").strip(os.sep)
                    if not label: label = "General"
                    manifest["entities"][target][label] = docs
                    
    with open("public/Forensic_manifest.json", "w") as f:
        json.dump(manifest, f, indent=4)
    print("Full index complete. All files mapped.")

if __name__ == "__main__":
    generate_full_manifest()

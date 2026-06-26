import os, json
def generate():
    manifest = {"entities": {}}
    for root, dirs, files in os.walk("."):
        if any(i in root for i in [".git", "node_modules", "dist", "public", ".vite"]): continue
        if root != ".":
            cat = os.path.basename(root)
            docs = [f for f in files if f.endswith(('.pdf', '.csv', '.xlsx', '.doc', '.docx'))]
            if docs: manifest["entities"][cat] = docs
    with open("public/Forensic_manifest.json", "w") as f:
        json.dump(manifest, f, indent=4)
generate()

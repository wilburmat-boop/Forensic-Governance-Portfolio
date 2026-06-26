import os, json

def index_everything():
    root_folder = '02_Evidence_Core'
    manifest = {"entities": {}}
    total_files = 0
    
    if not os.path.exists(root_folder):
        print(f"Error: {root_folder} does not exist.")
        return

    for root, dirs, files in os.walk(root_folder):
        # We take all files, no filtering
        if files:
            # Create a clean path for the manifest key
            relative_path = os.path.relpath(root, root_folder)
            category = f"{root_folder}_{relative_path.replace(os.sep, '_')}"
            
            manifest["entities"][category] = files
            total_files += len(files)
            
    with open("public/Forensic_manifest.json", "w") as f:
        json.dump(manifest, f, indent=4)
        
    print(f"✅ Indexed {total_files} files.")
    print("Check public/Forensic_manifest.json to verify contents.")

if __name__ == "__main__":
    index_everything()

import os
import json

def run_indexer():
    # Explicitly set the search root to the home directory
    home_dir = os.path.expanduser("~")
    all_files = []
    
    # Recursively walk the entire home directory
    for root, dirs, files in os.walk(home_dir):
        # Optional: Exclude 'node_modules' to speed it up and clean the results
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
            
        for file in files:
            if file.endswith('.md'):
                all_files.append(os.path.join(root, file))
    
    # Save the manifest to your current portfolio folder
    manifest_path = os.path.join(os.getcwd(), 'Forensic_manifest.json')
    with open(manifest_path, 'w') as f:
        json.dump({"documents": list(set(all_files)), "status": "indexed"}, f, indent=2)
        
    print(f"--- Scan Complete ---")
    print(f"Total files found and indexed: {len(set(all_files))}")

if __name__ == "__main__":
    run_indexer()

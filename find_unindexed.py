import json
import os

# Where your evidence lives
SEARCH_DIR = '02_Evidence_Core'
INDEX_FILE = 'date_index.json'

def find_unindexed():
    if not os.path.exists(INDEX_FILE):
        print(f"Error: {INDEX_FILE} not found.")
        return
        
    with open(INDEX_FILE, 'r') as f:
        data = json.load(f)
    
    # 2. Extract all paths that are ALREADY indexed
    indexed_paths = set()
    for date, files in data.items():
        for file_info in files:
            path_val = file_info.get('path')
            if path_val:
                indexed_paths.add(path_val)

    # 3. Walk through the directory and find files NOT in the index
    print(f"--- Scanning {SEARCH_DIR} for unindexed files ---")
    unindexed_count = 0
    
    for root, dirs, files in os.walk(SEARCH_DIR):
        for file in files:
            full_path = os.path.join(root, file)
            # Normalize path
            normalized_path = full_path.replace('\\', '/')
            
            if normalized_path not in indexed_paths:
                print(f"[UNINDEXED] {normalized_path}")
                unindexed_count += 1
    
    print(f"\n--- Scan Complete: {unindexed_count} files are currently missing from your index ---")

if __name__ == "__main__":
    find_unindexed()



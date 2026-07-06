import json
import os

def audit():
    if not os.path.exists('date_index.json'):
        print("Error: date_index.json not found.")
        return

    with open('date_index.json', 'r') as f:
        data = json.load(f)

    print("--- Starting Forensic Audit ---")
    
    # Iterate through the dictionary (Dates are keys, Lists are values)
    for date, file_list in data.items():
        for file_info in file_list:
            path = file_info.get('path')
            
            # Check existence
            if not os.path.exists(path):
                print(f"[MISSING] Date: {date} | Path: {path}")
            else:
                print(f"[OK] {date} -> {path}")

if __name__ == "__main__":
    audit()

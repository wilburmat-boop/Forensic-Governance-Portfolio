#!/usr/bin/env python3
import json

with open('public/Forensic_manifest.json', 'r') as f:
    data = json.load(f)

# Strip trailing spaces from all path and folder strings
count = 0
for item in data:
    if isinstance(item, dict):
        for key in ['path', 'folder', 'filename']:
            if key in item and isinstance(item[key], str):
                if item[key] != item[key].rstrip():
                    item[key] = item[key].rstrip()
                    count += 1

with open('public/Forensic_manifest.json', 'w') as f:
    json.dump(data, f, indent=2)

print(f"✓ Fixed {count} trailing spaces in manifest")

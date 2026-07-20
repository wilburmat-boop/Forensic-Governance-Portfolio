#!/usr/bin/env python3
import json

with open('public/Forensic_manifest.json', 'r') as f:
    data = json.load(f)

# Strip trailing spaces from all paths and folders
for item in data:
    if 'path' in item:
        item['path'] = item['path'].rstrip()
    if 'folder' in item:
        item['folder'] = item['folder'].rstrip()

with open('public/Forensic_manifest.json', 'w') as f:
    json.dump(data, f, indent=2)

print("✓ Stripped trailing spaces from manifest paths")

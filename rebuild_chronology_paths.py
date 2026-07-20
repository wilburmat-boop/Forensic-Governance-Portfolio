#!/usr/bin/env python3
import json
import os
from pathlib import Path

# Load chronology with old paths
with open('public/chronology_crossref.json', 'r') as f:
    chronology = json.load(f)

# Build a map of filenames to actual paths in Evidence_Core
evidence_dir = Path('public/02_Evidence_Core')
filename_to_path = {}

for root, dirs, files in os.walk(evidence_dir):
    for file in files:
        full_path = Path(root) / file
        rel_path = full_path.relative_to('public').as_posix()
        # Map both original name and normalized name
        filename_to_path[file] = rel_path
        # Also map normalized versions (underscores, etc)
        normalized = file.replace(' ', '_').replace('(', '').replace(')', '')
        filename_to_path[normalized] = rel_path

# Update chronology paths
updated = 0
for date, entries in chronology.items():
    for entry in entries:
        if entry.get('file'):
            old_file = entry['file']
            # Extract just the filename part
            filename = Path(old_file).name
            # Try to find the new path
            if filename in filename_to_path:
                new_path = '02_Evidence_Core/' + filename_to_path[filename].split('02_Evidence_Core/')[-1]
                if old_file != new_path:
                    entry['file'] = new_path
                    updated += 1
                    print(f"  {old_file} → {new_path}")

with open('public/chronology_crossref.json', 'w') as f:
    json.dump(chronology, f, indent=2)

print(f"\n✓ Updated {updated} file paths in chronology")

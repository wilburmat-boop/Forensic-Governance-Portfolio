#!/usr/bin/env python3
import json

with open('public/chronology_crossref.json', 'r') as f:
    data = json.load(f)

# Fix file paths with trailing spaces before extension
for date, entries in data.items():
    for entry in entries:
        if 'file' in entry and entry['file']:
            # Replace ") .pdf" with ").pdf", etc
            entry['file'] = entry['file'].replace(') .', ').')

with open('public/chronology_crossref.json', 'w') as f:
    json.dump(data, f, indent=2)

print("✓ Fixed trailing spaces in chronology file paths")

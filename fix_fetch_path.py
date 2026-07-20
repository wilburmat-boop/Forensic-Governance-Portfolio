#!/usr/bin/env python3
import re

with open('src/main.js', 'r') as f:
    content = f.read()

old_fetch = "const r = await fetch('./public/chronology_crossref.json');"
new_fetch = "const r = await fetch('./chronology_crossref.json');"

content = content.replace(old_fetch, new_fetch)

with open('src/main.js', 'w') as f:
    f.write(content)

print("✓ Fixed fetch path")

#!/usr/bin/env python3

with open('src/main.js', 'r') as f:
    content = f.read()

content = content.replace("fetch('./public/Forensic_manifest.json')", "fetch('./Forensic_manifest.json')")

with open('src/main.js', 'w') as f:
    f.write(content)

print("✓ Fixed Forensic_manifest.json fetch path")

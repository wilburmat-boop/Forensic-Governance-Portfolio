#!/usr/bin/env python3

with open('src/main.js', 'r') as f:
    content = f.read()

# Fix all ./public/ fetch paths
content = content.replace("fetch('./public/keyword_index.json')", "fetch('./keyword_index.json')")
content = content.replace("fetch('./public/date_index.json')", "fetch('./date_index.json')")

with open('src/main.js', 'w') as f:
    f.write(content)

print("✓ Fixed keyword_index.json fetch path")
print("✓ Fixed date_index.json fetch path")

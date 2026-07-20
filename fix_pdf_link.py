#!/usr/bin/env python3

with open('src/main.js', 'r') as f:
    content = f.read()

# Fix the link href to properly escape quotes
old = '<a href="${fileUrl}" target="_blank" style="color:#3b82f6;'
new = '<a href="${fileUrl.replace(/"/g, \'%22\')}" target="_blank" style="color:#3b82f6;'

content = content.replace(old, new)

with open('src/main.js', 'w') as f:
    f.write(content)

print("✓ Fixed PDF link encoding")

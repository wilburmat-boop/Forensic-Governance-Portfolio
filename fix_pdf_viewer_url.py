#!/usr/bin/env python3

with open('src/main.js', 'r') as f:
    content = f.read()

# Find and replace the buildRawUrl call for PDF viewer
old = 'const fileUrl = buildRawUrl(filePath);'
new = '''const fileUrl = buildRawUrl(filePath);
  // Convert relative URL to absolute for PDF.js viewer
  const absoluteFileUrl = fileUrl.startsWith('http') ? fileUrl : window.location.origin + fileUrl;'''

content = content.replace(old, new)

# Now replace the PDF.js iframe to use absoluteFileUrl
old_iframe = 'file=${encodeURIComponent(fileUrl)}'
new_iframe = 'file=${encodeURIComponent(absoluteFileUrl)}'

content = content.replace(old_iframe, new_iframe)

with open('src/main.js', 'w') as f:
    f.write(content)

print("✓ Fixed PDF viewer to use absolute URLs")

#!/usr/bin/env python3
import re

with open('src/main.js', 'r') as f:
    content = f.read()

old_buildRawUrl = r"function buildRawUrl\(filePath\) \{\s*// For local dev: serve from public/\s*return '/public/' \+ filePath\.split\('/'\)\.map\(p => encodeURIComponent\(p\)\)\.join\('/'\);\s*\}"

new_buildRawUrl = """function buildRawUrl(filePath) {
  // Vite flattens public/ to root in production
  return '/' + filePath.split('/').map(p => encodeURIComponent(p)).join('/');
}"""

content = re.sub(old_buildRawUrl, new_buildRawUrl, content, flags=re.DOTALL)

old_linkGoldDates = r"function linkGoldDates\(\) \{\s*// Search ENTIRE page for dates, not just panels\s*const panels = document\.querySelectorAll\('body, \.panel, \.panel \.container, \[id\*=\"part\"\], \[id\*=\"court\"\]'\);.*?(?=\n\nfunction |\Z)"

new_linkGoldDates = """function linkGoldDates() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
  const nodes = [];
  let node;
  while ((node = walker.nextNode())) nodes.push(node);
  console.log('linkGoldDates: walking', nodes.length, 'text nodes');
  nodes.forEach(node => {
    if (node.parentElement.closest('button,script,style,.evidence-link')) return;
    const text = node.nodeValue;
    Object.keys(CHRONOLOGY_INDEX).forEach(dateStr => {
      if (!text.includes(dateStr)) return;
      const parts = text.split(dateStr);
      if (parts.length < 2) return;
      const frag = document.createDocumentFragment();
      parts.forEach((part, i) => {
        frag.appendChild(document.createTextNode(part));
        if (i < parts.length - 1) {
          const span = document.createElement('span');
          span.textContent = dateStr;
          span.className = 'evidence-link';
          span.style.cssText = 'cursor:pointer;color:#fbbf24;text-decoration:underline;';
          span.onclick = () => showChronologyModal(dateStr);
          frag.appendChild(span);
        }
      });
      node.parentNode.replaceChild(frag, node);
    });
  });
}"""

content = re.sub(old_linkGoldDates, new_linkGoldDates, content, flags=re.DOTALL)

with open('src/main.js', 'w') as f:
    f.write(content)

print("✓ Fixed buildRawUrl() and linkGoldDates()")

const fs = require('fs');

// --- 1. Patch src/main.js ---
let js = fs.readFileSync('src/main.js', 'utf8');
const jsBackup = js;

// Add file-count badges + active-pill tracking to renderDateBrowser
const oldRenderDateBrowser = `function renderDateBrowser() {
  const container = document.getElementById('date-pills');
  if (!container) return;

  const dates = Object.keys(DATE_INDEX).sort().reverse();
  container.innerHTML = dates.map(date => \`
    <button onclick="showDateEvidence('\${date}');" style="padding:8px 12px;background:#111827;border:1px solid #374151;color:#d1d5db;border-radius:4px;cursor:pointer;font-family:monospace;font-size:0.8rem;white-space:nowrap;">📅 \${date}</button>
  \`).join('');
}`;

const newRenderDateBrowser = `function renderDateBrowser() {
  const container = document.getElementById('date-pills');
  if (!container) return;

  const dates = Object.keys(DATE_INDEX).sort().reverse();
  container.innerHTML = dates.map(date => {
    const count = (DATE_INDEX[date] || []).length;
    return \`<button data-date="\${date}" onclick="selectDatePill('\${date}')" style="padding:8px 12px;background:#111827;border:1px solid #374151;color:#d1d5db;border-radius:4px;cursor:pointer;font-family:monospace;font-size:0.8rem;white-space:nowrap;">📅 \${date} <span style="color:#6b7280;">(\${count})</span></button>\`;
  }).join('');
}

function selectDatePill(date) {
  const container = document.getElementById('date-pills');
  if (container) {
    container.querySelectorAll('button').forEach(btn => {
      if (btn.dataset.date === date) {
        btn.style.background = '#1e3a5f';
        btn.style.borderColor = '#2563eb';
        btn.style.color = '#93c5fd';
      } else {
        btn.style.background = '#111827';
        btn.style.borderColor = '#374151';
        btn.style.color = '#d1d5db';
      }
    });
  }
  showDateEvidence(date);
}
window.selectDatePill = selectDatePill;`;

if (!js.includes(oldRenderDateBrowser)) {
  console.log("⚠ renderDateBrowser anchor not found — src/main.js may have changed. No JS changes made.");
} else {
  js = js.replace(oldRenderDateBrowser, newRenderDateBrowser);
  // Wire search box to also filter pills
  js = js.replace(
    'function searchEvidence() {\n  const query = document.getElementById(\'evidence-search\').value;\n  const paths = getMatchingPaths(query);\n  const filteredKeywords = Object.fromEntries(Object.entries(KEYWORD_INDEX).filter(([k]) => paths.includes(k)));\n  renderVault(query);\n}',
    'function searchEvidence() {\n  const query = document.getElementById(\'evidence-search\').value;\n  const paths = getMatchingPaths(query);\n  const filteredKeywords = Object.fromEntries(Object.entries(KEYWORD_INDEX).filter(([k]) => paths.includes(k)));\n  renderVault(query);\n  filterDatePills(query);\n}'
  );
  fs.writeFileSync('src/main.js.pre-pills-backup', jsBackup);
  fs.writeFileSync('src/main.js', js);
  console.log("✓ src/main.js updated: file-count badges, active-pill highlight, search now filters pills too");
}

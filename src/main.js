let HASH_MANIFEST = {};
let KEYWORD_INDEX = {};
let DATE_INDEX = {};
let KEYWORD_INDEX_RAW = {};
let activeKeyword = null;
let GLOSSARY = {};

const KEYWORD_CATEGORIES = {
    "rule nisi": "A court order that will become final unless a specific cause is shown against it.",
    "ex parte": "Proceedings done for the benefit of one party without the presence of the other.",
    "PFMA": "Public Finance Management Act.",
  "⚖️ Legal Proceedings": [
    "perjury", "criminal", "fraud", "contempt", "interdict", "affidavit",
    "deponent", "sworn", "oath", "court order", "rule nisi", "ex parte",
  ],
  "🏥 Health & Regulatory": [
    "HPCSA", "clinical governance", "patient safety", "medical records", "psychiatric"
  ],
  "💼 Corporate & Finance": [
    "Companies Act", "CIPC", "director", "delinquency", "JSE", "FSCA", "disclosure"
  ],
  "⚠️ Whistleblower & Protection": [
    "PDA", "protected disclosure", "retaliation", "occupational detriment", "whistleblower"
  ],
  "🔍 Evidence & Forensic": [
    "SHA-256", "hash", "cryptographic", "sealed", "integrity", "verification"
  ]
};

// COMPREHENSIVE GLOSSARY
const GLOSSARY_TERMS = {
  "BCEA": "Basic Conditions of Employment Act 75 of 1997. Governs minimum employment standards including wage deductions (s. 34).",
  "BCEA s. 34": "Restricts wage deductions without written consent (max 10% without consent, except court order). Material to unlawful salary deduction allegations.",
  "Companies Act": "Companies Act 71 of 2008. Governs corporate governance, director accountability, and disclosure of material information.",
  "Companies Act s. 162": "Director Delinquency. Grounds for declaring a director delinquent where they grossly abused position or breached fiduciary duty.",
  "Companies Act s. 214": "False Statements. Prohibits untrue or materially misleading information in corporate reports or statements.",
  "CIPC": "Companies and Intellectual Property Commission. Designated enforcement body for Companies Act 71 of 2008.",
  "Director Delinquency": "Legal status prohibiting future directorship, imposed on directors found to have grossly abused position or breached duty.",
  "ESG Disclosure": "Environmental, Social, and Governance disclosure required by JSE Listings Requirements. Must accurately reflect material risks.",
  "False Statements": "Deliberately or recklessly including untrue/misleading information in corporate disclosures. Engages Companies Act s. 214.",
  "FMA": "Financial Markets Act 19 of 2012. Regulates conduct in financial markets and protects market integrity.",
  "FMA s. 81": "Prohibits making or publishing false, misleading, or deceptive statements regarding listed companies.",
  "FSCA": "Financial Sector Conduct Authority. Regulates market conduct and investor protection under FMA.",
  "JSE": "Johannesburg Stock Exchange. Lists securities and mandates integrated reporting and accurate governance disclosures.",
  "King IV": "King Report on Corporate Governance — SA framework emphasizing ethical leadership, accountability, and stakeholder engagement.",
  "Material Misrepresentation": "False/misleading statement in corporate disclosure that would influence investor or stakeholder decisions.",
  "PDA": "Protected Disclosures Act 26 of 2000. Protects whistleblowers reporting unlawful or unethical conduct.",
  "Protected Disclosure": "Report of unlawful conduct, breach of law, or ethical violations made through proper channels under PDA.",
  "Retaliation": "Occupational detriment (dismissal, demotion, harassment) imposed on whistleblower. Unlawful under PDA s. 26.",
  "Whistleblower": "Employee or person reporting unlawful conduct/governance failures through proper channels. Protected by PDA.",
  "LRA": "Labour Relations Act 66 of 1995. Governs employment disputes and unfair labour practices.",
  "CCMA": "Commission for Conciliation, Mediation and Arbitration. Mandated dispute resolution for employment matters.",
  "SAHRC": "South African Human Rights Commission. Investigates human rights violations.",
  "HPCSA": "Health Professions Council of South Africa. Regulates healthcare professionals.",
  "SHA-256": "Cryptographic hash producing 256-bit mathematical fingerprint of document. Any alteration produces completely different hash."
};
GLOSSARY = GLOSSARY_TERMS;
window.GLOSSARY = GLOSSARY_TERMS;
function showGlossary(term) {
  const definition = GLOSSARY_TERMS[term];
  if (!definition) return;
  
  const existing = document.getElementById('glossary-modal');
  if (existing) existing.remove();
  
  const modal = document.createElement('div');
  modal.id = 'glossary-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:1000;';
  
  modal.innerHTML = `
    <div style="background:#0b0f19;border:1px solid #374151;border-radius:8px;padding:24px;max-width:600px;color:#f3f4f6;max-height:80vh;overflow-y:auto;font-family:monospace;">
      <button onclick="document.getElementById('glossary-modal').remove()" style="position:absolute;top:0.8em;right:0.8em;background:none;border:1px solid #374151;color:#9ca3af;padding:2px 10px;border-radius:4px;cursor:pointer;font-size:0.75rem;">✕</button>
      <h2 style="color:#fbbf24;margin-top:0;">${term}</h2>
      <p style="line-height:1.6;color:#d1d5db;font-size:0.9rem;">${definition}</p>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
}

function resolveFilePath(filePath) {
  if (HASH_MANIFEST[filePath]) return filePath;
  const needle = filePath.split('/').pop().toLowerCase();
  const found = Object.keys(HASH_MANIFEST).find(k => k.split('/').pop().toLowerCase() === needle);
  return found || filePath;
}

function buildRawUrl(filePath) {
  // For local dev: serve from public/
  return '/public/' + filePath.split('/').map(p => encodeURIComponent(p)).join('/');
}

function showEvidenceModal(filePath) {
  filePath = resolveFilePath(filePath);
  console.log('showEvidenceModal:', filePath);
  console.log('Looking for in HASH_MANIFEST...');
  console.log('Keys sample:', Object.keys(HASH_MANIFEST).slice(0, 3));
  // Try to find file in manifest with various path formats
  let fileData = HASH_MANIFEST[filePath] || {};
  if (!fileData.sha256) {
    // Try without public/ prefix
    const cleanPath = filePath.replace(/^public\//, '');
    fileData = HASH_MANIFEST[cleanPath] || HASH_MANIFEST[filePath] || {};
  }
  const sha256 = fileData.sha256 || 'Hash not available';
  const size = fileData.size ? (fileData.size / 1024).toFixed(1) + ' KB' : 'Unknown';
  const filename = fileData.filename || filePath.split('/').pop();
  const fileUrl = buildRawUrl(filePath);
  const ext = filename.split('.').pop().toLowerCase();
  const isPDF = ['pdf'].includes(ext);
  const isImage = ['jpg', 'jpeg', 'png'].includes(ext);

  const modal = document.getElementById('evidence-modal') || document.createElement('div');
  modal.id = 'evidence-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:2200;padding:20px;box-sizing:border-box;';
  
  const matchedKeywords = KEYWORD_INDEX[filePath] || [];
  
  modal.innerHTML = `
    <div style="background:#030712;border:1px solid #1f2937;border-radius:8px;max-width:900px;width:100%;max-height:90vh;overflow-y:auto;padding:24px;color:#f3f4f6;font-family:monospace;">
      <button onclick="document.getElementById('evidence-modal').remove()" style="position:sticky;top:0;float:right;background:#030712;z-index:10;border:1px solid #374151;color:#9ca3af;padding:6px 12px;border-radius:4px;cursor:pointer;">Close ✕</button>
      <h2 style="color:#fbbf24;margin-top:0;">${filename}</h2>
      <div style="margin:16px 0;font-size:0.85rem;color:#9ca3af;">
        <div>📄 ${ext.toUpperCase()} · 🔐 ${size}</div>
        <div style="margin-top:8px;">Hash (SHA-256):</div>
        <div style="display:flex;gap:8px;margin-top:4px;">
          <code style="color:${sha256 === 'Hash not available' ? '#6b7280' : '#34d399'};font-family:monospace;font-size:0.78rem;word-break:break-all;flex:1;">${sha256}</code>
          <button id="copy-btn" onclick="copyToClipboard('${sha256}', this)" style="background:#111827;border:1px solid #374151;color:#9ca3af;padding:6px 12px;border-radius:4px;cursor:pointer;font-family:monospace;font-size:0.75rem;flex-shrink:0;">Copy Hash</button>
        </div>
        <div style="font-size:0.7rem;color:#4b5563;font-family:monospace;margin-top:8px;">🛡️ Mathematical proof this document is unaltered since forensic sealing. Any single character change produces a completely different hash.</div>
      </div>
      ${matchedKeywords.length > 0 ? `<div style="margin-top:12px;padding:12px;background:#1f2937;border-left:3px solid #3b82f6;border-radius:4px;font-size:0.8rem;"><strong>Keywords:</strong> ${matchedKeywords.join(', ')}</div>` : ''}
      <div style="margin-top:20px;border-top:1px solid #1f2937;padding-top:16px;">
        ${isPDF ? `<div><iframe src="https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(fileUrl)}" style="width:100%;height:500px;border:1px solid #374151;border-radius:4px;"></iframe><p style="margin-top:8px;text-align:center;"><a href="${fileUrl}" target="_blank" style="color:#3b82f6;font-family:monospace;font-size:0.78rem;">↗ Open PDF directly</a></p></div>` : ['doc','docx','xls','xlsx','ppt','pptx'].includes(ext) ? `<div><iframe src="https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}" style="width:100%;height:500px;border:1px solid #374151;border-radius:4px;"></iframe><p style="margin-top:8px;text-align:center;"><a href="${fileUrl}" target="_blank" style="color:#3b82f6;font-family:monospace;font-size:0.78rem;">↗ Open document directly</a></p></div>` : isImage ? `<img src="${fileUrl}" style="max-width:100%;max-height:400px;border-radius:4px;border:1px solid #374151;">` : `<a href="${fileUrl}" target="_blank" style="color:#3b82f6;text-decoration:underline;">Open ${filename}</a>`}
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
}

function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text);
  btn.textContent = '✓ Copied!';
  setTimeout(() => btn.textContent = 'Copy Hash', 2000);
}


let searchTimeout;
function debounceSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchEvidence();
  }, 300);
}


function searchEvidence() {
  try {
    const query = document.getElementById('evidence-search').value;
    console.log('Search value:', query);
    const paths = getMatchingPaths(query);
    const filteredKeywords = Object.fromEntries(Object.entries(KEYWORD_INDEX).filter(([k]) => paths.includes(k)));
    renderVault(query);
    filterDatePills(query);
  } catch(err) {
    const debugBox = document.getElementById('debug-box');
    debugBox.style.display = 'block';
    debugBox.innerHTML = `ERROR: ${err.message}<br>${err.stack}`;
    console.error(err);
  }
}

function filterDatePills(kw) {
  const pillContainer = document.getElementById('date-pills');
  if (!pillContainer) return;
  
  const pills = pillContainer.querySelectorAll('button');
  let anyVisible = false;
  
  pills.forEach(pill => {
    const date = pill.dataset.date || pill.textContent.trim();
    const files = DATE_INDEX[date] || [];
    const matches = files.filter(f => getMatchingPaths(kw).includes(f.path));
    
    if (matches.length > 0) {
      pill.style.display = 'block';
      anyVisible = true;
    } else {
      pill.style.display = 'none';
    }
  });
  
  // Show message if filtered
  const dateSection = document.getElementById('date-section');
  if (dateSection) {
    let msg = dateSection.querySelector('.filter-msg');
    if (kw && !anyVisible) {
      if (!msg) {
        msg = document.createElement('div');
        msg.className = 'filter-msg';
        dateSection.appendChild(msg);
      }
      msg.textContent = `No dates match "${kw}"`;
      msg.style.cssText = 'color:#6b7280;font-family:monospace;font-size:0.85rem;margin:12px 0;';
    } else if (msg) {
      msg.remove();
    }
  }
}

function clearKeyword() {
  document.getElementById('evidence-search').value = '';
  filterDatePills('');
  renderVault('');
}

function getMatchingPaths(query) {
  const q = query.toLowerCase().trim();
  if (!q) return Object.keys(HASH_MANIFEST);
  const matchingPaths = new Set();
  Object.keys(HASH_MANIFEST).forEach(path => {
    const data = HASH_MANIFEST[path];
    if ((data.filename || path).toLowerCase().includes(q) || (data.folder || '').toLowerCase().includes(q)) {
      matchingPaths.add(path);
    }
  });
  Object.keys(KEYWORD_INDEX).forEach(kw => {
    if (kw.toLowerCase().includes(q)) {
      (KEYWORD_INDEX[kw] || []).forEach(entry => {
        if (entry && entry.path) matchingPaths.add(entry.path);
      });
    }
  });
  Object.keys(DATE_INDEX).forEach(dateStr => {
    if (dateStr.toLowerCase().includes(q)) {
      (DATE_INDEX[dateStr] || []).forEach(entry => {
        if (entry && entry.path) matchingPaths.add(entry.path);
      });
    }
  });
  return Array.from(matchingPaths);
}

function renderVault(filter = '') {
  const root = document.getElementById('evidence-vault-root');
  if (!root) return;
  
  const q = filter.toLowerCase().trim();
  const filtered = Object.entries(HASH_MANIFEST).filter(([path, data]) => {
    if (!q) return true;
    return (data.filename || path).toLowerCase().includes(q) || (data.keywords || []).some(kw => kw.toLowerCase().includes(q));
  });
  
  const grouped = {};
  filtered.forEach(([path, data]) => {
    const category = data.category || 'Uncategorized';
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push([path, data]);
  });
  
  let html = '<div style="display:flex;flex-direction:column;gap:16px;">';
  let totalShown = 0;
  
  Object.entries(grouped).forEach(([category, items]) => {
    totalShown += items.length;
    const isOpen = !q && category !== 'Uncategorized';
    html += `
      <div style="border:1px solid #1f2937;border-radius:6px;overflow:hidden;">
        <div onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'block':'none'" style="background:#111827;padding:12px;cursor:pointer;display:flex;align-items:center;gap:8px;">
          <span class="fold-icon" style="display:inline-block;transform:${isOpen ? 'rotate(0deg)' : 'rotate(90deg)'};transition:0.3s;color:#${isOpen ? '3b82f6' : '6b7280'};">▼</span>
          <strong style="color:#f3f4f6;flex:1;">${category}</strong>
          <span style="font-size:0.8rem;color:#6b7280;">${items.length}</span>
        </div>
        <div style="display:${isOpen ? 'block' : 'none'};background:#0b0f19;padding:12px;">
          ${items.map(([path, data]) => `
            <div style="padding:8px;border-bottom:1px solid #1f2937;display:flex;justify-content:space-between;align-items:center;">
              <button onclick="showEvidenceModal('${path}')" style="background:none;border:none;color:#3b82f6;cursor:pointer;text-align:left;flex:1;text-decoration:underline;font-family:monospace;font-size:0.85rem;">${data.filename || path.split('/').pop()}</button>
              <span style="color:#6b7280;font-size:0.75rem;">🛡️ ${data.sha256.substring(0,16)}...</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  const counter = document.getElementById('result-counter');
  if (counter) counter.textContent = q ? `${totalShown} files match "${filter}"` : `${totalShown} sealed files`;
  if (totalShown === 0) {
    root.innerHTML = `<div style="color:#6b7280;font-family:monospace;padding:20px;">No evidence files match "${filter}"</div>`;
  } else {
    root.innerHTML = html;
  }
}


function showDateEvidence(date) {
  document.getElementById('evidence-search').value = '';
  const container = document.getElementById('evidence-vault-root') || document.getElementById('tree-accordion-root');
  const counter = document.getElementById('result-counter');
  const files = DATE_INDEX[date] || [];

  if (!container) { console.error('No evidence container found'); return; }

  if (files.length === 0) {
    container.innerHTML = `<div style="color:#6b7280;font-family:monospace;padding:20px;">No sealed evidence files found for ${date}</div>`;
    if (counter) counter.textContent = `0 files for ${date}`;
    return;
  }

  container.innerHTML = files.map(file => `
    <div style="padding:10px 14px;background:#0b0f19;border:1px solid #1f2937;border-radius:6px;display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px;">
      <div style="min-width:0;flex:1;">
        <div style="color:#e5e7eb;font-family:monospace;font-size:0.8rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${file.filename}</div>
        <div style="color:#4b5563;font-family:monospace;font-size:0.65rem;margin-top:2px;">SHA-256: ${(file.sha256 || '').substring(0,24)}...</div>
      </div>
      <button onclick="showEvidenceModal('${file.path}')" style="background:#1e3a5f;border:1px solid #2563eb;color:#93c5fd;padding:6px 14px;font-size:0.75rem;font-family:monospace;border-radius:4px;cursor:pointer;flex-shrink:0;">View Evidence</button>
    </div>
  `).join('');

  if (counter) counter.textContent = `${files.length} file(s) for ${date}`;
}
window.showDateEvidence = showDateEvidence;

function renderDateBrowser() {
  const container = document.getElementById('date-pills');
  if (!container) return;
  
  const dates = Object.keys(DATE_INDEX).sort().reverse();
  container.innerHTML = dates.map(date => `
    <button data-date="${date}" onclick="selectDatePill('${date}')" style="padding:8px 12px;background:#111827;border:1px solid #374151;color:#d1d5db;border-radius:4px;cursor:pointer;font-family:monospace;font-size:0.8rem;white-space:nowrap;">📅 ${date} <span style="color:#6b7280;">(${(DATE_INDEX[date]||[]).length})</span></button>
  `).join('');
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
window.selectDatePill = selectDatePill;

function toggleKeywordDropdown() {
  const dropdown = document.getElementById('keyword-dropdown');
  if (dropdown) dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

async function initializePortfolio() {
  try {
    const [hashRes, kwRes, dateRes] = await Promise.all([
      fetch('./public/Forensic_manifest.json'),
      fetch('./public/keyword_index.json'),
      fetch('./public/date_index.json')
    ]);
    const hashData = await hashRes.json();
    const kwData = await kwRes.json();
    const dateData = await dateRes.json();
    HASH_MANIFEST = {};
    (Array.isArray(hashData) ? hashData : []).forEach(f => { 
      if (f && f.path) HASH_MANIFEST[f.path] = f; 
    });
    DATE_INDEX = dateData || {};
    KEYWORD_INDEX = {};
    Object.entries(kwData || {}).forEach(([keyword, fileList]) => {
      if (keyword === 'index') return;
      (Array.isArray(fileList) ? fileList : []).forEach(f => {
        if (!f || !f.path) return;
        if (!KEYWORD_INDEX[f.path]) KEYWORD_INDEX[f.path] = [];
        KEYWORD_INDEX[f.path].push(keyword);
      });
    });
    DATE_INDEX = dateData || {};
    KEYWORD_INDEX_RAW = kwData || {};
    renderVault();
    renderKeywordDropdown();
    renderDateBrowser();
  } catch(e) {
    document.getElementById('tree-accordion-root').innerHTML = `<div style="color:#f87171;padding:20px;font-family:monospace;">[FAULT] Unable to load manifests. Ensure Forensic_manifest.json, keyword_index.json, and date_index.json are in the repository root.</div>`;
  }

  // DEBUG: Test input
  setTimeout(() => {
    const input = document.getElementById('evidence-search');
    if (input) {
      input.addEventListener('focus', () => { document.getElementById('debug-box').textContent = 'Input focused'; });
      input.addEventListener('input', (e) => { document.getElementById('debug-box').textContent = 'Typed: ' + e.target.value; });
    }
  }, 500);
}

document.addEventListener('DOMContentLoaded', initializePortfolio);

window.renderVault = renderVault;
window.filterDatePills = filterDatePills;
window.copyToClipboard = copyToClipboard;
window.showEvidenceModal = showEvidenceModal;
window.searchEvidence = searchEvidence;
window.clearKeyword = clearKeyword;
window.toggleKeywordDropdown = toggleKeywordDropdown;
window.showGlossary = showGlossary;

function renderKeywordDropdown() {
  const dropdown = document.getElementById('keyword-dropdown');
  if (!dropdown) return;
  const keywords = Object.keys(KEYWORD_INDEX_RAW || {}).sort();
  dropdown.innerHTML = keywords.map(kw => `
    <button onclick="document.getElementById('evidence-search').value='${kw.replace(/'/g,"\\'")}';searchEvidence();document.getElementById('keyword-dropdown').style.display='none';" style="display:inline-block;margin:4px;padding:6px 10px;background:#1f2937;border:1px solid #374151;color:#d1d5db;border-radius:4px;cursor:pointer;font-family:monospace;font-size:0.78rem;">${kw}</button>
  `).join('');
}
window.renderKeywordDropdown = renderKeywordDropdown;

// ===== GOLD DATE FORENSIC NARRATIVE SYSTEM =====
let CHRONOLOGY_INDEX = {};

async function loadChronology() {
  try {
    const r = await fetch('./public/chronology_crossref.json');
    if (!r.ok) return;
    CHRONOLOGY_INDEX = await r.json();
    console.log('Chronology loaded:', Object.keys(CHRONOLOGY_INDEX).length, 'dates');
    setTimeout(() => linkGoldDates(), 500);
  } catch(e) { console.warn('Chronology not loaded:', e); }
}

function linkGoldDates() {
  // Search ENTIRE page for dates, not just panels
  const panels = document.querySelectorAll('body, .panel, .panel .container, [id*="part"], [id*="court"]');
  console.log('linkGoldDates: scanning', panels.length, 'elements');
  console.log('Dates to find:', Object.keys(CHRONOLOGY_INDEX).slice(0, 5));
  
  panels.forEach(panel => {
    if (panel.dataset.datesLinked) return;
    const walker = document.createTreeWalker(panel, NodeFilter.SHOW_TEXT, null);
    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);
    
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
            span.style.cssText = 'color:#c9933a;border-bottom:2px dashed #c9933a;cursor:pointer;font-weight:600;';
            span.title = 'Click for forensic narrative';
            span.onclick = () => showChronologyModal(dateStr);
            frag.appendChild(span);
          }
        });
        node.parentNode.replaceChild(frag, node);
      });
    });
    panel.dataset.datesLinked = '1';
  });
}

function showChronologyModal(dateStr) {
  const entries = CHRONOLOGY_INDEX[dateStr];
  if (!entries || !entries.length) return;
  const existing = document.getElementById('chronology-modal');
  if (existing) existing.remove();

  const entriesHTML = entries.map(e => `
    <div style="background:#0b0f19;border:1px solid #1f2937;border-radius:6px;padding:16px;margin-bottom:12px;">
      <div style="font-family:monospace;font-size:0.75rem;color:#c9933a;font-weight:700;margin-bottom:8px;">${e.ref || ''}</div>
      <p style="color:#e5e7eb;font-size:0.9rem;line-height:1.7;margin:0 0 12px 0;">${e.description || ''}</p>
      ${e.file ? `<button onclick="showEvidenceModal('${e.file.replace(/'/g,"\'")}');document.getElementById('chronology-modal').remove();" style="background:#1e3a5f;border:1px solid #2563eb;color:#93c5fd;padding:6px 14px;border-radius:4px;cursor:pointer;font-family:monospace;font-size:0.78rem;">View Primary Evidence ↗</button>` : ''}
      ${e.supporting ? `<button onclick="showEvidenceModal('${e.supporting.replace(/'/g,"\'")}');document.getElementById('chronology-modal').remove();" style="background:#111827;border:1px solid #374151;color:#9ca3af;padding:6px 14px;border-radius:4px;cursor:pointer;font-family:monospace;font-size:0.78rem;margin-left:8px;">Supporting Evidence ↗</button>` : ''}
    </div>
  `).join('');

  const modal = document.createElement('div');
  modal.id = 'chronology-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:2500;display:flex;align-items:center;justify-content:center;padding:20px;';
  modal.innerHTML = `
    <div style="background:#030712;border:1px solid #c9933a;border-radius:8px;max-width:680px;width:100%;max-height:85vh;overflow-y:auto;padding:24px;position:relative;">
      <button onclick="document.getElementById('chronology-modal').remove()" style="position:absolute;top:12px;right:16px;background:none;border:1px solid #374151;color:#9ca3af;padding:4px 12px;border-radius:4px;cursor:pointer;font-family:monospace;font-size:0.8rem;">✕ Close</button>
      <div style="font-family:monospace;font-size:0.7rem;color:#c9933a;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px;">Forensic Chronology</div>
      <h2 style="color:#f9fafb;font-size:1.3rem;margin:0 0 20px 0;border-bottom:1px solid #1f2937;padding-bottom:12px;">${dateStr}</h2>
      ${entriesHTML}
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

window.showChronologyModal = showChronologyModal;
document.addEventListener('DOMContentLoaded', loadChronology);

// DEBUG: Test if input is focusable
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('evidence-search');
  if (input) {
    input.addEventListener('focus', () => {
      console.log('Input FOCUSED');
      document.getElementById('debug-box').textContent = 'Input focused OK';
    });
    input.addEventListener('input', (e) => {
      console.log('Input event fired, value:', e.target.value);
      document.getElementById('debug-box').textContent = 'Typed: ' + e.target.value;
    });
    input.addEventListener('keydown', (e) => {
      console.log('Keydown:', e.key, e.code);
      document.getElementById('debug-box').textContent = 'Keydown: ' + e.key;
    });
  }
});

// Export functions to window for onclick handlers
window.debounceSearch = debounceSearch;
window.toggleKeywordDropdown = toggleKeywordDropdown;
window.clearKeyword = clearKeyword;
window.showEvidenceModal = showEvidenceModal;
window.searchEvidence = searchEvidence;

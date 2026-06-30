let HASH_MANIFEST = {};
let DATE_INDEX = {};
let KEYWORD_INDEX = {};
let activeKeyword = null;

const KEYWORD_CATEGORIES = {
  "⚖️ Legal Proceedings": [
    "perjury", "criminal", "fraud", "contempt", "interdict", "affidavit",
    "deponent", "sworn", "oath", "court order", "rule nisi", "ex parte",
    "default judgment", "notice of motion", "heads of argument"
  ],
  "👤 People": [
    "jason whyte", "frances barker", "deneys reitz", "ntabiseng ngwane",
    "vusumzi landu", "monwabisi kula", "gerald van wyk", "anna mokgokong",
    "farzaana ismail", "nicola hanekom", "ruanne david", "lebo tshabalala",
    "lisa mari", "cheryl-dawn modern", "marco van der walt"
  ],
  "🏛️ Institutions": [
    "ccma", "labour court", "high court", "saps", "siu", "ndoh",
    "cms", "hpcsa", "sanc", "sapc", "gems", "sahrc", "fsca", "jse",
    "afrocentric", "medscheme", "department of employment",
    "b-bbee commission", "whistleblower house"
  ],
  "📜 Statutory": [
    "protected disclosures act", "pda", "bcea", "lra", "pfma", "popia",
    "nhi", "companies act", "section 162", "section 34", "section 186",
    "section 38", "biowatch", "king iv"
  ],
  "🔍 Forensic Governance": [
    "statutory breach", "dereliction", "mandatory", "fiduciary",
    "whistleblower", "retaliation", "victimisation", "suppression",
    "regulatory capture", "institutional failure", "governance collapse",
    "clinical data", "gexus", "dms", "integration gap"
  ],
  "📋 Outcomes": [
    "constructive dismissal", "unfair dismissal", "unlawful deduction",
    "ui-19", "uif", "salary deduction", "homelessness", "destitute",
    "deregistration", "contempt trap", "gag order", "attrition"
  ],
  "🎯 Roles": [
    "ceo", "chief risk officer", "judge president", "commissioner",
    "registrar", "minister", "director", "chairperson", "board",
    "company secretary", "responsible pharmacist"
  ]
};

function getFileIcon(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  if (['pdf'].includes(ext)) return '📄';
  if (['docx', 'doc'].includes(ext)) return '📝';
  if (['md'].includes(ext)) return '📋';
  if (['xlsx', 'csv'].includes(ext)) return '📊';
  if (['jpg', 'jpeg', 'png'].includes(ext)) return '🖼️';
  return '📁';
}

function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = 'Copied ✓';
    btn.style.color = '#34d399';
    setTimeout(() => { btn.textContent = 'Copy Hash'; btn.style.color = '#9ca3af'; }, 2000);
  });
}

function showEvidenceModal(filePath) {
  const existing = document.getElementById('evidence-modal');
  if (existing) existing.remove();

  const fileData = HASH_MANIFEST[filePath] || {};
  const sha256 = fileData.sha256 || 'Hash not available';
  const size = fileData.size ? (fileData.size / 1024).toFixed(1) + ' KB' : 'Unknown';
  const filename = fileData.filename || filePath.split('/').pop();
  const fileUrl = 'https://raw.githubusercontent.com/wilburmat-boop/Forensic-Governance-Portfolio/main/dist/' + filePath.split('/').map(p => encodeURIComponent(p)).join('/');
  const ext = filename.split('.').pop().toLowerCase();
  const isPDF = ['pdf'].includes(ext);
  const isImage = ['jpg', 'jpeg', 'png'].includes(ext);

  const matchedKeywords = KEYWORD_INDEX[filePath] || [];

  const modal = document.createElement('div');
  modal.id = 'evidence-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.88);z-index:1000;display:flex;align-items:flex-start;justify-content:center;padding:20px;box-sizing:border-box;overflow-y:auto;';

  modal.innerHTML = `
    <div style="background:#0b0f19;border:1px solid #1f2937;border-radius:8px;width:100%;max-width:900px;margin:auto;">

      <div style="background:#111827;padding:16px 20px;border-bottom:1px solid #1f2937;display:flex;justify-content:space-between;align-items:center;border-radius:8px 8px 0 0;">
        <div style="font-family:monospace;font-size:0.8rem;color:#3b82f6;font-weight:700;letter-spacing:0.08em;">EVIDENCE VIEWER · PARLIAMENTARY GRADE · SHA-256 VERIFIED</div>
        <button onclick="document.getElementById('evidence-modal').remove()" style="background:none;border:1px solid #374151;color:#9ca3af;padding:4px 12px;border-radius:4px;cursor:pointer;font-family:monospace;font-size:0.8rem;">✕ Close</button>
      </div>

      <div style="padding:20px;border-bottom:1px solid #1f2937;">
        <div style="font-size:1.1rem;font-weight:700;color:#f9fafb;margin-bottom:4px;">${getFileIcon(filename)} ${filename}</div>
        <div style="font-size:0.78rem;color:#6b7280;font-family:monospace;margin-top:2px;">${filePath}</div>
        <div style="font-size:0.78rem;color:#6b7280;margin-top:4px;">Size: ${size}</div>
        ${matchedKeywords.length > 0 ? `
        <div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px;">
          ${matchedKeywords.map(kw => `<span style="background:#1e3a5f;border:1px solid #2563eb;color:#93c5fd;padding:2px 8px;border-radius:3px;font-family:monospace;font-size:0.7rem;">${kw}</span>`).join('')}
        </div>` : ''}
      </div>

      <div style="padding:20px;border-bottom:1px solid #1f2937;background:#030712;">
        <div style="font-family:monospace;font-size:0.7rem;color:#34d399;font-weight:700;letter-spacing:0.1em;margin-bottom:8px;">🛡️ SHA-256 CRYPTOGRAPHIC INTEGRITY HASH</div>
        <div style="background:#0b0f19;border:1px solid #065f46;border-radius:6px;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
          <code style="color:#34d399;font-family:monospace;font-size:0.78rem;word-break:break-all;flex:1;">${sha256}</code>
          <button id="copy-btn" onclick="copyToClipboard('${sha256}', this)" style="background:#111827;border:1px solid #374151;color:#9ca3af;padding:6px 12px;border-radius:4px;cursor:pointer;font-family:monospace;font-size:0.75rem;flex-shrink:0;">Copy Hash</button>
        </div>
        <div style="font-size:0.7rem;color:#4b5563;font-family:monospace;margin-top:8px;">Mathematical proof this document is unaltered since forensic sealing. Any single character change produces a completely different hash.</div>
      </div>

      <div style="padding:20px;">
        <div style="font-family:monospace;font-size:0.7rem;color:#6b7280;font-weight:700;letter-spacing:0.1em;margin-bottom:12px;">DOCUMENT</div>
        ${isPDF ? `
          <iframe src="${fileUrl}" style="width:100%;height:600px;border:1px solid #1f2937;border-radius:6px;background:white;" title="${filename}"></iframe>
          <div style="margin-top:8px;"><a href="${fileUrl}" target="_blank" style="color:#3b82f6;font-family:monospace;font-size:0.8rem;text-decoration:none;">↗ Open in new tab</a></div>
        ` : isImage ? `
          <img src="${fileUrl}" style="max-width:100%;border:1px solid #1f2937;border-radius:6px;" alt="${filename}" />
        ` : `
          <div style="background:#030712;border:1px solid #1f2937;border-radius:6px;padding:20px;text-align:center;">
            <div style="color:#6b7280;font-family:monospace;font-size:0.85rem;margin-bottom:16px;">This document type renders best in its native application.</div>
            <a href="${fileUrl}" target="_blank" style="background:#1e3a5f;border:1px solid #2563eb;color:#93c5fd;padding:10px 20px;border-radius:6px;text-decoration:none;font-family:monospace;font-size:0.85rem;">↗ Open ${filename}</a>
          </div>
        `}
      </div>
    </div>
  `;

  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}

function toggleKeywordDropdown() {
  const dropdown = document.getElementById('keyword-dropdown');
  dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

function applyKeyword(kw) {
  activeKeyword = kw;
  document.getElementById('evidence-search').value = kw;
  document.getElementById('active-keyword').textContent = '× ' + kw;
  document.getElementById('active-keyword').style.display = 'inline-block';
  document.getElementById('keyword-dropdown').style.display = 'none';
  renderVault(kw);
  filterDatePills(kw);
}

function filterDatePills(kw) {
  const pillContainer = document.getElementById('date-pills');
  if (!pillContainer) return;

  const q = kw ? kw.toLowerCase() : '';
  const pills = pillContainer.querySelectorAll('button');
  let visible = 0;

  pills.forEach(pill => {
    const dateStr = pill.textContent.split(' (')[0];
    const files = DATE_INDEX[dateStr] || [];

    if (!q) {
      pill.style.display = '';
      return;
    }

    // Check if any file for this date matches the keyword index
    const matches = files.some(file => {
      const kwMatches = KEYWORD_INDEX[file.path] || [];
      return kwMatches.some(k => k.toLowerCase().includes(q) || q.includes(k.toLowerCase()));
    });

    if (matches && visible < 3) {
      pill.style.display = '';
      pill.style.background = '#1e3a5f';
      pill.style.borderColor = '#2563eb';
      visible++;
    } else {
      pill.style.display = 'none';
    }
  });

  // Show message if filtered
  const dateSection = document.getElementById('date-browser');
  if (dateSection) {
    let msg = dateSection.querySelector('.filter-msg');
    if (q && visible > 0) {
      if (!msg) {
        msg = document.createElement('div');
        msg.className = 'filter-msg';
        msg.style.cssText = 'font-family:monospace;font-size:0.72rem;color:#6b7280;margin-top:8px;';
        pillContainer.after(msg);
      }
      msg.textContent = `Showing ${visible} date(s) matching "${kw}" — click to view evidence`;
    } else if (msg) {
      msg.remove();
    }
  }
}

function clearKeyword() {
  activeKeyword = null;
  document.getElementById('evidence-search').value = '';
  document.getElementById('active-keyword').style.display = 'none';
  renderVault('');
  filterDatePills('');
}

function getMatchingPaths(query) {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  const keywordMatches = new Set();
  Object.entries(KEYWORD_INDEX).forEach(([path, keywords]) => {
    if (keywords.some(kw => kw.toLowerCase().includes(q) || q.includes(kw.toLowerCase()))) {
      keywordMatches.add(path);
    }
  });
  return keywordMatches;
}

function renderVault(filter = '') {
  const container = document.getElementById('tree-accordion-root');
  container.innerHTML = '';
  const q = filter.toLowerCase().trim();
  const keywordMatches = q ? getMatchingPaths(q) : null;

  const folderLabels = {
    '01_Executive_Briefs': 'Level 1 · Executive Briefs',
    '02_Evidence_Core': 'Level 2 · Evidence Core',
    '03_Regulatory_Cross_Maps': 'Level 3 · Regulatory Cross-Maps'
  };

  const grouped = {};
  Object.entries(HASH_MANIFEST).forEach(([path, data]) => {
    const folder = path.split('/')[0];
    if (!grouped[folder]) grouped[folder] = [];

    const nameMatch = data.filename.toLowerCase().includes(q);
    const keywordMatch = keywordMatches ? keywordMatches.has(path) : false;

    if (!q || nameMatch || keywordMatch) {
      grouped[folder].push({ path, ...data, keywordMatch });
    }
  });

  let totalShown = 0;

  Object.entries(grouped).forEach(([folder, files]) => {
    if (files.length === 0) return;
    const label = folderLabels[folder] || folder;
    totalShown += files.length;

    const card = document.createElement('div');
    card.style.cssText = 'background:#0b0f19;border:1px solid #1f2937;border-radius:8px;overflow:hidden;margin-bottom:16px;';

    const header = document.createElement('div');
    header.style.cssText = 'padding:16px 20px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;background:#111827;';
    header.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;">
        <span class="fold-icon" style="color:#6b7280;font-size:0.75rem;transition:transform 0.2s;">▶</span>
        <span style="font-weight:700;font-size:1rem;color:#f9fafb;">${label}</span>
      </div>
      <span style="background:#1f2937;border:1px solid #374151;color:#e5e7eb;font-size:0.75rem;font-family:monospace;padding:4px 10px;border-radius:4px;">${files.length} files</span>
    `;

    const body = document.createElement('div');
    body.style.cssText = 'display:none;padding:12px;background:#030712;border-top:1px solid #1f2937;flex-direction:column;gap:8px;';

    files.forEach(file => {
      const node = document.createElement('div');
      node.style.cssText = `padding:10px 14px;background:#0b0f19;border:1px solid ${file.keywordMatch ? '#2563eb' : '#1f2937'};border-radius:6px;display:flex;align-items:center;justify-content:space-between;gap:12px;`;
      node.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;min-width:0;flex:1;">
          <span style="flex-shrink:0;">${getFileIcon(file.filename)}</span>
          <div style="min-width:0;">
            <div style="color:#e5e7eb;font-family:monospace;font-size:0.8rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${file.filename}</div>
            <div style="color:#4b5563;font-family:monospace;font-size:0.65rem;margin-top:2px;">🛡️ ${file.sha256.substring(0,16)}...${file.keywordMatch ? ' · <span style="color:#3b82f6;">keyword match</span>' : ''}</div>
          </div>
        </div>
        <button class="view-evidence-btn" data-path="${file.path}" style="background:#1e3a5f;border:1px solid #2563eb;color:#93c5fd;padding:6px 14px;font-size:0.75rem;font-family:monospace;border-radius:4px;cursor:pointer;flex-shrink:0;">
          View Evidence ↗
        </button>
      `;
      node.querySelector('.view-evidence-btn').addEventListener('click', function() {
        showEvidenceModal(this.getAttribute('data-path'));
      });
      body.appendChild(node);
    });

    header.addEventListener('click', () => {
      const isOpen = body.style.display === 'flex';
      body.style.display = isOpen ? 'none' : 'flex';
      body.style.flexDirection = 'column';
      header.querySelector('.fold-icon').style.transform = isOpen ? 'rotate(0deg)' : 'rotate(90deg)';
      header.querySelector('.fold-icon').style.color = isOpen ? '#6b7280' : '#3b82f6';
    });

    card.appendChild(header);
    card.appendChild(body);
    container.appendChild(card);
  });

  const counter = document.getElementById('result-counter');
  if (counter) counter.textContent = q ? `${totalShown} files match "${filter}"` : `${totalShown} sealed files`;

  if (container.innerHTML === '') {
    container.innerHTML = `<div style="color:#6b7280;font-family:monospace;padding:20px;">No evidence files match "${filter}"</div>`;
  }
}


function verifyHash() {
  const input = document.getElementById('hash-input').value.trim().toLowerCase();
  const result = document.getElementById('verify-result');

  if (!input || input.length !== 64) {
    result.style.display = 'block';
    result.innerHTML = '<div style="background:#451a03;border:1px solid #78350f;color:#fcd34d;padding:12px 16px;border-radius:6px;font-family:monospace;font-size:0.82rem;">⚠️ Invalid hash — SHA-256 hashes are exactly 64 hexadecimal characters.</div>';
    return;
  }

  // Search manifest for matching hash
  const match = Object.entries(HASH_MANIFEST).find(([path, data]) =>
    data.sha256.toLowerCase() === input
  );

  if (match) {
    const [filePath, fileData] = match;
    result.style.display = 'block';
    result.innerHTML = `
      <div style="background:#022c22;border:1px solid #065f46;border-radius:6px;padding:16px;">
        <div style="font-family:monospace;font-size:0.75rem;color:#34d399;font-weight:700;margin-bottom:10px;">✓ HASH VERIFIED — FILE AUTHENTICATED</div>
        <div style="color:#f9fafb;font-weight:600;margin-bottom:6px;">${fileData.filename}</div>
        <div style="font-family:monospace;font-size:0.72rem;color:#6b7280;margin-bottom:12px;">${filePath}</div>
        <div style="font-family:monospace;font-size:0.72rem;color:#34d399;word-break:break-all;margin-bottom:12px;">${fileData.sha256}</div>
        <div style="font-size:0.8rem;color:#d1d5db;margin-bottom:12px;">Size: ${(fileData.size/1024).toFixed(1)} KB — This document has not been altered since cryptographic sealing.</div>
        <button onclick="showEvidenceModal('${filePath}')" style="background:#1e3a5f;border:1px solid #2563eb;color:#93c5fd;padding:8px 16px;border-radius:4px;font-family:monospace;font-size:0.8rem;cursor:pointer;">View Document ↗</button>
      </div>
    `;
  } else {
    result.style.display = 'block';
    result.innerHTML = `
      <div style="background:#450a0a;border:1px solid #7f1d1d;border-radius:6px;padding:16px;">
        <div style="font-family:monospace;font-size:0.75rem;color:#f87171;font-weight:700;margin-bottom:8px;">✗ HASH NOT FOUND IN SEALED EVIDENCE REGISTRY</div>
        <div style="font-size:0.82rem;color:#fca5a5;">This hash does not match any of the 881 sealed evidence files in this portfolio. The document may have been tampered with, or it is not part of this submission.</div>
      </div>
    `;
  }
}


function renderDateBrowser() {
  const pillContainer = document.getElementById('date-pills');
  if (!pillContainer) return;

  Object.keys(DATE_INDEX).forEach(dateStr => {
    const count = DATE_INDEX[dateStr].length;
    const pill = document.createElement('button');
    pill.style.cssText = 'background:#111827;border:1px solid #c9933a;color:#c9933a;padding:4px 12px;border-radius:4px;font-family:monospace;font-size:0.75rem;cursor:pointer;';
    pill.textContent = `${dateStr} (${count})`;
    pill.addEventListener('click', () => showDateEvidence(dateStr));
    pillContainer.appendChild(pill);
  });
}

function showDateEvidence(dateStr) {
  const results = document.getElementById('date-results');
  const files = DATE_INDEX[dateStr] || [];

  results.innerHTML = `
    <div style="border:1px solid #c9933a;border-radius:8px;overflow:hidden;">
      <div style="background:#111827;padding:12px 16px;border-bottom:1px solid #1f2937;">
        <span style="font-family:monospace;font-size:0.8rem;color:#c9933a;font-weight:700;">📅 ${dateStr} — ${files.length} sealed evidence file(s)</span>
      </div>
      <div style="padding:12px;background:#030712;display:flex;flex-direction:column;gap:8px;">
        ${files.map(file => `
          <div style="padding:10px 14px;background:#0b0f19;border:1px solid #1f2937;border-radius:6px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
            <div style="min-width:0;flex:1;">
              <div style="color:#e5e7eb;font-family:monospace;font-size:0.8rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${file.filename}</div>
              <div style="color:#34d399;font-family:monospace;font-size:0.65rem;margin-top:3px;">🛡️ ${file.sha256.substring(0,32)}...</div>
            </div>
            <button class="view-date-btn" data-path="${file.path}" style="background:#1e3a5f;border:1px solid #2563eb;color:#93c5fd;padding:6px 14px;font-size:0.75rem;font-family:monospace;border-radius:4px;cursor:pointer;flex-shrink:0;">View Evidence ↗</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Add click handlers
  results.querySelectorAll('.view-date-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      showEvidenceModal(this.getAttribute('data-path'));
    });
  });

  results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function initPortal() {
  const root = document.getElementById('root'); if (!root) return;

  const keywordDropdownHTML = Object.entries(KEYWORD_CATEGORIES).map(([cat, keywords]) => `
    <div style="margin-bottom:16px;">
      <div style="font-family:monospace;font-size:0.7rem;color:#6b7280;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px;padding:0 4px;">${cat}</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;padding:0 4px;">
        ${keywords.map(kw => `<button onclick="applyKeyword('${kw}')" style="background:#111827;border:1px solid #374151;color:#d1d5db;padding:4px 10px;border-radius:4px;font-family:monospace;font-size:0.75rem;cursor:pointer;">${kw}</button>`).join('')}
      </div>
    </div>
  `).join('');

  root.innerHTML = `
    <div style="background:#030712;color:#f3f4f6;min-height:100vh;font-family:ui-sans-serif,system-ui,sans-serif;padding:32px 24px;max-width:1200px;margin:0 auto;">

      

      <header style="border-bottom:1px solid #1f2937;padding-bottom:20px;margin-bottom:28px;">
        <div style="font-family:monospace;font-size:0.75rem;color:#3b82f6;font-weight:800;letter-spacing:0.1em;margin-bottom:4px;">ETHICHAWKS FORENSIC GOVERNANCE</div>
        <h1 style="color:#f9fafb;font-size:2rem;font-weight:800;margin:0 0 8px 0;">Institutional Oversight · Evidence Vault</h1>
        <p style="color:#6b7280;font-size:0.9rem;margin:0 0 4px 0;">867 files · SHA-256 cryptographically sealed · 392 files keyword-indexed · Parliamentary submission June 2026</p>
      </header>

      <!-- Search + Keywords Bar -->
      <div style="margin-bottom:24px;">
        <div style="display:flex;gap:10px;margin-bottom:10px;">
          <input id="evidence-search" type="text" placeholder="Search files or type any keyword..." style="flex:1;padding:12px 16px;background:#0b0f19;border:1px solid #374151;border-radius:6px;color:#f3f4f6;font-family:monospace;font-size:0.9rem;outline:none;box-sizing:border-box;" />
          <div style="position:relative;">
            <button onclick="toggleKeywordDropdown()" style="padding:12px 16px;background:#111827;border:1px solid #374151;color:#d1d5db;border-radius:6px;font-family:monospace;font-size:0.85rem;cursor:pointer;white-space:nowrap;">🔑 Keywords ▾</button>
            <div id="keyword-dropdown" style="display:none;position:absolute;right:0;top:calc(100% + 4px);width:600px;max-width:90vw;background:#0b0f19;border:1px solid #374151;border-radius:8px;padding:16px;z-index:500;max-height:400px;overflow-y:auto;box-shadow:0 20px 40px rgba(0,0,0,0.6);">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;border-bottom:1px solid #1f2937;padding-bottom:8px;">
                <span style="font-family:monospace;font-size:0.75rem;color:#6b7280;font-weight:700;">SELECT A KEYWORD TO FILTER EVIDENCE</span>
                <button onclick="clearKeyword()" style="background:none;border:1px solid #374151;color:#6b7280;padding:2px 8px;border-radius:3px;font-family:monospace;font-size:0.7rem;cursor:pointer;">Clear</button>
              </div>
              ${keywordDropdownHTML}
            </div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          <span id="result-counter" style="font-family:monospace;font-size:0.8rem;color:#6b7280;"></span>
          <span id="active-keyword" style="display:none;background:#1e3a5f;border:1px solid #2563eb;color:#93c5fd;padding:3px 10px;border-radius:3px;font-family:monospace;font-size:0.78rem;cursor:pointer;" onclick="clearKeyword()">× clear</span>
        </div>
      </div>

      <!-- Date Browser -->
      <div id="date-browser" style="margin-bottom:24px;">
        <div style="font-family:monospace;font-size:0.7rem;color:#c9933a;font-weight:700;letter-spacing:0.1em;margin-bottom:10px;">📅 BROWSE BY DATE — Click any date to see its sealed evidence files</div>
        <div id="date-pills" style="display:flex;flex-wrap:wrap;gap:6px;"></div>
        <div id="date-results" style="margin-top:16px;"></div>
      </div>

      <div id="tree-accordion-root"></div>
    </div>
  `;

  try {
    const [hashRes, kwRes, dateRes] = await Promise.all([
      fetch('/Forensic_manifest.json'),
      fetch('/keyword_index.json'),
      fetch('/date_index.json')
    ]);
    const hashData = await hashRes.json();
    const kwData = await kwRes.json();
    const dateData = await dateRes.json();
    HASH_MANIFEST = {};
    Object.values(dateData || {}).forEach(arr => {
      (Array.isArray(arr) ? arr : []).forEach(f => { if (f && f.path) HASH_MANIFEST[f.path] = f; });
    });
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
    renderVault();
    renderDateBrowser();
  } catch(e) {
    document.getElementById('tree-accordion-root').innerHTML = `
      <div style="background:#451a03;color:#fcd34d;padding:20px;border-radius:6px;font-family:monospace;font-size:0.875rem;border:1px solid #78350f;">
        [FAULT] Unable to load manifests. Ensure hash_manifest.sha256 and keyword_index.json are in the repository root.
      </div>
    `;
  }

  document.getElementById('evidence-search').addEventListener('input', e => {
    renderVault(e.target.value);
  });

  document.addEventListener('click', e => {
    const dropdown = document.getElementById('keyword-dropdown');
    if (dropdown && !dropdown.contains(e.target) && !e.target.closest('button[onclick="toggleKeywordDropdown()"]')) {
      dropdown.style.display = 'none';
    }
  });
}

// Expose functions globally for onclick handlers
window.toggleKeywordDropdown = toggleKeywordDropdown;
window.applyKeyword = applyKeyword;
window.clearKeyword = clearKeyword;
window.verifyHash = verifyHash;
window.showEvidenceModal = showEvidenceModal;

document.addEventListener('DOMContentLoaded', initPortal);
initPortal();

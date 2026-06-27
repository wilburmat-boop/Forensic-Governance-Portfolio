let HASH_MANIFEST = {};

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
  const fileUrl = '/' + filePath.replace(/ /g, '%20');
  const ext = filename.split('.').pop().toLowerCase();
  const isPDF = ['pdf'].includes(ext);
  const isImage = ['jpg', 'jpeg', 'png'].includes(ext);

  const modal = document.createElement('div');
  modal.id = 'evidence-modal';
  modal.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    background:rgba(0,0,0,0.85);z-index:1000;
    display:flex;align-items:flex-start;justify-content:center;
    padding:20px;box-sizing:border-box;overflow-y:auto;
  `;

  modal.innerHTML = `
    <div style="background:#0b0f19;border:1px solid #1f2937;border-radius:8px;width:100%;max-width:900px;margin:auto;">

      <!-- Modal Header -->
      <div style="background:#111827;padding:16px 20px;border-bottom:1px solid #1f2937;display:flex;justify-content:space-between;align-items:center;border-radius:8px 8px 0 0;">
        <div style="font-family:monospace;font-size:0.8rem;color:#3b82f6;font-weight:700;letter-spacing:0.08em;">EVIDENCE VIEWER · PARLIAMENTARY GRADE</div>
        <button onclick="document.getElementById('evidence-modal').remove()" style="background:none;border:1px solid #374151;color:#9ca3af;padding:4px 12px;border-radius:4px;cursor:pointer;font-family:monospace;font-size:0.8rem;">✕ Close</button>
      </div>

      <!-- File Identity -->
      <div style="padding:20px;border-bottom:1px solid #1f2937;">
        <div style="font-size:1.1rem;font-weight:700;color:#f9fafb;margin-bottom:4px;">${getFileIcon(filename)} ${filename}</div>
        <div style="font-size:0.8rem;color:#6b7280;font-family:monospace;">${filePath}</div>
        <div style="font-size:0.8rem;color:#6b7280;margin-top:4px;">Size: ${size}</div>
      </div>

      <!-- SHA-256 Block -->
      <div style="padding:20px;border-bottom:1px solid #1f2937;background:#030712;">
        <div style="font-family:monospace;font-size:0.7rem;color:#34d399;font-weight:700;letter-spacing:0.1em;margin-bottom:8px;">🛡️ SHA-256 CRYPTOGRAPHIC INTEGRITY HASH</div>
        <div style="background:#0b0f19;border:1px solid #065f46;border-radius:6px;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
          <code style="color:#34d399;font-family:monospace;font-size:0.8rem;word-break:break-all;flex:1;">${sha256}</code>
          <button id="copy-btn" onclick="copyToClipboard('${sha256}', this)" style="background:#111827;border:1px solid #374151;color:#9ca3af;padding:6px 12px;border-radius:4px;cursor:pointer;font-family:monospace;font-size:0.75rem;flex-shrink:0;">Copy Hash</button>
        </div>
        <div style="font-size:0.72rem;color:#4b5563;font-family:monospace;margin-top:8px;">This hash proves the document has not been altered since cryptographic sealing on ${new Date().toLocaleDateString('en-ZA')}. Any single character change produces a completely different hash.</div>
      </div>

      <!-- Document Viewer -->
      <div style="padding:20px;">
        <div style="font-family:monospace;font-size:0.7rem;color:#6b7280;font-weight:700;letter-spacing:0.1em;margin-bottom:12px;">DOCUMENT</div>
        ${isPDF ? `
          <iframe src="${fileUrl}" style="width:100%;height:600px;border:1px solid #1f2937;border-radius:6px;background:white;" title="${filename}"></iframe>
          <div style="margin-top:8px;">
            <a href="${fileUrl}" target="_blank" style="color:#3b82f6;font-family:monospace;font-size:0.8rem;text-decoration:none;">↗ Open in new tab</a>
          </div>
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

  modal.addEventListener('click', e => {
    if (e.target === modal) modal.remove();
  });

  document.body.appendChild(modal);
}

function renderVault(filter = '') {
  const container = document.getElementById('tree-accordion-root');
  container.innerHTML = '';
  const query = filter.toLowerCase();

  const grouped = {};
  Object.entries(HASH_MANIFEST).forEach(([path, data]) => {
    const parts = path.split('/');
    const folder = parts[0];
    if (!grouped[folder]) grouped[folder] = [];
    if (path.toLowerCase().includes(query) || data.filename.toLowerCase().includes(query)) {
      grouped[folder].push({ path, ...data });
    }
  });

  const folderLabels = {
    '01_Executive_Briefs': 'Level 1 · Executive Briefs',
    '02_Evidence_Core': 'Level 2 · Evidence Core',
    '03_Regulatory_Cross_Maps': 'Level 3 · Regulatory Cross-Maps'
  };

  Object.entries(grouped).forEach(([folder, files]) => {
    if (files.length === 0) return;
    const label = folderLabels[folder] || folder;

    const card = document.createElement('div');
    card.style.cssText = "background:#0b0f19;border:1px solid #1f2937;border-radius:8px;overflow:hidden;margin-bottom:16px;";

    const header = document.createElement('div');
    header.style.cssText = "padding:16px 20px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;background:#111827;";
    header.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;">
        <span class="fold-icon" style="color:#6b7280;font-size:0.75rem;transition:transform 0.2s;">▶</span>
        <span style="font-weight:700;font-size:1rem;color:#f9fafb;">${label}</span>
      </div>
      <span style="background:#1f2937;border:1px solid #374151;color:#e5e7eb;font-size:0.75rem;font-family:monospace;padding:4px 10px;border-radius:4px;">${files.length} sealed files</span>
    `;

    const body = document.createElement('div');
    body.style.cssText = "display:none;padding:12px;background:#030712;border-top:1px solid #1f2937;flex-direction:column;gap:8px;";

    files.forEach(file => {
      const node = document.createElement('div');
      node.style.cssText = "padding:10px 14px;background:#0b0f19;border:1px solid #1f2937;border-radius:6px;display:flex;align-items:center;justify-content:space-between;gap:12px;";
      node.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;min-width:0;flex:1;">
          <span style="flex-shrink:0;">${getFileIcon(file.filename)}</span>
          <div style="min-width:0;">
            <div style="color:#e5e7eb;font-family:monospace;font-size:0.8rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${file.filename}</div>
            <div style="color:#4b5563;font-family:monospace;font-size:0.65rem;margin-top:2px;">🛡️ ${file.sha256.substring(0, 16)}...</div>
          </div>
        </div>
        <button class="view-evidence-btn" data-path="${file.path}" style="background:#1e3a5f;border:1px solid #2563eb;color:#93c5fd;padding:6px 14px;font-size:0.75rem;font-family:monospace;border-radius:4px;cursor:pointer;flex-shrink:0;">
          View Evidence ↗
        </button>
      `;
      body.appendChild(node);
      node.querySelector('.view-evidence-btn').addEventListener('click', function() {
        showEvidenceModal(this.getAttribute('data-path'));
      });
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

  if (container.innerHTML === '') {
    container.innerHTML = `<div style="color:#6b7280;font-family:monospace;padding:20px;">No evidence files match "${filter}"</div>`;
  }
}

async function initPortal() {
  const root = document.getElementById('root');

  root.innerHTML = `
    <div style="background:#030712;color:#f3f4f6;min-height:100vh;font-family:ui-sans-serif,system-ui,sans-serif;padding:32px 24px;max-width:1200px;margin:0 auto;">

      <div style="background:#7f1d1d;border:1px solid #b91c1c;border-radius:6px;padding:12px 16px;margin-bottom:28px;display:flex;align-items:center;gap:12px;">
        <span>⚖️</span>
        <span style="font-family:monospace;font-size:0.8rem;font-weight:700;color:#fca5a5;letter-spacing:0.05em;">
          STATUTORY SOVEREIGNTY DECLARATION · PARLIAMENTARY OVERSIGHT SUBMISSION · PROTECTED DISCLOSURE PDA s8
        </span>
      </div>

      <header style="border-bottom:1px solid #1f2937;padding-bottom:20px;margin-bottom:28px;">
        <div style="font-family:monospace;font-size:0.75rem;color:#3b82f6;font-weight:800;letter-spacing:0.1em;margin-bottom:4px;">ETHICHAWKS FORENSIC GOVERNANCE</div>
        <h1 style="color:#f9fafb;font-size:2rem;font-weight:800;margin:0 0 8px 0;">Institutional Oversight · Evidence Vault</h1>
        <p style="color:#6b7280;font-size:0.9rem;margin:0 0 4px 0;">867 files · SHA-256 cryptographically sealed · Parliamentary submission June 2026</p>
        <p style="color:#4b5563;font-family:monospace;font-size:0.75rem;margin:0;">Each file displays its full hexadecimal SHA-256 integrity hash upon opening</p>
      </header>

      <div style="margin-bottom:24px;">
        <input id="evidence-search" type="text" placeholder="Search 867 evidence files..." style="width:100%;padding:12px 16px;background:#0b0f19;border:1px solid #374151;border-radius:6px;color:#f3f4f6;font-family:monospace;font-size:0.9rem;outline:none;box-sizing:border-box;" />
      </div>

      <div id="tree-accordion-root"></div>

    </div>
  `;

  try {
    const response = await fetch('/hash_manifest.sha256');
    const data = await response.json();
    HASH_MANIFEST = data.files || {};
    renderVault();
  } catch(e) {
    document.getElementById('tree-accordion-root').innerHTML = `
      <div style="background:#451a03;color:#fcd34d;padding:20px;border-radius:6px;font-family:monospace;font-size:0.875rem;border:1px solid #78350f;">
        [FAULT] Unable to load hash manifest. Ensure hash_manifest.sha256 is in the repository root.
      </div>
    `;
  }

  document.getElementById('evidence-search').addEventListener('input', e => {
    renderVault(e.target.value);
  });
}

document.addEventListener('DOMContentLoaded', initPortal);
initPortal();

const EVIDENCE = {
  "Level 1 · Executive Briefs": [
    "01_Executive_Briefs/FINAL_PARLIAMENTARY_INDEX_JUNE2026.md",
    "01_Executive_Briefs/PARL_SUBMISSION_ANALYTICAL_JUNE2026.md",
    "01_Executive_Briefs/PARL_SUBMISSION_MAIN_JUNE2026",
    "01_Executive_Briefs/PARL_SUBMISSION_MAIN_JUNE2026.md",
    "01_Executive_Briefs/PARL_SUBMISSION_MASTER_FINAL.md",
    "01_Executive_Briefs/SPEAKER_SUMMARY_ANALYTICS.md",
    "01_Executive_Briefs/SUMMARY_HEALTH.md"
  ],
  "Level 2 · Evidence Core": [
    "02_Evidence_Core/02_Evidence_Core/ V10_Notice_of_Motion_BCEA_s77A_FINAL.docx",
    "02_Evidence_Core/02_Evidence_Core/ V_3_complete_full_bundle.pdf",
    "02_Evidence_Core/02_Evidence_Core/FA_Final.docx",
    "02_Evidence_Core/02_Evidence_Core/Matthee_Forensic_Evidence_Report_FR1(1).PDF",
    "02_Evidence_Core/02_Evidence_Core/NOM_Final.docx",
    "02_Evidence_Core/02_Evidence_Core/01_Covering_Letter_to_Registrar_11June2026.docx",
    "02_Evidence_Core/02_Evidence_Core/02_PreTrial_Minute_Unilateral_11June2026.docx",
    "02_Evidence_Core/02_Evidence_Core/03_Parliamentary_Evidence_Note_11June2026.docx",
    "02_Evidence_Core/02_Evidence_Core/05_POPIA_Information_Officer_Declaration.docx",
    "02_Evidence_Core/02_Evidence_Core/06_POPIA_Processing_Agreement.docx",
    "02_Evidence_Core/02_Evidence_Core/08_Data_Governance_Policy.docx",
    "02_Evidence_Core/02_Evidence_Core/10_NHI_Alignment_Statement.docx",
    "02_Evidence_Core/02_Evidence_Core/10 Feb 26 UIF non.pdf",
    "02_Evidence_Core/02_Evidence_Core/10 Feb 26 UIF no declaration.pdf",
    "02_Evidence_Core/02_Evidence_Core/14 Jan 26 Uif non.pdf",
    "02_Evidence_Core/AfrocentricInvestmentCorporationLimitedvWilburWilliamMatthee2026086906AFR1282v020FCompleteBundle.pdf"
  ],
  "Level 3 · Regulatory Cross-Maps": [
    "03_Regulatory_Cross_Maps/KING_V_ALIGNMENT_GAP_ANALYSIS.md",
    "03_Regulatory_Cross_Maps/STATUTORY_BREACH_MATRIX.md"
  ]
};

function getFileIcon(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  if (['pdf', 'PDF'].includes(ext)) return '📄';
  if (['docx', 'doc'].includes(ext)) return '📝';
  if (['md'].includes(ext)) return '📋';
  if (['xlsx', 'csv'].includes(ext)) return '📊';
  if (['jpg', 'jpeg', 'png'].includes(ext)) return '🖼️';
  return '📁';
}

function getFileUrl(path) {
  return '/' + encodeURIComponent(path).replace(/%2F/g, '/');
}

function renderVault(filter = '') {
  const container = document.getElementById('tree-accordion-root');
  container.innerHTML = '';
  const query = filter.toLowerCase();

  Object.entries(EVIDENCE).forEach(([level, files]) => {
    const filtered = files.filter(f => f.toLowerCase().includes(query));
    if (filtered.length === 0) return;

    const card = document.createElement('div');
    card.style.cssText = "background:#0b0f19;border:1px solid #1f2937;border-radius:8px;overflow:hidden;margin-bottom:16px;";

    const header = document.createElement('div');
    header.style.cssText = "padding:16px 20px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;background:#111827;";
    header.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;">
        <span class="fold-icon" style="color:#6b7280;font-size:0.75rem;transition:transform 0.2s;">▶</span>
        <span style="font-weight:700;font-size:1rem;color:#f9fafb;">${level}</span>
      </div>
      <span style="background:#1f2937;border:1px solid #374151;color:#e5e7eb;font-size:0.75rem;font-family:monospace;padding:4px 10px;border-radius:4px;">${filtered.length} files</span>
    `;

    const body = document.createElement('div');
    body.style.cssText = "display:none;padding:12px;background:#030712;border-top:1px solid #1f2937;";

    filtered.forEach(filePath => {
      const fileName = filePath.split('/').pop();
      const url = getFileUrl(filePath);
      const icon = getFileIcon(fileName);

      const node = document.createElement('div');
      node.style.cssText = "padding:10px 14px;background:#0b0f19;border:1px solid #1f2937;border-radius:6px;display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;";
      node.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;min-width:0;flex:1;">
          <span style="flex-shrink:0;">${icon}</span>
          <span style="color:#e5e7eb;font-family:monospace;font-size:0.8rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${fileName}</span>
        </div>
        <a href="${url}" target="_blank" style="background:#1e3a5f;border:1px solid #2563eb;color:#93c5fd;padding:5px 12px;font-size:0.75rem;font-family:monospace;border-radius:4px;text-decoration:none;flex-shrink:0;margin-left:12px;">
          Open ↗
        </a>
      `;
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
        <p style="color:#6b7280;font-size:0.9rem;margin:0;">Cryptographically indexed evidence registry · SHA-256 secured · Parliamentary submission June 2026</p>
      </header>

      <div style="margin-bottom:24px;">
        <input id="evidence-search" type="text" placeholder="Search evidence files..." style="width:100%;padding:12px 16px;background:#0b0f19;border:1px solid #374151;border-radius:6px;color:#f3f4f6;font-family:monospace;font-size:0.9rem;outline:none;box-sizing:border-box;" />
      </div>

      <div id="tree-accordion-root"></div>

    </div>
  `;

  renderVault();

  document.getElementById('evidence-search').addEventListener('input', e => {
    renderVault(e.target.value);
  });
}

document.addEventListener('DOMContentLoaded', initPortal);
initPortal();

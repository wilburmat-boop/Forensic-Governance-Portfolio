async function initPortal() {
  const root = document.getElementById('root');
  
  // Set up the high-visibility, dark executive interface frame
  root.innerHTML = `
    <div style="background-color: #111827; color: #f3f4f6; min-height: 100vh; font-family: ui-sans-serif, system-ui, sans-serif; padding: 24px;">
      <header style="border-bottom: 2px solid #374151; padding-bottom: 16px; margin-bottom: 24px;">
        <h1 style="color: #f9fafb; font-size: 1.5rem; font-weight: 700; margin: 0;">🔍 EthicHawks Forensic Governance Portal</h1>
        <p style="color: #9ca3af; font-size: 0.875rem; margin: 4px 0 0 0;">Systemic Institutional Oversight & Audit Trail</p>
      </header>
      <div id="portal-content">Loading cryptographic dossier...</div>
    </div>
  `;

  try {
    const response = await fetch('/Forensic_manifest.json');
    const data = await response.json();
    const container = document.getElementById('portal-content');

    // Build the Cryptographic Foundation Block
    const crypto = data.cryptographic_foundation || {};
    let cryptoHTML = `
      <section style="background-color: #1f2937; border-left: 4px solid #10b981; padding: 16px; border-radius: 4px; margin-bottom: 20px;">
        <h3 style="color: #10b981; margin: 0 0 8px 0; font-size: 1rem;">🛡️ Cryptographic Integrity (${crypto.algorithm || 'SHA-256'})</h3>
        <p style="font-size: 0.875rem; color: #d1d5db; margin: 0 0 8px 0;">${crypto.rationale || ''}</p>
        <code style="display: block; background-color: #111827; padding: 8px; border-radius: 4px; font-size: 0.75rem; color: #34d399; word-break: break-all;">ENFORCEMENT: ${crypto.enforcement || ''}</code>
      </section>
    `;

    // Build the Statutory Narrative Arc Block
    const arc = data.narrative_arc || {};
    const focusAreas = arc.focus_areas || [];
    let narrativeHTML = `
      <section style="background-color: #1f2937; padding: 16px; border-radius: 4px; margin-bottom: 20px; border-left: 4px solid #ef4444;">
        <h3 style="color: #f87171; margin: 0 0 12px 0; font-size: 1rem;">⚖️ Statutory Breaches & Focus Areas</h3>
        <ul style="margin: 0; padding-left: 20px; font-size: 0.875rem; color: #e5e7eb; line-height: 1.6;">
          ${focusAreas.map(item => ` <li style="margin-bottom: 6px;">${item}</li>`).join('')}
        </ul>
      </section>
    `;

    // Combine everything into the UI
    container.innerHTML = cryptoHTML + narrativeHTML;

  } catch (error) {
    document.getElementById('portal-content').innerHTML = `
      <div style="background-color: #7f1d1d; color: #fca5a5; padding: 16px; border-radius: 4px; font-size: 0.875rem;">
        <strong>System Error:</strong> Failed to fetch forensic data mapping. Verify that Forensic_manifest.json exists in the public directory.
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', initPortal);
initPortal();

(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function r(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function n(e){if(e.ep)return;e.ep=!0;const t=r(e);fetch(e.href,t)}})();async function a(){const s=document.getElementById("root");s.innerHTML=`
    <div style="background-color: #111827; color: #f3f4f6; min-height: 100vh; font-family: ui-sans-serif, system-ui, sans-serif; padding: 24px;">
      <header style="border-bottom: 2px solid #374151; padding-bottom: 16px; margin-bottom: 24px;">
        <h1 style="color: #f9fafb; font-size: 1.5rem; font-weight: 700; margin: 0;">🔍 EthicHawks Forensic Governance Portal</h1>
        <p style="color: #9ca3af; font-size: 0.875rem; margin: 4px 0 0 0;">Systemic Institutional Oversight & Audit Trail</p>
      </header>
      <div id="portal-content">Loading cryptographic dossier...</div>
    </div>
  `;try{const r=await(await fetch("/Forensic_manifest.json")).json(),n=document.getElementById("portal-content"),e=r.cryptographic_foundation||{};let t=`
      <section style="background-color: #1f2937; border-left: 4px solid #10b981; padding: 16px; border-radius: 4px; margin-bottom: 20px;">
        <h3 style="color: #10b981; margin: 0 0 8px 0; font-size: 1rem;">🛡️ Cryptographic Integrity (${e.algorithm||"SHA-256"})</h3>
        <p style="font-size: 0.875rem; color: #d1d5db; margin: 0 0 8px 0;">${e.rationale||""}</p>
        <code style="display: block; background-color: #111827; padding: 8px; border-radius: 4px; font-size: 0.75rem; color: #34d399; word-break: break-all;">ENFORCEMENT: ${e.enforcement||""}</code>
      </section>
    `,c=`
      <section style="background-color: #1f2937; padding: 16px; border-radius: 4px; margin-bottom: 20px; border-left: 4px solid #ef4444;">
        <h3 style="color: #f87171; margin: 0 0 12px 0; font-size: 1rem;">⚖️ Statutory Breaches & Focus Areas</h3>
        <ul style="margin: 0; padding-left: 20px; font-size: 0.875rem; color: #e5e7eb; line-height: 1.6;">
          ${((r.narrative_arc||{}).focus_areas||[]).map(d=>` <li style="margin-bottom: 6px;">${d}</li>`).join("")}
        </ul>
      </section>
    `;n.innerHTML=t+c}catch{document.getElementById("portal-content").innerHTML=`
      <div style="background-color: #7f1d1d; color: #fca5a5; padding: 16px; border-radius: 4px; font-size: 0.875rem;">
        <strong>System Error:</strong> Failed to fetch forensic data mapping. Verify that Forensic_manifest.json exists in the public directory.
      </div>
    `}}document.addEventListener("DOMContentLoaded",a);a();

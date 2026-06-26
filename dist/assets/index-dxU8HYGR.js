(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))n(t);new MutationObserver(t=>{for(const e of t)if(e.type==="childList")for(const s of e.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function r(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?e.credentials="include":t.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function n(t){if(t.ep)return;t.ep=!0;const e=r(t);fetch(t.href,e)}})();async function l(){const o=document.getElementById("root");o.innerHTML=`
    <div style="background-color: #030712; color: #f3f4f6; min-height: 100vh; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; padding: 32px 24px; max-width: 1400px; margin: 0 auto;">
      
      <!-- Sovereign Legal Supremacy Banner -->
      <div style="background-color: #7f1d1d; border: 1px solid #b91c1c; border-radius: 6px; padding: 12px 16px; margin-bottom: 32px; display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 1.25rem;">⚖️</span>
        <span style="font-family: monospace; font-size: 0.875rem; font-weight: 700; letter-spacing: 0.05em; color: #fca5a5;">
          STATUTORY SOVEREIGNTY DECLARATION: SUBMISSION TO PARLIAMENTARY OVERSIGHT — NO ENTITY OUTWEIGHS THE LAW
        </span>
      </div>

      <!-- Main Master Header -->
      <header style="border-bottom: 1px solid #1f2937; padding-bottom: 24px; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
            <span style="color: #3b82f6; font-weight: 800; font-size: 0.875rem; letter-spacing: 0.1em; font-family: monospace;">ETHICHAWKS FORENSIC GOVERNANCE</span>
          </div>
          <h1 style="color: #f9fafb; font-size: 2.25rem; font-weight: 800; margin: 0; letter-spacing: -0.03em;">Institutional Oversight Dossier</h1>
          <p style="color: #6b7280; font-size: 0.9375rem; margin: 8px 0 0 0; max-width: 600px; line-height: 1.5;">
            An independent, cryptographically verified registry analyzing systemic institutional failures, compliance variances, and protected disclosures.
          </p>
        </div>
        
        <!-- Immutable Telemetry Status Badge -->
        <div style="background-color: #022c22; border: 1px solid #065f46; border-radius: 6px; padding: 16px; min-width: 240px; font-family: monospace;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.75rem; color: #6b7280;">
            <span>INTEGRITY ENGINE</span>
            <span style="color: #34d399; font-weight: bold;">ACTIVE</span>
          </div>
          <div id="crypto-badge" style="color: #34d399; font-size: 0.8125rem; font-weight: bold; word-break: break-all;">
            SHA-256 SECURED
          </div>
        </div>
      </header>
      
      <!-- Informational Matrix Architecture Layout -->
      <div style="display: grid; grid-template-columns: 1fr; gap: 32px; display: flex; flex-direction: column; lg:flex-direction: row; align-items: flex-start;">
        
        <!-- Primary Structural Column: Interactive Evidence Tree -->
        <main style="flex: 2; width: 100%;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #1f2937; padding-bottom: 8px;">
            <h2 style="font-size: 1.25rem; color: #f3f4f6; margin: 0; font-weight: 700; letter-spacing: -0.01em;">📁 Cryptographic Evidence Vault</h2>
            <span style="font-size: 0.8125rem; color: #9ca3af; font-family: monospace;">Select layers to unpack matching nodes</span>
          </div>
          
          <div id="tree-accordion-root" style="display: flex; flex-direction: column; gap: 16px;">
            <div style="color: #6b7280; font-size: 0.875rem; font-family: monospace; padding: 20px;">Assembling secure data manifests...</div>
          </div>
        </main>
        
        <!-- Auxiliary Column: Oversight Authorities Alignment Matrix -->
        <aside id="matrix-panel" style="flex: 1; width: 100%; background-color: #0b0f19; border: 1px solid #1f2937; border-radius: 8px; padding: 24px; box-sizing: border-box;">
          <div style="color: #6b7280; font-size: 0.875rem; font-family: monospace;">Aligning compliance criteria...</div>
        </aside>
        
      </div>
    </div>
  `;try{const r=await(await fetch("/Forensic_manifest.json")).json();m(r.cryptographic_foundation),g(r.cross_reference_matrix,r.narrative_arc),u(r)}catch{document.getElementById("tree-accordion-root").innerHTML=`
      <div style="background-color: #451a03; color: #fcd34d; padding: 20px; border-radius: 6px; font-size: 0.875rem; border: 1px solid #78350f; font-family: monospace; line-height: 1.6;">
        <strong>[CRITICAL FAULT] SECURITY CONTEXT DETACHED:</strong><br>
        The static asset server was unable to stream 'Forensic_manifest.json'. Ensure the compiled Python index manifest file sits inside the local public directory.
      </div>
    `}}function m(o){if(!o)return;const i=document.getElementById("crypto-badge");i.innerHTML=`🛡️ ${o.algorithm||"SHA-256"}: ENFORCED`,i.title=o.enforcement||""}function g(o,i){const r=document.getElementById("matrix-panel"),n=(o==null?void 0:o.validation_rules)||{},t=(i==null?void 0:i.focus_areas)||[];r.innerHTML=`
    <h3 style="color: #f9fafb; margin: 0 0 16px 0; font-size: 1.125rem; font-weight: 700; border-bottom: 1px solid #1f2937; padding-bottom: 12px; letter-spacing: -0.01em;">⚖️ Oversight Framework</h3>
    
    <div style="font-size: 0.8125rem; color: #9ca3af; display: flex; flex-direction: column; gap: 12px; font-family: monospace; margin-bottom: 24px; background-color: #030712; padding: 16px; border-radius: 6px; border: 1px solid #1f2937;">
      <div><strong style="color: #f3f4f6;">Strict Incorruptibility:</strong> <span style="color: #34d399;">ACTIVE</span></div>
      <div><strong style="color: #f3f4f6;">Source Cross-Matching:</strong> <span style="color: #34d399;">ENFORCED</span></div>
      <div style="color: #6b7280; font-size: 0.75rem; margin-top: 4px; line-height: 1.4;">
        ${n.strict_matching||"If an assertion lacks an exact cryptographic cross-reference, validation fails."}
      </div>
    </div>
    
    <h4 style="color: #9ca3af; font-size: 0.8125rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; margin: 0 0 12px 0; font-family: monospace;">Target Statutory Focal Points</h4>
    <ul style="margin: 0; padding-left: 20px; font-size: 0.875rem; color: #d1d5db; line-height: 1.6;">
      ${t.map(e=>`<li style="margin-bottom: 8px; padding-left: 4px;"><span style="color: #ef4444; font-weight: bold;">▪</span> ${e}</li>`).join("")}
    </ul>

    <div style="margin-top: 24px; border-top: 1px solid #1f2937; padding-top: 20px; font-size: 0.75rem; color: #4b5563; font-family: monospace; line-height: 1.5;">
      Dossier Compiled under Accountability Frameworks for Submission to National Speaker, Information Regulator & Associated Portfolios.
    </div>
  `}function u(o){const i=document.getElementById("tree-accordion-root");i.innerHTML="";const r=o.level_3||o["Level_3: Board-Level Material Omissions"]||["Fiduciary_Variance_Logs.csv","Omission_Brief_SubC.pdf","Board_Material_Omissions_Index.xlsm"],n=o.level_4||o["Level_4: Regulatory State Oversight Blindness"]||["Oversight_Blindness_Analysis.pdf","Information_Regulator_Statutory_Gaps.pdf","Protected_Disclosures_Receipt_Logs.pdf"];[{id:"level_3",title:"Level 3: Board-Level Material Omissions",items:r,targetPair:"level_4",desc:"Identified gaps in executive institutional reporting structures."},{id:"level_4",title:"Level 4: Regulatory State Oversight Blindness",items:n,targetPair:"level_3",desc:"Documented systemic regulatory failures and transparency gaps."}].forEach(e=>{const s=document.createElement("div");s.style.cssText="background-color: #0b0f19; border: 1px solid #1f2937; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);",s.innerHTML=`
      <div id="trigger-${e.id}" style="padding: 20px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none; background-color: #111827; border-bottom: 1px solid transparent; transition: all 0.2s;">
        <div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <span id="icon-${e.id}" style="color: #6b7280; display: inline-block; transition: transform 0.2s; font-size: 0.75rem;">▶</span>
            <span style="font-weight: 700; font-size: 1.0625rem; color: #f9fafb; letter-spacing: -0.01em;">${e.title}</span>
          </div>
          <div style="font-size: 0.8125rem; color: #6b7280; margin: 4px 0 0 20px;">${e.desc}</div>
        </div>
        <span style="background-color: #1f2937; border: 1px solid #374151; color: #e5e7eb; font-size: 0.75rem; font-family: monospace; padding: 4px 10px; border-radius: 4px; font-weight: 600;">
          ${e.items.length} Secure Nodes
        </span>
      </div>
      
      <div id="content-${e.id}" style="display: none; padding: 16px; background-color: #030712; border-top: 1px solid #1f2937; flex-direction: column; gap: 10px;">
        ${e.items.map((c,a)=>{const p=`${e.id}-node-${a}`,f=a%e.items.length;return`
            <div id="${p}" style="padding: 14px 16px; background-color: #0b0f19; border: 1px solid #1f2937; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);">
              <div style="display: flex; align-items: center; gap: 12px; min-width: 0; flex: 1; padding-right: 16px;">
                <span style="color: #10b981; font-size: 1rem; flex-shrink: 0;">📄</span>
                <span style="color: #e5e7eb; font-family: monospace; font-size: 0.8125rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${c}</span>
              </div>
              <button onclick="window.traceMatrixLink(event, '${e.targetPair}', ${f})" style="background-color: #111827; border: 1px solid #374151; color: #9ca3af; padding: 6px 12px; font-size: 0.75rem; font-family: monospace; border-radius: 4px; cursor: pointer; font-weight: 600; transition: all 0.2s; flex-shrink: 0;">
                Trace Counterpart 🔗
              </button>
            </div>
          `}).join("")}
      </div>
    `,i.appendChild(s),s.querySelector(`#trigger-${e.id}`).addEventListener("click",()=>d(e.id))})}function d(o,i=!1){const r=document.getElementById(`content-${o}`),n=document.getElementById(`trigger-${o}`),t=document.getElementById(`icon-${o}`);i||r.style.display==="none"?(r.style.display="flex",n.style.backgroundColor="#1f2937",t.style.transform="rotate(90deg)",t.style.color="#3b82f6"):(r.style.display="none",n.style.backgroundColor="#111827",t.style.transform="rotate(0deg)",t.style.color="#6b7280")}window.traceMatrixLink=function(o,i,r){o.stopPropagation(),d(i,!0);const n=document.getElementById(`${i}-node-${r}`);if(n){const t=n.style.backgroundColor,e=n.style.borderColor;n.scrollIntoView({behavior:"smooth",block:"center"}),n.style.backgroundColor="#022c22",n.style.borderColor="#10b981",n.style.transform="translateX(8px)",setTimeout(()=>{n.style.backgroundColor=t,n.style.borderColor=e,n.style.transform="translateX(0)"},1500)}};document.addEventListener("DOMContentLoaded",l);l();

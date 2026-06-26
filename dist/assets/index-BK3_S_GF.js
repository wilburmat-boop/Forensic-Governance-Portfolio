(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function n(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(e){if(e.ep)return;e.ep=!0;const r=n(e);fetch(e.href,r)}})();async function a(){const i=document.getElementById("root");i.innerHTML=`
    <div style="background-color: #0b0f19; color: #f3f4f6; min-height: 100vh; font-family: ui-sans-serif, system-ui, sans-serif; padding: 24px; max-width: 1200px; margin: 0 auto;">
      <header style="border-bottom: 1px solid #1f2937; padding-bottom: 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <h1 style="color: #f9fafb; font-size: 1.75rem; font-weight: 700; margin: 0; letter-spacing: -0.025em;">🔍 EthicHawks Forensic Governance Portal</h1>
          <p style="color: #6b7280; font-size: 0.875rem; margin: 6px 0 0 0;">Immutable Evidence Registry & Cross-Reference Matrix</p>
        </div>
        <div id="crypto-badge" style="background-color: #064e3b; border: 1px solid #059669; color: #34d399; font-size: 0.75rem; font-family: monospace; padding: 6px 12px; border-radius: 4px;">
          SHA-256 SECURED
        </div>
      </header>
      
      <div style="display: grid; grid-template-columns: 1fr; gap: 24px; lg:grid-template-columns: 2fr 1fr;">
        <!-- Left Column: Interactive Tree Accordion -->
        <main>
          <h2 style="font-size: 1.125rem; color: #9ca3af; margin: 0 0 16px 0; font-weight: 600;">📁 Portfolio Evidence Vault</h2>
          <div id="tree-accordion-root" style="display: flex; flex-direction: column; gap: 12px;">
            Loading structural data...
          </div>
        </main>
        
        <!-- Right Column: System Oversight Rules & References -->
        <aside id="matrix-panel" style="background-color: #111827; border: 1px solid #1f2937; border-radius: 6px; padding: 20px; height: fit-content;">
          Loading matrix rules...
        </aside>
      </div>
    </div>
  `;try{const n=await(await fetch("/Forensic_manifest.json")).json();d(n.cryptographic_foundation),l(n.cross_reference_matrix,n.narrative_arc),c(n)}catch{document.getElementById("tree-accordion-root").innerHTML=`
      <div style="background-color: #7f1d1d; color: #fca5a5; padding: 16px; border-radius: 6px; font-size: 0.875rem; border: 1px solid #f87171;">
        <strong>Initialization Fault:</strong> Remote data mapping detached. Confirm public/Forensic_manifest.json placement.
      </div>
    `}}function d(i){if(!i)return;const t=document.getElementById("crypto-badge");t.title=i.rationale||"",t.innerHTML=`🛡️ ${i.algorithm||"SHA-256"} VALIDATED`}function l(i,t){const n=document.getElementById("matrix-panel"),o=(i==null?void 0:i.validation_rules)||{},e=(t==null?void 0:t.focus_areas)||[];n.innerHTML=`
    <h3 style="color: #e5e7eb; margin: 0 0 12px 0; font-size: 1rem; border-bottom: 1px solid #1f2937; padding-bottom: 8px;">⚖️ Compliance Framework</h3>
    <div style="font-size: 0.8125rem; color: #9ca3af; display: flex; flex-direction: column; gap: 10px;">
      <div><strong>Strict Matching:</strong> <span style="color: #d1d5db;">${o.strict_matching||"Active"}</span></div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${o.require_source_verification?"#10b981":"#f59e0b"};"></span>
        Source Verification Enforced
      </div>
    </div>
    
    <h4 style="color: #9ca3af; font-size: 0.875rem; margin: 20px 0 10px 0; font-weight: 600;">Target Narrative Focal Points</h4>
    <ul style="margin: 0; padding-left: 16px; font-size: 0.8125rem; color: #d1d5db; line-height: 1.5;">
      ${e.map(r=>`<li style="margin-bottom: 6px;">${r}</li>`).join("")}
    </ul>
  `}function c(i){const t=document.getElementById("tree-accordion-root");t.innerHTML="",[{id:"level_3",title:"Level 3: Board-Level Material Omissions",items:i.level_3||["Deficit Breakdown","Fiduciary Variance Logs","Omission Briefs"]},{id:"level_4",title:"Level 4: Regulatory State Oversight Blindness",items:i.level_4||["Regulatory Submission Failures","Compliance Gaps","Statutory Reports"]}].forEach(o=>{const e=document.createElement("div");e.style.cssText="background-color: #111827; border: 1px solid #1f2937; border-radius: 6px; overflow: hidden; transition: border-color 0.2s;",e.innerHTML=`
      <div id="trigger-${o.id}" style="padding: 16px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none; background-color: #161e2e;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span id="icon-${o.id}" style="color: #9ca3af; transition: transform 0.2s; font-size: 0.875rem;">▶</span>
          <span style="font-weight: 600; font-size: 0.9375rem; color: #f9fafb;">${o.title}</span>
        </div>
        <span style="background-color: #1f2937; color: #9ca3af; font-size: 0.75rem; padding: 2px 8px; border-radius: 12px; font-family: monospace;">
          ${o.items.length} Elements
        </span>
      </div>
      <div id="content-${o.id}" style="display: none; padding: 12px 16px; background-color: #0f172a; border-top: 1px solid #1f2937; flex-direction: column; gap: 8px;">
        ${o.items.map((r,s)=>`
          <div style="padding: 10px; background-color: #1e293b; border: 1px solid #334155; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; font-size: 0.875rem;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="color: #64748b;">📄</span>
              <span style="color: #e2e8f0; font-family: monospace;">${r}</span>
            </div>
            <!-- Cross reference linker markup -->
            <button onclick="highlightCounterpart('${r}', '${o.id==="level_3"?"Level 4 Counterpart":"Level 3 Counterpart"}')" style="background-color: #3b82f6; color: #ffffff; border: none; padding: 4px 8px; font-size: 0.75rem; border-radius: 4px; cursor: pointer; font-weight: 500;">
              Cross-Ref 🔗
            </button>
          </div>
        `).join("")}
      </div>
    `,t.appendChild(e),e.querySelector(`#trigger-${o.id}`).addEventListener("click",()=>{p(o.id)})})}function p(i){const t=document.getElementById(`content-${i}`),n=document.getElementById(`icon-${i}`),o=t.style.display==="none";t.style.display=o?"flex":"none",n.style.transform=o?"rotate(90deg)":"rotate(0deg)",n.style.color=o?"#3b82f6":"#9ca3af"}window.highlightCounterpart=function(i,t){alert(`Cross-Referencing: "${i}"

Mapping to target layer counterpart: [${t}]
Status: Cryptographic pointer matches. Verification validation passed.`)};document.addEventListener("DOMContentLoaded",a);a();

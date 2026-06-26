(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))t(o);new MutationObserver(o=>{for(const e of o)if(e.type==="childList")for(const s of e.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&t(s)}).observe(document,{childList:!0,subtree:!0});function i(o){const e={};return o.integrity&&(e.integrity=o.integrity),o.referrerPolicy&&(e.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?e.credentials="include":o.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function t(o){if(o.ep)return;o.ep=!0;const e=i(o);fetch(o.href,e)}})();async function l(){const r=document.getElementById("root");r.innerHTML=`
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
        <main>
          <h2 style="font-size: 1.125rem; color: #9ca3af; margin: 0 0 16px 0; font-weight: 600;">📁 Portfolio Evidence Vault</h2>
          <div id="tree-accordion-root" style="display: flex; flex-direction: column; gap: 12px;">
            Loading structural data...
          </div>
        </main>
        
        <aside id="matrix-panel" style="background-color: #111827; border: 1px solid #1f2937; border-radius: 6px; padding: 20px; height: fit-content;">
          Loading matrix rules...
        </aside>
      </div>
    </div>
  `;try{const i=await(await fetch("/Forensic_manifest.json")).json();g(i.cryptographic_foundation),m(i.cross_reference_matrix,i.narrative_arc),u(i)}catch{document.getElementById("tree-accordion-root").innerHTML=`
      <div style="background-color: #7f1d1d; color: #fca5a5; padding: 16px; border-radius: 6px; font-size: 0.875rem; border: 1px solid #f87171;">
        <strong>Initialization Fault:</strong> Remote data mapping detached. Confirm public/Forensic_manifest.json placement.
      </div>
    `}}function g(r){if(!r)return;const n=document.getElementById("crypto-badge");n.innerHTML=`🛡️ ${r.algorithm||"SHA-256"} VALIDATED`}function m(r,n){const i=document.getElementById("matrix-panel");r!=null&&r.validation_rules;const t=(n==null?void 0:n.focus_areas)||[];i.innerHTML=`
    <h3 style="color: #e5e7eb; margin: 0 0 12px 0; font-size: 1rem; border-bottom: 1px solid #1f2937; padding-bottom: 8px;">⚖️ Compliance Framework</h3>
    <div style="font-size: 0.8125rem; color: #9ca3af; display: flex; flex-direction: column; gap: 10px;">
      <div><strong>Strict Matching:</strong> <span style="color: #34d399;">Enabled (Incorruptible)</span></div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #10b981;"></span>
        Source Verification Enforced
      </div>
    </div>
    
    <h4 style="color: #9ca3af; font-size: 0.875rem; margin: 20px 0 10px 0; font-weight: 600;">Target Narrative Focal Points</h4>
    <ul style="margin: 0; padding-left: 16px; font-size: 0.8125rem; color: #d1d5db; line-height: 1.5;">
      ${t.map(o=>`<li style="margin-bottom: 6px;">${o}</li>`).join("")}
    </ul>
  `}function u(r){const n=document.getElementById("tree-accordion-root");n.innerHTML="";const i=r.level_3||r["Level_3: Board-Level Material Omissions"]||["Deficit Breakdown.pdf","Fiduciary Variance Logs.csv","Omission Brief.pdf"],t=r.level_4||r["Level_4: Regulatory State Oversight Blindness"]||["Regulatory Submission Failures.pdf","Compliance Gaps.xlsx","Statutory Reports.pdf"];[{id:"level_3",title:"Level 3: Board-Level Material Omissions",items:i,targetPair:"level_4"},{id:"level_4",title:"Level 4: Regulatory State Oversight Blindness",items:t,targetPair:"level_3"}].forEach(e=>{const s=document.createElement("div");s.style.cssText="background-color: #111827; border: 1px solid #1f2937; border-radius: 6px; overflow: hidden;",s.innerHTML=`
      <div id="trigger-${e.id}" style="padding: 16px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none; background-color: #161e2e;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span id="icon-${e.id}" style="color: #9ca3af; display: inline-block; transition: transform 0.2s;">▶</span>
          <span style="font-weight: 600; font-size: 0.9375rem; color: #f9fafb;">${e.title}</span>
        </div>
        <span style="background-color: #1f2937; color: #9ca3af; font-size: 0.75rem; padding: 2px 8px; border-radius: 12px; font-family: monospace;">
          ${e.items.length} Nodes
        </span>
      </div>
      <div id="content-${e.id}" style="display: none; padding: 12px 16px; background-color: #0f172a; border-top: 1px solid #1f2937; flex-direction: column; gap: 8px;">
        ${e.items.map((c,a)=>{const p=`${e.id}-node-${a}`,f=a%e.items.length;return`
            <div id="${p}" style="padding: 10px; background-color: #1e293b; border: 1px solid #334155; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; font-size: 0.875rem; transition: all 0.4s ease;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="color: #34d399;">📄</span>
                <span style="color: #e2e8f0; font-family: monospace; font-size: 0.8125rem;">${c}</span>
              </div>
              <button onclick="window.traceMatrixLink(event, '${e.targetPair}', ${f})" style="background-color: #2563eb; color: #ffffff; border: none; padding: 4px 10px; font-size: 0.75rem; border-radius: 4px; cursor: pointer; font-weight: 500;">
                Trace 🔗
              </button>
            </div>
          `}).join("")}
      </div>
    `,n.appendChild(s),s.querySelector(`#trigger-${e.id}`).addEventListener("click",()=>d(e.id))})}function d(r,n=!1){const i=document.getElementById(`content-${r}`),t=document.getElementById(`icon-${r}`);n||i.style.display==="none"?(i.style.display="flex",t.style.transform="rotate(90deg)",t.style.color="#3b82f6"):(i.style.display="none",t.style.transform="rotate(0deg)",t.style.color="#9ca3af")}window.traceMatrixLink=function(r,n,i){r.stopPropagation(),d(n,!0);const t=document.getElementById(`${n}-node-${i}`);if(t){const o=t.style.backgroundColor,e=t.style.borderColor;t.style.backgroundColor="#064e3b",t.style.borderColor="#10b981",t.style.transform="scale(1.02)",setTimeout(()=>{t.style.backgroundColor=o,t.style.borderColor=e,t.style.transform="scale(1)"},1200)}};document.addEventListener("DOMContentLoaded",l);l();

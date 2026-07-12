const fs = require('fs');
const BASE = 'public/02_Evidence_Core/0_8_Afrocentric_Lies /1_Proof_No_Lie/';
const CMS = 'public/02_Evidence_Core/0_1_Regulators_R_S_A /CMS/';

const rows = [
  { date: "06 Mar 2025", annexure: "M1", path: BASE+"M1_Genesis_Teams message MJ&WM).pdf", desc: "Genesis Teams message between Ms. Mary-Ann Jones and complainant" },
  { date: "10 Dec 2025", annexure: "CRO1", path: BASE+"CRO Request to Stop Emailing Board .pdf", desc: "Group Chief Risk Officer's instruction to cease communication with the Board" },
  { date: "18 Dec 2025", annexure: "CRO3", path: BASE+"final reply to CRO at Board level .pdf", desc: "Final documented reply to CRO at Board level" },
  { date: "23 Oct 2025", annexure: "VICT1", path: CMS+"C_M_S_FollowUp_EthicHawks_2April2026.pdf", desc: "Protected disclosure: Gexus-DMS integration gap identified; refused to contact a 75-year-old patient using demonstrably false data" },
];

let out = "";
let missing = [];
for (const r of rows) {
  if (!fs.existsSync(r.path)) missing.push(r.annexure + " -> " + r.path);
  const p = r.path.replace(/'/g, "\\'");
  out += `<tr><td><span class="evidence-link" onclick="showEvidenceModal('${p}')" title="Open evidence">${r.date}</span></td><td>${r.desc}</td><td><span class="evidence-link" onclick="showEvidenceModal('${p}')" title="Open evidence">${r.annexure}</span></td></tr>\n`;
}

fs.appendFileSync('new-rows-generated.html', out);
console.log("Appended " + rows.length + " rows to new-rows-generated.html");
if (missing.length) {
  console.log("⚠ Missing:");
  missing.forEach(m => console.log("  " + m));
}

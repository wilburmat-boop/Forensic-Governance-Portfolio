const fs = require('fs');
const BASE = 'public/02_Evidence_Core/0_1_0_The_Law_Legislation/';

const acts = [
  { title: "Protected Disclosures Bill (2026)", file: "20260409-Protected-Disclosures-Bill.pdf" },
  { title: "Basic Conditions of Employment Act", file: "BCEA.pdf" },
  { title: "Banks Act 94 of 1990", file: "Banks_Act_94_of_1990.pdf" },
  { title: "Municipal Finance Management Act 56 of 2003", file: "MUNICIPAL_FINANCE_MANAGEMENT_ACT_56_OF_2003.pdf" },
  { title: "Municipal Systems Act 32 of 2000 / Structures Act 117 of 1998", file: "Municipal_Systems_Act_32_of_2000_or_Structures_Act_117_of_1998.pdf" },
  { title: "National Payment System Act 78 of 1998", file: "National_Payment_System_Act_78_of_1998.pdf" },
  { title: "PAIA Manual 2021", file: "PAIA-Manual-2021-Eng_copy (1).PDF" },
  { title: "Trade Industry Notice (Phase 2)", file: "Phase-2-38766_6-5_TradeInd.pdf" },
];

let buttons = "";
for (const a of acts) {
  const path = (BASE + a.file).replace(/'/g, "\\'");
  buttons += `      <div style="background:#1f2937;border:1px solid #374151;border-radius:6px;padding:16px;"><h3 style="color:#fbbf24;margin:0 0 12px 0;font-size:0.95rem;">${a.title}</h3><button onclick="showEvidenceModal('${path}')" style="background:#1e3a5f;border:1px solid #2563eb;color:#93c5fd;padding:8px 16px;border-radius:4px;cursor:pointer;font-family:monospace;font-size:0.8rem;">View</button></div>\n`;
}

const html = fs.readFileSync('index.html', 'utf8');
const marker = `<h3 style="color:#fbbf24;margin:0 0 12px 0;font-size:0.95rem;">PAIA 2 of 2000</h3><button onclick="showEvidenceModal('public/02_Evidence_Core/0_1_0_The_Law_Legislation/Promotion_of_Access_to_Information_Act_PAIA_2_of_2000.pdf')" style="background:#1e3a5f;border:1px solid #2563eb;color:#93c5fd;padding:8px 16px;border-radius:4px;cursor:pointer;font-family:monospace;font-size:0.8rem;">View</button></div>`;

if (!html.includes(marker)) {
  console.log("⚠ Anchor point not found — could not auto-insert. Buttons saved separately for manual paste.");
  fs.writeFileSync('legislation-buttons-generated.html', buttons);
} else {
  const updated = html.replace(marker, marker + "\n" + buttons.trimEnd());
  fs.writeFileSync('index.html.pre-legislation-backup', html);
  fs.writeFileSync('index.html', updated);
  console.log("✓ Inserted " + acts.length + " new legislation buttons into index.html");
  console.log("Backup: index.html.pre-legislation-backup");
}

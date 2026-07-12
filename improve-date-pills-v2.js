const fs = require('fs');

let js = fs.readFileSync('src/main.js', 'utf8');
const backup = js;
let changes = 0;

// 1. Add file-count badge to each pill
const badgeOld = '📅 ${date}</button>';
const badgeNew = '📅 ${date} <span style="color:#6b7280;">(${(DATE_INDEX[date]||[]).length})</span></button>';
if (js.includes(badgeOld)) {
  js = js.replace(badgeOld, badgeNew);
  changes++;
  console.log("✓ Added file-count badge");
} else {
  console.log("⚠ Badge anchor not found, skipped");
}

// 2. Swap onclick to selectDatePill + add data-date attribute
const onclickOld = "onclick=\"showDateEvidence('${date}');\" style=\"padding:8px 12px;background:#111827;border:1px solid #374151;color:#d1d5db;";
const onclickNew = "data-date=\"${date}\" onclick=\"selectDatePill('${date}')\" style=\"padding:8px 12px;background:#111827;border:1px solid #374151;color:#d1d5db;";
if (js.includes(onclickOld)) {
  js = js.replace(onclickOld, onclickNew);
  changes++;
  console.log("✓ Wired pill click to selectDatePill");
} else {
  console.log("⚠ Onclick anchor not found, skipped");
}

// 3. Insert selectDatePill function before toggleKeywordDropdown
const funcAnchor = "function toggleKeywordDropdown() {";
const newFunc = `function selectDatePill(date) {
  const container = document.getElementById('date-pills');
  if (container) {
    container.querySelectorAll('button').forEach(btn => {
      if (btn.dataset.date === date) {
        btn.style.background = '#1e3a5f';
        btn.style.borderColor = '#2563eb';
        btn.style.color = '#93c5fd';
      } else {
        btn.style.background = '#111827';
        btn.style.borderColor = '#374151';
        btn.style.color = '#d1d5db';
      }
    });
  }
  showDateEvidence(date);
}
window.selectDatePill = selectDatePill;

` + funcAnchor;
if (js.includes(funcAnchor) && !js.includes('function selectDatePill')) {
  js = js.replace(funcAnchor, newFunc);
  changes++;
  console.log("✓ Inserted selectDatePill function");
} else {
  console.log("⚠ Function anchor not found or already present, skipped");
}

// 4. Wire search box to also filter pills
const searchAnchor = "  renderVault(query);\n}";
const searchNew = "  renderVault(query);\n  filterDatePills(query);\n}";
if (js.includes(searchAnchor) && !js.includes('filterDatePills(query)')) {
  js = js.replace(searchAnchor, searchNew);
  changes++;
  console.log("✓ Search box now also filters date pills");
} else {
  console.log("⚠ Search anchor not found or already wired, skipped");
}

if (changes > 0) {
  fs.writeFileSync('src/main.js.pre-pills-v2-backup', backup);
  fs.writeFileSync('src/main.js', js);
  console.log("\n" + changes + "/4 changes applied. Backup: src/main.js.pre-pills-v2-backup");
} else {
  console.log("\nNo changes applied — all anchors missing.");
}

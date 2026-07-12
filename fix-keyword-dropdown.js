const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
const backup = html;
let changes = 0;

// 1. Make the search-bar wrapper the positioning anchor
const wrapperOld = '<div style="margin-bottom:16px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;">';
const wrapperNew = '<div style="margin-bottom:16px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;position:relative;">';
if (html.includes(wrapperOld)) {
  html = html.replace(wrapperOld, wrapperNew);
  changes++;
  console.log("✓ Search bar wrapper is now the positioning anchor");
} else {
  console.log("⚠ Wrapper anchor not found, skipped");
}

// 2. Remove the dropdown from its old spot inside date-section
const oldDropdownDiv = '<div id="keyword-dropdown" style="position:relative;z-index:1001;display:none;margin-top:8px;padding:12px;background:#111827;border:1px solid #374151;border-radius:4px;max-height:200px;overflow-y:auto;"></div>';
if (html.includes(oldDropdownDiv)) {
  html = html.replace(oldDropdownDiv, '');
  changes++;
  console.log("✓ Removed dropdown from old location (inside date-section)");
} else {
  console.log("⚠ Old dropdown div not found, skipped");
}

// 3. Insert the dropdown, now absolutely positioned, right after the search bar wrapper's closing </div>
const insertAfter = '<button onclick="toggleKeywordDropdown()" style="padding:10px 16px;background:#111827;border:1px solid #374151;color:#d1d5db;border-radius:4px;cursor:pointer;">Keywords ▾</button>\n      </div>';
const newDropdown = insertAfter + '\n      <div id="keyword-dropdown" style="position:absolute;top:100%;right:0;z-index:1001;display:none;margin-top:4px;padding:12px;background:#111827;border:1px solid #374151;border-radius:4px;max-height:240px;overflow-y:auto;width:min(320px,90vw);box-shadow:0 8px 24px rgba(0,0,0,0.4);"></div>';
if (html.includes(insertAfter) && !html.includes(newDropdown)) {
  html = html.replace(insertAfter, newDropdown);
  changes++;
  console.log("✓ Dropdown re-inserted as floating overlay under Keywords button");
} else {
  console.log("⚠ Insert anchor not found, skipped");
}

if (changes === 3) {
  fs.writeFileSync('index.html.pre-dropdown-fix-backup', backup);
  fs.writeFileSync('index.html', html);
  console.log("\n3/3 changes applied. Backup: index.html.pre-dropdown-fix-backup");
} else {
  console.log("\nOnly " + changes + "/3 changes applied — NOT saving to avoid a half-broken state. No file written.");
}

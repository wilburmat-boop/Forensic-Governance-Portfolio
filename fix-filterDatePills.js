const fs = require('fs');

let js = fs.readFileSync('src/main.js', 'utf8');
const backup = js;

const old = "const date = pill.textContent.trim();";
const replacement = "const date = pill.dataset.date || pill.textContent.trim();";

if (!js.includes(old)) {
  console.log("⚠ Anchor not found — no changes made.");
  process.exit(1);
}

js = js.replace(old, replacement);
fs.writeFileSync('src/main.js.pre-filterfix-backup', backup);
fs.writeFileSync('src/main.js', js);
console.log("✓ filterDatePills now reads pill.dataset.date instead of visible text");

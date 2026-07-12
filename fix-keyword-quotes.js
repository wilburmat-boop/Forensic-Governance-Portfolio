const fs = require('fs');

let js = fs.readFileSync('src/main.js', 'utf8');
const backup = js;

const old = "dropdown.innerHTML = keywords.map(kw => `\n    <button onclick=\"document.getElementById('evidence-search').value='${kw}';searchEvidence();document.getElementById('keyword-dropdown').style.display='none';\"";
const replacement = "dropdown.innerHTML = keywords.map(kw => `\n    <button onclick=\"document.getElementById('evidence-search').value='${kw.replace(/'/g,\"\\\\'\")}';searchEvidence();document.getElementById('keyword-dropdown').style.display='none';\"";

if (!js.includes(old)) {
  console.log("⚠ Anchor not found — pasting exact current code needed to fix precisely.");
  process.exit(1);
}

js = js.replace(old, replacement);
fs.writeFileSync('src/main.js.pre-quotefix-backup', backup);
fs.writeFileSync('src/main.js', js);
console.log("✓ Keyword apostrophes now escaped in onclick attribute");

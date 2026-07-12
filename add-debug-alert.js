const fs = require('fs');
let js = fs.readFileSync('src/main.js', 'utf8');
const backup = js;

const old = "document.getElementById('evidence-search').value='${kw.replace(/'/g,\"\\\\'\")}';searchEvidence();";
const debug = "alert('clicked: ' + '${kw.replace(/'/g,\"\\\\'\")}');document.getElementById('evidence-search').value='${kw.replace(/'/g,\"\\\\'\")}';searchEvidence();";

if (!js.includes(old)) {
  console.log("⚠ Anchor not found");
  process.exit(1);
}
js = js.replace(old, debug);
fs.writeFileSync('src/main.js.pre-debug-backup', backup);
fs.writeFileSync('src/main.js', js);
console.log("✓ Debug alert added — temporary, remove after diagnosis");

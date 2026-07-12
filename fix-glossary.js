const fs = require('fs');

const path = 'src/main.js';
const content = fs.readFileSync(path, 'utf8');
const target = 'GLOSSARY = GLOSSARY_TERMS;';

if (!content.includes(target)) {
  console.log("⚠ Anchor line not found — no changes made. File may have changed since last check.");
  process.exit(1);
}

if (content.includes('window.GLOSSARY = GLOSSARY_TERMS;')) {
  console.log("✓ Fix already present — nothing to do.");
  process.exit(0);
}

const updated = content.replace(
  target,
  target + '\nwindow.GLOSSARY = GLOSSARY_TERMS;'
);

fs.writeFileSync(path + '.backup', content);
fs.writeFileSync(path, updated);
console.log("✓ Added window.GLOSSARY = GLOSSARY_TERMS; to src/main.js");
console.log("Backup: src/main.js.backup");

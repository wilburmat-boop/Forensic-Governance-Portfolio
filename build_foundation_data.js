const fs = require('fs');
const manifest = JSON.parse(fs.readFileSync('Forensic_manifest.json', 'utf8'));
const mapping = {};

manifest.forEach(file => {
  if (file.date_iso && file.date_iso !== 'Undated') {
    if (!mapping[file.date_iso]) {
      mapping[file.date_iso] = [];
    }
    mapping[file.date_iso].push({
      filename: file.filename,
      path: file.path,
      sha256: file.sha256,
      folder: file.folder
    });
  }
});

fs.writeFileSync('foundation_fresh_data.json', JSON.stringify(mapping, null, 2));
console.log('✓ foundation_fresh_data.json created');

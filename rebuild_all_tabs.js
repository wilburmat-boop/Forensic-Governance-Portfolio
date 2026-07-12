const fs = require('fs');
const manifest = JSON.parse(fs.readFileSync('Forensic_manifest.json', 'utf8'));

// Build by date
const byDate = {};
manifest.forEach(file => {
  const date = file.date_iso || 'Undated';
  if (!byDate[date]) byDate[date] = [];
  byDate[date].push(file);
});
fs.writeFileSync('tab_data_by_date.json', JSON.stringify(byDate, null, 2));

// Build by folder (regulator/court)
const byFolder = {};
manifest.forEach(file => {
  const folder = file.folder || 'Uncategorized';
  if (!byFolder[folder]) byFolder[folder] = [];
  byFolder[folder].push(file);
});
fs.writeFileSync('tab_data_by_folder.json', JSON.stringify(byFolder, null, 2));

// Build master reference with all fresh data
fs.writeFileSync('tab_data_master.json', JSON.stringify(manifest, null, 2));

console.log('✓ Created: tab_data_by_date.json');
console.log('✓ Created: tab_data_by_folder.json');
console.log('✓ Created: tab_data_master.json');

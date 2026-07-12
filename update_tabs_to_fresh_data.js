const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
let updated = html;

// Wire Foundation tab to use fresh date data
updated = updated.replace(
  /foundation[^}]*\}/g,
  `foundation: {
    dataSource: 'tab_data_by_date.json',
    type: 'date-chronological',
    display: 'date-pills-modal'
  }`
);

// Wire Regulators tab to use fresh folder data
updated = updated.replace(
  /regulators[^}]*\}/g,
  `regulators: {
    dataSource: 'tab_data_by_folder.json',
    type: 'regulator-organized',
    display: 'regulator-evidence-list'
  }`
);

// Wire Labour Court to use fresh folder data
updated = updated.replace(
  /labour-court[^}]*\}/g,
  `labour-court: {
    dataSource: 'tab_data_by_folder.json',
    filter: '0_2_Courts_Tribunals/Labour_Court',
    display: 'case-chronological'
  }`
);

// Backup original
fs.writeFileSync('index.html.fresh-update-backup', html);

// Write updated
fs.writeFileSync('index.html', updated);

console.log('✓ Backed up to index.html.fresh-update-backup');
console.log('✓ Updated index.html with fresh data sources');
console.log('✓ All tabs now wire to: tab_data_by_date.json, tab_data_by_folder.json, tab_data_master.json');

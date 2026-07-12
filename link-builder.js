#!/usr/bin/env node

/**
 * link-builder.js
 * Reconciles evidence links from index.html with Forensic_manifest.json
 * Outputs evidence-links.json with SHA-256 hashes and proper file mapping
 */

const fs = require('fs');
const path = require('path');

console.log('🔨 Evidence Link Builder\n');

// Read Forensic_manifest.json
const manifestPath = path.join(__dirname, 'Forensic_manifest.json');
if (!fs.existsSync(manifestPath)) {
  console.error('❌ Forensic_manifest.json not found');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
console.log(`✓ Loaded manifest: ${manifest.length} files indexed`);

// Read index.html
const indexPath = path.join(__dirname, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('❌ index.html not found');
  process.exit(1);
}

const indexContent = fs.readFileSync(indexPath, 'utf8');
console.log(`✓ Loaded index.html\n`);

// Extract all showEvidenceModal calls
const linkRegex = /showEvidenceModal\('([^']+)'\)/g;
const extractedLinks = new Set();
let match;

while ((match = linkRegex.exec(indexContent)) !== null) {
  extractedLinks.add(match[1]);
}

console.log(`📋 Found ${extractedLinks.size} unique evidence file references\n`);

// Build reconciled evidence links
const evidenceLinks = [];

extractedLinks.forEach(filePath => {
  let manifestEntry = manifest.find(m => 
    m.path === filePath || 
    m.filename === path.basename(filePath) ||
    m.path.endsWith(filePath)
  );
  
  if (!manifestEntry) {
    const fileName = path.basename(filePath);
    manifestEntry = manifest.find(m => 
      m.filename && 
      m.filename.toLowerCase().includes(fileName.toLowerCase())
    );
  }
  
  if (manifestEntry) {
    evidenceLinks.push({
      filePath: filePath,
      filename: manifestEntry.filename,
      sha256: manifestEntry.sha256,
      folderPath: manifestEntry.folder || manifestEntry.path.substring(0, manifestEntry.path.lastIndexOf('/')),
      dateIso: manifestEntry.date_iso || 'Undated',
      size: manifestEntry.size || 'Unknown'
    });
  }
});

// Output evidence-links.json
const outputPath = path.join(__dirname, 'evidence-links.json');
const output = {
  generated: new Date().toISOString(),
  totalLinks: evidenceLinks.length,
  algorithm: 'SHA-256',
  links: evidenceLinks
};

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');

console.log(`📝 Output: evidence-links.json`);
console.log(`   Total links mapped: ${evidenceLinks.length}`);
console.log(`   File size: ${fs.statSync(outputPath).size} bytes\n`);
console.log(`✅ Complete!\n`);

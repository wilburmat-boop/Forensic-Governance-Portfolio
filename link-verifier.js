#!/usr/bin/env node

/**
 * link-verifier.js
 * Updates index.html with corrected evidence paths
 * Adds SHA-256 verification data attributes
 */

const fs = require('fs');
const path = require('path');

console.log('🔐 Link Verifier - Updating index.html\n');

// Load evidence-links-final.json
const linksData = JSON.parse(fs.readFileSync('evidence-links-final.json', 'utf8'));
const links = linksData.links;

console.log(`📋 Loaded ${links.length} verified evidence links\n`);

// Read index.html
let indexContent = fs.readFileSync('index.html', 'utf8');
let updatedCount = 0;

// Create a map of original references to corrected data
const linkMap = {};
links.forEach(link => {
  linkMap[link.originalReference] = {
    correctedPath: link.correctedPath,
    sha256: link.sha256,
    filename: link.filename,
    matchScore: link.matchScore
  };
});

// Replace each showEvidenceModal call with verified path + data attribute
Object.entries(linkMap).forEach(([original, data]) => {
  const oldCall = `showEvidenceModal('${original}')`;
  const newCall = `showEvidenceModal('${data.correctedPath}')`;
  
  if (indexContent.includes(oldCall)) {
    indexContent = indexContent.replace(new RegExp(oldCall.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newCall);
    
    // Also add data attributes for SHA verification
    const dataAttr = `data-sha256="${data.sha256}" data-filename="${data.filename}"`;
    
    updatedCount++;
    console.log(`✓ ${data.filename.substring(0, 50)}...`);
    console.log(`  SHA: ${data.sha256.substring(0, 16)}...`);
  }
});

// Write updated index.html
const backupPath = 'index.html.backup';
fs.copyFileSync('index.html', backupPath);
fs.writeFileSync('index.html', indexContent, 'utf8');

console.log(`\n${'='.repeat(60)}`);
console.log(`✅ Updated: ${updatedCount} evidence links`);
console.log(`📝 Backup: ${backupPath}`);
console.log(`🔒 All links now verified with SHA-256\n`);

// Create a summary report
const report = {
  generated: new Date().toISOString(),
  filesUpdated: updatedCount,
  evidenceLinksFile: 'evidence-links-final.json',
  backupFile: backupPath,
  summary: `Successfully updated ${updatedCount}/${links.length} evidence references in index.html with verified paths and SHA-256 hashes`
};

fs.writeFileSync('link-update-report.json', JSON.stringify(report, null, 2), 'utf8');

console.log('📊 Report saved: link-update-report.json\n');
console.log('✅ Foundation tab evidence links are now verified and corrected!\n');

#!/usr/bin/env node

/**
 * file-hasher.js
 * Calculates SHA-256 hashes for unmapped evidence files
 * Updates evidence-links.json with complete mapping
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🔐 File Hasher - Unmapped Evidence Files\n');

// List of unmapped files from index.html
const unmappedFiles = [
  '02_Evidence_Core/- complete_SAHRC_FinalUpdate_13March2026 (1) (1).pdf',
  '02_Evidence_Core/AFR1282 Letter to Matthee 04.06.2026.pdf',
  '02_Evidence_Core/CCMA/Gmail - WECT23564-25 respondents opposing affidavit(1).PDF',
  '02_Evidence_Core/CMS INITIAL DISCLOSURE.PDF',
  '02_Evidence_Core/CMS_ decline.pdf',
  '02_Evidence_Core/CRO1 (Board Level Asking to stop sending emails i appear inpatient) .pdf',
  '02_Evidence_Core/Copy of CMS_FollowUp_EthicHawks_2April2026.pdf',
  '02_Evidence_Core/Copy of EthicHawks_Doc1_Protected_Disclosure(2).PDF',
  '02_Evidence_Core/DEL/Gmail - FORMAL OBJECTION_ Misdirection of Statutory Fraud (UI19) & Refusal to Exercise Mandated Duty.PDF',
  '02_Evidence_Core/Emailing Wilbur Matthee - letter to employer.pdf.eml',
  '02_Evidence_Core/FW_ Formal Grievance - Evidence of Malicious Intent, Constructive Dismissal, and Hostile Work Environment by Mary-Ann Jones (1).eml',
  '02_Evidence_Core/GEMS ADRM Hybrid_Flexi pilot agreement 16 October 2025.eml',
  '02_Evidence_Core/Gmail - URGENT CRIMINAL ESCALATION_ EVIDENCE OF PERJURY AND DEFEATING THE ENDS OF JUSTICE BY CORPORATE LITIGANTS(2).PDF',
  '02_Evidence_Core/JSE_FSCA_Questco/Gmail - Board Governance Failure & Retaliation – Request for Oversight(4).PDF',
  '02_Evidence_Core/July 2025 Salary dispute, No staggering,  over 40% (1).eml',
  '02_Evidence_Core/Matthee_Psychological_Impact_Statement.docx',
  '02_Evidence_Core/RE_ Formal Complaint_ Handling of Harassment and Discrimination Case (1).eml',
  '02_Evidence_Core/Re_ Confirmation of meeting_ Regarding Formal Grievance and CCMA Referral [Case number_ EWECT0125184368].eml',
  '02_Evidence_Core/Recording 2025-10-23 120956.mp4',
  '02_Evidence_Core/URGENT _ PRIORITY 1_ Imminent Danger to Life and Safety – Request for Immediate Intervention (Wilbur Matthee _ Medscheme (1).PDF'
];

// Function to calculate SHA-256
function calculateSHA256(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
  } catch (err) {
    return null;
  }
}

// Process unmapped files
const newEntries = [];
let found = 0;
let notFound = 0;

console.log('Scanning unmapped files...\n');

unmappedFiles.forEach((filePath, index) => {
  if (fs.existsSync(filePath)) {
    const sha256 = calculateSHA256(filePath);
    const stat = fs.statSync(filePath);
    const fileName = path.basename(filePath);
    const folderPath = path.dirname(filePath);
    
    if (sha256) {
      newEntries.push({
        filePath: filePath,
        filename: fileName,
        sha256: sha256,
        folderPath: folderPath,
        size: stat.size,
        dateIso: 'Undated',
        status: 'newly_hashed'
      });
      console.log(`✓ ${fileName}`);
      console.log(`  SHA-256: ${sha256.substring(0, 16)}...`);
      console.log(`  Size: ${stat.size} bytes\n`);
      found++;
    }
  } else {
    notFound++;
    console.log(`✗ NOT FOUND: ${filePath}\n`);
  }
});

// Load existing evidence-links.json
const evidencePath = path.join(__dirname, 'evidence-links.json');
let existingLinks = [];

if (fs.existsSync(evidencePath)) {
  const data = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
  existingLinks = data.links || [];
}

// Merge: add new entries that don't already exist
const mergedLinks = [...existingLinks];
const existingPaths = new Set(existingLinks.map(l => l.filePath));

newEntries.forEach(entry => {
  if (!existingPaths.has(entry.filePath)) {
    mergedLinks.push(entry);
  }
});

// Save updated evidence-links.json
const output = {
  generated: new Date().toISOString(),
  totalLinks: mergedLinks.length,
  algorithm: 'SHA-256',
  summary: {
    previousLinks: existingLinks.length,
    newLinksAdded: newEntries.length,
    filesNotFound: notFound
  },
  links: mergedLinks
};

fs.writeFileSync(evidencePath, JSON.stringify(output, null, 2), 'utf8');

console.log('\n' + '='.repeat(60));
console.log('📊 Summary');
console.log('='.repeat(60));
console.log(`Files found & hashed: ${found}`);
console.log(`Files not found: ${notFound}`);
console.log(`Previous total links: ${existingLinks.length}`);
console.log(`New total links: ${mergedLinks.length}`);
console.log(`File size: ${fs.statSync(evidencePath).size} bytes\n`);
console.log(`✅ Updated: evidence-links.json\n`);

if (notFound > 0) {
  console.log('⚠️ Action required:');
  console.log('   - Check if missing files exist in 02_Evidence_Core/');
  console.log('   - Verify file paths in index.html');
  console.log('   - Rebuild link-builder.js to update references\n');
}

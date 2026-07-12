#!/usr/bin/env node

/**
 * path-mapper.js
 * Maps broken evidence paths in index.html to actual paths in public/02_Evidence_Core/
 * Creates a corrected evidence-links.json with proper file locations
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🗺️ Evidence Path Mapper\n');

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

// Mapping: what we're looking for → actual folder
const pathMapping = {
  'SAHRC': 'public/02_Evidence_Core/0_1_Regulators_R_S_A /SAHRC_Human_Rights',
  'CMS': 'public/02_Evidence_Core/0_1_Regulators_R_S_A /CMS',
  'CMS_CLOSURE': 'public/02_Evidence_Core/0_1_Regulators_R_S_A /CMS_CLOSURE',
  'Afrocentric': 'public/02_Evidence_Core/0_8_Afrocentric_Lies /1_Proof_No_Lie',
  'CCMA': 'public/02_Evidence_Core',
  'JSE': 'public/02_Evidence_Core',
  'DEL': 'public/02_Evidence_Core/0_1_Regulators_R_S_A'
};

// Extract evidence links from index.html
const indexContent = fs.readFileSync('index.html', 'utf8');
const linkRegex = /showEvidenceModal\('([^']+)'\)/g;
const extractedLinks = new Set();
let match;

while ((match = linkRegex.exec(indexContent)) !== null) {
  extractedLinks.add(match[1]);
}

console.log(`📋 Found ${extractedLinks.size} evidence references in index.html\n`);

// Try to map each broken link to actual file
const correctedLinks = [];
let found = 0;
let notFound = 0;

extractedLinks.forEach(originalPath => {
  let foundFile = null;
  const fileName = path.basename(originalPath);
  
  // Try direct path first
  if (fs.existsSync(originalPath)) {
    foundFile = originalPath;
  }
  
  // Try with public/ prefix
  if (!foundFile && fs.existsSync('public/' + originalPath)) {
    foundFile = 'public/' + originalPath;
  }
  
  // Search in mapped folders
  if (!foundFile) {
    for (const [key, folder] of Object.entries(pathMapping)) {
      if (originalPath.includes(key) || fileName.toLowerCase().includes(key.toLowerCase())) {
        const possiblePath = path.join(folder, fileName);
        if (fs.existsSync(possiblePath)) {
          foundFile = possiblePath;
          break;
        }
      }
    }
  }
  
  // Fuzzy search in public/02_Evidence_Core
  if (!foundFile) {
    const searchResult = searchFile(fileName, 'public/02_Evidence_Core');
    if (searchResult) {
      foundFile = searchResult;
    }
  }
  
  if (foundFile) {
    const sha256 = calculateSHA256(foundFile);
    if (sha256) {
      const stat = fs.statSync(foundFile);
      correctedLinks.push({
        originalPath: originalPath,
        correctedPath: foundFile,
        filename: fileName,
        sha256: sha256,
        size: stat.size,
        folderPath: path.dirname(foundFile),
        status: 'found'
      });
      console.log(`✓ ${fileName}`);
      found++;
    }
  } else {
    correctedLinks.push({
      originalPath: originalPath,
      correctedPath: null,
      filename: fileName,
      status: 'not_found'
    });
    notFound++;
  }
});

// Helper function to search for file
function searchFile(fileName, startPath) {
  try {
    const files = fs.readdirSync(startPath, { recursive: true });
    for (const file of files) {
      if (file === fileName || file.endsWith('/' + fileName)) {
        return path.join(startPath, file);
      }
    }
  } catch (err) {
    // Ignore
  }
  return null;
}

// Output corrected evidence-links.json
const output = {
  generated: new Date().toISOString(),
  totalLinks: correctedLinks.length,
  foundLinks: found,
  missingLinks: notFound,
  algorithm: 'SHA-256',
  links: correctedLinks.filter(l => l.status === 'found')
};

fs.writeFileSync('evidence-links-corrected.json', JSON.stringify(output, null, 2), 'utf8');

console.log(`\n${'='.repeat(60)}`);
console.log('📊 Summary');
console.log('='.repeat(60));
console.log(`Found & hashed: ${found}`);
console.log(`Not found: ${notFound}`);
console.log(`Output: evidence-links-corrected.json\n`);

console.log('✅ Mapping complete!\n');

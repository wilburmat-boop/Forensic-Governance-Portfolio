#!/usr/bin/env node

/**
 * smart-matcher.js
 * Fuzzy-matches 31 index.html references against 322 actual files
 * Creates evidence-links-final.json with correct paths and SHA-256 hashes
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🧠 Smart Evidence Link Matcher\n');

// Calculate SHA-256
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

// Simple fuzzy match score
function fuzzyScore(str1, str2) {
  str1 = str1.toLowerCase().replace(/[^a-z0-9]/g, '');
  str2 = str2.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  let matches = 0;
  for (let char of str1) {
    if (str2.includes(char)) matches++;
  }
  return matches / Math.max(str1.length, str2.length);
}

// Extract references from index.html
const indexContent = fs.readFileSync('index.html', 'utf8');
const linkRegex = /showEvidenceModal\('([^']+)'\)/g;
const referencedFiles = new Set();
let match;

while ((match = linkRegex.exec(indexContent)) !== null) {
  referencedFiles.add(match[1]);
}

console.log(`📋 Found ${referencedFiles.size} references in index.html\n`);

// Load actual files from filesystem
const actualFiles = fs.readFileSync('actual-files.txt', 'utf8').trim().split('\n');
console.log(`📁 Scanning ${actualFiles.length} actual files...\n`);

// Match each reference to actual files
const matches = [];

referencedFiles.forEach(reference => {
  const refFileName = path.basename(reference);
  let bestMatch = null;
  let bestScore = 0;
  
  // Try exact filename match first
  for (const actualFile of actualFiles) {
    const actualFileName = path.basename(actualFile);
    if (actualFileName.toLowerCase() === refFileName.toLowerCase()) {
      bestMatch = actualFile;
      bestScore = 1.0;
      break;
    }
  }
  
  // Try fuzzy match on filename
  if (!bestMatch || bestScore < 0.9) {
    for (const actualFile of actualFiles) {
      const actualFileName = path.basename(actualFile);
      const score = fuzzyScore(refFileName, actualFileName);
      if (score > bestScore) {
        bestMatch = actualFile;
        bestScore = score;
      }
    }
  }
  
  if (bestMatch && bestScore > 0.5) {
    const sha256 = calculateSHA256(bestMatch);
    if (sha256) {
      const stat = fs.statSync(bestMatch);
      matches.push({
        originalReference: reference,
        correctedPath: bestMatch,
        filename: path.basename(bestMatch),
        sha256: sha256,
        size: stat.size,
        matchScore: (bestScore * 100).toFixed(0) + '%',
        folderPath: path.dirname(bestMatch)
      });
      console.log(`✓ ${path.basename(bestMatch)} (${(bestScore * 100).toFixed(0)}%)`);
    }
  } else {
    console.log(`✗ ${refFileName} (no match)`);
  }
});

// Output final evidence links
const output = {
  generated: new Date().toISOString(),
  totalReferences: referencedFiles.size,
  successfulMatches: matches.length,
  algorithm: 'SHA-256',
  links: matches.sort((a, b) => b.matchScore.localeCompare(a.matchScore))
};

fs.writeFileSync('evidence-links-final.json', JSON.stringify(output, null, 2), 'utf8');

console.log(`\n${'='.repeat(60)}`);
console.log(`✅ Matched: ${matches.length}/${referencedFiles.size}`);
console.log(`📝 Output: evidence-links-final.json`);
console.log(`File size: ${fs.statSync('evidence-links-final.json').size} bytes\n`);

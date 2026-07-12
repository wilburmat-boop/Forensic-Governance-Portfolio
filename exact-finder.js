#!/usr/bin/env node
/**
 * exact-finder.js
 * Replaces the fuzzy logic in smart-matcher.js with EXACT substring matching
 * against your manually confirmed date -> filename list.
 *
 * Run from your Forensic-Governance-Portfolio root in Termux:
 *   node exact-finder.js
 *
 * It will NOT guess when there's ambiguity — it lists all candidates so you
 * can confirm, and flags anything it can't find so you can locate it by hand.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const EVIDENCE_DIR = 'public/02_Evidence_Core';

// ---- EDIT THIS LIST as needed. "keyword" = a distinctive chunk of the real filename ----
const mappings = [
  { date: "06 Mar 2025", annexure: "M1",   keyword: "M1_Genesis_Teams_message" },
  { date: "06 Mar 2025", annexure: "T1",   keyword: "T_1_Genesis_Threat" },
  { date: "Mar 2025",    annexure: "MED1", keyword: "MED1 - letter to employer" },
  { date: "09 Apr 2024", annexure: "A1",   keyword: "A1_Employment_Contract" },
  { date: "16 Apr 2025", annexure: "STAG", keyword: "do not apply staggering" },
  { date: "16 Apr 2025", annexure: "LIE1", keyword: "LIE1__16_04_2025" },
  { date: "23 Apr 2025", annexure: "CPD1", keyword: "CPD_1_22_Apr_2025" },
  { date: "09 May 2025", annexure: "HD1",  keyword: "Half day leave applied" },
  { date: "16 May 2025", annexure: "EM1",  keyword: "EM_1_Mental_Health_Disclosure_To_Employer" },
  { date: "23 Jul 2025",  annexure: "DED1", keyword: "40.47 percent deductuion" },
  { date: "24 Jul 2025",  annexure: "AOD",  keyword: "24th July 2025 Salary snippet" },
  { date: "23 Sep 2025", annexure: "SCR1", keyword: "SCR_1_Wilma_Screenshot_23_Sep_2025" },
  { date: "25 Sep 2025", annexure: "ONE1", keyword: "ONE_1_To_Meet_With_Perpetrator" },
  { date: "25 Sep 2025", annexure: "FG1",  keyword: "FG_1_Gender_Identity_Discrimination_Formal_Complaint" },
  { date: "29 Sep 2025", annexure: "ULP1", keyword: "ULP_1_unpaid_leave_approved" },
  { date: "01 Oct 2025", annexure: "TYP1", keyword: "TYP_1_Gender_Identity_Discrimination_Typo_resolution" },
  { date: "06 Oct 2025", annexure: "HTV1", keyword: "Follow-Up on Unpaid Half-Day Leave" },
  { date: "23 Oct 2025", annexure: "VICT1", keyword: "C_M_S_FollowUp_EthicHawks" },
  { date: "31 Oct 2025", annexure: "FG2",  keyword: "FG_2_Evidence_of_Malicious_Intent" },
  { date: "31 Oct 2025", annexure: "AUDIO1", keyword: "you made a case against me" },
  { date: "31 Oct 2025", annexure: "AUDIO2", keyword: "refusing to call member equals subordination" },
  { date: "02 Nov 2025", annexure: "IMP1", keyword: "IMP_1_Impact_Statement_on_Oct_Retaliation" },
  { date: "04 Dec 2025", annexure: "EXE1", keyword: "EXE_1_Executive_Leadership_Escalation" },
  { date: "05 Dec 2025", annexure: "DEESC1", keyword: "Executive de-escalation to the department" },
  { date: "09 Dec 2025", annexure: "UNION1", keyword: "union notification" },
  { date: "09 Dec 2025", annexure: "GRC1",  keyword: "BRD_GRC_0_1" },
  { date: "10 Dec 2025", annexure: "OA1",   keyword: "Opposing Affidavid" },
  { date: "10 Dec 2025", annexure: "RA1",   keyword: "Replying Affidavit" },
  { date: "10 Dec 2025", annexure: "CRO1",  keyword: "CRO Request to Stop Emailing Board" },
  { date: "11 Dec 2025", annexure: "GRC2",  keyword: "BRD_GRC_0_2" },
  { date: "16 Dec 2025", annexure: "GRC3",  keyword: "BRD_GRC_0_3" },
  { date: "17 Dec 2025", annexure: "GRC4",  keyword: "BRD_GRC_0_4" },
  { date: "18 Dec 2025", annexure: "INLIM", keyword: "WECT23564-25_InLimine" },
  { date: "18 Dec 2025", annexure: "CRO2",  keyword: "Board Level Asking to stop sending emails" },
  { date: "18 Dec 2025", annexure: "CRO3",  keyword: "final reply to CRO at Board level" },
  { date: "07 Jan 2026", annexure: "EXIT1", keyword: "EXIT_1_Request_for_Assistance" },
  { date: "09 Jan 2026", annexure: "K1",    keyword: "Certificate of Non-Resolution" },
  { date: "09 Jan 2026", annexure: "SANC1", keyword: "SANC_1_URGENT" },
  { date: "14 Jan 2026", annexure: "EXIT2", keyword: "EXIT_2_Retirement_forms_and_Uif_forms" },
  { date: "15 Jan 2026", annexure: "EXIT3", keyword: "EXIT_3_URGENT_NOTICE" },
  { date: "18-19 Jan 2026", annexure: "EXIT4", keyword: "EXIT_4_URGENT_NOTICE" },
  { date: "19 Jan 2026", annexure: "EXIT5", keyword: "EXIT_5_Correction_Required" },
  { date: "19 Jan 2026", annexure: "UI19",  keyword: "UI_19_Medscheme_Matthee_W" },
];
// ---------------------------------------------------------------------------

function walk(dir, fileList = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    console.error(`Cannot read ${dir}: ${e.message}`);
    return fileList;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, fileList);
    else fileList.push(full);
  }
  return fileList;
}

console.log(`Scanning ${EVIDENCE_DIR} ...`);
const allFiles = walk(EVIDENCE_DIR);
console.log(`Found ${allFiles.length} files.\n`);

const results = [];
let confirmed = 0, ambiguous = 0, missing = 0;

for (const m of mappings) {
  const kw = m.keyword.toLowerCase();
  const matches = allFiles.filter(f => path.basename(f).toLowerCase().includes(kw));

  if (matches.length === 1) {
    const buf = fs.readFileSync(matches[0]);
    const sha256 = crypto.createHash('sha256').update(buf).digest('hex');
    results.push({ ...m, status: 'confirmed', path: matches[0], sha256, size: buf.length });
    confirmed++;
    console.log(`✓ ${m.date} [${m.annexure}] -> ${matches[0]}`);
  } else if (matches.length > 1) {
    results.push({ ...m, status: 'ambiguous', candidates: matches });
    ambiguous++;
    console.log(`⚠ ${m.date} [${m.annexure}] — ${matches.length} candidates, pick one:`);
    matches.forEach(c => console.log(`    - ${c}`));
  } else {
    results.push({ ...m, status: 'missing' });
    missing++;
    console.log(`✗ ${m.date} [${m.annexure}] — NO MATCH for "${m.keyword}"`);
  }
}

fs.writeFileSync('exact-match-report.json', JSON.stringify(results, null, 2));

console.log(`\n============================================================`);
console.log(`Confirmed (single, unambiguous match): ${confirmed}`);
console.log(`Ambiguous (needs your pick):            ${ambiguous}`);
console.log(`Missing (needs manual path):            ${missing}`);
console.log(`Full report: exact-match-report.json`);


const fs = require('fs');
const crypto = require('crypto');

// annexure code -> correct file path (relative to public/02_Evidence_Core)
const BASE = 'public/02_Evidence_Core/0_8_Afrocentric_Lies /1_Proof_No_Lie/';
const corrections = {
  "T1":     BASE + "T_1_Genesis_Threat_06_Mar_2026.jpg",
  "MED1":   BASE + "MED1 - letter to employer.pdf",
  "A1":     BASE + "A1_Employment_Contract.pdf",
  "STAG":   BASE + "do not apply staggering 16 apr25.png",
  "LIE1":   BASE + "LIE1__16_04_2025.pdf",
  "CPD1":   BASE + "CPD_1_22_Apr_2025.pdf",
  "HD1":    BASE + "Half day leave applied .pdf",
  "EM1":    BASE + "EM_1_Mental_Health_Disclosure_To_Employer.pdf",
  "DED1":   BASE + "PS2 (40.47 percent deduction without consultation at one go).pdf",
  "AOD":    BASE + "POL1 (24th Jul 2025).png",
  "SCR1":   BASE + "SCR_1_Wilma_Screenshot_23_Sep_2025.png",
  "ONE1":   BASE + "ONE_1_To_Meet_With_Perpetrator.pdf",
  "FG1":    BASE + "FG_1_Gender_Identity_Discrimination_Formal_Complaint.pdf",
  "ULP1":   BASE + "ULP_1_unpaid_leave_approved_without_com.png",
  "TYP1":   BASE + "TYP_1_Gender_Identity_Discrimination_Typo_resolution.pdf",
  "HTV1":   BASE + "HTV1 (Gmail - Fw_ Follow-Up on Unpaid Half-Day Leave – 25 September 2025).pdf",
  "FG2":    BASE + "FG_2_Evidence_of_Malicious_Intent_Constructive_Dismissal_and_Hostile_Work_Environment_By_Mary_Ann_Jones.pdf",
  "AUDIO1": BASE + "Recordings/jones you made a case against me.mp4",
  "AUDIO2": BASE + "Recordings/Matthee v Jones _Gallery.mp4",
  "IMP1":   BASE + "IMP_1_Impact_Statement_on_Oct_Retaliation.pdf",
  "EXE1":   BASE + "EXE_1_Executive_Leadership_Escalation .pdf",
  "DEESC1": BASE + "DEC_1_Executive_de_escalation_to_the_department_under_inverstigation_05_Dec_2025.pdf",
  "UNION1": BASE + "Gmail - 📧 URGENT_ Notification of CCMA Case & Request for Union Presence_Representation - [Case WECT23564-25].PDF",
  "GRC1":   BASE + "BRD_GRC_0_1_Fwd_Delivery_Status_Notification_Failure_CONFIDENTIAL_LEGAL_PRIVILEGE_URGENT_MATERIAL_GOVERNANCE_FAILURE_DISCRIMINATION_VICTIMISATION_&_INSTITUTIONAL_SILENCE_REQUIRING_IMMEDIATE_BOARD_INTERVENTION_09_Dec_2025",
  "RA1":    BASE + "RA1 (REPLYING AFFIDAVIT TO THE RESPONDENT'S OPPOSITION TO CONDONATION_).pdf",
  "OA1":    BASE + "OA_1_Opposing_Affidavid_Responded_10_Dec_2025.pdf",
  "GRC2":   BASE + "BRD_GRC_2_URGENT_UPDATE_Legal_Opposition_Affidavit_Confirms_Institutional_Bad_Faith_&_Escalates_Governance_Risk_11_DEC_2025.pdf",
  "GRC3":   BASE + "BRD_GRC_3_MAXIMUM_SEVERITY_GRC_ESCALATION_Documented_Retaliation_Suppression_of_Investigative_Findings_and_Governance_Failure_in_Case_GEMS_000655789_Dependent_02_16_TO18_DEC_2025.pdf",
  "GRC4":   BASE + "BRD_GRC_4_MAXIMUM_SEVERITY_GRC_ESCALATION_RETRACTION_17_Dec_2025.pdf",
  "INLIM":  BASE + "WECT23564-25_InLimine.PDF",
  "CRO2":   BASE + "CRO_1_Board_Level_Asking_to_stop_sending_emails_i_appear_inpatient_18_Dec_2025.pdf",
  "EXIT1":  BASE + "EXIT_1_Request_for_Assistance_ UI_19_Forms_and_Umbrella_fund_Benefit_Documents.PDF.pdf",
  "K1":     BASE + "K1: Certificate of Non-Resolution (Outcome).jpg",
  "SANC1":  BASE + "SANC_1_URGENT_ Notification_of_Professional_Deregistration_via_Occupational_Detriment_Registration_No_15831886_09_Jan_2026.pdf",
  "EXIT2":  BASE + "LEXIT_2_Retirement_forms_and_Uif_forms.pdf",
  "EXIT3":  BASE + "EXIT_3_URGENT_NOTICE_OF_STATlUTORY_NON_COMPLIANCE_UIF_AND_SYSTEMIC_WITHHOLDING_OF_EXIT_DOCUMlENTS.pdf",
  "EXIT4":  BASE + "EXIT_4_URGENT_NOTICE_OF_STATUTORY_NON_COMPLIANCE_UIF_AND_&_SYSTEMIC_WITHHOLDING_OF_EXIT_DOCUMENTS.pdf",
  "EXIT5":  BASE + "EXIT_5_Correction_Required_Certificate_of_Service_Misrepresentation.pdf",
  "UI19":   BASE + "UI_19_Medscheme_Matthee_W.pdf",
};

const html = fs.readFileSync('index.html', 'utf8');
const trBlocks = html.match(/<tr>[\s\S]*?<\/tr>/g) || [];

let applied = 0, notFoundInHtml = [], missingFile = [];
let newHtml = html;

for (const code in corrections) {
  const filePath = corrections[code];
  if (!fs.existsSync(filePath)) {
    missingFile.push(code + " -> " + filePath);
    continue;
  }

  // find tr blocks whose LAST span text exactly matches this annexure code
  const matchingBlocks = trBlocks.filter(block => {
    const spans = [...block.matchAll(/>([^<]*)<\/span>/g)].map(m => m[1].trim());
    return spans.length && spans[spans.length - 1] === code;
  });

  if (matchingBlocks.length === 0) {
    notFoundInHtml.push(code);
    continue;
  }

  for (const block of matchingBlocks) {
    const oldPaths = [...block.matchAll(/showEvidenceModal\('([^']*)'\)/g)].map(m => m[1]);
    let newBlock = block;
    for (const oldPath of oldPaths) {
      newBlock = newBlock.split("showEvidenceModal('" + oldPath + "')")
                          .join("showEvidenceModal('" + filePath.replace(/'/g, "\\'") + "')");
    }
    newHtml = newHtml.split(block).join(newBlock);
    applied++;
  }
}

fs.writeFileSync('index.html.backup2', html);
fs.writeFileSync('index.html', newHtml);

console.log("============================================================");
console.log("Applied: " + applied + " row(s) corrected");
console.log("Backup saved: index.html.backup2");
if (notFoundInHtml.length) {
  console.log("\nAnnexure codes NOT found as a row in index.html (may need manual add, or code text differs):");
  notFoundInHtml.forEach(c => console.log("  - " + c));
}
if (missingFile.length) {
  console.log("\nFiles that don't exist on disk yet (check path/rclone):");
  missingFile.forEach(c => console.log("  - " + c));
}

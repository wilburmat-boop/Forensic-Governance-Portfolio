const fs = require('fs');

const BASE = 'public/02_Evidence_Core/0_8_Afrocentric_Lies /1_Proof_No_Lie/';

const rows = [
  { date: "09 Apr 2024", annexure: "A1", path: BASE+"A1_Employment_Contract.pdf", desc: "Employment agreement with Medscheme/Afrocentric Health" },
  { date: "06 Mar 2025", annexure: "T1", path: BASE+"T_1_Genesis_Threat_06_Mar_2026.jpg", desc: "Teams message documenting Ms. Mary-Ann Jones' threatening response: \"This is the second time you are questioning me, don't let it happen again\" — contemporaneous handwritten note minutes after incident" },
  { date: "Mar 2025", annexure: "MED1", path: BASE+"MED1 - letter to employer.pdf", desc: "Dr. Jacques Malan's report confirming Severe Major Depressive Disorder and PTSD requiring inpatient treatment" },
  { date: "16 Apr 2025", annexure: "STAG", path: BASE+"do not apply staggering 16 apr25.png", desc: "Request to stagger the unlawful deduction due to financial hardship" },
  { date: "16 Apr 2025", annexure: "LIE1", path: BASE+"LIE1__16_04_2025.pdf", desc: "Ms. Jones' email stating \"the company does not stagger debt, it's not a loan company\" and \"you won't miss the chunk of money\"" },
  { date: "23 Apr 2025", annexure: "CPD1", path: BASE+"CPD_1_22_Apr_2025.pdf", desc: "CPD/skills development gap identified and submitted; rejected, then unilaterally implemented Oct 2025 without credit" },
  { date: "09 May 2025", annexure: "HD1", path: BASE+"Half day leave applied .pdf", desc: "Evidence of harassment or hostile treatment by management" },
  { date: "16 May 2025", annexure: "EM1", path: BASE+"EM_1_Mental_Health_Disclosure_To_Employer.pdf", desc: "Formal email to Ms. Mapule Mashele reporting Ms. Jones' derogatory comments and the deduction; medical report (MED1) attached" },
  { date: "23 Jul 2025", annexure: "DED1", path: BASE+"PS2 (40.47 percent deduction without consultation at one go).pdf", desc: "Payslip showing illegal deduction of R14,811.77 (40.47% of gross salary)" },
  { date: "24 Jul 2025", annexure: "AOD", path: BASE+"POL1 (24th Jul 2025).png", desc: "Ms. Jones admitting in writing that the 25% cap exists but refusing to stagger the debt (policy snippet)" },
  { date: "23 Sep 2025", annexure: "SCR1", path: BASE+"SCR_1_Wilma_Screenshot_23_Sep_2025.png", desc: "Teams chat screenshot where Ms. Jones intentionally misgendered complainant as \"Wilma\" instead of \"Wilbur\"" },
  { date: "25 Sep 2025", annexure: "ONE1", path: BASE+"ONE_1_To_Meet_With_Perpetrator.pdf", desc: "Email from operational manager Ms. Nthabiseng instructing Ms. Jones to meet one-on-one regarding the gender discrimination case" },
  { date: "25 Sep 2025", annexure: "FG1", path: BASE+"FG_1_Gender_Identity_Discrimination_Formal_Complaint.pdf", desc: "Formal grievance filed reporting the gender identity discrimination" },
  { date: "29 Sep 2025", annexure: "ULP1", path: BASE+"ULP_1_unpaid_leave_approved_without_com.png", desc: "Double punitive unpaid leave loaded by Ms. Jones for 25 Sep 2025 — retaliation for filing FG1" },
  { date: "01 Oct 2025", annexure: "TYP1", path: BASE+"TYP_1_Gender_Identity_Discrimination_Typo_resolution.pdf", desc: "HCBP Cheryl and Ms. Mashele dismissed the \"Wilma\" incident as a \"typo\"" },
  { date: "06 Oct 2025", annexure: "HTV1", path: BASE+"HTV1 (Gmail - Fw_ Follow-Up on Unpaid Half-Day Leave – 25 September 2025).pdf", desc: "Communication evidence of hostile treatment and targeted victimisation by Ms. Jones" },
  { date: "31 Oct 2025", annexure: "FG2", path: BASE+"FG_2_Evidence_of_Malicious_Intent_Constructive_Dismissal_and_Hostile_Work_Environment_By_Mary_Ann_Jones.pdf", desc: "Grievance filed 2 Nov 2025 documenting victimisation, retaliation, constructive dismissal, malice, and building of a false case" },
  { date: "31 Oct 2025", annexure: "AUDIO1", path: BASE+"Recordings/jones you made a case against me.mp4", desc: "Audio: Ms. Jones states \"you made a case of harassment against me, now I can make a case against you\"" },
  { date: "31 Oct 2025", annexure: "AUDIO2", path: BASE+"Recordings/Matthee v Jones _Gallery.mp4", desc: "Continuation of the audio recording from the 31 October 2025 meeting" },
  { date: "02 Nov 2025", annexure: "IMP1", path: BASE+"IMP_1_Impact_Statement_on_Oct_Retaliation.pdf", desc: "Impact of work environment; effects of victimisation and retaliatory schedule changes after disclosures" },
  { date: "04 Dec 2025", annexure: "EXE1", path: BASE+"EXE_1_Executive_Leadership_Escalation .pdf", desc: "Escalation to executive leadership after 30+ days of institutional silence on grievances" },
  { date: "05 Dec 2025", annexure: "DEESC1", path: BASE+"DEC_1_Executive_de_escalation_to_the_department_under_inverstigation_05_Dec_2025.pdf", desc: "Executive leadership de-escalated complaint back to the department being reported — institutional bad faith" },
  { date: "09 Dec 2025", annexure: "UNION1", path: BASE+"Gmail - 📧 URGENT_ Notification of CCMA Case & Request for Union Presence_Representation - [Case WECT23564-25].PDF", desc: "Union notification of CCMA case; union remained silent" },
  { date: "10 Dec 2025", annexure: "OA1", path: BASE+"OA_1_Opposing_Affidavid_Responded_10_Dec_2025.pdf", desc: "⚠ CHECK: Respondent's sworn affidavit to CCMA — calls complainant \"untruthful,\" labels mental illness an \"excuse\"/\"afterthought,\" demands punitive costs" },
  { date: "10 Dec 2025", annexure: "RA1", path: BASE+"RA1 (REPLYING AFFIDAVIT TO THE RESPONDENT'S OPPOSITION TO CONDONATION_).pdf", desc: "⚠ CHECK: Replying affidavit responding to Respondent's opposing affidavit (OA1)" },
  { date: "17 Dec 2025", annexure: "GRC4", path: BASE+"BRD_GRC_4_MAXIMUM_SEVERITY_GRC_ESCALATION_RETRACTION_17_Dec_2025.pdf", desc: "Retraction of the maximum severity risk report due to technicalities/pending public holidays" },
  { date: "18 Dec 2025", annexure: "INLIM", path: BASE+"WECT23564-25_InLimine.PDF", desc: "Respondent's in limine (preliminary) application filed to oppose the CCMA Con/Arb" },
  { date: "18 Dec 2025", annexure: "CRO2", path: BASE+"CRO_1_Board_Level_Asking_to_stop_sending_emails_i_appear_inpatient_18_Dec_2025.pdf", desc: "Documented response to Group Chief Risk Officer after his \"cease communication\" instruction, confirming occupational detriment" },
  { date: "07 Jan 2026", annexure: "EXIT1", path: BASE+"EXIT_1_Request_for_Assistance_ UI_19_Forms_and_Umbrella_fund_Benefit_Documents.PDF.pdf", desc: "First exit-related document request/communication" },
  { date: "09 Jan 2026", annexure: "K1", path: BASE+"K1: Certificate of Non-Resolution (Outcome).jpg", desc: "Certificate of non-resolution from CCMA conciliation — jurisdictional prerequisite for Labour Court" },
  { date: "09 Jan 2026", annexure: "SANC1", path: BASE+"SANC_1_URGENT_ Notification_of_Professional_Deregistration_via_Occupational_Detriment_Registration_No_15831886_09_Jan_2026.pdf", desc: "SANC confirms deregistration due to non-payment of fees (R870.00)" },
  { date: "14 Jan 2026", annexure: "EXIT2", path: BASE+"LEXIT_2_Retirement_forms_and_Uif_forms.pdf", desc: "Follow-up on 7 Jan exit documents request" },
  { date: "15 Jan 2026", annexure: "EXIT3", path: BASE+"EXIT_3_URGENT_NOTICE_OF_STATlUTORY_NON_COMPLIANCE_UIF_AND_SYSTEMIC_WITHHOLDING_OF_EXIT_DOCUMlENTS.pdf", desc: "Reporting UI-19 code 6, June 2025 UIF non-remittance" },
  { date: "18-19 Jan 2026", annexure: "EXIT4", path: BASE+"EXIT_4_URGENT_NOTICE_OF_STATUTORY_NON_COMPLIANCE_UIF_AND_&_SYSTEMIC_WITHHOLDING_OF_EXIT_DOCUMENTS.pdf", desc: "Exit documents misrepresentation — August 2025 UIF remittance provided as proof of June 2025 remittance" },
  { date: "19 Jan 2026", annexure: "EXIT5", path: BASE+"EXIT_5_Correction_Required_Certificate_of_Service_Misrepresentation.pdf", desc: "Correction required — Certificate of Service misrepresentation" },
  { date: "19 Jan 2026", annexure: "UI19", path: BASE+"UI_19_Medscheme_Matthee_W.pdf", desc: "UIF documentation/claim filed with Department of Employment and Labour" },
];

let out = "<!-- Generated rows — review, then paste into the correct chronology table in index.html -->\n";
let missing = [];

for (const r of rows) {
  const exists = fs.existsSync(r.path);
  if (!exists) missing.push(r.annexure + " -> " + r.path);
  const p = r.path.replace(/'/g, "\\'");
  out += `<tr><td><span class="evidence-link" onclick="showEvidenceModal('${p}')" title="Open evidence">${r.date}</span></td><td>${r.desc}</td><td><span class="evidence-link" onclick="showEvidenceModal('${p}')" title="Open evidence">${r.annexure}</span></td></tr>\n`;
}

fs.writeFileSync('new-rows-generated.html', out);
console.log("Generated " + rows.length + " rows -> new-rows-generated.html");
if (missing.length) {
  console.log("\n⚠ WARNING — these files were not found on disk:");
  missing.forEach(m => console.log("  " + m));
}
console.log("\n⚠ OA1 and RA1 rows are flagged for manual review — see earlier note about which file is which.");

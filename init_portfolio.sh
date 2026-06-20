#!/bin/bash
# Description: Generates the strict directory structure for the Forensic Governance Portfolio

echo "Initializing Forensic-Governance-Portfolio architecture..."

# Create core directories
mkdir -p .github/workflows
mkdir -p 01_Executive_Briefs
mkdir -p 02_Evidence_Core/02A_Clinical_Data_Corruption
mkdir -p 02_Evidence_Core/02B_Executive_Suppression
mkdir -p 02_Evidence_Core/02C_B-BBEE_Fronting_Investigation
mkdir -p 02_Evidence_Core/02D_Institutional_Oversight
mkdir -p 03_Regulatory_Cross_Maps

# Initialize foundational markdown and manifest files
touch 01_Executive_Briefs/PARL_SUBMISSION_MAIN_JUNE2026.md
touch 01_Executive_Briefs/SPEAKER_SUMMARY_ANALYTICS.md
touch 03_Regulatory_Cross_Maps/KING_V_ALIGNMENT_GAP_ANALYSIS.md
touch 03_Regulatory_Cross_Maps/STATUTORY_BREACH_MATRIX.md
touch hash_manifest.sha256
touch README.md

echo "Repository architecture successfully deployed. Ready for evidence injection."

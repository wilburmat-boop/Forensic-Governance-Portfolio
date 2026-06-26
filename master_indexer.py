import os
import json

def build_manifest():
    manifest_data = {
        "level_3": ["PARL_SUBMISSION_01.pdf", "SPEAKER_BRIEF_02.pdf", "SUMMARY_INDEX.pdf"],
        "level_4": ["PDA_STATUTORY_LOG.pdf", "REGULATORY_GAPS.pdf"],
        "institutional_entities": [
            "CCMA_Arbitration_Records",
            "Bargaining_Council_Files",
            "SAPS_Police_Station_Affidavits",
            "Council_For_Medical_Schemes_Correspondence"
        ],
        "narrative_framework": {
            "core_narratives": [
                "Systemic Risk Concealment",
                "Victimization & Suppression",
                "Statutory Non-Compliance"
            ]
        },
        "cryptographic_foundation": {"algorithm": "SHA-256"}
    }
    
    with open("public/Forensic_manifest.json", "w") as f:
        json.dump(manifest_data, f, indent=2)
    print("Manifest updated with missing entities.")

if __name__ == "__main__":
    build_manifest()

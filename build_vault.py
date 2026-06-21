import os
import markdown
import sys

def generate_vault():
    # Structural Schema mapped to the 11-body failure cascade
    sections = {
        "Governance & Oversight": [
            {"title": "Letter to Speaker: June 2026", "file": "01_Executive_Briefs/EthicHawks_Letter_to_Speaker_03June2026.md"},
            {"title": "Regulatory Dereliction Matrix", "file": "01_Executive_Briefs/SYSTEMIC_REGULATORY_FAILURE.md"}
        ],
        "Institutional Failure Registry": [
            {"title": "Health (CMS/SANC)", "file": "02_Evidence_Core/02A_Health_Failures.md"},
            {"title": "Labour (DEL/CCMA)", "file": "02_Evidence_Core/02B_Labour_Failures.md"},
            {"title": "Commercial (B-BBEE/JSE)", "file": "02_Evidence_Core/02C_Commercial_Failures.md"},
            {"title": "Justice (SAPS/SAHRC)", "file": "02_Evidence_Core/02D_Justice_Failures.md"}
        ]
    }
    # ... [Insert the rest of the HTML template provided in the previous step]

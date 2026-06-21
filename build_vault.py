import os
<<<<<<< HEAD

def build():
    # Load your brief
    with open("01_Executive_Briefs/PARL_SUBMISSION_MAIN_JUNE2026.md", 'r') as f:
        content = f.read()
    
    # HTML template with the sidebar and dark theme
    html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <style>
            body {{ display: flex; font-family: sans-serif; background: #0a0c10; color: #fff; margin: 0; }}
            nav {{ width: 250px; background: #12161f; padding: 20px; border-right: 1px solid #333; }}
            main {{ padding: 40px; flex-grow: 1; }}
            h1 {{ color: #d4af37; }}
        </style>
    </head>
    <body>
        <nav>
            <h3>OVERSIGHT SUBMISSION</h3>
            <p>Forensic Evidence Registry</p>
        </nav>
        <main>
            <pre>{content}</pre>
        </main>
    </body>
    </html>
    """
    
    with open("public_view/parliament_vault_submission.html", 'w') as f:
        f.write(html)
    print("Success! Dashboard structured.")

build()
=======
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
>>>>>>> f78bba54b6852aece85263a4a654900a8aabc69d

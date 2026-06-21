import os

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

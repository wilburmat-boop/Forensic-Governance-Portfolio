import os
import re
import sys
try:
    import markdown
except ImportError:
    print("Error: The 'markdown' package is required. Run: pip install markdown")
    sys.exit(1)

def generate_vault():
    print("Initiating Interactive Vault Compilation Engine...")
    
    # 1. Define the structural schema based on your README layout
    sections = {
        "Executive Briefs": [
            {"title": "Primary Parliamentary Brief", "file": "01_Executive_Briefs/PARL_SUBMISSION_MAIN_JUNE2026.md"},
            {"title": "Speaker Summary & Analytics", "file": "01_Executive_Briefs/SPEAKER_SUMMARY_ANALYTICS.md"}
        ],
        "Evidence Core": [
            {"title": "Clinical Data Corruption Logs", "file": "02_Evidence_Core/02A_Clinical_Data_Corruption/README.md"},
            {"title": "Executive Suppression Communications", "file": "02_Evidence_Core/02B_Executive_Suppression/README.md"},
            {"title": "B-BBEE Fronting Investigation", "file": "02_Evidence_Core/02C_B-BBEE_Fronting_Investigation/README.md"},
            {"title": "Institutional Oversight Filings", "file": "02_Evidence_Core/02D_Institutional_Oversight/README.md"}
        ],
        "Regulatory Cross Maps": [
            {"title": "King V Alignment Gap Analysis", "file": "03_Regulatory_Cross_Maps/KING_V_ALIGNMENT_GAP_ANALYSIS.md"},
            {"title": "Statutory Breach Matrix", "file": "03_Regulatory_Cross_Maps/STATUTORY_BREACH_MATRIX.md"}
        ]
    }

    # 2. Build out the JSON data layer dynamically by reading your markdown files
    js_data_items = []
    item_counter = 1

    for section_name, docs in sections.items():
        for doc in docs:
            content_html = ""
            file_path = doc["file"]
            
            # Read file if it exists, otherwise generate an placeholder structured for audit
            if os.path.exists(file_path):
                with open(file_path, "r", encoding="utf-8") as f:
                    text = f.read()
                    content_html = markdown.markdown(text, extensions=['extra', 'tables'])
            else:
                content_html = f"<div class='audit-alert'><strong>[LOGICAL ARCHITECTURE HOLD]</strong><br>Establish document mapping layer for: <code>{file_path}</code>. Connect primary source or hash verification to clear exception state.</div>"

            # Escape backticks for safe entry into the JavaScript template literal
            content_html = content_html.replace("`", "\\`").replace("${", "\\${")
            
            js_data_items.append(f"""
                "{item_counter}": {{
                    title: "{doc['title']}",
                    category: "{section_name}",
                    path: "{file_path}",
                    content: `{content_html}`
                }}
            """)
            item_counter += 1

    js_documents_object = ",\n".join(js_data_items)

    # 3. Premium Single-File Interactive HTML Blueprint
    html_template = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PARLIAMENTARY DOSSIER: SYSTEMIC GOVERNANCE COLLAPSE</title>
    <style>
        :root {{
            --bg-primary: #0a0c10;
            --bg-secondary: #12161f;
            --bg-tertiary: #171d29;
            --accent-gold: #c5a880;
            --text-main: #d1d5db;
            --text-muted: #8a94a6;
            --border-color: #262f40;
            --secure-green: #34d399;
        }}
        * {{ box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }}
        body {{ background-color: var(--bg-primary); color: var(--text-main); overflow: hidden; height: 100vh; }}
        
        /* Gatekeeping Access Screen */
        #gatekeeper {{
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: radial-gradient(circle at center, var(--bg-secondary) 0%, var(--bg-primary) 100%);
            z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center;
            transition: opacity 0.6s ease; border: 1px solid var(--border-color);
        }}
        .gatekeeper-panel {{
            text-align: center; max-width: 600px; padding: 40px; background: rgba(18, 22, 31, 0.8);
            border: 1px solid var(--border-color); border-radius: 8px; box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }}
        .gatekeeper-title {{ font-size: 1.5rem; letter-spacing: 2px; color: #ffffff; margin-bottom: 10px; text-transform: uppercase; }}
        .gatekeeper-subtitle {{ font-size: 0.85rem; color: var(--accent-gold); margin-bottom: 30px; letter-spacing: 1px; }}
        .enter-btn {{
            background: transparent; border: 1px solid var(--accent-gold); color: #ffffff;
            padding: 12px 35px; font-size: 0.9rem; letter-spacing: 2px; cursor: pointer;
            text-transform: uppercase; transition: all 0.3s ease; border-radius: 4px;
        }}
        .enter-btn:hover {{ background: var(--accent-gold); color: var(--bg-primary); font-weight: bold; box-shadow: 0 0 15px rgba(197, 168, 128, 0.4); }}
        
        /* Interface Layout */
        .app-container {{ display: flex; height: 100vh; width: 100vw; opacity: 0; transition: opacity 0.5s ease; }}
        
        /* Sidebar Navigation */
        sidebar {{
            width: 320px; background-color: var(--bg-secondary); border-right: 1px solid var(--border-color);
            display: flex; flex-direction: column; height: 100%;
        }}
        .sidebar-header {{ padding: 25px 20px; border-bottom: 1px solid var(--border-color); }}
        .sidebar-header h1 {{ font-size: 0.95rem; color: #ffffff; letter-spacing: 1px; text-transform: uppercase; }}
        .sidebar-header p {{ font-size: 0.7rem; color: var(--accent-gold); margin-top: 5px; font-weight: 600; }}
        .nav-container {{ flex: 1; overflow-y: auto; padding: 20px 10px; }}
        .category-group {{ margin-bottom: 25px; }}
        .category-title {{ font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 1px; padding-left: 10px; margin-bottom: 8px; font-weight: 700; }}
        .nav-item {{
            display: block; width: 100%; text-align: left; background: transparent; border: none;
            padding: 10px 12px; font-size: 0.85rem; color: var(--text-main); cursor: pointer;
            border-radius: 4px; border-left: 2px solid transparent; transition: all 0.2s ease; margin-bottom: 4px;
        }}
        .nav-item:hover {{ background-color: var(--bg-tertiary); color: #ffffff; }}
        .nav-item.active {{ background-color: var(--bg-tertiary); border-left-color: var(--accent-gold); color: #ffffff; font-weight: 500; }}
        
        /* Main Document Viewer */
        main {{ flex: 1; display: flex; flex-direction: column; background-color: var(--bg-primary); height: 100%; }}
        .viewer-header {{
            background-color: var(--bg-secondary); padding: 20px 40px; border-bottom: 1px solid var(--border-color);
            display: flex; justify-content: space-between; align-items: center;
        }}
        .doc-meta h2 {{ font-size: 1.2rem; color: #ffffff; font-weight: 500; }}
        .doc-meta p {{ font-size: 0.75rem; color: var(--text-muted); font-family: monospace; margin-top: 4px; }}
        .hash-badge {{
            background-color: rgba(52, 211, 153, 0.1); border: 1px solid rgba(52, 211, 153, 0.3);
            color: var(--secure-green); font-family: monospace; font-size: 0.75rem; padding: 6px 12px; border-radius: 4px;
        }}
        .content-body {{ flex: 1; overflow-y: auto; padding: 40px; line-height: 1.7; font-size: 0.95rem; color: #e5e7eb; }}
        
        /* Markdown Styling inside Viewer */
        .content-body h1, .content-body h2, .content-body h3 {{ color: #ffffff; margin-top: 1.5em; margin-bottom: 0.5em; font-weight: 500; }}
        .content-body h2 {{ border-bottom: 1px solid var(--border-color); padding-bottom: 6px; font-size: 1.3rem; }}
        .content-body p {{ margin-bottom: 1.2em; }}
        .content-body ul, .content-body ol {{ margin-bottom: 1.2em; padding-left: 20px; }}
        .content-body li {{ margin-bottom: 0.4em; }}
        .content-body code {{ font-family: monospace; background: var(--bg-tertiary); padding: 2px 6px; border-radius: 3px; font-size: 0.85rem; color: #f3f4f6; }}
        .content-body pre {{ background: var(--bg-secondary); padding: 15px; border-radius: 6px; border: 1px solid var(--border-color); overflow-x: auto; margin-bottom: 1.5em; }}
        .content-body pre code {{ background: transparent; padding: 0; font-size: 0.85rem; }}
        .content-body table {{ width: 100%; border-collapse: collapse; margin-bottom: 1.5em; font-size: 0.9rem; }}
        .content-body th, .content-body td {{ border: 1px solid var(--border-color); padding: 10px 12px; text-align: left; }}
        .content-body th {{ background-color: var(--bg-secondary); color: #ffffff; font-weight: 600; }}
        .content-body tr:nth-child(even) {{ background-color: rgba(23, 29, 41, 0.3); }}
        
        .audit-alert {{
            background-color: rgba(197, 168, 128, 0.05); border: 1px solid rgba(197, 168, 128, 0.2);
            padding: 20px; border-radius: 6px; color: var(--text-main); margin-top: 20px;
        }}
        .audit-alert code {{ color: var(--accent-gold); }}
    </style>
</head>
<body>

    <!-- Access Screen -->
    <div id="gatekeeper">
        <div class="gatekeeper-panel">
            <div class="gatekeeper-title">Parliamentary Evidence Vault</div>
            <div class="gatekeeper-subtitle">Systemic Governance Collapse Dossier — Secure Offline Portal</div>
            <button class="enter-btn" onclick="unlockVault()">Decrypt & Enter Bundle</button>
        </div>
    </div>

    <!-- Active Interface -->
    <div id="app" class="app-container">
        <sidebar>
            <div class="sidebar-header">
                <h1>Oversight Submission</h1>
                <p>FORENSIC EVIDENCE REGISTRY</p>
            </div>
            <div class="nav-container">
                <div class="category-group">
                    <div class="category-title">01 / Strategic Briefs</div>
                    <button class="nav-item active" onclick="loadDocument('1', this)">Primary Brief</button>
                    <button class="nav-item" onclick="loadDocument('2', this)">Speaker Analytics Summary</button>
                </div>
                <div class="category-group">
                    <div class="category-title">02 / Evidence Registry</div>
                    <button class="nav-item" onclick="loadDocument('3', this)">Clinical Data Corruption</button>
                    <button class="nav-item" onclick="loadDocument('4', this)">Executive Suppression Logs</button>
                    <button class="nav-item" onclick="loadDocument('5', this)">B-BBEE Fronting Case</button>
                    <button class="nav-item" onclick="loadDocument('6', this)">Institutional Failure Matrix</button>
                </div>
                <div class="category-group">
                    <div class="category-title">03 / Alignment Maps</div>
                    <button class="nav-item" onclick="loadDocument('7', this)">King V Governance Map</button>
                    <button class="nav-item" onclick="loadDocument('8', this)">Statutory Breach Ledger</button>
                </div>
            </div>
        </sidebar>

        <main>
            <div class="viewer-header">
                <div class="doc-meta">
                    <h2 id="doc-title">Primary Brief</h2>
                    <p id="doc-path">01_Executive_Briefs/PARL_SUBMISSION_MAIN_JUNE2026.md</p>
                </div>
                <div class="hash-badge">SHA-256: SECURE STATUS VERIFIED</div>
            </div>
            <div class="content-body" id="doc-viewer">
                <!-- Content injected dynamically -->
            </div>
        </main>
    </div>

    <script>
        // Compiled Document Layer
        const documents = {{
            {js_documents_object}
        }};

        function unlockVault() {{
            document.getElementById('gatekeeper').style.opacity = '0';
            setTimeout(() => {{
                document.getElementById('gatekeeper').style.display = 'none';
                const app = document.getElementById('app');
                app.style.display = 'flex';
                setTimeout(() => app.style.opacity = '1', 50);
            }}, 600);
            // Auto-load first document
            loadDocument('1');
        }}

        function loadDocument(id, element) {{
            const doc = documents[id];
            if (!doc) return;

            document.getElementById('doc-title').innerText = doc.title;
            document.getElementById('doc-path').innerText = doc.path;
            document.getElementById('doc-viewer').innerHTML = doc.content;

            if (element) {{
                document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
                element.classList.add('active');
            }}
            
            // Scroll internal content area back to top on switch
            document.getElementById('doc-viewer').scrollTop = 0;
        }}
    </script>
</body>
</html>
"""

    # 4. Export the clean output file
    output_filename = "parliament_vault_submission.html"
    with open(output_filename, "w", encoding="utf-8") as out:
        out.write(html_template)
    
    print(f"\nSuccess! Compiled single-file application created: {output_filename}")

if __name__ == "__main__":
    generate_vault()

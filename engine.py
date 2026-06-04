import hashlib
import os
import json
from pathlib import Path
from datetime import datetime

class EthicHawksEngine:
    def __init__(self):
        self.output_file = "PORTFOLIO.md"
        self.hash_manifest_file = "hash_manifest.sha256"
        self.output_pdf = "PORTFOLIO.pdf"
        self.hash_registry = {}

    def calculate_file_hash(self, filepath):
        """Calculate SHA-256 hash of a file"""
        sha256_hash = hashlib.sha256()
        try:
            with open(filepath, "rb") as f:
                for byte_block in iter(lambda: f.read(4096), b""):
                    sha256_hash.update(byte_block)
            return sha256_hash.hexdigest()
        except FileNotFoundError:
            print(f"[⚠️] File not found: {filepath}")
            return None

    def build_cover_page(self):
        print("[⚡] Building Formal Portfolio Cover Page...")
        with open(self.output_file, "r+") as f:
            content = f.read()
            cover = "---\n# ETHICHAWKS FORENSIC GOVERNANCE\n## Formal Parliamentary Submission: Case WECT24486-25\n\n**Prepared By:** Sr. Wilbur William Matthee\n**Designation:** Founder, EthicHawks Forensic Governance & Compliance\n**Date:** June 2026\n**Status:** Verified, Hash-Audited Evidence Dossier\n---\n\n"
            f.seek(0, 0)
            f.write(cover + content)

    def append_executive_summary(self):
        print("[⚡] Appending Executive Summary...")
        with open(self.output_file, "a", encoding="utf-8") as f:
            f.write("\n## II. EXECUTIVE SUMMARY\n\nThis forensic governance portfolio presents documented evidence of systemic institutional failure in the protection of whistleblower rights and regulatory compliance. The submission addresses material breaches of fiduciary duty, statutory non-compliance, and institutional obstruction across multiple regulatory bodies.\n\n[⬆ Back to Table of Contents](#table-of-contents)\n\n---\n")

    def append_table_of_contents(self):
        print("[⚡] Generating Table of Contents...")
        with open(self.output_file, "r+") as f:
            content = f.read()
            f.seek(0, 0)
            f.write("# PORTFOLIO OF EVIDENCE\n\n## Table of Contents\n- [II. Executive Summary](#ii-executive-summary)\n- [XIII. Board Governance](#xiii-board-governance-and-compliance-oversight)\n- [XIV. Regulator Escalation](#xiv-regulator-escalation-and-documentary-evidence)\n- [XV. SHA-256 Audit Log](#xv-evidence-integrity-and-sha-256-audit-log)\n- [XVI. SAHRC Update](#xvi-sahrc-forensic-update-and-systemic-failure)\n- [XVII. Supplementary Evidence](#xvii-supplementary-evidence-dossier)\n\n---\n\n" + content)

    def append_board_governance_narrative(self):
        print("[⚡] Appending Board Governance Narrative...")
        with open(self.output_file, "a", encoding="utf-8") as f:
            f.write("\n## XIII. BOARD GOVERNANCE AND COMPLIANCE OVERSIGHT\n\nThis section details the failures in fiduciary duty and the resulting impact on institutional governance. The board's material omissions and willful non-disclosure of known risks created an environment conducive to regulatory violations and whistleblower victimization.\n\n[⬆ Back to Table of Contents](#table-of-contents)\n\n---\n")

    def append_regulator_escalation_narrative(self):
        print("[⚡] Appending Regulator Escalation Narrative...")
        with open(self.output_file, "a", encoding="utf-8") as f:
            f.write("\n## XIV. REGULATOR ESCALATION AND DOCUMENTARY EVIDENCE\n\nThe dispute is evidenced by the following primary documentation:\n- **Notification of Regulator Escalation**\n- **Correspondence with CCMA**\n- **Labour Court Filings**\n- **High Court Application**\n\nAll regulatory bodies have received formal notice of the violations documented in this portfolio.\n\n[⬆ Back to Table of Contents](#table-of-contents)\n\n---\n")

    def append_sha256_audit_narrative(self):
        print("[⚡] Appending SHA-256 Audit Narrative...")
        with open(self.output_file, "a", encoding="utf-8") as f:
            f.write("\n## XV. EVIDENCE INTEGRITY AND SHA-256 AUDIT LOG\n\n**Cryptographic Integrity Verification**\n\nAll evidence in this dossier is protected by SHA-256 hashing. See `hash_manifest.sha256` for complete cryptographic chain-of-custody verification. This ensures mathematical proof that no documents have been altered, tampered with, or selectively edited.\n\n[⬆ Back to Table of Contents](#table-of-contents)\n\n---\n")

    def append_sahrc_update_narrative(self):
        print("[⚡] Appending SAHRC Update Narrative...")
        with open(self.output_file, "a", encoding="utf-8") as f:
            f.write("\n## XVI. SAHRC FORENSIC UPDATE AND SYSTEMIC FAILURE\n\nThis section incorporates the formal update provided to the South African Human Rights Commission on 13 March 2026, documenting ongoing institutional failure and the systemic nature of the violations.\n\n[⬆ Back to Table of Contents](#table-of-contents)\n\n---\n")

    def append_final_evidence_dossier(self):
        print("[⚡] Appending Final Evidence Dossier...")
        with open(self.output_file, "a", encoding="utf-8") as f:
            f.write("\n## XVII. SUPPLEMENTARY EVIDENCE DOSSIER\n\n- **SAHRC Correspondence**\n- **Complete Evidence Bundle**\n- **Supporting Documentation**\n- **Regulatory Cross-Reference Matrix**\n- **Statutory Breach Tracking**\n\n[⬆ Back to Table of Contents](#table-of-contents)\n\n---\n\n**Document Generated:** " + datetime.now().isoformat() + "\n**Portfolio Status:** Complete and Hash-Audited\n")

    def generate_hash_manifest(self):
        """Generate SHA-256 hash manifest for all key files"""
        print("[⚡] Generating SHA-256 Hash Manifest...")
        
        files_to_hash = [
            self.output_file,
            "run_submission.py",
            "engine.py",
            "README.md"
        ]
        
        manifest_content = f"# SHA-256 FORENSIC INTEGRITY MANIFEST\n"
        manifest_content += f"# Generated: {datetime.now().isoformat()}\n"
        manifest_content += f"# Purpose: Evidence Chain-of-Custody Verification\n\n"
        
        for filepath in files_to_hash:
            if os.path.exists(filepath):
                file_hash = self.calculate_file_hash(filepath)
                if file_hash:
                    self.hash_registry[filepath] = file_hash
                    manifest_content += f"{file_hash}  {filepath}\n"
                    print(f"  ✓ {filepath}: {file_hash}")
        
        # Write manifest file
        with open(self.hash_manifest_file, "w") as f:
            f.write(manifest_content)
        
        print(f"[✅] Hash manifest written to {self.hash_manifest_file}")
        return self.hash_registry

    def generate_pdf(self, output_path):
        """Generate PDF from HTML content."""
        print(f"[⚡] Generating PDF: {output_path}...")
        
        # Finalize the HTML content
        full_html = f"<html><body>{self.content}</body></html>"
        
        # Ensure weasyprint is used correctly
        from weasyprint import HTML
        HTML(string=full_html).write_pdf(output_path)
        print("[⚡] PDF generated successfully.")

        try:
            from weasyprint import HTML, CSS
            import markdown
        except ImportError:
            print("[❌] Required packages not found. Installing...")
            os.system("pip install weasyprint markdown")
            from weasyprint import HTML, CSS
            import markdown
        
        # Read markdown file
        with open(self.output_file, "r", encoding="utf-8") as f:
            md_content = f.read()
        
        # Convert markdown to HTML
        html_content = markdown.markdown(md_content, extensions=['tables', 'toc', 'nl2br'])
        
        # Create HTML document with styling
        full_html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Forensic Governance Portfolio - Parliamentary Submission</title>
            <style>
                @page {{
                    size: A4;
                    margin: 2cm;
                    @bottom-center {{
                        content: "Page " counter(page) " of " counter(pages);
                        font-size: 10pt;
                    }}
                }}
                
                body {{
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }}
                
                h1 {{
                    color: #1a1a1a;
                    border-bottom: 3px solid #003366;
                    padding-bottom: 10px;
                    page-break-after: avoid;
                }}
                
                h2 {{
                    color: #003366;
                    margin-top: 30px;
                    page-break-after: avoid;
                    border-left: 4px solid #003366;
                    padding-left: 10px;
                }}
                
                h3 {{
                    color: #004d80;
                    page-break-after: avoid;
                }}
                
                table {{
                    width: 100%;
                    border-collapse: collapse;
                    margin: 15px 0;
                    page-break-inside: avoid;
                }}
                
                th, td {{
                    border: 1px solid #ddd;
                    padding: 10px;
                    text-align: left;
                }}
                
                th {{
                    background-color: #003366;
                    color: white;
                }}
                
                tr:nth-child(even) {{
                    background-color: #f9f9f9;
                }}
                
                code {{
                    background-color: #f5f5f5;
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-family: 'Courier New', monospace;
                }}
                
                pre {{
                    background-color: #f5f5f5;
                    padding: 15px;
                    border-radius: 5px;
                    overflow-x: auto;
                    page-break-inside: avoid;
                }}
                
                blockquote {{
                    border-left: 4px solid #ddd;
                    margin-left: 0;
                    padding-left: 15px;
                    color: #666;
                }}
                
                a {{
                    color: #003366;
                    text-decoration: none;
                }}
                
                a:hover {{
                    text-decoration: underline;
                }}
                
                .document-header {{
                    text-align: center;
                    padding: 20px 0;
                    border-bottom: 2px solid #003366;
                    margin-bottom: 30px;
                }}
                
                .document-header h1 {{
                    border: none;
                    margin: 0;
                }}
            </style>
        </head>
        <body>
            {html_content}
        </body>
        </html>
        """
        
        # Generate PDF
        try:
            HTML(string=full_html).write_pdf(self.output_pdf)
            print(f"[✅] PDF successfully generated: {self.output_pdf}")
            
            # Calculate hash of generated PDF
            pdf_hash = self.calculate_file_hash(self.output_pdf)
            if pdf_hash:
                self.hash_registry[self.output_pdf] = pdf_hash
                print(f"  ✓ PDF Hash: {pdf_hash}")
            
            return True
        except Exception as e:
            print(f"[❌] Error generating PDF: {e}")
            return False

    def verify_hash_integrity(self):
        """Verify integrity of files against manifest"""
        print("[⚡] Verifying Hash Integrity...")
        
        if not os.path.exists(self.hash_manifest_file):
            print("[⚠️] Hash manifest not found. Run generate_hash_manifest() first.")
            return False
        
        with open(self.hash_manifest_file, "r") as f:
            lines = f.readlines()
        
        all_valid = True
        for line in lines:
            if line.startswith("#") or not line.strip():
                continue
            
            parts = line.strip().split()
            if len(parts) >= 2:
                expected_hash = parts[0]
                filepath = " ".join(parts[1:])
                
                current_hash = self.calculate_file_hash(filepath)
                if current_hash == expected_hash:
                    print(f"  ✓ {filepath}: VERIFIED")
                else:
                    print(f"  ✗ {filepath}: HASH MISMATCH!")
                    all_valid = False
        
        if all_valid:
            print("[✅] All files verified successfully!")
        else:
            print("[⚠️] Some files have mismatched hashes!")
        
        return all_valid

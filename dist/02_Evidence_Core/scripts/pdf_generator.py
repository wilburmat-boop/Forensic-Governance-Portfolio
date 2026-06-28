import os
import hashlib
from datetime import datetime

def generate_sha256(file_path):
    sha256_hash = hashlib.sha256()
    try:
        with open(file_path, "rb") as f:
            for byte_block in iter(lambda: f.read(65536), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()
    except:
        return "HASH_ERROR"

def compile_portfolio():
    print("[⚡] Compiling Parliamentary Master Evidentiary Bundle Engine...")
    
    metadata = {
        "{{title}}": "MASTER EVIDENTIARY BUNDLE",
        "{{subtitle}}": "Formal Submission to the National Assembly Parliamentary Committee",
        "{{author}}": "Wilbur William Matthee",
        "{{designation}}": "Case Manager | Specialist Registered Nurse | Health Services Manager",
        "{{date}}": datetime.now().strftime("%Y-%m-%d")
    }
    
    template_path = "templates/cover_page.html"
    narrative_path = "documents/narrative_input.txt"
    output_path = "portfolio_compiled.html"
    
    if not os.path.exists(template_path) or not os.path.exists(narrative_path):
        print("[✕] Error: Structural template or narrative source files are missing.")
        return

    with open(template_path, "r", encoding="utf-8") as f:
        html_content = f.read()
        
    with open(narrative_path, "r", encoding="utf-8") as f:
        raw_text = f.read()

    # Scan the directory to map hashes and create an Exhibit Index
    excluded_files = ["audit_pipeline.py", "clean_duplicates.py", "run_pipeline.py", "poe_audit_manifest.txt", "audit_manifest.sha256", "portfolio_compiled.html"]
    evidence_files = sorted([f for f in os.listdir(".") if os.path.isfile(f) and f not in excluded_files and not f.endswith('.py')])
    
    exhibit_map = {}
    for idx, filename in enumerate(evidence_files, start=1):
        exhibit_id = f"EXHIBIT-WWM-{idx:02d}"
        exhibit_map[filename] = {
            "id": exhibit_id,
            "hash": generate_sha256(filename)
        }

    # Parse narrative text and inject interactive Cross-Reference Links
    formatted_narrative = ""
    in_statutory_block = False

    for line in raw_text.split("\n"):
        line_stripped = line.strip()
        
        if "[STATUTORY_START]" in line_stripped:
            in_statutory_block = True
            formatted_narrative += "<div class='statutory-box'>\n"
            continue
        elif "[STATUTORY_END]" in line_stripped:
            in_statutory_block = False
            formatted_narrative += "</div>\n"
            continue

        # Process Cross-References inline
        processed_line = line_stripped
        if "[CROSS_REF:" in processed_line:
            for filename, data in exhibit_map.items():
                ref_tag = f"[CROSS_REF: {filename}]"
                if ref_tag in processed_line:
                    link_html = f"<a href='#{data['id']}' style='color: #c0392b; font-weight: bold; text-decoration: none;'>{data['id']} ({filename})</a>"
                    processed_line = processed_line.replace(ref_tag, link_html)

        if in_statutory_block:
            if processed_line and not processed_line.isupper():
                formatted_narrative += f"    <p class='statutory-text'>{processed_line}</p>\n"
            elif processed_line.isupper():
                formatted_narrative += f"    <div class='statutory-title'>{processed_line}</div>\n"
        else:
            if processed_line.startswith("## "):
                formatted_narrative += f"<h2>{processed_line[3:]}</h2>\n"
            elif processed_line.startswith("### "):
                formatted_narrative += f"<h3>{processed_line[4:]}</h3>\n"
            elif processed_line:
                formatted_narrative += f"<p>{processed_line}</p>\n"
            
    # Build Parliamentary Appendix Table with Anchor Tags
    appendix_html = "\n<div style='page-break-before: always;'></div>\n<h2>Appendix: Parliamentary Evidence Registry</h2>\n"
    appendix_html += "<p>The following digital assets serve as primary source evidence. Each file is tied to an immutable cryptographic signature verifying its authentic status:</p>\n"
    appendix_html += "<table>\n"
    appendix_html += "  <tr>\n"
    appendix_html += "    <th>Exhibit ID</th>\n"
    appendix_html += "    <th>Document / File Name</th>\n"
    appendix_html += "    <th>Cryptographic SHA-256 Fingerprint</th>\n"
    appendix_html += "  </tr>\n"

    if exhibit_map:
        for filename, data in exhibit_map.items():
            appendix_html += f"  <tr id='{data['id']}'>\n"
            appendix_html += f"    <td style='font-weight: bold; color: #c0392b;'>{data['id']}</td>\n"
            appendix_html += f"    <td>{filename}</td>\n"
            appendix_html += f"    <td style='font-family: monospace; font-size: 9pt; color: #27ae60;'>{data['hash']}</td>\n"
            appendix_html += f"  </tr>\n"
    else:
        appendix_html += "  <tr><td colspan='3' style='color: #7f8c8d;'>No evidentiary files cataloged in staging area.</td></tr>\n"
        
    appendix_html += "</table>\n"

    metadata["{{content}}"] = formatted_narrative + appendix_html

    for key, value in metadata.items():
        html_content = html_content.replace(key, value)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html_content)

    print(f"[✔] Parliamentary Master Bundle compiled successfully -> {output_path}")

if __name__ == "__main__":
    compile_portfolio()

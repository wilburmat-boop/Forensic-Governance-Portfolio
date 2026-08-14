<<<<<<< HEAD
#!/usr/bin/env python3
import json
import re

def load_reference_map(path="reference_map.json"):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def extract_rows(html_path="index.html"):
    with open(html_path, "r", encoding="utf-8") as f:
        html = f.read()
    rows = []
    for m in re.finditer(r"<tr>(.*?)</tr>", html, re.DOTALL):
        row_html = m.group(1)
        line_no = html[:m.start()].count("\n") + 1
        date_m = re.search(r"(\d{1,2}[-\s][A-Za-z]{3,9}[-\s]\d{4})", row_html)
        if not date_m:
            continue
        date = date_m.group(1).strip()
        link_m = re.search(
            r"onclick=\"showEvidenceModal\('([^']+)'\)\"[^>]*>([^<]*)</span>",
            row_html
        )
        if not link_m:
            continue
        file_path, ref_text = link_m.groups()
        rows.append({"date": date, "ref": ref_text.strip(), "file": file_path.strip(), "line": line_no})
    return rows

def main():
    refmap = load_reference_map()
    rows = extract_rows()
    print(f"Found {len(rows)} rows with BOTH a date and a clickable evidence link\n")
    print("=" * 100)
    mismatches = []
    for row in rows:
        ref = row["ref"]
        actual_file = row["file"]
        date = row["date"]
        if ref in refmap:
            expected_file = refmap[ref].get("file", "")
            expected_date = refmap[ref].get("date", "")
            file_match = actual_file.endswith(expected_file) or expected_file.endswith(actual_file)
            date_match = (date == expected_date) if expected_date else True
            if not file_match or not date_match:
                mismatches.append({
                    "line": row["line"], "ref": ref, "date_in_html": date,
                    "expected_date": expected_date, "file_in_html": actual_file,
                    "expected_file": expected_file,
                })
        else:
            print(f"[REF NOT IN reference_map.json] Line {row['line']}: ref='{ref}' date={date} file={actual_file}")
    print("\n" + "=" * 100)
    print(f"CONFIRMED MISMATCHES: {len(mismatches)}\n")
    for mm in mismatches:
        print(f"Line {mm['line']} | ref={mm['ref']}")
        print(f"  Date in HTML:      {mm['date_in_html']}")
        print(f"  Expected date:     {mm['expected_date']}")
        print(f"  File in HTML:      {mm['file_in_html']}")
        print(f"  Expected file:     {mm['expected_file']}")
        print("-" * 100)
    if not mismatches:
        print("No confirmed mismatches for refs that exist in reference_map.json.")

if __name__ == "__main__":
    main()
=======
python3: can't open file '/data/data/com.termux/files/home/Forensic-Governance-Portfolio/fix_evidence_paths.py': [Errno 2] No such file or directory
>>>>>>> 15b8d40 (Save progress: update evidence paths and validation scripts)

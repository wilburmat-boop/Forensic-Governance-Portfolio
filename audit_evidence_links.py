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
    pattern1 = re.compile(
        r'<tr><td>(\d{1,2}[-\s][A-Za-z]{3,9}[-\s]\d{4})</td>.*?'
        r"onclick=\"showEvidenceModal\('([^']+)'\)\"[^>]*>([^<]*)</span>",
        re.DOTALL
    )
    for m in pattern1.finditer(html):
        date, file_path, ref = m.groups()
        line_no = html[:m.start()].count("\n") + 1
        rows.append({"date": date.strip(), "ref": ref.strip(), "file": file_path.strip(), "line": line_no, "style": "trailing-ref"})
    pattern2 = re.compile(
        r"<tr><td><span class=\"evidence-link\" onclick=\"showEvidenceModal\('([^']+)'\)\""
        r'[^>]*>([^<]+)</span></td>',
    )
    for m in pattern2.finditer(html):
        file_path, date = m.groups()
        line_no = html[:m.start()].count("\n") + 1
        rows.append({"date": date.strip(), "ref": None, "file": file_path.strip(), "line": line_no, "style": "leading-date"})
    return rows

def main():
    refmap = load_reference_map()
    rows = extract_rows()
    print(f"Found {len(rows)} evidence-linked rows in index.html\n")
    print("=" * 100)
    mismatches = []
    for row in rows:
        ref = row["ref"]
        actual_file = row["file"]
        date = row["date"]
        if ref and ref in refmap:
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
        elif ref:
            print(f"[UNKNOWN REF] Line {row['line']}: ref '{ref}' not found in reference_map.json (date: {date})")
    print("\n" + "=" * 100)
    print(f"MISMATCHES FOUND: {len(mismatches)}\n")
    for mm in mismatches:
        print(f"Line {mm['line']} | ref={mm['ref']}")
        print(f"  Date in HTML:      {mm['date_in_html']}")
        print(f"  Expected date:     {mm['expected_date']}")
        print(f"  File in HTML:      {mm['file_in_html']}")
        print(f"  Expected file:     {mm['expected_file']}")
        print("-" * 100)
    if not mismatches:
        print("No mismatches detected against reference_map.json.")
    print("\n" + "=" * 100)
    print("ALL ROWS (for manual review):\n")
    for row in rows:
        print(f"Line {row['line']:5} | {row['date']:15} | ref={str(row['ref']):8} | {row['file']}")

if __name__ == "__main__":
    main()

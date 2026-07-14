#!/usr/bin/env python3
import hashlib
import json
import os
import re
from pathlib import Path

ROOT = Path.home() / "Forensic-Governance-Portfolio"
EVIDENCE_DIR = ROOT / "public" / "02_Evidence_Core"

MONTHS = {
    "jan": 1, "january": 1, "feb": 2, "february": 2, "mar": 3, "march": 3,
    "apr": 4, "april": 4, "may": 5, "jun": 6, "june": 6, "jul": 7, "july": 7,
    "aug": 8, "august": 8, "sep": 9, "sept": 9, "september": 9,
    "oct": 10, "october": 10, "nov": 11, "november": 11, "dec": 12, "december": 12,
}

KEYWORD_CATEGORIES = {
    "Legal Proceedings": ["perjury", "criminal", "fraud", "contempt", "interdict", "affidavit",
        "deponent", "sworn", "oath", "court order", "rule nisi", "ex parte",
        "default judgment", "notice of motion", "heads of argument"],
    "People": ["jason whyte", "frances barker", "deneys reitz", "ntabiseng ngwane",
        "vusumzi landu", "monwabisi kula", "gerald van wyk", "anna mokgokong",
        "farzaana ismail", "nicola hanekom", "ruanne david", "lebo tshabalala",
        "lisa mari", "cheryl-dawn modern", "marco van der walt"],
    "Institutions": ["ccma", "labour court", "high court", "saps", "siu", "ndoh",
        "cms", "hpcsa", "sanc", "sapc", "gems", "sahrc", "fsca", "jse",
        "afrocentric", "medscheme", "department of employment",
        "b-bbee commission", "whistleblower house"],
    "Statutory": ["protected disclosures act", "pda", "bcea", "lra", "pfma", "popia",
        "nhi", "companies act", "section 162", "section 34", "section 186",
        "section 38", "biowatch", "king iv"],
    "Forensic Governance": ["statutory breach", "dereliction", "mandatory", "fiduciary",
        "whistleblower", "retaliation", "victimisation", "suppression",
        "regulatory capture", "institutional failure", "governance collapse",
        "clinical data", "gexus", "dms", "integration gap"],
    "Outcomes": ["constructive dismissal", "unfair dismissal", "unlawful deduction",
        "ui-19", "uif", "salary deduction", "homelessness", "destitute",
        "deregistration", "contempt trap", "gag order", "attrition"],
}

DATE_PATTERNS = [
    re.compile(r'(\d{1,2})[_\-\s](' + "|".join(MONTHS.keys()) + r')[_\-\s](\d{4})', re.IGNORECASE),
    re.compile(r'(\d{4})[_\-](\d{2})[_\-](\d{2})'),
    re.compile(r'(\d{2})[_\-](\d{2})[_\-](\d{4})'),
]

def sha256_of(filepath):
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        for block in iter(lambda: f.read(65536), b""):
            h.update(block)
    return h.hexdigest()

def extract_date(name):
    for pattern in DATE_PATTERNS:
        m = pattern.search(name)
        if not m:
            continue
        groups = m.groups()
        try:
            if groups[1].lower() in MONTHS:
                day, mon, year = groups
                return f"{year}-{MONTHS[mon.lower()]:02d}-{int(day):02d}"
            elif len(groups[0]) == 4:
                year, mon, day = groups
                return f"{year}-{int(mon):02d}-{int(day):02d}"
            else:
                day, mon, year = groups
                return f"{year}-{int(mon):02d}-{int(day):02d}"
        except (ValueError, KeyError):
            continue
    return "Undated"

def find_keywords(text):
    """Extract both category keywords AND filename words"""
    import re
    text_l = text.lower()
    found = []
    
    # Keep CATEGORY keywords (broad search)
    for kws in KEYWORD_CATEGORIES.values():
        for kw in kws:
            if kw in text_l:
                found.append(kw)
            # ALSO add individual words from multi-word keywords
            for word in kw.split():
                if len(word) > 2:
                    found.append(word)
    
    # Extract meaningful words from filename (3+ chars, not common words)
    words = re.findall(r'[a-zA-Z0-9]{3,}', text.lower())
    common = {'the', 'and', 'pdf', 'doc', 'xlsx', 'docx', 'ppt', 'file', 'data', 'report'}
    found.extend([w for w in words if w not in common and len(set(w)) > 1])
    
    return list(set(found))

def main():
    if not EVIDENCE_DIR.exists():
        print(f"ERROR: {EVIDENCE_DIR} does not exist")
        return

    manifest = []
    date_index = {}
    keyword_index = {}
    
    # Pre-populate keyword index with ALL category keywords (empty file lists for now)
    for kws in KEYWORD_CATEGORIES.values():
        for kw in kws:
            if kw not in keyword_index:
                keyword_index[kw] = []
            # Also add individual words from multi-word keywords
            for word in kw.split():
                if len(word) > 2 and word not in keyword_index:
                    keyword_index[word] = []
    
    count = 0

    EXCLUDED_DIRS = [
        "0_0_1_Wilbur_William_Matthee",
        "0_9_Miscellaneous_Folder",
        "0_1_Parliamentary_Oversight",  # video too large for git, excluded via .gitignore
    ]

    for dirpath, dirnames, filenames in os.walk(EVIDENCE_DIR):
        dirnames[:] = [d for d in dirnames if d not in EXCLUDED_DIRS]
        rel_check = str(Path(dirpath).relative_to(EVIDENCE_DIR.parent))
        if any(ex in rel_check for ex in EXCLUDED_DIRS):
            continue
        for fname in sorted(filenames):
            if fname.startswith('.'):
                continue
            full_path = Path(dirpath) / fname
            rel_str = str(full_path.relative_to(EVIDENCE_DIR.parent))
            folder_rel = str(Path(dirpath).relative_to(EVIDENCE_DIR.parent))

            try:
                sha256 = sha256_of(full_path)
            except Exception as e:
                print(f"  [SKIP] {rel_str}: {e}")
                continue

            date_iso = extract_date(fname)
            entry = {
                "path": rel_str,
                "filename": fname,
                "sha256": sha256,
                "folder": folder_rel,
                "date_iso": date_iso,
                "size": full_path.stat().st_size,
            }
            manifest.append(entry)
            date_index.setdefault(date_iso, []).append(entry)

            for kw in find_keywords(fname + " " + folder_rel):
                keyword_index.setdefault(kw, []).append(entry)

            count += 1


    # Link category keywords to ALL matching files (by filename/folder search)
    for kws in KEYWORD_CATEGORIES.values():
        for kw in kws:
            for entry in manifest:
                fname_folder = (entry.get('filename', '') + ' ' + entry.get('folder', '')).lower()
                if kw.lower() in fname_folder:
                    keyword_index.setdefault(kw, []).append(entry)
                # Also add individual words from multi-word keywords
                for word in kw.split():
                    if len(word) > 2 and word.lower() in fname_folder:
                        keyword_index.setdefault(word, []).append(entry)

    manifest.sort(key=lambda e: e["path"])

    with open(ROOT / "Forensic_manifest.json", "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    with open(ROOT / "date_index.json", "w", encoding="utf-8") as f:
        json.dump(date_index, f, indent=2, ensure_ascii=False)
    with open(ROOT / "keyword_index.json", "w", encoding="utf-8") as f:
        json.dump(keyword_index, f, indent=2, ensure_ascii=False)

    print(f"Indexed {count} files.")
    print(f"Date buckets: {len(date_index)}")
    print(f"Keywords matched: {len(keyword_index)}")

if __name__ == "__main__":
    main()

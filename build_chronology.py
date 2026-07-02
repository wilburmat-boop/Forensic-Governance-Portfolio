#!/usr/bin/env python3
"""
Builds a regulator-specific chronology from converted evidence text files.
For each dated line in each file, extracts surrounding context and tags
any named individuals mentioned nearby, then outputs a sorted timeline.

Usage:
    python3 build_chronology.py CMS
    python3 build_chronology.py HPCSA
    python3 build_chronology.py SAHRC
    (etc. - regulator name must match a ~/regulator_<NAME>.txt file)

Outputs (in current directory):
    regulator_<NAME>_chronology.md   - human-readable timeline
    regulator_<NAME>_index.json      - structured data for the Evidence Vault
"""

import sys
import os
import re
import json
from pathlib import Path
from datetime import date

HOME = Path.home()

# Known individuals in the matter - extend this list as new names surface
KNOWN_PEOPLE = [
    "Jason Whyte", "Frances Barker", "Deneys Reitz", "Ntabiseng Ngwane",
    "Vusumzi Landu", "Monwabisi Kula", "Gerald Van Wyk", "Anna Mokgokong",
    "Farzaana Ismail", "Nicola Hanekom", "Ruanne David", "Lebo Tshabalala",
    "Lisa Mari", "Cheryl-Dawn Modern", "Marco Van Der Walt",
    "Wilbur Matthee", "Wilbur William Matthee", "Mary-Ann Jones",
]

MONTHS = {
    "jan": 1, "january": 1, "feb": 2, "february": 2, "mar": 3, "march": 3,
    "apr": 4, "april": 4, "may": 5, "jun": 6, "june": 6, "jul": 7, "july": 7,
    "aug": 8, "august": 8, "sep": 9, "sept": 9, "september": 9,
    "oct": 10, "october": 10, "nov": 11, "november": 11, "dec": 12, "december": 12,
}

# Matches: "12 December 2025", "1 Feb 2026", "December 12, 2025", "2026-02-01"
DATE_PATTERNS = [
    re.compile(r'\b(\d{1,2})\s+(' + "|".join(MONTHS.keys()) + r')\.?\s+(\d{4})\b', re.IGNORECASE),
    re.compile(r'\b(' + "|".join(MONTHS.keys()) + r')\.?\s+(\d{1,2}),?\s+(\d{4})\b', re.IGNORECASE),
    re.compile(r'\b(\d{4})-(\d{2})-(\d{2})\b'),
]

def parse_date(match, pattern_index):
    try:
        if pattern_index == 0:
            day, month_str, year = match.groups()
            month = MONTHS[month_str.lower()]
            return date(int(year), month, int(day))
        elif pattern_index == 1:
            month_str, day, year = match.groups()
            month = MONTHS[month_str.lower()]
            return date(int(year), month, int(day))
        else:
            year, month, day = match.groups()
            return date(int(year), int(month), int(day))
    except (ValueError, KeyError):
        return None

def find_names_nearby(text):
    found = []
    for name in KNOWN_PEOPLE:
        if name.lower() in text.lower():
            found.append(name)
    return found

def extract_events(filepath):
    events = []
    try:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            lines = f.readlines()
    except Exception as e:
        print(f"  [SKIP] Could not read {filepath}: {e}")
        return events

    for i, line in enumerate(lines):
        for pidx, pattern in enumerate(DATE_PATTERNS):
            for match in pattern.finditer(line):
                d = parse_date(match, pidx)
                if not d:
                    continue
                # Build context: line before, this line, line after
                start = max(0, i - 1)
                end = min(len(lines), i + 2)
                context = " ".join(l.strip() for l in lines[start:end] if l.strip())
                context = re.sub(r'\s+', ' ', context).strip()
                if len(context) > 400:
                    context = context[:400] + "..."
                names = find_names_nearby(context)
                events.append({
                    "date": d.isoformat(),
                    "date_display": d.strftime("%d %b %Y"),
                    "file": Path(filepath).name,
                    "context": context,
                    "people": names,
                    "line_number": i + 1,
                })
    return events

def dedupe_events(events):
    """Remove near-duplicate events (same date + same file within a few lines)"""
    seen = set()
    deduped = []
    for e in sorted(events, key=lambda x: (x["file"], x["date"], x["line_number"])):
        key = (e["file"], e["date"])
        if key in seen:
            continue
        seen.add(key)
        deduped.append(e)
    return deduped

def main():
    if len(sys.argv) != 2:
        print("Usage: python3 build_chronology.py <REGULATOR_NAME>")
        print("Example: python3 build_chronology.py CMS")
        sys.exit(1)

    regulator = sys.argv[1].upper()
    filelist_path = HOME / f"regulator_{regulator}.txt"

    if not filelist_path.exists():
        print(f"[ERROR] {filelist_path} not found.")
        print(f"Run: grep -lri \"{regulator}\" ~/chronology_sources/*.txt > {filelist_path}")
        sys.exit(1)

    with open(filelist_path, "r") as f:
        filepaths = [line.strip() for line in f if line.strip()]

    print(f"Processing {len(filepaths)} files mentioning {regulator}...")

    all_events = []
    for fp in filepaths:
        events = extract_events(fp)
        all_events.extend(events)
        if events:
            print(f"  {Path(fp).name}: {len(events)} dated events found")

    all_events = dedupe_events(all_events)
    all_events.sort(key=lambda x: x["date"])

    print(f"\nTotal unique dated events for {regulator}: {len(all_events)}")

    # ---- Write JSON ----
    json_path = f"regulator_{regulator}_index.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(all_events, f, indent=2, ensure_ascii=False)
    print(f"Written: {json_path}")

    # ---- Write Markdown ----
    md_path = f"regulator_{regulator}_chronology.md"
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(f"# {regulator} — Chronological Evidence Timeline\n\n")
        f.write(f"*{len(all_events)} dated events extracted from {len(filepaths)} source documents.*\n\n")
        f.write("| Date | Event Context | People Named | Source |\n")
        f.write("|------|---------------|--------------|--------|\n")
        for e in all_events:
            people = ", ".join(e["people"]) if e["people"] else "—"
            context = e["context"].replace("|", "\\|")
            f.write(f"| {e['date_display']} | {context} | {people} | {e['file']} |\n")
    print(f"Written: {md_path}")

    print("\nNOTE: This is an automated first pass. Dates and context are extracted")
    print("mechanically and WILL include false positives (e.g. dates in legislation")
    print("references, or context that doesn't fully capture the event). Review")
    print("the markdown table before treating it as final evidentiary chronology.")

if __name__ == "__main__":
    main()

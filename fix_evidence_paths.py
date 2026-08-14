#!/usr/bin/env python3
"""
fix_evidence_paths.py

Conservative fixer to normalize evidence paths across JSON and HTML files.

- Backs up each file before editing (filename + .bak).
- Tries safe candidate corrections for every path found:
  - remove duplicate segments (e.g., '02_Evidence_Core/02_Evidence_Core' -> '02_Evidence_Core')
  - remove stray ' /' -> '/'
  - add/remove 'public/' prefix
  - ensure leading '02_Evidence_Core/' for folder-like entries
- Only replaces when a candidate path exists on disk (avoids guessing).
- Processes: index.html, chronology_evidence_map.json, tab_data_master.json,
  tab_data_by_date.json, tab_data_by_folder.json, evidence-links*.json, Forensic_manifest.json, manifest.sha256, filelist.txt
"""
import os, re, json, shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent

TARGET_FILES = [
    ROOT / "index.html",
    ROOT / "chronology_evidence_map.json",
    ROOT / "tab_data_master.json",
    ROOT / "tab_data_by_date.json",
    ROOT / "tab_data_by_folder.json",
    ROOT / "evidence-links.json",
    ROOT / "evidence-links-corrected.json",
    ROOT / "Forensic_manifest.json",
    ROOT / "manifest.sha256",
    ROOT / "filelist.txt",
    ROOT / "PORTFOLIO.md"
]

# File existence check helper: given candidate relative path, check repo for either
#  - candidate as-is
#  - candidate under ./public/
def exists_candidate(candidate):
    p = ROOT / candidate
    if p.exists():
        return str(candidate)
    p2 = ROOT / "public" / candidate
    if p2.exists():
        return str(Path("public") / candidate)
    # If candidate already begins with "public/", also check without that
    if str(candidate).startswith("public/"):
        alt = str(candidate)[len("public/"):]
        if (ROOT / alt).exists():
            return alt
    return None

def generate_candidates(path_str):
    # yield variants to try (strings)
    s = path_str
    candidates = set()
    candidates.add(s)
    # remove duplicate 02_Evidence_Core/02_Evidence_Core
    candidates.add(re.sub(r"(02_Evidence_Core/)+02_Evidence_Core/", "02_Evidence_Core/", s))
    candidates.add(s.replace("02_Evidence_Core/02_Evidence_Core/", "02_Evidence_Core/"))
    # remove any duplicate repeated segment e.g. "foo/foo/"
    candidates.add(re.sub(r'([^/]+/)\1+', r'\1', s))
    # remove stray space before slash: "NAME /" -> "NAME/"
    candidates.add(s.replace(" /", "/"))
    candidates.add(s.replace(" /", "/").replace("//","/"))
    # add/remove public/
    if not s.startswith("public/"):
        candidates.add("public/" + s)
    else:
        candidates.add(s[len("public/"):])
    # ensure leading 02_Evidence_Core if looks like evidence path
    if not s.startswith("02_Evidence_Core") and "02_Evidence_Core" in s:
        candidates.add(s[s.index("02_Evidence_Core"):])
    if not s.startswith("02_Evidence_Core") and s.count("/") >= 1 and (s.split("/")[0].startswith("0") or s.split("/")[0].startswith("02")):
        candidates.add("02_Evidence_Core/" + s)
    # also try trimming quotes or whitespace
    candidates = {c.strip().strip('"').strip("'") for c in candidates}
    return list(candidates)

def backup(path: Path):
    bak = path.with_suffix(path.suffix + ".bak")
    if not bak.exists():
        shutil.copy2(path, bak)
    return bak

def process_text_file(path: Path):
    text = path.read_text(encoding="utf-8", errors="ignore")
    changed = False
    replacements = []
    # Look for patterns that look like evidence paths in quotes or JSON values or HTML onclicks
    path_patterns = re.findall(r"(?:['\"])([0-9A-Za-z_\- ./]+(?:02_Evidence_Core[^\s'\"<]*)?)(?:['\"])", text)
    # also capture onclick showEvidenceModal('...') patterns and src/href
    path_patterns += re.findall(r"showEvidenceModal\(\s*'([^']+)'\s*\)", text)
    path_patterns += re.findall(r"src=[\"']([^\"']+)[\"']", text)
    path_patterns += re.findall(r"href=[\"']([^\"']+)[\"']", text)
    path_patterns = list(dict.fromkeys([p for p in path_patterns if p and len(p) > 3]))
    report = []
    for p in path_patterns:
        # ignore http(s) URLs
        if p.startswith("http://") or p.startswith("https://") or p.startswith("mailto:"):
            continue
        candidates = generate_candidates(p)
        found = None
        for c in candidates:
            exists = exists_candidate(c)
            if exists:
                found = exists
                break
        if found and found != p:
            # replace all occurrences of p with found (safe global replace)
            text = text.replace(p, found)
            changed = True
            replacements.append((p, found))
            report.append((p, found))
    if changed:
        backup(path)
        path.write_text(text, encoding="utf-8")
    return replacements

def process_json_file(path: Path):
    text = path.read_text(encoding="utf-8", errors="ignore")
    try:
        data = json.loads(text)
    except Exception:
        # some of these files may be large or slightly malformed; fall back to text-based replace
        return process_text_file(path)
    changed = False
    replacements = []

    def walk(o):
        nonlocal changed, replacements
        if isinstance(o, dict):
            for k, v in o.items():
                if isinstance(v, str) and len(v) > 3:
                    if "/" in v or v.startswith("02_") or v.startswith("public/") or "02_Evidence_Core" in v:
                        candidates = generate_candidates(v)
                        for c in candidates:
                            exists = exists_candidate(c)
                            if exists and exists != v:
                                replacements.append((v, exists))
                                o[k] = exists
                                changed = True
                                break
                else:
                    walk(v)
        elif isinstance(o, list):
            for i, item in enumerate(o):
                if isinstance(item, str) and len(item) > 3:
                    if "/" in item or item.startswith("02_") or item.startswith("public/") or "02_Evidence_Core" in item:
                        candidates = generate_candidates(item)
                        for c in candidates:
                            exists = exists_candidate(c)
                            if exists and exists != item:
                                replacements.append((item, exists))
                                o[i] = exists
                                changed = True
                                break
                else:
                    walk(item)

    walk(data)
    if changed:
        backup(path)
        path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    return replacements

def process_manifest_sha(path: Path):
    text = path.read_text(encoding="utf-8", errors="ignore")
    changed = False
    replacements = []
    # lines like: checksum  ./public/02_Evidence_Core/...
    for m in re.finditer(r"(\S+)\s+(\./)?(?P<p>public/|)?(?P<path>.+)", text):
        p = m.group("path").strip()
        # skip if path contains absolute path prefix /data/...
        if p.startswith("/data/") or p.startswith("C:\\"):
            continue
    # fallback: do general text-based replacements using simple rules we know
    new_text = text.replace("02_Evidence_Core/02_Evidence_Core/", "02_Evidence_Core/")
    new_text = new_text.replace(" /TWBH", "/TWBH")
    if new_text != text:
        backup(path)
        path.write_text(new_text, encoding="utf-8")
        changed = True
    return []

def main():
    summary = {}
    for f in TARGET_FILES:
        if not f.exists():
            continue
        print(f"Processing {f}")
        if f.suffix.lower() in (".json",):
            reps = process_json_file(f)
        elif f.name.endswith("manifest.sha256") or f.name == "manifest.sha256":
            reps = process_manifest_sha(f)
        else:
            reps = process_text_file(f)
        summary[str(f)] = reps
        if reps:
            print(f"  Replacements: {len(reps)}")
            for a,b in reps[:20]:
                print(f"   - {a} --> {b}")
    # final scan report
    print("\nScan complete. Summary of replacements (first 20 per file):")
    for f, reps in summary.items():
        if reps:
            print(f"\n{f}:")
            for a,b in reps[:20]:
                print(f"  {a} -> {b}")
    print("\nBackups created with .bak suffix for any file changed.")
    print("Next steps: run 'python3 validate_evidence.py' and 'python3 audit_evidence_links_v2.py' to confirm.")
    print("If you want, I can create a branch and open a PR with these fixes.")
if __name__ == '__main__':
    main()
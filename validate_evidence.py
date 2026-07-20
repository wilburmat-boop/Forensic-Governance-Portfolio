import json, os, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
PUBLIC = os.path.join(ROOT, "public")
errors = []
warnings = []

def load_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)

# 1. Check root vs public copies match, for every duplicated data file
pairs = ["chronology_crossref.json", "reference_map.json", "date_index.json"]
for name in pairs:
    root_path = os.path.join(ROOT, name)
    pub_path = os.path.join(PUBLIC, name)
    if not os.path.exists(root_path) or not os.path.exists(pub_path):
        continue
    root_data = open(root_path, encoding="utf-8").read()
    pub_data = open(pub_path, encoding="utf-8").read()
    if root_data != pub_data:
        errors.append(f"MISMATCH: {name} differs between root and public/ — the deployed copy may be stale.")

# 2. Check hash_manifest.sha256 exists in public/
if not os.path.exists(os.path.join(PUBLIC, "hash_manifest.sha256")):
    errors.append("MISSING: public/hash_manifest.sha256 does not exist — evidence hash verification will 404.")

# 3. Check every "file" path inside chronology_crossref.json actually exists under public/
chron_path = os.path.join(PUBLIC, "chronology_crossref.json")
if os.path.exists(chron_path):
    data = load_json(chron_path)
    for date_str, entries in data.items():
        for entry in entries:
            filepath = entry.get("file", "")
            if not filepath:
                warnings.append(f"UNMAPPED: {date_str} / {entry.get('ref','?')} has no file path yet.")
                continue
            full = os.path.join(PUBLIC, filepath)
            if not os.path.exists(full):
                errors.append(f"BROKEN PATH: {date_str} / {entry.get('ref','?')} -> {filepath}")

# 4. Check every entry inside reference_map.json points to a real file
ref_path = os.path.join(PUBLIC, "reference_map.json")
if os.path.exists(ref_path):
    data = load_json(ref_path)
    for code, ref in data.items():
        filepath = ref.get("file") if isinstance(ref, dict) else (ref[0] if ref else "")
        if not filepath:
            continue
        full = os.path.join(PUBLIC, filepath)
        if not os.path.exists(full):
            errors.append(f"BROKEN REFERENCE: {code} -> {filepath}")

# Report
print(f"Checked {len(pairs)} sync pairs, chronology + reference_map file paths.\n")
if warnings:
    print(f"⚠️  {len(warnings)} warning(s):")
    for w in warnings:
        print(f"  - {w}")
    print()
if errors:
    print(f"❌ {len(errors)} error(s):")
    for e in errors:
        print(f"  - {e}")
    sys.exit(1)
else:
    print("✅ All checks passed.")

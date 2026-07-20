import json, os

ROOT = os.path.dirname(os.path.abspath(__file__))
PUBLIC = os.path.join(ROOT, "public")
EVIDENCE = os.path.join(PUBLIC, "02_Evidence_Core")

# Build basename -> [full relative paths] map of every real file on disk
name_map = {}
for dirpath, _, files in os.walk(EVIDENCE):
    for fname in files:
        rel = os.path.relpath(os.path.join(dirpath, fname), PUBLIC)
        name_map.setdefault(fname, []).append(rel)

def resolve(old_path):
    if not old_path:
        return old_path, "empty"
    full = os.path.join(PUBLIC, old_path)
    if os.path.exists(full):
        return old_path, "ok"
    base = os.path.basename(old_path)
    matches = name_map.get(base, [])
    if len(matches) == 1:
        return matches[0], "fixed"
    elif len(matches) == 0:
        return old_path, "no_match"
    else:
        return old_path, f"ambiguous({len(matches)})"

def fix_file(path):
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    stats = {"ok": 0, "fixed": 0, "no_match": 0, "ambiguous": 0, "empty": 0}
    def walk(obj):
        if isinstance(obj, dict):
            if "file" in obj and isinstance(obj["file"], str):
                new_path, status = resolve(obj["file"])
                if status == "fixed":
                    print(f"  FIXED: {obj.get('ref','?')}: {obj['file']} -> {new_path}")
                    obj["file"] = new_path
                    stats["fixed"] += 1
                elif status == "no_match":
                    print(f"  NO MATCH: {obj.get('ref','?')}: {obj['file']}")
                    stats["no_match"] += 1
                elif status.startswith("ambiguous"):
                    print(f"  AMBIGUOUS: {obj.get('ref','?')}: {obj['file']} ({status})")
                    stats["ambiguous"] += 1
                elif status == "empty":
                    stats["empty"] += 1
                else:
                    stats["ok"] += 1
            for v in obj.values():
                walk(v)
        elif isinstance(obj, list):
            for item in obj:
                walk(item)
    walk(data)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    return stats

for name in ["chronology_crossref.json", "reference_map.json"]:
    path = os.path.join(PUBLIC, name)
    if os.path.exists(path):
        print(f"\n=== {name} ===")
        stats = fix_file(path)
        print(f"  Summary: {stats}")

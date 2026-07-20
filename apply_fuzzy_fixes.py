import json, os, re

ROOT = os.path.dirname(os.path.abspath(__file__))
PUBLIC = os.path.join(ROOT, "public")
EVIDENCE = os.path.join(PUBLIC, "02_Evidence_Core")

def tokenize(name):
    name = os.path.splitext(name)[0]
    name = re.sub(r'[^a-zA-Z0-9]+', ' ', name).lower()
    stop = {"gmail","re","fw","pdf","the","a","of","and","to","for","1","2","3"}
    return set(w for w in name.split() if len(w) > 1 and w not in stop)

all_files = []
for dirpath, _, files in os.walk(EVIDENCE):
    for fname in files:
        rel = os.path.relpath(os.path.join(dirpath, fname), PUBLIC)
        all_files.append((rel, tokenize(fname)))

def best_matches(old_path):
    full = os.path.join(PUBLIC, old_path)
    if os.path.exists(full):
        return None
    old_tokens = tokenize(os.path.basename(old_path))
    if not old_tokens:
        return []
    scored = []
    for rel, tokens in all_files:
        if not tokens:
            continue
        overlap = old_tokens & tokens
        score = len(overlap) / max(len(old_tokens), 1)
        if score > 0:
            scored.append((score, rel))
    scored.sort(key=lambda x: -x[0])
    return scored

AUTO_THRESHOLD = 0.85
manual_review = []

def fix_file(path):
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    applied = 0
    def walk(obj):
        nonlocal applied
        if isinstance(obj, dict):
            if "file" in obj and isinstance(obj["file"], str) and obj["file"]:
                matches = best_matches(obj["file"])
                if matches is None:
                    pass
                elif not matches:
                    manual_review.append((obj.get("ref","?"), obj["file"], "NO CANDIDATES FOUND — likely genuinely missing"))
                elif matches[0][0] >= AUTO_THRESHOLD:
                    old = obj["file"]
                    obj["file"] = matches[0][1]
                    applied += 1
                    print(f"  AUTO-FIXED [{matches[0][0]:.0%}]: {obj.get('ref','?')}: {old} -> {matches[0][1]}")
                else:
                    top = matches[:2]
                    manual_review.append((obj.get("ref","?"), obj["file"], f"low confidence, top candidate [{top[0][0]:.0%}] {top[0][1]}"))
            for v in obj.values():
                walk(v)
        elif isinstance(obj, list):
            for item in obj:
                walk(item)
    walk(data)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    return applied

total = 0
for name in ["chronology_crossref.json", "reference_map.json"]:
    path = os.path.join(PUBLIC, name)
    if os.path.exists(path):
        print(f"\n=== {name} ===")
        total += fix_file(path)

print(f"\n\n✅ Auto-fixed {total} entries at >={AUTO_THRESHOLD:.0%} confidence.")
print(f"\n⚠️  {len(manual_review)} entries need your review:")
for ref, old, note in manual_review:
    print(f"  - {ref}: {old}\n      -> {note}")

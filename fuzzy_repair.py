import json, os, re

ROOT = os.path.dirname(os.path.abspath(__file__))
PUBLIC = os.path.join(ROOT, "public")
EVIDENCE = os.path.join(PUBLIC, "02_Evidence_Core")

def tokenize(name):
    name = os.path.splitext(name)[0]
    name = re.sub(r'[^a-zA-Z0-9]+', ' ', name).lower()
    stop = {"gmail","re","fw","pdf","the","a","of","and","to","for","1","2","3"}
    return set(w for w in name.split() if len(w) > 1 and w not in stop)

# Build index of every real file: tokens -> relative path
all_files = []
for dirpath, _, files in os.walk(EVIDENCE):
    for fname in files:
        rel = os.path.relpath(os.path.join(dirpath, fname), PUBLIC)
        all_files.append((rel, tokenize(fname)))

def best_match(old_path):
    if not old_path:
        return None
    full = os.path.join(PUBLIC, old_path)
    if os.path.exists(full):
        return None  # already fine
    old_tokens = tokenize(os.path.basename(old_path))
    if not old_tokens:
        return None
    scored = []
    for rel, tokens in all_files:
        if not tokens:
            continue
        overlap = old_tokens & tokens
        score = len(overlap) / max(len(old_tokens), 1)
        if score > 0:
            scored.append((score, rel, overlap))
    scored.sort(key=lambda x: -x[0])
    return scored[:3]  # top 3 candidates

def scan_file(path):
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    results = []
    def walk(obj):
        if isinstance(obj, dict):
            if "file" in obj and isinstance(obj["file"], str) and obj["file"]:
                matches = best_match(obj["file"])
                if matches:
                    results.append((obj.get("ref","?"), obj["file"], matches))
            for v in obj.values():
                walk(v)
        elif isinstance(obj, list):
            for item in obj:
                walk(item)
    walk(data)
    return results

for name in ["chronology_crossref.json", "reference_map.json"]:
    path = os.path.join(PUBLIC, name)
    if os.path.exists(path):
        print(f"\n=== {name} ===")
        for ref, old, matches in scan_file(path):
            print(f"\n{ref}: {old}")
            for score, rel, overlap in matches:
                print(f"    [{score:.0%}] {rel}")
                print(f"          matched words: {sorted(overlap)}")

#!/usr/bin/env python3
"""Run from the repo root:  python3 build_manifest.py
Hashes every file listed in public/documents.json that exists in public/,
writes sha256 + bytes back into the manifest, and writes public/documents.sha256.txt
"""
import hashlib, json, os, sys

PUBLIC = os.path.join(os.path.expanduser("~"), "Forensic-Governance-Portfolio", "public") \
    if len(sys.argv) < 2 else sys.argv[1]
MANIFEST = os.path.join(PUBLIC, "documents.json")

with open(MANIFEST, encoding="utf-8") as f:
    data = json.load(f)

lines, missing = [], []
for d in data["documents"]:
    path = os.path.join(PUBLIC, d["file"])
    if not os.path.isfile(path):
        d["sha256"], d["bytes"] = None, None
        missing.append(d["file"])
        continue
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b""):
            h.update(chunk)
    d["sha256"], d["bytes"] = h.hexdigest(), os.path.getsize(path)
    lines.append(f'{d["sha256"]}  {d["file"]}')

with open(MANIFEST, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
with open(os.path.join(PUBLIC, "documents.sha256.txt"), "w") as f:
    f.write("\n".join(lines) + "\n")

print(f"hashed {len(lines)} files")
for m in missing:
    print("missing:", m)

#!/usr/bin/env python3
# rename_sanitize_filenames.py
# Scans a directory tree (default: dist) and renames file & directory names by:
# - stripping leading/trailing quotes and whitespace
# - collapsing repeated spaces
# - removing leading/trailing dots
# Produces a mapping file rename_map.json and prints a preview. Non-destructive: skips rename when target exists.

import os, json, re
from pathlib import Path

ROOT = Path('dist')  # change to 'public' if you prefer (but we copy dist->public first)
if not ROOT.exists():
    print(f"{ROOT} does not exist; exiting.")
    raise SystemExit(1)

mapping = {}
def sanitize_name(name):
    s = name.strip()
    # remove leading/trailing single/double quotes and smart quotes
    s = re.sub(r'^[\'\"\u2018\u2019\u201C\u201D]+', '', s)
    s = re.sub(r'[\'\"\u2018\u2019\u201C\u201D]+$', '', s)
    # collapse multiple whitespace into single space
    s = re.sub(r'\s+', ' ', s).strip()
    # remove leading/trailing dots
    s = s.strip('.')
    # remove zero-width spaces and nulls
    s = s.replace('\u200b','').replace('\x00','')
    return s

# Walk bottom-up so children are renamed before parents
for dirpath, dirnames, filenames in os.walk(ROOT, topdown=False):
    pdir = Path(dirpath)
    # files
    for fn in list(filenames):
        new_fn = sanitize_name(fn)
        if new_fn != fn:
            src = pdir / fn
            dst = pdir / new_fn
            if dst.exists():
                print(f"SKIP rename (target exists): {src} -> {dst}")
                continue
            print(f"RENAME: {src} -> {dst}")
            os.rename(src, dst)
            mapping[str(src)] = str(dst)
    # directories
    for d in list(dirnames):
        new_d = sanitize_name(d)
        if new_d != d:
            src = pdir / d
            dst = pdir / new_d
            if dst.exists():
                print(f"SKIP rename dir (target exists): {src} -> {dst}")
                continue
            print(f"RENAME DIR: {src} -> {dst}")
            os.rename(src, dst)
            mapping[str(src)] = str(dst)

# write mapping
with open('rename_map.json', 'w', encoding='utf-8') as f:
    json.dump(mapping, f, indent=2, ensure_ascii=False)
print("Done. Mapping written to rename_map.json")

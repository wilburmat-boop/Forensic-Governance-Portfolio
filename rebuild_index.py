import os, json, hashlib, re
from datetime import datetime

EVIDENCE_DIR = '/data/data/com.termux/files/home/Forensic-Governance-Portfolio/public/02_Evidence_Core'
REPO_ROOT = '/data/data/com.termux/files/home/Forensic-Governance-Portfolio'

def sha256_file(path):
    h = hashlib.sha256()
    try:
        with open(path, 'rb') as f:
            for chunk in iter(lambda: f.read(65536), b''):
                h.update(chunk)
        return h.hexdigest()
    except:
        return 'unreadable'

def extract_date(filename):
    months = {'jan':'01','feb':'02','mar':'03','apr':'04','may':'05','jun':'06',
               'jul':'07','aug':'08','sep':'09','oct':'10','nov':'11','dec':'12'}
    patterns = [
        r'(\d{4})[-_](\d{2})[-_](\d{2})',
        r'(\d{2})[-_](\d{2})[-_](\d{4})',
        r'(\d{1,2})[-_ ](jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[-_ ](\d{4})',
    ]
    for p in patterns:
        m = re.search(p, filename, re.IGNORECASE)
        if m:
            g = m.groups()
            if g[1].lower() in months:
                return f"{g[2]}-{months[g[1].lower()]}-{g[0].zfill(2)}"
            elif len(g[0]) == 4:
                return f"{g[0]}-{g[1]}-{g[2]}"
            else:
                return f"{g[2]}-{g[1]}-{g[0]}"
    return 'Undated'

def fmt_date(iso):
    try:
        return datetime.strptime(iso, '%Y-%m-%d').strftime('%d %b %Y')
    except:
        return iso

print("Scanning evidence files...")
date_index = {}
manifest = []
total = 0

for root, dirs, files in os.walk(EVIDENCE_DIR):
    dirs.sort()
    for filename in sorted(files):
        if filename.startswith('.') or filename == 'desktop.ini':
            continue
        filepath = os.path.join(root, filename)
        rel_path = os.path.relpath(filepath, EVIDENCE_DIR)
        sha = sha256_file(filepath)
        iso = extract_date(filename)
        display = fmt_date(iso)
        entry = {'path': rel_path, 'filename': filename, 'sha256': sha,
                 'folder': os.path.relpath(root, EVIDENCE_DIR), 'date_iso': iso}
        manifest.append(entry)
        if display not in date_index:
            date_index[display] = []
        date_index[display].append({'path': rel_path, 'filename': filename,
                                    'sha256': sha, 'folder': os.path.relpath(root, EVIDENCE_DIR)})
        total += 1
        if total % 50 == 0:
            print(f"  ...{total} files processed")

def sort_key(d):
    try: return datetime.strptime(d, '%d %b %Y')
    except: return datetime.min

sorted_di = dict(sorted(date_index.items(), key=lambda x: sort_key(x[0])))

for fname in ['date_index.json', 'dist/date_index.json']:
    with open(os.path.join(REPO_ROOT, fname), 'w', encoding='utf-8') as f:
        json.dump(sorted_di, f, ensure_ascii=False, indent=2)

for fname in ['Forensic_manifest.json', 'dist/Forensic_manifest.json']:
    with open(os.path.join(REPO_ROOT, fname), 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

print(f"\nDone: {total} files indexed across {len(sorted_di)} dates")

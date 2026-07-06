import os, json, hashlib, re

EVIDENCE_DIR = '/data/data/com.termux/files/home/Forensic-Governance-Portfolio/public/02_Evidence_Core'
REPO_ROOT = '/data/data/com.termux/files/home/Forensic-Governance-Portfolio'

REGULATORS = [
    'CCMA', 'JSE', 'FSCA', 'BBBEE', 'SAHRC', 'SANC', 'SAPC', 'SAPS', 'HPCSA',
    'CMS', 'Labour Court', 'High Court', 'Department of Employment',
    'GEMS', 'Medscheme', 'AfroCentric', 'Parliamentary'
]

def sha256_file(path):
    h = hashlib.sha256()
    try:
        with open(path, 'rb') as f:
            for chunk in iter(lambda: f.read(65536), b''):
                h.update(chunk)
        return h.hexdigest()
    except Exception:
        return 'unreadable'

def extract_keywords(filename, folder):
    keywords = set()
    haystack = f"{filename} {folder}".lower()

    for reg in REGULATORS:
        if reg.lower() in haystack:
            keywords.add(reg)

    folder_words = re.sub(r'[_\d]+', ' ', folder).strip()
    if folder_words:
        keywords.add(folder_words.split('/')[0].strip())

    doc_types = ['affidavit', 'complaint', 'disclosure', 'notice', 'referral',
                 'ruling', 'judgment', 'contract', 'statement', 'report', 'brief']
    for dt in doc_types:
        if dt in haystack:
            keywords.add(dt.capitalize())

    return keywords

print("Building keyword index...")
keyword_index = {}
total = 0

for root, dirs, files in os.walk(EVIDENCE_DIR):
    dirs.sort()
    for filename in sorted(files):
        if filename.startswith('.') or filename == 'desktop.ini':
            continue
        filepath = os.path.join(root, filename)
        rel_path = os.path.relpath(filepath, EVIDENCE_DIR)
        folder = os.path.relpath(root, EVIDENCE_DIR)
        sha = sha256_file(filepath)

        keywords = extract_keywords(filename, folder)
        entry = {'path': rel_path, 'filename': filename, 'sha256': sha, 'folder': folder}

        for kw in keywords:
            if not kw:
                continue
            keyword_index.setdefault(kw, []).append(entry)

        total += 1
        if total % 50 == 0:
            print(f"  ...{total} files processed")

for fname in ['public/keyword_index.json']:
    with open(os.path.join(REPO_ROOT, fname), 'w', encoding='utf-8') as f:
        json.dump(keyword_index, f, ensure_ascii=False, indent=2)

print(f"\nDone: {total} files indexed into {len(keyword_index)} keywords")

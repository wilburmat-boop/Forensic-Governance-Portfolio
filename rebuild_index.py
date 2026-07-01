import os, json, hashlib, datetime

EVIDENCE_DIR = '/data/data/com.termux/files/home/Forensic-Governance-Portfolio/dist/02_Evidence_Core'
OUTPUT_DATE = 'date_index.json'
OUTPUT_MANIFEST = 'Forensic_manifest.json'

def sha256_file(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(65536), b''):
            h.update(chunk)
    return h.hexdigest()

def get_date_from_name(filename):
    import re
    patterns = [
        r'(\d{4}[-_]\d{2}[-_]\d{2})',
        r'(\d{2}[-_]\d{2}[-_]\d{4})',
    ]
    for p in patterns:
        m = re.search(p, filename)
        if m:
            return m.group(1).replace('_','-')
    return None

print("Indexer ready — waiting for files to sync...")

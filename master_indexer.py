import os, pypdf, time

EVIDENCE_DIR = './02_Evidence_Core'
BRIEFS_DIR = './01_Executive_Briefs'
INDEX_FILE = os.path.join(BRIEFS_DIR, 'FINAL_PARLIAMENTARY_INDEX_JUNE2026.md')

if not os.path.exists(BRIEFS_DIR): os.makedirs(BRIEFS_DIR)

with open(INDEX_FILE, 'w', encoding='utf-8') as f:
    f.write('# MASTER PARLIAMENTARY EVIDENCE INDEX (JUNE 2026)\n\n')
    
    for root, dirs, files in os.walk(EVIDENCE_DIR):
        folder_name = os.path.basename(root)
        if folder_name == '02_Evidence_Core': continue
        
        f.write(f'## Category: {folder_name}\n')
        for file in sorted(files):
            filepath = os.path.join(root, file)
            print(f'Indexing: {file}')
            
            if file.lower().endswith('.pdf'):
                try:
                    reader = pypdf.PdfReader(filepath)
                    text = ' '.join([p.extract_text() for p in reader.pages[:1] if p.extract_text()])
                    summary = text[:100].replace('\n', ' ') + "..."
                    f.write(f'- **{file}**: {summary}\n')
                except:
                    f.write(f'- **{file}**: [Error reading PDF]\n')
            else:
                f.write(f'- **{file}**: [Attachment]\n')
        f.write('\n')
print(f'Success! Master Index created at {INDEX_FILE}')


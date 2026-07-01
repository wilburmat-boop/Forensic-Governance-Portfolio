import os
import json
import re

def create_asset_registry(assets_dir='Evidence_Core'):
    registry = {}
    valid_extensions = ('.pdf', '.docx', '.txt')
    if os.path.exists(assets_dir):
        for filename in os.listdir(assets_dir):
            if filename.lower().endswith(valid_extensions):
                key = filename.lower().split('_')[0]
                registry[key] = f"/{assets_dir}/{filename}"
    return registry

def inject_evidence_links(content, registry, manifest):
    def replace_tag(match):
        key = match.group(1).lower()
        if key in manifest:
            path = manifest[key]['file']
            anchor = manifest[key].get('anchor', '')
            return f"[{key}]({path}#{anchor})"
        elif key in registry:
            return f"[{key}]({registry[key]})"
        return f"[MISSING_EVIDENCE:{key}]"
    
    pattern = re.compile(r'\{\{evidence:(.*?)\}\}')
    return pattern.sub(replace_tag, content)

def main():
    registry = create_asset_registry()
    if os.path.exists('manifest.json'):
        with open('manifest.json', 'r') as f:
            manifest = json.load(f)
    else:
        manifest = {}
    
    test_text = "As per {{evidence:20260630}}, the audit is complete."
    processed = inject_evidence_links(test_text, registry, manifest)
    print(f"Test Result: {processed}")

if __name__ == "__main__":
    main()

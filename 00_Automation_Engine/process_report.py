import json
import sys
from main import inject_evidence_links, create_asset_registry

def process_document(input_file, output_file):
    registry = create_asset_registry()
    with open('manifest.json', 'r') as f:
        manifest = json.load(f)

    with open(input_file, 'r') as f:
        content = f.read()

    processed_content = inject_evidence_links(content, registry, manifest)

    with open(output_file, 'w') as f:
        f.write(processed_content)
    
    print(f"Report processed successfully: {output_file}")

if __name__ == "__main__":
    if len(sys.argv) > 2:
        process_document(sys.argv[1], sys.argv[2])
    else:
        print("Usage: python process_report.py <input.md> <output.md>")

import hashlib
import os
from datetime import datetime

def generate_sha256_hash(filepath):
    """Calculates the SHA-256 hash of a file's binary contents."""
    sha256 = hashlib.sha256()
    try:
        with open(filepath, "rb") as f:
            for block in iter(lambda: f.read(4096), b""):
                sha256.update(block)
        return sha256.hexdigest()
    except Exception as e:
        return f"ERROR: {e}"

def build_manifest(root_dirs, output_file="hash_manifest.sha256"):
    """Traverses specified directories and generates the immutable manifest."""
    with open(output_file, "w") as manifest:
        manifest.write("# CRYPTOGRAPHIC EVIDENCE MANIFEST\n")
        manifest.write("# Algorithm: SHA-256\n")
        manifest.write(f"# Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}\n")
        manifest.write("# ------------------------------------------------------------------\n\n")

        for d in root_dirs:
            if not os.path.exists(d):
                continue
            for subdir, _, files in os.walk(d):
                for file in sorted(files):
                    # Exclude the manifest itself and any hidden system files
                    if file == output_file or file.startswith('.'):
                        continue
                    
                    filepath = os.path.join(subdir, file)
                    file_hash = generate_sha256_hash(filepath)
                    
                    # Format: <HASH>  <FILEPATH> (Standard checksum format)
                    manifest.write(f"{file_hash}  {filepath}\n")

    print(f"Cryptographic manifest successfully generated: {output_file}")

if __name__ == "__main__":
    # Define the directories that must be mathematically enforced
    directories_to_hash = [
        "01_Executive_Briefs", 
        "02_Evidence_Core", 
        "03_Regulatory_Cross_Maps"
    ]
    build_manifest(directories_to_hash)

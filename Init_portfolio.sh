#!/bin/bash

# Define your directories
SOURCE_DIR="$HOME/downloads"
TARGET_DIR="$HOME/Forensic-Governance-Portfolio/02_Evidence_Core"

# Ensure the target directory exists
mkdir -p "$TARGET_DIR"

# Move and standardize files
for file in "$SOURCE_DIR"/*.pdf; do
    if [ -f "$file" ]; then
        timestamp=$(date +%Y%m%d)
        filename=$(basename "$file")
        mv "$file" "$TARGET_DIR/${timestamp}_${filename}"
        echo "Ingested and standardized: $filename"
    fi
done
#!/bin/bash
SOURCE_DIR="$HOME/downloads"
TARGET_DIR="$HOME/Forensic-Governance-Portfolio/02_Evidence_Core"
INDEX_FILE="$HOME/Forensic-Governance-Portfolio/keyword_index.json"

mkdir -p "$TARGET_DIR"

# Use nullglob to prevent errors if no files exist
shopt -s nullglob

for file in "$SOURCE_DIR"/*.{pdf,xlsx,csv,png}; do
    timestamp=$(date +%Y%m%d)
    filename=$(basename "$file")
    mv "$file" "$TARGET_DIR/${timestamp}_${filename}"

    # Log to your index
    echo "{\"date\": \"$timestamp\", \"file\": \"${timestamp}_${filename}\", \"narrative_link\": \"pending\"}" >> "$INDEX_FILE"
    echo "Ingested and standardized: $filename"
done

#!/bin/bash
# Define your directories
SOURCE_DIR="/sdcard/Download"
TARGET_DIR="$HOME/Forensic-Governance-Portfolio/Evidence_Core"

# Ensure the target directory exists
mkdir -p "$TARGET_DIR"

# Move and standardize files
shopt -s nullglob
for file in "$SOURCE_DIR"/*.{pdf,xlsx,csv,png}; do
    timestamp=$(date +%Y%m%d)
    filename=$(basename "$file")
    mv "$file" "$TARGET_DIR/${timestamp}_${filename}"
    
    # Log to your index
    echo "{\"date\": \"$timestamp\", \"file\": \"${timestamp}_${filename}\", \"narrative_link\": \"pending\"}" >> "$HOME/Forensic-Governance-Portfolio/keyword_index.json"
    echo "Ingested and standardized: $filename"
done

#!/bin/bash
# Define directories using the Termux storage symlink
SOURCE_DIR="$HOME/storage/downloads"
TARGET_DIR="$HOME/Forensic-Governance-Portfolio/Evidence_Core"
INDEX_FILE="$HOME/Forensic-Governance-Portfolio/keyword_index.json"

# Ensure the target directory exists
mkdir -p "$TARGET_DIR"

# Ingest and standardize
shopt -s nullglob
for file in "$SOURCE_DIR"/*.{pdf,xlsx,csv,png}; do
    timestamp=$(date +%Y%m%d)
    filename=$(basename "$file")

    # Move the file
    mv "$file" "$TARGET_DIR/${timestamp}_${filename}"

    # Log to the index
    echo "{\"date\": \"$timestamp\", \"file\": \"${timestamp}_${filename}\", \"narrative_link\": \"pending\"}" >> "$INDEX_FILE"
    echo "Ingested: $filename"
done


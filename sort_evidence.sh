#!/bin/bash
SOURCE_DIR="02_Evidence_Core"

echo "Checking files in $SOURCE_DIR..."

for file in "$SOURCE_DIR"/*; do
    [ -d "$file" ] && continue
    filename=$(basename "$file")
    
    found=false
    for dir in "$SOURCE_DIR"/*/; do
        dirname=$(basename "$dir")
        
        # Check if the filename contains the directory name (case insensitive)
        if echo "$filename" | grep -qi "$dirname"; then
            echo "MATCH: Moving '$filename' to '$dirname'"
            mv "$file" "$dir"
            found=true
            break
        fi
    done
    
    if [ "$found" = false ]; then
        echo "No match found for: $filename"
    fi
done


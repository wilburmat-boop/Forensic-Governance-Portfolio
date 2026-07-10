#!/bin/bash
set -e
INPUT="$1"
if [ -z "$INPUT" ]; then
  echo "Usage: bash sync_folder.sh <drive_folder_name>"
  exit 1
fi

case "$INPUT" in
  "0_1_Regulators_R_S_A") FOLDER="0_1_Regulators_R_S_A " ;;
  "0_1_Parliamentary_Oversight") FOLDER="0_1_Parliamentary_Oversight " ;;
  *) FOLDER="$INPUT" ;;
esac

DEST="public/02_Evidence_Core/${INPUT}"
echo "=== Syncing '${FOLDER}' from Drive into ${DEST} ==="
mkdir -p "$DEST"
rclone copy "gdrive:${FOLDER}" "$DEST" -P

if git check-ignore -q "$DEST"; then
  echo "=== '${INPUT}' is intentionally excluded from GitHub (privacy/size). ==="
  echo "=== Google Drive remains the permanent backup for this folder. ==="
  read -p "Delete local phone copy now? (y/n): " CONFIRM
  if [ "$CONFIRM" = "y" ]; then
    rm -rf "$DEST"
    echo "Deleted local copy. Drive remains authoritative for this folder."
  fi
  echo "=== Done: ${INPUT} (not pushed to GitHub, by design) ==="
  exit 0
fi

echo "=== Re-indexing evidence (hashing all files, skipping excluded folders) ==="
python3 reindex_evidence.py

echo "=== Syncing manifests into public/ ==="
cp Forensic_manifest.json public/Forensic_manifest.json
cp date_index.json public/date_index.json
cp keyword_index.json public/keyword_index.json

echo "=== Committing ONLY this folder + manifests ==="
git add "$DEST" public/Forensic_manifest.json public/date_index.json public/keyword_index.json
git commit -m "sync: update ${INPUT} evidence from Google Drive, re-hashed and re-indexed"
git push origin main

echo "=== Push confirmed. Safe to delete local copy now. ==="
read -p "Delete local copy of ${DEST}? (y/n): " CONFIRM
if [ "$CONFIRM" = "y" ]; then
  rm -rf "$DEST"
  echo "Deleted local copy. File is safely on GitHub."
fi
echo "=== Done: ${INPUT} ==="

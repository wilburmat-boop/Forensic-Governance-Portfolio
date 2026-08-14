#!/usr/bin/env bash
set -euo pipefail

TIMESTAMP=$(date -u +"%Y%m%dT%H%M%SZ")
LOGDIR="$HOME/evidence_fix_logs_$TIMESTAMP"
mkdir -p "$LOGDIR"

echo "Logs will be written to: $LOGDIR"
echo "1) Copying dist/02_Evidence_Core -> public/02_Evidence_Core (if dist exists)"

if [ -d "dist/02_Evidence_Core" ]; then
  mkdir -p public/02_Evidence_Core
  # use rsync to preserve attributes and avoid overwriting identical files
  rsync -av --ignore-existing "dist/02_Evidence_Core/" "public/02_Evidence_Core/" > "$LOGDIR/rsync_dist_to_public.txt" 2>&1 || true
  echo "  rsync log: $LOGDIR/rsync_dist_to_public.txt"
else
  echo "  No dist/02_Evidence_Core found — skipping copy."
fi

echo "2) Running filename sanitiser (rename_sanitize_filenames.py) against dist/"
if [ -f rename_sanitize_filenames.py ]; then
  python3 rename_sanitize_filenames.py > "$LOGDIR/rename.txt" 2>&1 || true
  echo "  rename log: $LOGDIR/rename.txt"
else
  echo "  rename_sanitize_filenames.py not found. Please save it in repo root and re-run."
  exit 1
fi

echo "3) Running fix_evidence_paths.py (conservative fixer)"
if [ -f fix_evidence_paths.py ]; then
  python3 fix_evidence_paths.py > "$LOGDIR/fix_evidence_paths.txt" 2>&1 || true
  echo "  fix log: $LOGDIR/fix_evidence_paths.txt"
else
  echo "  fix_evidence_paths.py not found; aborting."
  exit 1
fi

echo "4) Running validate_evidence.py"
if [ -f validate_evidence.py ]; then
  python3 validate_evidence.py > "$LOGDIR/validate_evidence.txt" 2>&1 || true
  echo "  validate log: $LOGDIR/validate_evidence.txt"
else
  echo "  validate_evidence.py not found; skipping."
fi

echo "5) Running audit_evidence_links_v2.py"
if [ -f audit_evidence_links_v2.py ]; then
  python3 audit_evidence_links_v2.py > "$LOGDIR/audit_evidence_links_v2.txt" 2>&1 || true
  echo "  audit log: $LOGDIR/audit_evidence_links_v2.txt"
else
  echo "  audit_evidence_links_v2.py not found; skipping."
fi

echo
echo "SUMMARY of what was generated:"
echo "  - Rename mapping (rename_map.json) (if any renames occurred)"
[ -f rename_map.json ] && echo "    rename_map.json exists (size: $(stat -c%s rename_map.json) bytes)" || echo "    rename_map.json not created"
echo "  - Number of .bak backups created:"
find . -type f -name '*.bak' | wc -l | sed -n '1p'

echo
echo "TOP of logs (fix, rename, audit). Review before committing:"
echo "---- fix_evidence_paths (first 200 lines) ----"
sed -n '1,200p' "$LOGDIR/fix_evidence_paths.txt" || true
echo
echo "---- rename (first 200 lines) ----"
sed -n '1,200p' "$LOGDIR/rename.txt" || true
echo
echo "---- audit (first 200 lines) ----"
sed -n '1,200p' "$LOGDIR/audit_evidence_links_v2.txt" || true

echo
echo "Working tree status (short):"
git status --porcelain || true

read -p "Would you like to create a branch and commit these changes? (y/N): " confirm
confirm=${confirm:-N}
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Aborting commit. Logs remain in $LOGDIR. Inspect rename_map.json and logs, then run the script again to commit."
  exit 0
fi

BRANCH="fix/evidence-paths-$TIMESTAMP"
echo "Creating branch $BRANCH and committing changes..."
git checkout -b "$BRANCH"
git add -A
git commit -m "Normalize evidence paths, sanitize filenames and copy dist evidence to public/02_Evidence_Core (backups preserved). See logs: $LOGDIR" || {
  echo "No changes to commit or commit failed."
  exit 1
}
git push -u origin "$BRANCH"
echo "Pushed branch $BRANCH. You can now open a PR from this branch."

echo "Done. Logs: $LOGDIR. Review carefully before merging."
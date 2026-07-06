#!/data/data/com.termux/files/usr/bin/bash
set -e
BATCH_SIZE=40
BATCH_NUM=0
TMPDIR="$HOME/.tmp_batches"
mkdir -p "$TMPDIR"
rm -f "$TMPDIR"/batch_* "$TMPDIR"/files_null.txt

git status --porcelain -z | cut -z -c4- > "$TMPDIR/files_null.txt"
split -t '\0' -l $BATCH_SIZE "$TMPDIR/files_null.txt" "$TMPDIR/batch_"

for batch_file in "$TMPDIR"/batch_*; do
  BATCH_NUM=$((BATCH_NUM + 1))
  echo "=== Batch $BATCH_NUM ==="
  tr '\0' '\n' < "$batch_file" | sed '/^$/d' | while IFS= read -r f; do
    git add -- "$f"
  done
  git commit -m "Add evidence batch $BATCH_NUM" --quiet
  echo "Committed batch $BATCH_NUM, pushing..."
  git push origin main
  echo "Batch $BATCH_NUM pushed successfully"
done

rm -f "$TMPDIR"/batch_* "$TMPDIR/files_null.txt"
echo "ALL BATCHES COMPLETE"

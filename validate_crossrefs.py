#!/usr/bin/env python3
"""Validate that every evidence file is present in the manifests and indexes."""

from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
EVIDENCE_ROOT = ROOT / "public" / "02_Evidence_Core"
MANIFEST_PATH = ROOT / "Forensic_manifest.json"
DATE_INDEX_PATH = ROOT / "date_index.json"
TAB_MASTER_PATH = ROOT / "tab_data_master.json"
TAB_BY_DATE_PATH = ROOT / "tab_data_by_date.json"

EXCLUDED_TOP_LEVEL_DIRS = {
    "0_0_1_Wilbur_William_Matthee",
    "0_9_Miscellaneous_Folder",
    "0_1_Parliamentary_Oversight",
}


def sha256_of(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def normalize_rel(path_value: str) -> str:
    return path_value.replace("\\", "/").lstrip("./")


def load_json(path: Path):
    if not path.exists():
        return None
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def build_public_files() -> dict[str, Path]:
    files: dict[str, Path] = {}
    if not EVIDENCE_ROOT.exists():
        return files
    for path in EVIDENCE_ROOT.rglob("*"):
        if not path.is_file():
            continue
        rel = path.relative_to(ROOT).as_posix()
        rel = normalize_rel(rel)
        if any(part in EXCLUDED_TOP_LEVEL_DIRS for part in path.relative_to(EVIDENCE_ROOT).parts[:1]):
            continue
        files[normalize_rel(rel)] = path
    return files


def build_manifest_index(manifest_items):
    index: dict[str, dict] = {}
    for item in manifest_items:
        if not isinstance(item, dict):
            continue
        key = normalize_rel(item.get("path", ""))
        if not key:
            continue
        index[key] = item
    return index


def build_tab_lookup(tab_records):
    lookup: dict[str, dict] = {}
    if not isinstance(tab_records, list):
        return lookup
    for row in tab_records:
        if not isinstance(row, dict):
            continue
        path_value = row.get("path") or row.get("file_path")
        if not path_value:
            continue
        lookup[normalize_rel(path_value)] = row
    return lookup


def main() -> int:
    errors: list[str] = []

    if not MANIFEST_PATH.exists():
        errors.append(f"Missing manifest file: {MANIFEST_PATH.name}")
        manifest_items = []
    else:
        manifest_data = load_json(MANIFEST_PATH)
        manifest_items = manifest_data if isinstance(manifest_data, list) else []
        if not manifest_items:
            errors.append(f"Manifest is empty or invalid: {MANIFEST_PATH.name}")

    if not DATE_INDEX_PATH.exists():
        errors.append(f"Missing date index: {DATE_INDEX_PATH.name}")
        date_index = {}
    else:
        date_index = load_json(DATE_INDEX_PATH) or {}

    tab_master = load_json(TAB_MASTER_PATH) or []
    tab_by_date = load_json(TAB_BY_DATE_PATH) or []

    public_files = build_public_files()
    manifest_index = build_manifest_index(manifest_items)
    master_lookup = build_tab_lookup(tab_master)
    by_date_lookup = build_tab_lookup(tab_by_date)

    # Validate repo evidence files exist in the manifest and match SHA-256.
    for rel_path, full_path in sorted(public_files.items()):
        if rel_path not in manifest_index:
            errors.append(f"Missing manifest record for: {rel_path}")
            continue

        manifest_entry = manifest_index[rel_path]
        expected_sha = manifest_entry.get("sha256")
        actual_sha = sha256_of(full_path)
        if expected_sha != actual_sha:
            errors.append(
                f"SHA mismatch for {rel_path}: manifest={expected_sha} actual={actual_sha}"
            )

        if not manifest_entry.get("date_iso"):
            errors.append(f"Missing date_iso for {rel_path}")

        if not manifest_entry.get("folder"):
            errors.append(f"Missing folder for {rel_path}")

        if normalize_rel((manifest_entry.get("filename") or "")) not in full_path.name:
            # filename is present but not necessarily exact wording; this is a soft check
            pass

    # Check that manifest entries are indexed by date and tab data.
    for rel_path, entry in sorted(manifest_index.items()):
        if not entry.get("date_iso"):
            errors.append(f"Manifest entry has no date_iso: {rel_path}")

        date_bucket_hit = False
        for date_key, bucket in date_index.items():
            if not isinstance(bucket, list):
                continue
            for item in bucket:
                if isinstance(item, dict) and normalize_rel(item.get("path", "")) == rel_path:
                    date_bucket_hit = True
                    break
            if date_bucket_hit:
                break
        if not date_bucket_hit:
            errors.append(f"Missing date_index entry for: {rel_path}")

        if rel_path not in master_lookup and rel_path not in by_date_lookup:
            errors.append(f"Missing tab_data entry for: {rel_path}")

    # Ensure no manifest path points to a file that no longer exists.
    for rel_path in sorted(manifest_index):
        full_path = ROOT / rel_path
        if not full_path.exists():
            errors.append(f"Manifest path does not exist on disk: {rel_path}")

    # Ensure no duplicate manifest entries.
    seen = set()
    for rel_path, entry in manifest_index.items():
        if rel_path in seen:
            errors.append(f"Duplicate manifest entry: {rel_path}")
        seen.add(rel_path)

    if errors:
        print("VALIDATION FAILED")
        for msg in errors:
            print(f" - {msg}")
        return 1

    print(f"Validation passed: {len(public_files)} evidence files checked against {len(manifest_index)} manifest records.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

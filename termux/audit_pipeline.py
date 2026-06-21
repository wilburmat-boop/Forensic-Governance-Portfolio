import os
import hashlib
from datetime import datetime
from rich.console import Console
from rich.table import Table

console = Console()

class PortfolioAuditEngine:
    def __init__(self, target_dir="."):
        self.target_dir = target_dir
        self.manifest_path = os.path.join(target_dir, "poe_audit_manifest.txt")

    def generate_sha256(self, file_path):
        """Calculates a secure SHA-256 hash of a file by reading it in chunks."""
        sha256_hash = hashlib.sha256()
        try:
            with open(file_path, "rb") as f:
                for byte_block in iter(lambda: f.read(65536), b""):
                    sha256_hash.update(byte_block)
            return sha256_hash.hexdigest()
        except Exception as e:
            return f"ERROR: {str(e)}"

    def run_audit(self):
        """Scans the directory, generates hashes, and updates the PoE ledger."""
        console.print("\n[bold cyan]⚡ Initializing Portfolio of Evidence (PoE) Audit Engine...[/bold cyan]")
        
        excluded_files = ["audit_pipeline.py", "poe_audit_manifest.txt", "audit_manifest.sha256"]
        files_to_audit = [
            f for f in os.listdir(self.target_dir)
            if os.path.isfile(os.path.join(self.target_dir, f)) and f not in excluded_files
        ]

        if not files_to_audit:
            console.print("[yellow]⚠ No portfolio source documents found to audit.[/yellow]")
            return

        table = Table(title=f"PoE Forensic Audit Trail — {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        table.add_column("Document / File Name", style="magenta", no_wrap=False)
        table.add_column("Cryptographic SHA-256 Fingerprint", style="bold green")
        
        manifest_lines = []

        for file_name in sorted(files_to_audit):
            full_path = os.path.join(self.target_dir, file_name)
            file_hash = self.generate_sha256(full_path)
            
            table.add_row(file_name, file_hash)
            manifest_lines.append(f"{file_hash}  {file_name}\n")

        with open(self.manifest_path, "w", encoding="utf-8") as f:
            f.writelines(manifest_lines)

        console.print(table)
        console.print(f"[bold green]✔ Compliance manifest successfully compiled -> {self.manifest_path}[/bold green]\n")

if __name__ == "__main__":
    engine = PortfolioAuditEngine()
    engine.run_audit()

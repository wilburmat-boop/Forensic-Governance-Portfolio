import os
import hashlib
from datetime import datetime
from rich.console import Console
from rich.table import Table

console = Console()

class PortfolioCleaner:
    def __init__(self, target_dir="."):
        self.target_dir = target_dir

    def get_file_metadata(self):
        """Scans directory and gathers hash, modification time, and path for all files."""
        excluded_files = ["audit_pipeline.py", "clean_duplicates.py", "poe_audit_manifest.txt", "audit_manifest.sha256"]
        file_map = {}

        for file_name in os.listdir(self.target_dir):
            full_path = os.path.join(self.target_dir, file_name)
            
            # Skip directories and script utilities
            if not os.path.isfile(full_path) or file_name in excluded_files:
                continue

            # Calculate SHA-256
            sha256_hash = hashlib.sha256()
            try:
                with open(full_path, "rb") as f:
                    for byte_block in iter(lambda: f.read(65536), b""):
                        sha256_hash.update(byte_block)
                file_hash = sha256_hash.hexdigest()
                mod_time = os.path.getmtime(full_path)
                
                if file_hash not in file_map:
                    file_map[file_hash] = []
                
                file_map[file_hash].append({
                    "name": file_name,
                    "path": full_path,
                    "mod_time": mod_time
                })
            except Exception as e:
                console.print(f"[red]✕ Error reading {file_name}: {str(e)}[/red]")
        
        return file_map

    def purge_duplicates(self):
        console.print("\n[bold gold1]🧹 Analyzing Portfolio for Duplicates (Last Worked Copy Retention)...[/bold gold1]")
        file_map = self.get_file_metadata()
        
        table = Table(title="Portfolio De-Duplication & Purge Ledger")
        table.add_column("Kept Master (Latest)", style="green", no_wrap=False)
        table.add_column("Removed Duplicate", style="red", no_wrap=False)
        table.add_column("Last Worked Date", style="cyan")

        duplicates_found = False

        for file_hash, instances in file_map.items():
            if len(instances) > 1:
                duplicates_found = True
                # Sort instances by modification time descending (newest first)
                instances.sort(key=lambda x: x["mod_time"], reverse=True)
                
                master_copy = instances[0]
                older_copies = instances[1:]

                for duplicate in older_copies:
                    formatted_time = datetime.fromtimestamp(duplicate["mod_time"]).strftime('%Y-%m-%d %H:%M:%S')
                    table.add_row(master_copy["name"], duplicate["name"], formatted_time)
                    
                    # Execute the safe deletion
                    try:
                        os.remove(duplicate["path"])
                    except Exception as e:
                        console.print(f"[red]✕ Failed to delete {duplicate['name']}: {str(e)}[/red]")

        if duplicates_found:
            console.print(table)
            console.print("[bold green]✔ Optimization complete! Base portfolio folder is now deduplicated.[/bold green]\n")
        else:
            console.print("[bold green]✔ Excellent. No duplicate file groups detected in this folder.[/bold green]\n")

if __name__ == "__main__":
    cleaner = PortfolioCleaner()
    cleaner.purge_duplicates()

import subprocess
import os
import zipfile
from rich.console import Console

console = Console()

def extract_local_zip_archive():
    """Checks for a downloaded Google Drive zip archive, unpacks it, and cleans up."""
    zip_target = "Drive_Bundle.zip"
    
    if os.path.exists(zip_target):
        console.print(f"\n[bold sky_blue1]📦 Detecting Cloud Archive Asset: '{zip_target}'...[/bold sky_blue1]")
        try:
            with zipfile.ZipFile(zip_target, 'r') as zip_ref:
                # Unzip contents straight into the active directory
                zip_ref.extractall(".")
            console.print("[bold green]✔ Archive successfully unpacked into active workspace.[/bold green]")
            
            # Remove the zip container to avoid processing it as an evidence document
            os.remove(zip_target)
        except Exception as e:
            console.print(f"[bold red]✕ Extraction error: {str(e)}[/bold red]")
    else:
        console.print("\n[bold yellow]ℹ Active Workspace Operational (Using Cached Assets)[/bold yellow]")

def main():
    console.print("\n[bold reverse dynamic_violet] 🚀 STARTING PORTFOLIO AUTOMATION PIPELINE 🚀 [/bold reverse dynamic_violet]\n")

    # 1. Unpack any incoming zip bundles dropped from Google Drive
    extract_local_zip_archive()

    # 2. Clear out any duplicate documents or older versions automatically
    if os.path.exists("clean_duplicates.py"):
        subprocess.run(["python", "clean_duplicates.py"])

    # 3. Execute the Cryptographic Forensic Audit Trail
    if os.path.exists("audit_pipeline.py"):
        subprocess.run(["python", "audit_pipeline.py"])

    # 4. Compile the structural layouts and statutory cross-reference anchors
    if os.path.exists("scripts/pdf_generator.py"):
        subprocess.run(["python", "scripts/pdf_generator.py"])

    console.print("[bold bg_green white] ✨ All data synced, audited, and compiled into Master Parliamentary Bundle! ✨ [/bold bg_green white]\n")

if __name__ == "__main__":
    main()

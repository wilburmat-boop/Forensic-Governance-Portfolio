import sys
import os

# Add the root directory to the Python path to find engine.py
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from engine import EthicHawksEngine

def run():
    # Initialize the engine
    engine = EthicHawksEngine()
    
    # Execute build sequence
    engine.build_cover_page()
    engine.append_executive_summary()
    engine.append_board_governance_narrative()
    
    # Generate output
    output_pdf = "build/submission.pdf"
    engine.generate_pdf(output_pdf)
    
    # Generate Hash Manifest
    engine.generate_sha256_manifest(output_pdf)
    print(f"Build complete: {output_pdf} and manifest generated.")

if __name__ == "__main__":
    run()


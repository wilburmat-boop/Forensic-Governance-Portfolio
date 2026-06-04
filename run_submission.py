from engine import EthicHawksEngine

engine = EthicHawksEngine()

# Start with a clean file
with open("PORTFOLIO.md", "w") as f:
    f.write("# PORTFOLIO OF EVIDENCE\n\n")
    f.write("## Table of Contents\n")
    f.write("- [II. Executive Summary](#ii-executive-summary)\n")
    f.write("- [XIII. Board Governance](#xiii-board-governance-and-compliance-oversight)\n")
    f.write("- [XIV. Regulator Escalation](#xiv-regulator-escalation-and-documentary-evidence)\n")
    f.write("- [XV. SHA-256 Audit Log](#xv-evidence-integrity-and-sha-256-audit-log)\n")
    f.write("- [XVI. SAHRC Update](#xvi-sahrc-forensic-update-and-systemic-failure)\n")
    f.write("- [XVII. Supplementary Evidence](#xvii-supplementary-evidence-dossier)\n\n---\n")

# Execute complete build sequence
print("\n[🚀] STARTING FORENSIC GOVERNANCE PORTFOLIO BUILD SEQUENCE\n")
engine.build_cover_page()
engine.append_executive_summary()
engine.append_board_governance_narrative()
engine.append_regulator_escalation_narrative()
engine.append_sha256_audit_narrative()
engine.append_sahrc_update_narrative()
engine.append_final_evidence_dossier()

print("\n[📝] GENERATING CRYPTOGRAPHIC INTEGRITY MANIFEST\n")
engine.generate_hash_manifest()

print("\n[✅] Portfolio successfully built for parliamentary submission.")
print("\n[📄] Output files:")
print("  - PORTFOLIO.md (markdown document)")
print("  - hash_manifest.sha256 (cryptographic chain-of-custody)")
print("\n[⚡] Build process complete.")

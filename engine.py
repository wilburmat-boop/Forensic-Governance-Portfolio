class EthicHawksEngine:
    def __init__(self):
        self.output_file = "PORTFOLIO.md"

    def build_cover_page(self):
        print("[⚡] Building Formal Portfolio Cover Page...")
        with open(self.output_file, "r+") as f:
            content = f.read()
            cover = "---\n# ETHICHAWKS FORENSIC GOVERNANCE\n## Formal Parliamentary Submission: Case WECT24486-25\n\n**Prepared By:** Sr. Wilbur William Matthee\n**Designation:** Founder, EthicHawks Forensic Governance & Compliance\n**Date:** June 2026\n**Status:** Verified, Hash-Audited Evidence Dossier\n---\n\n"
            f.seek(0, 0)
            f.write(cover + content)

    def append_table_of_contents(self):
        print("[⚡] Generating Table of Contents...")
        with open(self.output_file, "r+") as f:
            content = f.read()
            f.seek(0, 0)
            f.write("# PORTFOLIO OF EVIDENCE\n\n## Table of Contents\n- [XIII. Board Governance](#xiii-board-governance-and-compliance-oversight)\n- [XIV. Regulator Escalation](#xiv-regulator-escalation-and-documentary-evidence)\n- [XV. SHA-256 Audit Log](#xv-evidence-integrity-and-sha-256-audit-log)\n- [XVI. SAHRC Update](#xvi-sahrc-forensic-update-and-systemic-failure)\n- [XVII. Supplementary Evidence](#xvii-supplementary-evidence-dossier)\n\n---\n" + content)

    def append_board_governance_narrative(self):
        with open(self.output_file, "a", encoding="utf-8") as f:
            f.write("\n## XIII. BOARD GOVERNANCE AND COMPLIANCE OVERSIGHT\n\nThis section details the failures in fiduciary duty and the resulting impact on institutional governance.\n\n[⬆ Back to Table of Contents](#table-of-contents)\n")

    def append_regulator_escalation_narrative(self):
        with open(self.output_file, "a", encoding="utf-8") as f:
            f.write("\n## XIV. REGULATOR ESCALATION AND DOCUMENTARY EVIDENCE\n\nThe dispute is evidenced by the following primary documentation:\n- **NRE1 - Notification of Regulator Escalation – CCMA Case WECT24486‑25_2.pdf**[span_0](start_span)[span_0](end_span)\n- **OCA1 - Urgent Response – Employer’s Objection to Con‑Arb (WECT24486‑25).pdf**[span_1](start_span)[span_1](end_span)\n- **ONE1 (To meet with perpetrator).pdf**[span_2](start_span)[span_2](end_span)\n- **Pilo1 - Fw_ Volunteer for Pilot Hybrid Working Arrangement.pdf**[span_3](start_span)[span_3](end_span)\n- **POL1 (24th Jul 2024).png**[span_4](start_span)[span_4](end_span)\n- **POL1_pdf (24th Jul 2024).png**[span_5](start_span)[span_5](end_span)\n- **PS1 (payslip june 2025).pdf**[span_6](start_span)[span_6](end_span)\n- **RM1 - RE_ Request for Time in Lieu for Year-End Functions.PDF.pdf**[span_7](start_span)[span_7](end_span)\n- **RPM1 (Leaving Work 21 May 2025).pdf**[span_8](start_span)[span_8](end_span)\n- **SCR1_v1 (Wilma screenshot).png**[span_9](start_span)[span_9](end_span)\n\n[⬆ Back to Table of Contents](#table-of-contents)\n")

    def append_sha256_audit_narrative(self):
        with open(self.output_file, "a", encoding="utf-8") as f:
            f.write("\n## XV. EVIDENCE INTEGRITY AND SHA-256 AUDIT LOG\n\n[SHA-256 Evidence Audit Verification Log](https://github.com/EthicHawks/Forensic-Governance/security/audit)\n\n[⬆ Back to Table of Contents](#table-of-contents)\n")

    def append_sahrc_update_narrative(self):
        with open(self.output_file, "a", encoding="utf-8") as f:
            f.write("\n## XVI. SAHRC FORENSIC UPDATE AND SYSTEMIC FAILURE\n\nThis section incorporates the formal update provided to the SAHRC on 13 March 2026[span_10](start_span)[span_10](end_span).\n\n[⬆ Back to Table of Contents](#table-of-contents)\n")

    def append_final_evidence_dossier(self):
        with open(self.output_file, "a", encoding="utf-8") as f:
            f.write("\n## XVII. SUPPLEMENTARY EVIDENCE DOSSIER\n\n- **SAHRC_ seriousness of situations**[span_11](start_span)[span_11](end_span)\n- **? complete_SAHRC_FinalUpdate_13March2026 (1).pdf**[span_12](start_span)[span_12](end_span)\n\n[⬆ Back to Table of Contents](#table-of-contents)\n")

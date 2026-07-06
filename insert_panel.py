with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

panel_html = '''
<div id="market-misrep" class="panel"><div class="container">
<h1>Market Misrepresentation - CIPC / FSCA / JSE Submission</h1>
<p style="color:#6b7280;font-size:0.9rem;">Source: EthicHawks Parliamentary Forensic Evidence Bundle, submitted July 2026 (CIPC | FSCA Ref 1-370127 | JSE Ref JvS/166792).</p>

<h2>Executive Overview</h2>
<p>This submission documents a material divergence between AfroCentric Group's statutory public disclosures - specifically the Integrated Annual Report (IAR) 2025 - and its documented internal operational conduct. It was submitted concurrently to the CIPC (Companies Act ss.162 and 214), the FSCA (Financial Markets Act s.81), the JSE (Listings Requirements and King IV), and National Parliament (Protected Disclosures Act; PFMA).</p>

<h2>CIPC Submission - Corporate Governance and Director Liability</h2>
<p><strong>Statutory basis:</strong> Sections 162 (Director Delinquency) and 214 (False Statements) of the Companies Act 71 of 2008.</p>
<p>The AfroCentric Group Integrated Annual Report 2025 makes several public representations - including an "independent whistleblowing hotline... without fear of reprisal," a "zero-tolerance approach to unethical conduct," "no significant regulatory breaches or fines," and "rigorous Board oversight of risk management." The evidentiary record establishes:</p>
<ul>
<li><strong>Institutional non-response:</strong> formal humanitarian and governance notices received no substantive response for over 30 days.</li>
<li><strong>Obstruction of internal governance access:</strong> a formal discrimination complaint (25 Sep 2025) was recorded as a "typo" and not escalated per published policy; the employee responsible was not reassigned.</li>
<li><strong>Characterisation of medical evidence in litigation:</strong> an opposing affidavit filed in the company's name characterised formally documented psychiatric illness as a "cynical excuse."</li>
</ul>
<p><strong>The Board oversight nexus:</strong> either the Board was aware of these failures and omitted them from the IAR (engaging s.214), or its oversight mechanisms failed to surface them at all (engaging s.162). Either way, the published IAR does not accurately represent the company's governance environment.</p>

<h2>FSCA and JSE Submission - Market Integrity and Disclosure Accuracy</h2>
<p><strong>Statutory basis:</strong> Financial Markets Act 19 of 2012 s.81 (false, misleading, or deceptive statements regarding a listed company); JSE Listings Requirements; King IV Principle 1.</p>
<ul>
<li><strong>Inaccurate risk profile:</strong> the IAR represents stable regulatory relationships and a functioning ethics infrastructure, contradicted by the documented record.</li>
<li><strong>Undisclosed patient safety risk:</strong> the Gexus-DMS integration gap had a related CMS investigation pending 100+ days at the time of the IAR's publication - a material undisclosed operational and regulatory risk.</li>
<li><strong>Unlawful salary deduction during disclosed medical crisis:</strong> a 40.47% deduction was executed following a disclosed psychiatric crisis, allegedly contravening BCEA s.34(2) - while the IAR simultaneously claims a robust mental health/wellbeing strategy.</li>
<li><strong>Undisclosed regulatory concentration risk:</strong> at the time of publication, 14+ regulatory bodies had been formally engaged regarding the company's conduct - not disclosed to the market.</li>
</ul>

<h2>Cross-Reference Statutory Matrix</h2>
<table>
<tr><th>IAR 2025 Public Claim</th><th>Documented Operational Reality</th><th>Statutory / Regulatory Reference</th></tr>
<tr><td>"Independent whistleblowing hotline... without fear of reprisal" (p.21)</td><td>Patient safety disclosure administratively reframed as insubordination; whistleblower protections not applied.</td><td>PDA 26 of 2000; King IV Principle 1</td></tr>
<tr><td>"Zero-tolerance approach to unethical conduct" (p.21)</td><td>25 Sep 2025 discrimination complaint not escalated; dismissed as a "typo"; hostile environment maintained.</td><td>EEA; Companies Act s.162</td></tr>
<tr><td>"Inclusive employment practices... equal participation" (p.39)</td><td>Discrimination complaint dismissed without substantive investigation or remedy.</td><td>EEA s.6; King IV Principle 8</td></tr>
<tr><td>"No significant regulatory breaches or fines" (p.21)</td><td>14+ regulatory bodies formally notified of systemic failures at time of publication, including CMS and SAHRC.</td><td>JSE Listings Requirements - Material Misrepresentation; FMA s.81</td></tr>
<tr><td>"Employee wellbeing strategy... emotional and mental wellbeing" (p.82)</td><td>40.47% salary deduction executed following disclosed psychiatric crisis, no written consent on file.</td><td>BCEA s.34(2); FMA s.81 - Misleading ESG Disclosure</td></tr>
<tr><td>"Continued engagement with policymakers and regulators"</td><td>Documented pattern of non-response and deflection across multiple regulatory institutions.</td><td>JSE Listings Requirements; King IV Principle 16</td></tr>
<tr><td>"Rigorous Board oversight of risk management and internal controls"</td><td>Governance escalations blocked at executive level; no demonstrable Board engagement for 30+ days.</td><td>Companies Act s.162 (Delinquency); s.214 (False Statements)</td></tr>
</table>

<h2>Forensic Audit Conclusion</h2>
<p>The discrepancies documented span employee relations, regulatory engagement, financial conduct, and clinical risk management. Viewed collectively and against the statutory frameworks they engage, they represent a structural failure of corporate governance warranting formal regulatory scrutiny - a matter of market integrity independent of the underlying employment dispute.</p>
<p style="color:#6b7280;font-size:0.85rem;"><em>Source: EthicHawks Parliamentary Forensic Evidence Bundle, 22 June 2026. Full annexures (A-E) available via the Evidence Vault.</em></p>
</div></div>
'''

body_close = content.rfind('</body>')
if body_close == -1:
    raise SystemExit("ERROR: could not find </body>")

content = content[:body_close] + panel_html + '\n' + content[body_close:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Panel inserted successfully before </body>.")

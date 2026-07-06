#!/bin/bash

# 1. Update User Guide to add Tab 10
sed -i '/Tab 9 – Marked Misrepresentation/a\
\
**Tab 10 – The Constitution**\
The Supreme Law of the Republic, including the Constitution, foundational legislation, and governing Acts. This tab contains:\
- Republic of South Africa Constitution (1996)\
- Companies Act 71 of 2008 (ss. 162, 214 — Director Accountability)\
- Labour Relations Act 66 of 1995 (Employment dispute resolution)\
- Protected Disclosures Act 26 of 2000 (Whistleblower protection)\
- Basic Conditions of Employment Act (Wage deductions, s. 34)\
- Financial Markets Act 19 of 2012 (s. 81 — Market integrity)\
- Public Finance Management Act 1 of 1999\
- National Health Insurance Act 20 of 2023\
- PAIA / Promotion of Access to Information Act 2 of 2000\
- And 7 additional foundational statutes.' PORTFOLIO_USER_GUIDE.md

echo "User Guide updated"

# 2. Rebuild and push
npm run build
git add -A
git commit -m "feat: add Constitution tab with 16 foundational Acts and glossary integration"
git push origin main

echo "Constitution tab deployed!"

# 1. Create the actual file (paste the content from the artifact I gave you)
nano public/data-service.js
# paste, save, exit

# 2. Undo the broken script tag reference for now? No — leave it, it'll resolve once step 1 is done.

# 3. Stage everything intentionally
git add public/data-service.js public/briefs-data.js index.html

# 4. Confirm what's staged before committing
git status

# 5. Commit and push
git commit -m "Add data-service.js loader and commit briefs-data.js"
git push

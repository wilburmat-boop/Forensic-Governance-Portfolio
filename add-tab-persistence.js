const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
const backup = html;
let changes = 0;

// 1. Save active tab to localStorage whenever showPanel runs
const old = `function showPanel(id, e) {
  document.querySelectorAll('.panel').forEach(function(p) { p.classList.remove('active'); });
  var target = document.getElementById(id);
  if (target) target.classList.add('active');
  document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
  if (e && (e.currentTarget || e.target)) { var btn = e.currentTarget || e.target; btn.classList.add('active'); }
}`;

const replacement = `function showPanel(id, e) {
  document.querySelectorAll('.panel').forEach(function(p) { p.classList.remove('active'); });
  var target = document.getElementById(id);
  if (target) target.classList.add('active');
  document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
  if (e && (e.currentTarget || e.target)) { var btn = e.currentTarget || e.target; btn.classList.add('active'); }
  try { localStorage.setItem('activeTab', id); } catch(err) {}
}

function restoreActiveTab() {
  try {
    var saved = localStorage.getItem('activeTab');
    if (saved && document.getElementById(saved)) {
      var btn = document.querySelector('.tab-btn[onclick*="' + saved + '"]');
      showPanel(saved, btn ? { currentTarget: btn } : null);
    }
  } catch(err) {}
}
document.addEventListener('DOMContentLoaded', restoreActiveTab);`;

if (html.includes(old)) {
  html = html.replace(old, replacement);
  changes++;
  console.log("✓ Tab persistence added — active tab now saved and restored on refresh");
} else {
  console.log("⚠ Anchor not found — no changes made");
}

if (changes === 1) {
  fs.writeFileSync('index.html.pre-tabpersist-backup', backup);
  fs.writeFileSync('index.html', html);
  console.log("Saved. Backup: index.html.pre-tabpersist-backup");
} else {
  console.log("No file written.");
}

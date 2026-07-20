// Find this in src/main.js and replace

OLD:
<a href="${fileUrl}" target="_blank" style="...">↗ Open PDF directly</a>

NEW:
<a href="${fileUrl.replace(/"/g, '%22')}" target="_blank" style="...">↗ Open PDF directly</a>

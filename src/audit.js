
(function() {
    // Check if DATE_INDEX exists and calculate total
    const totalInIndex = (typeof DATE_INDEX !== "undefined") 
        ? Object.values(DATE_INDEX).reduce((sum, arr) => sum + arr.length, 0) 
        : 0;

    // Count rendered elements
    const renderedPills = document.querySelectorAll(".date-pill, button, span").length;

    // Inject results to screen
    let auditBox = document.getElementById("audit-box");
    if (!auditBox) {
        auditBox = document.createElement("div");
        auditBox.id = "audit-box";
        auditBox.style.cssText = "position:fixed; top:50px; right:10px; background:red; color:white; padding:15px; z-index:99999; border:2px solid yellow;";
        document.body.appendChild(auditBox);
    }
    auditBox.innerText = "DATA AUDIT:\nTotal in DATE_INDEX: " + totalInIndex + "\nCurrently Rendered: " + renderedPills;
})();

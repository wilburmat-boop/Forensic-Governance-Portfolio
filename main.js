
// Function to handle clicking evidence references
function goToSource(refId) {
    fetch('reference_map.json')
        .then(response => response.json())
        .then(data => {
            const path = data[refId];
            if (path) {
                window.open(path, '_blank');
            } else {
                alert("Evidence reference " + refId + " not found in vault.");
            }
        })
        .catch(error => console.error('Error loading reference map:', error));
}

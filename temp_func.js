
function loadCustomDoc(url) {
    document.getElementById('readme-content').innerHTML = "Loading...";
    showPanel('readme-panel', event);
    fetch(url)
    .then(response => response.text())
    .then(text => {
        document.getElementById('readme-content').innerHTML = marked.parse(text);
    })
    .catch(err => {
        document.getElementById('readme-content').innerHTML = "Error loading document.";
    });
}

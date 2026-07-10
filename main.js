function showCommitteeBrief(briefId) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(briefId);
  if (target) {
    target.classList.add('active');
  } else {
    console.error("Panel not found for ID:", briefId);
  }
}

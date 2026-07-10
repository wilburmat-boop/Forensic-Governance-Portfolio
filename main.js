function showCommitteeBrief(briefId) {
  // Mapping logic to match button calls to your actual ID list
  const mapping = {
    'health': 'dashboard',
    'labour': 'labour-court',
    'trade': 'market-misrep',
    'justice': 'high-court',
    'scopa': 'part3',
    'police': 'defence'
  };
  
  const targetId = mapping[briefId] || briefId;
  
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(targetId);
  if (target) {
    target.classList.add('active');
  } else {
    console.error("Panel not found for ID:", targetId);
  }
}

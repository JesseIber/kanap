const idCommand = new URLSearchParams(window.location.search).get("commande");
const orderIdSpan = document.getElementById('orderId');
orderIdSpan.textContent = idCommand;
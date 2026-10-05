const fs = require('fs');
let content = fs.readFileSync('pages/checkout.vue', 'utf8');
content = content.replace(/.*Pedido Recibido!<\/h2>/, '<h2 class="text-3xl font-bold font-serif">¡Pedido Recibido!</h2>');
content = content.replace(/con [^\s]*xito\./, 'con éxito.');
content = content.replace(/<!-- Pantalla de [^\s]*xito -->/, '<!-- Pantalla de Éxito -->');
fs.writeFileSync('pages/checkout.vue', content, 'utf8');
console.log('done');

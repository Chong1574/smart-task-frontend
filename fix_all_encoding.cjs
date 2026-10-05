const fs = require('fs');
let content = fs.readFileSync('pages/checkout.vue', 'utf8');

// Fix ALL remaining broken UTF-8 characters in one pass
// Match any non-ASCII garbled sequences and replace known patterns
content = content.replace(/Quer[^\x00-\x7F]+taro/g, 'Querétaro');
content = content.replace(/Michoac[^\x00-\x7F]+n/g, 'Michoacán');
content = content.replace(/Le[^\x00-\x7F]+n/g, 'León');
content = content.replace(/Potos[^\x00-\x7F]+/g, 'Potosí');
content = content.replace(/Yucat[^\x00-\x7F]+n/g, 'Yucatán');
content = content.replace(/M[^\x00-\x7F]+xico/g, 'México');
content = content.replace(/Env[^\x00-\x7F]+o/g, 'Envío');
content = content.replace(/env[^\x00-\x7F]+o/g, 'envío');
content = content.replace(/M[^\x00-\x7F]+todo/g, 'Método');
content = content.replace(/[^\x00-\x7F]+Pedido/g, '¡Pedido');
content = content.replace(/[^\x00-\x7F]+xito/g, 'éxito');
content = content.replace(/Electr[^\x00-\x7F]+nico/g, 'Electrónico');
content = content.replace(/C[^\x00-\x7F]+digo/g, 'Código');
content = content.replace(/c[^\x00-\x7F]+digo/g, 'código');
content = content.replace(/N[^\x00-\x7F]+mero/g, 'Número');
content = content.replace(/direcci[^\x00-\x7F]+n/g, 'dirección');
content = content.replace(/inv[^\x00-\x7F]+lido/g, 'inválido');
content = content.replace(/Simulaci[^\x00-\x7F]+n/g, 'Simulación');
content = content.replace(/simulaci[^\x00-\x7F]+n/g, 'simulación');
content = content.replace(/fall[^\x00-\x7F]+,/g, 'falló,');
content = content.replace(/c[^\x00-\x7F]+ntrico/g, 'céntrico');
content = content.replace(/pesta[^\x00-\x7F]+a/g, 'pestaña');
content = content.replace(/informaci[^\x00-\x7F]+n/g, 'información');

fs.writeFileSync('pages/checkout.vue', content, 'utf8');

// Verify no broken chars remain
const result = fs.readFileSync('pages/checkout.vue', 'utf8');
const broken = result.match(/[\xC0-\xFF][\x80-\xBF]*/g);
if (broken) {
  console.log('WARNING: Still found non-ASCII sequences:', [...new Set(broken)].slice(0, 20));
} else {
  console.log('All clean!');
}
console.log('done');

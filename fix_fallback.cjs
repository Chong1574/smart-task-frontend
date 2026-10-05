const fs = require('fs');
let content = fs.readFileSync('pages/checkout.vue', 'utf8');

const oldBlockRegex = /if \(!response \|\| !response\.ok\) \{[\s\S]*?return;\s*\}/;
const newBlock = `if (!response || !response.ok) {
      throw new Error('No se pudo conectar con el servidor.');
    }`;

content = content.replace(oldBlockRegex, newBlock);
fs.writeFileSync('pages/checkout.vue', content, 'utf8');
console.log('done');

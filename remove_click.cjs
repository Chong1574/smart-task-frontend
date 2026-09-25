const fs = require('fs');
const files = ['pages/taskman/wallet.vue', 'pages/taskman/budget.vue', 'pages/taskman/wishlist.vue', 'layouts/taskman.vue'];
files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/ @click\.self="[^"]+"/g, '');
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});

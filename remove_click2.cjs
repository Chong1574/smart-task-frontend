const fs = require('fs');
const files = ['components/ConfirmDialog.vue', 'components/BazarProductDetail.vue'];
files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/ @click\.self="[^"]+"/g, '');
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});

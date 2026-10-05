const fs = require('fs');

function fix(path) {
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf8');
    
    const replacements = {
        'InformaciÃ³n': 'Información',
        'EnvÃ­o': 'Envío',
        'MÃ©todo': 'Método',
        'CÃ³digo': 'Código',
        'NÃºmero': 'Número',
        'NÃºmero': 'Número',
        'ProducciÃ³n': 'Producción',
        'mÃ¡ximo': 'máximo',
        'estÃ¡': 'está',
        'estÃ©': 'esté',
        'electrÃ³nico': 'electrónico',
        'tÃ©rminos': 'términos',
        'polÃ­tica': 'política',
        'AceptaciÃ³n': 'Aceptación',
        'DescripciÃ³n': 'Descripción',
        'ProtecciÃ³n': 'Protección',
        'AnalÃ­tica': 'Analítica',
        'ðŸ–¨ï¸': '🖨️',
        'tǸrminos': 'términos',
        'poltica': 'política',
        'poltica': 'política'
    };

    for (let [bad, good] of Object.entries(replacements)) {
        content = content.split(bad).join(good);
    }

    fs.writeFileSync(path, content, 'utf8');
    console.log('Fixed', path);
}

['pages/checkout.vue', 'pages/register.vue'].forEach(fix);

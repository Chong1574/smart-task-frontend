import io
import os

def fix_file(path):
    with io.open(path, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()

    # Manual mapping for common broken sequences observed in output
    content = content.replace('InformaciÃ³n', 'Información')
    content = content.replace('EnvÃ­o', 'Envío')
    content = content.replace('MÃ©todo', 'Método')
    content = content.replace('CÃ³digo', 'Código')
    content = content.replace('NÃºmero', 'Número')
    content = content.replace('ProducciÃ³n', 'Producción')
    content = content.replace('mÃ¡ximo', 'máximo')
    content = content.replace('estÃ¡', 'está')
    content = content.replace('estÃ©', 'esté')
    content = content.replace('electrÃ³nico', 'electrónico')
    content = content.replace('tÃ©rminos', 'términos')
    content = content.replace('polÃ­tica', 'política')
    content = content.replace('AceptaciÃ³n', 'Aceptación')
    content = content.replace('DescripciÃ³n', 'Descripción')
    content = content.replace('ProtecciÃ³n', 'Protección')
    content = content.replace('AnalÃ­tica', 'Analítica')
    
    content = content.replace('t?rminos', 'términos')
    content = content.replace('poltica', 'política')
    content = content.replace('M?todo', 'Método')
    content = content.replace('Envo', 'Envío')

    with io.open(path, 'w', encoding='utf-8') as f:
        f.write(content)

for f in ['pages/checkout.vue', 'pages/register.vue']:
    if os.path.exists(f):
        fix_file(f)
        print("Fixed " + f)

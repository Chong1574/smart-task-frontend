# -*- coding: utf-8 -*-
import json
import re

def update_code(js_code):
    # Add variantsInfo before prompt
    if "const variantsInfo =" not in js_code:
        js_code = js_code.replace(
            "const prompt = `Analiza",
            "const variantsInfo = (p.variants && p.variants.length > 0) ? p.variants.map((v, i) => `[${i+1}] ${v.name} (${v.grams}g, $${v.price})`).join(', ') : 'Ninguna';\n        const prompt = `Analiza"
        )
    
    # Update prompt string
    old_prompt_regex = r"const prompt = \`Analiza el.*?\}\`;"
    
    new_prompt = '''const prompt = \`Analiza el siguiente producto:
Título: \${p.title}
Descripción original: \${p.description?.slice(0, 500)}
Variantes (nombre, peso, precio): \${variantsInfo}

\${base64Image ? 'También te he adjuntado una imagen del producto físico final para que la analices.' : ''}

REGLA CRITICA DE NEGOCIO:
Tu eres una tienda online que vende el producto FISICO ya fabricado. 
El cliente final es un comprador normal, NO un maker. 
Por lo tanto, ESTA ESTRICTAMENTE PROHIBIDO mencionar terminos de impresion 3D como "facil de imprimir", "sin soportes", "STL", "filamento", "impresion", "A1 MINI", "perfil", etc. 
Describe el objeto enfocandote unicamente en su estetica, uso practico, decoracion o beneficio.

Devuelve un JSON valido con esta estructura exacta:
{
  "description": "Una descripcion corta y atractiva (max 150 caracteres), sin mencionar su metodo de fabricacion.",
  "category": "Asigna una categoria comercial (ej. Hogar, Organizadores, Mascotas, Decoracion, Cosplay, Juguetes). Mantenla corta (max 2 palabras)",
  "hashtags": ["tag1", "tag2", "tag3"],
  "variants": ["Nombre 1", "Nombre 2"] // Obligatorio. Array de strings. Renombra las variantes actuales a nombres comerciales (ej. "Estandar", "Mini", "Grande", "Premium") basandote en su peso/precio. NUNCA uses terminos de 3D. El array debe tener el mismo numero de elementos que las variantes originales. Si dice 'Ninguna', devuelve un array vacio [].
}\`;'''
    js_code = re.sub(old_prompt_regex, new_prompt, js_code, flags=re.DOTALL)
    
    # Update JSON parsing logic to apply variants
    old_json_parse = """if (aiData.description) p.description = aiData.description;
                if (aiData.category) p.category = aiData.category;
                if (aiData.hashtags && Array.isArray(aiData.hashtags)) {
                    p.tags = aiData.hashtags;
                }"""
    
    new_json_parse = """if (aiData.description) p.description = aiData.description;
                if (aiData.category) p.category = aiData.category;
                if (aiData.hashtags && Array.isArray(aiData.hashtags)) {
                    p.tags = aiData.hashtags;
                }
                if (aiData.variants && Array.isArray(aiData.variants) && p.variants && p.variants.length === aiData.variants.length) {
                    for (let j = 0; j < p.variants.length; j++) {
                        p.variants[j].name = aiData.variants[j];
                    }
                }"""
    
    js_code = js_code.replace(old_json_parse, new_json_parse)
    return js_code

for file in ['n8n/makerworld-scraper.json', 'n8n/debug-1-item.json', 'n8n/debug-gemini.json']:
    with open(file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    for node in data.get('nodes', []):
        if node.get('name') == 'Gemini AI Enrich':
            node['parameters']['jsCode'] = update_code(node['parameters']['jsCode'])
    with open(file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
        
print("Variants AI processing added.")

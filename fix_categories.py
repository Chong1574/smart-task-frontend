# -*- coding: utf-8 -*-
import json
import re

def update_code(js_code):
    js_code = re.sub(r'\"category\": \"[^\"]+\"', '\"category\": \"Asigna una categoria comercial (ej. Hogar, Organizadores, Oficina, Mascotas, Decoracion, Accesorios, Herramientas, Cosplay, Juguetes, Deportes). Mantenla corta (max 2 palabras)\"', js_code)
    return js_code

for file in ['n8n/makerworld-scraper.json', 'n8n/debug-1-item.json', 'n8n/debug-gemini.json']:
    with open(file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    for node in data.get('nodes', []):
        if node.get('name') == 'Gemini AI Enrich':
            node['parameters']['jsCode'] = update_code(node['parameters']['jsCode'])
    with open(file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
print('Categories updated.')

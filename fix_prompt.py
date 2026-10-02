# -*- coding: utf-8 -*-
import json
import re

def update_code(js_code):
    start = js_code.find('const prompt = \Analiza el')
    if start == -1: return js_code
    end = js_code.find('}\;', start)
    if end == -1: return js_code
    
    new_prompt = '''const prompt = \Analiza el siguiente producto:
Título: \
Descripción original: \

\

REGLA CRITICA DE NEGOCIO:
Tu eres una tienda online que vende el producto FISICO ya fabricado. 
El cliente final es un comprador normal, NO un maker. 
Por lo tanto, ESTA ESTRICTAMENTE PROHIBIDO mencionar terminos de impresion 3D como "facil de imprimir", "sin soportes", "STL", "filamento", "impresion", etc. 
Describe el objeto enfocandote unicamente en su estetica, uso practico, decoracion o beneficio para quien lo compra.

Devuelve un JSON valido con esta estructura exacta:
{
  "description": "Una descripcion corta y muy atractiva para ventas (max 150 caracteres), sin mencionar su metodo de fabricacion.",
  "category": "Elige una de: Herramientas, Juguetes, Electronica, Decoracion, Gadgets, Accesorios",
  "hashtags": ["tag1", "tag2", "tag3"]
}\;'''

    return js_code[:start] + new_prompt + js_code[end+3:]

for file in ['n8n/makerworld-scraper.json', 'n8n/debug-1-item.json', 'n8n/debug-gemini.json']:
    with open(file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    for node in data.get('nodes', []):
        if node.get('name') == 'Gemini AI Enrich':
            node['parameters']['jsCode'] = update_code(node['parameters']['jsCode'])
    with open(file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
print('Prompt updated.')

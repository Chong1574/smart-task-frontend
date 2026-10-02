import json

with open('n8n/makerworld-scraper.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for node in data['nodes']:
    if node['name'] == 'Gemini AI Enrich':
        code = node['parameters']['jsCode']
        
        # Add the URL to the debug output
        code = code.replace(
            'p.description = "DEBUG GEMINI (ERROR CONEXION): " + errStr + " | Imagen enviada: " + (base64Image ? "SI" : "NO");',
            'p.description = "DEBUG GEMINI (ERROR CONEXION): " + errStr + " | URL: " + GEMINI_URL.replace(GEMINI_API_KEY.trim(), "[OCULTA]");'
        )
        
        node['parameters']['jsCode'] = code

with open('n8n/makerworld-scraper.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Updated URL debug!")

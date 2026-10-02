import json

with open('n8n/makerworld-scraper.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for node in data['nodes']:
    if node['name'] == 'Gemini AI Enrich':
        code = node['parameters']['jsCode']
        code = code.replace(
            "console.log(\"Error al llamar a Gemini:\", e.message);",
            "p.description = 'DEBUG GEMINI ERROR: ' + (e.message || e.toString());\n        console.log(\"Error al llamar a Gemini:\", e.message);"
        )
        node['parameters']['jsCode'] = code

with open('n8n/makerworld-scraper.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Updated Gemini node to output error to description!")

import json

with open('n8n/makerworld-scraper.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for node in data['nodes']:
    if node['name'] == 'Gemini AI Enrich':
        code = node['parameters']['jsCode']
        
        # Remove the fallback block
        import re
        code = re.sub(
            r'// Si no hay key configurada, usa un fallback heurístico\s*if \(GEMINI_API_KEY === "TU_API_KEY_AQUI"\) \{.*?\n\s*\}\n',
            '',
            code,
            flags=re.DOTALL
        )
        
        node['parameters']['jsCode'] = code

with open('n8n/makerworld-scraper.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Removed fallback code!")

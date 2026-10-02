import json

with open('n8n/makerworld-scraper.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for node in data['nodes']:
    if node['name'] == 'Gemini AI Enrich':
        code = node['parameters']['jsCode']
        
        # Upgrade model and add trim()
        code = code.replace(
            'models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY;',
            'models/gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY.trim();'
        )
        
        node['parameters']['jsCode'] = code

with open('n8n/makerworld-scraper.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Updated URL and model!")

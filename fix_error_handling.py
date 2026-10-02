import json

with open('n8n/makerworld-scraper.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for node in data['nodes']:
    if node['name'] == 'MakerWorld: fetch detail':
        node['onError'] = 'continueErrorOutput'
    if node['name'] == 'Gemini AI Enrich':
        node['onError'] = 'continueErrorOutput'
    if node['name'] == 'POST /api/products/sync':
        node['onError'] = 'continueErrorOutput'

with open('n8n/makerworld-scraper.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Updated onError settings!")

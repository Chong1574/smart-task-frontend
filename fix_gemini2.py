import json

with open('n8n/makerworld-scraper.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for node in data['nodes']:
    if node['name'] == 'Gemini AI Enrich':
        code = node['parameters']['jsCode']
        code = code.replace(
            "encoding: 'arraybuffer',",
            "encoding: null,\n                    responseType: 'arraybuffer',"
        )
        node['parameters']['jsCode'] = code

with open('n8n/makerworld-scraper.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Updated arraybuffer options!")

import json

file = 'n8n/makerworld-scraper.json'
with open(file, 'r', encoding='utf-8') as f:
    data = json.load(f)

for node in data['nodes']:
    if node['name'] == 'Batch Loop':
        node['type'] = 'n8n-nodes-base.splitInBatches'
        node['typeVersion'] = 2
        node['parameters'] = {
            "batchSize": 1,
            "options": {}
        }

with open(file, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print('Loop node fixed.')

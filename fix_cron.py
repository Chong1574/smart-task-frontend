import json

file = 'n8n/makerworld-scraper.json'
with open(file, 'r', encoding='utf-8') as f:
    data = json.load(f)

for node in data.get('nodes', []):
    if node.get('type') == 'n8n-nodes-base.scheduleTrigger':
        node['name'] = 'Cron 3x Week (Mon/Wed/Fri)'
        node['parameters']['rule']['interval'][0]['expression'] = '0 3 * * 1,3,5'

with open(file, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print('Cron updated.')

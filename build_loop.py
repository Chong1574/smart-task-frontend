import json

file = 'n8n/makerworld-scraper.json'
with open(file, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Add Loop node
loop_node = {
  "parameters": {
    "options": {}
  },
  "id": "batch-loop-node",
  "name": "Batch Loop",
  "type": "n8n-nodes-base.loop",
  "typeVersion": 1,
  "position": [ 1500, 300 ]
}

if not any(n['name'] == 'Batch Loop' for n in data['nodes']):
    data['nodes'].append(loop_node)

# Rewire connections
conns = data['connections']
conns['Wrap as { products: [...] }'] = {
    "main": [[{"node": "Batch Loop", "type": "main", "index": 0}]]
}
conns['Batch Loop'] = {
    "main": [
        [{"node": "Gemini AI Enrich", "type": "main", "index": 0}],
        []
    ]
}
conns['Gemini AI Enrich'] = {
    "main": [[{"node": "POST /api/products/sync", "type": "main", "index": 0}]]
}
conns['POST /api/products/sync'] = {
    "main": [[{"node": "Batch Loop", "type": "main", "index": 0}]]
}

# Ensure Gemini node is back to runOnceForAllItems because the Loop node feeds it 1 chunk at a time
for node in data['nodes']:
    if node['name'] == 'Gemini AI Enrich':
        if 'mode' in node['parameters']:
            del node['parameters']['mode']
        js_code = node['parameters']['jsCode']
        js_code = js_code.replace('const products = $input.item.json.products;', 'const products = $input.all()[0].json.products;')
        js_code = js_code.replace('return { json: { products } };', 'return [{ json: { products } }];')
        node['parameters']['jsCode'] = js_code

with open(file, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print('Loop node added and rewired.')

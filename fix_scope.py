import json

with open('n8n/makerworld-scraper.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for node in data['nodes']:
    if node['name'] == 'Gemini AI Enrich':
        code = node['parameters']['jsCode']
        
        # Replace the scope of base64Image
        code = code.replace(
            "    try {\n        let base64Image = null;",
            "    let base64Image = null;\n    try {"
        )
        
        node['parameters']['jsCode'] = code

with open('n8n/makerworld-scraper.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Fixed scoping error!")

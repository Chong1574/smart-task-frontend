import json

with open('n8n/makerworld-scraper.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for node in data['nodes']:
    if node['name'] == 'Gemini AI Enrich':
        code = node['parameters']['jsCode']
        code = code.replace(
            "p.tags = [...new Set([...(p.tags || []), ...aiData.hashtags])];",
            "p.tags = aiData.hashtags;"
        )
        # Update the prompt slightly to ensure we get good tags
        code = code.replace(
            "\"hashtags\": [\"tag1\", \"tag2\", \"tag3\"]",
            "\"hashtags\": [\"tag1\", \"tag2\", \"tag3\"] // Genera entre 3 y 5 tags limpios y estructurados que describan el producto"
        )
        node['parameters']['jsCode'] = code

with open('n8n/makerworld-scraper.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Updated Gemini node to replace tags!")

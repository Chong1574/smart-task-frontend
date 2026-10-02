import json

def update_wrap_code(js_code):
    old_return = "return [{ json: { products } }];"
    new_return = """const chunks = [];
const BATCH_SIZE = 15;
for (let i = 0; i < products.length; i += BATCH_SIZE) {
    chunks.push({ json: { products: products.slice(i, i + BATCH_SIZE) } });
}
return chunks;"""
    return js_code.replace(old_return, new_return)

def update_gemini_code(js_code):
    js_code = js_code.replace("const products = $input.all()[0].json.products;", "const products = $input.item.json.products;")
    js_code = js_code.replace("return [{ json: { products } }];", "return { json: { products } };")
    return js_code

for file in ['n8n/makerworld-scraper.json', 'n8n/debug-1-item.json', 'n8n/debug-gemini.json']:
    with open(file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    for node in data.get('nodes', []):
        if node.get('name') == 'Wrap as { products: [...] }':
            node['parameters']['jsCode'] = update_wrap_code(node['parameters']['jsCode'])
        if node.get('name') == 'Gemini AI Enrich':
            node['parameters']['mode'] = 'runOnceForEachItem'
            node['parameters']['jsCode'] = update_gemini_code(node['parameters']['jsCode'])
    with open(file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
print('Batching updated.')

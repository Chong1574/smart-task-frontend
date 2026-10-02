import json

def update_gemini_code(js_code):
    old_return = "return [{ json: { products } }];"
    new_return = """// Filtrar los productos que fallaron al procesarse con Gemini
const finalProducts = products.filter(p => p.description && !p.description.startsWith("DEBUG GEMINI") && !p.description.startsWith("ERROR:"));
return [{ json: { products: finalProducts } }];"""
    if old_return in js_code:
        js_code = js_code.replace(old_return, new_return)
    else:
        # In case it uses eturn { json: { products } }; (which shouldn't be the case since I restored runOnceForAllItems earlier)
        old_return2 = "return { json: { products } };"
        new_return2 = """const finalProducts = products.filter(p => p.description && !p.description.startsWith("DEBUG GEMINI") && !p.description.startsWith("ERROR:"));
return { json: { products: finalProducts } };"""
        js_code = js_code.replace(old_return2, new_return2)
    return js_code

for file in ['n8n/makerworld-scraper.json', 'n8n/debug-1-item.json', 'n8n/debug-gemini.json']:
    with open(file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    for node in data.get('nodes', []):
        if node.get('name') == 'Gemini AI Enrich':
            node['parameters']['jsCode'] = update_gemini_code(node['parameters']['jsCode'])
    with open(file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
print('Filter added.')

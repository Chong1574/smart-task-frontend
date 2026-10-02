import json

def update_gemini_code(js_code):
    old_req = """        const response = await this.helpers.httpRequest({
            method: 'POST',
            url: GEMINI_URL,
            headers: { 'Content-Type': 'application/json' },
            body: {
                contents: [{ parts }]
            }
        });"""
        
    new_req = """        let response = null;
        let lastError = null;
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                response = await this.helpers.httpRequest({
                    method: 'POST',
                    url: GEMINI_URL,
                    headers: { 'Content-Type': 'application/json' },
                    body: {
                        contents: [{ parts }]
                    }
                });
                break; // Éxito
            } catch (err) {
                lastError = err;
                if (attempt < 3) {
                    await new Promise(r => setTimeout(r, 4000)); // Esperar 4s antes de reintentar
                }
            }
        }
        if (!response) {
            throw lastError;
        }"""
        
    old_return = "return [{ json: { products } }];"
    new_return = """// Filtramos los productos que fallaron incluso despues de los reintentos
const finalProducts = products.filter(p => p.description && !p.description.startsWith("DEBUG GEMINI") && !p.description.startsWith("ERROR:"));
return [{ json: { products: finalProducts } }];"""

    if old_req in js_code:
        js_code = js_code.replace(old_req, new_req)
    if old_return in js_code:
        js_code = js_code.replace(old_return, new_return)
        
    return js_code

for file in ['n8n/makerworld-scraper.json', 'n8n/debug-1-item.json', 'n8n/debug-gemini.json']:
    with open(file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    for node in data.get('nodes', []):
        if node.get('name') == 'Gemini AI Enrich':
            node['parameters']['jsCode'] = update_gemini_code(node['parameters']['jsCode'])
    with open(file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

print("Gemini retries and filtering added.")

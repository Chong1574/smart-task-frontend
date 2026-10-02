import json
import re

def update_wrap_code(js_code):
    new_code = """const normalized = $('Drop unknown licenses').all();
const stripHtml = (html) => String(html || '').replace(/<[^>]+>/g, ' ').replace(/\\s{2,}/g, ' ').trim().slice(0, 2000);

const products = [];
for (const item of items) {
    const det = item?.json?.__detail;
    if (!det || !det.id) continue;
    
    // Cruce seguro por ID en vez de por indice
    const nItem = normalized.find(x => String(x.json.externalId) === String(det.id));
    if (!nItem) continue;
    
    const n = nItem.json;
    products.push({
        ...n,
        description: stripHtml(det.description),
        descriptionHtml: det.description || '',
        images: det.images || [],
        variants: det.variants || [],
        priceFrom: det.priceFrom ?? null,
        price: det.priceFrom ?? null,
    });
}

const chunks = [];
const BATCH_SIZE = 15;
for (let i = 0; i < products.length; i += BATCH_SIZE) {
    chunks.push({ json: { products: products.slice(i, i + BATCH_SIZE) } });
}
return chunks;"""
    return new_code

for file in ['n8n/makerworld-scraper.json', 'n8n/debug-1-item.json', 'n8n/debug-gemini.json']:
    with open(file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    for node in data.get('nodes', []):
        if node.get('name') == 'Wrap as { products: [...] }':
            node['parameters']['jsCode'] = update_wrap_code(node['parameters']['jsCode'])
    with open(file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

print('Wrap logic fixed to merge by ID.')

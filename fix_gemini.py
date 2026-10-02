import json

with open('n8n/makerworld-scraper.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

new_code = """// Llama a Gemini API para enriquecer los productos
const products = $input.all()[0].json.products;

// Reemplaza esto con tu API Key real de Google Gemini
const GEMINI_API_KEY = "TU_API_KEY_AQUI"; 
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY;

for (let i = 0; i < products.length; i++) {
    const p = products[i];
    if (!p.title) continue;
    
    // Si no hay key configurada, usa un fallback heurístico
    if (GEMINI_API_KEY === "TU_API_KEY_AQUI") {
        const text = (p.title + ' ' + (p.description || '')).toLowerCase();
        if (text.includes('tool') || text.includes('mount')) p.category = 'Herramientas';
        else if (text.includes('toy') || text.includes('dragon')) p.category = 'Juguetes';
        else if (text.includes('lamp') || text.includes('led')) p.category = 'Electrónica';
        else if (text.includes('vase') || text.includes('decor')) p.category = 'Decoración';
        else p.category = 'Impresión 3D';
        p.tags = [...new Set([...(p.tags || []), p.category])];
        continue;
    }

    try {
        let base64Image = null;
        let mimeType = 'image/jpeg';
        const imgUrl = (p.images && p.images.length > 0) ? p.images[0] : p.imageUrl;
        
        if (imgUrl) {
            try {
                // Descargamos la imagen como Buffer binario para mandarla a Gemini
                const imgBuffer = await this.helpers.httpRequest({
                    method: 'GET',
                    url: imgUrl,
                    encoding: 'arraybuffer',
                    timeout: 5000
                });
                if (imgBuffer) {
                    base64Image = Buffer.from(imgBuffer).toString('base64');
                    if (imgUrl.toLowerCase().includes('.png')) mimeType = 'image/png';
                    else if (imgUrl.toLowerCase().includes('.webp')) mimeType = 'image/webp';
                }
            } catch (imgErr) {
                console.log("Error descargando imagen para Gemini:", imgErr.message);
            }
        }

        const prompt = `Analiza el siguiente producto de impresión 3D:
Título: ${p.title}
Descripción actual: ${p.description?.slice(0, 500)}

${base64Image ? 'También te he adjuntado una imagen del producto para que la analices.' : ''}

Devuelve un JSON válido con esta estructura exacta:
{
  "description": "Una descripción corta y atractiva para marketing (max 150 caracteres) basada en el texto y la imagen",
  "category": "Elige una de: Herramientas, Juguetes, Electrónica, Decoración, Gadgets, Impresión 3D",
  "hashtags": ["tag1", "tag2", "tag3"]
}`;

        const parts = [{ text: prompt }];
        if (base64Image) {
            parts.push({
                inline_data: {
                    mime_type: mimeType,
                    data: base64Image
                }
            });
        }

        const response = await this.helpers.httpRequest({
            method: 'POST',
            url: GEMINI_URL,
            headers: { 'Content-Type': 'application/json' },
            body: {
                contents: [{ parts }]
            }
        });

        const rawText = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const jsonMatch = rawText.match(/\\{.*\\}/s);
        if (jsonMatch) {
            const aiData = JSON.parse(jsonMatch[0]);
            if (aiData.description) p.description = aiData.description;
            if (aiData.category) p.category = aiData.category;
            if (aiData.hashtags && Array.isArray(aiData.hashtags)) {
                p.tags = [...new Set([...(p.tags || []), ...aiData.hashtags])];
            }
        }
    } catch (e) {
        console.log("Error al llamar a Gemini:", e.message);
    }
}

return [{ json: { products } }];
"""

for node in data['nodes']:
    if node['name'] == 'Gemini AI Enrich':
        node['parameters']['jsCode'] = new_code

with open('n8n/makerworld-scraper.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Gemini node updated with image support!")

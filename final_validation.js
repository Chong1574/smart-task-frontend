async function main() {// Llama a Gemini API para enriquecer los productos
const products = $input.all()[0].json.products;

// Reemplaza esto con tu API Key real de Google Gemini
const GEMINI_API_KEY = "TU_API_KEY_AQUI"; 
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1alpha/models/gemini-3-flash-preview:generateContent?key=" + GEMINI_API_KEY.trim();


    let cookieString = "";
    try {
        const cookies = $("MakerWorld: search").first().json.solution.cookies || [];
        cookieString = cookies.map(c => `${c.name}=${c.value}`).join("; ");
    } catch(e) {}

for (let i = 0; i < products.length; i++) {
    const p = products[i];
    if (!p.title) continue;
    
    
    let base64Image = null;
    try {
        let mimeType = 'image/jpeg';
        const imgUrl = (p.images && p.images.length > 0) ? p.images[0] : p.imageUrl;
        
        if (imgUrl) {
            try {
                // Descargamos la imagen como Buffer binario para mandarla a Gemini
                const imgBuffer = await this.helpers.httpRequest({
                    method: 'GET',
                    url: imgUrl,
                    encoding: null,
                    responseType: 'arraybuffer',
                    timeout: 5000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                        'Referer': 'https://makerworld.com/',
                        'Cookie': cookieString
                    }
                });
                if (imgBuffer && imgBuffer.length > 500) {
                    // Check magic bytes to prevent sending WEBP as JPEG (causes Gemini 400 Bad Request)
                    const header = imgBuffer.slice(0, 4).toString("hex").toUpperCase();
                    if (header.startsWith("89504E47")) mimeType = "image/png";
                    else if (header.startsWith("52494646")) mimeType = "image/webp";
                    else if (header.startsWith("FFD8FF")) mimeType = "image/jpeg";
                    else if (header.startsWith("3C3F786D")) {
                        throw new Error("Makerworld returned an XML Access Denied file instead of an image.");
                    } else {
                        mimeType = "image/jpeg"; // fallback
                    }
                    base64Image = Buffer.from(imgBuffer).toString("base64");
                } else {
                    throw new Error("Imagen vacia o bloqueada por Makerworld");
                }
            } catch (imgErr) {
                console.log("Error descargando imagen para Gemini:", imgErr.message);
            }
        }

        await new Promise(r => setTimeout(r, 2000));
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
        try {
            const jsonMatch = rawText.match(/\{.*\}/s);
            if (jsonMatch) {
                const aiData = JSON.parse(jsonMatch[0]);
                if (aiData.description) p.description = aiData.description;
                if (aiData.category) p.category = aiData.category;
                if (aiData.hashtags && Array.isArray(aiData.hashtags)) {
                    p.tags = aiData.hashtags;
                p.RAW_GEMINI_OUTPUT = rawText;
                }
            } else {
                p.description = "DEBUG GEMINI (NO JSON): " + rawText.slice(0, 300);
            }
        } catch (parseErr) {
            p.description = "DEBUG GEMINI (JSON INVALIDO): " + parseErr.message + " | TEXTO RECIBIDO: " + rawText.slice(0, 300);
        }
    } catch (e) {
        let errStr = e.message || e.toString();
        if (e.error) errStr += " | " + JSON.stringify(e.error);
        if (e.response && e.response.data) errStr += " | " + JSON.stringify(e.response.data);
        p.description = "DEBUG GEMINI (ERROR CONEXION): " + errStr + " | URL: " + GEMINI_URL.replace(GEMINI_API_KEY.trim(), "[OCULTA]");
        console.log("Error al llamar a Gemini:", errStr);
    }
}

return [{ json: { products } }];
}
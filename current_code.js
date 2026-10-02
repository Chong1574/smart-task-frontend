// Llama a Gemini API para enriquecer los productos
const products = $input.all()[0].json.products;

// Reemplaza esto con tu API Key real de Google Gemini
const GEMINI_API_KEY = "TU_API_KEY_AQUI"; 
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=" + GEMINI_API_KEY.trim();


    let cookieString = "";
    try {
        const cookies = $("MakerWorld: search").first().json.solution.cookies || [];
        cookieString = cookies.map(c => `${c.name}=${c.value}`).join("; ");
    } catch(e) {}

for (let i = 0; i < products.length; i++) {
    const p = products[i];
    if (!p.title) continue;
    if (GEMINI_API_KEY.includes("TU_API_KEY_AQUI") || GEMINI_API_KEY.trim() === "") {
        p.description = "ERROR: OLVIDASTE PONER TU API KEY DE GEMINI EN EL NODO DE CODIGO!";
        continue;
    }
    
    
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
                        'User-Agent': flareUserAgent,
                        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Sec-Fetch-Dest': 'image',
                        'Sec-Fetch-Mode': 'no-cors',
                        'Sec-Fetch-Site': 'cross-site',
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
                    else {
                        throw new Error("Makerworld blocked the image or returned an invalid format. Magic bytes: " + header);
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
        const variantsInfo = (p.variants && p.variants.length > 0) ? p.variants.map((v, i) => `[${i+1}] ${v.name} (${v.grams}g, $${v.price})`).join(', ') : 'Ninguna';
        const prompt = `Analiza el siguiente producto:
Título: ${p.title}
Descripción original: ${p.description?.slice(0, 500)}
Variantes (nombre, peso, precio): ${variantsInfo}

${base64Image ? 'También te he adjuntado una imagen del producto físico final para que la analices.' : ''}

REGLA CRITICA DE NEGOCIO:
Tu eres una tienda online que vende el producto FISICO ya fabricado. 
El cliente final es un comprador normal, NO un maker. 
Por lo tanto, ESTA ESTRICTAMENTE PROHIBIDO mencionar terminos de impresion 3D como "facil de imprimir", "sin soportes", "STL", "filamento", "impresion", "A1 MINI", "perfil", etc. 
Describe el objeto enfocandote unicamente en su estetica, uso practico, decoracion o beneficio.

Devuelve un JSON valido con esta estructura exacta:
{
  "description": "Una descripcion corta y atractiva (max 150 caracteres), sin mencionar su metodo de fabricacion.",
  "category": "Asigna una categoria comercial (ej. Hogar, Organizadores, Mascotas, Decoracion, Cosplay, Juguetes). Mantenla corta (max 2 palabras)",
  "hashtags": ["tag1", "tag2", "tag3"],
  "variants": ["Nombre 1", "Nombre 2"] // Obligatorio. Array de strings. Renombra las variantes actuales a nombres comerciales (ej. "Estandar", "Mini", "Grande", "Premium") basandote en su peso/precio. NUNCA uses terminos de 3D. El array debe tener el mismo numero de elementos que las variantes originales. Si dice 'Ninguna', devuelve un array vacio [].
}`;

        const parts = [{ text: prompt }];
        if (base64Image) {
            parts.push({
                inlineData: {
                    mimeType: mimeType,
                    data: base64Image
                }
            });
        }

        let response = null;
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
        }

        const rawText = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        try {
            const jsonMatch = rawText.match(/\{.*\}/s);
            if (jsonMatch) {
                const aiData = JSON.parse(jsonMatch[0]);
                if (aiData.description) p.description = aiData.description;
                if (aiData.category) p.category = aiData.category;
                if (aiData.hashtags && Array.isArray(aiData.hashtags)) {
                    p.tags = aiData.hashtags;
                }
                if (aiData.variants && Array.isArray(aiData.variants) && p.variants && p.variants.length === aiData.variants.length) {
                    for (let j = 0; j < p.variants.length; j++) {
                        p.variants[j].name = aiData.variants[j];
                    }
                }
            } else {
                p.description = "DEBUG GEMINI (NO JSON): " + rawText.slice(0, 300);
            }
        } catch (parseErr) {
            p.description = "DEBUG GEMINI (JSON INVALIDO): " + parseErr.message + " | TEXTO RECIBIDO: " + rawText.slice(0, 300);
        }
    } catch (e) {
        let errStr = e.message || e.toString();
        try {
            if (e.response && e.response.data) errStr += " | Data: " + JSON.stringify(e.response.data);
            if (e.response && e.response.body) errStr += " | Body: " + (typeof e.response.body === "object" ? JSON.stringify(e.response.body) : e.response.body);
            if (e.error) errStr += " | ErrorObj: " + (typeof e.error === "object" ? JSON.stringify(e.error) : e.error);
        } catch(dumpErr) { errStr += " | DUMP FAILED: " + dumpErr.message; }
        p.description = "DEBUG GEMINI (ERROR CONEXION): " + errStr + " | URL: " + GEMINI_URL.replace(GEMINI_API_KEY.trim(), "[OCULTA]");
        console.log("Error al llamar a Gemini:", errStr);
    }
}

// Filtramos los productos que fallaron incluso despues de los reintentos
const finalProducts = products.filter(p => p.description && !p.description.startsWith("DEBUG GEMINI") && !p.description.startsWith("ERROR:"));
return [{ json: { products: finalProducts } }];

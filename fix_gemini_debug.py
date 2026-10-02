import json

with open('n8n/makerworld-scraper.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for node in data['nodes']:
    if node['name'] == 'Gemini AI Enrich':
        code = node['parameters']['jsCode']
        
        # Replace the parsing and catch block
        import re
        
        new_block = """
        const rawText = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        try {
            const jsonMatch = rawText.match(/\\{.*\\}/s);
            if (jsonMatch) {
                const aiData = JSON.parse(jsonMatch[0]);
                if (aiData.description) p.description = aiData.description;
                if (aiData.category) p.category = aiData.category;
                if (aiData.hashtags && Array.isArray(aiData.hashtags)) {
                    p.tags = aiData.hashtags;
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
        p.description = "DEBUG GEMINI (ERROR CONEXION): " + errStr + " | Imagen enviada: " + (base64Image ? "SI" : "NO");
        console.log("Error al llamar a Gemini:", errStr);
    }
}

return [{ json: { products } }];"""

        code = re.sub(r'const rawText = response\?\.candidates.*?return \[\{ json: \{ products \} \}\];', new_block.strip(), code, flags=re.DOTALL)
        
        node['parameters']['jsCode'] = code

with open('n8n/makerworld-scraper.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Updated Gemini debug block!")

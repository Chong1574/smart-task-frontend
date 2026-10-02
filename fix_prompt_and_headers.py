import json

def update_code(js_code):
    # 1. Fix the Image HTTP Request by adding headers
    old_http = """const imgBuffer = await this.helpers.httpRequest({
                    method: 'GET',
                    url: imgUrl,
                    encoding: null,
                    responseType: 'arraybuffer',
                    timeout: 5000
                });"""
    new_http = """const imgBuffer = await this.helpers.httpRequest({
                    method: 'GET',
                    url: imgUrl,
                    encoding: null,
                    responseType: 'arraybuffer',
                    timeout: 5000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                        'Referer': 'https://makerworld.com/'
                    }
                });"""
    js_code = js_code.replace(old_http, new_http)

    # 2. Restore the User's Original Prompt
    import re
    # Match everything from `const prompt = \` to \`;`
    prompt_regex = re.compile(r"const prompt = `.*?`;", re.DOTALL)
    
    original_prompt = """const prompt = `Analiza el siguiente producto de impresión 3D:
Título: ${p.title}
Descripción actual: ${p.description?.slice(0, 500)}

${base64Image ? 'También te he adjuntado una imagen del producto para que la analices.' : ''}

Devuelve un JSON válido con esta estructura exacta:
{
  "description": "Una descripción corta y atractiva para marketing (max 150 caracteres) basada en el texto y la imagen",
  "category": "Elige una de: Herramientas, Juguetes, Electrónica, Decoración, Gadgets, Impresión 3D",
  "hashtags": ["tag1", "tag2", "tag3"]
}`;"""
    
    js_code = prompt_regex.sub(original_prompt, js_code)
    return js_code


files_to_fix = ["n8n/makerworld-scraper.json", "n8n/debug-1-item.json", "n8n/debug-gemini.json"]

for file in files_to_fix:
    with open(file, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    for node in data.get("nodes", []):
        if node.get("name") == "Gemini AI Enrich":
            node["parameters"]["jsCode"] = update_code(node["parameters"]["jsCode"])
            
    with open(file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

print("Prompt and headers fixed in all workflows.")

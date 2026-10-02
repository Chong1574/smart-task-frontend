import json

def update_code(js_code):
    js_code = js_code.replace("inline_data:", "inlineData:")
    js_code = js_code.replace("mime_type:", "mimeType:")
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

print("CamelCase applied.")

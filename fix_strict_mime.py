import json

def update_code(js_code):
    old_mime = """else if (header.startsWith("3C3F786D")) {
                        throw new Error("Makerworld returned an XML Access Denied file instead of an image.");
                    } else {
                        mimeType = "image/jpeg"; // fallback
                    }"""
    
    new_mime = """else {
                        throw new Error("Makerworld blocked the image or returned an invalid format. Magic bytes: " + header);
                    }"""
                    
    js_code = js_code.replace(old_mime, new_mime)
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

print("Strict MIME enforcement added.")

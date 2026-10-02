import json

def fix_code(js_code):
    old_block = """                if (imgBuffer) {
                    base64Image = Buffer.from(imgBuffer).toString('base64');
                    if (imgUrl.toLowerCase().includes('.png')) mimeType = 'image/png';
                    else if (imgUrl.toLowerCase().includes('.webp')) mimeType = 'image/webp';
                }"""
                
    new_block = """                if (imgBuffer && imgBuffer.length > 500) {
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
                }"""
    
    return js_code.replace(old_block, new_block)

files_to_fix = ["n8n/makerworld-scraper.json", "n8n/debug-1-item.json", "n8n/debug-gemini.json"]

for file in files_to_fix:
    with open(file, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    for node in data.get("nodes", []):
        if node.get("name") == "Gemini AI Enrich":
            node["parameters"]["jsCode"] = fix_code(node["parameters"]["jsCode"])
            
    with open(file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

print("Image magic bytes check injected.")

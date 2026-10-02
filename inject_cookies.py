import json

def inject_cookies(js_code):
    cookie_logic = """
    let cookieString = "";
    try {
        const cookies = $("MakerWorld: search").first().json.solution.cookies || [];
        cookieString = cookies.map(c => `${c.name}=${c.value}`).join("; ");
    } catch(e) {}
"""
    
    # Insert cookie logic at the beginning of the for loop
    if "let cookieString" not in js_code:
        js_code = js_code.replace("for (let i = 0; i < products.length; i++) {", cookie_logic + "\nfor (let i = 0; i < products.length; i++) {")
        
    old_headers = """headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                        'Referer': 'https://makerworld.com/'
                    }"""
    new_headers = """headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                        'Referer': 'https://makerworld.com/',
                        'Cookie': cookieString
                    }"""
    js_code = js_code.replace(old_headers, new_headers)
    return js_code

files_to_fix = ["n8n/makerworld-scraper.json", "n8n/debug-1-item.json", "n8n/debug-gemini.json"]

for file in files_to_fix:
    with open(file, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    for node in data.get("nodes", []):
        if node.get("name") == "Gemini AI Enrich":
            node["parameters"]["jsCode"] = inject_cookies(node["parameters"]["jsCode"])
            
    with open(file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

print("Cookies injected.")

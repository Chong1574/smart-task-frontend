import json

def update_code(js_code):
    # Add API key check
    check = """
    if (GEMINI_API_KEY.includes("TU_API_KEY_AQUI") || GEMINI_API_KEY.trim() === "") {
        p.description = "ERROR: OLVIDASTE PONER TU API KEY DE GEMINI EN EL NODO DE CODIGO!";
        continue;
    }"""
    if "OLVIDASTE" not in js_code:
        js_code = js_code.replace("if (!p.title) continue;", "if (!p.title) continue;" + check)
        
    # Make error logger ultra-aggressive
    old_catch = """let errStr = e.message || e.toString();
        if (e.error) errStr += " | " + JSON.stringify(e.error);
        if (e.response && e.response.body) errStr += " | " + (typeof e.response.body === "object" ? JSON.stringify(e.response.body) : e.response.body);"""
        
    new_catch = """let errStr = e.message || e.toString();
        try {
            errStr += " | DUMP: " + JSON.stringify(e, Object.getOwnPropertyNames(e));
        } catch(dumpErr) {}"""
        
    js_code = js_code.replace(old_catch, new_catch)
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

print("API Key check and aggressive error logger added.")

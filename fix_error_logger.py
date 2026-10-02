import json

def update_code(js_code):
    old_catch = """let errStr = e.message || e.toString();
        try {
            errStr += " | DUMP: " + JSON.stringify(e, Object.getOwnPropertyNames(e));
        } catch(dumpErr) {}"""
        
    new_catch = """let errStr = e.message || e.toString();
        try {
            if (e.response && e.response.data) errStr += " | Data: " + JSON.stringify(e.response.data);
            if (e.response && e.response.body) errStr += " | Body: " + (typeof e.response.body === "object" ? JSON.stringify(e.response.body) : e.response.body);
            if (e.error) errStr += " | ErrorObj: " + (typeof e.error === "object" ? JSON.stringify(e.error) : e.error);
        } catch(dumpErr) { errStr += " | DUMP FAILED: " + dumpErr.message; }"""
        
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

print("Error logger fixed.")

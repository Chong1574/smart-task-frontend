import json

def update_code(js_code):
    # 1. Change v1alpha to v1beta
    js_code = js_code.replace("v1alpha/models", "v1beta/models")
    
    # 2. Fix error logging to use e.response.body (n8n standard) instead of e.response.data (axios standard)
    old_err = """if (e.response && e.response.data) errStr += " | " + JSON.stringify(e.response.data);"""
    new_err = """if (e.response && e.response.body) errStr += " | " + (typeof e.response.body === "object" ? JSON.stringify(e.response.body) : e.response.body);"""
    js_code = js_code.replace(old_err, new_err)
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

print("API version fixed.")

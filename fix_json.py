import json

with open("n8n/makerworld-scraper.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for node in data.get("nodes", []):
    if node.get("name") == "Gemini AI Enrich":
        js_code = node["parameters"]["jsCode"]
        # Replace v1beta with v1alpha
        js_code = js_code.replace("v1beta/models/gemini-3-flash-preview", "v1alpha/models/gemini-3-flash-preview")
        # Inject setTimeout delay before the prompt
        if "await new Promise" not in js_code:
            js_code = js_code.replace("const prompt =", "await new Promise(r => setTimeout(r, 2000));\n        const prompt =")
        
        node["parameters"]["jsCode"] = js_code

with open("n8n/makerworld-scraper.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("JSON safely updated.")

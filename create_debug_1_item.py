import json

with open("n8n/makerworld-scraper.json", "r", encoding="utf-8") as f:
    data = json.load(f)

data["name"] = "Bazar - DEBUG 1 Item Scraper"

for node in data["nodes"]:
    if node["name"] == "Emit offsets":
        node["parameters"]["jsCode"] = "return [{ json: { offset: 0 } }];"
    elif node["name"] == "MakerWorld: search":
        # Change limit=40 to limit=1
        jsonBody = node["parameters"]["jsonBody"]
        node["parameters"]["jsonBody"] = jsonBody.replace("limit=40", "limit=1")
    elif node["name"] == "Gemini AI Enrich":
        # Add the RAW_GEMINI_OUTPUT parsing just to be helpful, like in debug-gemini
        js_code = node["parameters"]["jsCode"]
        js_code = js_code.replace("p.tags = aiData.hashtags;", "p.tags = aiData.hashtags;\\n                p.RAW_GEMINI_OUTPUT = rawText;")
        node["parameters"]["jsCode"] = js_code
    elif node["name"] == "POST /api/products/sync":
        pass # keep it, or remove it so it doesnt pollute the DB?
        # Actually, let us just keep it so it is a true test.

# Remove the cron trigger, we only want manual trigger
data["nodes"] = [n for n in data["nodes"] if n["name"] != "Cron 03:00 daily"]

with open("n8n/debug-1-item.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("Created debug-1-item.json")

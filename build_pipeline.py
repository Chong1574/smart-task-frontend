import json

with open("n8n/makerworld-scraper.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Remove old Gemini AI Enrich node
data["nodes"] = [n for n in data["nodes"] if n["name"] != "Gemini AI Enrich"]

new_nodes = [
    {
        "parameters": {
            "operation": "splitOutItems",
            "fieldToSplitOut": "products",
            "options": {}
        },
        "id": "split-products",
        "name": "Split Products",
        "type": "n8n-nodes-base.itemLists",
        "typeVersion": 3,
        "position": [1600, 300]
    },
    {
        "parameters": {
            "url": "={{ $json.images && $json.images.length > 0 ? $json.images[0] : ($json.imageUrl || \"\") }}",
            "responseFormat": "file",
            "options": {
                "ignoreResponseCode": True
            }
        },
        "id": "fetch-image",
        "name": "Fetch Image Binary",
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.1,
        "position": [1800, 200],
        "onError": "continueErrorOutput"
    },
    {
        "parameters": {
            "resource": "text",
            "operation": "messageModel",
            "model": "models/gemini-3-flash-preview",
            "messages": {
                "values": [
                    {
                        "role": "user",
                        "prompt": "={{ `Eres un experto en marketing de impresión 3D.\nAnaliza este producto:\nTítulo: ${$json.title}\nDescripción original: ${$json.description}\n\nDevuelve UNICAMENTE un JSON válido con esta estructura exacta:\n{\n  \"description\": \"Tu descripción de marketing en español aquí...\",\n  \"category\": \"Elige estrictamente una de: Coleccionables & Figuras, Hogar & Deco, Organización & Setup, Gadgets & Utilidades, Juegos & Diversión\",\n  \"hashtags\": [\"tag1\", \"tag2\", \"tag3\", \"tag4\"]\n}` }}"
                    }
                ]
            },
            "options": {}
        },
        "id": "gemini-native",
        "name": "Google Gemini",
        "type": "n8n-nodes-base.googleGemini",
        "typeVersion": 1,
        "position": [2000, 200],
        "onError": "continueErrorOutput"
    },
    {
        "parameters": {
            "mode": "combine",
            "combineBy": "position",
            "options": {}
        },
        "id": "merge-gemini",
        "name": "Merge Original & AI",
        "type": "n8n-nodes-base.merge",
        "typeVersion": 2.1,
        "position": [2200, 300]
    },
    {
        "parameters": {
            "jsCode": "const original = $input.item.json;\nlet text = original.text || \"\";\n\n// El merge por posicion une las propiedades. La salida de Gemini suele estar en .text\nlet aiData = {};\ntry {\n    const match = text.match(/\\{.*\\}/s);\n    if (match) aiData = JSON.parse(match[0]);\n} catch(e) {}\n\nif (aiData.description) original.description = aiData.description;\nif (aiData.category) original.category = aiData.category;\nif (aiData.hashtags) original.tags = aiData.hashtags;\n\nreturn { json: original };"
        },
        "id": "parse-ai",
        "name": "Parse AI Output",
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": [2400, 300]
    },
    {
        "parameters": {
            "operation": "aggregateItems",
            "fieldsToAggregate": {
                "fieldToAggregate": [
                    { "fieldToAggregate": "externalId" },
                    { "fieldToAggregate": "title" },
                    { "fieldToAggregate": "description" },
                    { "fieldToAggregate": "category" },
                    { "fieldToAggregate": "tags" },
                    { "fieldToAggregate": "priceFrom" },
                    { "fieldToAggregate": "images" },
                    { "fieldToAggregate": "source" },
                    { "fieldToAggregate": "sourceUrl" },
                    { "fieldToAggregate": "imageUrl" },
                    { "fieldToAggregate": "licenseType" },
                    { "fieldToAggregate": "licenseAttribution" },
                    { "fieldToAggregate": "trendScore" },
                    { "fieldToAggregate": "provider" },
                    { "fieldToAggregate": "variants" }
                ]
            },
            "options": {
                "destinationFieldName": "products"
            }
        },
        "id": "aggregate-products",
        "name": "Aggregate to Array",
        "type": "n8n-nodes-base.itemLists",
        "typeVersion": 3,
        "position": [2600, 300]
    }
]

data["nodes"].extend(new_nodes)

# Update Connections
conn = data.get("connections", {})

# Remove old connections from "Wrap as { products: [...] }"
if "Wrap as { products: [...] }" in conn:
    conn["Wrap as { products: [...] }"] = {
        "main": [
            [{"node": "Split Products", "type": "main", "index": 0}]
        ]
    }

# Remove old connections from "Gemini AI Enrich"
if "Gemini AI Enrich" in conn:
    del conn["Gemini AI Enrich"]

# Add new connections
conn["Split Products"] = {
    "main": [
        [
            {"node": "Fetch Image Binary", "type": "main", "index": 0},
            {"node": "Merge Original & AI", "type": "main", "index": 1}
        ]
    ]
}

conn["Fetch Image Binary"] = {
    "main": [
        [{"node": "Google Gemini", "type": "main", "index": 0}]
    ]
}

conn["Google Gemini"] = {
    "main": [
        [{"node": "Merge Original & AI", "type": "main", "index": 0}]
    ]
}

conn["Merge Original & AI"] = {
    "main": [
        [{"node": "Parse AI Output", "type": "main", "index": 0}]
    ]
}

conn["Parse AI Output"] = {
    "main": [
        [{"node": "Aggregate to Array", "type": "main", "index": 0}]
    ]
}

conn["Aggregate to Array"] = {
    "main": [
        [{"node": "POST /api/products/sync", "type": "main", "index": 0}]
    ]
}

data["connections"] = conn

with open("n8n/makerworld-scraper.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("Pipeline updated successfully")

import json
def update_code(js_code):
    old_cookie_logic = '''const cookies = \MakerWorld: search.first().json.solution.cookies;
                let cookieString = "";
                if (cookies && cookies.length > 0) {
                    cookieString = cookies.map(c => c.name + "=" + c.value).join("; ");
                }'''
    new_cookie_logic = '''const solution = \MakerWorld: search.first().json.solution;
                const cookies = solution.cookies || [];
                const flareUserAgent = solution.userAgent || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";
                let cookieString = cookies.map(c => c.name + "=" + c.value).join("; ");'''
    old_headers = '''headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                        'Referer': 'https://makerworld.com/',
                        'Cookie': cookieString
                    }'''
    new_headers = '''headers: {
                        'User-Agent': flareUserAgent,
                        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Sec-Fetch-Dest': 'image',
                        'Sec-Fetch-Mode': 'no-cors',
                        'Sec-Fetch-Site': 'cross-site',
                        'Referer': 'https://makerworld.com/',
                        'Cookie': cookieString
                    }'''
    js_code = js_code.replace(old_cookie_logic, new_cookie_logic)
    js_code = js_code.replace(old_headers, new_headers)
    return js_code

for file in ['n8n/makerworld-scraper.json', 'n8n/debug-1-item.json', 'n8n/debug-gemini.json']:
    with open(file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    for node in data.get('nodes', []):
        if node.get('name') == 'Gemini AI Enrich':
            node['parameters']['jsCode'] = update_code(node['parameters']['jsCode'])
    with open(file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
print('Headers fixed.')

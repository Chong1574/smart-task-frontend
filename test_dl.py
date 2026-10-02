import urllib.request
req = urllib.request.Request('https://makerworld.bblmw.com/makerworld/model/US85738548f15a4c/design/ef166b73d67ab9d1.jpg', headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', 'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8', 'Accept-Language': 'en-US,en;q=0.9', 'Referer': 'https://makerworld.com/'})
res = urllib.request.urlopen(req)
print('Length:', len(res.read()))

const https = require('https');
async function run() {
  const options = { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Referer': 'https://makerworld.com/', 'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8' } };
  const imgUrl = "https://makerworld.bblmw.com/makerworld/model/US384cf224c6e932/design/2024-04-12_2738a0f9b6b90.jpg";
  const imgBuffer = await new Promise((resolve, reject) => {
      https.get(imgUrl, options, (res) => {
          const chunks = [];
          res.on('data', c => chunks.push(c));
          res.on('end', () => resolve(Buffer.concat(chunks)));
          res.on('error', reject);
      }).on('error', reject);
  });
  console.log("Downloaded:", imgBuffer.length, "bytes");
  console.log("Base64 start:", imgBuffer.toString('base64').slice(0, 30));
}
run();
const https = require('https');
const crypto = require('crypto');

async function run() {
  try {
    const imgUrl = "https://makerworld.bblmw.com/makerworld/model/US384cf224c6e932/design/2024-04-12_2738a0f9b6b90.jpg";
    
    // Test download
    console.log("Downloading image...");
    const imgBuffer = await new Promise((resolve, reject) => {
        https.get(imgUrl, (res) => {
            const chunks = [];
            res.on('data', c => chunks.push(c));
            res.on('end', () => resolve(Buffer.concat(chunks)));
            res.on('error', reject);
        }).on('error', reject);
    });
    
    console.log("Downloaded:", imgBuffer.length, "bytes");
    console.log("Base64 start:", imgBuffer.toString('base64').slice(0, 30));
  } catch(e) {
    console.log("Error:", e);
  }
}
run();

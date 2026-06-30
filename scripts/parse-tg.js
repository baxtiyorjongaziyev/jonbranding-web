const https = require('https');

const url = 'https://t.me/s/JonBranding';

console.log('Fetching Telegram posts from:', url);

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
}, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Fetch completed. Response status:', res.statusCode);
    
    // Extract message wraps
    const regex = /<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/g;
    let match;
    const messages = [];

    while ((match = regex.exec(data)) !== null) {
      // Strip HTML tags from message text
      const text = match[1]
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]*>/g, '')
        .trim();
      messages.push(text);
    }

    console.log(`Found ${messages.length} messages:`);
    messages.forEach((msg, idx) => {
      console.log(`\n--- Message ${idx + 1} ---`);
      console.log(msg);
    });
  });
}).on('error', (err) => {
  console.error('Fetch error:', err);
});

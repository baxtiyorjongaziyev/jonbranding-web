const https = require('https');

function fetchPage(url, depth = 0, maxDepth = 15) {
  console.log(`[Depth ${depth}] Fetching: ${url}`);
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
      // Find previous page link
      const prevMatch = data.match(/<link rel="prev" href="([^"]+)"/);
      const prevUrl = prevMatch ? 'https://t.me' + prevMatch[1] : null;

      // Extract message wraps
      const regex = /<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/g;
      let match;
      const foundPosts = [];

      while ((match = regex.exec(data)) !== null) {
        const text = match[1]
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<[^>]*>/g, '')
          .trim();
        
        if (text.toLowerCase().includes('savod')) {
          foundPosts.push(text);
        }
      }

      if (foundPosts.length > 0) {
        console.log('\n=========================================');
        console.log('✅ FOUND SAVOD POSTS:');
        foundPosts.forEach((post, i) => {
          console.log(`\n--- Post ${i + 1} ---`);
          console.log(post);
        });
        console.log('=========================================\n');
        process.exit(0);
      }

      if (prevUrl && depth < maxDepth) {
        // Wait 1 second to avoid rate limiting
        setTimeout(() => fetchPage(prevUrl, depth + 1, maxDepth), 1000);
      } else {
        console.log('Finished search. No post containing "savod" was found.');
      }
    });
  }).on('error', (err) => {
    console.error('Fetch error:', err);
  });
}

fetchPage('https://t.me/s/JonBranding');

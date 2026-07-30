const https = require('https');
const fs = require('fs');
const path = require('path');
const { load } = require('cheerio');

const vaultFilePath = path.join(__dirname, '../obsidian-vault/Telegram_Inbox.md');

function fetchJonBrandingTg() {
  const url = 'https://t.me/s/JonBranding';
  console.log(`Fetching public Telegram posts from: ${url}`);

  https.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  }, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });

    res.on('end', () => {
      const $ = load(data);
      const posts = [];

      $('.tgme_widget_message').each((_, el) => {
        const $el = $(el);
        const textEl = $el.find('.tgme_widget_message_text');
        if (textEl.length) {
          textEl.find('br').replaceWith('\n');
          const text = textEl.text().trim();
          const date = $el.find('.tgme_widget_message_date time').attr('datetime') || new Date().toISOString();
          const link = $el.find('.tgme_widget_message_date').attr('href') || '';

          if (text) {
            posts.push({ text, date, link });
          }
        }
      });

      if (posts.length === 0) {
        console.log('No posts found.');
        return;
      }

      console.log(`Found ${posts.length} posts. Formatting into Obsidian note...`);

      let obsidianFormatted = `# Telegram Inbox (AI Tandem Sync)\n\n`;
      obsidianFormatted += `*JonBranding Telegram kanalidan oxirgi xabarlar sync qilindi (${new Date().toLocaleString()})*\n\n`;
      obsidianFormatted += `---\n\n## 📩 Oxirgi Telegram Postlar va Xabarlar\n\n`;

      posts.reverse().slice(0, 10).forEach((post, idx) => {
        obsidianFormatted += `### 📌 Post #${idx + 1} (${post.date})\n`;
        if (post.link) obsidianFormatted += `🔗 [Post Linki](${post.link})\n\n`;
        obsidianFormatted += `${post.text}\n\n---\n\n`;
      });

      obsidianFormatted += `**Ulanishlar:** [[Baxtiyorjon_Gaziyev]] | [[JonBranding_Agentligi]] | [[Oisha_Loyihasi]]\n`;

      fs.writeFileSync(vaultFilePath, obsidianFormatted, 'utf-8');
      console.log(`✅ Successfully updated ${vaultFilePath}`);
    });
  }).on('error', (err) => {
    console.error('Fetch error:', err);
  });
}

fetchJonBrandingTg();

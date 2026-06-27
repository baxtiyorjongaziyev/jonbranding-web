import * as cheerio from 'cheerio';

/**
 * Telegram ochiq web sahifasidan (t.me/s/...) berilgan kanal va qidiruv so'zi bo'yicha postlarni izlaydi.
 */
export async function scrapeTelegramPosts(channel: string, keyword: string): Promise<string | null> {
  try {
    const url = `https://t.me/s/${channel}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      console.error(`[Telegram Scraper] Error fetching channel ${channel}: ${response.statusText}`);
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    let foundText: string | null = null;
    const lowerKeyword = keyword.toLowerCase();

    // Barcha postlarni aylanamiz
    $('.tgme_widget_message_text').each((i, el) => {
      const text = $(el).text();
      if (text.toLowerCase().includes(lowerKeyword)) {
        foundText = text;
        return false; // Break the loop
      }
    });

    if (foundText) {
      console.log(`[Telegram Scraper] Found matching post for keyword: ${keyword}`);
      return foundText;
    } else {
      console.log(`[Telegram Scraper] No matching post found for keyword: ${keyword}`);
      return null;
    }
  } catch (error) {
    console.error(`[Telegram Scraper] Global error:`, error);
    return null;
  }
}

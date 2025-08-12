import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error("Telegram environment variables are not set.");
      return NextResponse.json({ ok: false, error: "Server configuration error" }, { status: 500 });
    }

    if (!text) {
      return NextResponse.json({ ok: false, error: 'Text is required' }, { status: 400 });
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown',
      }),
    });

    const result = await response.json();

    if (!result.ok) {
        console.error("Telegram API Error:", result);
        return NextResponse.json({ ok: false, error: 'Failed to send message to Telegram' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}

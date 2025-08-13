
import { NextResponse } from 'next/server';
import Airtable from 'airtable';

// Helper function to send a message to Telegram
async function sendToTelegram(message: string) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    let chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        console.error("Telegram environment variables are not set.");
        throw new Error("Server configuration error: Telegram bot not configured.");
    }
    
    // Ensure chat ID for channels/supergroups is correctly formatted
    if (chatId.startsWith('100')) {
        chatId = '-100' + chatId.substring(3);
    } else if (chatId.startsWith('-100')) {
        // Already correct, do nothing
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' }),
        });

        const result = await response.json();
        if (!result.ok) {
            console.error("Telegram API Error:", result);
            throw new Error('Failed to send message to Telegram.');
        }
    } catch (error) {
        console.error("Fetch to Telegram failed:", error);
        throw new Error('Failed to send message to Telegram.');
    }
}

// Helper function to save data to Airtable
async function saveToAirtable(data: any) {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_TABLE_NAME;

    if (!apiKey || !baseId || !tableName) {
        console.error("Airtable environment variables are not set.");
        throw new Error("Server configuration error: Airtable not configured.");
    }
    
    try {
        const base = new Airtable({ apiKey }).base(baseId);
        
        const airtableData = {
            'Full Name': data.fullName,
            'Phone': data.phone,
            'Telegram': data.telegram,
            'Package Summary': data.packageSummary,
            'Total Price': data.totalPrice,
            'Notes': data.notes,
            'Status': 'New',
        };

        // The create method expects an array of records
        await base(tableName).create([{ fields: airtableData }]);
    } catch (error) {
        console.error('Airtable Error:', error);
        throw new Error('Failed to save data to Airtable.');
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { fullName, phone, telegram, notes, packageSummary, totalPrice } = body;

        if (!fullName || !phone) {
            return NextResponse.json({ ok: false, error: 'Full name and phone are required' }, { status: 400 });
        }
        
        // 1. Prepare data for different services
        const telegramMessage = `
*Yangi xabar (Jon.Branding)*

*Mijoz:* ${fullName}
*Telefon:* \`${phone}\`
*Telegram:* ${telegram ? '@' + telegram.replace('@', '') : 'Kiritilmagan'}
*Izoh:* ${notes || 'Kiritilmagan'}

*Tanlangan paket:*
\`\`\`
${packageSummary}
Yakuniy narx: $${totalPrice.toLocaleString('en-US')}
\`\`\`
        `;
        
        const airtablePayload = {
            fullName,
            phone,
            telegram,
            packageSummary,
            totalPrice,
            notes,
        };

        // 2. Execute all promises concurrently
        const results = await Promise.allSettled([
            sendToTelegram(telegramMessage),
            saveToAirtable(airtablePayload),
        ]);

        const errors = results.filter(result => result.status === 'rejected');

        if (errors.length > 0) {
            // Log all errors for debugging
            errors.forEach(error => console.error((error as PromiseRejectedResult).reason));
            
             return NextResponse.json({ 
                ok: false, 
                error: 'Bir yoki bir nechta xizmatga ma\'lumotlarni yuborishda xatolik yuz berdi.',
                details: errors.map(e => (e as PromiseRejectedResult).reason.message)
            }, { status: 500 });
        }

        return NextResponse.json({ ok: true, message: 'Successfully submitted to all services.' });

    } catch (error: any) {
        console.error("Internal Server Error:", error);
        return NextResponse.json({ ok: false, error: error.message || 'Internal server error' }, { status: 500 });
    }
}

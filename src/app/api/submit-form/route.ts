import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Airtable from 'airtable';

// Helper function to send a message to Telegram
async function sendToTelegram(message: string) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        console.error("Telegram environment variables are not set.");
        throw new Error("Server configuration error: Telegram bot not configured.");
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
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
}


// Helper function to save data to Supabase
async function saveToSupabase(data: any) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error("Supabase environment variables are not set.");
        throw new Error("Server configuration error: Supabase not configured.");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.from('leads').insert([data]);

    if (error) {
        console.error('Supabase Error:', error);
        throw new Error('Failed to save data to Supabase.');
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
    
    Airtable.configure({ apiKey });
    const base = Airtable.base(baseId);
    
    // Map your data to Airtable fields
    const airtableData = {
        'Full Name': data.fullName,
        'Phone': data.phone,
        'Telegram': data.telegram,
        'Package Summary': data.packageSummary,
        'Total Price': data.totalPrice,
        'Notes': data.notes,
        'Status': 'New',
    };

    try {
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

        const supabaseData = {
            full_name: fullName,
            phone,
            telegram_username: telegram,
            notes,
            package_summary: packageSummary,
            total_price: totalPrice,
            submitted_at: new Date().toISOString(),
        };
        
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
            saveToSupabase(supabaseData),
            saveToAirtable(airtablePayload),
        ]);

        const errors = results.filter(result => result.status === 'rejected');

        if (errors.length > 0) {
            // Log all errors for debugging
            errors.forEach(error => console.error((error as PromiseRejectedResult).reason));
            
            // If any service fails, but maybe not all, decide on the response.
            // For now, we'll return a generic error if any of them fail.
            // You could customize this to be more specific.
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

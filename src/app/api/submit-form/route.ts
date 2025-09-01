
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const botToken = '7738413085:AAE_CYNnbpyoW5KiheUTJOPBmz_jHLVWgWc';
    const chatId = '-1002566480563';

    if (!botToken || !chatId) {
        console.error("Server Configuration Error: Telegram token or chat ID is missing in the code.");
        return NextResponse.json({ ok: false, error: "Serverda Telegram sozlamalari mavjud emas." }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { fullName, phone, telegram, notes, packageSummary, totalPrice } = body;

        if (!fullName || !phone) {
            return NextResponse.json({ ok: false, error: "Ism va telefon raqam kiritilishi shart" }, { status: 400 });
        }
        
        let telegramMessage = '';

        if (packageSummary && packageSummary.includes("Brending-test natijasini kutmoqda")) {
            // This is a quiz submission
            const answersJsonString = packageSummary.replace("Brending-test natijasini kutmoqda. Javoblar: ", "");
            let formattedAnswers = '';
            try {
                const answersArray = JSON.parse(answersJsonString);
                formattedAnswers = answersArray.map((answer: string, index: number) => `${index + 1}. ${answer.substring(answer.indexOf(':') + 2)}`).join('\n');
            } catch {
                formattedAnswers = "Javoblarni formatlashda xatolik."
            }

            telegramMessage = `
📝 Yangi Quiz Natijasi (Jon.Branding)

Mijoz: ${fullName}
Telefon: ${phone}
Telegram: ${telegram ? '@' + telegram.replace('@', '') : 'Kiritilmagan'}
Izoh: ${notes || 'Kiritilmagan'}

Javoblar:
${formattedAnswers}

---
📞 ALOQA SKRIPTI:
"Assalomu alaykum, ${fullName}. Ismim Baxtiyorjon, Jon.Branding agentligidan. Saytimizda brendingga tayyorlik bo'yicha mini-test topshirgan edingiz. Hozir sizga natijalarni tahlil qilib, shaxsiy maslahatlar berish uchun qo'ng'iroq qilyapman. Vaqtingiz bormi?"
`.trim();

        } else {
            // This is a standard contact/package submission
            let packageInfo = '';
            if (packageSummary && totalPrice !== undefined) {
              packageInfo = `
Tanlangan paket:
${packageSummary}
Yakuniy narx: ${totalPrice.toLocaleString('fr-FR')} so'm
              `.trim();
            }
            
            telegramMessage = `
Yangi xabar (Jon.Branding)

Mijoz: ${fullName}
Telefon: ${phone}
Telegram: ${telegram ? '@' + telegram.replace('@', '') : 'Kiritilmagan'}
Izoh: ${notes || 'Kiritilmagan'}
${packageInfo}
            `.trim();
        }
        
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        
        const payload = {
            chat_id: chatId,
            text: telegramMessage,
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!result.ok) {
            console.error("Telegram API Error:", result);
            return NextResponse.json({ ok: false, error: `Telegramga yuborishda xatolik: ${result.description || 'Noma\'lum xato'}` }, { status: response.status });
        }

        return NextResponse.json({ ok: true, message: "So'rovingiz muvaffaqiyatli yuborildi." });

    } catch (error: any) {
        console.error("Internal Server Error:", error);
        return NextResponse.json({ ok: false, error: "Serverda ichki xatolik yuz berdi. Iltimos, administratorga murojaat qiling." }, { status: 500 });
    }
}

const fs = require('fs');
const path = require('path');

// Path to files
const MASTER_PATH = path.join(__dirname, '../locales/ru.json'); // Use RU as master source for content
const LOCALES_DIR = path.join(__dirname, '../locales');
const LANGUAGES = ['uz', 'ru', 'en', 'zh'];

// Fallback translations for missing keys in UZ
const uzFallback = {
    "patentCalculator": {
        "title": "Patent hisoblash kalkulyatori",
        "subtitle": "Patent olish xarajatlarini darhol hisoblang.",
        "yourNameLabel": "Ismingiz",
        "yourNamePlaceholder": "Ismingizni kiriting",
        "phoneLabel": "Telefon raqamingiz",
        "phonePlaceholder": "+998901234567",
        "entityTypeLabel": "Shaxs turi",
        "entityOptions": [
            { "value": "fiz", "label": "Jismoniy shaxs", "labelShort": "Jismoniy" },
            { "value": "yur", "label": "Yuridik shaxs", "labelShort": "Yuridik" }
        ],
        "speedLabel": "Tezlik",
        "speedOptions": [
            { "value": "oddiy", "label": "Oddiy (7 oy)", "labelShort": "Oddiy" },
            { "value": "tez", "label": "Tezlashtirilgan (1.5 oy)", "labelShort": "Tez" }
        ],
        "categoryLabel": "Tur",
        "categoryOptions": [
            { "value": "trademark", "label": "Tovar belgisi", "labelShort": "Belgi" },
            { "value": "useful_model", "label": "Foydali model", "labelShort": "Model" },
            { "value": "invention", "label": "Ixtiro", "labelShort": "Ixtiro" }
        ],
        "classesLabel": "Sinflar soni",
        "classesNote": "Har bir qo'shimcha sinf uchun boj to'lanadi",
        "summaryTitle": "Xarajatlar tafsiloti",
        "step0Title": "0-bosqich (Ekspertiza)",
        "step1Title": "1-bosqich (Ariza)",
        "step2Title": "2-bosqich (Guvohnoma)",
        "stateFeeBase": "Davlat boji",
        "step0Total": "0-bosqich jami",
        "step1Total": "1-bosqich jami",
        "step2Total": "2-bosqich jami",
        "totalCostTitle": "Umumiy qiymati",
        "totalCostNote": "Barcha to'lovlar bilan",
        "submitButton": "Buyurtma berish",
        "submittingButton": "Yuborilmoqda...",
        "successMessage": "✅ Qabul qilindi!",
        "tryAgainButton": "Qaytadan",
        "privacyPolicyText": "Roziman",
        "success_toast_title": "Muvaffaqiyatli!",
        "success_toast_desc": "Tez orada bog'lanamiz!",
        "telegramTitle": "Patent arizasi"
    },
    "personalOfferBlock": {
        "ctaButton": "Menga bu kerak",
        "subtitle": "Siz nimalarga ega bo'lasiz:",
        "title": "💎 MENING TAKLIFIM:"
    },
    "pickTwoSelector": {
        "ctaText": "Taklif olish",
        "loading": "Yuklanmoqda...",
        "messages": {
            "cheap_fast": "Sifat beqaror bo'lishi mumkin.",
            "cheap_quality": "Natijani kutishga to'g'ri keladi.",
            "default": "2 ta ustuvorlikni tanlang.",
            "quality_fast": "Narx yuqoriroq bo'ladi."
        },
        "options": {
            "cheap": "Arzon",
            "fast": "Tez",
            "quality": "Sifatli"
        },
        "subtitle": "Narx—Sifat—Tezlik: uchtasini birga olish qiyin.",
        "title": "Uchtadan ikkitasini tanlang"
    },
    "popularPackages": {
        "ctaButton": "Paketni band qilish",
        "packageDiscount": "(-20% chegirma!)",
        "packagePrice": "Paketda",
        "packageSubtitle": "Kuchli brend uchun ideal kombinatsiya.",
        "packageTitle": "Neyming + Logotip (Premium)",
        "separate": "Alohida",
        "title": "Eng ommabop paketlar",
        "upfrontDiscount": "100% oldindan to'lovda (-28% jami!)"
    },
    "queueStatus": {
        "available": "Bo'sh",
        "booked": "Band",
        "ctaButton": "Joyni band qilish",
        "ctaSubtitle": "Raqobatchilardan oldinda bo'ling!",
        "description": "Biz sifatni ta'minlash uchun cheklangan miqdordagi loyihalar bilan ishlaymiz.",
        "nextProjectStart": "Keyingi loyiha boshlanishi",
        "onlineNow": "Hozir saytda",
        "peopleUnit": "kishi",
        "queueTitle": "Navbat",
        "remainingSlots": "Bo'sh joylar",
        "slotsUnit": "ta",
        "subtitle": "Joylar cheklangan",
        "title": "Shoshiling! Joyingizni band qiling!",
        "tooltipAvailable": "Navbatga yozilishingiz mumkin",
        "tooltipBooked": "Joy band qilingan"
    }
};

function deepMerge(target, source) {
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            if (!target[key]) target[key] = {};
            deepMerge(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}

function sync() {
    const masterData = JSON.parse(fs.readFileSync(MASTER_PATH, 'utf8'));
    
    LANGUAGES.forEach(lang => {
        const filePath = path.join(LOCALES_DIR, `${lang}.json`);
        let currentData = {};
        if (fs.existsSync(filePath)) {
            currentData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }

        // Create new object based on master structure
        const syncedData = {};

        function syncBranch(masterObj, currentObj, syncedObj, lang, fallbackObj) {
            for (const key in masterObj) {
                if (typeof masterObj[key] === 'object' && !Array.isArray(masterObj[key])) {
                    syncedObj[key] = {};
                    syncBranch(
                        masterObj[key], 
                        currentObj[key] || {}, 
                        syncedObj[key], 
                        lang,
                        fallbackObj ? fallbackObj[key] : null
                    );
                } else if (Array.isArray(masterObj[key])) {
                    // For arrays, if current exists, use it, otherwise use master (at least structure remains)
                    syncedObj[key] = currentObj[key] || masterObj[key];
                } else {
                    // Use current if exists, otherwise fallback, otherwise master
                    syncedObj[key] = currentObj[key] || (fallbackObj ? fallbackObj[key] : null) || masterObj[key];
                }
            }
        }

        syncBranch(masterData, currentData, syncedData, lang, lang === 'uz' ? uzFallback : null);

        fs.writeFileSync(filePath, JSON.stringify(syncedData, null, 4), 'utf8');
        console.log(`Synced ${lang}.json`);
    });
}

sync();

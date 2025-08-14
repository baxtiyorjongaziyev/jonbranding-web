
// @/lib/sales-data.ts

/**
 * @fileoverview This file contains all the structured sales and business
 * information extracted from the website. It is intended to be used as a
 * single source of truth for a sales assistant bot or other automated tools.
 */

export const salesData = {
  company: {
    name: "Jon.Branding",
    founder: {
      name: "Baxtiyorjon Gaziyev",
      title: "Jon.Branding asoschisi",
      achievements: [
        "50+ dan ortiq muvaffaqiyatli loyihalar",
        "Xalqaro tajriba (3 davlat)",
        "Tez va samarali aloqa",
        "Aniq va shaffof ish jarayoni"
      ],
      message: "Mening maqsadim – shunchaki chiroyli dizayn yaratish emas, balki biznesingiz uchun ishlaydigan, strategiyaga asoslangan va natija keltiradigan brend tizimini qurish. Keling, brendingizni birgalikda tahlil qilamiz va uning 'uxlab yotgan' potensialini uyg'otamiz.",
      videoUrl: "https://player.vimeo.com/video/1109894697"
    },
    contact: {
      phone: "+998336450097",
      telegram: "https://t.me/baxtiyorjon_gaziyev",
      telegramUsername: "@baxtiyorjon_gaziyev",
      address: "O‘zbekiston, Toshkent shahri"
    }
  },
  services: [
    {
      id: "naming",
      name: "Naming",
      description: "Brendingiz uchun unutilmas va kuchli nom tanlash.",
      price: 550,
      note: "Naming xizmati boshqa xizmatlarga qo'shimcha sifatida olinadi."
    },
    {
      id: "logo",
      name: "Logo",
      description: "Biznesingizning o'ziga xosligini aks ettiruvchi professional logotip.",
      price: 550,
      note: "Bu asosiy xizmat."
    },
    {
      id: "style",
      name: "Korporativ uslub",
      description: "Brendingiz uchun yagona vizual tizim (ranglar, shriftlar, elementlar).",
      price: 850
    },
    {
      id: "brandbook",
      name: "Brandbook",
      description: "Brenddan foydalanish bo'yicha to'liq qo'llanma.",
      price: 990
    }
  ],
  pricingAndOffers: {
    currency: "AQSH dollari (USD)",
    paymentTerms: "To'lov O'zbekiston so'mida, to'lov kunidagi Markaziy Bank kursi bo'yicha amalga oshiriladi. Shartnoma asosida, bank hisob raqami orqali.",
    pcgDiscount: {
      name: "PCG 'Tez Natija 3' kursi a'zolari uchun chegirma",
      value: "50%",
      condition: "Paket narxi $550 dan oshganda qo'llaniladi."
    },
    bonus: {
      name: "Biznes vizitka dizayni",
      condition: "Yakuniy narx $1500 dan oshganda sovg'a tariqasida taqdim etiladi."
    },
    specialOffer: {
        name: "Rad etib bo'lmas taklif",
        description: "Har qanday branding paketi uchun kafolatlangan 50% chegirma. Bu taklif cheklangan vaqtga amal qiladi.",
    }
  },
  process: [
    {
      step: 1,
      name: "Brief",
      description: "Sizning maqsadingiz, kutgan natijalaringiz va biznesingiz haqida ma'lumot to'playmiz."
    },
    {
      step: 2,
      name: "Tahlil",
      description: "Bozorni, raqobatchilarni va maqsadli auditoriyangizni chuqur o'rganamiz."
    },
    {
      step: 3,
      name: "Strategiya",
      description: "Tahlil natijalariga asosan brendingiz uchun yo'l xaritasini ishlab chiqamiz."
    },
    {
      step: 4,
      name: "Dizayn",
      description: "Strategiyaga asoslangan holda vizual elementlarni (logo, uslub) yaratamiz."
    },
    {
      step: 5,
      name: "Topshirish",
      description: "Barcha tayyor materiallarni sizga taqdim etamiz va qo'llab-quvvatlaymiz."
    }
  ],
  guarantee: {
    name: "100% Mamnuniyat Kafolati",
    description: "Agar dizayn konsepsiyasining dastlabki variantlaridan ko'nglingiz to'lmasa, biz siz bilan birga ishlab, sizga to'liq ma'qul keladigan yo'nalishni topmagunimizcha qayta ishlaymiz yoki to'lovingizni qaytarib beramiz."
  },
  timelines: {
    logoDesign: "2-3 hafta",
    fullBrandbook: "4-6 hafta",
    note: "Muddlatlar mijozning qayta aloqa tezligiga bog'liq."
  },
  revisions: "Paketga 2-3 marta o'zgartirish kiritish imkoniyati kiradi.",
  deliverables: "Vektor formatida (.svg, .ai), rastr formatida (.png, .jpg) fayllar va brandbook (.pdf).",
  postProjectSupport: "Loyiha tugagandan so'ng 1 oy davomida brend materiallaridan to'g'ri foydalanish bo'yicha bepul maslahat va yordam."
};

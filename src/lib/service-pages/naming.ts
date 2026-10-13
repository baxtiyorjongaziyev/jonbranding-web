import type { ServicePageContent } from '@/components/service-landing/types';
import { ALL_SERVICES, GUARANTEES } from '@/lib/sales-content';
import { staticTestimonials } from '@/lib/static-data';

/**
 * Neyming sahifasi mazmuni (o'zbekcha). Narx, muddat, tarkib va dalil
 * (`proof.items`) — `sales-content/uz.ts` dan; bu yerda faqat sahifa matni.
 * Mijoz sharhlari — `static-data.ts` dagi tasdiqlangan sharhlar.
 */
const naming = ALL_SERVICES.find((s) => s.id === 'naming')!;

const quoteFrom = (company: string) => {
  const t = staticTestimonials.find((item) => item.company.startsWith(company) && item.quote);
  return t ? { name: t.name, company: t.company, quote: t.quote } : null;
};

export const NAMING_PAGE: ServicePageContent = {
  source: 'naming_page',
  serviceKey: 'naming',
  serviceName: 'Neyming',
  price: naming.price,
  priceValue: Number(naming.price.replace(/\D/g, '')),
  duration: naming.duration,

  hero: {
    eyebrow: 'Neyming · nom ishlab chiqish',
    title: 'Esda qoladigan va ro‘yxatdan o‘tkazsa bo‘ladigan nom',
    lead: 'Biznesingiz uchun nom topamiz, nega aynan shu nomligini asoslab beramiz va uni domen, ijtimoiy tarmoq hamda patent bazasi bo‘yicha oldindan tekshiramiz.',
    format: 'Brif → tahlil → nom variantlari → tekshiruv',
    note: 'Nom — brendning yagona o‘zgarmaydigan qismi. Logo yangilanadi, qadoq o‘zgaradi, nom esa yillar davomida qoladi.',
    primaryCta: 'Neyming bo‘yicha konsultatsiya',
  },

  problem: {
    title: 'Nomni “tez o‘ylab topish” keyin qimmatga tushadi',
    intro: 'Ko‘p tadbirkorlar nomni bir kechada, do‘stlar bilan maslahatlashib tanlaydi. Keyin quyidagilar chiqadi:',
    pains: [
      'Nom allaqachon boshqa kompaniya tomonidan patentlangan — rad javobi yoki da’vo keladi.',
      '.uz domeni va Instagram username band — har joyda har xil yozilish.',
      'Nom raqobatchinikiga o‘xshaydi — mijoz adashadi, reklama puli boshqaga ishlaydi.',
      'Talaffuzi qiyin yoki ruscha/inglizcha noqulay ma’no beradi.',
      'Nom faqat bitta mahsulotga bog‘langan — biznes kengayganda tor bo‘lib qoladi.',
      'Yillar o‘tib nomni o‘zgartirish kerak bo‘ladi — peshlavha, qadoq, reklama hammasi qaytadan.',
    ],
    statement: 'Yaxshi nom — chiroyli so‘z emas. Bu himoyalanadigan aktiv.',
    statementLead: 'Shuning uchun nom tanlashda ijod bilan birga tekshiruv ham bo‘ladi: bozor, raqobatchilar, domen, ijtimoiy tarmoqlar va tovar belgilari bazasi.',
  },

  whatIs: {
    title: 'Neyming — bu biznes uchun nom tanlash tizimi',
    paragraphs: [
      'Biz avval biznesingizni, mijozlaringizni va raqobatchilaringizni o‘rganamiz. Keyin nom qanday vazifani bajarishi kerakligini aniqlaymiz: premium ko‘rinishmi, ishonchmi, soddalikmi, xalqaro bozorga chiqishmi.',
      'Shu asosda nom variantlarini ishlab chiqamiz va har birini amaliy tekshiruvdan o‘tkazamiz. Sizga faqat tekshiruvdan o‘tgan, ishlatsa bo‘ladigan nomlar taqdim etiladi — tanlash izohi bilan birga.',
    ],
    isNot: [
      'Generator yoki sun’iy intellekt chiqargan tasodifiy so‘zlar ro‘yxati',
      'Faqat “chiroyli eshitiladi” degan asos',
      'Tovar belgisini ro‘yxatdan o‘tkazish — bu alohida xizmat (patent)',
      'Logotip dizayni — nom tasdiqlangandan keyin alohida ishlanadi',
    ],
  },

  deliverables: {
    title: 'Neyming natijasida nimalar topshiriladi',
    lead: 'Qo‘lingizda nafaqat nom, balki uni nega tanlaganingizni va xavfsizligini ko‘rsatadigan asoslar bo‘ladi.',
    items: [
      {
        title: 'Biznesingizga mos nom',
        subtitle: 'Tekshiruvdan o‘tgan, ishlatishga tayyor',
        details: [naming.deliverables[0], naming.deliverables[5]],
        result: 'Nom biznes, auditoriya va kelajakdagi o‘sishga mos keladi.',
      },
      {
        title: 'Strategik izoh',
        subtitle: 'Nega aynan shu nom',
        details: [naming.deliverables[1], 'Nomning ma’nosi, ohangi va brendga beradigan xarakteri'],
        result: 'Jamoa va hamkorlarga nomni bir xil tushuntirasiz.',
      },
      {
        title: 'Raqobat tahlili',
        subtitle: 'Bozorda adashtirmaydigan nom',
        details: [naming.deliverables[2], 'Kategoriyadagi nomlash odatlari va bo‘sh yo‘nalishlar'],
        result: 'Nomingiz raqobatchilar orasida ajralib turadi.',
      },
      {
        title: 'Mavjudlik tekshiruvi',
        subtitle: 'Domen, tarmoqlar va patent bazasi',
        details: [naming.deliverables[3], naming.deliverables[4]],
        result: 'Nomni bemalol ro‘yxatdan o‘tkazish va ishlatish mumkinligi oldindan ma’lum.',
      },
    ],
  },

  proof: {
    title: 'Biz ishlab chiqqan nomlar',
    lead: 'Bularning bir qismi keyin tovar belgisi sifatida ro‘yxatdan o‘tkazildi — Rutera, Zayyan, Viton, Revo, FIDDA guvohnomalari qo‘limizda.',
    chips: naming.proof?.items,
    quotes: [quoteFrom('Arfadel'), quoteFrom('Velzo')].filter((q): q is NonNullable<typeof q> => q !== null),
  },

  process: {
    title: `Nom qanday tug‘iladi — ${naming.duration}`,
    steps: [
      { title: 'Brif', desc: 'Biznes, mahsulot, mijozlar va kelajak rejalari haqida 40–60 daqiqalik suhbat.' },
      { title: 'Tahlil', desc: 'Raqobatchilar nomlari, kategoriya odatlari va nom bajarishi kerak bo‘lgan vazifa.' },
      { title: 'Nom variantlari', desc: 'Bir nechta yo‘nalishda nomlar ishlab chiqiladi va ichki saralashdan o‘tadi.' },
      { title: 'Tekshiruv', desc: 'Domen, Telegram/Instagram username va O‘zbekiston tovar belgilari bazasi bo‘yicha tekshiruv.' },
      { title: 'Taqdimot va tahrir', desc: 'Nomlar izohi bilan taqdim etiladi. 3 ta bepul tahrir kiritiladi.' },
    ],
  },

  audience: {
    fit: [
      'Yangi biznes, mahsulot yoki filial ochyapsiz',
      'Hozirgi nom ishlamayapti, adashtiradi yoki ro‘yxatdan o‘tmaydi',
      'Franshiza, marketplace yoki eksportga chiqmoqchisiz',
      'Nom bilan birga logo va patentni ham bitta jamoada hal qilmoqchisiz',
    ],
    notFit: [
      'Nom allaqachon tanlangan va patentlangan — unda logo yoki firma uslubidan boshlang',
      'Faqat bir kunlik tadbir yoki vaqtinchalik aksiya uchun nom kerak',
    ],
  },

  guarantees: GUARANTEES,

  related: [
    { title: 'Patent', desc: 'Nom tayyor bo‘lgach — tovar belgisi sifatida ro‘yxatdan o‘tkazamiz. Himoya topshirilgan kundan boshlanadi.', href: '/xizmatlar/patent-kalkulyatori', price: '880 000 so‘mdan' },
    { title: 'Logotip', desc: 'Nom uchun belgi: 3 ta konsepsiya, barcha formatlar va versiyalar.', href: '/xizmatlar/logo-dizayni', price: '8 000 000 so‘m' },
    { title: 'Brend strategiyasi', desc: 'Nomdan oldin: bozorda kim bo‘lishingiz va nima va’da qilishingiz.', href: '/brand-strategy', price: '48 000 000 so‘m' },
  ],

  faqs: [
    { q: 'Neyming narxi qancha va nimalar kiradi?', a: `Neyming ${naming.price} so‘m. Narxga nom, uning strategik izohi, raqobatchilar tahlili, domen va ijtimoiy tarmoq tekshiruvi, O‘zbekiston bo‘yicha patent bazasi tekshiruvi hamda 3 ta bepul tahrir kiradi.` },
    { q: 'Qancha vaqt oladi?', a: `Odatda ${naming.duration}. Brif tez o‘tsa va javoblaringiz o‘z vaqtida bo‘lsa, muddat shartnomada qat’iy belgilanadi.` },
    { q: 'Nomlar yoqmasa-chi?', a: '3 ta bepul tahrir kiritiladi. Har bir tahrirda fikringizni hisobga olib yangi variantlar beramiz. Siz tasdiqlamaguningizcha ish yakunlangan hisoblanmaydi.' },
    { q: 'Nomni patentlab berasizmi?', a: 'Neyming narxiga patent bazasi bo‘yicha tekshiruv kiradi — nom bo‘shligini oldindan bilasiz. Ro‘yxatdan o‘tkazishning o‘zi alohida xizmat: oddiy tartibda ~7 oy, tezkor tartibda 20–40 kun.' },
    { q: 'Nom o‘zbekcha bo‘ladimi yoki inglizcha?', a: 'Biznesingiz va auditoriyangizga qarab. Xalqaro bozor rejada bo‘lsa, buni brifda aytasiz va nom shunga moslab tanlanadi.' },
    { q: 'To‘lovni bo‘lib to‘lasa bo‘ladimi?', a: 'Ha: 50% shartnoma imzolanganda, 50% natija topshirilganda.' },
  ],

  finalCta: {
    title: 'Nomni bir marta to‘g‘ri tanlang.',
    lead: 'Qisqa suhbatda biznesingizni so‘raymiz va nom qanday vazifani bajarishi kerakligini birga aniqlaymiz. Majburiyatsiz.',
  },
};

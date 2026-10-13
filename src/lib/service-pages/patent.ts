import type { ServicePageContent } from '@/components/service-landing/types';
import { ALL_SERVICES, FAQS } from '@/lib/sales-content';
import { certificateDays, PATENT_CERTIFICATES } from '@/lib/patent-certificates';
import { quoteFrom } from './quotes';

/**
 * Ommaviy patent sahifasi (o'zbekcha). Narx/muddat — `sales-content/uz.ts`,
 * huquqiy faktlar — `docs/PATENT-TAQDIMOT.md` (manbalari bilan),
 * natijalar — `patent-certificates.ts` (haqiqiy guvohnomalar).
 */
const check = ALL_SERVICES.find((s) => s.id === 'trademark-search')!;
const standard = ALL_SERVICES.find((s) => s.id === 'trademark-standard')!;
const express = ALL_SERVICES.find((s) => s.id === 'trademark-express')!;
const fastest = Math.min(...PATENT_CERTIFICATES.map(certificateDays));

export const PATENT_PAGE: ServicePageContent = {
  source: 'patent_page',
  serviceKey: 'trademark-standard',
  serviceName: 'Patent — tovar belgisini ro‘yxatdan o‘tkazish',
  price: check.price,
  priceValue: Number(standard.price.replace(/\D/g, '')),
  priceFrom: true,
  duration: `${express.duration} / ${standard.duration}`,

  hero: {
    eyebrow: 'Patent · tovar belgisi',
    title: 'Nomingiz qog‘ozda sizniki bo‘lmasa — u sizniki emas',
    lead: 'Brend nomi va logotipini tovar belgisi sifatida ro‘yxatdan o‘tkazamiz: tekshiruvdan guvohnomagacha. Idorama-idora yurmaysiz — hujjat, yozishma va kuzatuv bizda.',
    format: 'Tekshiruv → talabnoma → ekspertiza → guvohnoma',
    note: `2025–2026 yillarda mijozlarimizga ${PATENT_CERTIFICATES.length} ta guvohnoma olib berdik. Eng tez natija — ${fastest} kun.`,
    primaryCta: 'Nomimni tekshirish',
  },

  problem: {
    title: 'Ro‘yxatdan o‘tmagan brendni bir kunda yo‘qotish mumkin',
    intro: 'Tovar belgisi birinchi bo‘lib talabnoma bergan odamniki. Siz nomni yillab ishlatgan bo‘lsangiz ham:',
    pains: [
      'Boshqa birov nomingizni sizdan oldin ro‘yxatdan o‘tkazadi.',
      'Peshlavha, qadoq, reklama, sahifalar — nom o‘zgarsa, hammasi qaytadan.',
      'Raqobatchi o‘xshash nom bilan chiqsa, uni to‘xtatishga huquqiy asos yo‘q.',
      'Franshiza, investor va marketplace’dagi brend do‘kon guvohnoma so‘raydi.',
    ],
    statement: 'Himoya talabnoma topshirilgan kundan boshlanadi.',
    statementLead: 'Guvohnomada shunday yoziladi: “… yildan e’tiboran 10 yil mobaynida amal qiladi”. Ya’ni qancha erta topshirsangiz, nom shuncha erta sizniki.',
  },

  whatIs: {
    title: 'Patent — nomni 10 yilga rasman o‘zingizniki qilish',
    paragraphs: [
      'Talabnoma Adliya vazirligiga topshiriladi, ekspertizani Intellektual mulk markazi o‘tkazadi. Guvohnoma butun O‘zbekiston bo‘yicha, siz tanlagan mahsulot va xizmat turlari (sinflar) uchun beriladi va 10 yil amal qiladi, keyin uzaytiriladi.',
      'Biz avval nomni rasmiy bazadan tekshiramiz, qaysi sinflar kerakligini aniqlaymiz, hujjatlarni tayyorlab topshiramiz va jarayonni guvohnoma qo‘lingizga tekkuncha kuzatib boramiz.',
    ],
    isNot: [
      'Ro‘yxatdan o‘tish kafolati — yakuniy qarorni davlat ekspertizasi chiqaradi',
      'Davlat bojlari — ular xizmat narxiga kirmaydi, alohida to‘lanadi',
      'Butun dunyo bo‘yicha himoya — guvohnoma O‘zbekiston hududida amal qiladi',
    ],
  },

  deliverables: {
    title: 'Uch bosqich — har birini alohida tanlash mumkin',
    lead: 'Davlat bojlari narxga kirmaydi va alohida to‘lanadi.',
    items: [
      {
        title: `${check.name} — ${check.price} so‘m`,
        subtitle: `${check.duration} · ${check.addon?.label.toLowerCase()} ${check.addon?.price}`,
        details: check.deliverables,
        result: 'Topshirishdan oldin xavf darajasini bilasiz.',
      },
      {
        title: `${standard.name} — ${standard.price} so‘m`,
        subtitle: `Muddat: ~${standard.duration}`,
        details: standard.deliverables,
        result: 'Shoshilmasangiz — eng tejamli yo‘l.',
      },
      {
        title: `${express.name} — ${express.price} so‘m`,
        subtitle: `Muddat: ${express.duration}`,
        details: express.deliverables,
        result: `Rekordimiz — ${fastest} kun.`,
      },
      {
        title: 'Sinflar nima?',
        subtitle: 'Patent mahsulot turi bo‘yicha beriladi',
        details: [
          'Barcha tovar va xizmatlar 45 ta sinfga bo‘lingan',
          'Nom faqat siz tanlagan sinflarda himoyalanadi',
          'Masalan, qahva sotib, kafe ham ochsangiz — 2 ta sinf kerak bo‘ladi',
          'Qaysi sinflar kerakligini tekshiruvda o‘zimiz aniqlaymiz',
        ],
      },
    ],
  },

  proof: {
    title: `${PATENT_CERTIFICATES.length} ta brend — rasman himoyada`,
    lead: 'Oddiy tartibda real muddat odatda ~7 oy bo‘ldi. Quyida — guvohnoma olib bergan mijozlarimiz.',
    quotes: [quoteFrom('Zayan'), quoteFrom('Almaz'), quoteFrom('Velzo'), quoteFrom('Fidda')].filter(
      (q): q is NonNullable<typeof q> => q !== null
    ),
  },

  process: {
    title: 'Jarayon — barchasini biz yuritamiz',
    steps: [
      { title: 'Tekshiruv', desc: 'Nom bo‘shmi, o‘xshashi yo‘qmi; qaysi sinflar kerak.', time: check.duration },
      { title: 'Talabnoma', desc: 'Hujjatlarni tayyorlab Adliya vazirligiga topshiramiz. Himoya shu kundan boshlanadi.' },
      { title: 'Rasmiy tekshiruv', desc: 'Hujjatlar to‘g‘ri to‘ldirilganligi tekshiriladi.', time: '~30 kun' },
      { title: 'Ekspertiza', desc: 'Intellektual mulk markazi nom himoyaga loyiqmi, boshqalarga o‘xshamaydimi — ko‘radi.', time: 'oddiy ~6–7 oy' },
      { title: 'Guvohnoma', desc: 'Davlat reestriga kiritiladi, QR-kodli guvohnoma beriladi.' },
    ],
  },

  audience: {
    fit: [
      check.audience ?? 'Nomni tanlagan, lekin ro‘yxatdan o‘tkazmaganlar',
      express.audience ?? 'Muddat siqib turganlar',
      'Brendni franshiza qilish yoki sotishni rejalashtiryapsiz',
      'Raqobatchi o‘xshash nom bilan chiqib qolishidan xavotirdasiz',
    ],
    notFit: [
      'Nom hali tanlanmagan — avval neyming (tekshiruv unga kiradi)',
      'Faqat bir martalik tadbir yoki vaqtinchalik loyiha',
    ],
  },

  guarantees: [
    'Topshirishdan oldin rasmiy bazadan tekshiramiz va xavf darajasini ochiq aytamiz',
    'Xavf yuqori bo‘lsa — topshirishni emas, nomni moslashni taklif qilamiz',
    'Shartnoma asosida ishlaymiz, to‘lov bosqichma-bosqich',
    'Rad etilsa ham yo‘l bor: 3 oy ichida Apellatsiya kengashiga, keyin sudga',
  ],

  related: [
    { title: 'Neyming', desc: 'Nom hali yo‘q bo‘lsa — patent bazasi tekshiruvi bilan birga.', href: '/xizmatlar/neyming', price: '10 000 000 so‘m' },
    { title: 'Logotip', desc: 'Logotipni ham nom bilan birga tovar belgisi qilish mumkin.', href: '/xizmatlar/logo-dizayni', price: '8 000 000 so‘m' },
    { title: 'Patent kalkulyatori', desc: 'Sinflar soni va tartib bo‘yicha narxni hisoblang.', href: '/xizmatlar/patent-kalkulyatori', price: 'Bepul' },
  ],

  faqs: [
    { q: 'Patent narxi qancha?', a: `Tekshiruv ${check.price} so‘m (1 sinf, har qo‘shimcha sinf ${check.addon?.price}). Ro‘yxatdan o‘tkazish: oddiy ${standard.price} so‘m, tezkor ${express.price} so‘m. Davlat bojlari narxga kirmaydi va alohida to‘lanadi.` },
    { q: 'Qancha vaqt oladi?', a: `Oddiy tartibda ~${standard.duration} (mijozlarimizda odatda 6,7–7,4 oy bo‘ldi). Tezkor tartibda ${express.duration}; eng tez natijamiz ${fastest} kun.` },
    FAQS.find((f) => f.q.startsWith('Patent chiqmay'))!,
    { q: 'Guvohnoma qancha muddat amal qiladi?', a: 'Talabnoma topshirilgan kundan boshlab 10 yil. Keyin yana 10 yilga uzaytirish mumkin.' },
    { q: 'Nomni ham, logotipni ham ro‘yxatdan o‘tkazish kerakmi?', a: 'Brendni qanday ishlatishingizga bog‘liq. Tekshiruvda nima va qaysi sinflarda ro‘yxatdan o‘tkazish kerakligini birga aniqlaymiz.' },
  ],

  finalCta: {
    title: 'Nomingizni bugun tekshiramiz.',
    lead: `${check.duration}da javob: nom bo‘shmi, qaysi sinflar kerak, qancha vaqt va pul ketadi.`,
  },
};

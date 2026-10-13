import type { ServicePageContent } from '@/components/service-landing/types';
import { ALL_SERVICES, FAQS, GUARANTEES, JOBS } from '@/lib/sales-content';
import { quoteFrom } from './quotes';

/** Qadoq dizayni sahifasi mazmuni (o'zbekcha). Narx/tarkib — `sales-content/uz.ts`. */
const pk = ALL_SERVICES.find((s) => s.id === 'packaging')!;
const extra = ALL_SERVICES.find((s) => s.id === 'packaging-extra')!;
const faq = (start: string) => FAQS.find((f) => f.q.startsWith(start))!;

export const PACKAGING_PAGE: ServicePageContent = {
  source: 'packaging_page',
  serviceKey: 'packaging',
  serviceName: 'Qadoq dizayni',
  price: pk.price,
  priceValue: Number(pk.price.replace(/\D/g, '')),
  duration: pk.duration,

  hero: {
    eyebrow: 'Qadoq dizayni',
    title: 'Javonda qo‘lga oldiradigan qadoq',
    lead: `${pk.lead} Javondagi ko‘rinish, texnik chizma va 3D vizualizatsiya bilan.`,
    format: 'Brif → konsepsiya → dieline → bosmaga tayyor fayllar',
    note: `Har qo‘shimcha mahsulot turi — ${extra.price} so‘m, ${extra.duration}. ${extra.lead}`,
    primaryCta: 'Qadoq bo‘yicha konsultatsiya',
  },

  problem: {
    title: 'Xaridor javon oldida bir necha soniya turadi',
    intro: 'Qadoq o‘ylanmagan bo‘lsa, mahsulot sifati ham yordam bermaydi:',
    pains: [
      JOBS[0].pain,
      JOBS[1].pain,
      'Shtrix-kod, tarkib va muddat noto‘g‘ri joylashgan — bosmaxonada qaytariladi.',
      'Har mahsulot qadog‘i har xil — liniya bitta brend bo‘lib ko‘rinmaydi.',
      'Marketplace uchun sifatli rasm yo‘q — kartochka zaif chiqadi.',
      'Dieline yo‘q — bosmaxona bilan har safar tortishuv.',
    ],
    statement: 'Qadoq — javondagi eng arzon sotuvchi.',
    statementLead: 'U mahsulotni ajratib ko‘rsatadi, ma’lumotni tushunarli beradi va narxni oqlaydi.',
  },

  whatIs: {
    title: 'Qadoq dizayni — mahsulotni sotadigan qadoq',
    paragraphs: [
      'Mahsulot, raqobatchilar javoni va xaridorni o‘rganamiz. Keyin qadoq dizaynini javondagi ko‘rinishini hisobga olib yaratamiz.',
      'Siz faqat chiroyli rasm emas, bosmaxonaga darhol topshirsa bo‘ladigan fayllar, texnik chizma (dieline) va marketplace uchun 3D vizualizatsiyani olasiz.',
    ],
    isNot: [
      'Qadoqni ishlab chiqarish yoki bosish — biz bosmaga tayyor fayllarni beramiz',
      'Logotip yaratish — logo tayyor bo‘lishi kerak yoki alohida buyurtma qilinadi',
      'Mahsulot sertifikatsiyasi va yorliqlash qoidalari bo‘yicha yuridik xulosa',
    ],
  },

  deliverables: {
    title: 'Qadoq loyihasida nimalar topshiriladi',
    lead: `Bitta mahsulot turi — ${pk.price} so‘m. Har qo‘shimcha tur — ${extra.price} so‘m.`,
    items: [
      { title: 'Qadoq dizayni', subtitle: 'Javonga mo‘ljallangan', details: [pk.deliverables[0]], result: 'Mahsulot javonda ajralib turadi.' },
      { title: 'Texnik fayllar', subtitle: 'Bosmaxona uchun', details: [pk.deliverables[1], pk.deliverables[4]], result: 'Bosmaxona savolsiz qabul qiladi.' },
      { title: '3D vizualizatsiya', subtitle: 'Taqdimot va marketplace', details: [pk.deliverables[2]], result: 'Mahsulot chiqmasdan sotuvni boshlash mumkin.' },
      { title: 'Majburiy ma’lumotlar', subtitle: 'To‘g‘ri joylashuv', details: [pk.deliverables[3]], result: 'Qadoq qaytarilmaydi.' },
      { title: 'Mahsulot liniyasi', subtitle: `${extra.price} so‘m · ${extra.duration}`, details: extra.deliverables, result: extra.benefit },
    ],
  },

  caseCategories: ['packaging'],
  videoCompanies: ['Tadbirkor', 'Velzo', 'Arfadel', 'Dilbaroy'],

  proof: {
    title: 'Mijozlarimiz nima deydi',
    lead: 'Qadoq va brend ishlangan mijozlarimizning o‘z so‘zlari.',
    quotes: [quoteFrom('Perfona'), quoteFrom('Fidda')].filter((q): q is NonNullable<typeof q> => q !== null),
  },

  process: {
    title: `Qadoq qanday yaratiladi — ${pk.duration}`,
    steps: [
      { title: 'Brif', desc: 'Mahsulot, sotuv joylari, raqobatchilar va texnik talablar (o‘lcham, material, bosmaxona).' },
      { title: 'Konsepsiya', desc: 'Javondagi ko‘rinish hisobga olingan dizayn yo‘nalishlari.' },
      { title: 'Sayqal', desc: 'Tanlangan yo‘nalish, majburiy ma’lumotlar va shtrix-kod joylashuvi.' },
      { title: 'Dieline va 3D', desc: 'Texnik chizma va taqdimot uchun 3D vizualizatsiya.' },
      { title: 'Topshirish', desc: 'Bosmaxonaga topshirishga tayyor fayllar.' },
    ],
  },

  audience: {
    fit: [pk.audience ?? 'Do‘kon yoki marketplace’ga chiqayotgan ishlab chiqaruvchilar', 'Mahsulot sifati yaxshi, lekin javonda ko‘rinmayapti', 'Mahsulot liniyasini bitta oila qilib ko‘rsatmoqchisiz'],
    notFit: ['Brend nomi va logotipi hali yo‘q — avval neyming va logotip', 'Faqat bitta bosma uchun shoshilinch tuzatish kerak'],
  },

  guarantees: GUARANTEES.filter((g) => !g.startsWith('Naming')),

  related: [
    { title: 'Firma uslubi', desc: 'Qadoqdan tashqari barcha materiallar ham bir xil ko‘rinsin.', href: '/xizmatlar/firmenniy-stil', price: '18 000 000 so‘m' },
    { title: 'Patent', desc: 'Qadoqdagi nom va logoni tovar belgisi sifatida himoyalash.', href: '/xizmatlar/patent', price: '880 000 so‘mdan' },
    { title: 'Logotip', desc: 'Logo hali yo‘q yoki eskirgan bo‘lsa.', href: '/xizmatlar/logo-dizayni', price: '8 000 000 so‘m' },
  ],

  faqs: [
    { q: 'Qadoq dizayni narxi qancha?', a: `Bitta mahsulot turi — ${pk.price} so‘m. Har qo‘shimcha mahsulot turi — ${extra.price} so‘m (${extra.duration}). Dizayn, dieline, 3D vizualizatsiya va bosmaga tayyor fayllar kiradi.` },
    { q: 'Qancha vaqt oladi?', a: `Birinchi mahsulot uchun odatda ${pk.duration}, har qo‘shimcha tur uchun ${extra.duration}. Aniq muddat shartnomada yoziladi.` },
    { q: 'Qadoqni bosib berasizmi?', a: 'Yo‘q, biz bosmaxonaga tayyor fayllar va dieline beramiz. Bosishni o‘zingiz tanlagan bosmaxonada qilasiz.' },
    faq('Yoqmasa'),
    faq('To‘lovni'),
  ],

  finalCta: {
    title: 'Mahsulotingizni javonda ko‘rinadigan qiling.',
    lead: 'Qisqa suhbatda mahsulot, sotuv joylari va texnik talablarni ko‘rib chiqamiz. Majburiyatsiz.',
  },
};

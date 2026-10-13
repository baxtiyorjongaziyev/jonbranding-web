import type { ServicePageContent } from '@/components/service-landing/types';
import { ALL_SERVICES, FAQS, GUARANTEES } from '@/lib/sales-content';
import { quoteFrom } from './quotes';

/** Firma uslubi sahifasi mazmuni (o'zbekcha). Narx/tarkib — `sales-content/uz.ts`. */
const vi = ALL_SERVICES.find((s) => s.id === 'visual-identity')!;
const faq = (start: string) => FAQS.find((f) => f.q.startsWith(start))!;

export const VISUAL_IDENTITY_PAGE: ServicePageContent = {
  source: 'visual_identity_page',
  serviceKey: 'visual-identity',
  serviceName: 'Firma uslubi',
  price: vi.price,
  priceValue: Number(vi.price.replace(/\D/g, '')),
  duration: vi.duration,

  hero: {
    eyebrow: 'Firma uslubi · vizual tizim',
    title: 'Brendingiz har joyda bir xil va taniqli ko‘rinsin',
    lead: vi.lead,
    format: 'Ranglar → shriftlar → grafika → maketlar',
    note: 'Mijoz brendni bir marta ko‘rib eslab qolmaydi — u uni ko‘p joyda bir xil ko‘rganda eslab qoladi.',
    primaryCta: 'Firma uslubi bo‘yicha konsultatsiya',
  },

  problem: {
    title: 'Logo bor, lekin brend har joyda boshqacha',
    intro: 'Firma uslubi bo‘lmasa, odatda shunday bo‘ladi:',
    pains: [
      'Instagram, vizitka, peshlavha va qadoqda ranglar har xil.',
      'Har yangi dizayner o‘z shriftini va uslubini olib keladi.',
      'Har bir post yoki banner noldan chiziladi — vaqt va pul ketadi.',
      'Brend tartibsiz ko‘rinadi — mijoz ishonchi pasayadi.',
      'Yangi filial yoki mahsulot qo‘shilganda tizim buziladi.',
      'Raqobatchilar orasida eslab qolinmaydi.',
    ],
    statement: 'Logotip — imzo. Firma uslubi — brendning qo‘l yozuvi.',
    statementLead: 'Ranglar, shriftlar, grafik elementlar va tayyor maketlar brendni har bir materialda bir xil va taniqli qiladi.',
  },

  whatIs: {
    title: 'Firma uslubi — brendning vizual tizimi',
    paragraphs: [
      'Logotip asosida brendning to‘liq vizual tilini yaratamiz: rang palitrasi, shriftlar tizimi, grafik elementlar, patternlar va foto uslubi.',
      'Keyin shu tizimni real tashuvchilarga qo‘llaymiz — vizitkadan ijtimoiy tarmoq shablonlarigacha. Siz tayyor maketlarni olasiz va darhol ishlatasiz.',
    ],
    isNot: [
      'Logotip yaratish — logo tayyor bo‘lishi kerak yoki alohida buyurtma qilinadi',
      'Brendbuk — to‘liq qoidalar qo‘llanmasi alohida xizmat',
      'Har oylik dizayn xizmati (SMM postlari)',
    ],
  },

  deliverables: {
    title: 'Firma uslubida nimalar topshiriladi',
    lead: 'Brendni bugundan boshlab bir xil ko‘rsatish uchun kerakli hamma narsa.',
    items: [
      { title: 'Ranglar', subtitle: 'Bosmada ham, ekranda ham bir xil', details: [vi.deliverables[0]], result: 'Rang har joyda aynan bir xil chiqadi.' },
      { title: 'Shriftlar', subtitle: 'Matn ierarxiyasi', details: [vi.deliverables[1]], result: 'Barcha matnlar bir ovozda gapiradi.' },
      { title: 'Grafika va foto', subtitle: 'Brendning o‘ziga xos tili', details: [vi.deliverables[2], vi.deliverables[3]], result: 'Logosiz ham brend taniladi.' },
      { title: 'Tayyor maketlar', subtitle: 'Darhol ishlatish uchun', details: [vi.deliverables[4]], result: 'Har safar noldan chizish shart emas.' },
    ],
  },

  caseCategories: ['corporate-style', 'brandbook'],
  videoCompanies: ['Tadbirkor', 'Arfadel', 'Dilbaroy', 'Velzo'],

  proof: {
    title: 'Mijozlarimiz nima deydi',
    lead: 'Firma uslubi ishlangan mijozlarimizning o‘z so‘zlari.',
    quotes: [quoteFrom('Fidda'), quoteFrom('Perfona')].filter((q): q is NonNullable<typeof q> => q !== null),
  },

  process: {
    title: `Firma uslubi qanday yaratiladi — ${vi.duration}`,
    steps: [
      { title: 'Brif', desc: 'Brend, auditoriya va qayerlarda ishlatilishi haqida suhbat.' },
      { title: 'Vizual konsepsiya', desc: 'Ranglar, shriftlar va grafik til yo‘nalishi taqdim etiladi.' },
      { title: 'Tizim', desc: 'Tasdiqlangan yo‘nalish bo‘yicha palitra, shriftlar, patternlar va foto uslubi.' },
      { title: 'Maketlar', desc: '10+ tashuvchi: vizitka, blank, konvert, forma, banner, ijtimoiy tarmoq shablonlari.' },
      { title: 'Topshirish', desc: 'Barcha manba fayllar va maketlar.' },
    ],
  },

  audience: {
    fit: [vi.audience ?? 'Logosi bor, lekin har joyda har xil ko‘rinayotgan biznes', 'Filial, franshiza yoki yangi mahsulot liniyasi ochyapsiz', 'Marketing jamoangiz har safar noldan dizayn qilyapti'],
    notFit: ['Logotip hali yo‘q — avval logotip', 'Qoidalarni ham to‘liq hujjatlashtirish kerak — firma uslubi + brendbuk birga'],
  },

  guarantees: GUARANTEES.filter((g) => !g.startsWith('Naming')),

  related: [
    { title: 'Brendbuk', desc: 'Firma uslubi qoidalari bitta hujjatda — yangi dizayner kelsa ham tizim buzilmaydi.', href: '/xizmatlar/brandbook', price: '24 000 000 so‘m' },
    { title: 'Logotip', desc: 'Logo hali yo‘q yoki eskirgan bo‘lsa.', href: '/xizmatlar/logo-dizayni', price: '8 000 000 so‘m' },
    { title: 'Qadoq dizayni', desc: 'Firma uslubini javonga olib chiqish.', href: '/xizmatlar/qadoq-dizayni', price: '12 000 000 so‘m' },
  ],

  faqs: [
    { q: 'Firma uslubi narxi qancha?', a: `${vi.price} so‘m. Rang palitrasi, shriftlar tizimi, grafik elementlar, foto uslubi va 10 dan ortiq tashuvchi maketi kiradi.` },
    { q: 'Qancha vaqt oladi?', a: `Odatda ${vi.duration}. Aniq muddat shartnomada yoziladi.` },
    { q: 'Firma uslubi va brendbuk farqi nima?', a: 'Firma uslubi — vizual tizimning o‘zi: ranglar, shriftlar, grafika va maketlar. Brendbuk — shu tizimni qanday ishlatish va ishlatmaslik qoidalari yozilgan qo‘llanma. Birga olinsa, ikkalasi bitta tizim sifatida ishlanadi.' },
    faq('Yoqmasa'),
    faq('Mendan nima'),
    faq('To‘lovni'),
  ],

  finalCta: {
    title: 'Brendingizni bir ovozda gapirtiring.',
    lead: 'Qisqa suhbatda brendingiz hozir qayerlarda va qanday ishlatilayotganini ko‘rib chiqamiz. Majburiyatsiz.',
  },
};

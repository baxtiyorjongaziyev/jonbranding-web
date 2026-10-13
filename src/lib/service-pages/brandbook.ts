import type { ServicePageContent } from '@/components/service-landing/types';
import { ALL_SERVICES, FAQS, GUARANTEES } from '@/lib/sales-content';
import { quoteFrom } from './quotes';

/** Brendbuk sahifasi mazmuni (o'zbekcha). Narx/tarkib — `sales-content/uz.ts`. */
const bb = ALL_SERVICES.find((s) => s.id === 'brandbook')!;
const faq = (start: string) => FAQS.find((f) => f.q.startsWith(start))!;

export const BRANDBOOK_PAGE: ServicePageContent = {
  source: 'brandbook_page',
  serviceKey: 'brandbook',
  serviceName: 'Brendbuk',
  price: bb.price,
  priceValue: Number(bb.price.replace(/\D/g, '')),
  duration: bb.duration,

  hero: {
    eyebrow: 'Brendbuk · qo‘llash qoidalari',
    title: 'Brendingiz qoidalari bitta hujjatda',
    lead: bb.lead + ' Logodan tortib murojaat uslubigacha — hammasi 60+ sahifali qo‘llanmada.',
    format: 'Audit → qoidalar → maketlar → PDF qo‘llanma',
    note: bb.benefit,
    primaryCta: 'Brendbuk bo‘yicha konsultatsiya',
  },

  problem: {
    title: 'Brend dizaynerga bog‘lanib qolsa, u bilan birga ketadi',
    intro: 'Qoidalar yozilmagan brendda odatda shunday bo‘ladi:',
    pains: [
      'Dizayner almashgach brend ko‘rinishi ham o‘zgaradi.',
      'Logoni cho‘zishadi, rangini o‘zgartirishadi, fonga noto‘g‘ri qo‘yishadi.',
      'Agentlik, bosmaxona va SMM har biri o‘zicha tushunadi.',
      'Har savolga rahbarning o‘zi javob berishi kerak bo‘ladi.',
      'Filial va hamkorlar brendni har xil ishlatadi.',
      'Brend tili — kim qanday gapirsa shunday.',
    ],
    statement: 'Brendbuk — brendni odamga emas, qoidaga bog‘laydi.',
    statementLead: 'Yangi xodim, dizayner yoki hamkor brendni birinchi kundanoq to‘g‘ri ishlatadi — so‘rab yurmasdan.',
  },

  whatIs: {
    title: 'Brendbuk — brendni ishlatish bo‘yicha qo‘llanma',
    paragraphs: [
      'Brendbukda logotip, ranglar, shriftlar, grafik elementlar va barcha tashuvchilar bo‘yicha aniq qoidalar yoziladi — to‘g‘ri va noto‘g‘ri misollar bilan.',
      'Bundan tashqari brend tili — mijoz bilan qanday gaplashish va qanday gaplashmaslik — ham belgilanadi. Natija: jamoa, dizaynerlar va hamkorlar uchun bitta manba.',
    ],
    isNot: [
      'Firma uslubini noldan yaratish — tizim bo‘lishi kerak yoki birga buyurtma qilinadi',
      'Brend strategiyasi — bozordagi o‘rinni aniqlash alohida xizmat',
      'Bir martalik chiroyli taqdimot — bu ishlaydigan qo‘llanma',
    ],
  },

  deliverables: {
    title: 'Brendbukda nimalar bo‘ladi',
    lead: 'Brendni kim ishlatsa ham to‘g‘ri ishlatishi uchun.',
    items: [
      { title: 'Qo‘llanma', subtitle: 'Bitta PDF — bitta manba', details: [bb.deliverables[0]], result: 'Hamma bitta hujjatga qaraydi.' },
      { title: 'Logo qoidalari', subtitle: 'Xato misollari bilan', details: [bb.deliverables[1]], result: 'Logo hech qayerda buzilmaydi.' },
      { title: 'Rang va tipografika', subtitle: 'To‘liq spetsifikatsiya', details: [bb.deliverables[2], bb.deliverables[3]], result: 'Bosmaxona va dizayner savol bermaydi.' },
      { title: 'Brend tili', subtitle: 'Tone of voice', details: [bb.deliverables[4]], result: 'Sotuv va SMM bir ovozda gapiradi.' },
    ],
  },

  caseCategories: ['brandbook', 'corporate-style'],
  videoCompanies: ['Tadbirkor', 'Dilbaroy', 'Arfadel', 'Velzo'],

  proof: {
    title: 'Mijozlarimiz nima deydi',
    lead: 'Brend tizimi ishlangan mijozlarimizning o‘z so‘zlari.',
    quotes: [quoteFrom('Fidda'), quoteFrom('Barakah')].filter((q): q is NonNullable<typeof q> => q !== null),
  },

  process: {
    title: `Brendbuk qanday tayyorlanadi — ${bb.duration}`,
    steps: [
      { title: 'Audit', desc: 'Mavjud logo, firma uslubi va brend qayerlarda ishlatilayotgani ko‘rib chiqiladi.' },
      { title: 'Tuzilma', desc: 'Qo‘llanma bo‘limlari va qamrovi kelishiladi.' },
      { title: 'Qoidalar', desc: 'Logo, rang, tipografika, grafika va tashuvchilar bo‘yicha qoidalar va misollar.' },
      { title: 'Brend tili', desc: 'Murojaat uslubi: qanday gapiramiz va qanday gapirmaymiz.' },
      { title: 'Topshirish', desc: 'PDF qo‘llanma va barcha tayyor maketlar.' },
    ],
  },

  audience: {
    fit: [bb.audience ?? 'Jamoasi o‘sayotgan biznes', 'Filial, franshiza yoki dilerlar tarmog‘i bor', 'Bir nechta agentlik va dizayner bilan ishlaysiz'],
    notFit: ['Logo va firma uslubi hali yo‘q — avval vizual tizim', 'Brend faqat bitta odam tomonidan va bitta joyda ishlatiladi'],
  },

  guarantees: GUARANTEES.filter((g) => !g.startsWith('Naming')),

  related: [
    { title: 'Firma uslubi', desc: bb.note ?? 'Birga olinsa, bitta tizim sifatida ishlanadi.', href: '/xizmatlar/firmenniy-stil', price: '18 000 000 so‘m' },
    { title: 'Brend strategiyasi', desc: 'Brend tili va xarakteri strategiyadan kelib chiqadi.', href: '/brand-strategy', price: '48 000 000 so‘m' },
    { title: 'Patent', desc: 'Brendni tovar belgisi sifatida himoyalash.', href: '/xizmatlar/patent', price: '880 000 so‘mdan' },
  ],

  faqs: [
    { q: 'Brendbuk narxi qancha?', a: `${bb.price} so‘m. 60 dan ortiq sahifali PDF qo‘llanma, logo qoidalari xato misollari bilan, ranglar va tipografika spetsifikatsiyasi, tashuvchilar maketlari va brend tili kiradi.` },
    { q: 'Qancha vaqt oladi?', a: `Odatda ${bb.duration}. Aniq muddat shartnomada yoziladi.` },
    { q: 'Firma uslubisiz brendbuk qilsa bo‘ladimi?', a: 'Brendbuk mavjud vizual tizimni hujjatlashtiradi. Tizim hali bo‘lmasa, firma uslubi bilan birga buyurtma qilinadi — shunda ikkalasi bitta tizim sifatida ishlanadi.' },
    faq('Mendan nima'),
    faq('To‘lovni'),
  ],

  finalCta: {
    title: 'Brendingiz sizsiz ham to‘g‘ri ishlasin.',
    lead: 'Qisqa suhbatda brendingiz hozir qanday ishlatilayotganini ko‘rib chiqamiz va qo‘llanma qamrovini belgilaymiz. Majburiyatsiz.',
  },
};

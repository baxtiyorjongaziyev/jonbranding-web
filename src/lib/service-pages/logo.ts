import type { ServicePageContent } from '@/components/service-landing/types';
import { ALL_SERVICES, FAQS, GUARANTEES } from '@/lib/sales-content';
import { quoteFrom } from './quotes';

/** Logotip sahifasi mazmuni (o'zbekcha). Narx/tarkib — `sales-content/uz.ts`. */
const logo = ALL_SERVICES.find((s) => s.id === 'logo')!;
const faq = (start: string) => FAQS.find((f) => f.q.startsWith(start))!;

export const LOGO_PAGE: ServicePageContent = {
  source: 'logo_page',
  serviceKey: 'logo',
  serviceName: 'Logotip',
  price: logo.price,
  priceValue: Number(logo.price.replace(/\D/g, '')),
  duration: logo.duration,

  hero: {
    eyebrow: 'Logotip dizayni',
    title: 'Har qanday o‘lchamda bir xil ishlaydigan logotip',
    lead: logo.lead + ' 3 ta konsepsiyadan tanlaysiz, tanlanganini oxirigacha sayqallaymiz va barcha formatlarda topshiramiz.',
    format: '3 ta konsepsiya → tanlov → sayqal → fayllar',
    note: 'Logotip — ko‘rinish emas, vosita. U peshlavhada, Instagram avatarida, qadoqda va vizitkada birdek aniq o‘qilishi kerak.',
    primaryCta: 'Logotip bo‘yicha konsultatsiya',
  },

  problem: {
    title: 'Logotip ko‘pincha bitta joyda chiroyli, qolganida ishlamaydi',
    intro: 'Arzon yoki shoshilinch qilingan logotiplarda odatda shu muammolar chiqadi:',
    pains: [
      'Kichik o‘lchamda (avatar, favicon) o‘qib bo‘lmaydi.',
      'Faqat bitta rangda bor — oq-qora yoki bir rangli bosmaga mos emas.',
      'Faqat PNG fayl berilgan — peshlavha yoki bosmaxona uchun vektor yo‘q.',
      'Mahsulot sifati yuqori, lekin logo arzon ko‘rinadi — narxni ko‘tarish qiyin.',
      'Shablon yoki internetdagi belgiga o‘xshash — patentlab bo‘lmaydi.',
      'Har dizayner logoni o‘zicha ishlatadi — qoidasi yo‘q.',
    ],
    statement: 'Yaxshi logotip — bu belgi + uni to‘g‘ri ishlatish qoidalari.',
    statementLead: 'Shuning uchun logotip bilan birga barcha versiyalar, formatlar va minimal o‘lcham hamda bo‘sh joy qoidalarini topshiramiz.',
  },

  whatIs: {
    title: 'Logotip — brendning yuzi va imzosi',
    paragraphs: [
      'Avval biznesingizni, auditoriyangizni va raqobatchilaringizni o‘rganamiz. Keyin 3 ta turli yo‘nalishda konsepsiya taqdim etamiz — har birining g‘oyasi va qo‘llanishi bilan.',
      'Siz bittasini tanlaysiz, biz uni oxirigacha sayqallaymiz va barcha kerakli versiyalarni tayyorlaymiz. Siz tasdiqlamaguningizcha keyingi bosqichga o‘tilmaydi.',
    ],
    isNot: [
      'Tayyor shablon yoki internetdan olingan belgi',
      'Faqat bitta PNG fayl',
      'Firma uslubi (ranglar, shriftlar, maketlar) — bu alohida xizmat',
      'Tovar belgisini ro‘yxatdan o‘tkazish — bu ham alohida (patent)',
    ],
  },

  deliverables: {
    title: 'Logotip loyihasida nimalar topshiriladi',
    lead: 'Logoni istalgan joyda — bosmadan tortib ekran va peshlavhagacha — darhol ishlatishingiz uchun hamma narsa.',
    items: [
      {
        title: 'Konsepsiyalar',
        subtitle: 'Bittada emas — uchta yo‘nalishdan tanlaysiz',
        details: [logo.deliverables[0]],
        result: 'Tanlov sizda, asoslangan variantlar orasidan.',
      },
      {
        title: 'Barcha formatlar',
        subtitle: 'Bosmaxona ham, dizayner ham so‘raydigan fayllar',
        details: [logo.deliverables[1]],
        result: 'Hech kimdan fayl so‘rab yurmaysiz.',
      },
      {
        title: 'Versiyalar',
        subtitle: 'Har xil fon va joy uchun',
        details: [logo.deliverables[2], logo.deliverables[3]],
        result: 'Avatar, peshlavha va qadoqda bir xil taniladi.',
      },
      {
        title: 'Qo‘llash qoidalari',
        subtitle: 'Logo buzilmasligi uchun',
        details: [logo.deliverables[4]],
        result: 'Kim ishlatsa ham logo to‘g‘ri ko‘rinadi.',
      },
    ],
  },

  caseCategories: ['logo-design', 'corporate-style'],
  videoCompanies: ['Tadbirkor', 'Arfadel', 'Dilbaroy', 'Velzo'],

  proof: {
    title: 'Mijozlarimiz nima deydi',
    lead: 'Logotip ishlangan mijozlarimizning o‘z so‘zlari.',
    quotes: [quoteFrom('Perfona'), quoteFrom('Barakah'), quoteFrom('Arfadel'), quoteFrom('Tadbirkor')].filter(
      (q): q is NonNullable<typeof q> => q !== null
    ),
  },

  process: {
    title: `Logotip qanday yaratiladi — ${logo.duration}`,
    steps: [
      { title: 'Brif', desc: 'Biznes, auditoriya, raqobatchilar va sizga yoqadigan/yoqmaydigan uslublar haqida suhbat.' },
      { title: 'Tahlil', desc: 'Kategoriyadagi raqobatchilar logotiplari va ajralib turish yo‘nalishlari.' },
      { title: '3 ta konsepsiya', desc: 'Uch xil g‘oya — har biri real qo‘llanish misollari bilan taqdim etiladi.' },
      { title: 'Sayqal', desc: 'Tanlangan yo‘nalish bo‘yicha tahrirlar, proporsiya va detallar.' },
      { title: 'Topshirish', desc: 'Barcha formatlar, versiyalar va qo‘llash qoidalari.' },
    ],
  },

  audience: {
    fit: [
      logo.audience ?? 'Logosi yo‘q yoki eskirgan biznes',
      'Yangi brend, mahsulot yoki filial ochyapsiz',
      'Narxni ko‘tarmoqchisiz, lekin ko‘rinish bunga mos emas',
      'Logoni keyin patentlamoqchisiz',
    ],
    notFit: [
      'Nom hali tanlanmagan — avval neyming',
      'Logo bor, lekin har joyda har xil ko‘rinadi — sizga firma uslubi kerak',
    ],
  },

  guarantees: GUARANTEES.filter((g) => !g.startsWith('Naming')),

  related: [
    { title: 'Firma uslubi', desc: 'Ranglar, shriftlar, grafik elementlar va 10+ tashuvchi maketi.', href: '/xizmatlar/firmenniy-stil', price: '18 000 000 so‘m' },
    { title: 'Patent', desc: 'Logotipni tovar belgisi sifatida ro‘yxatdan o‘tkazish.', href: '/xizmatlar/patent-kalkulyatori', price: '880 000 so‘mdan' },
    { title: 'Neyming', desc: 'Nom hali yo‘q bo‘lsa — logodan oldin nom.', href: '/xizmatlar/neyming', price: '10 000 000 so‘m' },
  ],

  faqs: [
    faq('Nega 8 mln'),
    { q: 'Qancha vaqt oladi?', a: `Odatda ${logo.duration}. Aniq muddat shartnomada yoziladi.` },
    faq('Yoqmasa'),
    faq('Mendan nima'),
    { q: 'Qanday fayllar beriladi?', a: 'AI, EPS, SVG, PDF va PNG. Rangli, oq-qora va bir rangli; gorizontal, vertikal va ixcham (ikonka) variantlari.' },
    faq('To‘lovni'),
  ],

  finalCta: {
    title: 'Logotip bir marta to‘g‘ri qilinadi.',
    lead: 'Qisqa suhbatda biznesingizni so‘raymiz va logotip qanday vazifani bajarishi kerakligini aniqlaymiz. Majburiyatsiz.',
  },
};

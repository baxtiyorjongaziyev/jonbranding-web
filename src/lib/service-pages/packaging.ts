import type { ServicePageContent } from '@/components/service-landing/types';
import { ALL_SERVICES, GUARANTEES } from '@/lib/sales-content';
import { quoteFrom } from './quotes';

const packaging = ALL_SERVICES.find((s) => s.id === 'packaging')!;

export const PACKAGING_PAGE: ServicePageContent = {
  source: 'packaging_page',
  serviceKey: 'packaging',
  serviceName: 'Qadoq dizayni',
  price: packaging.price,
  priceValue: Number(packaging.price.replace(/\D/g, '')),
  duration: packaging.duration,

  hero: {
    eyebrow: 'Qadoq dizayni · packaging design',
    title: 'Do‘kon javonida qo‘lga oldiradigan qadoq dizayni',
    lead: 'Mahsulotingiz qanchalik sifatli bo‘lmasin, xaridor avval uning qadog‘iga qarab baholaydi. Javonda raqobatchilardan ajralib turadigan, texnik chizmasi (dieline) va 3D renderlari bilan to‘liq qadoq tizimi.',
    format: 'Raqobat tahlili → javon ergonomikasi → 3D vizualizatsiya → dieline chizma → bosmaga tayyor fayl',
    note: 'Xaridor javon oldida 3–5 soniya to‘xtaydi. Biz shu soniyalarda mahsulotingizni tanlashga undaydigan vizual yechim qilamiz.',
    primaryCta: 'Qadoq bo‘yicha konsultatsiya',
  },

  problem: {
    title: 'Noto‘g‘ri qadoq sabab qancha sotuv yo‘qotilmoqda?',
    intro: 'Ko‘p ishlab chiqaruvchilar qadoq dizayniga shunchaki oddiy yorliq deb qaraydi. Oqibatda:',
    pains: [
      'Mahsulot do‘kon javonida raqobatchilar orasida ko‘rinmay, yo‘qolib ketadi.',
      'Shtrix-kod, tarkib yoki sertifikat belgilari noto‘g‘ri joylashgani uchun savdo tarmoqlari qabul qilmaydi.',
      'Tipografiya talablari (dieline, lak, folga, tishlar) hisobga olinmagani sababli bosmada minglab qutilar brakka chiqadi.',
      'Mahsulot sifati yuqori, lekin qadoq arzon ko‘ringani uchun uni qimmatroq sotib bo‘lmaydi.',
      'Marketplace yoki internetda kichik rasm holatida sarlavha va afzalliklar o‘qilmaydi.',
    ],
    statement: 'Qadoq — bu sizning eng arzon va eng kuchli sotuvchingiz.',
    statementLead: 'U kechayu kunduz javonda turib, mijoz bilan birinchi muloqotni o‘rnatadi. To‘g‘ri qadoq reklamasiz ham o‘zini sotadi.',
  },

  whatIs: {
    title: 'Qadoq dizayni nima va unga nimalar kiradi?',
    paragraphs: [
      'Biz avval supermarket javonini, toifadagi raqobatchilarni va xaridor psixologiyasini o‘rganamiz. Qadoq qaysi rang va kompozitsiya orqali darhol ko‘zga tashlanishi kerakligini aniqlaymiz.',
      'Dizayn yaratilgach, uni bosmaxonaning aniq pichoq chizmasiga (dieline) moslaymiz va 3D formatda har tomondan ko‘rsatamiz.',
    ],
    isNot: [
      'Faqat internetdan olingan rasmning ustiga yozuv yozish',
      'Texnik chizmasiz va bosma talablarisiz tayyorlangan havaskor maket',
      'Bir martalik dizayn — bu butun mahsulot liniyasi uchun kengayuvchi tizim',
    ],
  },

  deliverables: {
    title: 'Qadoq loyihasida nimalar topshiriladi',
    lead: 'To‘g‘ridan-to‘g‘ri bosmaxonaga yoki yorliq chiqaruvchiga berishga 100% tayyor fayllar to‘plami.',
    items: [
      {
        title: 'Qadoq vizual konsepsiyasi',
        subtitle: 'Javonda raqobatchilardan ajratib turuvchi dizayn',
        details: [packaging.deliverables[0], 'Front, back va yon tomonlarning uyg‘un kompozitsiyasi'],
        result: 'Xaridor ko‘zi darhol sizning mahsulotingizga tushadi.',
      },
      {
        title: 'Dieline va texnik chizma',
        subtitle: 'Bosmaxona pichog‘i va bukilish chiziqlari',
        details: [packaging.deliverables[1], packaging.deliverables[4]],
        result: 'Bosmaxonada ortiqcha savol va brak bo‘lmaydi.',
      },
      {
        title: '3D vizualizatsiya va renderlar',
        subtitle: 'Marketplace va reklama uchun fotorealistik tasvirlar',
        details: [packaging.deliverables[2], 'Turli rakurslardagi yuqori aniqlikdagi 3D rasmlar'],
        result: 'Mahsulot hali chop etilmasdan oldin uni reklama qila olasiz.',
      },
      {
        title: 'Texnik va qonuniy ma’lumotlar tartibi',
        subtitle: 'Shtrix-kod, tarkib, muddat va standartlar',
        details: [packaging.deliverables[3]],
        result: 'Savdo tarmoqlari va eksport talablariga to‘liq javob beradi.',
      },
    ],
  },

  proof: {
    title: 'Biz qadoq dizaynini yaratgan brendlar',
    lead: 'Mijozlarimiz qadoqlari O‘zbekiston va xalqaro bozorlarda muvaffaqiyatli sotilmoqda.',
    chips: ['Den Aroma', 'Sunnah Products', 'Sadiya Cakes', 'Boyarin', 'Rashmilk', 'Fidda'],
    quotes: [quoteFrom('Den Aroma'), quoteFrom('Sadiya Cakes')].filter((q): q is NonNullable<typeof q> => q !== null),
  },

  process: {
    title: `Qadoq qanday yaratiladi — ${packaging.duration}`,
    steps: [
      { title: 'Brif va o‘lchamlar', desc: 'Mahsulot turi, idish/quti o‘lchami va bosmaxona talablarini olamiz.' },
      { title: 'Raqobat tahlili', desc: 'Javonda kimlar bilan yonma-yon turishingizni o‘rganamiz.' },
      { title: 'Dizayn konsepsiyasi', desc: 'Asosiy vizual yechim va kompozitsiya taqdim etiladi.' },
      { title: '3D model va sayqal', desc: 'Dizaynni 3D modelda ko‘rib, tahrirlar kiritiladi.' },
      { title: 'Bosmaga tayyorlash', desc: 'Pichoq chizmasi (dieline), Pantone/CMYK va vektor fayllar topshiriladi.' },
    ],
  },

  audience: {
    fit: [
      'Yangi mahsulot chiqarmoqchi bo‘lgan ishlab chiqaruvchilar',
      'Do‘konlar, supermarketlar va marketplace’larga kirayotgan brendlar',
      'Eski qadog‘i javonda sotilmayotgan yoki raqobatchilardan orqada qolayotgan bizneslar',
      'Eksport bozoriga chiqishni rejalashtirayotgan kompaniyalar',
    ],
    notFit: [
      'Mahsulotning aniq o‘lchami va formati noma’lum bo‘lgan holatlar — avval idish/quti turini aniqlash lozim',
    ],
  },

  guarantees: GUARANTEES,

  related: [
    { title: 'Firma uslubi', desc: 'Brendingiz uchun to‘liq korporativ aydentika.', href: '/xizmatlar/firmenniy-stil', price: '18 000 000 so‘m' },
    { title: 'Logotip', desc: 'Qadoqda bir xil ishlaydigan belgi va vektor formatlar.', href: '/xizmatlar/logo-dizayni', price: '8 000 000 so‘m' },
    { title: 'Patent', desc: 'Brend nomingiz va tovar belgingizni himoya qilish.', href: '/xizmatlar/patent', price: '880 000 so‘mdan' },
  ],

  faqs: [
    { q: 'Qadoq dizayni narxi qancha?', a: `Bitta mahsulot turi uchun qadoq dizayni ${packaging.price} so‘m. Agar bir xil tizimda qo‘shimcha ta’m yoki turlar bo‘lsa, har biri uchun 4 000 000 so‘mdan qo‘shiladi.` },
    { q: 'Qancha vaqtda tayyor bo‘ladi?', a: `Bitta qadoq dizayni ${packaging.duration} ichida tayyorlab topshiriladi.` },
    { q: 'Bosmaxona talablariga mos keladimi?', a: 'Albatta. Biz bevosita bosmaxonangizning texnik talablarini (dieline, pichoq, lak, rang profili) olib, fayllarni ularning standartiga 100% moslab beramiz.' },
    { q: '3D rasmlar qayerda ishlatiladi?', a: '3D fotorealistik renderlar Instagram, Telegram, veb-sayt, katalog va marketplace (Uzum, Wildberries) kartochkalarida mahsulotni chiroyli ko‘rsatish uchun ishlatiladi.' },
  ],

  finalCta: {
    title: 'Mahsulotingiz javonda eng ko‘p sotiladigan brendga aylansin.',
    lead: 'Mutaxassis bilan suhbatda mahsulotingiz uchun eng to‘g‘ri qadoq yechimini bepul maslahatlashib oling.',
  },
};

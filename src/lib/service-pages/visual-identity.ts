import type { ServicePageContent } from '@/components/service-landing/types';
import { ALL_SERVICES, GUARANTEES } from '@/lib/sales-content';
import { quoteFrom } from './quotes';

const visualIdentity = ALL_SERVICES.find((s) => s.id === 'visual-identity')!;

export const VISUAL_IDENTITY_PAGE: ServicePageContent = {
  source: 'visual_identity_page',
  serviceKey: 'visual-identity',
  serviceName: 'Firma uslubi',
  price: visualIdentity.price,
  priceValue: Number(visualIdentity.price.replace(/\D/g, '')),
  duration: visualIdentity.duration,

  hero: {
    eyebrow: 'Firma uslubi · vizual aydentika',
    title: 'Har bir aloqa nuqtasida bir xil taniladigan brend uslubi',
    lead: 'Logotip — faqat imzo. Firma uslubi — ranglar, shriftlar, grafik elementlar va 10 dan ortiq tashuvchi maketlarining yaxlit tizim sifatida ishlashi.',
    format: 'Brif → vizual yo‘nalish → rang va shrift tizimi → 10+ maket → bosmaga tayyor fayllar',
    note: 'Mijoz brendingizni bitta belgi orqali emas, har bir nuqtadagi (vizitka, peshlavha, forma, Instagram) yagona professional intizom orqali taniydi va ishonadi.',
    primaryCta: 'Firma uslubi bo‘yicha konsultatsiya',
  },

  problem: {
    title: 'Logotip bor, lekin har joyda har xil ko‘rinsa nima bo‘ladi?',
    intro: 'Ko‘p kompaniyalarda logotip bo‘ladi, ammo umumiy vizual intizom bo‘lmagani sababli:',
    pains: [
      'Instagramda bitta rang, do‘konda boshqa rang, vizitkada uchinchi rang — mijozda brend xotirasi shakllanmaydi.',
      'Yangi dizayner yoki marketing xodimi kelsa, materiallarni o‘z didiga qarab o‘zgartirib yuboradi.',
      'Bosmaxonaga beriladigan aniq rang kodlari (Pantone, CMYK) yo‘q — bosmada ranglar xira yoki xato chiqadi.',
      'Reklama va posterlar havaskorona ko‘rinadi — kompaniya mahsuloti qimmat bo‘lsa ham arzon taassurot qoldiradi.',
      'Filiallar yoki yangi do‘konlar ochilganda yagona korporativ standart yo‘qligi sababli boshboshdoqlik boshlanadi.',
    ],
    statement: 'Kuchli brend — bir xil qoidaga bo‘ysunadigan vizual tizimdir.',
    statementLead: 'Shuning uchun firma uslubida faqat chiroyli rang emas, balki kompaniyangiz har kuni ishlatadigan aniq amaliy maketlar ishlab chiqiladi.',
  },

  whatIs: {
    title: 'Firma uslubi — bu biznesning yagona vizual tili',
    paragraphs: [
      'Biz logotipingiz mohiyatidan kelib chiqib, brendingizning to‘liq vizual tizimini ishlab chiqamiz. Unga ranglar palitrasi, tipografika qoidalari, korporativ naqshlar (patternlar) va amaliy tashuvchilar kiradi.',
      'Har bir maket shunchaki rasm emas, bosmaxona va ishlab chiqarish uchun texnik standartlarga (spetsifikatsiya) muvofiq tayyorlanadi.',
    ],
    isNot: [
      'Faqat logotip chizish — bu alohida xizmat',
      'Shunchaki internetdan olingan tasodifiy ranglar to‘plami',
      'To‘liq 60+ sahifali Brandbook — Brendbuk qoidalar kitobi sifatida alohida yoki birgalikda olinadi',
      'Bir martalik post dizayni — bu uzoq yillik vizual tizim',
    ],
  },

  deliverables: {
    title: 'Firma uslubi loyihasida nimalar topshiriladi',
    lead: 'Kompaniyangiz faoliyatida kerak bo‘ladigan barcha vizual materiallar to‘liq tayyor holda topshiriladi.',
    items: [
      {
        title: 'Ranglar tizimi',
        subtitle: 'Pantone, CMYK, RGB, HEX',
        details: [visualIdentity.deliverables[0], 'Asosiy va qo‘shimcha ranglarning aniq mutanosiblik qoidalari'],
        result: 'Bosmaxonada ham, ekranda ham rang aynan siz xohlagandek chiqadi.',
      },
      {
        title: 'Tipografika va shriftlar',
        subtitle: 'Sarlavha, asosiy matn va aksent',
        details: [visualIdentity.deliverables[1], 'Litsenziyali yoki erkin foydalaniladigan shrift oilalari'],
        result: 'Barcha taqdimot va hujjatlarda yagona o‘qish madaniyati bo‘ladi.',
      },
      {
        title: 'Grafik elementlar va patternlar',
        subtitle: 'Brend xarakterini kuchaytiruvchi fon va naqshlar',
        details: [visualIdentity.deliverables[2], visualIdentity.deliverables[3]],
        result: 'Logotip bo‘lmagan joyda ham mijoz brendingizni taniydi.',
      },
      {
        title: '10+ amaliy tashuvchi maketlari',
        subtitle: 'Har kuni ishlatiladigan korporativ vositalar',
        details: [
          'Vizitka (shaxsiy va korporativ)',
          'Korporativ blank va konvert',
          'Korporativ papka va bloknot',
          'Xodimlar formasi va bejik',
          'Tashqi reklama bilbordi yoki banner',
          'Ijtimoiy tarmoqlar uchun shablonlar (post, stories, cover)',
        ],
        result: 'Bosmaxonaga to‘g‘ridan-to‘g‘ri beriladigan tayyor vektor fayllar.',
      },
    ],
  },

  proof: {
    title: 'Firma uslubini ishlab chiqqan loyihalarimiz',
    lead: 'Yagona vizual tizim brendning bozor qiymatini va mijozlar ishonchini bir necha barobar oshiradi.',
    chips: ['Den Aroma', 'Perfona', 'Fidda', 'Barakah', 'Almaz Shoes', 'Zayyan', 'Savod', 'Arfadel'],
    quotes: [quoteFrom('Perfona'), quoteFrom('Barakah')].filter((q): q is NonNullable<typeof q> => q !== null),
  },

  process: {
    title: `Firma uslubi qanday yaratiladi — ${visualIdentity.duration}`,
    steps: [
      { title: 'Brif va tahlil', desc: 'Biznes maqsadlari, raqobatchilar va auditoriyani o‘rganamiz.' },
      { title: 'Vizual konsepsiya', desc: 'Ranglar palitrasi, shrift juftliklari va grafik elementlar taklif qilinadi.' },
      { title: 'Tashuvchilarga tatbiq', desc: 'Tanlangan uslub vizitka, forma, blank, banner va SMM maketlariga tushiriladi.' },
      { title: 'Sayqallash va tahrirlar', desc: 'Fikr-mulohazalaringiz asosida maketlar mukammal darajaga yetkaziladi.' },
      { title: 'Fayllarni topshirish', desc: 'AI, EPS, PDF va barcha chop etishga tayyor fayllar to‘liq paketda topshiriladi.' },
    ],
  },

  audience: {
    fit: [
      'Logotipi bor, lekin brend materiallari har joyda har xil ko‘rinayotgan bizneslar',
      'Yangi do‘kon, filial yoki ofis ochayotgan kompaniyalar',
      'Mijozlariga ishonchli va premium xizmat taassurotini bermoqchi bo‘lganlar',
      'Xodimlar va bosmaxona uchun aniq vizual qoidalarga muhtoj bo‘lgan rahbarlar',
    ],
    notFit: [
      'Hali logotipi yo‘q bizneslar — avval logotip yoki kompleks paketdan boshlash lozim',
      'Faqat bitta flayer yoki bir martalik reklama kerak bo‘lganlar',
    ],
  },

  guarantees: GUARANTEES,

  related: [
    { title: 'Brendbuk', desc: 'Firma uslubi qoidalarini 60+ sahifalik rasmiy korporativ kitobga aylantirish.', href: '/xizmatlar/brandbook', price: '24 000 000 so‘m' },
    { title: 'Qadoq dizayni', desc: 'Mahsulotingiz uchun do‘kon peshtaxtasida ajralib turadigan professional qadoq.', href: '/xizmatlar/qadoq-dizayni', price: '12 000 000 so‘m' },
    { title: 'Patent', desc: 'Brend nomingiz va logotipingizni tovar belgisi sifatida ro‘yxatdan o‘tkazamiz.', href: '/xizmatlar/patent', price: '880 000 so‘mdan' },
  ],

  faqs: [
    { q: 'Firma uslubi narxi qancha va nimalar kiradi?', a: `Firma uslubi xizmati ${visualIdentity.price} so‘m. Unga ranglar palitrasi, tipografika, korporativ naqshlar, 10 dan ortiq amaliy tashuvchi maketlari va barcha bosmaga tayyor vektor fayllar kiradi.` },
    { q: 'Qancha vaqtda tayyor bo‘ladi?', a: `Loyihani ishlab chiqish muddati — ${visualIdentity.duration}.` },
    { q: 'Qaysi tashuvchilarni tanlasak bo‘ladi?', a: 'Biznesingiz ehtiyojiga qarab maketlar ro‘yxatini kelishamiz: masalan, restoran uchun menyu va kiyim, korporativ xizmat uchun papka va blank, riteyl uchun paket va peshlavha.' },
    { q: 'Bosmaxonaga berishga tayyor bo‘ladimi?', a: 'Ha, har bir fayl bosmaxonaning qat’iy talablari bo‘yicha (kesish chiziqlari, CMYK, xavfsiz zonalar) professional formatda topshiriladi.' },
    { q: 'Firma uslubi bilan Brendbukning farqi nima?', a: 'Firma uslubi — bu maketlarning o‘zi va ularning vizual fayllari. Brendbuk esa ushbu uslubni qanday ishlatish va nimalar taqiqlanganini ko‘rsatuvchi 60+ sahifalik qoidalar kitobidir.' },
  ],

  finalCta: {
    title: 'Brendingiz har bir nuqtada bir xil professional ko‘rinsin.',
    lead: 'Mutaxassis bilan suhbatda biznesingizga qaysi korporativ maketlar kerakligini bepul aniqlab beramiz.',
  },
};

import { BRAND_STRATEGY_SERVICE } from '@/lib/sales-content';

export const SOURCE = 'brand_strategy_page';
export const PRICE = `${BRAND_STRATEGY_SERVICE.price} so‘m`;
export const PRICE_VALUE = Number(BRAND_STRATEGY_SERVICE.price.replace(/\D/g, ''));

export const h2Style = {
  fontSize: 'clamp(28px, 4vw, 44px)',
  letterSpacing: '-0.03em',
  lineHeight: 1.1,
} as const;

export const mono = {
  fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
  letterSpacing: '0.12em',
} as const;

export interface DeliverableItem {
  num: string;
  title: string;
  subtitle: string;
  details: string[];
  result?: string;
  formula?: string;
  contrast?: { left: string; right: string };
  layers?: { label: string; question: string }[];
}

export const DELIVERABLES: DeliverableItem[] = [
  {
    num: '01',
    title: 'Biznes diagnostikasi',
    subtitle: 'Kompaniya realiyatini ichidan o‘rganamiz',
    details: [
      'Biznes modeli va daromad mexanikasi',
      'Mahsulot va xizmatlar portfeli',
      'Asosiy daromad manbalari',
      'Kompaniyaning uzoq muddatli maqsadlari',
      'Hozirgi to‘siqlar va muammolar',
      'Kelajakdagi rivojlanish yo‘nalishi',
    ],
    result: 'Strategiya biznes realiyatidan ajralib qolmaydi.',
  },
  {
    num: '02',
    title: 'Bozor tahlili',
    subtitle: 'Kategoriya dinamikasi va imkoniyatlar',
    details: [
      'Biznes faoliyat yuritadigan kategoriya chegaralari',
      'Bozor qanday mantiqda ishlaydi',
      'Asosiy tendensiyalar va o‘zgarishlar',
      'Kategoriyaning yozilmagan qoidalari',
      'Raqobatchilar e’tibordan chetda qoldirgan bo‘sh imkoniyatlar',
    ],
    result: 'Bozorda qaysi yo‘nalish ochiqligi aniq ko‘rinadi.',
  },
  {
    num: '03',
    title: 'Raqobatchilar tahlili',
    subtitle: 'Raqobat maydonini xaritalash',
    details: [
      'Kimlar bilan to‘g‘ridan-to‘g‘ri va bilvosita raqobat qilasiz',
      'Ular bozorda nima va’da qiladi',
      'Qanday positioning va narx modelidan foydalanadi',
      'Kimga murojaat qiladi va qanday gapiradi',
      'Nimasi bilan farqlanadi yoki bir xil ko‘rinadi',
      'Bozorda qaysi pozitsiyalar band qilingan',
    ],
    result: '“Hamma kabi” positioningdan chiqish.',
  },
  {
    num: '04',
    title: 'Auditoriya segmentlari',
    subtitle: 'Demografiyadan chuqurroq: JTBD yondashuvi',
    details: [
      'Oddiy “25–45 yosh erkak va ayollar” bilan cheklanmaymiz',
      'Xarid vaziyati va iste’mol konteksti',
      'Mijoz hal qilmoqchi bo‘lgan asosiy muammo',
      'Ichki ehtiyoj va motivatsiya',
      'Xarid oldidagi qo‘rquv va to‘siqlar',
      'Mijoz tanlaydigan alternativalar',
      'Yakuniy qaror qabul qilish mezonlari (JTBD)',
    ],
    result: 'Mijoz qaysi vaziyatda aynan sizni tanlashi aniq bo‘ladi.',
  },
  {
    num: '05',
    title: 'Category',
    subtitle: 'Mijoz ongida qaysi javonga joylashasiz?',
    details: [
      'Mijoz bizni qaysi kategoriya vakili sifatida qabul qilishi kerak?',
      'Kategoriyani qayta belgilash yangi qiymat yaratadi',
      'Kategoriya mijoz kutuvini va narx mezonini shakllantiradi',
    ],
    contrast: {
      left: '“Dizayn studiyasi”',
      right: '“Biznes uchun branding agentligi”',
    },
    result: 'Bu ikki tushuncha butunlay boshqacha narx va ishonch talab qiladi.',
  },
  {
    num: '06',
    title: 'Positioning',
    subtitle: 'Eng muhim strategik blok',
    details: [
      'Formula: Kim uchun + qaysi muammoni + qanday farqli usulda hal qilamiz',
      'Bu reklama slogani emas — bu kompaniyaning ichki strategik yo‘nalishi',
    ],
    formula:
      '[Auditoriya] uchun [Brend] — [kategoriya], u [asosiy qiymat] beradi, chunki [ishonish uchun sabab].',
    result: 'Ichki strategik yo‘nalish kompaniyadagi har bir xodim uchun bitta bo‘ladi.',
  },
  {
    num: '07',
    title: 'Value Proposition',
    subtitle: 'Qiymatning uchta qatlami',
    details: ['Mijozga taklif qilinadigan foyda faqat bitta sathda bo‘lmasligi kerak.'],
    layers: [
      { label: 'Functional benefit', question: 'Mijoz amalda nima oladi?' },
      { label: 'Emotional benefit', question: 'Mijoz o‘zini qanday his qiladi?' },
      { label: 'Business benefit', question: 'Bu mijozning biznesiga yoki hayotiga nima beradi?' },
    ],
    result: 'Mijoz narxni emas, oladigan qiymatni ko‘radi.',
  },
  {
    num: '08',
    title: 'Differentiation',
    subtitle: '“Sifatli xizmat” farqlanish emas',
    details: [
      'Farqlanish quyidagilardan kelib chiqishi mumkin: metod, expertise, specialization, mahsulot modeli, jarayon, texnologiya, kategoriya yoki ishonchli proof.',
      'Quyidagilarni differentiation sifatida sotmaymiz: sifat, professional jamoa, individual yondashuv, hamyonbop narx — agar ularning isbotlangan real asosi bo‘lmasa.',
    ],
    result: 'Raqobatchi nusxa ko‘chira olmaydigan asos paydo bo‘ladi.',
  },
  {
    num: '09',
    title: 'Reason to Believe (RTB)',
    subtitle: 'Mijoz nima uchun bu va’daga ishonishi kerak?',
    details: [
      'Tadbirkorlik va sohadagi real tajriba',
      'Amalga oshirilgan case’lar va o‘lchanadigan natijalar',
      'Mualliflik yoki tasdiqlangan metodologiya',
      'Ishlab chiqarish quvvati yoki texnologik ustunlik',
      'Sertifikatlar, patentlar va yuridik kafolatlar',
      'Haqiqiy raqamlar va faktlar',
    ],
    result: 'Va’da havoda qolmaydi — uning orqasida mustahkam isbot turadi.',
  },
  {
    num: '10',
    title: 'Brand Essence',
    subtitle: 'Brendni bitta markaziy g‘oyaga keltirish',
    details: [
      'Katta savol: Brenddan barcha tashqi elementlarni olib tashlasak, markazda qanday g‘oya qoladi?',
      'Brand Essence slogan emas. Bu keyingi barcha qarorlar uchun filtr:',
      'Naming → Visual Identity → Messaging → Marketing',
    ],
    result: 'Yillar davomida eskirmaydigan mustahkam yadro.',
  },
  {
    num: '11',
    title: 'Brand Personality',
    subtitle: 'Brend xarakteri va nutq chegaralari',
    details: [
      'Brend xarakterini aniqlaymiz: dadil, ekspert, zamonaviy, samimiy yoki vazmin.',
      'Faqat sifatlar ro‘yxati bilan to‘xtamaymiz. Aniq chegaralarni belgilaymiz:',
    ],
    contrast: {
      left: 'Biz qanday gapiramiz: aniq, faktlarga asoslangan, xotirjam va professional',
      right: 'Biz qanday gapirmaymiz: balandparvoz, qo‘rqituvchi, bachkana yoki bo‘sh va’dalar bilan',
    },
    result: 'Kompaniyaning barcha kommunikatsiyasida yagona ovoz yangraydi.',
  },
  {
    num: '12',
    title: 'Messaging Pillars',
    subtitle: 'Brend doimiy gapiradigan asosiy g‘oyalar',
    details: [
      'Asosiy ustunlar: muammo, yechim, farqlanish, isbot va natija.',
      'Bu tizim keyinchalik quyidagilar uchun poydevor bo‘ladi:',
      'Marketing kampaniyalari · Kontent rejasi · Sayt matnlari · Taqdimotlar · Sotuv skriptlari',
    ],
    result: 'Marketing va sotuv har safar noldan velosiped ixtiro qilmaydi.',
  },
];

export const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Founder / rahbar intervyusi',
    desc: 'Biznesni rahbar nuqtai nazaridan tushunamiz: kelajak maqsadi, og‘riqli nuqtalar va ambitsiyalar.',
  },
  {
    num: '02',
    title: 'Biznes diagnostikasi',
    desc: 'Mahsulotlar, xizmatlar, daromad manbalari va operatsion realiyat chuqur o‘rganiladi.',
  },
  {
    num: '03',
    title: 'Bozor va raqobatchilar',
    desc: 'Kategoriya qoidalari, asosiy o‘yinchilar va ularning bo‘sh qolgan strategik pozitsiyalari tahlil qilinadi.',
  },
  {
    num: '04',
    title: 'Auditoriya',
    desc: 'Eng muhim mijoz segmentlari, ularning xarid konteksti va JTBD ehtiyojlari aniqlanadi.',
  },
  {
    num: '05',
    title: 'Strategik gipotezalar',
    desc: 'Positioning, value proposition va farqlanish bo‘yicha aniq strategik variantlar shakllantiriladi.',
  },
  {
    num: '06',
    title: 'Strategiya taqdimoti',
    desc: 'Asosiy strategik qarorlar rahbarga interaktiv muhokama va asoslar bilan taqdim etiladi.',
  },
  {
    num: '07',
    title: 'Final hujjatlar',
    desc: 'Yakuniy Brand Strategy Deck, Brand Strategy Map va Creative Brief to‘liq topshiriladi.',
  },
];

export const FAQS = [
  {
    q: 'Brand Strategy narxi qancha?',
    a: 'Brand Strategy xizmati narxi 48 000 000 so‘m. Bu yuqori darajadagi B2B strategik xizmat bo‘lib, biznes diagnostikasi, bozor va raqobatchilar tahlili, positioning, value proposition, auditoriya xaritasi, Brand Strategy Deck, Strategy Map va Creative Brief’ni to‘liq o‘z ichiga oladi.',
  },
  {
    q: 'Brand Strategy’dan keyin logo ham kiradimi?',
    a: 'Yo‘q. Brand Strategy alohida strategik xizmat. Naming, Logo, Visual Identity, Brandbook va Packaging alohida xizmatlar hisoblanadi. Strategiya esa aynan shu xizmatlar noldan adashmasdan, to‘g‘ri yo‘nalishda ishlanishi uchun kompas vazifasini bajaradi.',
  },
  {
    q: 'Brand Strategy bilan Brandbook farqi nima?',
    a: 'Brand Strategy — brend bozorda kim bo‘lishini, kim uchun ishlashini va nima deyishini aniqlaydi (Direction). Brandbook esa tayyor bo‘lgan vizual tizimni qanday ishlatish va qanday qoidalarga amal qilishni belgilaydi (Rules). Strategiyasiz Brandbook shunchaki chiroyli qoidalar to‘plami bo‘lib qoladi.',
  },
  {
    q: 'Brand Strategy marketing strategiyasimi?',
    a: 'Yo‘q. Marketing strategiyasi qayerda, qachon va qaysi kanal orqali sotishni (media, byudjet, kampaniyalar) rejalashtiradi. Brand Strategy esa brend bozorda kim bo‘lishi, nima va’da qilishi va qanday farqlanishini belgilaydi. Marketing Brand Strategy bergan yo‘nalish asosida ishlaydi.',
  },
  {
    q: 'Rahbar jarayonda qatnashishi kerakmi?',
    a: 'Ha, albatta. Brand Strategy kompaniya kelajagiga taalluqli bo‘lgani uchun loyihada founder, CEO yoki yakuniy qaror qabul qiluvchi rahbarning ishtiroki shart. Boshlang‘ich chuqur intervyu va oraliq strategik gipotezalar aynan rahbar bilan muhokama qilinadi.',
  },
  {
    q: 'Bizda allaqachon logo bor. Brand Strategy kerak bo‘ladimi?',
    a: 'Ha, ko‘p holatlarda kerak bo‘ladi. Logo bo‘lishi — bozorda aniq o‘ringa ega bo‘lishni anglatmaydi. Agar marketing, sotuv va rahbariyat biznesni har xil tushuntirayotgan bo‘lsa, mavjud logo bo‘lsa ham Brand Strategy biznesning positioning’ini tartibga solib beradi.',
  },
  {
    q: 'Qancha vaqt oladi?',
    a: 'Loyihaning aniq muddati biznes ko‘lami, faoliyat yo‘nalishlari soni va tahlil qilinadigan bozor hajmiga qarab individual belgilanadi va shartnomada qat’iy qayd etiladi.',
  },
];

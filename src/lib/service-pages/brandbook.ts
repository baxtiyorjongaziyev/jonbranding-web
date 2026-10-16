import type { ServicePageContent } from '@/components/service-landing/types';
import { ALL_SERVICES, GUARANTEES } from '@/lib/sales-content';
import { quoteFrom } from './quotes';

const brandbook = ALL_SERVICES.find((s) => s.id === 'brandbook')!;

export const BRANDBOOK_PAGE: ServicePageContent = {
  source: 'brandbook_page',
  serviceKey: 'brandbook',
  serviceName: 'Brendbuk',
  price: brandbook.price,
  priceValue: Number(brandbook.price.replace(/\D/g, '')),
  duration: brandbook.duration,

  hero: {
    eyebrow: 'Brendbuk · korporativ qo‘llanma',
    title: 'Brendingiz qoidalari bitta rasmiy kitobda',
    lead: 'Yangi dizayner kelsa ham, bosmaxona o‘zgarsa ham brendingiz buzilmaydi. Logotip, ranglar, shriftlar, maketlar va muloqot ohangi (Tone of Voice) yagona 60+ sahifalik hujjatda.',
    format: 'Standartlar tahlili → qoidalar tizimi → taqiqlangan holatlar → 60+ sahifali PDF Brandbook',
    note: 'Brendbuk — kompaniya mulki. U brendingizni xodimlarning subyektiv didiga emas, rasmiy qoidalarga bog‘lab qo‘yadi.',
    primaryCta: 'Brendbuk bo‘yicha konsultatsiya',
  },

  problem: {
    title: 'Brendbuk bo‘lmasa nima yuz beradi?',
    intro: 'Ko‘p kompaniyalar brendbukni faqat katta korporatsiyalarga kerak deb o‘ylaydi. Natijada:',
    pains: [
      'Dizayner ishdan ketsa, butun vizual uslub yo‘qoladi — yangi dizayner hammasini boshqatdan boshlaydi.',
      'Logotipni cho‘zib, noo‘rin fonlarga qo‘yib yoki ranglarini o‘zgartirib xunuk holatga keltirishadi.',
      'Har xil bosmaxonalar materiallarni har xil rangda chop etadi — javobgarlikni hech kim bo‘yniga olmaydi.',
      'Franshiza yoki filiallar o‘zboshimchalik bilan brend qiyofasini buzib yuboradi.',
      'Kompaniyaning rasmiy taqdimotlari, hujjatlari va reklamalari bir-biriga mutlaqo o‘xshamaydigan ko‘rinish oladi.',
    ],
    statement: 'Brendbuk — brendingizning yozilgan qonunidir.',
    statementLead: 'U yangi xodim, marketolog, dizayner yoki tashqi pudratchiga bir daqiqada beriladigan va savollarga o‘rin qoldirmaydigan asosiy kompas hisoblanadi.',
  },

  whatIs: {
    title: 'Brendbuk nima va unga nimalar kiradi?',
    paragraphs: [
      'Brendbuk (Brandbook / Guideline) — bu brendingizning vizual va falsafiy qoidalari jamlangan professional qo‘llanma. Unda logotipni to‘g‘ri va noto‘g‘ri ishlatish holatlari, minimal o‘lchamlar, xavfsizlik zonalari va bosma parametrlari aniq ko‘rsatiladi.',
      'Shuningdek, brendning muloqot tili (Tone of Voice), matn ohangi va barcha korporativ tashuvchilarning standart o‘lchamlari kiritiladi.',
    ],
    isNot: [
      'Shunchaki logotipning rasm fayllari',
      'Faqat ranglar ko‘rsatilgan bir varaq qog‘oz',
      'Bir marta o‘qib tashlab qo‘yiladigan nazariya — bu har kungi ishchi qo‘llanma',
    ],
  },

  deliverables: {
    title: 'Brendbuk tarkibi — 60+ sahifali to‘liq tizim',
    lead: 'Kompaniyangiz yillar davomida o‘z qiyofasini mukammal saqlab qolishi uchun zarur bo‘lgan barcha qoidalar.',
    items: [
      {
        title: 'Brend falsafasi va muloqot ohangi',
        subtitle: 'Tone of Voice va qadriyatlar',
        details: [brandbook.deliverables[4], 'Mijoz bilan qanday ohangda gaplashish va qanday so‘zlardan qochish qoidalari'],
        result: 'SMM, reklama va sotuvchilar yagona tilda gapiradi.',
      },
      {
        title: 'Logotip standartlari va cheklovlar',
        subtitle: 'Konstruksiya, xavfsiz zona va taqiqlar',
        details: [brandbook.deliverables[1], 'Logotipni ishlatishda eng ko‘p yo‘l qo‘yiladigan 10+ xatolar misoli'],
        result: 'Hech kim logotipni noto‘g‘ri cho‘zib yoki buzib ishlata olmaydi.',
      },
      {
        title: 'Rang va tipografika spetsifikatsiyasi',
        subtitle: 'Pantone, CMYK, RGB, HEX va shrift tizimi',
        details: [brandbook.deliverables[2], 'Sarlavhalar, asosiy matn, qator oraliqlari va bosma qoidalari'],
        result: 'Istalgan bosmaxonada ranglar aynan bir xil chiqadi.',
      },
      {
        title: 'Barcha tashuvchilar reglamenti',
        subtitle: 'Vizitkadan tortib tashqi bilbordgacha',
        details: [brandbook.deliverables[3], 'Hujjatlar, kiyimlar, transport va internetdagi qoidalar'],
        result: 'Yangi maket kerak bo‘lganda dizayner velosiped ixtiro qilmaydi.',
      },
    ],
  },

  proof: {
    title: 'Biz tayyorlagan brendbuklar asosida ishlayotgan kompaniyalar',
    lead: 'Tartibli brend tizimi tufayli ushbu brendlar ko‘plab filiallar va jamoalar bilan xatosiz kengaymoqda.',
    chips: ['Perfona', 'Den Aroma', 'Fidda by Sevara', 'Almaz Shoes', 'Barakah', 'Zayyan', 'Savod'],
    quotes: [quoteFrom('Perfona'), quoteFrom('Incontrol')].filter((q): q is NonNullable<typeof q> => q !== null),
  },

  process: {
    title: `Brendbuk qanday ishlab chiqiladi — ${brandbook.duration}`,
    steps: [
      { title: 'Tizimlashtirish', desc: 'Mavjud logotip, firma uslubi va brend materiallarini bir joyga to‘playmiz.' },
      { title: 'Standartlarni belgilash', desc: 'Xavfsiz zonalar, minimal o‘lchamlar va rang spetsifikatsiyalari ishlab chiqiladi.' },
      { title: 'Taqiqlarni shakllantirish', desc: 'Logotip va uslubni buzishi mumkin bo‘lgan xato qo‘llanishlar qoidalari yoziladi.' },
      { title: 'Maketlar spetsifikatsiyasi', desc: 'Tashuvchilar uchun aniq chizmalar va proporsiyalar joylashtiriladi.' },
      { title: 'Tayyor Brandbook PDF', desc: 'Barcha xodimlar va hamkorlarga berishga tayyor interaktiv PDF kitob topshiriladi.' },
    ],
  },

  audience: {
    fit: [
      'Bir nechta filial yoki do‘kon ochayotgan kompaniyalar',
      'Bir nechta dizayner, agentlik va bosmaxona bilan ishlaydigan bizneslar',
      'Franshiza bermoqchi yoki xalqaro bozorga chiqayotgan tadbirkorlar',
      'Brendini xodimlar o‘zboshimchaligidan himoya qilmoqchi bo‘lgan rahbarlar',
    ],
    notFit: [
      'Hali logotipi va firma uslubi bo‘lmagan yangi loyihalar — avval aydentika ishlab chiqilishi shart',
    ],
  },

  guarantees: GUARANTEES,

  related: [
    { title: 'Firma uslubi', desc: 'Barcha korporativ maketlar va vizual elementlar to‘plami.', href: '/xizmatlar/firmenniy-stil', price: '18 000 000 so‘m' },
    { title: 'Qadoq dizayni', desc: 'Mahsulotlar liniyasi uchun professional qadoqlar.', href: '/xizmatlar/qadoq-dizayni', price: '12 000 000 so‘m' },
    { title: 'Patent', desc: 'Brendingizni tovar belgisi sifatida ro‘yxatdan o‘tkazamiz.', href: '/xizmatlar/patent', price: '880 000 so‘mdan' },
  ],

  faqs: [
    { q: 'Brendbuk narxi qancha va unga nimalar kiradi?', a: `Brendbuk ishlab chiqish narxi ${brandbook.price} so‘m. Unga 60 dan ortiq sahifali to‘liq PDF qo‘llanma, barcha qoidalar, xato misollari, rang va shrift spetsifikatsiyalari kiradi.` },
    { q: 'Qancha vaqtda tayyor bo‘ladi?', a: `Firma uslubi tayyor bo‘lsa, brendbuk ${brandbook.duration} ichida to‘liq tayyorlab topshiriladi.` },
    { q: 'Yangi dizayner kelsa bu kitob unga yetarlimi?', a: 'Ha, brendbuk aynan shu maqsad uchun qilinadi: yangi dizayner yoki bosmaxonaga ushbu faylni yuborasiz va ular hech qanday ortiqcha savolsiz brendingizni to‘g‘ri ishlatishadi.' },
    { q: 'Brendbuk bosma shaklda ham beriladimi?', a: 'Asosiy fayl — yuqori sifatli interaktiv PDF (linklar va qidiruv bilan). Shuningdek, bosmaxonada qattiq muqovali kitob qilib chop etish uchun tayyor fayl ham beriladi.' },
  ],

  finalCta: {
    title: 'Brendingiz qoidaga bo‘ysunsin, inson kayfiyatiga emas.',
    lead: 'Mutaxassis bilan suhbatda brendbukingizga qanday bo‘limlar kiritilishi kerakligini bepul muhokama qiling.',
  },
};

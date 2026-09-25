/**
 * Sotuv kontenti — O'ZBEK (asosiy til).
 *
 * `/narxlar` va `/credentials` shu yerdan o'qiydi.
 * Uzbek-first: har qanday o'zgarish avval shu faylda, keyin ru/en/zh ga.
 */

import type { Package, SalesContent, Service, ServiceGroup } from './types';

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    title: 'Brend qurish',
    intro: 'Nomdan to‘liq vizual tizimgacha. Har birini alohida ham olsangiz bo‘ladi.',
    items: [
      {
        id: 'brand-strategy',
        name: 'Brand Strategy',
        price: '48 000 000',
        lead: 'Brendingiz bozorda qaysi joyni egallashi kerakligini aniqlaymiz. Kim uchun ishlaysiz, nimasi bilan farqlanasiz va nima deysiz — bitta strategik tizimga keltiramiz.',
        deliverables: [
          'Brand Strategy Deck — 30–40+ sahifali strategik hujjat (biznes, bozor, auditoriya, positioning, messaging)',
          'Brand Strategy Map — butun strategik tizim bir sahifada',
          'Creative Brief — keyingi dizayn, marketing va kommunikatsiya qarorlari uchun kompas',
          'Biznes diagnostikasi va bozor tendensiyalari tahlili',
          'Raqobatchilar tahlili va bo‘sh strategik pozitsiyalarni aniqlash',
          'Auditoriya segmentlari va JTBD ehtiyojlar tahlili',
          'Positioning formulasi, Value Proposition va asoslangan farqlanish',
          'Brand Essence, Brand Personality va asosiy Messaging ustunlari',
        ],
        benefit: 'Marketing, sotuv va dizayn bitta yo‘nalishda ishlaydi. 48 million so‘m taqdimot uchun emas — kompaniyaning keyingi brend qarorlariga asos bo‘ladigan strategik tizim uchun.',
        audience: 'Kompaniya asoschilari, CEO, marketing rahbarlari, yangi brend yoki rebranding qilayotgan bizneslar',
      },
      {
        id: 'naming',
        name: 'Naming',
        price: '10 000 000',
        duration: '10 kun',
        lead: 'Yaxshi nom — biznesingizning birinchi taassuroti. Bir marta ishlab chiqiladi, butun umr foyda keltiradi.',
        deliverables: [
          'Biznesingizga mos professional nom',
          'Nomning strategik izohi — nega aynan shu nom',
          'Raqobatchilar tahlili va ular nomlari bilan o‘xshashlik tekshiruvi',
          '.uz va .com domen, Telegram va Instagram username tekshiruvi',
          'O‘zbekiston bo‘yicha patent/trademark tekshiruvi',
          '3 ta bepul tahrir',
        ],
        benefit: 'Nomingizni tanitishga sarflagan har bir so‘m o‘zingizda qoladi — besh yildan keyin “bu nom bizniki” degan xat kelmaydi.',
        audience: 'Yangi biznes ochayotgan yoki hozirgi nomi ishlamayotganlar uchun',
        note: 'Nom noto‘g‘ri tanlansa, keyin patent, domen va reklama uch barobar qimmatga tushadi.',
        proof: {
          label: 'Biz ishlab chiqqan nomlar',
          items: [
            'Savod', 'Fidda', 'Shirona', 'Belif', 'Unvan', 'Parfino', 'Naf', 'Revo', 'Petron', 'Estem',
            'Zayyan', 'Mercato', 'Geonest', 'Rutera', 'Sofmir', 'Arfadel', 'Melamus', 'Polentra', 'Viton',
          ],
        },
      },
      {
        id: 'logo',
        name: 'Logo',
        price: '8 000 000',
        duration: '7 kun',
        lead: 'Kichkina ekranda ham, katta bannerda ham bir xil ishlaydigan belgi.',
        deliverables: [
          '3 ta konsepsiya, tanlanganini oxirigacha sayqallaymiz',
          'Barcha formatlar: AI, EPS, SVG, PDF, PNG',
          'Rangli, oq-qora va bitta rangdagi versiyalar',
          'Gorizontal, vertikal va ixcham (ikonka) variantlari',
          'Minimal o‘lcham va bo‘sh joy qoidalari',
        ],
        benefit: 'Vizitkadan bannergacha, avatardan qadoqqacha — har safar dizaynerga “moslashtirib bering” deb pul to‘lamaysiz.',
        audience: 'Logosi yo‘q yoki eskirgan, zamonaviy ko‘rinmayotgan biznes uchun',
      },
      {
        id: 'visual-identity',
        name: 'Visual identity',
        price: '18 000 000',
        duration: '10 kun',
        lead: 'Logo — bu bitta belgi. Visual identity — brendingiz hamma joyda tanilishi.',
        deliverables: [
          'Rang palitrasi (Pantone, CMYK, RGB, HEX)',
          'Shrift tizimi: sarlavha, matn, urg‘u',
          'Grafik elementlar va patternlar',
          'Foto va rasm uslubi',
          '10 dan ortiq tashuvchi maketi: vizitka, blank, konvert, forma, banner, ijtimoiy tarmoq shablonlari',
        ],
        benefit: 'Reklamangiz har oy noldan tanishtirmaydi — har bir ko‘rish oldingisining ustiga qo‘shiladi. Byudjet yig‘iladi, teshik chelakka quyilmaydi.',
        audience: 'Logosi bor, lekin har joyda har xil ko‘rinayotgan biznes uchun',
      },
      {
        id: 'brandbook',
        name: 'Brandbook',
        price: '24 000 000',
        duration: '7 kun',
        lead: 'Brendingiz qoidalari bitta hujjatda. Yangi dizayner kelsa ham tizim buzilmaydi.',
        deliverables: [
          '60 dan ortiq sahifali PDF qo‘llanma',
          'Logoni ishlatish va ishlatmaslik qoidalari (xato misollari bilan)',
          'Ranglar va tipografika to‘liq spetsifikatsiyasi',
          'Barcha tashuvchilar bo‘yicha tayyor maketlar',
          'Brend tili va murojaat uslubi (tone of voice)',
        ],
        benefit: 'Brendingiz odamga emas, qoidaga bog‘lanadi. Dizayner ketsa ham, yangi xodim kelsa ham brend o‘sha-o‘sha qoladi.',
        audience: 'Jamoasi o‘sayotgan, bir nechta dizayner va tipografiya bilan ishlaydiganlar uchun',
        note: 'Visual identity bilan birga olinsa, ikkalasi bitta tizim sifatida ishlanadi.',
      },
    ],
  },
  {
    title: 'Qadoq',
    intro: 'Do‘kon javonida mahsulotingizni qo‘lga oldiradigan qadoq.',
    items: [
      {
        id: 'packaging',
        name: 'Packaging (1 SKU)',
        price: '12 000 000',
        duration: '7 kun',
        lead: 'Bitta mahsulot uchun to‘liq qadoq dizayni — tipografiyaga tayyor holda.',
        deliverables: [
          'Qadoq dizayni va javondagi ko‘rinishi hisobga olinadi',
          'Dieline — texnik chizma bilan birga',
          '3D vizualizatsiya (taqdimot va marketplace uchun)',
          'Shtrix-kod, tarkib, muddat va belgilarning to‘g‘ri joylashuvi',
          'Tipografiyaga topshirishga tayyor fayllar',
        ],
        benefit: 'Mahsulot javonda o‘zini o‘zi sotadi — sotuvchi tushuntirib o‘tirmaydi. Va narxni ko‘tarishga asos paydo bo‘ladi.',
        audience: 'Do‘kon, marketplace yoki tarmoqqa chiqayotgan ishlab chiqaruvchilar uchun',
      },
      {
        id: 'packaging-extra',
        name: 'Har qo‘shimcha SKU',
        price: '4 000 000 dan',
        duration: '+3 kun',
        lead: 'Birinchi qadoq tayyor bo‘lgach, qolgan mahsulotlar arzonroq.',
        deliverables: [
          'Bir xil tizimda, lekin har mahsulotga moslashtirilgan',
          'Ta’m, hajm va turlarni ajratib turadigan yechim',
          'Tayyor dieline va tipografiya fayllari',
        ],
        benefit: 'Butun liniyangiz javonda bitta oila bo‘lib turadi — bittasini olgan xaridor qolganini ham taniydi.',
        audience: 'Bir nechta mahsulot turi bor ishlab chiqaruvchilar uchun',
        note: 'Aniq narx qadoq turining murakkabligiga qarab belgilanadi.',
      },
    ],
  },
  {
    title: 'Huquqiy himoya',
    intro: 'Nom sizniki bo‘lishi uchun uni ro‘yxatdan o‘tkazish kerak. Shu ishni ham biz qilamiz.',
    items: [
      {
        id: 'trademark-search',
        name: 'Patent tekshiruvi',
        price: '880 000',
        duration: '1 ish kuni',
        lead: 'Nomingiz band emasligini oldindan bilib oling — bu eng arzon xavfsizlik choralari.',
        deliverables: [
          'Rasmiy bazadan to‘liq tekshiruv',
          'O‘xshash belgilar ro‘yxati va xavf darajasi',
          'Ro‘yxatdan o‘tish ehtimoli bo‘yicha xulosa',
          'Sizga qaysi sinflar kerakligini o‘zimiz aniqlab beramiz',
        ],
        benefit: 'Bir kunlik tekshiruv sizni yillab tanitgan nomdan ayrilishdan saqlaydi. Eng arzon sug‘urta.',
        audience: 'Nomni tanlagan, lekin hali ro‘yxatdan o‘tkazmaganlar uchun',
        note: 'Narx bitta sinf uchun. Naming xizmatiga bu tekshiruv allaqachon kiritilgan.',
        addon: { label: 'Har qo‘shimcha sinf', price: '+440 000 so‘m' },
      },
      {
        id: 'trademark-standard',
        name: 'Patent (oddiy)',
        price: '5 000 000',
        duration: '7 oy',
        lead: 'Tovar belgisini ro‘yxatdan o‘tkazish — odatdagi tartibda.',
        deliverables: [
          'Hujjatlar to‘liq tayyorlanadi va topshiriladi',
          'Sinflar to‘g‘ri tanlanadi',
          'Jarayon oxirigacha kuzatib boriladi',
          'Guvohnoma qo‘lingizga topshiriladi',
        ],
        benefit: 'Nom qonuniy sizniki bo‘ladi — franshiza sotish, eksportga chiqish va tenderga kirish yo‘li ochiladi. Brend aktivga aylanadi.',
        audience: 'Shoshilmayotgan, lekin nomini himoyalamoqchi bo‘lganlar uchun',
      },
      {
        id: 'trademark-express',
        name: 'Patent (tezkor)',
        price: '7 000 000',
        duration: '20–40 kun',
        lead: 'Xuddi shu ish, lekin tezlashtirilgan tartibda.',
        deliverables: [
          'Oddiy patentdagi barcha ishlar',
          'Tezlashtirilgan ekspertiza',
          'Muddat 7 oydan 20–40 kunga qisqaradi',
        ],
        benefit: 'Muddat sizni kutib turmaydigan joyda — yetti oy o‘rniga bir oycha. Shartnomani boy bermaysiz.',
        audience: 'Tender, marketplace yoki eksport muddati siqib turganlar uchun',
      },
    ],
  },
];

/** Ekspert tekshiruv (`/expert-tekshiruv`) — narx va muddat shu yozuvdan olinadi. */
export const EXPERT_CHECK_SERVICE: Service = SERVICE_GROUPS
  .flatMap((group) => group.items)
  .find((item) => item.name === 'Patent tekshiruvi')!;

/** Brand Strategy (`/brand-strategy`) — narx shu yozuvdan olinadi. */
export const BRAND_STRATEGY_SERVICE: Service = SERVICE_GROUPS
  .flatMap((group) => group.items)
  .find((item) => item.name === 'Brand Strategy')!;

export const PACKAGES: Package[] = [
  {
    name: 'VIP',
    price: '70 000 000',
    separate: '85 000 000',
    saving: '15 000 000',
    audience: 'Eksportga chiqayotgan, marketplace yoki tarmoq do‘konga kirayotgan ishlab chiqaruvchilar uchun',
    features: ['Naming', 'Logo', 'Visual identity', 'Brandbook', 'Patent', 'Packaging (3 SKU)'],
    duration: '35–45 kun',
  },
  {
    name: 'PREMIUM',
    price: '55 000 000',
    separate: '65 000 000',
    saving: '10 000 000',
    audience: 'Brendini to‘liq tartibga solmoqchi bo‘lgan, o‘sayotgan biznes uchun',
    features: ['Naming', 'Logo', 'Visual identity', 'Brandbook', 'Patent'],
    duration: '30–35 kun',
    featured: true,
    badge: 'Ko‘p tanlanadi',
  },
  {
    name: 'STANDART',
    price: '20 000 000',
    separate: '23 000 000',
    saving: '3 000 000',
    audience: 'Endi boshlayotgan yoki brendi hali yo‘q biznes uchun',
    features: ['Naming', 'Logo', 'Patent'],
    duration: '20–25 kun',
  },
];

export const FAQS = [
  {
    q: 'Nega 8 mln, Instagramda 500 mingga logo qilishadi-ku?',
    a: '500 minglik logo — bu bitta rasm. Siz undan keyin har bir banner, qadoq va vizitka uchun yana to‘laysiz, chunki fayllar to‘liq emas, qoida yo‘q, har safar yangidan chiziladi. Bizda logo barcha formatlarda, barcha versiyalarda va ishlatish qoidalari bilan keladi. Ustiga patent tekshiruvi — nomingiz birovniki chiqib qolmasligi uchun. Farq narxda emas, keyin qancha to‘lashingizda.',
  },
  {
    q: 'Yoqmasa nima bo‘ladi?',
    a: 'Birdan tayyor ishni ko‘rmaysiz. Avval 3 ta yo‘nalish ko‘rsatamiz, bittasini siz tanlaysiz — shundan keyingina sayqallashga o‘tamiz. Siz tasdiqlamaguningizcha keyingi bosqich boshlanmaydi. Tanlangan yo‘nalish bo‘yicha tahrirlar ham kiritiladi.',
  },
  {
    q: 'Mendan nima talab qilinadi, qancha vaqtimni oladi?',
    a: 'Boshida bir marta brif — 40–60 daqiqa suhbat yoki savollarga javob. Keyin har bosqichda taqdimotni ko‘rib, fikr bildirasiz: odatda 2–3 marta, har biri yarim soatdan oshmaydi. Qolgan ishni biz qilamiz.',
  },
  {
    q: 'To‘lovni bo‘lib to‘lasam bo‘ladimi?',
    a: 'Ha, to‘lov ikki bosqichda: 50% shartnoma imzolanganda, 50% loyiha topshirilganda. Ya‘ni yarmini oldindan, yarmini natijani ko‘rgach to‘laysiz.',
  },
  {
    q: 'Patent chiqmay qolsa-chi?',
    a: 'Shuning uchun ariza topshirishdan oldin rasmiy bazadan tekshiruv o‘tkazamiz va xavf darajasini aytamiz. Xavf yuqori bo‘lsa, ochig‘ini aytamiz va nomni o‘zgartirishni taklif qilamiz — pulingizni bilib turib xavfga tikmaymiz.',
  },
];

export const WHY_US = [
  {
    title: 'Shartnoma va rasmiy to‘lov',
    desc: 'Ish shartnoma asosida boshlanadi: muddat, hajm va topshiriladigan fayllar yozib qo‘yiladi. Yo‘qolib qoladigan odam emassiz — yuridik shaxs bilan ishlaysiz.',
  },
  {
    title: 'Patent ham biz tomondan',
    desc: 'Dizayner logo chizadi va ketadi. Biz nomni tekshiramiz, ro‘yxatdan o‘tkazamiz va guvohnomani qo‘lingizga beramiz — brend huquqan sizniki bo‘ladi.',
  },
  {
    title: '9 yil va 1000 dan ortiq loyiha',
    desc: 'Bu ish bizda tajriba bo‘yicha qilinadi, urinib ko‘rish bo‘yicha emas. Qaysi yechim bozorda ishlashini oldindan bilamiz.',
  },
  {
    title: 'Fayllar sizda qoladi',
    desc: 'Barcha manba fayllar va qoidalar sizga topshiriladi. Bizdan ketsangiz ham brendingiz ishlayveradi — hech kimga bog‘lanib qolmaysiz.',
  },
];

export const GUARANTEES = [
  'Shartnoma: muddat, hajm va topshiriladigan fayllar oldindan yoziladi',
  'Siz tasdiqlamaguningizcha keyingi bosqichga o‘tmaymiz',
  'Konsepsiya bittada emas — 3 ta yo‘nalishdan tanlaysiz',
  'Naming bo‘yicha 3 ta bepul tahrir kiritiladi',
  'To‘lov bosqichma-bosqich: natijani ko‘rib borib to‘laysiz',
];

export const JOBS = [
  {
    pain: 'Mahsulotingiz raqobatchinikidan yaxshi, lekin xaridor javondan chiroyliroq qadoqni oladi.',
    gain: 'Mahsulot o‘zini o‘zi sotadi — sotuvchi tushuntirib o‘tirmaydi.',
  },
  {
    pain: '“Sifatimiz yuqori” deysiz, lekin ko‘rinishi arzon. Shuning uchun arzon narxga rozi bo‘lasiz.',
    gain: 'Ko‘rinish narxni oqlaydi — narxni ko‘tarasiz va mijoz savol bermaydi.',
  },
  {
    pain: 'Har safar boshqa dizayner, har safar boshqa rang. Odam o‘n marta ko‘rsa ham esda qolmaydi.',
    gain: 'Har bir ko‘rish oldingisining ustiga qo‘shiladi — reklama byudjeti yig‘iladi.',
  },
  {
    pain: 'Nomingiz ro‘yxatdan o‘tmagan. Bir kun kelib “bu nom bizniki” degan xat kelishi mumkin.',
    gain: 'Nom qonuniy sizniki — franshiza, eksport va tender yo‘li ochiladi.',
  },
];

export const PROCESS_STEPS = [
  { title: 'Brif va tahlil', desc: 'Biznesingizni, raqobatchilaringizni, auditoriyangizni o‘rganamiz' },
  { title: 'Konsepsiya', desc: '3 ta yo‘nalish taqdim etamiz, bittasini tanlaysiz' },
  { title: 'Ishlab chiqish', desc: 'Tanlangan yo‘nalish sayqallanadi' },
  { title: 'Topshirish', desc: 'Barcha fayllar va hujjatlar qo‘lingizda' },
];

export const PRICE_FACTORS = [
  'Mahsulot turlari soni (SKU)',
  'Patent klasslari soni',
  'Tashuvchilar soni (vizitka, banner, forma va boshqalar)',
  'Muddat — tezkor bajarish +50%',
];

export const uz: SalesContent = {
  serviceGroups: SERVICE_GROUPS,
  packages: PACKAGES,
  faqs: FAQS,
  whyUs: WHY_US,
  guarantees: GUARANTEES,
  jobs: JOBS,
  processSteps: PROCESS_STEPS,
  priceFactors: PRICE_FACTORS,
  ui: {
    currency: 'so‘m',
    stats: { experience: 'yil tajriba', clients: 'mijoz', projects: 'loyiha' },
    payment: {
      contract: 'Shartnoma imzolanganda',
      delivery: 'Loyiha topshirilganda',
    },
    notSure: 'Aniq emas — maslahat kerak',
    eyebrows: {
      prices: 'Narxlar', task: 'Vazifa', services: 'Xizmatlar', process: 'Jarayon',
      factors: 'Omillar', packages: 'Paketlar', trust: 'Ishonch', difference: 'Farq',
      faq: 'Savollar', talk: 'Suhbat',
    },
    hero: {
      pre: 'Narxlarimiz', hi: 'ochiq',
      sub: 'Hamma uchun birdek, shaffof ishlaymiz. Narxni ham yashirmaymiz, ishni ham.',
    },
    jobs: {
      pre: 'Biz aslida nimani', hi: 'hal qilamiz',
      sub: 'Mijoz bizga logo uchun kelmaydi. Mijoz bozorda jiddiy qabul qilinishi va narxini oqlay olishi uchun keladi.',
      now: 'Hozir', withUs: 'Biz bilan',
    },
    services: {
      pre: 'Bittalab', hi: 'olish',
      sub: 'Hammasi birdan kerak emas. Hozir nima kerak bo‘lsa, shuni olasiz — har bir xizmat o‘zicha to‘liq ish va oxirida sizga tayyor fayllar topshiriladi.',
      note: 'Narxlar xizmat uchun. Davlat bojlari alohida to‘lanadi.',
      showcase: 'Brendbuklarimizdan lavhalar', cases: 'Shu xizmat bo‘yicha ishlarimiz',
      price: 'Narx', duration: 'Muddat', cta: 'Ariza qoldirish',
      deliverables: 'Nima olasiz', benefit: 'Bu sizga nima beradi',
    },
    process: { pre: 'Qanday', hi: 'ishlaymiz', paymentTitle: 'To‘lov bosqichlari' },
    factors: { pre: 'Narxga nima', hi: 'ta’sir qiladi' },
    packages: {
      pre: 'Bir nechtasi kerakmi? Paket', hi: 'arzonroq',
      sub: 'Xizmatlarni alohida-alohida olgandan ko‘ra paket bilan olsangiz, ham arzonroq chiqadi, ham hammasi bitta tizim bo‘lib ishlanadi.',
      separate: { pre: 'Alohida olinsa', mid: '—', suf: 'tejaysiz' },
      cta: 'Ariza qoldirish',
      note: 'Muddat dizayn ishlari uchun. Patent guvohnomasi rasmiy tartibda alohida muddatda chiqadi.',
    },
    trust: { pre: 'Biz bilan', hi: 'ishlaganlar' },
    difference: { pre: 'Nega arzon dizayner', hi: 'emas', guaranteesTitle: 'Xavfingizni kamaytirish uchun' },
    faq: { pre: 'Ko‘p so‘raladigan', hi: 'savollar' },
    cta: {
      pre: 'Qaysi paket sizga to‘g‘ri kelishini', hi: 'bilmayapsizmi?',
      sub: '20 daqiqalik bepul suhbatda aytamiz. Sotmaymiz — maslahat beramiz.',
      button: 'Suhbatga yozilish',
    },
    footnote: 'Narxlar 2026 yil sentyabr holatiga. Yakuniy narx loyiha hajmiga qarab aniqlanadi.',
    modal: {
      title: 'Ariza qoldirish',
      titleDone: 'Rahmat!',
      desc: 'Ism va telefon raqamingizni qoldiring, o‘zimiz aloqaga chiqamiz.',
      descDone: 'Tez orada siz bilan bog‘lanamiz.',
      close: 'Yopish',
      name: 'Ism',
      namePlaceholder: 'Ismingiz',
      phone: 'Telefon *',
      phonePlaceholder: '+998 90 123 45 67',
      service: 'Xizmat',
      submit: 'Yuborish',
      sending: 'Yuborilmoqda…',
      phoneError: 'Telefon raqamini to‘g‘ri kiriting',
      submitError: 'Xatolik yuz berdi. Qayta urinib ko‘ring.',
      packageSuffix: 'paket',
    },
  },
};

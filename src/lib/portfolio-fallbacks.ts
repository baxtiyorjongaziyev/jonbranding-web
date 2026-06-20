export interface PortfolioProject {
  _id: string;
  slug: string;
  title: string;
  client: string;
  category: 'brand-strategy' | 'logo-design' | 'brandbook' | 'corporate-style' | 'packaging' | 'naming';
  categoryLabel: string;
  tags: string[];
  coverImage: string;
  beforeImage?: string;
  afterImage?: string;
  oldHint?: string;
  newHint?: string;
  description: string;
  results?: { metric: string; value: string }[];
  body: { heading: string; paragraph: string }[];
  galleryImages?: string[];
  order: number;
}

export const FALLBACK_PORTFOLIO: Record<string, PortfolioProject[]> = {
  uz: [
    {
      _id: 'fallback-den-aroma',
      slug: 'den-aroma',
      title: 'Den Aroma Premium Parfyumeriya',
      client: 'Den Aroma MChJ',
      category: 'brand-strategy',
      categoryLabel: 'Brend-strategiya',
      tags: ['Brend-strategiya', 'Aydentika', 'Brendbuk'],
      coverImage: '/images/cms/denaroma-hozir.png',
      beforeImage: '/images/cms/denaroma-avval.png',
      afterImage: '/images/cms/denaroma-hozir.png',
      oldHint: '3 Atirchi (Eski brending)',
      newHint: 'Den Aroma (Yangi premium brending)',
      description: 'Selective parfyumeriya tarmog\'i uchun yaratilgan global brend strategiyasi, nafis vizual aydentika va mukammal brendbuk loyihasi.',
      results: [
        { metric: 'Savdo hajmi o\'sishi', value: '+178%' },
        { metric: 'Brend qiymati', value: '3.2 barobar' },
        { metric: 'Bozor ulushi (Selective)', value: 'Top-3' }
      ],
      body: [
        {
          heading: "Vazifa va Muammo",
          paragraph: "Avvalgi '3 Atirchi' nomi ostidagi brend bozorda arzon va cheklangan doiradagi brend bo'lib qolayotgandi. Premium selective atirlar segmentiga chiqish, xalqaro miqyosdagi brendlar bilan raqobatlasha olish va auditoriyada yuksak ishonch hosil qilish uchun brendni tubdan yangilash talab etildi."
        },
        {
          heading: "Strategik Yechim",
          paragraph: "Jon Branding jamoasi tomonidan bozorni chuqur tahlil qilgan holda, yangi premium 'Den Aroma' nomi, minimalist va oliyjanob vizual konsepsiya, hamda brendning barcha nuqtalarini tartibga soluvchi 120 varaqdan iborat Premium Brendbuk ishlab chiqildi."
        },
        {
          heading: "Yakuniy Natija",
          paragraph: "Brend yangilanganidan so'ng, o'rtacha chek miqdori 2.5 barobar oshdi va kompaniya selective parfyumeriya bozorida o'zining mustahkam Top-3 o'rnini egalladi. Vizual aydentika brendning premium tabiatini 100% aks ettira oldi."
        }
      ],
      galleryImages: [
        '/images/cms/denaroma-hozir.png',
        '/images/cms/denaroma-avval.png'
      ],
      order: 1
    },
    {
      _id: 'fallback-savod',
      slug: 'savod',
      title: 'Savod Milliy Nashriyoti',
      client: 'Savod Nashriyot',
      category: 'logo-design',
      categoryLabel: 'Logotip dizayni',
      tags: ['Logotip', 'Firma uslubi', 'Kreativ'],
      coverImage: '/images/cms/savod-hozir.png',
      beforeImage: '/images/cms/savod-avval.png',
      afterImage: '/images/cms/savod-hozir.png',
      oldHint: 'Avvalgi vizual ko\'rinish',
      newHint: 'Savod (Yangi premium aydentika)',
      description: 'Zamonaviy ma\'rifat va adabiyot olamini birlashtiruvchi, yuridik jihatdan toza va unikal milliy nashriyot aydentikasi.',
      results: [
        { metric: 'Kitob sotuvi o\'sishi', value: '+45%' },
        { metric: 'Foydalanuvchilar ishonchi', value: '94%' },
        { metric: 'Tanilish ko\'rsatkichi', value: '2.5 barobar' }
      ],
      body: [
        {
          heading: "Vazifa va Muammo",
          paragraph: "Savod milliy nashriyoti bozorda eskirgan, oddiy yozuv uslubidagi logotip bilan tanilayotgandi. Nashriyot faqat darsliklar emas, balki premium badiiy adabiyotlar segmentiga kirib borishini ta'kidlash uchun o'ziga xos va falsafiy ma'noga ega aydentika zarur edi."
        },
        {
          heading: "Strategik Yechim",
          paragraph: "Biz sharqona madaniyat, ilm va kitob varaqlarini uyg'unlashtirgan o'ta unikal simvolik belgi yaratdik. Ranglar palitrasi sifatida oliyjanob zumrad va oltin ranglar tanlandi. Bu brendning ma'rifiy va premium mohiyatini mukammal ochib berdi."
        },
        {
          heading: "Yakuniy Natija",
          paragraph: "Yangi brending bilan nashr etilgan ilk premium turkum kitoblari do'konlarda rekord darajada tez sotildi. Kitobxonlar orasida 'Savod' brendiga bo'lgan ishonch va uning tanilishi misli ko'rilmagan darajada ko'tarildi."
        }
      ],
      galleryImages: [
        '/images/cms/savod-hozir.png'
      ],
      order: 2
    },
    {
      _id: 'fallback-fidda',
      slug: 'fidda',
      title: 'Fidda by Sevara Zargarlik',
      client: 'Fidda Premium',
      category: 'corporate-style',
      categoryLabel: 'Firma uslubi',
      tags: ['Aydentika', 'Zargarlik', 'Premium'],
      coverImage: '/images/cms/fidda-hozir.png',
      beforeImage: '/images/cms/fidda-avval.jpeg',
      afterImage: '/images/cms/fidda-hozir.png',
      oldHint: 'Oddiy logotip dizayni',
      newHint: 'Fidda (Premium aydentika)',
      description: 'Zargarlik buyumlari butigi uchun nafis, nozik va estetik jihatdan yuqori darajada ishlangan premium vizual aydentika tizimi.',
      results: [
        { metric: 'Raqamli ROAS (Reklama)', value: '4.2x' },
        { metric: 'Premium segment ulushi', value: '22%' },
        { metric: 'Mijozlarning qaytishi', value: '+35%' }
      ],
      body: [
        {
          heading: "Vazifa va Muammo",
          paragraph: "Fidda zargarlik brendi o'zining unikal va nozik asarlariga mos kelmaydigan, juda oddiy va xira brend dizaynidan aziyat chekayotgandi. Bu esa premium auditoriyani jalb qilish va yuqori narxlarda sotish imkonini cheklardi."
        },
        {
          heading: "Strategik Yechim",
          paragraph: "Biz kumush va zargarlik san'atining nafisligini aks ettiruvchi ingichka, nafis chiziqli logotip tizimi, unikal naqshlar va premium qadoqlash vizualizatsiyasini yaratdik. Vizual til o'ziga xoslik, go'zallik va ishonch tuyg'usini beradi."
        },
        {
          heading: "Yakuniy Natija",
          paragraph: "Brend yangilanganidan so'ng, ijtimoiy tarmoqlar va butikdagi visual aydentika yuqori toifadagi mijozlar diqqatini tortdi. Reklama kampaniyalarining samaradorligi (ROAS) 4.2 barobarga ko'tarilib, sotuvlarni rekord darajaga yetkazdi."
        }
      ],
      galleryImages: [
        '/images/cms/fidda-hozir.png'
      ],
      order: 3
    },
    {
      _id: 'fallback-boyarin',
      slug: 'boyarin',
      title: 'Boyarin Gurman Go\'sht Mahsulotlari',
      client: 'Boyarin Foods',
      category: 'packaging',
      categoryLabel: 'Qadoq dizayni',
      tags: ['Qadoq dizayni', 'Brend', 'Premium'],
      coverImage: '/images/cms/boyarin-hozir.png',
      beforeImage: '/images/cms/boyarin-avval.jpeg',
      afterImage: '/images/cms/boyarin-hozir.png',
      oldHint: 'Eski mahsulot uslubi',
      newHint: 'Boyarin (Premium qadoq)',
      description: 'Gurman go\'sht va yarim tayyor mahsulotlar uchun supermarket javonlarida darhol ajralib turadigan, premium vizual til va qadoqlar.',
      results: [
        { metric: 'Javondagi jozibadorlik', value: '+300%' },
        { metric: 'Supermarket savdolari', value: '+85%' },
        { metric: 'Brend tanilishi', value: '4 barobar' }
      ],
      body: [
        {
          heading: "Vazifa va Muammo",
          paragraph: "Boyarin go'sht mahsulotlari juda yuqori ta'm va sifatga ega bo'lishiga qaramay, uning qadog'i juda oddiy va bozordagi boshqa yuzlab brendlardan farq qilmas edi. Bu javonda mijoz e'tiborini tortish va sotuvni ko'paytirishga to'sqinlik qilardi."
        },
        {
          heading: "Strategik Yechim",
          paragraph: "Biz o'ta jasur, to'q qora va oltin ranglar uyg'unligidagi ajoyib premium qadoq tizimini ishlab chiqdik. Markaziy qismda brendning oliyjanob xarakterini ko'rsatuvchi stilizatsiyalangan Boyar ramzi joylashtirildi."
        },
        {
          heading: "Yakuniy Natija",
          paragraph: "Supermarket javonlarida Boyarin mahsulotlari boshqa raqobatchilardan 3 barobar kuchliroq ko'zga tashlandi. Birinchi oylarning o'zidayoq savdo hajmi 85% ga oshib, premium do'konlar bilan yangi shartnomalar imzolandi."
        }
      ],
      galleryImages: [
        '/images/cms/boyarin-hozir.png'
      ],
      order: 4
    },
    {
      _id: 'fallback-arfadel',
      slug: 'arfadel',
      title: 'Arfadel Parfumeriya',
      client: 'Arfadel',
      category: 'corporate-style',
      categoryLabel: 'Firma uslubi',
      tags: ['Aydentika', 'Parfumeriya', 'Premium'],
      coverImage: '/images/cms/arfadel-cover.jpg',
      description: "Premium parfyumeriya brendi uchun \"RR\" monogrammasi asosidagi to'liq vizual aydentika — atir flakonidan do'kon vitrinasigacha yagona oltin uslub.",
      body: [
        { heading: "Vazifa va Muammo", paragraph: "Yangi parfyumeriya brendini bozorga premium darajada olib chiqish kerak edi. Har bir aloqa nuqtasi — do'kon, qadoq, mobil ilova — yagona, esda qoladigan va ishonchli qiyofada bo'lishi talab etilardi." },
        { heading: "Strategik Yechim", paragraph: "\"RR\" monogrammasi va nafis geometrik naqsh asosida oltin-qora palitra ishlab chiqdik. Logotip, vizitka, paket, xodim formasi, do'kon vitrinasi, kassa zonasi va mobil ilova ikonkasi — barchasi bitta vizual tizimda birlashtirildi." },
        { heading: "Yakuniy Natija", paragraph: "Brend har joyda — flakon yorlig'idan do'kon peshtog'igacha — bir xil premium hissiyot beradi. Mijoz brendni bir ko'rishda taniydi va u raqobatchilardan ajralib turadi." }
      ],
      galleryImages: [
        '/images/cms/arfadel-counter.jpg',
        '/images/cms/arfadel-bag.jpg',
        '/images/cms/arfadel-app.jpg',
        '/images/cms/arfadel-card.jpg'
      ],
      order: 5
    },
    {
      _id: 'fallback-beyaz',
      slug: 'beyaz',
      title: 'Beyaz',
      client: 'Beyaz',
      category: 'logo-design',
      categoryLabel: 'Logotip dizayni',
      tags: ['Logotip', 'Belgi', 'Premium'],
      coverImage: '/images/cms/beyaz-cover.jpg',
      description: "Kuch va obro'ni ifodalovchi sher belgisi asosidagi premium logotip va belgi tizimi; oltin va to'q yashil palitrada.",
      body: [
        { heading: "Vazifa va Muammo", paragraph: "Brendga jiddiy, obro'li va esda qoladigan belgi kerak edi — raqobatchilar orasida darhol ajralib turadigan va ishonch uyg'otadigan." },
        { heading: "Strategik Yechim", paragraph: "Sher boshi asosidagi nafis va yaxlit belgi yaratdik. Oltin va to'q yashil ranglar hashamat va ishonchni ifodalaydi. Belgi turli fonlarda — oltin, yashil, oq va qora — bir xil kuchli ko'rinadigan qilib ishlandi." },
        { heading: "Yakuniy Natija", paragraph: "O'ziga xos, kuchli va moslashuvchan logotip — kichik ikonkadan katta bannergacha aniq o'qiladi va brendning premium xarakterini namoyon etadi." }
      ],
      galleryImages: [
        '/images/cms/beyaz-gold.jpg',
        '/images/cms/beyaz-symbol-green.jpg',
        '/images/cms/beyaz-symbol-gold.jpg'
      ],
      order: 6
    },
    {
      _id: 'fallback-enros',
      slug: 'enros',
      title: 'Enros',
      client: 'Enros',
      category: 'logo-design',
      categoryLabel: 'Logotip dizayni',
      tags: ['Logotip', 'Energiya', 'Dinamik'],
      coverImage: '/images/cms/enros-cover.jpg',
      description: "Energiya va tezlikni ifodalovchi chaqmoq belgisi asosidagi dinamik logotip; neon-moviy, laym va qora palitrada.",
      body: [
        { heading: "Vazifa va Muammo", paragraph: "Yosh va zamonaviy brendga e'tiborni darhol tortadigan, energiya hissini beruvchi belgi kerak edi." },
        { heading: "Strategik Yechim", paragraph: "Chaqmoq belgisini logotip bilan birlashtirgan qalin, geometrik yechim ishlab chiqdik. Neon-moviy, laym va qora kontrast harakat va quvvatni ifodalaydi." },
        { heading: "Yakuniy Natija", paragraph: "Bir ko'rishda yodda qoladigan, raqamli muhitda ham, mahsulotda ham yorqin ishlaydigan kuchli va dinamik belgi." }
      ],
      galleryImages: [
        '/images/cms/enros-lime.jpg',
        '/images/cms/enros-alt.jpg',
        '/images/cms/enros-icon.jpg'
      ],
      order: 7
    },
    {
      _id: 'fallback-diletta',
      slug: 'diletta',
      title: 'Diletta',
      client: 'Diletta',
      category: 'corporate-style',
      categoryLabel: 'Firma uslubi',
      tags: ['Moda', 'Aydentika', 'Premium'],
      coverImage: '/images/cms/diletta-cover.jpg',
      description: "Moda atelyesi uchun nafis \"D\" monogrammasi asosidagi premium aydentika — bordo va oltin uyg'unligida.",
      body: [
        { heading: "Vazifa va Muammo", paragraph: "Moda atelyesiga ayollarcha nafislik va premium hissni beruvchi, esda qoladigan brend qiyofasi kerak edi." },
        { heading: "Strategik Yechim", paragraph: "Qo'lda yozilgan uslubdagi nafis \"D\" monogrammasini yaratdik. Bordo va oltin palitra; logotip, vizitka, paket, do'kon belgisi, yorliq va ijtimoiy tarmoq shablonlari — barchasi yagona uslubda ishlandi." },
        { heading: "Yakuniy Natija", paragraph: "Brend nafis, qimmatbaho va o'ziga xos ko'rinish oldi. Har bir detal — yorliqdan paketgacha — bitta Diletta tilida gapiradi." }
      ],
      galleryImages: [
        '/images/cms/diletta-fashion.jpg',
        '/images/cms/diletta-storefront.jpg',
        '/images/cms/diletta-cards.jpg',
        '/images/cms/diletta-bag.jpg'
      ],
      order: 8
    }
  ],
  ru: [
    {
      _id: 'fallback-den-aroma',
      slug: 'den-aroma',
      title: 'Selective парфюмерия Den Aroma',
      client: 'ООО Den Aroma',
      category: 'brand-strategy',
      categoryLabel: 'Бренд-стратегия',
      tags: ['Бренд-стратегия', 'Айдентика', 'Брендбук'],
      coverImage: '/images/cms/denaroma-hozir.png',
      beforeImage: '/images/cms/denaroma-avval.png',
      afterImage: '/images/cms/denaroma-hozir.png',
      oldHint: '3 Atirchi (Старый бренд)',
      newHint: 'Den Aroma (Новый премиум брендинг)',
      description: 'Глобальная бренд-стратегия, элегантная айдентика и комплексный брендбук для первой премиальной сети селективной парфюмерии.',
      results: [
        { metric: 'Рост объема продаж', value: '+178%' },
        { metric: 'Капитализация бренда', value: '3.2 раза' },
        { metric: 'Доля рынка (Selective)', value: 'Топ-3' }
      ],
      body: [
        {
          heading: "Задача и Проблема",
          paragraph: "Предыдущий бренд '3 Atirchi' воспринимался рынком как бюджетный масс-маркет. Для выхода в премиальный сегмент селективной парфюмерии и конкуренции с мировыми брендами требовалось тотальное обновление бренда."
        },
        {
          heading: "Стратегическое Решение",
          paragraph: "Команда Jon Branding провела глубокий анализ рынка, создала новое премиальное имя 'Den Aroma', разработала минималистичный визуальный стиль и детальный брендбук на 120 страниц, стандартизирующий каждую точку контакта."
        },
        {
          heading: "Результат",
          paragraph: "После ребрендинга средний чек увеличился в 2.5 раза, а компания заняла прочные позиции в Топ-3 сетей селективной парфюмерии Узбекистана. Визуальная айдентика на 100% передала премиальный характер бренда."
        }
      ],
      galleryImages: [
        '/images/cms/denaroma-hozir.png',
        '/images/cms/denaroma-avval.png'
      ],
      order: 1
    },
    {
      _id: 'fallback-savod',
      slug: 'savod',
      title: 'Национальное издательство Savod',
      client: 'Издательство Savod',
      category: 'logo-design',
      categoryLabel: 'Дизайн логотипа',
      tags: ['Логотип', 'Фирменный стиль', 'Креатив'],
      coverImage: '/images/cms/savod-hozir.png',
      beforeImage: '/images/cms/savod-avval.png',
      afterImage: '/images/cms/savod-hozir.png',
      oldHint: 'Предыдущий вид',
      newHint: 'Savod (Новая премиум айдентика)',
      description: 'Уникальная национальная айдентика издательского дома, объединяющая мир современной литературы и глубоких традиций.',
      results: [
        { metric: 'Рост продаж книг', value: '+45%' },
        { metric: 'Доверие читателей', value: '94%' },
        { metric: 'Узнаваемость бренда', value: 'В 2.5 раза' }
      ],
      body: [
        {
          heading: "Задача и Проблема",
          paragraph: "Издательство Savod использовало устаревший текстовый логотип. Для выхода в сегмент премиальной художественной литературы требовалась глубокая философская айдентика, выделяющая бренд на рынке."
        },
        {
          heading: "Стратегическое Решение",
          paragraph: "Мы создали символический знак, гармонично сочетающий восточную культуру, просвещение и книжные страницы. В качестве цветовой палитры были выбраны благородный изумрудный и золото, идеально раскрывающие суть бренда."
        },
        {
          heading: "Результат",
          paragraph: "Первая серия книг, изданная в новой айдентике, установила рекорд по скорости продаж. Доверие и лояльность читателей к бренду Savod выросли до беспрецедентного уровня."
        }
      ],
      galleryImages: [
        '/images/cms/savod-hozir.png'
      ],
      order: 2
    },
    {
      _id: 'fallback-fidda',
      slug: 'fidda',
      title: 'Ювелирный бутик Fidda by Sevara',
      client: 'Fidda Premium',
      category: 'corporate-style',
      categoryLabel: 'Фирменный стиль',
      tags: ['Айдентика', 'Ювелирные изделия', 'Премиум'],
      coverImage: '/images/cms/fidda-hozir.png',
      beforeImage: '/images/cms/fidda-avval.jpeg',
      afterImage: '/images/cms/fidda-hozir.png',
      oldHint: 'Простой логотип',
      newHint: 'Fidda (Премиум айдентика)',
      description: 'Изящный визуальный стиль премиум-класса для бутика дизайнерских ювелирных украшений ручной работы.',
      results: [
        { metric: 'Цифровой ROAS (Окупаемость)', value: '4.2x' },
        { metric: 'Доля в премиум-сегменте', value: '22%' },
        { metric: 'Возвратность клиентов', value: '+35%' }
      ],
      body: [
        {
          heading: "Задача и Проблема",
          paragraph: "Ювелирный бренд Fidda использовал слишком простой логотип, не отражающий тонкость и изящество его изделий. Это ограничивало привлечение премиальной аудитории и мешало продажам в высоком чеке."
        },
        {
          heading: "Стратегическое Решение",
          paragraph: "Мы разработали деликатную лого-систему, элегантные паттерны и премиальную визуализацию упаковки. Визуальный язык бренда стал транслировать эксклюзивность, утонченность и ювелирную роскошь."
        },
        {
          heading: "Результат",
          paragraph: "Новый визуальный образ мгновенно привлек внимание целевой аудитории. Эффективность рекламных кампаний (ROAS) выросла в 4.2 раза, а розничные продажи бутика достигли исторического максимума."
        }
      ],
      galleryImages: [
        '/images/cms/fidda-hozir.png'
      ],
      order: 3
    },
    {
      _id: 'fallback-boyarin',
      slug: 'boyarin',
      title: 'Деликатесы Boyarin Gourmet',
      client: 'Boyarin Foods',
      category: 'packaging',
      categoryLabel: 'Дизайн упаковки',
      tags: ['Упаковка', 'Бренд', 'Премиум'],
      coverImage: '/images/cms/boyarin-hozir.png',
      beforeImage: '/images/cms/boyarin-avval.jpeg',
      afterImage: '/images/cms/boyarin-hozir.png',
      oldHint: 'Старая упаковка',
      newHint: 'Boyarin (Премиум упаковка)',
      description: 'Премиальный визуальный язык и дизайн упаковки для гурманских мясных деликатесов, доминирующий на полках супермаркетов.',
      results: [
        { metric: 'Заметность на полке', value: '+300%' },
        { metric: 'Продажи в сетях', value: '+85%' },
        { metric: 'Узнаваемость марки', value: 'В 4 раза' }
      ],
      body: [
        {
          heading: "Задача и Проблема",
          paragraph: "Мясные деликатесы Boyarin имели великолепный вкус и качество, но их упаковка была невзрачной и терялась среди сотен конкурентов на полках магазинов."
        },
        {
          heading: "Стратегическое Решение",
          paragraph: "Мы разработали премиальную систему упаковки в глубоких угольно-черных и золотых тонах. В центре композиции был размещен благородный стилизованный образ Боярина, символизирующий качество."
        },
        {
          heading: "Результат",
          paragraph: "На полках премиальных супермаркетов продукция Boyarin стала выделяться в 3 раза сильнее конкурентов. В первый же месяц продажи выросли на 85%, были заключены новые крупные контракты."
        }
      ],
      galleryImages: [
        '/images/cms/boyarin-hozir.png'
      ],
      order: 4
    },
    {
      _id: 'fallback-arfadel',
      slug: 'arfadel',
      title: 'Парфюмерия Arfadel',
      client: 'Arfadel',
      category: 'corporate-style',
      categoryLabel: 'Фирменный стиль',
      tags: ['Айдентика', 'Парфюмерия', 'Премиум'],
      coverImage: '/images/cms/arfadel-cover.jpg',
      description: "Полная визуальная айдентика для премиальной парфюмерии на основе монограммы \"RR\" — единый золотой стиль от флакона до витрины магазина.",
      body: [
        { heading: "Задача", paragraph: "Нужно было вывести новый парфюмерный бренд на рынок на премиальном уровне. Каждая точка контакта — магазин, упаковка, мобильное приложение — должна была выглядеть единообразно, узнаваемо и вызывать доверие." },
        { heading: "Решение", paragraph: "Мы разработали золото-чёрную палитру на основе монограммы \"RR\" и изящного геометрического орнамента. Логотип, визитка, пакет, форма персонала, витрина, кассовая зона и иконка приложения объединены в единую систему." },
        { heading: "Результат", paragraph: "Бренд везде — от этикетки флакона до вывески магазина — передаёт одинаковое премиальное ощущение. Клиент узнаёт бренд с первого взгляда, и он выделяется среди конкурентов." }
      ],
      galleryImages: [
        '/images/cms/arfadel-counter.jpg',
        '/images/cms/arfadel-bag.jpg',
        '/images/cms/arfadel-app.jpg',
        '/images/cms/arfadel-card.jpg'
      ],
      order: 5
    },
    {
      _id: 'fallback-beyaz',
      slug: 'beyaz',
      title: 'Beyaz',
      client: 'Beyaz',
      category: 'logo-design',
      categoryLabel: 'Дизайн логотипа',
      tags: ['Логотип', 'Знак', 'Премиум'],
      coverImage: '/images/cms/beyaz-cover.jpg',
      description: "Премиальная система логотипа и знака на основе образа льва, символизирующего силу и престиж; в золотой и тёмно-зелёной палитре.",
      body: [
        { heading: "Задача", paragraph: "Бренду требовался серьёзный, престижный и запоминающийся знак, мгновенно выделяющийся среди конкурентов и вызывающий доверие." },
        { heading: "Решение", paragraph: "Мы создали изящный цельный знак на основе головы льва. Золотой и тёмно-зелёный цвета передают роскошь и доверие. Знак одинаково сильно смотрится на разных фонах — золотом, зелёном, белом и чёрном." },
        { heading: "Результат", paragraph: "Уникальный, сильный и гибкий логотип, который чётко читается от маленькой иконки до большого баннера и раскрывает премиальный характер бренда." }
      ],
      galleryImages: [
        '/images/cms/beyaz-gold.jpg',
        '/images/cms/beyaz-symbol-green.jpg',
        '/images/cms/beyaz-symbol-gold.jpg'
      ],
      order: 6
    },
    {
      _id: 'fallback-enros',
      slug: 'enros',
      title: 'Enros',
      client: 'Enros',
      category: 'logo-design',
      categoryLabel: 'Дизайн логотипа',
      tags: ['Логотип', 'Энергия', 'Динамика'],
      coverImage: '/images/cms/enros-cover.jpg',
      description: "Динамичный логотип на основе знака молнии, символизирующего энергию и скорость; в неоново-синей, лаймовой и чёрной палитре.",
      body: [
        { heading: "Задача", paragraph: "Молодому и современному бренду нужен был знак, мгновенно привлекающий внимание и передающий ощущение энергии." },
        { heading: "Решение", paragraph: "Мы объединили знак молнии с логотипом в смелое геометрическое решение. Неоново-синий, лаймовый и чёрный контраст передают движение и мощь." },
        { heading: "Результат", paragraph: "Сильный и динамичный знак, который запоминается с первого взгляда и ярко работает как в цифровой среде, так и на продукте." }
      ],
      galleryImages: [
        '/images/cms/enros-lime.jpg',
        '/images/cms/enros-alt.jpg',
        '/images/cms/enros-icon.jpg'
      ],
      order: 7
    },
    {
      _id: 'fallback-diletta',
      slug: 'diletta',
      title: 'Diletta',
      client: 'Diletta',
      category: 'corporate-style',
      categoryLabel: 'Фирменный стиль',
      tags: ['Мода', 'Айдентика', 'Премиум'],
      coverImage: '/images/cms/diletta-cover.jpg',
      description: "Премиальная айдентика для модного ателье на основе изящной монограммы \"D\" — в сочетании бордового и золотого.",
      body: [
        { heading: "Задача", paragraph: "Модному ателье нужен был запоминающийся образ бренда, передающий женственную утончённость и премиальное ощущение." },
        { heading: "Решение", paragraph: "Мы создали изящную монограмму \"D\" в рукописном стиле. Бордово-золотая палитра; логотип, визитка, пакет, вывеска магазина, бирка и шаблоны для соцсетей — всё выполнено в едином стиле." },
        { heading: "Результат", paragraph: "Бренд получил утончённый, дорогой и узнаваемый вид. Каждая деталь — от бирки до пакета — говорит на одном языке Diletta." }
      ],
      galleryImages: [
        '/images/cms/diletta-fashion.jpg',
        '/images/cms/diletta-storefront.jpg',
        '/images/cms/diletta-cards.jpg',
        '/images/cms/diletta-bag.jpg'
      ],
      order: 8
    }
  ],
  en: [
    {
      _id: 'fallback-den-aroma',
      slug: 'den-aroma',
      title: 'Selective Perfumery Den Aroma',
      client: 'Den Aroma LLC',
      category: 'brand-strategy',
      categoryLabel: 'Brand Strategy',
      tags: ['Brand Strategy', 'Identity', 'Brandbook'],
      coverImage: '/images/cms/denaroma-hozir.png',
      beforeImage: '/images/cms/denaroma-avval.png',
      afterImage: '/images/cms/denaroma-hozir.png',
      oldHint: '3 Atirchi (Old branding)',
      newHint: 'Den Aroma (New premium branding)',
      description: 'Global brand strategy, elegant visual identity, and comprehensive brandbook designed for a premium selective perfumery chain.',
      results: [
        { metric: 'Sales Volume Growth', value: '+178%' },
        { metric: 'Brand Capitalization', value: '3.2x' },
        { metric: 'Selective Market Share', value: 'Top-3' }
      ],
      body: [
        {
          heading: "The Challenge",
          paragraph: "The previous brand '3 Atirchi' was perceived as budget mass-market. In order to enter the premium selective perfume segment and compete with international houses, a complete brand overhaul was required."
        },
        {
          heading: "Strategic Solution",
          paragraph: "Jon Branding team conducted a deep market analysis, created the new premium name 'Den Aroma', developed a minimalist yet noble visual identity, and a comprehensive 120-page brandbook standardizing all touchpoints."
        },
        {
          heading: "The Result",
          paragraph: "Following the rebranding, the average order value increased 2.5x, and the chain firmly established its position in the selective perfumery Top-3. Visual identity perfectly communicated the premium nature of the brand."
        }
      ],
      galleryImages: [
        '/images/cms/denaroma-hozir.png',
        '/images/cms/denaroma-avval.png'
      ],
      order: 1
    },
    {
      _id: 'fallback-savod',
      slug: 'savod',
      title: 'Savod National Publishing',
      client: 'Savod Publishing',
      category: 'logo-design',
      categoryLabel: 'Logo Design',
      tags: ['Logo', 'Brand Identity', 'Creative'],
      coverImage: '/images/cms/savod-hozir.png',
      beforeImage: '/images/cms/savod-avval.png',
      afterImage: '/images/cms/savod-hozir.png',
      oldHint: 'Previous visual',
      newHint: 'Savod (New premium identity)',
      description: 'A unique national publishing identity bridging the world of modern literature and deep scholarly traditions.',
      results: [
        { metric: 'Book Sales Increase', value: '+45%' },
        { metric: 'Reader Loyalty Rate', value: '94%' },
        { metric: 'Brand Awareness', value: '2.5x' }
      ],
      body: [
        {
          heading: "The Challenge",
          paragraph: "Savod publishing used an outdated wordmark. To highlight its entry into premium creative literature, a deep philosophical identity was necessary."
        },
        {
          heading: "Strategic Solution",
          paragraph: "We created a symbolic logo beautifully merging oriental motifs, education, and paper sheets. Oble emerald green and gold colors were selected to elevate the brand's visual language."
        },
        {
          heading: "The Result",
          paragraph: "The first collection of books published with the new brand identity set store sales records. Readers' trust and recognition reached unprecedented heights."
        }
      ],
      galleryImages: [
        '/images/cms/savod-hozir.png'
      ],
      order: 2
    },
    {
      _id: 'fallback-fidda',
      slug: 'fidda',
      title: 'Fidda by Sevara Jewelry Boutique',
      client: 'Fidda Premium',
      category: 'corporate-style',
      categoryLabel: 'Corporate Style',
      tags: ['Identity', 'Jewelry', 'Premium'],
      coverImage: '/images/cms/fidda-hozir.png',
      beforeImage: '/images/cms/fidda-avval.jpeg',
      afterImage: '/images/cms/fidda-hozir.png',
      oldHint: 'Simple logo',
      newHint: 'Fidda (Premium identity)',
      description: 'Delicate, sophisticated, and high-end visual identity system designed for a luxury artisan jewelry boutique.',
      results: [
        { metric: 'Digital Ads ROAS', value: '4.2x' },
        { metric: 'Premium Market Share', value: '22%' },
        { metric: 'Customer Retention Rate', value: '+35%' }
      ],
      body: [
        {
          heading: "The Challenge",
          paragraph: "The jewelry brand Fidda used a generic logo that failed to express the refinement and uniqueness of its handcrafted collections, limiting premium sales."
        },
        {
          heading: "Strategic Solution",
          paragraph: "We designed a delicate, fine-line logo system, elegant visual patterns, and premium packaging concepts. The visual language conveys exclusivity, artistic beauty, and luxurious trust."
        },
        {
          heading: "The Result",
          paragraph: "Visual presentation across social media and the boutique instantly captured high-end clients. Ad campaign efficiency (ROAS) reached 4.2x, pushing retail sales to record levels."
        }
      ],
      galleryImages: [
        '/images/cms/fidda-hozir.png'
      ],
      order: 3
    },
    {
      _id: 'fallback-boyarin',
      slug: 'boyarin',
      title: 'Boyarin Gourmet Meats',
      client: 'Boyarin Foods',
      category: 'packaging',
      categoryLabel: 'Packaging Design',
      tags: ['Packaging', 'Brand', 'Premium'],
      coverImage: '/images/cms/boyarin-hozir.png',
      beforeImage: '/images/cms/boyarin-avval.jpeg',
      afterImage: '/images/cms/boyarin-hozir.png',
      oldHint: 'Old package',
      newHint: 'Boyarin (Premium packaging)',
      description: 'A striking premium visual identity and packaging system designed to dominate gourmet store shelves.',
      results: [
        { metric: 'Shelf Eye-Catching Rate', value: '+300%' },
        { metric: 'Retail Sales Increase', value: '+85%' },
        { metric: 'Brand Recognition', value: '4x' }
      ],
      body: [
        {
          heading: "The Challenge",
          paragraph: "Boyarin gourmet meats had excellent quality and taste, but the generic packaging got lost among dozens of competitors on store shelves."
        },
        {
          heading: "Strategic Solution",
          paragraph: "We designed a premium packaging system using deep charcoal black and gold colors. At the center is a stylized Boyar character, symbolizing quality and tradition."
        },
        {
          heading: "The Result",
          paragraph: "On gourmet shelves, Boyarin products became 3x more eye-catching than competitors. Sales increased 85% in the very first month, securing new premium store listings."
        }
      ],
      galleryImages: [
        '/images/cms/boyarin-hozir.png'
      ],
      order: 4
    },
    {
      _id: 'fallback-arfadel',
      slug: 'arfadel',
      title: 'Arfadel Perfumery',
      client: 'Arfadel',
      category: 'corporate-style',
      categoryLabel: 'Corporate Identity',
      tags: ['Identity', 'Perfumery', 'Premium'],
      coverImage: '/images/cms/arfadel-cover.jpg',
      description: "A complete visual identity for a premium perfumery built around the \"RR\" monogram — one golden style from the bottle to the storefront.",
      body: [
        { heading: "The Challenge", paragraph: "A new perfumery brand had to enter the market at a premium level. Every touchpoint — store, packaging, mobile app — needed a single, memorable and trustworthy look." },
        { heading: "The Solution", paragraph: "We built a gold-and-black palette around the \"RR\" monogram and a refined geometric pattern. Logo, business card, bag, staff uniform, storefront, checkout zone and the app icon were unified into one visual system." },
        { heading: "The Result", paragraph: "Everywhere — from the bottle label to the storefront sign — the brand delivers the same premium feeling. Customers recognize it at a glance and it stands out from competitors." }
      ],
      galleryImages: [
        '/images/cms/arfadel-counter.jpg',
        '/images/cms/arfadel-bag.jpg',
        '/images/cms/arfadel-app.jpg',
        '/images/cms/arfadel-card.jpg'
      ],
      order: 5
    },
    {
      _id: 'fallback-beyaz',
      slug: 'beyaz',
      title: 'Beyaz',
      client: 'Beyaz',
      category: 'logo-design',
      categoryLabel: 'Logo Design',
      tags: ['Logo', 'Mark', 'Premium'],
      coverImage: '/images/cms/beyaz-cover.jpg',
      description: "A premium logo and mark system built around a lion that embodies strength and prestige; in a gold and deep-green palette.",
      body: [
        { heading: "The Challenge", paragraph: "The brand needed a serious, prestigious and memorable mark that instantly stands out among competitors and inspires trust." },
        { heading: "The Solution", paragraph: "We crafted a refined, unified mark based on a lion's head. Gold and deep green convey luxury and trust. The mark was built to look equally strong on different backgrounds — gold, green, white and black." },
        { heading: "The Result", paragraph: "A distinctive, strong and flexible logo that reads clearly from a tiny icon to a large banner and expresses the brand's premium character." }
      ],
      galleryImages: [
        '/images/cms/beyaz-gold.jpg',
        '/images/cms/beyaz-symbol-green.jpg',
        '/images/cms/beyaz-symbol-gold.jpg'
      ],
      order: 6
    },
    {
      _id: 'fallback-enros',
      slug: 'enros',
      title: 'Enros',
      client: 'Enros',
      category: 'logo-design',
      categoryLabel: 'Logo Design',
      tags: ['Logo', 'Energy', 'Dynamic'],
      coverImage: '/images/cms/enros-cover.jpg',
      description: "A dynamic logo built around a lightning mark that conveys energy and speed; in a neon-blue, lime and black palette.",
      body: [
        { heading: "The Challenge", paragraph: "A young, modern brand needed a mark that instantly grabs attention and conveys a sense of energy." },
        { heading: "The Solution", paragraph: "We merged a lightning mark with the wordmark into a bold, geometric solution. Neon blue, lime and black contrast convey motion and power." },
        { heading: "The Result", paragraph: "A strong, dynamic mark that is memorable at a glance and works vividly both in digital and on product." }
      ],
      galleryImages: [
        '/images/cms/enros-lime.jpg',
        '/images/cms/enros-alt.jpg',
        '/images/cms/enros-icon.jpg'
      ],
      order: 7
    },
    {
      _id: 'fallback-diletta',
      slug: 'diletta',
      title: 'Diletta',
      client: 'Diletta',
      category: 'corporate-style',
      categoryLabel: 'Corporate Identity',
      tags: ['Fashion', 'Identity', 'Premium'],
      coverImage: '/images/cms/diletta-cover.jpg',
      description: "A premium identity for a fashion atelier built around an elegant \"D\" monogram — in a burgundy and gold pairing.",
      body: [
        { heading: "The Challenge", paragraph: "The fashion atelier needed a memorable brand image conveying feminine refinement and a premium feel." },
        { heading: "The Solution", paragraph: "We created an elegant hand-written \"D\" monogram. A burgundy-and-gold palette; logo, business card, bag, storefront sign, tag and social templates were all crafted in one consistent style." },
        { heading: "The Result", paragraph: "The brand gained a refined, premium and recognizable look. Every detail — from the tag to the bag — speaks one Diletta language." }
      ],
      galleryImages: [
        '/images/cms/diletta-fashion.jpg',
        '/images/cms/diletta-storefront.jpg',
        '/images/cms/diletta-cards.jpg',
        '/images/cms/diletta-bag.jpg'
      ],
      order: 8
    }
  ],
  zh: [
    {
      _id: 'fallback-den-aroma',
      slug: 'den-aroma',
      title: 'Den Aroma 高端定制香水',
      client: 'Den Aroma 有限公司',
      category: 'brand-strategy',
      categoryLabel: '品牌战略',
      tags: ['品牌战略', '视觉识别', '品牌指南'],
      coverImage: '/images/cms/denaroma-hozir.png',
      beforeImage: '/images/cms/denaroma-avval.png',
      afterImage: '/images/cms/denaroma-hozir.png',
      oldHint: '3 Atirchi (旧品牌)',
      newHint: 'Den Aroma (全新高端品牌包装)',
      description: '为高端定制香水连锁店打造的全球品牌战略、高雅视觉识别系统以及全方位品牌指南项目。',
      results: [
        { metric: '销售额增长', value: '+178%' },
        { metric: '品牌估值提升', value: '3.2倍' },
        { metric: '细分市场份额', value: '前3名' }
      ],
      body: [
        {
          heading: "挑战与背景",
          paragraph: "该品牌前身 '3 Atirchi' 被市场定位为廉价的大众市场品牌。为了进军高端定制香水市场并与国际知名品牌竞争，亟需进行全面的品牌升级。"
        },
        {
          heading: "战略性解决方案",
          paragraph: "Jon Branding 团队对市场进行了深度分析，确立了全新高端名称 'Den Aroma'，设计了极简而高贵的视觉概念，并制定了120页的品牌规范指南，统一了所有接触点。"
        },
        {
          heading: "成果",
          paragraph: "品牌升级后，平均客单价提升了2.5倍，连锁店稳居高端定制香水市场前3名。全新的视觉识别系统百分之百地传达了品牌的高端定位。"
        }
      ],
      galleryImages: [
        '/images/cms/denaroma-hozir.png',
        '/images/cms/denaroma-avval.png'
      ],
      order: 1
    },
    {
      _id: 'fallback-savod',
      slug: 'savod',
      title: 'Savod 国家出版社',
      client: 'Savod 出版社',
      category: 'logo-design',
      categoryLabel: '标志设计',
      tags: ['标志', '品牌识别', '创意'],
      coverImage: '/images/cms/savod-hozir.png',
      beforeImage: '/images/cms/savod-avval.png',
      afterImage: '/images/cms/savod-hozir.png',
      oldHint: '旧版视觉效果',
      newHint: 'Savod (全新高端视觉识别)',
      description: '融合现代文学世界与深厚学术传统的独特国家出版社品牌视觉系统。',
      results: [
        { metric: '图书销量增长', value: '+45%' },
        { metric: '读者忠诚度', value: '94%' },
        { metric: '品牌知名度', value: '2.5倍' }
      ],
      body: [
        {
          heading: "挑战与背景",
          paragraph: "Savod 出版社曾使用过时的文字标志。为了彰显其进军高端文学创作领域的决心，必须建立一个充满哲学深度的品牌视觉形象。"
        },
        {
          heading: "战略性解决方案",
          paragraph: "我们设计了一个完美融合东方元素、教育内涵与书页形象的象征性标志。选用高贵的祖母绿和金色作为品牌色，极大地提升了视觉语言的高级感。"
        },
        {
          heading: "成果",
          paragraph: "以全新品牌形象出版的首批丛书创下了书店销售记录。读者对 Savod 品牌的信任与认可达到了前所未有的高度。"
        }
      ],
      galleryImages: [
        '/images/cms/savod-hozir.png'
      ],
      order: 2
    },
    {
      _id: 'fallback-fidda',
      slug: 'fidda',
      title: 'Fidda by Sevara 珠宝精品店',
      client: 'Fidda Premium',
      category: 'corporate-style',
      categoryLabel: '企业风格',
      tags: ['视觉识别', '珠宝', '高端'],
      coverImage: '/images/cms/fidda-hozir.png',
      beforeImage: '/images/cms/fidda-avval.jpeg',
      afterImage: '/images/cms/fidda-hozir.png',
      oldHint: '简约标志',
      newHint: 'Fidda (高端视觉识别)',
      description: '为奢华手作珠宝精品店量身定制的精致、典雅的高端视觉识别系统。',
      results: [
        { metric: '数字广告投资回报率', value: '4.2倍' },
        { metric: '高端市场份额', value: '22%' },
        { metric: '客户留存率', value: '+35%' }
      ],
      body: [
        {
          heading: "挑战与背景",
          paragraph: "珠宝品牌 Fidda 之前使用的普通标志未能体现其纯手工定制系列的精致与独特，限制了高端客群的开拓。"
        },
        {
          heading: "战略性解决方案",
          paragraph: "我们设计了精致的纤细线条标志系统、高雅的视觉图案以及高端包装概念。视觉语言精准传达了品牌的独特性、艺术美感以及尊贵信任感。"
        },
        {
          heading: "成果",
          paragraph: "社交媒体和实体精品店的全新视觉呈现瞬间吸引了高端客户。广告投资回报率（ROAS）达到了4.2倍，将零售额推向了创纪录的历史新高。"
        }
      ],
      galleryImages: [
        '/images/cms/fidda-hozir.png'
      ],
      order: 3
    },
    {
      _id: 'fallback-boyarin',
      slug: 'boyarin',
      title: 'Boyarin 熟食牛肉',
      client: 'Boyarin 食品',
      category: 'packaging',
      categoryLabel: '包装设计',
      tags: ['包装', '品牌', '高端'],
      coverImage: '/images/cms/boyarin-hozir.png',
      beforeImage: '/images/cms/boyarin-avval.jpeg',
      afterImage: '/images/cms/boyarin-hozir.png',
      oldHint: '旧版包装',
      newHint: 'Boyarin (高端包装)',
      description: '专为抢占高端货架设计的醒目高级视觉识别与包装系统。',
      results: [
        { metric: '货架吸睛率', value: '+300%' },
        { metric: '零售额增长', value: '+85%' },
        { metric: '品牌知名度', value: '4倍' }
      ],
      body: [
        {
          heading: "挑战与背景",
          paragraph: "Boyarin 熟食肉品品质绝佳，但普通的包装导致其在货架上的数百个竞争对手中黯然失色。"
        },
        {
          heading: "战略性解决方案",
          paragraph: "我们使用深木炭黑和金色设计了高端包装系统。中心是风格化的 Boyar 人物形象，象征着品质与传统的传承。"
        },
        {
          heading: "成果",
          paragraph: "在精品货架上，Boyarin 产品比竞争对手吸睛3倍。在第一个月内销售额即增长了85%，并成功锁定了新的高端门店合作协议。"
        }
      ],
      galleryImages: [
        '/images/cms/boyarin-hozir.png'
      ],
      order: 4
    },
    {
      _id: 'fallback-arfadel',
      slug: 'arfadel',
      title: 'Arfadel 香水',
      client: 'Arfadel',
      category: 'corporate-style',
      categoryLabel: '企业形象',
      tags: ['品牌识别', '香水', '高端'],
      coverImage: '/images/cms/arfadel-cover.jpg',
      description: "为高端香水品牌打造的完整视觉识别系统，以 \"RR\" 字母组合为核心——从香水瓶到店面橱窗，统一的金色风格。",
      body: [
        { heading: "挑战", paragraph: "新的香水品牌需要以高端定位进入市场。每一个接触点——门店、包装、移动应用——都需要统一、易记且值得信赖的形象。" },
        { heading: "解决方案", paragraph: "我们以 \"RR\" 字母组合和精致的几何纹样为基础，打造了金黑配色。标志、名片、手提袋、员工制服、店面橱窗、收银区和应用图标都被统一到同一视觉系统中。" },
        { heading: "成果", paragraph: "无论在哪里——从瓶身标签到店面招牌——品牌都传递出同样的高端感。顾客一眼就能认出，并在竞争中脱颖而出。" }
      ],
      galleryImages: [
        '/images/cms/arfadel-counter.jpg',
        '/images/cms/arfadel-bag.jpg',
        '/images/cms/arfadel-app.jpg',
        '/images/cms/arfadel-card.jpg'
      ],
      order: 5
    },
    {
      _id: 'fallback-beyaz',
      slug: 'beyaz',
      title: 'Beyaz',
      client: 'Beyaz',
      category: 'logo-design',
      categoryLabel: '标志设计',
      tags: ['标志', '符号', '高端'],
      coverImage: '/images/cms/beyaz-cover.jpg',
      description: "以象征力量与尊贵的狮子形象为核心的高端标志与符号系统；采用金色与深绿色调。",
      body: [
        { heading: "挑战", paragraph: "品牌需要一个庄重、尊贵且令人难忘的标志，在竞争者中立刻脱颖而出并赢得信任。" },
        { heading: "解决方案", paragraph: "我们以狮头为基础打造了精致而完整的符号。金色与深绿传达奢华与信赖。该符号在金色、绿色、白色和黑色等不同背景上都同样有力。" },
        { heading: "成果", paragraph: "一个独特、有力且灵活的标志——从小图标到大横幅都清晰可辨，彰显品牌的高端气质。" }
      ],
      galleryImages: [
        '/images/cms/beyaz-gold.jpg',
        '/images/cms/beyaz-symbol-green.jpg',
        '/images/cms/beyaz-symbol-gold.jpg'
      ],
      order: 6
    },
    {
      _id: 'fallback-enros',
      slug: 'enros',
      title: 'Enros',
      client: 'Enros',
      category: 'logo-design',
      categoryLabel: '标志设计',
      tags: ['标志', '能量', '动感'],
      coverImage: '/images/cms/enros-cover.jpg',
      description: "以象征能量与速度的闪电标记为核心的动感标志；采用霍虹蓝、青柠绿与黑色调。",
      body: [
        { heading: "挑战", paragraph: "年轻、现代的品牌需要一个能立即抓住注意力、传达能量感的标记。" },
        { heading: "解决方案", paragraph: "我们将闪电标记与文字标志结合成大胆的几何方案。霍虹蓝、青柠绿与黑色的对比传达动感与力量。" },
        { heading: "成果", paragraph: "一个有力而动感的标记，一眼难忘，无论在数字环境还是产品上都表现亮眼。" }
      ],
      galleryImages: [
        '/images/cms/enros-lime.jpg',
        '/images/cms/enros-alt.jpg',
        '/images/cms/enros-icon.jpg'
      ],
      order: 7
    },
    {
      _id: 'fallback-diletta',
      slug: 'diletta',
      title: 'Diletta',
      client: 'Diletta',
      category: 'corporate-style',
      categoryLabel: '企业形象',
      tags: ['时尚', '品牌识别', '高端'],
      coverImage: '/images/cms/diletta-cover.jpg',
      description: "为时装工作室打造的高端品牌识别，以优雅的 \"D\" 字母组合为核心——采用酒红与金色搭配。",
      body: [
        { heading: "挑战", paragraph: "时装工作室需要一个令人难忘的品牌形象，传达女性的精致与高端感。" },
        { heading: "解决方案", paragraph: "我们创作了手写风格的优雅 \"D\" 字母组合。酒红配金色；标志、名片、手提袋、店面招牌、吊牌和社交模板均以统一风格呈现。" },
        { heading: "成果", paragraph: "品牌获得了精致、高贵且具辨识度的形象。每一处细节——从吊牌到手提袋——都讲述着同一种 Diletta 语言。" }
      ],
      galleryImages: [
        '/images/cms/diletta-fashion.jpg',
        '/images/cms/diletta-storefront.jpg',
        '/images/cms/diletta-cards.jpg',
        '/images/cms/diletta-bag.jpg'
      ],
      order: 8
    }
  ]
};

export function getPortfolioFallback(lang: string = 'uz', slug?: string): PortfolioProject[] | PortfolioProject | null {
  const safeLang = ['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz';
  const list = FALLBACK_PORTFOLIO[safeLang] || FALLBACK_PORTFOLIO.uz;
  
  if (slug) {
    return list.find(p => p.slug === slug) || null;
  }
  return list;
}

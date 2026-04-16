
import { type Brand, type Project, type Testimonial } from '@/lib/types';

export const staticBrands: Brand[] = [
    { name: 'Sarmilk', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/397532414b3865441a468b33dacc295f195030d1-511x112.png' }, 
    { name: 'M-Karim', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/fad5b1fdb82621fbd2172ec3db4f07ddfe93d032-198x101.png' }, 
    { name: 'Prime Fit', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/c703c9e98c9bec5e8b1b4c82e5e82f22cb713730-518x103.png' }, 
    { name: 'Revo', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/e4a0a8cdbea0ecfc5493501f962f7454856ee038-595x294.png' }, 
    { name: 'To\'maris', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/988c07b7a9bdbb8ce925ba2c93d54918dd4ac339-401x143.png' }, 
    { name: 'Aisha Mebel', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/9dbd2b8a7a6adb43828abc2c8a595c148260f5f8-333x201.png' }, 
    { name: 'Den Aroma', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/eba37120fa078eaf1cfabb93273ef5a8755e89bc-286x63.png' }, 
    { name: 'Velzo', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/5789862c43bcf1423a4e7d9abfa9e976dcdce4c9-383x141.png' }, 
    { name: 'Bodomchi', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/6bd5ebb503173ffe04133091154e5a30cc2380ef-555x141.png' },
    { name: 'Fidda by Sevara', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/0485c3ac7efb8043632c9bb57db90cca1223fbe0-219x71.png', hiddenInHero: true }, 
    { name: 'Boyarin', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/e3f60742daeebc03b51ab018d630a87eb62ae7b1-546x140.png' }, 
    { name: 'Viton', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/5fb8453d398d0449e03e81c16b31a331a8ca2a79-455x141.png' }, 
    { name: 'Ravza Mebel', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/43c823497d60761a33fb26ba3750df418d4989b4-203x71.png' }, 
    { name: 'Dayan Color', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/268a1937ed65a252612009c1cc9c6a45d768ff01-379x102.png' }, 
    { name: 'Bekbazar', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/8486f9c94f7e86bad6f00c7b8a9e1465dc6be38d-554x129.png' }, 
    { name: 'InControl', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/463a452a75d8b134f56ceb32bab199a273c09cd2-302x36.png' }, 
    { name: 'Sunnah Products', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/1819adae1b4f694dc745f7b91ab1c73f15a7e56a-222x71.png' }, 
    { name: 'Goodwell', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/d89fe54a631efe865287f027a6aca058a27cdf7d-282x50.png' }, 
    { name: 'Perfona', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/d15ee419cf4e240767079d33eea7134c5f3bc70b-273x71.png' }, 
    { name: 'Esviro', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/cfb6ffc9d0b3cc771838b15198945a236de5e749-281x58.png' }, 
    { name: 'Savod', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/da6470ae1385649582580bdb921a5425824c4aeb-189x71.png' },
    { name: 'Sherzod Beknazarov', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/ae451b575490ad8a4db0972fa4749481c81a3c37-325x50.png' }, 
    { name: 'O\'rman', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/6f8df6b8492a4f8d589d21dd878defe0d0c97097-256x70.png' }, 
    { name: 'R Studio', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/bac06c52a51cb129a7fd208f087bd8cfd45befd7-173x100.png' },
    { name: 'Jafiko light', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/03951d04813db448837410a1ef8c0ed56a071d74-259x69.png' },
    { name: 'Vibro', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/a8b14b944c1a4117eb865c7f95c7207c65c803da-538x141.png' },
    { name: 'Russkiy les', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/a73e842fb9e17341b1dafb4f7558c6cb9525b62d-537x99.png' },
    { name: 'Rahimov School', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/f0bd19cd92e27f45f3db5494628bf0df8755ce2a-220x101.png' },
    { name: 'Doctor Herbal', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/ce13a1989e90a24704e6060b0f1d1e61a5acab97-485x201.png' },
    { name: 'Doctor Fresh', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/960d380dd5d945a7bf1ce656d78a13d9535f0ecd-401x96.png' },
    { name: 'online hamshira', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/30ef7cbd09698b25b80dd14fdbae81e3fe780c10-541x201.png' },
    { name: 'Korsun', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/496fb3ed5037376575d4d38ca45c52c3b15b0e1f-447x101.png' }, 
    { name: 'Petron Polymer', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/b264411a23fb746328c95310b2762cb096f79d22-539x200.png' }, 
    { name: 'Climart', logo: 'https://cdn.sanity.io/images/h6ymmj0v/production/e96949247fc5f9fb4330621333bb85685fab61ae-628x142.png' }, 
];

export const staticTestimonials: Testimonial[] = [
  {
    name: "Ibrohimjon Mahammadjonov",
    company: "Den Aroma asoschisi",
    avatar: "IM",
    image: "https://cdn.sanity.io/images/h6ymmj0v/production/a7036b241bf2b285df4b970561d47b0f5bc41b4f-1074x1909.jpg",
    imageHint: "male founder portrait",
    quote: "",
    videoUrl: "https://player.vimeo.com/video/1145610708?h=e5d8c312d5"
  },
  {
    name: "Sherzod Beknazarov",
    company: "Incontrol Consulting asoschisi",
    avatar: "SB",
    image: "https://cdn.sanity.io/images/h6ymmj0v/production/1cb59ff629f31dd2721b4a978bd2cde4bccf2621-640x640.png",
    imageHint: "male business owner",
    quote: "",
    videoUrl: "https://player.vimeo.com/video/1109892890?badge=0&autopause=0&player_id=0&app_id=58479"
  },
  {
    name: "Sevara Xolmanova",
    company: "Fidda by Sevara asoschisi",
    avatar: "SX",
    image: "https://cdn.sanity.io/images/h6ymmj0v/production/0485c3ac7efb8043632c9bb57db90cca1223fbe0-219x71.png",
    imageHint: "female entrepreneur portrait",
    quote: "Men bu jamoa bn ishlab ko'rdim menga juda yoqdi samarali va natijasi siz kutgandanda A'lo bo'larkan brendlashni xam stikerlash va patenlashni xam berganman 7 oyda aniq boladi Hudo xohlasa Halol ishlarkansilar Allox rozi bo'lsin silardan juda xursand bo'ldim ishilarga rivoj Rahmat."
  },
  {
    name: "Nodirbek",
    company: "Barakah Restoran asoschisi",
    avatar: "N",
    image: "https://placehold.co/400x400/0057ff/ffffff?text=Barakah+Nodirbek",
    imageHint: "restaurant manager portrait",
    quote: "Esingizda bo'lsa, 3 yil oldin shu brendning logosini sizlar ishlab bergandingiz. Sizlarga katta rahmat, ajoyib chiqqan, rostdan hamma maqtayapti. Rahmat katta, Baxtiyor aka! 🤝🏻😊"
  },
  {
    name: "Javohir Haqberdiyev",
    company: "Perfona asoschisi",
    avatar: "JH",
    image: "https://placehold.co/400x400/0057ff/ffffff?text=Perfona+Javohir",
    imageHint: "tech startup founder",
    quote: "Men kutganimdan ham zo'r bo'ldi. Hozir logotipni ko'ryapmanda o'zim ham mazza qilyapman. Menga yoqqan tomoni ishonch bo'ldi. Keyin muddatdan oldin topshirilgani juda zo'r bo'ldi. Tez natijalar bilan bo'lishganiz zo'r bo'ldi. Rahmat aka kattakon!"
  },
];

export const staticTestimonialsRu: Testimonial[] = [
  {
    name: "Иброхимжон Махаммаджонов",
    company: "Основатель Den Aroma",
    avatar: "ИМ",
    image: "https://cdn.sanity.io/images/h6ymmj0v/production/a7036b241bf2b285df4b970561d47b0f5bc41b4f-1074x1909.jpg",
    imageHint: "male founder portrait",
    quote: "",
    videoUrl: "https://player.vimeo.com/video/1145610708?h=e5d8c312d5"
  },
  {
    name: "Шерзод Бекназаров",
    company: "Основатель Incontrol Consulting",
    avatar: "ШБ",
    image: "https://cdn.sanity.io/images/h6ymmj0v/production/1cb59ff629f31dd2721b4a978bd2cde4bccf2621-640x640.png",
    imageHint: "male business owner",
    quote: "",
    videoUrl: "https://player.vimeo.com/video/1109892890?badge=0&autopause=0&player_id=0&app_id=58479"
  },
  {
    name: "Севара Холманова",
    company: "Основательница Fidda by Sevara",
    avatar: "СХ",
    image: "https://cdn.sanity.io/images/h6ymmj0v/production/0485c3ac7efb8043632c9bb57db90cca1223fbe0-219x71.png",
    imageHint: "female entrepreneur portrait",
    quote: "Я работала с этой командой, мне очень понравилось. Эффективно, и результат превзошел все ожидания. Я заказывала и брендинг, и стикеры, и патентование. Через 7 месяцев, даст Бог, все будет готово. Вы работаете честно, да будет доволен вами Аллах. Я очень рада, успехов в вашей работе. Спасибо."
  },
  {
    name: "Нодирбек",
    company: "Основатель ресторана Barakah",
    avatar: "Н",
    image: "https://placehold.co/400x400/0057ff/ffffff?text=Barakah+Nodirbek",
    imageHint: "restaurant manager portrait",
    quote: "Если помните, 3 года назад вы разработали логотип для этого бренда. Огромное вам спасибо, получилось великолепно, действительно все хвалят. Большое спасибо, Бахтиёр ака! 🤝🏻😊"
  },
  {
    name: "Джавохир Хакбердиев",
    company: "Основатель Perfona",
    avatar: "ДХ",
    image: "https://placehold.co/400x400/0057ff/ffffff?text=Perfona+Javohir",
    imageHint: "tech startup founder",
    quote: "Получилось даже лучше, чем я ожидал. Сейчас смотрю на логотип и сам наслаждаюсь. Что мне понравилось — это доверие. И то, что сдали раньше срока, было здорово. Отлично, что быстро поделились результатами. Большое спасибо, ака!"
  },
];

export const staticTestimonialsEn: Testimonial[] = [
   {
    name: "Ibrohimjon Mahammadjonov",
    company: "Founder of Den Aroma",
    avatar: "IM",
    image: "https://cdn.sanity.io/images/h6ymmj0v/production/a7036b241bf2b285df4b970561d47b0f5bc41b4f-1074x1909.jpg",
    imageHint: "male founder portrait",
    quote: "",
    videoUrl: "https://player.vimeo.com/video/1145610708?h=e5d8c312d5"
  },
  {
    name: "Sherzod Beknazarov",
    company: "Founder of Incontrol Consulting",
    avatar: "SB",
    image: "https://cdn.sanity.io/images/h6ymmj0v/production/1cb59ff629f31dd2721b4a978bd2cde4bccf2621-640x640.png",
    imageHint: "male business owner",
    quote: "",
    videoUrl: "https://player.vimeo.com/video/1109892890?badge=0&autopause=0&player_id=0&app_id=58479"
  },
  {
    name: "Sevara Kholmanova",
    company: "Founder of Fidda by Sevara",
    avatar: "SK",
    image: "https://cdn.sanity.io/images/h6ymmj0v/production/0485c3ac7efb8043632c9bb57db90cca1223fbe0-219x71.png",
    imageHint: "female entrepreneur portrait",
    quote: "I worked with this team and I really liked it, it was effective and the result was even better than I expected. I ordered branding, stickers, and patenting. In 7 months, God willing, it will be ready. You work honestly, may Allah be pleased with you. I am very happy, success to your work. Thank you."
  },
  {
    name: "Nodirbek",
    company: "Founder of Barakah Restaurant",
    avatar: "N",
    image: "https://placehold.co/400x400/0057ff/ffffff?text=Barakah+Nodirbek",
    imageHint: "restaurant manager portrait",
    quote: "If you remember, 3 years ago you designed the logo for this brand. Thank you so much, it turned out great, everyone really praises it. Thanks a lot, Bakhtiyor aka! 🤝🏻😊"
  },
  {
    name: "Javohir Haqberdiyev",
    company: "Founder of Perfona",
    avatar: "JH",
    image: "https://placehold.co/400x400/0057ff/ffffff?text=Perfona+Javohir",
    imageHint: "tech startup founder",
    quote: "It turned out even better than I expected. I'm looking at the logo now and I'm enjoying it myself. What I liked was the trust. And the fact that it was delivered ahead of schedule was great. It's great that you shared the results quickly. Thanks a lot, aka!"
  },
];


export const projects: Project[] = [
    { 
        brand: "Incontrol", 
        oldImg: "https://cdn.sanity.io/images/h6ymmj0v/production/0b4fa7dd0b430fa8780052e91d3a54e37c65ab56-640x640.jpg", 
        newImg: "https://cdn.sanity.io/images/h6ymmj0v/production/0d186b596c06589c57fc3a2cdcc7fe51458bf69e-3213x1808.png", 
        newHint: "generic restaurant logo", 
        oldHint: "unique restaurant branding",
        galleryImages: []
    },
    { 
        brand: "Barakah", 
        oldImg: "https://cdn.sanity.io/images/h6ymmj0v/production/bd117123129a09c497f28984de3c4fb7e45e4d5c-494x880.png", 
        newImg: "https://cdn.sanity.io/images/h6ymmj0v/production/c02f0468758f0231648b33324f08f7fa8d74ef8d-608x614.png", 
        newHint: "sleek professional branding", 
        oldHint: "outdated branding",
        galleryImages: []
    },
    {
        brand: "Animatsion logolar",
        oldImg: "",
        newImg: "",
        oldHint: "",
        newHint: "",
        galleryImages: [
            { src: 'https://cdn.prod.website-files.com/6732e36be7888a23d003baac/6747f48137e17a98411d6346_LOGO.gif', alt: 'Animatsion logo', hint: 'animated logo', unoptimized: true },
            { src: 'https://cdn.prod.website-files.com/6732e36be7888a23d003baac/67513d8fe1caee5495e0f9bd_ezgif-6-3f24b1faa6.gif', alt: 'Animatsion logo 2', hint: 'gif logo', unoptimized: true }
        ]
    },
    {
        brand: "Brending Identifikatsiyasi",
        oldImg: "",
        newImg: "",
        oldHint: "",
        newHint: "",
        galleryImages: [
            { src: 'https://cdn.sanity.io/images/h6ymmj0v/production/ad4e5b4a2b5e1044accc01c93ab3b837a7b6c408-2570x1729.png', alt: 'Loyiha 4', hint: 'corporate style', unoptimized: false },
            { src: 'https://cdn.sanity.io/images/h6ymmj0v/production/743c9388832fe183504b77f6af795e5416fbce04-2560x1440.jpg', alt: 'Loyiha 5', hint: 'brandbook example', unoptimized: false },
            { src: 'https://cdn.sanity.io/images/h6ymmj0v/production/9a8ad66f616f90f1bab30c9eddf48b9fdb482f25-1280x720.jpg', alt: 'ESVIRO 3D Mockup', hint: '3D product branding', unoptimized: false },
            { src: 'https://cdn.sanity.io/images/h6ymmj0v/production/f4763a990390239063c4cb13fa0f3d4b1446b9e0-2560x1440.jpg', alt: 'Loyiha 7', hint: 'website branding', unoptimized: false },
            { src: 'https://cdn.sanity.io/images/h6ymmj0v/production/34f1114b5b4383f1070b740c4994983fcae671ca-3840x2160.jpg', alt: 'Loyiha 6', hint: 'logo concept', unoptimized: false },
        ]
    },
    { 
        brand: "Fidda by Sevara", 
        oldImg: "https://cdn.sanity.io/images/h6ymmj0v/production/b7aacef76cdd192ebfb1d696cbbaad1ada27e65f-1080x1080.jpg", 
        newImg: "https://cdn.sanity.io/images/h6ymmj0v/production/57184a0fb4221b6295f1547db7bc9a0b16812f15-1080x1080.png", 
        newHint: "modern premium branding", 
        oldHint: "basic branding",
        galleryImages: [],
        hiddenInHero: true
    }
];

// Empty array for Chinese testimonials, can be populated later
export const staticTestimonialsZh: Testimonial[] = [];


import { type Brand, type Project, type Testimonial } from '@/lib/types';

export const staticBrands: Brand[] = [
    { name: 'Sarmilk', logo: 'https://img4.teletype.in/files/36/a0/36a05cc3-f4a4-4592-b025-d4ccf6d9b27f.png' }, 
    { name: 'M-Karim', logo: 'https://img4.teletype.in/files/ff/4e/ff4e4596-2b83-47f2-8fdd-59b36e6df4d5.png' }, 
    { name: 'Prime Fit', logo: 'https://img2.teletype.in/files/95/db/95dbe2db-423e-4df3-a09b-fe76af32ad40.png' }, 
    { name: 'Revo', logo: 'https://img4.teletype.in/files/75/02/7502c144-d092-4e18-9f26-782628ddc49c.png' }, 
    { name: 'To\'maris', logo: 'https://img1.teletype.in/files/8d/2e/8d2ea8a6-a110-4bfa-b726-081ae9d2194a.png' }, 
    { name: 'Aisha Mebel', logo: 'https://img1.teletype.in/files/ce/fb/cefb56b3-cedb-4d9e-8abc-93400078f498.png' }, 
    { name: 'Den Aroma', logo: 'https://img3.teletype.in/files/e2/90/e290fd28-87f2-4175-bc39-f15f945ac215.png' }, 
    { name: 'Velzo', logo: 'https://img1.teletype.in/files/c1/85/c185f779-620e-4ec7-bfe1-1580a000d80a.png' }, 
    { name: 'Bodomchi', logo: 'https://img4.teletype.in/files/ff/50/ff50be41-df24-49fa-95e7-7d50a7840f3e.png' },
    { name: 'Fidda by Sevara', logo: 'https://img4.teletype.in/files/36/31/36315fc2-fcda-4133-86a4-85362a8197ce.png', hiddenInHero: true }, 
    { name: 'Boyarin', logo: 'https://img1.teletype.in/files/c1/05/c105eef2-f611-4004-8cab-aa96752fb767.png' }, 
    { name: 'Viton', logo: 'https://img2.teletype.in/files/9c/fc/9cfc9326-cfdc-4a0f-8262-9a69bdd6f0a2.png' }, 
    { name: 'Ravza Mebel', logo: 'https://img3.teletype.in/files/25/47/2547cc84-f669-43f0-b0a6-93421a65a68a.png' }, 
    { name: 'Dayan Color', logo: 'https://img3.teletype.in/files/e8/8d/e88d7cdc-7351-4c32-9d54-25a8994f3cb6.png' }, 
    { name: 'Bekbazar', logo: 'https://img3.teletype.in/files/e2/3e/e23e22a0-c573-4cda-8d5d-03c5648e16f9.png' }, 
    { name: 'InControl', logo: 'https://img4.teletype.in/files/39/cd/39cdc07a-f3ec-4cb7-abf8-8d80281621c0.png' }, 
    { name: 'Sunnah Products', logo: 'https://img1.teletype.in/files/0f/a6/0fa6fe98-f227-4046-9cfa-6e4114adfc84.png' }, 
    { name: 'Goodwell', logo: 'https://img3.teletype.in/files/ee/42/ee42432f-65c8-4f2a-a982-5f34a469d95b.png' }, 
    { name: 'Perfona', logo: 'https://img1.teletype.in/files/0c/2c/0c2c079a-40f7-4b0e-93f3-87fcf124ea5e.png' }, 
    { name: 'Esviro', logo: 'https://img3.teletype.in/files/a6/97/a6977482-12ab-43e9-a896-74475b97b869.png' }, 
    { name: 'Savod', logo: 'https://img4.teletype.in/files/bd/2e/bd2e4311-fe77-4b14-a784-5409028a305f.png' },
    { name: 'Sherzod Beknazarov', logo: 'https://img3.teletype.in/files/e0/be/e0bef570-3d46-43be-9479-3fb56e64e94f.png' }, 
    { name: 'O\'rman', logo: 'https://img4.teletype.in/files/f1/19/f11904e6-d300-4bd1-b9f0-a1d715eefc96.png' }, 
    { name: 'R Studio', logo: 'https://img2.teletype.in/files/d2/aa/d2aa2d6e-22e7-44c3-a941-6fc441560619.png' },
    { name: 'Jafiko light', logo: 'https://img2.teletype.in/files/16/ff/16ff7f19-7a74-4771-9c78-55b810979273.png' },
    { name: 'Vibro', logo: 'https://img3.teletype.in/files/ec/e4/ece494de-57e9-490d-989b-7aaa5ec5ef19.png' },
    { name: 'Russkiy les', logo: 'https://img1.teletype.in/files/86/d6/86d60b0b-bc17-4125-9f36-abf9c2013242.png' },
    { name: 'Rahimov School', logo: 'https://img3.teletype.in/files/ec/47/ec47862b-c93c-42e8-b13b-c072a9c3ffef.png' },
    { name: 'Doctor Herbal', logo: 'https://img3.teletype.in/files/28/a8/28a8bbe7-39cf-4796-906d-2fe5712d751f.png' },
    { name: 'Doctor Fresh', logo: 'https://img4.teletype.in/files/f6/e1/f6e1a215-6589-4141-a7e1-0d7b3264398e.png' },
    { name: 'online hamshira', logo: 'https://img2.teletype.in/files/d7/30/d730cbeb-390d-4d49-b392-856ef49ce60c.png' },
    { name: 'Korsun', logo: 'https://img4.teletype.in/files/fc/d0/fcd09308-b559-4818-8570-dc078bfa0915.png' }, 
    { name: 'Petron Polymer', logo: 'https://img4.teletype.in/files/bd/fe/bdfe27df-6f78-47a2-8c17-1642dc821a0e.png' }, 
    { name: 'Climart', logo: 'https://img4.teletype.in/files/b5/81/b581c892-50c0-4f9d-a146-17cd32d93597.png' }, 
];

export const staticTestimonials: Testimonial[] = [
  {
    name: "Ibrohimjon Mahammadjonov",
    company: "Den Aroma asoschisi",
    avatar: "IM",
    image: "https://img1.teletype.in/files/4e/d7/4ed7845f-6eeb-4528-894b-07b985d1a0d1.jpeg",
    imageHint: "male founder portrait",
    quote: "",
    videoUrl: "https://player.vimeo.com/video/1145610708?h=e5d8c312d5"
  },
  {
    name: "Sherzod Beknazarov",
    company: "Incontrol Consulting asoschisi",
    avatar: "SB",
    image: "https://img2.teletype.in/files/1e/f7/1ef7f7bb-55a7-4247-af0d-71216446a0a1.png",
    imageHint: "male business owner",
    quote: "",
    videoUrl: "https://player.vimeo.com/video/1109892890?badge=0&autopause=0&player_id=0&app_id=58479"
  },
  {
    name: "Sevara Xolmanova",
    company: "Fidda by Sevara asoschisi",
    avatar: "SX",
    image: "https://img4.teletype.in/files/36/31/36315fc2-fcda-4133-86a4-85362a8197ce.png",
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
    image: "https://img1.teletype.in/files/4e/d7/4ed7845f-6eeb-4528-894b-07b985d1a0d1.jpeg",
    imageHint: "male founder portrait",
    quote: "",
    videoUrl: "https://player.vimeo.com/video/1145610708?h=e5d8c312d5"
  },
  {
    name: "Шерзод Бекназаров",
    company: "Основатель Incontrol Consulting",
    avatar: "ШБ",
    image: "https://img2.teletype.in/files/1e/f7/1ef7f7bb-55a7-4247-af0d-71216446a0a1.png",
    imageHint: "male business owner",
    quote: "",
    videoUrl: "https://player.vimeo.com/video/1109892890?badge=0&autopause=0&player_id=0&app_id=58479"
  },
  {
    name: "Севара Холманова",
    company: "Основательница Fidda by Sevara",
    avatar: "СХ",
    image: "https://img4.teletype.in/files/36/31/36315fc2-fcda-4133-86a4-85362a8197ce.png",
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
    image: "https://img1.teletype.in/files/4e/d7/4ed7845f-6eeb-4528-894b-07b985d1a0d1.jpeg",
    imageHint: "male founder portrait",
    quote: "",
    videoUrl: "https://player.vimeo.com/video/1145610708?h=e5d8c312d5"
  },
  {
    name: "Sherzod Beknazarov",
    company: "Founder of Incontrol Consulting",
    avatar: "SB",
    image: "https://img2.teletype.in/files/1e/f7/1ef7f7bb-55a7-4247-af0d-71216446a0a1.png",
    imageHint: "male business owner",
    quote: "",
    videoUrl: "https://player.vimeo.com/video/1109892890?badge=0&autopause=0&player_id=0&app_id=58479"
  },
  {
    name: "Sevara Kholmanova",
    company: "Founder of Fidda by Sevara",
    avatar: "SK",
    image: "https://img4.teletype.in/files/36/31/36315fc2-fcda-4133-86a4-85362a8197ce.png",
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
        oldImg: "https://img1.teletype.in/files/83/47/83479180-eeb6-4e39-9169-c4f4fb22e375.jpeg", 
        newImg: "https://img2.teletype.in/files/17/9c/179c7811-8cf7-4ee9-87ad-66709208b115.png", 
        newHint: "generic restaurant logo", 
        oldHint: "unique restaurant branding",
        galleryImages: []
    },
    { 
        brand: "Barakah", 
        oldImg: "https://img2.teletype.in/files/55/fe/55fe2252-db0f-4fd2-8ee8-d674bffab68a.png", 
        newImg: "https://img2.teletype.in/files/dc/5c/dc5cd481-115e-4d57-ac2a-3ea3142e5f54.png", 
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
            { src: 'https://img1.teletype.in/files/84/db/84dbe512-edc1-4386-a986-29114e8d8be2.png', alt: 'Loyiha 4', hint: 'corporate style', unoptimized: false },
            { src: 'https://img1.teletype.in/files/84/76/8476f287-2ba0-4164-898a-d2d7c353a27e.jpeg', alt: 'Loyiha 5', hint: 'brandbook example', unoptimized: false },
            { src: 'https://img1.teletype.in/files/81/55/8155bf93-39f5-45b3-b996-55115f926e79.jpeg', alt: 'ESVIRO 3D Mockup', hint: '3D product branding', unoptimized: false },
            { src: 'https://img2.teletype.in/files/19/49/1949747d-4381-489d-87bf-753a9fac573a.jpeg', alt: 'Loyiha 7', hint: 'website branding', unoptimized: false },
            { src: 'https://img1.teletype.in/files/83/c2/83c2c300-af89-482e-8052-15189ac22aff.jpeg', alt: 'Loyiha 6', hint: 'logo concept', unoptimized: false },
        ]
    },
    { 
        brand: "Fidda by Sevara", 
        oldImg: "https://img2.teletype.in/files/9c/66/9c66a85f-486c-4f54-9682-fb4838061ab2.jpeg", 
        newImg: "https://img1.teletype.in/files/c1/27/c1276cf1-3338-47ab-a744-193da4049b4d.png", 
        newHint: "modern premium branding", 
        oldHint: "basic branding",
        galleryImages: [],
        hiddenInHero: true
    }
];

// Empty array for Chinese testimonials, can be populated later
export const staticTestimonialsZh: Testimonial[] = [];

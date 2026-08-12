import { Metadata } from 'next';

interface UmarinPrivacyPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata(props: UmarinPrivacyPageProps): Promise<Metadata> {
  const { lang } = await props.params;
  const safeLang = (['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz');
  const titles: Record<string, string> = {
    uz: 'Maxfiylik Siyosati | Umarin',
    ru: 'Политика Конфиденциальности | Umarin',
    en: 'Privacy Policy | Umarin',
    zh: '隐私政策 | Umarin',
  };
  const descs: Record<string, string> = {
    uz: "Umarin mijozlarining shaxsiy ma'lumotlarini yig'ish, saqlash va himoya qilish qoidalari.",
    ru: 'Правила сбора, хранения и защиты персональных данных клиентов Umarin.',
    en: "Rules for collecting, storing and protecting Umarin customers' personal data.",
    zh: 'Umarin 收集、存储和保护客户个人数据的规则。',
  };
  return {
    title: titles[safeLang] || titles.uz,
    description: descs[safeLang] || descs.uz,
  };
}

const UmarinPrivacyPage = async ({ params }: UmarinPrivacyPageProps) => {
  const { lang } = await params;

  const content: Record<string, { title: string; intro: string; sections: { title: string; text: string }[] }> = {
    uz: {
      title: 'Maxfiylik Siyosati',
      intro: "Umarin mijozlarining maxfiyligi va ma'lumotlari xavfsizligini birinchi o'ringa qo'yadi. Ushbu hujjat biz qanday ma'lumotlarni to'plashimiz va ulardan qanday foydalanishimizni tushuntiradi.",
      sections: [
        { title: "1. Ma'lumotlarni yig'ish", text: "Buyurtma berish yoki biz bilan bog'lanish jarayonida sizning ismingiz, telefon raqamingiz, yashash shahringiz va buyurtma tafsilotlari (mahsulot, yetkazib berish manzili va h.k.) to'planadi." },
        { title: "2. Ma'lumotlardan foydalanish", text: "Yig'ilgan ma'lumotlar faqatgina siz bilan bog'lanish, buyurtmangizni rasmiylashtirish va yetkazib berish uchun ishlatiladi." },
        { title: "3. Maxfiylik kafolati", text: "Sizning shaxsiy ma'lumotlaringiz hech qachon uchinchi shaxslarga sotilmaydi, ijaraga berilmaydi yoki topshirilmaydi." },
        { title: "4. Texnik xavfsizlik", text: "Ma'lumotlaringizni himoya qilish uchun zamonaviy texnik va tashkiliy choralarni qo'llaymiz." },
        { title: "5. Ma'lumotlarni saqlash muddati", text: "Ma'lumotlar faqat buyurtma va mijozlar bilan aloqa maqsadida, zarur bo'lgan muddat davomida saqlanadi." },
        { title: "6. Aloqa", text: "Maxfiylik siyosati bo'yicha savollaringiz bo'lsa, biz bilan bog'lanishingiz mumkin." },
      ],
    },
    ru: {
      title: 'Политика Конфиденциальности',
      intro: 'Umarin ставит конфиденциальность и безопасность данных клиентов на первое место. Этот документ объясняет, какую информацию мы собираем и как её используем.',
      sections: [
        { title: '1. Сбор информации', text: 'При оформлении заказа или обращении к нам мы собираем ваше имя, номер телефона, город проживания и детали заказа (товар, адрес доставки и т.д.).' },
        { title: '2. Использование информации', text: 'Собранные данные используются только для связи с вами, оформления и доставки заказа.' },
        { title: '3. Гарантия конфиденциальности', text: 'Ваши личные данные никогда не продаются, не передаются и не сдаются в аренду третьим лицам.' },
        { title: '4. Техническая безопасность', text: 'Мы применяем современные технические и организационные меры для защиты ваших данных.' },
        { title: '5. Срок хранения данных', text: 'Данные хранятся только в течение срока, необходимого для обработки заказов и связи с клиентами.' },
        { title: '6. Контакты', text: 'По вопросам политики конфиденциальности вы можете связаться с нами.' },
      ],
    },
    en: {
      title: 'Privacy Policy',
      intro: "Umarin prioritises the confidentiality and security of our customers' data. This document explains what information we collect and how we use it.",
      sections: [
        { title: '1. Information Collection', text: 'When placing an order or contacting us, we collect your name, phone number, city of residence, and order details (product, delivery address, etc.).' },
        { title: '2. Use of Information', text: 'Collected data is used solely to contact you and to process and deliver your order.' },
        { title: '3. Confidentiality Guarantee', text: 'Your personal data is never sold, rented or transferred to third parties.' },
        { title: '4. Technical Security', text: 'We use modern technical and organisational measures to protect your data.' },
        { title: '5. Data Retention', text: 'Data is retained only for as long as necessary to process orders and communicate with customers.' },
        { title: '6. Contact', text: 'If you have questions about this privacy policy, you can contact us.' },
      ],
    },
    zh: {
      title: '隐私政策',
      intro: 'Umarin 将客户的隐私和数据安全放在首位。本文档说明我们收集哪些信息以及如何使用。',
      sections: [
        { title: '1. 信息收集', text: '在下单或联系我们时，我们会收集您的姓名、电话号码、所在城市以及订单详情（产品、收货地址等）。' },
        { title: '2. 信息使用', text: '收集的数据仅用于与您联系以及处理和配送订单。' },
        { title: '3. 保密保证', text: '您的个人数据绝不会出售、出租或转让给第三方。' },
        { title: '4. 技术安全', text: '我们采用现代技术和管理措施保护您的数据。' },
        { title: '5. 数据保留期限', text: '数据仅在处理订单和与客户沟通所需的期限内保留。' },
        { title: '6. 联系方式', text: '如有隐私政策问题，欢迎与我们联系。' },
      ],
    },
  };

  const c = content[lang as keyof typeof content] || content.uz;

  return (
    <div className="min-h-screen bg-brand-paper pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-black tracking-tight mb-6">{c.title}</h1>
        <p className="text-muted-foreground mb-12 leading-relaxed">{c.intro}</p>
        <div className="space-y-10">
          {c.sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-xl font-bold mb-3">{section.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{section.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UmarinPrivacyPage;

import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';

interface PrivacyPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata(props: PrivacyPageProps): Promise<Metadata> {
  const { lang } = await props.params;
  const safeLang = (['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz') as Locale;
  const titles: Record<string, string> = {
    uz: 'Maxfiylik Siyosati | Jon.Branding',
    ru: 'Политика Конфиденциальности | Jon.Branding',
    en: 'Privacy Policy | Jon.Branding',
    zh: '隐私政策 | Jon.Branding',
  };
  const descs: Record<string, string> = {
    uz: 'Jon.Branding agentligida shaxsiy ma\'lumotlarni yig\'ish, saqlash va himoya qilish qoidalari.',
    ru: 'Правила сбора, хранения и защиты персональных данных в агентстве Jon.Branding.',
    en: 'Rules for collecting, storing and protecting personal data at Jon.Branding agency.',
    zh: 'Jon.Branding 机构收集、存储和保护个人数据的规则。',
  };
  return {
    title: titles[safeLang] || titles.uz,
    description: descs[safeLang] || descs.uz,
    openGraph: { title: titles[safeLang], description: descs[safeLang] },
    twitter: { card: 'summary_large_image', title: titles[safeLang], description: descs[safeLang] },
  };
}

const PrivacyPage = async ({ params }: PrivacyPageProps) => {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);

  const content: Record<string, { intro: string; sections: { title: string; text: string }[] }> = {
    uz: {
      intro: "Jon.Branding Agency mijozlarimizning maxfiyligi va ma'lumotlari xavfsizligini birinchi o'ringa qo'yadi. Ushbu hujjat biz qanday ma'lumotlarni to'plashimiz va ulardan qanday foydalanishimizni tushuntiradi.",
      sections: [
        { title: "1. Ma'lumotlarni yig'ish", text: "Biz bilan bog'lanish shakli orqali taqdim etilgan ism, telefon raqami, Telegram foydalanuvchi nomi va loyihangiz haqidagi ma'lumotlarni to'playmiz." },
        { title: "2. Ma'lumotlardan foydalanish", text: "Yig'ilgan ma'lumotlar faqatgina siz bilan bog'lanish, xizmat ko'rsatish shartnomalarini rasmiylashtirish va loyiha jarayonini muvofiqlashtirish uchun xizmat qiladi." },
        { title: "3. Maxfiylik kafolati", text: "Sizning shaxsiy ma'lumotlaringiz hech qachon uchinchi shaxslarga sotilmaydi, ijaraga berilmaydi yoki topshirilmaydi." },
        { title: "4. Texnik xavfsizlik", text: "Ma'lumotlaringizni himoya qilish uchun zamonaviy texnik va tashkiliy choralarni qo'llaymiz." },
        { title: "5. Cookie fayllari", text: "Veb-saytimiz tashrif statistikasini yig'ish va xizmat sifatini yaxshilash uchun cookie fayllaridan foydalanadi. Boshqa shaxsiy ma'lumotlarni kuzatmaymiz." },
        { title: "6. Aloqa", text: "Agar maxfiylik siyosatimiz haqida savollaringiz bo'lsa, +998336450097 yoki Telegram @jonbranding orqali bog'lanishingiz mumkin." }
      ]
    },
    ru: {
      intro: "Jon.Branding Agency ставит конфиденциальность и безопасность данных клиентов на первое место. Этот документ объясняет, какую информацию мы собираем и как используем.",
      sections: [
        { title: "1. Сбор информации", text: "Мы собираем имя, номер телефона, имя пользователя Telegram и информацию о проекте, предоставленные через форму связи." },
        { title: "2. Использование информации", text: "Собранные данные используются только для связи с вами, оформления договоров и координации проекта." },
        { title: "3. Гарантия конфиденциальности", text: "Ваши личные данные никогда не продаются, не передаются и не сдаются в аренду третьим лицам." },
        { title: "4. Техническая безопасность", text: "Мы применяем современные технические и организационные меры для защиты ваших данных." },
        { title: "5. Файлы cookie", text: "Наш сайт использует cookie для сбора статистики посещений и улучшения качества обслуживания." },
        { title: "6. Контакты", text: "По вопросам политики конфиденциальности: +998336450097 или Telegram @jonbranding." }
      ]
    },
    en: {
      intro: "Jon.Branding Agency prioritises the confidentiality and security of our clients' data. This document explains what information we collect and how we use it.",
      sections: [
        { title: "1. Information Collection", text: "We collect name, phone number, Telegram username and project details provided via our contact form." },
        { title: "2. Use of Information", text: "Collected data is used solely to contact you, formalise agreements and coordinate the project." },
        { title: "3. Confidentiality Guarantee", text: "Your personal data is never sold, rented or transferred to third parties." },
        { title: "4. Technical Security", text: "We use modern technical and organisational measures to protect your data." },
        { title: "5. Cookies", text: "Our website uses cookies to collect visit statistics and improve service quality." },
        { title: "6. Contact", text: "For privacy policy questions: +998336450097 or Telegram @jonbranding." }
      ]
    },
    zh: {
      intro: "Jon.Branding 机构将客户的隐私和数据安全放在首位。本文档说明我们收集哪些信息以及如何使用。",
      sections: [
        { title: "1. 信息收集", text: "我们通过联系表格收集姓名、电话号码、Telegram 用户名和项目详情。" },
        { title: "2. 信息使用", text: "收集的数据仅用于与您联系、签订协议和协调项目。" },
        { title: "3. 保密保证", text: "您的个人数据绝不会出售、出租或转让给第三方。" },
        { title: "4. 技术安全", text: "我们采用现代技术和管理措施保护您的数据。" },
        { title: "5. Cookie 文件", text: "我们的网站使用 cookie 收集访问统计信息并改善服务质量。" },
        { title: "6. 联系方式", text: "如有隐私政策问题：+998336450097 或 Telegram @jonbranding。" }
      ]
    }
  };

  const c = content[lang as keyof typeof content] || content.uz;

  return (
    <div className="min-h-screen bg-brand-paper pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-black tracking-tight mb-6">
          {lang === 'uz' ? 'Maxfiylik Siyosati' : lang === 'ru' ? 'Политика Конфиденциальности' : lang === 'zh' ? '隐私政策' : 'Privacy Policy'}
        </h1>
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

export default PrivacyPage;

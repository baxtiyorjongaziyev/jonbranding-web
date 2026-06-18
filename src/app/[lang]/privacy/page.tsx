import type { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';

const BASE_URL = 'https://www.jonbranding.uz';

const VALID_LOCALES = ['uz', 'ru', 'en', 'zh'];
const isSafePathSegment = (value: string) => /^[a-z]{2}$/i.test(value) && VALID_LOCALES.includes(value);

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const safeLang = isSafePathSegment(lang) ? lang : 'uz';
  const titles: Record<string, string> = {
    uz: 'Maxfiylik siyosati | Jon.Branding',
    ru: 'Политика конфиденциальности | Jon.Branding',
    en: 'Privacy Policy | Jon.Branding',
    zh: '隐私政策 | Jon.Branding',
  };
  return {
    title: titles[safeLang] || titles.uz,
    alternates: {
      canonical: `${BASE_URL}/${safeLang}/privacy`,
      languages: {
        uz: `${BASE_URL}/uz/privacy`,
        ru: `${BASE_URL}/ru/privacy`,
        en: `${BASE_URL}/en/privacy`,
        zh: `${BASE_URL}/zh/privacy`,
        'x-default': `${BASE_URL}/uz/privacy`,
      },
    },
    robots: { index: true, follow: true },
  };
}

interface PrivacyPageProps {
  params: Promise<{
    lang: string;
  }>;
}

const PrivacyPage = async ({ params }: PrivacyPageProps) => {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);

  const content = {
    uz: {
      intro: "Jon.Branding Agency mijozlarimizning maxfiyligi va ma'lumotlari xavfsizligini birinchi o'ringa qo'yadi. Ushbu hujjat biz qanday ma'lumotlarni to'plashimiz va ulardan qanday foydalanishimizni tushuntiradi.",
      sections: [
        {
          title: "1. Ma'lumotlarni yig'ish",
          text: "Biz bilan bog'lanish shakli orqali taqdim etilgan ism, telefon raqami, Telegram foydalanuvchi nomi va loyihangiz haqidagi ma'lumotlarni to'playmiz."
        },
        {
          title: "2. Ma'lumotlardan foydalanish",
          text: "Yig'ilgan ma'lumotlar faqatgina siz bilan bog'lanish, xizmat ko'rsatish shartnomalarini rasmiylashtirish va loyiha jarayonini muvofiqlashtirish uchun xizmat qiladi."
        },
        {
          title: "3. Maxfiylik kafolati",
          text: "Sizning shaxsiy ma'lumotlaringiz hech qachon uchinchi shaxslarga sotilmaydi, ijaraga berilmaydi yoki topshirilmaydi."
        },
        {
          title: "4. Texnik xavfsizlik",
          text: "Veb-saytimizda ma'lumotlar almashinuvi SSL xavfsizlik protokoli orqali himoyalangan."
        }
      ]
    },
    en: {
      intro: "Jon.Branding Agency prioritizes the privacy and data security of our clients. This document explains how we collect and use your information.",
      sections: [
        {
          title: "1. Data Collection",
          text: "We collect names, phone numbers, Telegram usernames, and project details submitted through our contact forms."
        },
        {
          title: "2. Use of Information",
          text: "Collected data is used solely for reaching out to you, formalizing service agreements, and coordinating the project workflow."
        },
        {
          title: "3. Privacy Guarantee",
          text: "Your personal data will never be sold, rented, or shared with third parties."
        },
        {
          title: "4. Technical Security",
          text: "Data exchange on our website is protected via SSL security protocols."
        }
      ]
    },
    ru: {
      intro: "Агентство Jon.Branding уделяет первостепенное внимание конфиденциальности и безопасности данных наших клиентов. В этом документе объясняется, как мы собираем и используем вашу информацию.",
      sections: [
        {
          title: "1. Сбор данных",
          text: "Мы собираем имена, номера телефонов, никнеймы в Telegram и детали проекта, отправленные через наши формы обратной связи."
        },
        {
          title: "2. Использование информации",
          text: "Собранные данные используются исключительно для связи с вами, оформления договоров об оказании услуг и координации рабочего процесса по проекту."
        },
        {
          title: "3. Гарантия конфиденциальности",
          text: "Ваши личные данные никогда не будут проданы, сданы в аренду или переданы третьим лицам."
        },
        {
          title: "4. Техническая безопасность",
          text: "Обмен данными на нашем сайте защищен протоколами безопасности SSL."
        }
      ]
    },
    zh: {
      intro: 'Jon.Branding Agency 将客户的隐私和数据安全放在首位。本文件说明我们如何收集和使用您的信息。',
      sections: [
        {
          title: '1. 数据收集',
          text: '我们通过联系表单收集您提交的姓名、电话号码、Telegram 用户名及项目详情。'
        },
        {
          title: '2. 信息使用',
          text: '收集的数据仅用于与您联系、签订服务合同及协调项目工作流程。'
        },
        {
          title: '3. 隐私保证',
          text: '您的个人数据绝不会被出售、出租或转让给第三方。'
        },
        {
          title: '4. 技术安全',
          text: '我们网站上的数据交换通过 SSL 安全协议进行保护。'
        }
      ]
    }
  };

  const currentContent = content[lang as keyof typeof content] || content.en;

  return (
    <main className="min-h-screen pt-32 pb-20 bg-black text-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
          {dictionary.footer.privacy_policy_link}
        </h1>
        
        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            {currentContent.intro}
          </p>
          
          <div className="grid gap-10">
            {currentContent.sections.map((section, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors group">
                <h2 className="text-2xl font-semibold mb-4 text-white group-hover:text-blue-400 transition-colors">
                  {section.title}
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  {section.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPage;

import { FC } from 'react';
import { getDictionary, Locale } from '@/lib/dictionaries';

interface PrivacyPageProps {
  params: {
    lang: string;
  };
}

const PrivacyPage: FC<PrivacyPageProps> = async ({ params }) => {
  const { lang } = params;
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

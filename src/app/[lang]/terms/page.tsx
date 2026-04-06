import { FC } from 'react';
import { getDictionary, Locale } from '@/lib/dictionaries';

interface TermsPageProps {
  params: {
    lang: string;
  };
}

const TermsPage: FC<TermsPageProps> = async ({ params }) => {
  const { lang } = params;
  const dictionary = await getDictionary(lang as Locale);

  const content = {
    uz: {
      intro: "Jon.Branding Agency xizmatlaridan foydalanishda siz quyidagi shartlarni qabul qilasiz. Biz shaffoflik va professional hamkorlik tarafdorimiz.",
      sections: [
        {
          title: "1. Xizmat ko'rsatish",
          text: "Agentlik brending, logotip dizayni, strategiya va boshqa xizmatlarni taqdim etishi mumkin. Har bir loyiha alohida shartnoma yoki kelishuv asosida amalga oshiriladi."
        },
        {
          title: "2. Intellektual mulk",
          text: "Barcha yaratilgan ma'lumotlar va dizayn loyihalari to'liq to'lovdan so'ng buyurtmachiga topshiriladi. Agentlik o'z ishlarini portfolio sifatida ko'rsatish huquqini o'zida saqlab qoladi."
        },
        {
          title: "3. Mijoz mas'uliyati",
          text: "Mijoz loyiha uchun taqdim etgan barcha ma'lumotlarning to'g'riligi va qonuniyligi uchun mas'uldir."
        },
        {
          title: "4. Shartlarni o'zgartirish",
          text: "Agentlik ushbu shartlarni istalgan vaqtda ogohlantirmasdan o'zgartirish huquqiga ega."
        }
      ]
    },
    en: {
      intro: "By using Jon.Branding Agency services, you accept the following terms. We stand for transparency and professional collaboration.",
      sections: [
        {
          title: "1. Service Delivery",
          text: "The Agency provides branding, logo design, strategy, and other services. Each project is carried out based on a separate contract or agreement."
        },
        {
          title: "2. Intellectual Property",
          text: "All created assets and design projects are handed over to the client after full payment. The Agency retains the right to showcase its work in its portfolio."
        },
        {
          title: "3. Client Responsibility",
          text: "The client is responsible for the accuracy and legality of all information provided for the project."
        },
        {
          title: "4. Modification of Terms",
          text: "The Agency reserves the right to modify these terms at any time without prior notice."
        }
      ]
    },
    ru: {
      intro: "Используя услуги агентства Jon.Branding, вы принимаете следующие условия. Мы выступаем за прозрачность и профессиональное сотрудничество.",
      sections: [
        {
          title: "1. Предоставление услуг",
          text: "Агентство предоставляет услуги по брендингу, дизайну логотипов, стратегии и другие услуги. Каждый проект выполняется на основании отдельного договора или соглашения."
        },
        {
          title: "2. Интеллектуальная собственность",
          text: "Все созданные активы и дизайн-проекты передаются заказчику после полной оплаты. Агентство оставляет за собой право демонстрировать свои работы в своем портфолио."
        },
        {
          title: "3. Ответственность клиента",
          text: "Клиент несет ответственность за точность и законность всей информации, предоставленной для проекта."
        },
        {
          title: "4. Изменение условий",
          text: "Агентство оставляет за собой право изменять эти условия в любое время без предварительного уведомления."
        }
      ]
    }
  };

  const currentContent = content[lang as keyof typeof content] || content.en;

  return (
    <main className="min-h-screen pt-32 pb-20 bg-black text-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
          {dictionary.footer.terms_of_use_link}
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

export default TermsPage;

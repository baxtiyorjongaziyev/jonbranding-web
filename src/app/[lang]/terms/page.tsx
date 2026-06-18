import type { Metadata } from 'next';
import { getLocalizedAbsoluteUrl, getLocaleAlternates } from '@/lib/i18n/locale';

const BASE_URL = 'https://www.jonbranding.uz';

const VALID_LOCALES = ['uz', 'ru', 'en', 'zh'];
const isSafePathSegment = (value: string) => VALID_LOCALES.includes(value);

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const safeLang = isSafePathSegment(lang) ? lang : 'uz';
  const titles: Record<string, string> = {
    uz: 'Foydalanish shartlari | Jon.Branding',
    ru: 'Условия использования | Jon.Branding',
    en: 'Terms of Service | Jon.Branding',
    zh: '服务条款 | Jon.Branding',
  };
  return {
    title: titles[safeLang] || titles.uz,
    alternates: {
      canonical: getLocalizedAbsoluteUrl(BASE_URL, safeLang as any, '/terms'),
      languages: getLocaleAlternates(BASE_URL, '/terms'),
    },
    robots: { index: true, follow: true },
  };
}

interface TermsPageProps {
  params: Promise<{
    lang: string;
  }>;
}

const TermsPage = async ({ params }: TermsPageProps) => {
  const { lang } = await params;
  const safeLang = isSafePathSegment(lang) ? lang : 'uz';

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
    },
    zh: {
      intro: '使用 Jon.Branding Agency 服务即表示您接受以下条款。我们倡导透明度和专业合作。',
      sections: [
        {
          title: '1. 服务提供',
          text: '该机构提供品牌建设、标志设计、战略及其他服务。每个项目均基于单独的合同或协议执行。'
        },
        {
          title: '2. 知识产权',
          text: '全额付款后，所有创作资产和设计项目将移交给客户。该机构保留在其作品集中展示其作品的权利。'
        },
        {
          title: '3. 客户责任',
          text: '客户对为项目提供的所有信息的准确性和合法性负责。'
        },
        {
          title: '4. 条款修改',
          text: '该机构保留随时修改这些条款而无需事先通知的权利。'
        }
      ]
    }
  };

  const currentContent = content[safeLang as keyof typeof content];

  return (
    <main className="min-h-screen pt-32 pb-20 bg-black text-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
          {{ uz: 'Foydalanish shartlari', ru: 'Условия использования', en: 'Terms of Service', zh: '服务条款' }[safeLang as 'uz' | 'ru' | 'en' | 'zh']}
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

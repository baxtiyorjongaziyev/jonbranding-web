import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/dictionaries';

interface TermsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata(props: TermsPageProps): Promise<Metadata> {
  const { lang } = await props.params;
  const safeLang = (['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz') as Locale;
  const titles: Record<string, string> = {
    uz: 'Foydalanish Shartlari | Jon.Branding',
    ru: 'Условия Использования | Jon.Branding',
    en: 'Terms of Service | Jon.Branding',
    zh: '服务条款 | Jon.Branding',
  };
  const descs: Record<string, string> = {
    uz: 'Jon.Branding agentligi xizmatlaridan foydalanish shartlari — shaffof va professional hamkorlik.',
    ru: 'Условия использования услуг агентства Jon.Branding — прозрачное и профессиональное сотрудничество.',
    en: 'Terms of use for Jon.Branding agency services — transparent and professional cooperation.',
    zh: 'Jon.Branding 机构服务使用条款 — 透明、专业的合作。',
  };
  return {
    title: titles[safeLang] || titles.uz,
    description: descs[safeLang] || descs.uz,
    openGraph: { title: titles[safeLang], description: descs[safeLang] },
    twitter: { card: 'summary_large_image', title: titles[safeLang], description: descs[safeLang] },
  };
}

const TermsPage = async ({ params }: TermsPageProps) => {
  const { lang } = await params;
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
          text: "Agentlik ushbu shartlarni istalgan vaqtda o'zgartirish huquqiga ega. O'zgarishlar sahifada e'lon qilingan paytdan boshlab kuchga kiradi."
        },
        {
          title: "5. Aloqa ma'lumotlari",
          text: "Savol yoki e'tirozlar bo'lsa, biz bilan +998336450097 yoki Telegram @jonbranding orqali bog'lanishingiz mumkin."
        }
      ]
    },
    ru: {
      intro: "Используя услуги Jon.Branding Agency, вы соглашаетесь со следующими условиями. Мы за прозрачное и профессиональное сотрудничество.",
      sections: [
        { title: "1. Оказание услуг", text: "Агентство предоставляет услуги брендинга, дизайна логотипов, стратегии и другие. Каждый проект осуществляется на основе отдельного договора." },
        { title: "2. Интеллектуальная собственность", text: "Все созданные материалы передаются клиенту после полной оплаты. Агентство сохраняет право демонстрировать работы в портфолио." },
        { title: "3. Ответственность клиента", text: "Клиент несет ответственность за достоверность и законность предоставленной информации." },
        { title: "4. Изменение условий", text: "Агентство имеет право изменять условия в любое время. Изменения вступают в силу с момента публикации." },
        { title: "5. Контакты", text: "По вопросам обращайтесь: +998336450097 или Telegram @jonbranding." }
      ]
    },
    en: {
      intro: "By using Jon.Branding Agency services, you agree to the following terms. We believe in transparent and professional cooperation.",
      sections: [
        { title: "1. Service Provision", text: "The agency provides branding, logo design, strategy and other services. Each project is carried out under a separate contract." },
        { title: "2. Intellectual Property", text: "All created materials are transferred to the client after full payment. The agency retains the right to display work in its portfolio." },
        { title: "3. Client Responsibility", text: "The client is responsible for the accuracy and legality of all provided information." },
        { title: "4. Terms Changes", text: "The agency reserves the right to change these terms at any time. Changes take effect upon publication." },
        { title: "5. Contact", text: "For questions: +998336450097 or Telegram @jonbranding." }
      ]
    },
    zh: {
      intro: "使用 Jon.Branding 机构服务即表示您同意以下条款。我们主张透明、专业的合作。",
      sections: [
        { title: "1. 服务提供", text: "本机构提供品牌、标志设计、战略等服务。每个项目均根据单独合同执行。" },
        { title: "2. 知识产权", text: "所有创作材料在全额付款后移交给客户。机构保留在作品集中展示作品的权利。" },
        { title: "3. 客户责任", text: "客户对所提供信息的准确性和合法性负责。" },
        { title: "4. 条款变更", text: "本机构有权随时修改这些条款。修改自发布之日起生效。" },
        { title: "5. 联系方式", text: "如有疑问，请联系：+998336450097 或 Telegram @jonbranding。" }
      ]
    }
  };

  const c = content[lang as keyof typeof content] || content.uz;

  return (
    <div className="min-h-screen bg-brand-paper pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-black tracking-tight mb-6">
          {lang === 'uz' ? 'Foydalanish Shartlari' : lang === 'ru' ? 'Условия Использования' : lang === 'zh' ? '服务条款' : 'Terms of Service'}
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

export default TermsPage;

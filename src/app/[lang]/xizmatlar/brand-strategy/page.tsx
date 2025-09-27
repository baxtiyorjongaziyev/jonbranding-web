'use client';

import { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Search, Target, Pencil, Send } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ServiceSections = dynamic(() => import('@/components/sections/service-sections'), {
    loading: () => <Skeleton className="h-96 w-full mt-4" />,
});

const WhyUs = dynamic(() => import('@/components/sections/why-us'), {
    loading: () => <Skeleton className="h-96 w-full mt-4" />,
});

const t = {
    uz: {
        title: "Brend Strategiyasi",
        subtitle: "Kuchli brend — bu ilhomlantiradigan, birlashtiradigan va biznesning o'sishiga yordam beradigan aniq g'oya.",
        section1_title: "Brend-strategiya — bu biznesning o'sish vositasi",
        section1_p1: "Har bir shuhratparast kompaniyaning o'z maqsadlari bor. Kimdir uchun bu bozorda ma'lum bir o'rinni egallash bo'lsa, boshqalar uchun o'zlari haqidagi bilim darajasi, yangi hududlarga kengayish va hokazo bo'lishi mumkin.",
        section1_p2: "Brend strategiyasi — kompaniyaning ushbu maqsadlarga erishishiga, shunchaki tovar yoki xizmat bo'lib qolmasdan, balki undan ham kattaroq narsaga — o'z mijozlari va xaridorlarining hayotining bir qismiga aylanishiga, taniqli obrazni olib yurishiga yordam beradigan narsadir.",
        section1_p3: "Eng muhimi, bu marketing xarajatlarini tizimlashtirishga, kompaniyaning pozitsiyasini qo'llab-quvvatlamaydigan va shuning uchun xarajatlarga loyiq bo'lmagan vositalar, kanallar va g'oyalardan voz kechishga imkon beradi.",
        section2_title: "Brend-strategiya har qanday biznesga kerak",
        section2_p1: "Brend strategiyasi ham yangi, ham uzoq vaqtdan beri mavjud bo'lgan kompaniyalarga kerak.",
        section2_p2_key: "Startaplarga",
        section2_p2_val: "u boshidanoq o'z missiyasi, qadriyatlari va o'ziga xosligini aniqlashga, bozorda kerakli o'rinni egallashga va mijozlarni jalb qilishga yordam beradi.",
        section2_p3_key: "Yirik kompaniyalar uchun",
        section2_p3_val: "strategiya — bu o'sish va obro'ni boshqarish vositasidir. Bunday holda u dolzarblikni saqlashga, o'zgarishlarga moslashishga va auditoriya bilan mustahkam munosabatlar o'rnatishga yordam beradi.",
        section2_p4: "Biznes hajmidan qat'i nazar, brend-strategiya asosiy savolga javob beradi: mijoz nima uchun aynan sizni tanlashi kerak?",
        process_title: "Brending — bu jarayon",
        process_subtitle: "Bizning agentligimizda biz brendingning logotip yaratishdan ko'ra ko'proq narsa ekanligiga aminmiz. Brending — bu bir martalik vazifa emas, balki davriy jarayondir. Har bir bosqich o'zining asosiy rolini o'ynaydi va ulardan birortasini o'tkazib yuborish brendni va uning bozordagi o'rnini zaiflashtirishi mumkin. Ammo agar hamma narsa to'g'ri va izchil bajarilsa, brending biznesning o'sishiga va mahsulot ishlab chiqarishdan tortib marketinggacha bo'lgan ko'plab jarayonlarni osonroq boshqarishga yordam beradi.",
        process_steps: [
            { icon: Search, title: "Tahlil va tadqiqot", description: "Bu bozor, raqobatchilar va auditoriya haqida ma'lumotlar to'planadigan birinchi va eng muhim bosqichdir. Busiz brendning o'ziga xosligini aniqlash va uning maqsadli auditoriyasini tushunish mumkin emas. Tahlilni o'tkazib yuborish real sharoitlarda ishlamaydigan samarasiz strategiyaga olib keladi." },
            { icon: Target, title: "Brend platformasini shakllantirish", description: "Bu yerda brendning missiyasi, qadriyatlari va o'ziga xos taklifi tug'iladi - bu uning xarakteri va ovozini belgilaydigan asosdir. Aniq platformasiz barcha keyingi harakatlar bir-biriga bog'liq bo'lmagan va ishonchsiz bo'lish xavfi mavjud." },
            { icon: FileText, title: "Strategiyani ishlab chiqish", description: "Strategiya brendning auditoriya bilan qanday aloqada bo'lishi va qaysi kanallar orqali muloqot qilishiga javob beradi. Bu muloqotni tizimlashtiradi, uni maqsadli va samarali qiladi. Ushbu bosqichning o'tkazib yuborilishi tartibsiz harakatlarga va imijning xiralashishiga olib keladi." },
            { icon: Pencil, title: "Vizual identifikatsiya", description: "Brend ma'nolarini vizual tilga o'tkazish - logotip, ranglar, shriftlar va grafik elementlar. Bu brendni taniqli va raqobatchilardan farqli qiladi. Identifikatsiyasiz brend o'z yuzini yo'qotadi." },
            { icon: Send, title: "Amalga oshirish va joriy etish", description: "Brendni yaratish - bu faqat boshlanishi. U korporativ madaniyat va mijozlar bilan muloqotning bir qismiga aylanishi uchun uni kompaniyaga va aloqa nuqtalariga to'g'ri joriy etish muhimdir." }
        ],
    },
    ru: {
        title: "Бренд-стратегия",
        subtitle: "Сильный бренд — это четкая идея, которая вдохновляет, объединяет и помогает бизнесу расти.",
        section1_title: "Бренд-стратегия — это инструмент роста бизнеса",
        section1_p1: "У каждой амбициозной компании есть свои цели. Для кого-то это завоевание определенной доли рынка, для других — уровень узнаваемости, расширение на новые территории и так далее.",
        section1_p2: "Бренд-стратегия — это то, что помогает компании достичь этих целей, стать не просто товаром или услугой, а чем-то большим — частью жизни своих клиентов и покупателей, носителем узнаваемого образа.",
        section1_p3: "Самое главное, это позволяет систематизировать маркетинговые расходы, отказаться от инструментов, каналов и идей, которые не поддерживают позиционирование компании, а значит, не заслуживают затрат.",
        section2_title: "Бренд-стратегия нужна любому бизнесу",
        section2_p1: "Бренд-стратегия нужна как новым, так и давно существующим компаниям.",
        section2_p2_key: "Стартапам",
        section2_p2_val: "она помогает с самого начала определить свою миссию, ценности и уникальность, занять нужную нишу на рынке и привлечь клиентов.",
        section2_p3_key: "Для крупных компаний",
        section2_p3_val: "стратегия — это инструмент роста и управления репутацией. В этом случае она помогает сохранять актуальность, адаптироваться к изменениям и строить прочные отношения с аудиторией.",
        section2_p4: "Независимо от размера бизнеса, бренд-стратегия отвечает на главный вопрос: почему клиент должен выбрать именно вас?",
        process_title: "Брендинг — это процесс",
        process_subtitle: "В нашем агентстве мы уверены, что брендинг — это нечто большее, чем просто создание логотипа. Брендинг — это не разовая задача, а циклический процесс. Каждый этап играет свою ключевую роль, и пропуск любого из них может ослабить бренд и его позиции на рынке. Но если все сделано правильно и последовательно, брендинг помогает бизнесу расти и легче управлять многими процессами, от производства продукта до маркетинга.",
        process_steps: [
            { icon: Search, title: "Анализ и исследование", description: "Это первый и самый важный этап, на котором собираются данные о рынке, конкурентах и аудитории. Без этого невозможно определить уникальность бренда и понять его целевую аудиторию. Пропуск анализа приведет к неэффективной стратегии, которая не будет работать в реальных условиях." },
            { icon: Target, title: "Формирование платформы бренда", description: "Здесь рождается миссия, ценности и уникальное предложение бренда — это основа, которая определяет его характер и голос. Без четкой платформы все последующие действия рискуют быть несвязанными и неубедительными." },
            { icon: FileText, title: "Разработка стратегии", description: "Стратегия отвечает на вопрос, как бренд будет взаимодействовать с аудиторией и через какие каналы общаться. Это систематизирует коммуникацию, делая ее целенаправленной и эффективной. Пропуск этого этапа приводит к хаотичным действиям и размыванию имиджа." },
            { icon: Pencil, title: "Визуальная идентификация", description: "Перевод смыслов бренда на визуальный язык — логотип, цвета, шрифты и графические элементы. Это делает бренд узнаваемым и отличным от конкурентов. Без идентификации бренд теряет свое лицо." },
            { icon: Send, title: "Реализация и внедрение", description: "Создание бренда — это только начало. Важно правильно внедрить его в компанию и точки контакта, чтобы он стал частью корпоративной культуры и общения с клиентами." }
        ],
    }
};

const BrandStrategyPage: FC<{ params: { lang: string } }> = ({ params }) => {
  const { lang } = params;

  const handleOpenModal = () => {
    const contactEvent = new CustomEvent('openContactModal');
    window.dispatchEvent(contactEvent);
  };
  
  const translations = lang === 'ru' ? t.ru : t.uz;

  return (
    <>
        <main className="flex-grow pt-20">
            <section className="py-20 sm:py-28 bg-white">
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-dark-blue">
                {translations.title}
                </h1>
                <p className="mx-auto mt-6 max-w-3xl text-lg md:text-xl text-gray-700">
                {translations.subtitle}
                </p>
            </div>
            </section>

        <section className="py-16 sm:py-24">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">{translations.section1_title}</h2>
                        <div className="mt-4 space-y-4 text-lg text-gray-700">
                        <p>{translations.section1_p1}</p>
                        <p>{translations.section1_p2}</p>
                        <p className="font-bold text-dark-blue">{translations.section1_p3}</p>
                        </div>
                    </div>
                    <div className="lg:order-last">
                        <Card className="shadow-xl rounded-2xl">
                            <CardContent className="p-0">
                            <Image 
                                src="https://img2.teletype.in/files/d3/40/d3406311-28bc-4c55-bf19-19aa3f17e306.png"
                                alt="Business growth strategy chart"
                                width={800}
                                height={600}
                                className="rounded-2xl object-cover"/>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>

        <section className="py-16 sm:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className="lg:order-last">
                        <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">{translations.section2_title}</h2>
                        <div className="mt-4 space-y-4 text-lg text-gray-700">
                            <p>{translations.section2_p1}</p>
                            <p><span className="font-bold text-dark-blue">{translations.section2_p2_key}</span> {translations.section2_p2_val}</p>
                            <p><span className="font-bold text-dark-blue">{translations.section2_p3_key}</span> {translations.section2_p3_val}</p>
                            <p className="font-bold text-dark-blue">{translations.section2_p4}</p>
                        </div>
                    </div>
                    <div>
                        <Card className="shadow-xl rounded-2xl overflow-hidden">
                           <Image 
                                src="https://img4.teletype.in/files/bd/d7/bdd7f837-5be9-47eb-9a9e-43dafefe5a17.png"
                                alt="Startup team brainstorming brand strategy"
                                width={800}
                                height={600}
                                data-ai-hint="startup team meeting"
                                className="object-cover aspect-square"/>
                        </Card>
                    </div>
                </div>
            </div>
        </section>

        <section className="py-16 sm:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold">{translations.process_title}</h2>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-700">
                        {translations.process_subtitle}
                    </p>
                </div>
                <div className="mt-16 flex flex-wrap justify-center gap-8">
                    {translations.process_steps.map((step, index) => (
                    <Card key={index} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.5rem)] text-center shadow-lg rounded-2xl bg-white transform hover:-translate-y-2 transition-transform duration-300">
                        <CardContent className="p-8">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
                                <step.icon className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-dark-blue">{step.title}</h3>
                            <p className="mt-2 text-gray-600">{step.description}</p>
                        </CardContent>
                    </Card>
                    ))}
                </div>
            </div>
        </section>
        <WhyUs onCtaClick={handleOpenModal} lang={lang} />
        </main>
        <ServiceSections lang={lang} />
    </>
  );
};

export default BrandStrategyPage;

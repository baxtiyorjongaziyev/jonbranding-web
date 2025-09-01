
import { FC } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Search, Target, Pencil, Send } from 'lucide-react';
import Link from 'next/link';

const processSteps = [
  {
    icon: Search,
    title: "Tahlil va tadqiqot",
    description: "Bu bozor, raqobatchilar va auditoriya haqida ma'lumotlar to'planadigan birinchi va eng muhim bosqichdir. Busiz brendning o'ziga xosligini aniqlash va uning maqsadli auditoriyasini tushunish mumkin emas. Tahlilni o'tkazib yuborish real sharoitlarda ishlamaydigan samarasiz strategiyaga olib keladi."
  },
  {
    icon: Target,
    title: "Brend platformasini shakllantirish",
    description: "Bu yerda brendning missiyasi, qadriyatlari va o'ziga xos taklifi tug'iladi - bu uning xarakteri va ovozini belgilaydigan asosdir. Aniq platformasiz barcha keyingi harakatlar bir-biriga bog'liq bo'lmagan va ishonchsiz bo'lish xavfi mavjud."
  },
  {
    icon: FileText,
    title: "Strategiyani ishlab chiqish",
    description: "Strategiya brendning auditoriya bilan qanday aloqada bo'lishi va qaysi kanallar orqali muloqot qilishiga javob beradi. Bu muloqotni tizimlashtiradi, uni maqsadli va samarali qiladi. Ushbu bosqichning o'tkazib yuborilishi tartibsiz harakatlarga va imijning xiralashishiga olib keladi."
  },
  {
    icon: Pencil,
    title: "Vizual identifikatsiya",
    description: "Brend ma'nolarini vizual tilga o'tkazish - logotip, ranglar, shriftlar va grafik elementlar. Bu brendni taniqli va raqobatchilardan farqli qiladi. Identifikatsiyasiz brend o'z yuzini yo'qotadi."
  },
  {
    icon: Send,
    title: "Amalga oshirish va joriy etish",
    description: "Brendni yaratish - bu faqat boshlanishi. U korporativ madaniyat va mijozlar bilan muloqotning bir qismiga aylanishi uchun uni kompaniyaga va aloqa nuqtalariga to'g'ri joriy etish muhimdir."
  },
];


const BrandStrategyPage: FC = () => {

  const handleOpenModal = () => {
    // Dummy function for header. This page won't open a modal directly.
    // A potential implementation could scroll to a contact section if one existed.
  };

  return (
    <div className="flex min-h-screen flex-col bg-secondary/50">
      <Header onContactClick={handleOpenModal} />
      <main className="flex-grow">
        <section className="py-20 sm:py-28 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-dark-blue">
              Brend Strategiyasi
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg md:text-xl text-gray-700">
             Kuchli brend — bu ilhomlantiradigan, birlashtiradigan va biznesning o'sishiga yordam beradigan aniq g'oya.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-24">
            <div className="container mx-auto px-4">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">Brend-strategiya — bu biznesning o'sish vositasi</h2>
                        <div className="mt-4 space-y-4 text-lg text-gray-700">
                        <p>
                            Har bir shuhratparast kompaniyaning o'z maqsadlari bor. Kimdir uchun bu bozorda ma'lum bir o'rinni egallash bo'lsa, boshqalar uchun o'zlari haqidagi bilim darajasi, yangi hududlarga kengayish va hokazo bo'lishi mumkin.
                        </p>
                        <p>
                           Brend strategiyasi — kompaniyaning ushbu maqsadlarga erishishiga, shunchaki tovar yoki xizmat bo'lib qolmasdan, balki undan ham kattaroq narsaga — o'z mijozlari va xaridorlarining hayotining bir qismiga aylanishiga, taniqli obrazni olib yurishiga yordam beradigan narsadir.
                        </p>
                         <p className="font-bold text-dark-blue">
                           Eng muhimi, bu marketing xarajatlarini tizimlashtirishga, kompaniyaning pozitsiyasini qo'llab-quvvatlamaydigan va shuning uchun xarajatlarga loyiq bo'lmagan vositalar, kanallar va g'oyalardan voz kechishga imkon beradi.
                        </p>
                        </div>
                    </div>
                     <div className="lg:order-last">
                        <Card className="shadow-xl rounded-2xl">
                           <CardContent className="p-8">
                            <img src="https://picsum.photos/800/600" data-ai-hint="strategy flowchart" alt="Strategiya sxemasi" className="rounded-lg object-cover"/>
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
                        <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">Brend-strategiya har qanday biznesga kerak</h2>
                         <div className="mt-4 space-y-4 text-lg text-gray-700">
                        <p>
                            Brend strategiyasi ham yangi, ham uzoq vaqtdan beri mavjud bo'lgan kompaniyalarga kerak.
                        </p>
                        <p>
                           <span className="font-bold text-dark-blue">Startaplarga</span> u boshidanoq o'z missiyasi, qadriyatlari va o'ziga xosligini aniqlashga, bozorda kerakli o'rinni egallashga va mijozlarni jalb qilishga yordam beradi.
                        </p>
                        <p>
                           <span className="font-bold text-dark-blue">Yirik kompaniyalar uchun</span> strategiya — bu o'sish va obro'ni boshqarish vositasidir. Bunday holda u dolzarblikni saqlashga, o'zgarishlarga moslashishga va auditoriya bilan mustahkam munosabatlar o'rnatishga yordam beradi.
                        </p>
                         <p className="font-bold text-dark-blue">
                           Biznes hajmidan qat'i nazar, brend-strategiya asosiy savolga javob beradi: mijoz nima uchun aynan sizni tanlashi kerak?
                        </p>
                        </div>
                    </div>
                    <div>
                        <Card className="shadow-xl rounded-2xl">
                           <CardContent className="p-8">
                             <img src="https://picsum.photos/800/601" data-ai-hint="business owner thinking" alt="Biznes egasi o'ylanmoqda" className="rounded-lg object-cover"/>
                           </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>

         <section className="py-16 sm:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold">Brending — bu jarayon</h2>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-700">
                       Bizning agentligimizda biz brendingning logotip yaratishdan ko'ra ko'proq narsa ekanligiga aminmiz. Brending — bu bir martalik vazifa emas, balki davriy jarayondir. Har bir bosqich o'zining asosiy rolini o'ynaydi va ulardan birortasini o'tkazib yuborish brendni va uning bozordagi o'rnini zaiflashtirishi mumkin. Ammo agar hamma narsa to'g'ri va izchil bajarilsa, brending biznesning o'sishiga va mahsulot ishlab chiqarishdan tortib marketinggacha bo'lgan ko'plab jarayonlarni osonroq boshqarishga yordam beradi.
                    </p>
                </div>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {processSteps.map((step, index) => (
                    <Card key={index} className="text-center shadow-lg rounded-2xl bg-white transform hover:-translate-y-2 transition-transform duration-300">
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
                 <div className="text-center mt-16">
                    <Button asChild size="lg" className="text-lg shadow-ocean animate-subtle-pulse">
                        <Link href="/#package-builder">
                            Strategiyani muhokama qilish
                        </Link>
                    </Button>
                </div>
            </div>
         </section>

      </main>
      <Footer />
    </div>
  );
};

export default BrandStrategyPage;

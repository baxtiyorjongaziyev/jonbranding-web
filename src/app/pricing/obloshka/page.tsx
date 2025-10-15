
import { Metadata } from 'next';
import Link from 'next/link';
import { Check, Mail, Send } from 'lucide-react';
import Script from 'next/script';

// SEO Metadata Generation
export const metadata: Metadata = {
  title: 'Marketplace uchun mahsulot obloşkasi dizayni | Jon Branding',
  description:
    'Sotuvlarni oshiradigan professional mahsulot obloshkasi dizayni. Marketplace uchun START, PRO va PREMIUM tariflar bilan tanishing va buyurtma bering.',
  alternates: {
    canonical: '/pricing/obloshka',
  },
  openGraph: {
    title: 'Marketplace uchun mahsulot obloşkasi dizayni | Jon Branding',
    description: 'Sotuvlarni oshiradigan professional mahsulot obloshkasi dizayni. Marketplace uchun START, PRO va PREMIUM tariflar bilan tanishing.',
    url: 'https://jonbranding.uz/pricing/obloshka',
    type: 'website',
    images: [
      {
        url: 'https://img1.teletype.in/files/48/fb/48fbe9e5-c83d-46da-9425-aa8b8b18d501.jpeg?v=2',
        width: 1200,
        height: 630,
        alt: 'Marketplace uchun mahsulot obloshkasi dizayni',
      },
    ],
  },
};

// Data for pricing tiers
const pricingData = [
  {
    name: 'START',
    price: 300000,
    forWho: 'Yangi joylayotgan yoki test qilayotgan sotuvchilar.',
    includes: [
      '1 ta asosiy obloşka rasm',
      'Lightbox surat asosida ishlov',
      'Rang, matn va foyda qisqacha ko‘rsatiladi',
    ],
    difference: 'Tez tayyorlanadi, soddaligi bilan e’tibor tortadi.',
    discounts: [
      { quantity: '1 dona', price: 300000 },
      { quantity: '3+', price: 270000 },
      { quantity: '5+', price: 250000 },
    ],
  },
  {
    name: 'PRO',
    price: 450000,
    forWho: 'Professional ko‘rinish va ishonch kerak bo‘lgan sotuvchilar.',
    includes: [
      '1 ta asosiy obloşka rasm',
      'Brend ranglari va muvozanatli kompozitsiya',
      'Matn bloklari: foyda, afzallik, xaridga undov',
      'Uzum, Wildberries yoki Ozon formatida tayyor',
    ],
    difference: 'Mahsulot aniq ajralib turadi, ishonch uyg‘otadi.',
    isRecommended: true,
    discounts: [
      { quantity: '1 dona', price: 450000 },
      { quantity: '3+', price: 400000 },
      { quantity: '5+', price: 370000 },
    ],
  },
  {
    name: 'PREMIUM',
    price: 650000,
    forWho: 'Brend obro‘sini oshirish va yuqori konversiya xohlaganlar.',
    includes: [
      '1 ta asosiy obloşka rasm',
      '3D yoki realistik mockup ishlov',
      'Brend muhitida kompozitsiya',
      '2 ta variant (A/B test uchun)',
      'Professional matnlar va CTA’lar',
    ],
    difference: 'Qimmat ko‘rinadi, darrov e’tibor tortadi.',
    discounts: [
      { quantity: '1 dona', price: 650000 },
      { quantity: '3+', price: 600000 },
      { quantity: '5+', price: 550000 },
    ],
  },
];

// Reusable Components
const TierTable = ({
  data,
}: {
  data: { quantity: string; price: number }[];
}) => (
  <div className="w-full mt-4 text-sm text-slate-600">
    <div className="grid grid-cols-2 gap-2 text-center">
      <div className="font-semibold text-slate-700 bg-slate-50 p-2 rounded-t-lg">Miqdor</div>
      <div className="font-semibold text-slate-700 bg-slate-50 p-2 rounded-t-lg">Narx (1 dona)</div>
      {data.map((row, index) => (
        <React.Fragment key={index}>
          <div className="bg-white p-2 border-b border-slate-100">{row.quantity}</div>
          <div className="bg-white p-2 border-b border-slate-100">{row.price.toLocaleString('fr-FR')} so‘m</div>
        </React.Fragment>
      ))}
    </div>
  </div>
);

const PricingCard = ({
  tier,
}: {
  tier: (typeof pricingData)[0];
}) => (
  <div
    className={`w-full rounded-2xl p-8 flex flex-col ${
      tier.isRecommended
        ? 'bg-blue-950 text-white ring-4 ring-blue-500 shadow-2xl'
        : 'bg-white text-slate-900 shadow-lg'
    }`}
  >
    {tier.isRecommended && (
      <div className="text-center mb-4 -mt-2">
        <span className="inline-block bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          Tavsiya etiladi
        </span>
      </div>
    )}
    <h3 className="text-2xl font-bold text-center">{tier.name}</h3>
    <p
      className={`text-center text-sm mt-2 h-12 ${
        tier.isRecommended ? 'text-blue-200' : 'text-slate-500'
      }`}
    >
      {tier.forWho}
    </p>
    <div className="text-center my-6">
      <span className="text-5xl font-extrabold">
        {tier.price.toLocaleString('fr-FR')}
      </span>
      <span
        className={`text-lg font-medium ml-1 ${
          tier.isRecommended ? 'text-blue-300' : 'text-slate-500'
        }`}
      >
        so‘m / dona
      </span>
    </div>
    <div
      className={`flex-grow border-t pt-6 space-y-3 ${
        tier.isRecommended ? 'border-blue-700' : 'border-slate-200'
      }`}
    >
      <p className="font-semibold">Nimalar kiradi:</p>
      <ul className="space-y-2">
        {tier.includes.map((item, i) => (
          <li
            key={i}
            className={`flex items-start gap-3 ${
              tier.isRecommended ? 'text-blue-100' : 'text-slate-600'
            }`}
          >
            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
    <div
      className={`mt-6 pt-6 border-t ${
        tier.isRecommended ? 'border-blue-700' : 'border-slate-200'
      }`}
    >
      <p className="font-semibold">Farqi:</p>
      <p
        className={`mt-2 text-sm ${
          tier.isRecommended ? 'text-blue-200' : 'text-slate-500'
        }`}
      >
        {tier.difference}
      </p>
    </div>
    <div
      className={`mt-6 pt-6 border-t ${
        tier.isRecommended ? 'border-blue-700' : 'border-slate-200'
      }`}
    >
      <p className="font-semibold">Miqdor bo‘yicha chegirma (Alibaba uslubi):</p>
      <TierTable data={tier.discounts} />
    </div>
  </div>
);

// Schema.org JSON-LD Scripts
const ProductSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Marketplace uchun mahsulot obloşkasi dizayni',
  description: 'Sotuvlarni oshiradigan professional mahsulot obloshkasi dizayni. Marketplace uchun START, PRO va PREMIUM tariflar bilan tanishing va buyurtma bering.',
  brand: {
    '@type': 'Brand',
    name: 'Jon Branding',
  },
  offers: {
    '@type': 'OfferCatalog',
    name: 'Obloshka dizayni tariflari',
    itemListElement: pricingData.map((tier) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: `${tier.name} tarifi`,
        description: tier.forWho,
      },
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: tier.price,
        priceCurrency: 'UZS',
        valueAddedTaxIncluded: true,
      },
    })),
  },
};

const FaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Nega faqat obloşka rasm dizayn qilamiz?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Chunki marketplace sotuvlarining 80% birinchi rasmga bog'liq. Biz aynan shu eng muhim nuqtaga e'tibor qaratib, maksimal natija berishni maqsad qilganmiz."
        }
      },
      {
        "@type": "Question",
        "name": "Lightbox suratlar yetarlimi yoki studio kerakmi?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Start va Pro tariflar uchun lightbox suratlar yetarli. Premium tarifda esa mahsulotni yanada jozibador ko'rsatish uchun studiyada olingan professional suratlardan foydalanishni tavsiya etamiz."
        }
      },
      {
        "@type": "Question",
        "name": "Uzum/WB/Ozon o‘lchamlariga moslab berasizmi?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Albatta. Biz har bir marketplace'ning texnik talablarini bilamiz va dizaynni aynan kerakli o'lcham va formatda tayyorlab beramiz."
        }
      },
      {
        "@type": "Question",
        "name": "Seriyali buyurtmada yana chegirma bormi?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ha, 5 donadan ko'p buyurtmalar uchun qo'shimcha individual chegirmalar ko'zda tutilgan. Bu masalani menejer bilan muhokama qilishingiz mumkin."
        }
      }
    ]
  };

export default function ObloshkaPricingPage() {
  return (
    <>
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ProductSchema) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FaqSchema) }}
      />
      <div className="bg-slate-50 min-h-screen text-slate-800">
        <header className="py-12 bg-white border-b border-slate-200">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-950">
              Marketplace uchun mahsulot obloşkasi dizayni
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
              Bitta asosiy sotuvchi rasm – qolganlari oddiy lightbox suratlar bilan.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="https://t.me/baxtiyorjongaziyev"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram orqali buyurtma berish"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                <Send className="w-5 h-5 mr-2" />
                Buyurtma berish (Telegram)
              </Link>
              <Link
                href="mailto:info@jonbranding.uz"
                aria-label="Email orqali so'rov yuborish"
                className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 text-base font-medium rounded-full text-slate-700 bg-white hover:bg-slate-50 transition"
              >
                <Mail className="w-5 h-5 mr-2" />
                Email orqali so‘rov
              </Link>
            </div>
          </div>
        </header>

        <main>
          <section
            id="pricing-tiers"
            aria-labelledby="pricing-title"
            className="py-20"
          >
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                {pricingData.map((tier) => (
                  <PricingCard key={tier.name} tier={tier} />
                ))}
              </div>
            </div>
          </section>

          <section
            id="additional-services"
            aria-labelledby="additional-services-title"
            className="pb-20"
          >
            <div className="container mx-auto px-6">
              <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                <h2 id="additional-services-title" className="text-2xl font-bold text-center text-blue-950">
                  Qo‘shimcha xizmatlar
                </h2>
                <ul className="mt-6 space-y-4 text-slate-600">
                  <li className="flex justify-between items-center">
                    <span>2-variant (A/B test)</span>
                    <span className="font-semibold text-slate-800">+30 %</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>24 soatda tayyor</span>
                    <span className="font-semibold text-slate-800">+25 %</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Manba fayllar (PSD/AI)</span>
                    <span className="font-semibold text-slate-800">+15 %</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section id="faq" aria-labelledby="faq-title" className="pb-20">
            <div className="container mx-auto px-6">
              <div className="max-w-3xl mx-auto">
                <h2 id="faq-title" className="text-3xl font-bold text-center text-blue-950">
                  Ko‘p beriladigan savollar
                </h2>
                <div className="mt-8 space-y-4">
                    <div className="rounded-lg border border-slate-200 bg-white p-4">
                        <h3 className="font-semibold text-slate-800">Nega faqat obloşka rasm dizayn qilamiz?</h3>
                        <p className="text-slate-600 mt-2">Chunki marketplace sotuvlarining 80% birinchi rasmga bog'liq. Biz aynan shu eng muhim nuqtaga e'tibor qaratib, maksimal natija berishni maqsad qilganmiz.</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-4">
                        <h3 className="font-semibold text-slate-800">Lightbox suratlar yetarlimi yoki studio kerakmi?</h3>
                        <p className="text-slate-600 mt-2">Start va Pro tariflar uchun lightbox suratlar yetarli. Premium tarifda esa mahsulotni yanada jozibador ko'rsatish uchun studiyada olingan professional suratlardan foydalanishni tavsiya etamiz.</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-4">
                        <h3 className="font-semibold text-slate-800">Uzum/WB/Ozon o‘lchamlariga moslab berasizmi?</h3>
                        <p className="text-slate-600 mt-2">Albatta. Biz har bir marketplace'ning texnik talablarini bilamiz va dizaynni aynan kerakli o'lcham va formatda tayyorlab beramiz.</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-4">
                        <h3 className="font-semibold text-slate-800">Seriyali buyurtmada yana chegirma bormi?</h3>
                        <p className="text-slate-600 mt-2">Ha, 5 donadan ko'p buyurtmalar uchun qo'shimcha individual chegirmalar ko'zda tutilgan. Bu masalani menejer bilan muhokama qilishingiz mumkin.</p>
                    </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="py-8 bg-white border-t border-slate-200">
          <div className="container mx-auto px-6 text-center text-slate-500">
            <p>&copy; {new Date().getFullYear()} Jon Branding. Barcha huquqlar himoyalangan.</p>
            <p className="text-xs mt-2">
              Ushbu sahifadagi narxlar ommaviy oferta hisoblanmaydi.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

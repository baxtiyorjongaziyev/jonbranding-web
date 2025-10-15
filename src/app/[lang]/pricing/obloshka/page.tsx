
'use client';

import { Metadata } from 'next';
import Link from 'next/link';
import { Check, Send } from 'lucide-react';
import Script from 'next/script';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';


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
    isRecommended: false,
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
    isRecommended: false,
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
  isRecommended,
}: {
  data: { quantity: string; price: number }[];
  isRecommended?: boolean;
}) => (
  <div className={`w-full mt-4 text-sm rounded-lg overflow-hidden border ${isRecommended ? 'border-blue-800' : 'border-slate-200 dark:border-slate-700'}`}>
    <div className={`grid grid-cols-2 text-center ${isRecommended ? 'bg-blue-900/70' : 'bg-slate-50 dark:bg-slate-800'}`}>
      <div className={`font-semibold p-2 border-b border-r ${isRecommended ? 'text-blue-100 border-blue-800' : 'text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'}`}>Miqdor</div>
      <div className={`font-semibold p-2 border-b ${isRecommended ? 'text-blue-100 border-blue-800' : 'text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'}`}>Narx (1 dona)</div>
    </div>
    <div className="grid grid-cols-2 text-center">
      {data.map((row, index) => (
        <React.Fragment key={index}>
          <div className={`p-2 border-r ${isRecommended ? 'border-blue-800' : 'border-slate-200 dark:border-slate-700'} ${index < data.length - 1 ? 'border-b' : ''} ${isRecommended ? 'text-blue-100' : 'text-slate-600 dark:text-slate-300'}`}>{row.quantity}</div>
          <div className={`p-2 ${index < data.length - 1 ? `border-b ${isRecommended ? 'border-blue-800' : 'border-slate-200 dark:border-slate-700'}` : ''} ${isRecommended ? 'text-blue-100' : 'text-slate-600 dark:text-slate-300'}`}>{row.price.toLocaleString('fr-FR')} so‘m</div>
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
    <h3 className={`text-2xl font-bold text-center ${tier.isRecommended ? 'text-white' : 'text-slate-900'}`}>{tier.name}</h3>
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
      <p className="font-semibold">Afzalligi:</p>
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
      <TierTable data={tier.discounts} isRecommended={tier.isRecommended} />
    </div>
    <div className="mt-8">
      <Button asChild className="w-full" variant={tier.isRecommended ? 'default' : 'outline'}>
        <a href="https://t.me/baxtiyorjongaziyev" target="_blank" rel="noopener noreferrer">
          Buyurtma berish <Send className="w-4 h-4 ml-2" />
        </a>
      </Button>
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
        "name": "To'lov tartibi qanday?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Standart to'lov tartibi 50% oldindan to'lov va 50% ish topshirilgandan so'ng. Bu bizga sizning loyihangizni darhol boshlashga va unga kerakli vaqt va resurslarni ajratishga imkon beradi."
        }
      }
    ]
  };

export default function ObloshkaPricingPage() {
  const params = useParams();
  const lang = params.lang;
  
  let translations = {
      uz: {
        title: "Uzum, Yandex Market, WB va Ozon uchun sotuvchi kartochka dizayni",
        subtitle: "Bitta asosiy sotuvchi rasm – qolganlari oddiy lightbox suratlar bilan."
      },
      ru: {
        title: "Продающий дизайн карточек для Uzum, Yandex market, Wildberries и Ozon",
        subtitle: "Одна основная продающая картинка – остальные с обычными лайтбокс-фотографиями."
      },
      en: {
        title: "Sales-Driven Card Design for Uzum, Yandex market, Wildberries & Ozon",
        subtitle: "One main selling image – the rest with standard lightbox photos."
      }
  };

  // @ts-ignore
  const t = translations[lang] || translations.uz;

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
        <main className="bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-200 pt-20">
            <section className="py-12 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-blue-950 dark:text-white">
                    {t.title}
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300">
                    {t.subtitle}
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                    href="#pricing-tiers"
                    aria-label="Paketni tanlash"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition"
                >
                    <Send className="w-5 h-5 mr-2" />
                    Paketni tanlash
                </a>
                </div>
            </div>
            </section>

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
                <div className="max-w-2xl mx-auto bg-white dark:bg-slate-950 rounded-2xl shadow-lg p-8">
                    <h2 id="additional-services-title" className="text-2xl font-bold text-center text-blue-950 dark:text-white">
                    Qo‘shimcha xizmatlar
                    </h2>
                    <ul className="mt-6 space-y-4 text-slate-600 dark:text-slate-300">
                    <li className="flex justify-between items-center gap-4">
                        <div>
                            <span className="font-medium text-slate-700 dark:text-slate-200">1 ta mahsulot uchun 2 xil dizayn varianti (A/B test uchun)</span>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Tanlangan paket narxiga +30% qo'shiladi</p>
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-white whitespace-nowrap">+30 %</span>
                    </li>
                    <li className="flex justify-between items-center gap-4">
                         <div>
                            <span className="font-medium text-slate-700 dark:text-slate-200">24 soatda tezkor tayyorlash</span>
                             <p className="text-xs text-slate-500 dark:text-slate-400">Tanlangan paket narxiga +50% qo'shiladi</p>
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-white whitespace-nowrap">+50 %</span>
                    </li>
                    <li className="flex justify-between items-center gap-4">
                         <div>
                            <span className="font-medium text-slate-700 dark:text-slate-200">Manba fayllar (PSD/AI)</span>
                             <p className="text-xs text-slate-500 dark:text-slate-400">Tanlangan paket narxiga +100% qo'shiladi</p>
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-white whitespace-nowrap">+100 %</span>
                    </li>
                    </ul>
                </div>
                </div>
            </section>

            <section id="faq" aria-labelledby="faq-title" className="pb-20">
                <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 id="faq-title" className="text-3xl font-bold text-center text-blue-950 dark:text-white">
                    Ko‘p beriladigan savollar
                    </h2>
                    <div className="mt-8 space-y-4">
                        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4">
                            <h3 className="font-semibold text-slate-800 dark:text-white">Nega faqat obloşka rasm dizayn qilamiz?</h3>
                            <p className="text-slate-600 dark:text-slate-300 mt-2">Chunki marketplace sotuvlarining 80% birinchi rasmga bog'liq. Biz aynan shu eng muhim nuqtaga e'tibor qaratib, maksimal natija berishni maqsad qilganmiz.</p>
                        </div>
                        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4">
                            <h3 className="font-semibold text-slate-800 dark:text-white">Lightbox suratlar yetarlimi yoki studio kerakmi?</h3>
                            <p className="text-slate-600 dark:text-slate-300 mt-2">Start va Pro tariflar uchun lightbox suratlar yetarli. Premium tarifda esa mahsulotni yanada jozibador ko'rsatish uchun studiyada olingan professional suratlardan foydalanishni tavsiya etamiz.</p>
                        </div>
                        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4">
                            <h3 className="font-semibold text-slate-800 dark:text-white">Uzum/WB/Ozon o‘lchamlariga moslab berasizmi?</h3>
                            <p className="text-slate-600 dark:text-slate-300 mt-2">Albatta. Biz har bir marketplace'ning texnik talablarini bilamiz va dizaynni aynan kerakli o'lcham va formatda tayyorlab beramiz.</p>
                        </div>
                        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4">
                            <h3 className="font-semibold text-slate-800 dark:text-white">To'lov tartibi qanday?</h3>
                            <p className="text-slate-600 dark:text-slate-300 mt-2">Standart to'lov tartibi 50% oldindan to'lov va 50% ish topshirilgandan so'ng. Bu bizga sizning loyihangizni darhol boshlashga va unga kerakli vaqt va resurslarni ajratishga imkon beradi.</p>
                        </div>
                    </div>
                </div>
                </div>
            </section>
        </main>
    </>
  );
}

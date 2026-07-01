'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

// Sotuv taqdimoti uchun maxsus slaydlar
const slides = [
  {
    id: 1,
    title: "Brendingiz qancha pul yo'qotmoqda?",
    subtitle: "Noto'g'ri qadoq, eskirgan logotip va ishonchsiz veb-sayt sababli yuzlab potensial mijozlar har kuni raqobatchilarni tanlamoqda.",
    theme: "dark"
  },
  {
    id: 2,
    title: "Biznesni o'stirish siri — faqat reklamada emas.",
    subtitle: "Siz qanchalik ko'p reklama qilmang, agar mijoz sizning brendingizni ko'rganda «arzon» yoki «ishonchsiz» degan hisni tuysa, pulingiz havoga uchadi.",
    theme: "light"
  },
  {
    id: 3,
    title: "Jon Branding — Premium Brending Agentligi",
    subtitle: "Biz faqatgina \"chiroyli rasm\" chizmaymiz. Biz biznesingizni bozorda to'g'ri joylashtirib (pozitsiyalab), mijoz ko'zida uning qadrini oshiramiz va sotuvlaringizni yengillashtiramiz.",
    theme: "blue"
  },
  {
    id: 4,
    title: "Sizga qanday yordam bera olamiz?",
    features: [
      "Neyming (Kuchli nom tanlash)",
      "Logotip va Firma uslubi (Aydentika)",
      "Premium Qadoq dizayni",
      "Sotuvchi Veb-saytlar"
    ],
    theme: "light"
  },
  {
    id: 5,
    title: "Natija qanday bo'ladi?",
    subtitle: "O'zgartirilgan brend orqali mahsulotingizni bozordagi o'rtacha narxdan 20-30% qimmatroq sotishingiz mumkin, chunki odamlar endi sifatga ishonadi.",
    theme: "dark"
  },
  {
    id: 6,
    title: "Bepul Brand Audit orqali boshlaymiz",
    subtitle: "Hozirgi brendingiz nima uchun sotmayotganini 15 daqiqada tahlil qilib, 3 ta eng muhim muammoni aniqlab beramiz. Hech qanday majburiyatsiz.",
    cta: "Auditga yozilish",
    theme: "blue"
  }
];



export default function PresentationPage() {
  
  // To'liq ekranni bloklash va header/footer ni yopish uchun
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-[var(--at-bg)] overflow-y-scroll snap-y snap-mandatory flex flex-col hide-scrollbar">
      {/* Orqaga qaytish tugmasi */}
      <div className="fixed top-6 left-6 z-[10000]">
        <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-black/10 backdrop-blur-md border border-black/20 text-white mix-blend-difference hover:bg-black/20 transition-all">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </Link>
      </div>

      {slides.map((slide, index) => (
        <section
          key={slide.id}
          className={`
            relative h-[100dvh] w-full flex-shrink-0 snap-start flex flex-col items-center justify-center p-8 md:p-16 text-center
            ${slide.theme === 'dark' ? 'bg-[#0A0A0A] text-white' : ''}
            ${slide.theme === 'light' ? 'bg-[#F2EFE6] text-[#0A0A0A]' : ''}
            ${slide.theme === 'blue' ? 'bg-[#1B4DFF] text-white' : ''}
          `}
        >
          <div className="max-w-[900px] w-full mx-auto flex flex-col items-center justify-center z-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">

            <h1
              className="font-bold mb-8 md:mb-12 font-[family-name:var(--font-hanken)]"
              style={{ fontSize: 'clamp(40px, 6vw, 80px)', lineHeight: 1.1, letterSpacing: '-0.03em' }}
            >
              {slide.title}
            </h1>

            {slide.subtitle && (
              <p className="text-lg md:text-3xl leading-relaxed opacity-90 max-w-[800px] font-[family-name:var(--font-hanken)]">
                {slide.subtitle}
              </p>
            )}

            {slide.features && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-8 font-[family-name:var(--font-hanken)]">
                {slide.features.map((feat, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-black/5 border border-black/10 text-xl md:text-2xl font-medium">
                    {feat}
                  </div>
                ))}
              </div>
            )}

            {slide.cta && (
              <div className="mt-12 font-[family-name:var(--font-hanken)]">
                <Link
                  href="/uz#narxlar"
                  onClick={() => { document.body.style.overflow = 'auto'; }}
                  className="inline-flex items-center justify-center bg-white text-[#1B4DFF] rounded-full px-12 py-6 font-bold text-xl md:text-2xl hover:scale-105 transition-transform"
                >
                  {slide.cta}
                </Link>
              </div>
            )}

          </div>

          {/* Scroll indikatori */}
          {index !== slides.length - 1 && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
            </div>
          )}
        </section>
      ))}

      {/* Hide Scrollbar style */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}

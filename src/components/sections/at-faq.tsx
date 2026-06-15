'use client';
import { useState } from 'react';

const faqs = [
  { q: "Brend tashxisi — bu aniq nima?", a: "Bu — sizning brendingizni 12 mezon bo'yicha professional tekshirish. Logotip, pozitsiya, qadoq, sayt, huquqiy himoya — barchasi ko'rib chiqiladi. Natijada 30—50 betlik hisobot, baholar, yo'qotilayotgan daromad hisobi va 90 kunlik harakat rejasi olasiz." },
  { q: "Bu tashxis menga kerakmi? Biznesim ishlayapti.", a: "Aynan shu sabab kerak. Ishlayotgan biznesda har bir foiz o'sish katta pul. Tashxis — bu ko'rinmas yo'qotishlarni topish. O'rtacha mijozlarimiz auditdan keyin 2—4 hafta ichida birinchi natijani ko'radi." },
  { q: "Bepul tashxis bilan to'liqning farqi nima?", a: "Bepul — 30 daqiqalik suhbat va eng katta 3 ta zaif nuqtani aytib beramiz. To'liq tashxis — 14 kun davomida 12 mezon bo'yicha chuqur tahlil, raqamlar, PDF hisobot va prezentatsiya." },
  { q: "Tashxis qancha vaqt oladi?", a: "Bepul — 30 daqiqa. To'liq tashxis — materiallarni yuborganingizdan 14 kun ichida. Strategik paket — 4 hafta. Kechikgan kunlar uchun 10% chegirma." },
  { q: "Tashxisdan keyin sizdan rebrending buyurtma qilish shartmi?", a: "Yo'q. Tashxis — alohida xizmat. Hisobotni olasiz, o'zingiz qaror qabul qilasiz. Boshqa studiyaga olib borishingiz yoki o'z jamoangiz bilan qilishingiz mumkin." },
  { q: "To'lov qanday va kafolat bormi?", a: "To'lov: Payme, Click yoki bank o'tkazmasi. 50% boshida, 50% prezentatsiyada. Kafolat: foydali tavsiya topilmasa — 100% pulni qaytaramiz. 6 yilda 0 ta holat." },
];

export default function AtFaq() {
  const [open, setOpen] = useState<number>(0);
  return (
    <section className="py-16 md:py-24" id="savol" style={{ background: 'var(--at-bg)' }}>
      <div className="max-w-[1320px] mx-auto px-8 sm:px-5">
        <div className="grid md:grid-cols-[280px_1fr] gap-12 md:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 mb-5" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--at-muted)' }}>
              <span className="at-pulse inline-block w-1.5 h-1.5 rounded-full" style={{ background: 'var(--at-green)' }} />
              <span style={{ color: 'var(--at-ink)', fontWeight: 500 }}>§ 07</span>
              Savol-javob
            </span>
            <h2 className="font-bold leading-none mb-5" style={{ fontSize: 'clamp(36px, 4.4vw, 64px)', letterSpacing: '-0.035em', color: 'var(--at-ink)' }}>
              Tez-tez<br /><span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--at-accent)' }}>so&apos;raladi.</span>
            </h2>
            <p style={{ color: 'var(--at-ink-2)', fontSize: 15, lineHeight: 1.65, maxWidth: 280 }}>Javob topa olmadingizmi? Yozing — jamoamiz 24 soat ichida javob beradi.</p>
            <a href="mailto:salom@jonbranding.uz" className="inline-flex items-center gap-2 mt-6 font-semibold text-sm rounded-full px-4 py-3" style={{ border: '1px solid var(--at-line)', background: 'var(--at-paper)', color: 'var(--at-ink)' }}>
              salom@jonbranding.uz <span style={{ color: 'var(--at-accent)' }}>↗</span>
            </a>
          </div>
          <div className="flex flex-col" style={{ borderTop: '1px solid var(--at-line)' }}>
            {faqs.map((f,i)=>(
              <div key={i} style={{ borderBottom: i < faqs.length - 1 ? '1px solid var(--at-line)' : 'none' }}>
                <button className="w-full flex items-start gap-4 py-5 text-left" onClick={()=>setOpen(open===i?-1:i)}>
                  <span className="shrink-0 w-7 text-sm" style={{ fontFamily: 'var(--font-mono)', color: 'var(--at-muted)' }}>{String(i+1).padStart(2,'0')}</span>
                  <h3 className="flex-1 font-semibold text-base" style={{ color: 'var(--at-ink)' }}>{f.q}</h3>
                  <span className="shrink-0 text-xl leading-none transition-transform duration-200" style={{ color: 'var(--at-muted)', transform: open===i?'rotate(45deg)':'none' }}>+</span>
                </button>
                <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: open===i?'400px':'0', opacity: open===i?1:0 }}>
                  <p className="pl-11 pb-5 text-sm leading-relaxed" style={{ color: 'var(--at-ink-2)' }}>{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

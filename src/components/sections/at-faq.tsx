'use client';
import { useState } from 'react';

type Lang = 'uz' | 'ru' | 'en' | 'zh';
interface Props { lang?: string; }

const t = {
  uz: {
    sectionN: '§ 07',
    label: 'Savol-javob',
    heading: 'Tez-tez',
    headingEm: "so'raladi.",
    note: "Javob topa olmadingizmi? Yozing — jamoamiz 24 soat ichida javob beradi.",
    faqs: [
      { q: "Brend tashxisi — bu aniq nima?", a: "Bu — sizning brendingizni 12 mezon bo'yicha professional tekshirish. Logotip, pozitsiya, qadoq, sayt, huquqiy himoya — barchasi ko'rib chiqiladi. Natijada 30—50 betlik hisobot, baholar, yo'qotilayotgan daromad hisobi va 90 kunlik harakat rejasi olasiz." },
      { q: "Bu tashxis menga kerakmi? Biznesim ishlayapti.", a: "Aynan shu sabab kerak. Ishlayotgan biznesda har bir foiz o'sish katta pul. Tashxis — bu ko'rinmas yo'qotishlarni topish. O'rtacha mijozlarimiz auditdan keyin 2—4 hafta ichida birinchi natijani ko'radi." },
      { q: "Bepul tashxis bilan to'liqning farqi nima?", a: "Bepul — 30 daqiqalik suhbat va eng katta 3 ta zaif nuqtani aytib beramiz. To'liq tashxis — 14 kun davomida 12 mezon bo'yicha chuqur tahlil, raqamlar, PDF hisobot va prezentatsiya." },
      { q: "Tashxis qancha vaqt oladi?", a: "Bepul — 30 daqiqa. To'liq tashxis — materiallarni yuborganingizdan 14 kun ichida. Strategik paket — 4 hafta. Kechikgan kunlar uchun 10% chegirma." },
      { q: "Tashxisdan keyin sizdan rebrending buyurtma qilish shartmi?", a: "Yo'q. Tashxis — alohida xizmat. Hisobotni olasiz, o'zingiz qaror qabul qilasiz. Boshqa studiyaga olib borishingiz yoki o'z jamoangiz bilan qilishingiz mumkin." },
      { q: "To'lov qanday va kafolat bormi?", a: "To'lov: Payme, Click yoki bank o'tkazmasi. 50% boshida, 50% prezentatsiyada. Kafolat: foydali tavsiya topilmasa — 100% pulni qaytaramiz. 6 yilda 0 ta holat." },
    ],
  },
  ru: {
    sectionN: '§ 07',
    label: 'FAQ',
    heading: 'Часто',
    headingEm: 'спрашивают.',
    note: 'Не нашли ответ? Напишите — команда ответит в течение 24 часов.',
    faqs: [
      { q: 'Что такое бренд-диагностика?', a: 'Профессиональная проверка вашего бренда по 12 критериям: логотип, позиционирование, упаковка, сайт, правовая защита. Результат: отчёт 30–50 страниц, оценки, расчёт упущенной прибыли и план действий на 90 дней.' },
      { q: 'Зачем мне диагностика, если бизнес работает?', a: 'Именно поэтому она нужна. В работающем бизнесе каждый процент роста — это большие деньги. Диагностика помогает найти скрытые потери. В среднем наши клиенты видят первые результаты через 2–4 недели после аудита.' },
      { q: 'Чем бесплатная диагностика отличается от полной?', a: 'Бесплатная — 30 минут разговора и 3 главные слабые точки. Полная — глубокий анализ по 12 критериям за 14 дней, цифры, PDF-отчёт и презентация.' },
      { q: 'Сколько времени занимает диагностика?', a: 'Бесплатная — 30 минут. Полная — 14 дней с момента отправки материалов. Стратегический пакет — 4 недели. За каждый день просрочки — 10% скидка.' },
      { q: 'Обязательно ли потом заказывать ребрендинг у вас?', a: 'Нет. Диагностика — отдельная услуга. Получаете отчёт и принимаете решение сами. Можно обратиться в другую студию или сделать с собственной командой.' },
      { q: 'Как оплата и есть ли гарантия?', a: 'Оплата: Payme, Click или банковский перевод. 50% предоплата, 50% на презентации. Гарантия: если полезных рекомендаций не найдено — 100% возврат. За 6 лет — 0 случаев.' },
    ],
  },
  en: {
    sectionN: '§ 07',
    label: 'FAQ',
    heading: 'Frequently',
    headingEm: 'asked.',
    note: "Can't find an answer? Write to us — our team replies within 24 hours.",
    faqs: [
      { q: 'What exactly is a brand diagnosis?', a: 'A professional review of your brand across 12 criteria: logo, positioning, packaging, website, legal protection. You get a 30–50 page report, scores, lost revenue calculation, and a 90-day action plan.' },
      { q: "Do I need a diagnosis if my business is working fine?", a: 'That\'s exactly why you need it. In a working business, every percent of growth is serious money. A diagnosis finds invisible losses. On average, our clients see first results 2–4 weeks after the audit.' },
      { q: "What's the difference between free and full diagnosis?", a: "Free — a 30-minute conversation and the 3 biggest weak points. Full diagnosis — deep analysis across 12 criteria over 14 days, numbers, PDF report, and a presentation." },
      { q: 'How long does the diagnosis take?', a: 'Free — 30 minutes. Full diagnosis — 14 days from when you send materials. Strategic package — 4 weeks. 10% discount for each day of delay on our end.' },
      { q: 'Do I have to order a rebrand from you afterwards?', a: 'No. The diagnosis is a standalone service. You get the report and decide yourself. You can take it to another studio or implement it with your own team.' },
      { q: 'What are the payment terms and is there a guarantee?', a: 'Payment: Payme, Click, or bank transfer. 50% upfront, 50% at presentation. Guarantee: if no useful recommendations found — 100% refund. 0 cases in 6 years.' },
    ],
  },
  zh: {
    sectionN: '§ 07',
    label: '常见问题',
    heading: '常见',
    headingEm: '问题。',
    note: '没找到答案？给我们写信——团队24小时内回复。',
    faqs: [
      { q: '品牌诊断究竟是什么？', a: '对您的品牌进行12项标准的专业审查：标志、定位、包装、网站、法律保护。您将获得30–50页报告、评分、损失收入计算和90天行动计划。' },
      { q: '如果我的生意运转良好，我还需要诊断吗？', a: '正是如此。在一个运转良好的企业中，每一个百分点的增长都是大钱。诊断找出隐形损失。平均而言，我们的客户在审计后2–4周内看到第一个结果。' },
      { q: '免费诊断和完整诊断有什么区别？', a: '免费——30分钟对话和最大的3个弱点。完整诊断——14天内对12项标准进行深入分析、数字、PDF报告和演示。' },
      { q: '诊断需要多长时间？', a: '免费——30分钟。完整诊断——从发送材料起14天。战略套餐——4周。我方每延误一天给予10%折扣。' },
      { q: '之后必须向你们订购重新品牌化吗？', a: '不需要。诊断是独立服务。您获得报告，自己做决定。可以去另一家工作室或与自己的团队实施。' },
      { q: '付款方式和有保证吗？', a: '付款：Payme、Click或银行转账。50%预付款，50%在演示时。保证：如果没有找到有用的建议——100%退款。6年内0案例。' },
    ],
  },
} as const;

export default function AtFaq({ lang = 'uz' }: Props) {
  const [open, setOpen] = useState<number>(0);
  const l = t[(lang as Lang) in t ? (lang as Lang) : 'uz'];

  return (
    <section className="py-16 md:py-24" id="savol" style={{ background: 'var(--at-bg)' }}>
      <div className="max-w-[1320px] mx-auto px-8 sm:px-5">
        <div className="grid md:grid-cols-[280px_1fr] gap-12 md:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 mb-5" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--at-muted)' }}>
              <span className="at-pulse inline-block w-1.5 h-1.5 rounded-full" style={{ background: 'var(--at-green)' }} />
              <span style={{ color: 'var(--at-ink)', fontWeight: 500 }}>{l.sectionN}</span>
              {l.label}
            </span>
            <h2 className="font-bold leading-none mb-5" style={{ fontSize: 'clamp(36px, 4.4vw, 64px)', letterSpacing: '-0.035em', color: 'var(--at-ink)' }}>
              {l.heading}<br /><span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--at-accent)' }}>{l.headingEm}</span>
            </h2>
            <p style={{ color: 'var(--at-ink-2)', fontSize: 15, lineHeight: 1.65, maxWidth: 280 }}>{l.note}</p>
            <a href="mailto:salom@jonbranding.uz" className="inline-flex items-center gap-2 mt-6 font-semibold text-sm rounded-full px-4 py-3" style={{ border: '1px solid var(--at-line)', background: 'var(--at-paper)', color: 'var(--at-ink)' }}>
              salom@jonbranding.uz <span style={{ color: 'var(--at-accent)' }}>↗</span>
            </a>
          </div>
          <div className="flex flex-col" style={{ borderTop: '1px solid var(--at-line)' }}>
            {l.faqs.map((f, i) => (
              <div key={i} style={{ borderBottom: i < l.faqs.length - 1 ? '1px solid var(--at-line)' : 'none' }}>
                <button className="w-full flex items-start gap-4 py-5 text-left" onClick={() => setOpen(open === i ? -1 : i)}>
                  <span className="shrink-0 w-7 text-sm" style={{ fontFamily: 'var(--font-mono)', color: 'var(--at-muted)' }}>{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="flex-1 font-semibold text-base" style={{ color: 'var(--at-ink)' }}>{f.q}</h3>
                  <span className="shrink-0 text-xl leading-none transition-transform duration-200" style={{ color: 'var(--at-muted)', transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
                </button>
                <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: open === i ? '400px' : '0', opacity: open === i ? 1 : 0 }}>
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

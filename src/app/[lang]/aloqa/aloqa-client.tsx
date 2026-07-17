'use client';
import type { FC } from 'react';

type Lang = 'uz' | 'ru' | 'en' | 'zh';

const t = {
  uz: {
    sectionN: '§ 09',
    label: 'Aloqa',
    heading: 'Gaplashamiz.',
    subtext: 'Yangi loyiha, hamkorlik yoki savol — biz 24 soat online.',
    contactsLabel: "Bog'lanish",
    contacts: [
      { label: 'Telefon', value: '+998 33 645 00 97', href: 'tel:+998336450097' },
      { label: 'Telegram', value: '@jonbranding', href: 'https://t.me/jonbranding' },
      { label: 'Instagram', value: '@jonbranding.uz', href: 'https://www.instagram.com/jon.branding/' },
      { label: 'Email', value: 'info@jonbranding.uz', href: 'mailto:info@jonbranding.uz' },
    ],
    addressLabel: 'Manzil',
    address: "Toshkent shahri, O'zbekiston",
    workLabel: 'Ish vaqti',
    work: 'Du–Sha · 09:00–19:00 TST',
    briefLabel: 'Brifingni boshlang',
    briefText: "Loyihangiz haqida 10 daqiqa quiz to'ldiring — biz 24 soat ichida javob beramiz.",
    briefBtn: 'Online brief →',
    ctaLabel: "Yoki to'g'ridan-to'g'ri yozing",
    ctaBtn: 'Telegram orqali yozish ↗',
  },
  ru: {
    sectionN: '§ 09',
    label: 'Контакты',
    heading: 'Поговорим.',
    subtext: 'Новый проект, сотрудничество или вопрос — мы онлайн 24 часа.',
    contactsLabel: 'Связаться',
    contacts: [
      { label: 'Телефон', value: '+998 33 645 00 97', href: 'tel:+998336450097' },
      { label: 'Telegram', value: '@jonbranding', href: 'https://t.me/jonbranding' },
      { label: 'Instagram', value: '@jonbranding.uz', href: 'https://www.instagram.com/jon.branding/' },
      { label: 'Email', value: 'info@jonbranding.uz', href: 'mailto:info@jonbranding.uz' },
    ],
    addressLabel: 'Адрес',
    address: 'г. Ташкент, Узбекистан',
    workLabel: 'Рабочее время',
    work: 'Пн–Сб · 09:00–19:00 TST',
    briefLabel: 'Начать брифинг',
    briefText: 'Заполните quiz о проекте за 10 минут — мы ответим в течение 24 часов.',
    briefBtn: 'Онлайн брифинг →',
    ctaLabel: 'Или написать напрямую',
    ctaBtn: 'Написать в Telegram ↗',
  },
  en: {
    sectionN: '§ 09',
    label: 'Contact',
    heading: "Let's talk.",
    subtext: 'New project, collaboration or question — we are online 24/7.',
    contactsLabel: 'Get in touch',
    contacts: [
      { label: 'Phone', value: '+998 33 645 00 97', href: 'tel:+998336450097' },
      { label: 'Telegram', value: '@jonbranding', href: 'https://t.me/jonbranding' },
      { label: 'Instagram', value: '@jonbranding.uz', href: 'https://www.instagram.com/jon.branding/' },
      { label: 'Email', value: 'info@jonbranding.uz', href: 'mailto:info@jonbranding.uz' },
    ],
    addressLabel: 'Address',
    address: 'Tashkent, Uzbekistan',
    workLabel: 'Working hours',
    work: 'Mon–Sat · 09:00–19:00 TST',
    briefLabel: 'Start a brief',
    briefText: 'Fill out the project quiz in 10 minutes — we reply within 24 hours.',
    briefBtn: 'Online brief →',
    ctaLabel: 'Or reach out directly',
    ctaBtn: 'Message on Telegram ↗',
  },
  zh: {
    sectionN: '§ 09',
    label: '联系我们',
    heading: '我们来聊聊。',
    subtext: '新项目、合作或问题——我们24小时在线。',
    contactsLabel: '联系方式',
    contacts: [
      { label: '电话', value: '+998 33 645 00 97', href: 'tel:+998336450097' },
      { label: 'Telegram', value: '@jonbranding', href: 'https://t.me/jonbranding' },
      { label: 'Instagram', value: '@jonbranding.uz', href: 'https://www.instagram.com/jon.branding/' },
      { label: '邮件', value: 'info@jonbranding.uz', href: 'mailto:info@jonbranding.uz' },
    ],
    addressLabel: '地址',
    address: '塔什干，乌兹别克斯坦',
    workLabel: '工作时间',
    work: '周一至周六 · 09:00–19:00 TST',
    briefLabel: '开始简报',
    briefText: '填写10分钟的项目问卷——我们在24小时内回复。',
    briefBtn: '在线简报 →',
    ctaLabel: '或直接联系',
    ctaBtn: 'Telegram 留言 ↗',
  },
} as const;

interface Props { lang: string; }

const AloqaClient: FC<Props> = ({ lang = 'uz' }) => {
  const l = t[(lang as Lang) in t ? (lang as Lang) : 'uz'];
  const quizHref = lang === 'uz' ? '/quiz' : `/${lang}/quiz`;
  const tgHref = 'https://t.me/jonbranding';

  return (
    <div style={{ background: 'var(--at-bg)', color: 'var(--at-ink)', minHeight: '100vh' }}>
      {/* Hero */}
      <section className="pt-16 pb-0 md:pt-24 border-b border-[var(--at-line)]">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 pb-16 md:pb-24">
          <div className="flex items-center gap-2 mb-8" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--at-muted)' }}>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--at-green)] animate-pulse" />
            <span style={{ color: 'var(--at-ink)', fontWeight: 500 }}>{l.sectionN}</span>
            <span>{l.label}</span>
          </div>
          <h1 className="font-bold text-[var(--at-ink)] mb-8 font-[family-name:var(--font-serif)] italic" style={{ fontSize: 'clamp(64px, 10vw, 160px)', lineHeight: 0.85, letterSpacing: '-0.04em' }}>
            {l.heading}
          </h1>
          <p className="text-[var(--at-ink-2)] text-base md:text-lg leading-relaxed max-w-[520px]">{l.subtext}</p>
        </div>
      </section>

      {/* Contacts */}
      <section className="py-16 md:py-24 border-b border-[var(--at-line)]">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-[260px_1fr] gap-12 md:gap-20">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--at-muted)', paddingTop: 4 }}>{l.contactsLabel}</div>
            <div style={{ borderTop: '1px solid var(--at-line)' }}>
              {l.contacts.map((c) => (
                <a key={c.label} href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex justify-between items-center py-5 group hover:text-[var(--at-accent)] transition-colors"
                  style={{ borderBottom: '1px solid var(--at-line)' }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--at-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{c.label}</span>
                  <span className="font-semibold text-[var(--at-ink)] group-hover:text-[var(--at-accent)] transition-colors" style={{ fontSize: 17 }}>{c.value} ↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Address + hours */}
      <section className="py-16 md:py-24 border-b border-[var(--at-line)]">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8">
          <div className="grid sm:grid-cols-2 gap-12 md:gap-20">
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--at-muted)', marginBottom: 16 }}>{l.addressLabel}</div>
              <div className="font-bold text-[var(--at-ink)]" style={{ fontSize: 24, letterSpacing: '-0.02em' }}>{l.address}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--at-muted)', marginBottom: 16 }}>{l.workLabel}</div>
              <div className="font-bold text-[var(--at-ink)]" style={{ fontSize: 24, letterSpacing: '-0.02em' }}>{l.work}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 rounded-2xl" style={{ background: 'var(--at-paper)', border: '1px solid var(--at-line)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--at-muted)', marginBottom: 16 }}>{l.briefLabel}</div>
              <p style={{ fontSize: 15, color: 'var(--at-ink-2)', lineHeight: 1.65, marginBottom: 24 }}>{l.briefText}</p>
              <a href={quizHref} className="inline-flex items-center gap-2 bg-[var(--at-accent)] text-white rounded-full px-6 py-3.5 font-semibold text-sm hover:-translate-y-0.5 transition-transform">{l.briefBtn}</a>
            </div>
            <div className="p-8 rounded-2xl flex flex-col justify-between" style={{ background: '#0E1015', border: '1px solid rgba(255,255,255,.08)', minHeight: 220 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 16 }}>{l.ctaLabel}</div>
              <div>
                <div className="font-[family-name:var(--font-serif)] italic font-normal text-white" style={{ fontSize: 'clamp(32px, 4vw, 56px)', letterSpacing: '-0.03em', lineHeight: 0.9, marginBottom: 24 }}>@jonbranding</div>
                <a href={tgHref} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border rounded-full px-6 py-3.5 font-semibold text-sm transition-colors hover:bg-white/10"
                  style={{ borderColor: 'rgba(255,255,255,.2)', color: '#fff' }}
                >{l.ctaBtn}</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AloqaClient;

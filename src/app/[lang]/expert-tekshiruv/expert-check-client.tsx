'use client';

import { FC, ReactNode, useRef, useState } from 'react';
import { ArrowDown, Check, Minus } from 'lucide-react';
import { HoneypotField } from '@/components/ui/honeypot-field';
import { generateEventId, getGaClientId, trackEvent, trackLead } from '@/lib/analytics';
import { isValidPhone, normalizePhone } from '@/lib/lead-contact';
import { EXPERT_CHECK_SERVICE } from '@/lib/sales-content';

const SOURCE = 'expert_check_page';
const PRICE = `${EXPERT_CHECK_SERVICE.price} so‘m`;
const DURATION = EXPERT_CHECK_SERVICE.duration;
const ADDON = EXPERT_CHECK_SERVICE.addon;

const h2Style = { fontSize: 'clamp(26px, 3.6vw, 42px)', letterSpacing: '-0.03em', lineHeight: 1.1 } as const;
const mono = { fontFamily: 'var(--font-mono), "JetBrains Mono", monospace', letterSpacing: '0.12em' } as const;
const EXAMPLE_NOTE = 'Misol faqat tekshiruv mezonini tushuntirish uchun keltirilgan. Bu real brend yoki gipotetik nom bo‘yicha patent xulosasi emas.';

type CheckType = 'expert' | 'free';

/* ─────────────── Kichik bloklar ─────────────── */

const Eyebrow: FC<{ children: ReactNode; light?: boolean }> = ({ children, light }) => (
  <p className={`mb-4 text-[11px] font-medium uppercase ${light ? 'text-blue-300' : 'text-blue-700'}`} style={mono}>
    {children}
  </p>
);

const Section: FC<{ id?: string; children: ReactNode; className?: string; labelledBy?: string }> = ({ id, children, className = '', labelledBy }) => (
  <section id={id} aria-labelledby={labelledBy} className={`px-5 sm:px-8 py-16 md:py-24 ${className}`}>
    <div className="mx-auto max-w-5xl">{children}</div>
  </section>
);

const Tag: FC<{ children: ReactNode; tone?: 'real' | 'hypo' }> = ({ children, tone = 'hypo' }) => (
  <span
    className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${tone === 'real' ? 'bg-neutral-100 text-neutral-600' : 'bg-blue-50 text-blue-700'}`}
    style={{ letterSpacing: '0.08em' }}
  >
    {children}
  </span>
);

const RISK = {
  low: { label: 'Past risk', cls: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  mid: { label: 'O‘rta risk', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
  high: { label: 'Yuqori risk', cls: 'bg-rose-50 text-rose-800 border-rose-200' },
} as const;

const RiskPill: FC<{ level: keyof typeof RISK }> = ({ level }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${RISK[level].cls}`}>
    {RISK[level].label}
  </span>
);

const PrimaryBtn: FC<{ onClick: () => void; children: ReactNode; dark?: boolean }> = ({ onClick, children, dark }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex min-h-[48px] items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${dark ? 'bg-white text-black hover:bg-neutral-200 focus-visible:ring-offset-black' : 'bg-black text-white hover:bg-neutral-800'}`}
  >
    {children}
  </button>
);

const SecondaryBtn: FC<{ onClick: () => void; children: ReactNode; dark?: boolean }> = ({ onClick, children, dark }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex min-h-[48px] items-center justify-center rounded-full border px-7 py-3.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${dark ? 'border-white/30 text-white hover:bg-white/10 focus-visible:ring-offset-black' : 'border-neutral-300 text-black hover:bg-neutral-50'}`}
  >
    {children}
  </button>
);

/* ─────────────── Ekspert xulosa mockup ─────────────── */

const ReportRow: FC<{ label: string; children: ReactNode }> = ({ label, children }) => (
  <div className="flex items-center justify-between gap-4 border-b border-neutral-100 py-2.5 text-[13px] last:border-0">
    <span className="text-neutral-500">{label}</span>
    <span className="text-right font-medium text-neutral-900">{children}</span>
  </div>
);

const HeroReport: FC = () => (
  <figure
    aria-label="Ekspert xulosa namunasi"
    className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.35)] sm:p-6"
  >
    <div className="mb-4 flex items-center justify-between">
      <span className="text-[11px] font-semibold uppercase text-neutral-400" style={mono}>Expert report</span>
      <Tag>Namuna</Tag>
    </div>
    <ReportRow label="Brend nomi">«NOMINGIZ»</ReportRow>
    <ReportRow label="Klass">30, 43</ReportRow>
    <ReportRow label="O‘xshash belgilar">3 ta topildi</ReportRow>
    <ReportRow label="Fonetik risk"><RiskPill level="mid" /></ReportRow>
    <ReportRow label="Grafik risk"><RiskPill level="low" /></ReportRow>
    <ReportRow label="Semantik risk"><RiskPill level="low" /></ReportRow>
    <ReportRow label="Umumiy risk"><RiskPill level="mid" /></ReportRow>
    <div className="mt-4 rounded-xl bg-neutral-50 p-4">
      <p className="mb-1 text-[11px] font-semibold uppercase text-neutral-400" style={mono}>Mutaxassis tavsiyasi</p>
      <p className="text-[13px] leading-relaxed text-neutral-700">
        Nomni qisman o‘zgartirib qayta tekshirish tavsiya etiladi. Sabablar xulosada izohlangan.
      </p>
    </div>
    <figcaption className="sr-only">Ekspert xulosada nimalar bo‘lishini ko‘rsatuvchi namuna. Qiymatlar misol uchun.</figcaption>
  </figure>
);

/* ─────────────── Ma'lumotlar ─────────────── */

const FLOW = ['Nom', 'Domen va ijtimoiy tarmoqlar', 'Hujjatlar', 'Qadoq va etiketka', 'Peshlavha', 'Reklama', 'Savdo', 'Tanilish'];

const CONSEQUENCES = [
  'nomni qayta ko‘rib chiqishga to‘g‘ri kelishi mumkin;',
  'qadoq va etiketkalarni yangilash kerak bo‘lishi mumkin;',
  'peshlavha va tashqi reklama o‘zgarishi mumkin;',
  'domen yoki social username’lar qayta ko‘rib chiqilishi mumkin;',
  'reklama materiallari qayta ishlanishi mumkin;',
  'marketplace va distribyutorlardagi materiallar yangilanishi mumkin;',
  'oldin yig‘ilgan tanilishga ta’sir qilishi mumkin;',
  'qo‘shimcha vaqt va xarajat paydo bo‘lishi mumkin.',
];

const FREE_ITEMS = [
  'dastlabki screening',
  'ko‘rinib turgan asosiy to‘siqlar',
  'juda yaqin nomlarga dastlabki qarash',
  'keyingi bosqich kerak yoki kerak emasligini tushunish',
];

const EXPERT_ITEMS = [
  'mijoz faoliyatini tahlil qilish',
  'qaysi mahsulot/xizmatlar uchun nom ishlatilishini aniqlash',
  'kerakli klasslarni aniqlash',
  'o‘xshash belgilarni chuqur ko‘rib chiqish',
  'fonetik o‘xshashlik',
  'grafik o‘xshashlik',
  'semantik o‘xshashlik',
  'transliteration (boshqa alifboda yozilishi)',
  'umumiy taassurot',
  'farqlash qobiliyati',
  'asosiy huquqiy risklar',
  'umumiy risk darajasi',
  'mutaxassis izohi',
  'keyingi qadam tavsiyasi',
  'yozma ekspert xulosa',
];

const UZUM_BRANCHES = [
  'Qanday eshitiladi?',
  'Qanday yoziladi?',
  'Nimani anglatadi?',
  'Boshqa alifboda qanday ko‘rinadi?',
  'Qaysi klasslarda?',
  'Qaysi mahsulot yoki xizmatlarda?',
  'Umumiy taassurot qanchalik o‘xshash?',
  'Farqlash qobiliyati bormi?',
];

type Criterion = {
  n: string;
  label: string;
  title: string;
  real?: string[];
  realLabel?: string;
  hypo?: string[];
  hypoLabel?: string;
  body: string;
  points?: string[];
  highlight?: string;
  visual?: 'wordmarks' | 'translit' | 'classes' | 'distinct';
};

const CRITERIA: Criterion[] = [
  {
    n: '01', label: 'Fonetik o‘xshashlik', title: 'Nom qanday eshitiladi?',
    real: ['UZUM'], hypo: ['UZUN', 'UZUMM'],
    body: 'Yozilishi boshqacha bo‘lsa ham, quyidagilar bir-biriga yaqin bo‘lishi mumkin:',
    points: ['tovushlar', 'bo‘g‘inlar', 'talaffuz', 'urg‘u', 'umumiy eshitilish'],
    highlight: 'Ko‘z boshqa nomni ko‘rishi mumkin. Quloq esa o‘xshash nomni eshitishi mumkin.',
  },
  {
    n: '02', label: 'Grafik / vizual o‘xshashlik', title: 'Nom yoki belgi qanday ko‘rinadi?',
    real: ['Korzinka'], hypo: ['KORZ1NKA'],
    body: 'Tahlil qilinadi:',
    points: ['yozilish', 'harf tuzilishi', 'shakllar', 'kompozitsiya', 'shrift', 'umumiy vizual taassurot'],
    visual: 'wordmarks',
  },
  {
    n: '03', label: 'Semantik o‘xshashlik', title: 'Nom nimani anglatadi?',
    real: ['Oqtepa'], hypo: ['WHITE HILL'],
    body: 'So‘zlar boshqa tilda bo‘lishi yoki boshqacha yozilishi mumkin. Lekin ma’nosi bir xil yoki juda yaqin bo‘lishi mumkin.',
    highlight: 'Ekspert faqat harflarga emas, nom nimani anglatishiga ham qaraydi.',
  },
  {
    n: '04', label: 'Transliteration', title: 'Boshqa alifboda qanday yoziladi va o‘qiladi?',
    real: ['Safia'], realLabel: 'Tanish misol',
    body: 'Nom lotin va kirillda turlicha ko‘rinishi mumkin, lekin talaffuzi bir xil yoki juda yaqin bo‘lishi mumkin. Ekspert tekshiruv faqat bitta yozuv variantiga qaram bo‘lmasligi kerak.',
    visual: 'translit',
  },
  {
    n: '05', label: 'Umumiy taassurot', title: 'Odam bu ikki belgini bir-biri bilan bog‘lab yuborishi mumkinmi?',
    real: ['EVOS'], hypo: ['EVOSS'],
    body: '«Nechta harf bir xil?» deb qaralmaydi. Umumiy eshitilish, ko‘rinish, tuzilish va iste’molchida qoladigan taassurot ham hisobga olinadi.',
    highlight: 'Bitta harf o‘zgarsa, nom avtomatik ravishda butunlay boshqa bo‘lib qolmaydi.',
  },
  {
    n: '06', label: 'Klass va faoliyat', title: 'Nom aynan qaysi mahsulot yoki xizmatlar uchun ishlatiladi?',
    real: ['ARTEL'], realLabel: 'Tanish misol',
    body: 'Bir xil nom turli faoliyatlarda ishlatilishi mumkin. Patentda «qanday biznes?» degan umumiy savol yetarli emas. «Shu brend ostida aynan nima sotasiz yoki qanday xizmat ko‘rsatasiz?» degan savol kerak.',
    visual: 'classes',
  },
  {
    n: '07', label: 'Farqlash qobiliyati', title: 'Nom biznesni boshqalardan ajratib turadimi?',
    body: 'Nom mahsulot nomining o‘zi, sifati, turi, xususiyati yoki geografiyasi haqida juda oddiy tavsif berayotgan bo‘lsa, bu ham alohida tekshiriladi.',
    visual: 'distinct',
  },
  {
    n: '08', label: 'Huquqiy va chalg‘ituvchi risk', title: 'Nom noto‘g‘ri taassurot uyg‘otadimi?',
    hypo: ['SWISS ORIGINAL'], hypoLabel: 'O‘zbekistonda ishlab chiqarilgan mahsulot',
    body: 'Nom mahsulot qayerda ishlab chiqarilgani, sifati, ishlab chiqaruvchisi yoki xususiyati haqida noto‘g‘ri taassurot uyg‘otishi mumkinmi — shu ham ko‘rib chiqiladi.',
  },
];

const PROCESS = [
  { n: '01', title: 'Ma’lumot olamiz', body: 'Brend nomi, faoliyat, mahsulotlar va xizmatlar.' },
  { n: '02', title: 'Klasslarni aniqlaymiz', body: 'Qaysi yo‘nalishlarda tekshiruv kerakligi belgilanadi.' },
  { n: '03', title: 'Ekspert tahlil', body: 'Nom turli mezonlar bo‘yicha tekshiriladi.' },
  { n: '04', title: 'Xulosa beriladi', body: 'Risk darajasi, mutaxassis izohi va keyingi qadam.' },
];

const AUDIENCE = [
  'Yangi biznesga nom tanlaganlar',
  'Nomi bor, lekin hali patentga topshirmaganlar',
  'Qadoq chiqarishni boshlayotgan ishlab chiqaruvchilar',
  'Peshlavha o‘rnatish arafasidagi bizneslar',
  'Reklamaga faol investitsiya qilishni boshlayotganlar',
  'Marketplace’ga chiqayotganlar',
  'Yangi mahsulot liniyasi ochayotganlar',
  'Franchayzingni rejalashtirayotganlar',
  'Eksportni rejalashtirayotganlar',
];

const FAQ: { q: string; a: ReactNode }[] = [
  { q: 'Ekspert tekshiruv 100% patent chiqishini kafolatlaydimi?', a: 'Yo‘q. Ekspert tekshiruv patentga topshirishdan oldingi risklarni baholaydi. Yakuniy qarorni vakolatli organ beradi.' },
  { q: 'Umumiy tekshiruv nega bepul?', a: 'Umumiy tekshiruv dastlabki screening bo‘lib, ko‘rinib turgan asosiy risklarni aniqlashga yordam beradi.' },
  { q: 'Ekspert tekshiruv nega pullik?', a: 'Chunki bunda patent mutaxassisi faoliyat, klasslar, o‘xshash belgilar va risklarni chuqur tahlil qilib, yozma xulosa beradi.' },
  { q: 'Nom xavfli chiqsa nima bo‘ladi?', a: 'Risk sababi tushuntiriladi va keyingi qadam tavsiya qilinadi.' },
  { q: 'Tekshiruv qancha vaqt oladi?', a: `${DURATION}.` },
  {
    q: 'Narxi qancha?',
    a: (
      <>
        1 klass — {PRICE}.{ADDON && <> {ADDON.label} — {ADDON.price}.</>}
      </>
    ),
  },
  { q: 'Bir nechta faoliyatim bo‘lsa nima bo‘ladi?', a: 'Har bir faoliyat bo‘yicha qaysi mahsulot yoki xizmatlar himoya qilinishi kerakligi aniqlanadi. Shundan keyin kerakli klasslar belgilanadi.' },
  { q: 'Naming xizmatida ham alohida ekspert tekshiruv kerakmi?', a: 'Yo‘q. Naming xizmatiga bu tekshiruv allaqachon kiritilgan.' },
  { q: 'Logo ham tekshiriladimi?', a: 'Mijoz nimani huquqiy himoya qilmoqchi ekaniga qarab aniqlanadi. Nom va logo alohida topshirilsa — alohida ariza, demak alohida xarajat.' },
];

/* ─────────────── Mezon kartasi ─────────────── */

const CriterionVisual: FC<{ c: Criterion }> = ({ c }) => {
  if (c.visual === 'wordmarks') {
    return (
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-neutral-200 p-3 text-center">
          <span className="block text-lg font-bold">Korzinka</span>
          <span className="mt-1 block"><Tag tone="real">Tanish brend</Tag></span>
        </div>
        <div className="rounded-xl border border-dashed border-blue-300 p-3 text-center">
          <span className="block text-lg font-bold">KORZ1NKA</span>
          <span className="mt-1 block"><Tag>Misol</Tag></span>
        </div>
      </div>
    );
  }
  if (c.visual === 'translit') {
    return (
      <div className="flex flex-wrap gap-2">
        {['Safia', 'Сафия', 'SAFIA'].map((v) => (
          <span key={v} className="rounded-lg border border-neutral-200 px-3 py-1.5 text-base font-semibold">{v}</span>
        ))}
      </div>
    );
  }
  if (c.visual === 'classes') {
    return (
      <div className="flex flex-wrap gap-1.5">
        {['Maishiy texnika', 'Kiyim', 'Restoran', 'Ta’lim', 'Marketing'].map((v) => (
          <span key={v} className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">{v}</span>
        ))}
      </div>
    );
  }
  if (c.visual === 'distinct') {
    return (
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl border border-neutral-200 p-3">
          <span className="mb-2 block"><Tag tone="real">Tanish brend nomlari</Tag></span>
          <ul className="space-y-0.5 font-semibold">{['Uzum', 'Korzinka', 'Artel', 'Safia'].map((v) => <li key={v}>{v}</li>)}</ul>
        </div>
        <div className="rounded-xl border border-dashed border-blue-300 p-3">
          <span className="mb-2 block"><Tag>Gipotetik tavsiflovchi</Tag></span>
          <ul className="space-y-0.5 font-semibold">{['Sifatli Sut', 'Toshkent Non', 'Yaxshi Mebel'].map((v) => <li key={v}>{v}</li>)}</ul>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-3">
      {c.real?.map((v) => (
        <span key={v} className="inline-flex items-center gap-2">
          <span className="text-xl font-bold">{v}</span>
          <Tag tone="real">{c.realLabel || 'Tanish brend'}</Tag>
        </span>
      ))}
      {c.real && c.hypo && <span aria-hidden="true" className="text-neutral-300">vs</span>}
      {c.hypo?.map((v) => (
        <span key={v} className="inline-flex items-center gap-2">
          <span className="text-xl font-bold text-blue-800">{v}</span>
          <Tag>Misol</Tag>
        </span>
      ))}
      {c.hypoLabel && <span className="w-full text-xs text-neutral-500">{c.hypoLabel}</span>}
    </div>
  );
};

const CriterionCard: FC<{ c: Criterion }> = ({ c }) => (
  <article className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
    <p className="mb-2 text-[11px] font-medium uppercase text-blue-700" style={mono}>{c.n} — {c.label}</p>
    <h3 className="mb-4 text-lg font-bold leading-snug" style={{ letterSpacing: '-0.02em' }}>{c.title}</h3>
    <div className="mb-4"><CriterionVisual c={c} /></div>
    <p className="text-[14px] leading-relaxed text-neutral-600">{c.body}</p>
    {c.points && (
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {c.points.map((p) => (
          <li key={p} className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-700">{p}</li>
        ))}
      </ul>
    )}
    {c.highlight && (
      <p className="mt-4 border-l-2 border-blue-600 pl-3 text-[14px] font-semibold leading-snug text-neutral-900">{c.highlight}</p>
    )}
    {(c.real || c.visual === 'wordmarks' || c.visual === 'distinct') && (
      <p className="mt-auto pt-4 text-[11px] leading-snug text-neutral-400">{EXAMPLE_NOTE}</p>
    )}
  </article>
);

/* ─────────────── Forma ─────────────── */

const inputCls = 'w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-600';

const Field: FC<{ id: string; label: string; children: ReactNode }> = ({ id, label, children }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-sm font-medium text-neutral-700">{label}</label>
    {children}
  </div>
);

const ExpertForm: FC<{ type: CheckType; setType: (t: CheckType) => void; phoneRef: React.RefObject<HTMLInputElement | null> }> = ({ type, setType, phoneRef }) => {
  const [f, setF] = useState({ name: '', phone: '', brand: '', activity: '', sells: '', services: '', directions: '', checked: '' });
  const [honeypot, setHoneypot] = useState('');
  const [phoneErr, setPhoneErr] = useState('');
  const [submitErr, setSubmitErr] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPhone(f.phone)) {
      setPhoneErr('Telefon raqamini to‘g‘ri kiriting');
      phoneRef.current?.focus();
      return;
    }
    setPhoneErr('');
    setSubmitErr('');
    setSending(true);

    const service = type === 'expert' ? EXPERT_CHECK_SERVICE.name : 'Bepul umumiy tekshiruv';
    const summary = [
      `Tur: ${type === 'expert' ? `Ekspert tekshiruv (${PRICE})` : 'Bepul umumiy tekshiruv'}`,
      f.brand && `Brend: ${f.brand}`,
      f.activity && `Faoliyat: ${f.activity}`,
      f.sells && `Sotadi: ${f.sells}`,
      f.services && `Xizmat: ${f.services}`,
      f.directions && `Yo‘nalishlar soni: ${f.directions}`,
      f.checked && `Oldin tekshirilganmi: ${f.checked}`,
    ].filter(Boolean).join(' | ');

    const normalizedPhone = normalizePhone(f.phone);
    const eventId = generateEventId('lead');
    const gaClientId = getGaClientId();
    const pageLocation = typeof window !== 'undefined' ? window.location.href : undefined;

    trackEvent({
      action: 'lead_form_submitted',
      category: 'Lead Form',
      label: SOURCE,
      event_id: eventId,
      form_name: SOURCE,
      cta_source: `${SOURCE}_${type}`,
      page_location: pageLocation,
    });

    let result: { eventId?: string } = {};
    try {
      const res = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: f.name.trim().length >= 2 ? f.name.trim() : 'Mijoz',
          phone: normalizedPhone,
          role: service,
          packageSummary: summary.slice(0, 900),
          source: SOURCE,
          lang: 'uz',
          eventId,
          gaClientId,
          pageLocation,
          ctaSource: `${SOURCE}_${type}`,
          companyWebsite: honeypot,
        }),
      });
      result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error('submit failed');
    } catch {
      setSubmitErr('Xatolik yuz berdi. Qayta urinib ko‘ring.');
      setSending(false);
      return;
    }

    trackLead({
      source: SOURCE,
      eventId: result.eventId || eventId,
      serverTracked: true,
      gaClientId,
      service,
      form_name: SOURCE,
      cta_source: `${SOURCE}_${type}`,
    });
    setSending(false);
    setDone(true);
  };

  if (done) {
    return (
      <div role="status" className="rounded-2xl bg-white p-8 text-center text-black">
        <p className="text-2xl font-bold" style={{ letterSpacing: '-0.03em' }}>Rahmat!</p>
        <p className="mt-2 text-sm text-neutral-600">Arizangiz qabul qilindi. Tez orada siz bilan bog‘lanamiz.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-5 text-black sm:p-8" noValidate>
      <HoneypotField value={honeypot} onChange={setHoneypot} />
      <fieldset className="mb-5">
        <legend className="mb-2 text-sm font-medium text-neutral-700">Tekshiruv turi</legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {([
            ['expert', 'Ekspert tekshiruv', `${PRICE} · ${DURATION}`],
            ['free', 'Umumiy tekshiruv', '0 so‘m · dastlabki screening'],
          ] as const).map(([val, title, sub]) => (
            <label
              key={val}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 focus-within:ring-2 focus-within:ring-blue-600 ${type === val ? 'border-black bg-neutral-50' : 'border-neutral-200'}`}
            >
              <input type="radio" name="check-type" value={val} checked={type === val} onChange={() => setType(val)} className="mt-1 accent-black" />
              <span>
                <span className="block text-sm font-semibold">{title}</span>
                <span className="block text-xs text-neutral-500">{sub}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="ec-name" label="Ism">
          <input id="ec-name" autoComplete="name" value={f.name} onChange={set('name')} placeholder="Ismingiz" className={inputCls} />
        </Field>
        <Field id="ec-phone" label="Telefon *">
          <input
            id="ec-phone"
            ref={phoneRef}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            value={f.phone}
            onChange={(e) => { set('phone')(e); setPhoneErr(''); }}
            placeholder="+998 90 123 45 67"
            aria-invalid={Boolean(phoneErr)}
            aria-describedby={phoneErr ? 'ec-phone-err' : undefined}
            className={inputCls}
            style={{ borderColor: phoneErr ? '#dc2626' : undefined }}
          />
          {phoneErr && <span id="ec-phone-err" role="alert" className="text-xs text-red-600">{phoneErr}</span>}
        </Field>
        <Field id="ec-brand" label="Brend nomi">
          <input id="ec-brand" value={f.brand} onChange={set('brand')} placeholder="Tekshiriladigan nom" className={inputCls} />
        </Field>
        <Field id="ec-activity" label="Faoliyat">
          <input id="ec-activity" value={f.activity} onChange={set('activity')} placeholder="Masalan: qandolatchilik" className={inputCls} />
        </Field>
        <Field id="ec-sells" label="Shu brend ostida aynan nima sotasiz?">
          <input id="ec-sells" value={f.sells} onChange={set('sells')} placeholder="Masalan: tort va pishiriqlar" className={inputCls} />
        </Field>
        <Field id="ec-services" label="Yoki qanday xizmat ko‘rsatasiz?">
          <input id="ec-services" value={f.services} onChange={set('services')} placeholder="Masalan: kafe, yetkazib berish" className={inputCls} />
        </Field>
        <Field id="ec-directions" label="Nechta faoliyat yo‘nalishi bor?">
          <select id="ec-directions" value={f.directions} onChange={set('directions')} className={inputCls}>
            <option value="">Tanlang</option>
            <option>1 ta</option>
            <option>2 ta</option>
            <option>3 ta va undan ko‘p</option>
            <option>Bilmayman</option>
          </select>
        </Field>
        <Field id="ec-checked" label="Nom oldin tekshirilganmi?">
          <select id="ec-checked" value={f.checked} onChange={set('checked')} className={inputCls}>
            <option value="">Tanlang</option>
            <option>Yo‘q</option>
            <option>Ha, o‘zim qidirib ko‘rganman</option>
            <option>Ha, mutaxassis tekshirgan</option>
          </select>
        </Field>
      </div>

      {submitErr && <p role="alert" className="mt-4 text-center text-xs text-red-600">{submitErr}</p>}
      <button
        type="submit"
        disabled={sending}
        aria-busy={sending}
        className="mt-6 w-full rounded-full bg-black py-4 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-60"
      >
        {sending ? 'Yuborilmoqda…' : type === 'expert' ? 'Ekspert tekshiruvga ariza qoldirish' : 'Bepul umumiy tekshiruvga ariza qoldirish'}
      </button>
    </form>
  );
};

/* ─────────────── Sahifa ─────────────── */

const ExpertCheckClient: FC = () => {
  const [type, setType] = useState<CheckType>('expert');
  const phoneRef = useRef<HTMLInputElement | null>(null);

  const goToForm = (t: CheckType, cta: string) => {
    setType(t);
    trackEvent({ action: 'cta_click', category: 'Lead Form', label: cta, source: SOURCE });
    document.getElementById('ariza')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => phoneRef.current?.focus({ preventScroll: true }), 500);
  };

  return (
    <div className="bg-white text-black">
      {/* 1. HERO */}
      <section aria-labelledby="ec-hero" className="px-5 pb-16 pt-24 sm:px-8 md:pb-24 md:pt-32">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <Eyebrow>Ekspert tekshiruv</Eyebrow>
            <h1 id="ec-hero" className="font-bold" style={{ fontSize: 'clamp(32px, 5vw, 58px)', letterSpacing: '-0.04em', lineHeight: 1.04 }}>
              Brend nomiga katta mablag‘ sarflashdan oldin, <span className="serif-highlight">patent riskini</span> bilib oling
            </h1>
            <p className="mt-6 max-w-[54ch] text-neutral-600" style={{ fontSize: 17, lineHeight: 1.65 }}>
              Ekspert tekshiruv — brend nomingizni patentga topshirishdan oldin faoliyatingiz, klasslar va o‘xshash belgilar bo‘yicha chuqur tahlil qilib, mavjud risklarni aniqlash xizmati.
            </p>
            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-neutral-200 pt-6">
              <div>
                <dt className="text-[11px] uppercase text-neutral-400" style={mono}>Narx · 1 klass</dt>
                <dd className="mt-1 text-3xl font-bold" style={{ letterSpacing: '-0.03em' }}>{PRICE}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase text-neutral-400" style={mono}>Muddat</dt>
                <dd className="mt-1 text-3xl font-bold" style={{ letterSpacing: '-0.03em' }}>{DURATION}</dd>
              </div>
            </dl>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryBtn onClick={() => goToForm('expert', 'hero_expert')}>Nomimni ekspert tekshiruvdan o‘tkazish</PrimaryBtn>
              <SecondaryBtn onClick={() => goToForm('free', 'hero_free')}>Avval bepul umumiy tekshiruv</SecondaryBtn>
            </div>
            <p className="mt-6 max-w-[60ch] text-xs leading-relaxed text-neutral-500">
              Ekspert tekshiruv 100% patent chiqishini kafolatlamaydi. Uning vazifasi — patentga topshirishdan oldin mavjud risklarni aniqlash va qarorni aniqroq qilish.
            </p>
          </div>
          <HeroReport />
        </div>
      </section>

      {/* 2. MUAMMO */}
      <Section labelledBy="ec-problem" className="bg-neutral-50">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <Eyebrow>Muammo</Eyebrow>
            <h2 id="ec-problem" className="font-bold" style={h2Style}>Tekshirilmagan nomga biznesni bog‘lab qo‘yish qanday risk tug‘diradi?</h2>
            <p className="mt-5 text-neutral-600" style={{ fontSize: 16, lineHeight: 1.65 }}>
              Tadbirkor nom tanlagandan keyin biznes asta-sekin shu nomga bog‘lana boshlaydi.
            </p>
            <h3 className="mt-10 text-lg font-bold">Agar nom bo‘yicha huquqiy risk keyinroq aniqlansa nima bo‘ladi?</h3>
            <ul className="mt-4 space-y-2.5">
              {CONSEQUENCES.map((c) => (
                <li key={c} className="flex gap-3 text-[15px] leading-snug text-neutral-700">
                  <Minus aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <ol aria-label="Biznes nomga qanday bog‘lanadi" className="flex flex-col items-start gap-1 md:items-center">
            {FLOW.map((step, i) => (
              <li key={step} className="flex flex-col items-start md:items-center">
                <span className={`rounded-full border px-4 py-2 text-sm font-semibold ${i === 0 ? 'border-black bg-black text-white' : 'border-neutral-200 bg-white'}`}>{step}</span>
                {i < FLOW.length - 1 && <ArrowDown aria-hidden="true" className="my-1 ml-4 h-4 w-4 text-neutral-300 md:ml-0" />}
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-14 rounded-2xl bg-black p-7 text-white sm:p-10">
          <p className="font-bold" style={{ fontSize: 'clamp(22px, 2.8vw, 32px)', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
            Muammo patent arizasining o‘zida emas. Muammo — tekshirilmagan nomga biznesni bog‘lab qo‘yishda.
          </p>
          <p className="mt-4 text-neutral-300" style={{ fontSize: 16, lineHeight: 1.6 }}>
            Ekspert tekshiruvning vazifasi — bu risklarni biznes nomga chuqur bog‘lanib ketishidan oldin aniqlash.
          </p>
        </div>
      </Section>

      {/* 3. UMUMIY vs EKSPERT */}
      <Section labelledBy="ec-compare">
        <Eyebrow>Farqi</Eyebrow>
        <h2 id="ec-compare" className="max-w-2xl font-bold" style={h2Style}>Umumiy tekshiruv va ekspert tekshiruv</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-[1fr_1.4fr]">
          <div className="rounded-2xl border border-neutral-200 p-6 sm:p-7">
            <h3 className="text-lg font-bold">Umumiy tekshiruv</h3>
            <p className="mt-1 text-3xl font-bold" style={{ letterSpacing: '-0.03em' }}>0 so‘m</p>
            <p className="mt-3 text-sm text-neutral-500">Maqsad: dastlabki holatni ko‘rish</p>
            <ul className="mt-5 space-y-2">
              {FREE_ITEMS.map((i) => (
                <li key={i} className="flex gap-2.5 text-[15px] text-neutral-700"><Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />{i}</li>
              ))}
            </ul>
            <p className="mt-6 rounded-xl bg-neutral-50 p-3 text-sm font-medium text-neutral-700">Muhim: bu yozma ekspert xulosa emas.</p>
          </div>
          <div className="rounded-2xl border-2 border-black p-6 sm:p-7">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-bold">Ekspert tekshiruv</h3>
              <span className="text-sm text-neutral-500">{DURATION}</span>
            </div>
            <p className="mt-1 text-3xl font-bold" style={{ letterSpacing: '-0.03em' }}>{PRICE}</p>
            <ul className="mt-5 grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {EXPERT_ITEMS.map((i) => (
                <li key={i} className="flex gap-2.5 text-[15px] text-neutral-800"><Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />{i}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <p className="rounded-2xl bg-neutral-50 p-6 text-[17px] leading-snug">
            <span className="mb-1 block text-xs font-semibold uppercase text-neutral-400" style={mono}>Umumiy tekshiruv</span>
            «Ko‘rinib turgan muammo bormi?»
          </p>
          <p className="rounded-2xl bg-blue-50 p-6 text-[17px] font-semibold leading-snug text-blue-950">
            <span className="mb-1 block text-xs font-semibold uppercase text-blue-700" style={mono}>Ekspert tekshiruv</span>
            «Shu nom bilan davom etishdagi risk qayerda va nima qilish kerak?»
          </p>
        </div>
      </Section>

      {/* 4. FAQAT BIR XIL NOMNI QIDIRMAYMIZ */}
      <Section labelledBy="ec-uzum" className="bg-black text-white">
        <Eyebrow light>Faqat bir xil nomni qidirmaymiz</Eyebrow>
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p aria-hidden="true" className="font-bold" style={{ fontSize: 'clamp(64px, 11vw, 132px)', letterSpacing: '-0.05em', lineHeight: 1 }}>UZUM</p>
            <h2 id="ec-uzum" className="mt-6 font-bold text-white" style={h2Style}>«Uzum aynan bormi?»</h2>
            <p className="mt-3 text-neutral-300" style={{ fontSize: 17 }}>Bu tekshiruvning faqat boshlanishi.</p>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {UZUM_BRANCHES.map((b) => (
              <li key={b} className="rounded-xl border border-white/15 px-4 py-3 text-[15px]">{b}</li>
            ))}
          </ul>
        </div>
        <p className="mt-12 max-w-3xl border-l-2 border-blue-400 pl-5 font-semibold" style={{ fontSize: 'clamp(18px, 2.2vw, 24px)', lineHeight: 1.4 }}>
          Ekspert tekshiruv — nomni bazada Ctrl+F qilib qidirish emas. Nomni biznes va huquqiy kontekstda bir nechta mezon bo‘yicha tahlil qilish.
        </p>
        <p className="mt-6 text-xs text-neutral-400">{EXAMPLE_NOTE}</p>
      </Section>

      {/* 5. 8 MEZON */}
      <Section labelledBy="ec-criteria" className="bg-neutral-50">
        <Eyebrow>8 mezon</Eyebrow>
        <h2 id="ec-criteria" className="max-w-2xl font-bold" style={h2Style}>Ekspert tekshiruvda nimalar ko‘riladi?</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {CRITERIA.map((c) => <CriterionCard key={c.n} c={c} />)}
        </div>
      </Section>

      {/* 6. NIMA OLASIZ */}
      <Section labelledBy="ec-report">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <Eyebrow>{PRICE}ga nima olasiz?</Eyebrow>
            <h2 id="ec-report" className="font-bold" style={h2Style}>Oddiy tekshiruv emas — yozma ekspert xulosa</h2>
            <h3 className="mt-8 text-sm font-semibold uppercase text-neutral-400" style={mono}>Risk status</h3>
            <div className="mt-3 flex flex-wrap gap-2"><RiskPill level="low" /><RiskPill level="mid" /><RiskPill level="high" /></div>
            <h3 className="mt-8 text-sm font-semibold uppercase text-neutral-400" style={mono}>Tavsiya variantlari</h3>
            <ul className="mt-3 space-y-2 text-[15px]">
              <li className="rounded-xl border border-neutral-200 px-4 py-3">Patentga topshirishni davom ettirish</li>
              <li className="rounded-xl border border-neutral-200 px-4 py-3">Nomni qisman o‘zgartirib qayta tekshirish</li>
              <li className="rounded-xl border border-neutral-200 px-4 py-3">Boshqa nom variantini ko‘rib chiqish</li>
            </ul>
            <p className="mt-5 text-xs text-neutral-500">Muhim: ushbu statuslar davlat organining yakuniy qarori emas.</p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.3)] sm:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-neutral-100 pb-4">
              <span className="text-sm font-bold">Ekspert xulosa</span>
              <Tag>Tuzilma</Tag>
            </div>
            {[
              { t: 'Brend haqida', items: ['brend nomi', 'faoliyat', 'mahsulot/xizmatlar', 'tekshirilgan klasslar'] },
              { t: 'O‘xshashlik tahlili', items: ['topilgan o‘xshash belgilar', 'fonetik risk', 'grafik risk', 'semantik risk', 'umumiy taassurot'] },
              { t: 'Xulosa', items: ['umumiy risk darajasi', 'mutaxassis izohi', 'keyingi qadam'] },
            ].map((block, idx) => (
              <div key={block.t} className={idx > 0 ? 'mt-6' : ''}>
                <p className="mb-2 text-[11px] font-semibold uppercase text-blue-700" style={mono}>{String(idx + 1).padStart(2, '0')} · {block.t}</p>
                <ul className="grid gap-1.5 sm:grid-cols-2">
                  {block.items.map((i) => (
                    <li key={i} className="flex gap-2 text-[14px] text-neutral-800"><Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 7. BAND CHIQSA */}
      <Section labelledBy="ec-objection" className="bg-neutral-50">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>Eng ko‘p beriladigan savol</Eyebrow>
          <h2 id="ec-objection" className="font-bold" style={h2Style}>Nom xavfli chiqsa, {PRICE} bekorga ketadimi?</h2>
          <p className="mt-6 text-[18px] leading-relaxed text-neutral-800">
            Siz {PRICE}ni nom «bo‘sh chiqishi» uchun emas, patent mutaxassisining tahlili va ekspert xulosasi uchun to‘laysiz.
          </p>
          <p className="mt-4 text-[17px] leading-relaxed text-neutral-600">
            Agar nom bo‘yicha yuqori risk aniqlansa, ekspert tekshiruvning qiymati aynan shunda ko‘rinadi: siz bu riskni biznes nomga yanada chuqurroq bog‘lanib ketishidan oldin bilib olasiz.
          </p>
          <p className="mt-8 rounded-2xl bg-black p-7 font-bold text-white" style={{ fontSize: 'clamp(20px, 2.6vw, 28px)', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
            «Risk yuqori» degan xulosa ham ekspert tekshiruv natijasidir.
          </p>
          <p className="mt-6 text-[15px] leading-relaxed text-neutral-600">
            Ekspert xulosaning vazifasi siz xohlagan javobni berish emas. Vazifasi — mavjud holatni professional tahlil qilib berish.
          </p>
        </div>
      </Section>

      {/* 8. NIMA UCHUN PULLIK */}
      <Section labelledBy="ec-why">
        <Eyebrow>Nima uchun pullik?</Eyebrow>
        <h2 id="ec-why" className="max-w-2xl font-bold" style={h2Style}>Nega umumiy tekshiruv bepul, ekspert tekshiruv esa pullik?</h2>
        <div className="mt-10 grid items-stretch gap-4 md:grid-cols-[1fr_auto_1.3fr]">
          <div className="rounded-2xl border border-neutral-200 p-6">
            <h3 className="mb-4 font-bold">Bepul umumiy tekshiruv</h3>
            <ul className="space-y-2 text-[15px] text-neutral-600">
              {['Qidiruv', 'Dastlabki screening', 'Ko‘rinib turgan risk'].map((i) => <li key={i}>{i}</li>)}
            </ul>
          </div>
          <span aria-hidden="true" className="self-center text-center text-sm font-semibold text-neutral-400">vs</span>
          <div className="rounded-2xl border-2 border-black p-6">
            <h3 className="mb-4 font-bold">Ekspert tekshiruv</h3>
            <ul className="grid gap-2 text-[15px] text-neutral-900 sm:grid-cols-2">
              {['Patent mutaxassisi', 'Faoliyat tahlili', 'Klasslarni aniqlash', 'Bir nechta o‘xshashlik mezoni', 'Risk bahosi', 'Yozma xulosa', 'Keyingi qadam tavsiyasi'].map((i) => (
                <li key={i} className="flex gap-2"><Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />{i}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-8 text-center text-[18px] font-semibold">Mijoz qidiruv uchun emas, professional tahlil va qaror aniqligi uchun to‘laydi.</p>
      </Section>

      {/* 9. JTBD */}
      <Section labelledBy="ec-jtbd" className="bg-black text-white">
        <h2 id="ec-jtbd" className="mx-auto max-w-4xl text-center font-bold text-white" style={{ fontSize: 'clamp(26px, 4vw, 48px)', letterSpacing: '-0.035em', lineHeight: 1.12 }}>
          Siz «tekshiruv» sotib olmayapsiz. Siz nom bilan davom etishdan oldin qaror uchun kerakli aniqlikni sotib olyapsiz.
        </h2>
        <dl className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            ['Qachon', 'Brend nomimni tanlaganimda'],
            ['Men xohlayman', 'Nomni mutaxassis chuqur tekshirib bersin'],
            ['Shunda', 'Shu nom bilan davom etishdagi risklarni bilib, keyingi qarorni aniqroq qabul qilaman'],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl border border-white/15 p-6">
              <dt className="text-[11px] uppercase text-blue-300" style={mono}>{k}</dt>
              <dd className="mt-2 text-[17px] leading-snug">{v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* 10. JARAYON */}
      <Section labelledBy="ec-process">
        <Eyebrow>Jarayon</Eyebrow>
        <h2 id="ec-process" className="font-bold" style={h2Style}>4 bosqich</h2>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((p) => (
            <li key={p.n} className="rounded-2xl border border-neutral-200 p-6">
              <span className="text-[11px] font-medium text-blue-700" style={mono}>{p.n}</span>
              <h3 className="mt-2 font-bold">{p.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-neutral-600">{p.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 inline-flex rounded-full bg-blue-50 px-5 py-2.5 text-sm font-semibold text-blue-900">Natija — {DURATION}</p>
      </Section>

      {/* 11. KIMLAR UCHUN */}
      <Section labelledBy="ec-audience" className="bg-neutral-50">
        <Eyebrow>Kimlar uchun?</Eyebrow>
        <h2 id="ec-audience" className="font-bold" style={h2Style}>Nomga pul tikishdan oldingi bosqichdagilar uchun</h2>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {AUDIENCE.map((a) => (
            <li key={a} className="rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-[15px] font-medium">{a}</li>
          ))}
        </ul>
      </Section>

      {/* 12. FAQ */}
      <Section labelledBy="ec-faq">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>FAQ</Eyebrow>
          <h2 id="ec-faq" className="font-bold" style={h2Style}>Ko‘p so‘raladigan savollar</h2>
          <div className="mt-8 divide-y divide-neutral-200 border-y border-neutral-200">
            {FAQ.map((item) => (
              <details key={item.q} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[16px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span aria-hidden="true" className="text-xl text-neutral-400 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="pb-5 text-[15px] leading-relaxed text-neutral-600">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* 13. FINAL CTA + FORMA */}
      <section id="ariza" aria-labelledby="ec-final" className="scroll-mt-20 bg-black px-5 py-16 text-white sm:px-8 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 id="ec-final" className="font-bold text-white" style={h2Style}>Nomga biznesni bog‘lashdan oldin, riskni bilib oling.</h2>
            <p className="mt-5 text-neutral-300" style={{ fontSize: 17, lineHeight: 1.6 }}>
              Brend nomingizni yuboring. Avval umumiy holatni ko‘rib chiqamiz, kerak bo‘lsa ekspert tekshiruvga o‘tamiz.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <PrimaryBtn dark onClick={() => goToForm('expert', 'final_expert')}>Ekspert tekshiruvga ariza qoldirish</PrimaryBtn>
              <SecondaryBtn dark onClick={() => goToForm('free', 'final_free')}>Bepul umumiy tekshiruv</SecondaryBtn>
            </div>
            <p className="mt-8 text-sm text-neutral-400">
              {PRICE} · 1 klass{ADDON && <> · {ADDON.label.toLowerCase()} {ADDON.price}</>} · {DURATION}
            </p>
          </div>
          <ExpertForm type={type} setType={setType} phoneRef={phoneRef} />
        </div>
      </section>
    </div>
  );
};

export default ExpertCheckClient;

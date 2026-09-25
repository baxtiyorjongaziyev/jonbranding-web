'use client';

import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronDown,
  Compass,
  FileText,
  Layers,
  MapPin,
  Sparkles,
  Target,
  X,
} from 'lucide-react';
import { HoneypotField } from '@/components/ui/honeypot-field';
import { generateEventId, getGaClientId, trackEvent, trackLead } from '@/lib/analytics';
import { isValidPhone, normalizePhone } from '@/lib/lead-contact';
import { BRAND_STRATEGY_SERVICE } from '@/lib/sales-content';

const SOURCE = 'brand_strategy_page';
const PRICE = `${BRAND_STRATEGY_SERVICE.price} so‘m`;
const PRICE_VALUE = Number(BRAND_STRATEGY_SERVICE.price.replace(/\D/g, ''));

const h2Style = {
  fontSize: 'clamp(28px, 4vw, 44px)',
  letterSpacing: '-0.03em',
  lineHeight: 1.1,
} as const;

const mono = {
  fontFamily: 'var(--font-mono), "JetBrains Mono", monospace',
  letterSpacing: '0.12em',
} as const;

const Eyebrow: FC<{ children: ReactNode; light?: boolean }> = ({ children, light }) => (
  <p
    className={`mb-4 text-[11px] font-medium uppercase ${light ? 'text-blue-300' : 'text-blue-700'}`}
    style={mono}
  >
    {children}
  </p>
);

const Section: FC<{ id?: string; children: ReactNode; className?: string; labelledBy?: string }> = ({
  id,
  children,
  className = '',
  labelledBy,
}) => (
  <section id={id} aria-labelledby={labelledBy} className={`px-5 sm:px-8 py-20 md:py-28 ${className}`}>
    <div className="mx-auto max-w-5xl">{children}</div>
  </section>
);

const Tag: FC<{ children: ReactNode; tone?: 'blue' | 'neutral' | 'dark' }> = ({
  children,
  tone = 'blue',
}) => {
  const cls =
    tone === 'blue'
      ? 'bg-blue-50 text-blue-700 border-blue-100'
      : tone === 'dark'
      ? 'bg-neutral-800 text-neutral-300 border-neutral-700'
      : 'bg-neutral-100 text-neutral-700 border-neutral-200';
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase ${cls}`}
      style={{ letterSpacing: '0.08em' }}
    >
      {children}
    </span>
  );
};

const PrimaryBtn: FC<{ onClick: () => void; children: ReactNode; dark?: boolean; className?: string }> = ({
  onClick,
  children,
  dark,
  className = '',
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 active:scale-[0.99] ${
      dark
        ? 'bg-white text-black hover:bg-neutral-200 focus-visible:ring-offset-black'
        : 'bg-black text-white hover:bg-neutral-800'
    } ${className}`}
  >
    {children}
  </button>
);

const SecondaryBtn: FC<{ onClick: () => void; children: ReactNode; dark?: boolean; className?: string }> = ({
  onClick,
  children,
  dark,
  className = '',
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full border px-8 py-3.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 active:scale-[0.99] ${
      dark
        ? 'border-white/30 text-white hover:bg-white/10 focus-visible:ring-offset-black'
        : 'border-neutral-300 text-neutral-900 hover:bg-neutral-50'
    } ${className}`}
  >
    {children}
  </button>
);

/* ─────────────── Hero Visual: Brand Strategy Map ─────────────── */

const HeroStrategyMap: FC = () => {
  const steps = [
    { key: '01', title: 'Business', desc: 'Biznes modeli va maqsadlar' },
    { key: '02', title: 'Market', desc: 'Kategoriya va tendensiyalar' },
    { key: '03', title: 'Audience', desc: 'Segmentlar va JTBD ehtiyojlar' },
    { key: '04', title: 'Positioning', desc: 'Bozordagi aniq o‘rin' },
    { key: '05', title: 'Value Proposition', desc: 'Uch qatlamli foyda tizimi' },
    { key: '06', title: 'Differentiation', desc: 'Asoslangan farq' },
    { key: '07', title: 'Brand Idea', desc: 'Bitta markaziy g‘oya' },
  ];

  return (
    <figure
      aria-label="Brand Strategy Map"
      className="relative rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.18)] sm:p-8"
    >
      <div className="mb-5 flex items-center justify-between border-b border-neutral-100 pb-4">
        <div>
          <span className="text-[11px] font-semibold uppercase text-neutral-400" style={mono}>
            Strategic Framework
          </span>
          <p className="text-base font-bold text-neutral-900" style={{ letterSpacing: '-0.02em' }}>
            Brand Strategy Map
          </p>
        </div>
        <Tag tone="blue">Editorial</Tag>
      </div>

      <div className="space-y-2">
        {steps.map((st, i) => (
          <div key={st.title} className="group relative">
            <div
              className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 transition-colors ${
                i === 3
                  ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-semibold'
                  : i === 6
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-200 bg-neutral-50/60 hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`text-[11px] font-mono ${
                    i === 6 ? 'text-neutral-400' : i === 3 ? 'text-blue-700 font-bold' : 'text-neutral-400'
                  }`}
                >
                  {st.key}
                </span>
                <span className="text-sm font-semibold">{st.title}</span>
              </div>
              <span
                className={`text-[12px] ${
                  i === 6 ? 'text-neutral-300' : i === 3 ? 'text-blue-800' : 'text-neutral-500'
                }`}
              >
                {st.desc}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex justify-center py-0.5">
                <ArrowDown className="h-3 w-3 text-neutral-300" aria-hidden="true" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl bg-neutral-50 p-4 border border-neutral-100">
        <p className="text-center text-[13px] font-medium leading-relaxed text-neutral-700">
          Dizaynni boshlashdan oldin, nimani va kim uchun qurayotganimizni aniqlaymiz.
        </p>
      </div>
      <figcaption className="sr-only">
        Brand Strategy Map biznesdan boshlab to to‘g‘ridan-to‘g‘ri brend g‘oyasigacha bo‘lgan strategik zanjirni ko‘rsatadi.
      </figcaption>
    </figure>
  );
};

/* ─────────────── 12 Xizmat Tarkibi ─────────────── */

interface DeliverableItem {
  num: string;
  title: string;
  subtitle: string;
  details: string[];
  result?: string;
  formula?: string;
  contrast?: { left: string; right: string };
  layers?: { label: string; question: string }[];
}

const DELIVERABLES: DeliverableItem[] = [
  {
    num: '01',
    title: 'Biznes diagnostikasi',
    subtitle: 'Kompaniya realiyatini ichidan o‘rganamiz',
    details: [
      'Biznes modeli va daromad mexanikasi',
      'Mahsulot va xizmatlar portfeli',
      'Asosiy daromad manbalari',
      'Kompaniyaning uzoq muddatli maqsadlari',
      'Hozirgi to‘siqlar va muammolar',
      'Kelajakdagi rivojlanish yo‘nalishi',
    ],
    result: 'Strategiya biznes realiyatidan ajralib qolmaydi.',
  },
  {
    num: '02',
    title: 'Bozor tahlili',
    subtitle: 'Kategoriya dinamikasi va imkoniyatlar',
    details: [
      'Biznes faoliyat yuritadigan kategoriya chegaralari',
      'Bozor qanday mantiqda ishlaydi',
      'Asosiy tendensiyalar va o‘zgarishlar',
      'Kategoriyaning yozilmagan qoidalari',
      'Raqobatchilar e’tibordan chetda qoldirgan bo‘sh imkoniyatlar',
    ],
    result: 'Bozorda qaysi yo‘nalish ochiqligi aniq ko‘rinadi.',
  },
  {
    num: '03',
    title: 'Raqobatchilar tahlili',
    subtitle: 'Raqobat maydonini xaritalash',
    details: [
      'Kimlar bilan to‘g‘ridan-to‘g‘ri va bilvosita raqobat qilasiz',
      'Ular bozorda nima va’da qiladi',
      'Qanday positioning va narx modelidan foydalanadi',
      'Kimga murojaat qiladi va qanday gapiradi',
      'Nimasi bilan farqlanadi yoki bir xil ko‘rinadi',
      'Bozorda qaysi pozitsiyalar band qilingan',
    ],
    result: '“Hamma kabi” positioningdan chiqish.',
  },
  {
    num: '04',
    title: 'Auditoriya segmentlari',
    subtitle: 'Demografiyadan chuqurroq: JTBD yondashuvi',
    details: [
      'Oddiy “25–45 yosh erkak va ayollar” bilan cheklanmaymiz',
      'Xarid vaziyati va iste’mol konteksti',
      'Mijoz hal qilmoqchi bo‘lgan asosiy muammo',
      'Ichki ehtiyoj va motivatsiya',
      'Xarid oldidagi qo‘rquv va to‘siqlar',
      'Mijoz tanlaydigan alternativalar',
      'Yakuniy qaror qabul qilish mezonlari (JTBD)',
    ],
    result: 'Mijoz qaysi vaziyatda aynan sizni tanlashi aniq bo‘ladi.',
  },
  {
    num: '05',
    title: 'Category',
    subtitle: 'Mijoz ongida qaysi javonga joylashasiz?',
    details: [
      'Mijoz bizni qaysi kategoriya vakili sifatida qabul qilishi kerak?',
      'Kategoriyani qayta belgilash yangi qiymat yaratadi',
      'Kategoriya mijoz kutuvini va narx mezonini shakllantiradi',
    ],
    contrast: {
      left: '“Dizayn studiyasi”',
      right: '“Biznes uchun branding agentligi”',
    },
    result: 'Bu ikki tushuncha butunlay boshqacha narx va ishonch talab qiladi.',
  },
  {
    num: '06',
    title: 'Positioning',
    subtitle: 'Eng muhim strategik blok',
    details: [
      'Formula: Kim uchun + qaysi muammoni + qanday farqli usulda hal qilamiz',
      'Bu reklama slogani emas — bu kompaniyaning ichki strategik yo‘nalishi',
    ],
    formula:
      '[Auditoriya] uchun [Brend] — [kategoriya], u [asosiy qiymat] beradi, chunki [ishonish uchun sabab].',
    result: 'Ichki strategik yo‘nalish kompaniyadagi har bir xodim uchun bitta bo‘ladi.',
  },
  {
    num: '07',
    title: 'Value Proposition',
    subtitle: 'Qiymatning uchta qatlami',
    details: ['Mijozga taklif qilinadigan foyda faqat bitta sathda bo‘lmasligi kerak.'],
    layers: [
      { label: 'Functional benefit', question: 'Mijoz amalda nima oladi?' },
      { label: 'Emotional benefit', question: 'Mijoz o‘zini qanday his qiladi?' },
      { label: 'Business benefit', question: 'Bu mijozning biznesiga yoki hayotiga nima beradi?' },
    ],
    result: 'Mijoz narxni emas, oladigan qiymatni ko‘radi.',
  },
  {
    num: '08',
    title: 'Differentiation',
    subtitle: '“Sifatli xizmat” farqlanish emas',
    details: [
      'Farqlanish quyidagilardan kelib chiqishi mumkin: metod, expertise, specialization, mahsulot modeli, jarayon, texnologiya, kategoriya yoki ishonchli proof.',
      'Quyidagilarni differentiation sifatida sotmaymiz: sifat, professional jamoa, individual yondashuv, hamyonbop narx — agar ularning isbotlangan real asosi bo‘lmasa.',
    ],
    result: 'Raqobatchi nusxa ko‘chira olmaydigan asos paydo bo‘ladi.',
  },
  {
    num: '09',
    title: 'Reason to Believe (RTB)',
    subtitle: 'Mijoz nima uchun bu va’daga ishonishi kerak?',
    details: [
      'Tadbirkorlik va sohadagi real tajriba',
      'Amalga oshirilgan case’lar va o‘lchanadigan natijalar',
      'Mualliflik yoki tasdiqlangan metodologiya',
      'Ishlab chiqarish quvvati yoki texnologik ustunlik',
      'Sertifikatlar, patentlar va yuridik kafolatlar',
      'Haqiqiy raqamlar va faktlar',
    ],
    result: 'Va’da havoda qolmaydi — uning orqasida mustahkam isbot turadi.',
  },
  {
    num: '10',
    title: 'Brand Essence',
    subtitle: 'Brendni bitta markaziy g‘oyaga keltirish',
    details: [
      'Katta savol: Brenddan barcha tashqi elementlarni olib tashlasak, markazda qanday g‘oya qoladi?',
      'Brand Essence slogan emas. Bu keyingi barcha qarorlar uchun filtr:',
      'Naming → Visual Identity → Messaging → Marketing',
    ],
    result: 'Yillar davomida eskirmaydigan mustahkam yadro.',
  },
  {
    num: '11',
    title: 'Brand Personality',
    subtitle: 'Brend xarakteri va nutq chegaralari',
    details: [
      'Brend xarakterini aniqlaymiz: dadil, ekspert, zamonaviy, samimiy yoki vazmin.',
      'Faqat sifatlar ro‘yxati bilan to‘xtamaymiz. Aniq chegaralarni belgilaymiz:',
    ],
    contrast: {
      left: 'Biz qanday gapiramiz: aniq, faktlarga asoslangan, xotirjam va professional',
      right: 'Biz qanday gapirmaymiz: balandparvoz, qo‘rqituvchi, bachkana yoki bo‘sh va’dalar bilan',
    },
    result: 'Kompaniyaning barcha kommunikatsiyasida yagona ovoz yangraydi.',
  },
  {
    num: '12',
    title: 'Messaging Pillars',
    subtitle: 'Brend doimiy gapiradigan asosiy g‘oyalar',
    details: [
      'Asosiy ustunlar: muammo, yechim, farqlanish, isbot va natija.',
      'Bu tizim keyinchalik quyidagilar uchun poydevor bo‘ladi:',
      'Marketing kampaniyalari · Kontent rejasi · Sayt matnlari · Taqdimotlar · Sotuv skriptlari',
    ],
    result: 'Marketing va sotuv har safar noldan velosiped ixtiro qilmaydi.',
  },
];

/* ─────────────── 7 Jarayon Bosqichlari ─────────────── */

const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Founder / rahbar intervyusi',
    desc: 'Biznesni rahbar nuqtai nazaridan tushunamiz: kelajak maqsadi, og‘riqli nuqtalar va ambitsiyalar.',
  },
  {
    num: '02',
    title: 'Biznes diagnostikasi',
    desc: 'Mahsulotlar, xizmatlar, daromad manbalari va operatsion realiyat chuqur o‘rganiladi.',
  },
  {
    num: '03',
    title: 'Bozor va raqobatchilar',
    desc: 'Kategoriya qoidalari, asosiy o‘yinchilar va ularning bo‘sh qolgan strategik pozitsiyalari tahlil qilinadi.',
  },
  {
    num: '04',
    title: 'Auditoriya',
    desc: 'Eng muhim mijoz segmentlari, ularning xarid konteksti va JTBD ehtiyojlari aniqlanadi.',
  },
  {
    num: '05',
    title: 'Strategik gipotezalar',
    desc: 'Positioning, value proposition va farqlanish bo‘yicha aniq strategik variantlar shakllantiriladi.',
  },
  {
    num: '06',
    title: 'Strategiya taqdimoti',
    desc: 'Asosiy strategik qarorlar rahbarga interaktiv muhokama va asoslar bilan taqdim etiladi.',
  },
  {
    num: '07',
    title: 'Final hujjatlar',
    desc: 'Yakuniy Brand Strategy Deck, Brand Strategy Map va Creative Brief to‘liq topshiriladi.',
  },
];

/* ─────────────── FAQ Accordion ─────────────── */

const FAQS = [
  {
    q: 'Brand Strategy narxi qancha?',
    a: 'Brand Strategy xizmati narxi 48 000 000 so‘m. Bu yuqori darajadagi B2B strategik xizmat bo‘lib, biznes diagnostikasi, bozor va raqobatchilar tahlili, positioning, value proposition, auditoriya xaritasi, Brand Strategy Deck, Strategy Map va Creative Brief’ni to‘liq o‘z ichiga oladi.',
  },
  {
    q: 'Brand Strategy’dan keyin logo ham kiradimi?',
    a: 'Yo‘q. Brand Strategy alohida strategik xizmat. Naming, Logo, Visual Identity, Brandbook va Packaging alohida xizmatlar hisoblanadi. Strategiya esa aynan shu xizmatlar noldan adashmasdan, to‘g‘ri yo‘nalishda ishlanishi uchun kompas vazifasini bajaradi.',
  },
  {
    q: 'Brand Strategy bilan Brandbook farqi nima?',
    a: 'Brand Strategy — brend bozorda kim bo‘lishini, kim uchun ishlashini va nima deyishini aniqlaydi (Direction). Brandbook esa tayyor bo‘lgan vizual tizimni qanday ishlatish va qanday qoidalarga amal qilishni belgilaydi (Rules). Strategiyasiz Brandbook shunchaki chiroyli qoidalar to‘plami bo‘lib qoladi.',
  },
  {
    q: 'Brand Strategy marketing strategiyasimi?',
    a: 'Yo‘q. Marketing strategiyasi qayerda, qachon va qaysi kanal orqali sotishni (media, byudjet, kampaniyalar) rejalashtiradi. Brand Strategy esa brend bozorda kim bo‘lishi, nima va’da qilishi va qanday farqlanishini belgilaydi. Marketing Brand Strategy bergan yo‘nalish asosida ishlaydi.',
  },
  {
    q: 'Rahbar jarayonda qatnashishi kerakmi?',
    a: 'Ha, albatta. Brand Strategy kompaniya kelajagiga taalluqli bo‘lgani uchun loyihada founder, CEO yoki yakuniy qaror qabul qiluvchi rahbarning ishtiroki shart. Boshlang‘ich chuqur intervyu va oraliq strategik gipotezalar aynan rahbar bilan muhokama qilinadi.',
  },
  {
    q: 'Bizda allaqachon logo bor. Brand Strategy kerak bo‘ladimi?',
    a: 'Ha, ko‘p holatlarda kerak bo‘ladi. Logo bo‘lishi — bozorda aniq o‘ringa ega bo‘lishni anglatmaydi. Agar marketing, sotuv va rahbariyat biznesni har xil tushuntirayotgan bo‘lsa, mavjud logo bo‘lsa ham Brand Strategy biznesning positioning’ini tartibga solib beradi.',
  },
  {
    q: 'Qancha vaqt oladi?',
    a: 'Loyihaning aniq muddati biznes ko‘lami, faoliyat yo‘nalishlari soni va tahlil qilinadigan bozor hajmiga qarab individual belgilanadi va shartnomada qat’iy qayd etiladi.',
  },
];

/* ─────────────── 2-Bosqichli Lead Forma ─────────────── */

interface FormState {
  name: string;
  phone: string;
  company: string;
  activity: string;
  website: string;
  problem: string;
  reason: string;
  isDecisionMaker: string;
}

const BrandStrategyForm: FC<{
  formRef: React.RefObject<HTMLDivElement | null>;
  phoneRef: React.RefObject<HTMLInputElement | null>;
}> = ({ formRef, phoneRef }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [f, setF] = useState<FormState>({
    name: '',
    phone: '',
    company: '',
    activity: '',
    website: '',
    problem: '',
    reason: '',
    isDecisionMaker: 'Ha, yakuniy qaror qiluvchiman',
  });
  const [honeypot, setHoneypot] = useState('');
  const [phoneErr, setPhoneErr] = useState('');
  const [nameErr, setNameErr] = useState('');
  const [submitErr, setSubmitErr] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const formStartedRef = useRef(false);

  const setField = (k: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackEvent({
        action: 'brand_strategy_form_start',
        category: 'Brand Strategy Form',
        label: 'form_start',
        source: SOURCE,
      });
    }
    setF((prev) => ({ ...prev, [k]: e.target.value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    let hasErr = false;
    if (f.name.trim().length < 2) {
      setNameErr('Ismingizni kiriting');
      hasErr = true;
    } else {
      setNameErr('');
    }
    if (!isValidPhone(f.phone)) {
      setPhoneErr('Telefon raqamini to‘g‘ri kiriting (+998...)');
      hasErr = true;
    } else {
      setPhoneErr('');
    }
    if (hasErr) return;

    setStep(2);
    trackEvent({
      action: 'brand_strategy_form_step_2',
      category: 'Brand Strategy Form',
      label: 'step_2_reached',
      source: SOURCE,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitErr('');
    setSending(true);

    const summaryParts = [
      `Xizmat: Brand Strategy (${PRICE})`,
      f.company && `Kompaniya: ${f.company}`,
      f.activity && `Faoliyat: ${f.activity}`,
      f.website && `Sayt/Insta: ${f.website}`,
      f.problem && `Asosiy muammo: ${f.problem}`,
      f.reason && `Strategiya maqsadi: ${f.reason}`,
      f.isDecisionMaker && `Qaror qiluvchi: ${f.isDecisionMaker}`,
    ].filter(Boolean);

    const summary = summaryParts.join(' | ');
    const normalizedPhone = normalizePhone(f.phone);
    const eventId = generateEventId('lead');
    const gaClientId = getGaClientId();
    const pageLocation = typeof window !== 'undefined' ? window.location.href : undefined;

    trackEvent({
      action: 'brand_strategy_form_submit',
      category: 'Brand Strategy Form',
      label: 'form_submitted',
      event_id: eventId,
      source: SOURCE,
      value: PRICE_VALUE,
    });

    trackEvent({
      action: 'brand_strategy_meeting_request',
      category: 'Brand Strategy Lead',
      label: 'meeting_request',
      event_id: eventId,
      source: SOURCE,
      value: PRICE_VALUE,
    });

    let result: { eventId?: string } = {};
    try {
      const res = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: f.name.trim(),
          phone: normalizedPhone,
          role: BRAND_STRATEGY_SERVICE.name,
          packageSummary: summary.slice(0, 900),
          serviceKeys: ['brand-strategy'],
          totalPrice: PRICE_VALUE,
          source: SOURCE,
          lang: 'uz',
          eventId,
          gaClientId,
          pageLocation,
          ctaSource: `${SOURCE}_meeting`,
          companyWebsite: honeypot,
        }),
      });
      result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error('submit failed');
    } catch {
      setSubmitErr('Xatolik yuz berdi. Iltimos qayta urinib ko‘ring yoki to‘g‘ridan-to‘g‘ri qo‘ng‘iroq qiling.');
      setSending(false);
      return;
    }

    trackLead({
      source: SOURCE,
      value: PRICE_VALUE,
      eventId: result.eventId || eventId,
      serverTracked: true,
      gaClientId,
      service: BRAND_STRATEGY_SERVICE.name,
      form_name: SOURCE,
      cta_source: `${SOURCE}_meeting`,
    });

    setSending(false);
    setDone(true);
  };

  const inputCls =
    'w-full rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600/20';

  if (done) {
    return (
      <div
        role="status"
        className="rounded-3xl border border-neutral-200 bg-white p-8 text-center sm:p-12 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)]"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700">
          <Check className="h-7 w-7" />
        </div>
        <p className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
          Arizangiz qabul qilindi!
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-600">
          Brand Strategy bo‘yicha dastlabki ma’lumotlarni o‘rganib, taqdimot va strategik uchrashuv vaqtini kelishish uchun siz bilan bog‘lanamiz.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={formRef}
      id="ariza"
      className="rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-10 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.12)]"
    >
      <div className="mb-8 flex items-center justify-between border-b border-neutral-100 pb-5">
        <div>
          <span className="text-[11px] font-semibold uppercase text-blue-700" style={mono}>
            Ariza formasi · {step}-bosqich / 2
          </span>
          <h3 className="mt-1 text-xl font-bold tracking-tight text-neutral-900">
            {step === 1 ? 'Kontakt ma’lumotlari' : 'Biznes va strategik ehtiyoj'}
          </h3>
        </div>
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
          {PRICE}
        </span>
      </div>

      {step === 1 ? (
        <form onSubmit={handleNextStep} noValidate className="space-y-4">
          <HoneypotField value={honeypot} onChange={setHoneypot} />
          <div>
            <label htmlFor="bs-name" className="mb-1.5 block text-xs font-semibold uppercase text-neutral-600" style={mono}>
              Ismingiz *
            </label>
            <input
              id="bs-name"
              autoComplete="name"
              value={f.name}
              onChange={setField('name')}
              placeholder="Masalan: Baxtiyor"
              className={inputCls}
              aria-invalid={Boolean(nameErr)}
              aria-describedby={nameErr ? 'bs-name-err' : undefined}
            />
            {nameErr && <p id="bs-name-err" className="mt-1 text-xs text-red-600">{nameErr}</p>}
          </div>

          <div>
            <label htmlFor="bs-phone" className="mb-1.5 block text-xs font-semibold uppercase text-neutral-600" style={mono}>
              Telefon raqamingiz *
            </label>
            <input
              id="bs-phone"
              ref={phoneRef}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              value={f.phone}
              onChange={(e) => {
                setField('phone')(e);
                setPhoneErr('');
              }}
              placeholder="+998 90 123 45 67"
              className={inputCls}
              aria-invalid={Boolean(phoneErr)}
              aria-describedby={phoneErr ? 'bs-phone-err' : undefined}
            />
            {phoneErr && <p id="bs-phone-err" className="mt-1 text-xs text-red-600">{phoneErr}</p>}
          </div>

          <div>
            <label htmlFor="bs-company" className="mb-1.5 block text-xs font-semibold uppercase text-neutral-600" style={mono}>
              Kompaniya yoki brend nomi
            </label>
            <input
              id="bs-company"
              value={f.company}
              onChange={setField('company')}
              placeholder="Masalan: Safia, Korzinka yoki yangi loyiha"
              className={inputCls}
            />
          </div>

          <button
            type="submit"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-black py-4 text-sm font-semibold text-white transition-all hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            Keyingi bosqichga o‘tish
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <HoneypotField value={honeypot} onChange={setHoneypot} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="bs-activity" className="mb-1.5 block text-xs font-semibold uppercase text-neutral-600" style={mono}>
                Faoliyat turi / soha
              </label>
              <input
                id="bs-activity"
                value={f.activity}
                onChange={setField('activity')}
                placeholder="Masalan: ishlab chiqarish, retail, fintech"
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="bs-website" className="mb-1.5 block text-xs font-semibold uppercase text-neutral-600" style={mono}>
                Veb-sayt yoki Instagram
              </label>
              <input
                id="bs-website"
                value={f.website}
                onChange={setField('website')}
                placeholder="@brendingiz yoki sayt.uz"
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label htmlFor="bs-problem" className="mb-1.5 block text-xs font-semibold uppercase text-neutral-600" style={mono}>
              Hozirgi asosiy muammo
            </label>
            <textarea
              id="bs-problem"
              rows={2}
              value={f.problem}
              onChange={setField('problem')}
              placeholder="Masalan: Raqobatchilardan farqimiz yo‘qolgan, marketing va sotuv har xil gapiryapti"
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="bs-reason" className="mb-1.5 block text-xs font-semibold uppercase text-neutral-600" style={mono}>
              Brand Strategy nima uchun kerak?
            </label>
            <textarea
              id="bs-reason"
              rows={2}
              value={f.reason}
              onChange={setField('reason')}
              placeholder="Masalan: Yangi bozorga chiqyapmiz yoki to‘liq rebranding qilyapmiz"
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="bs-decision" className="mb-1.5 block text-xs font-semibold uppercase text-neutral-600" style={mono}>
              Qaror qiluvchi shaxs sizmisiz?
            </label>
            <select id="bs-decision" value={f.isDecisionMaker} onChange={setField('isDecisionMaker')} className={inputCls}>
              <option>Ha, yakuniy qaror qiluvchiman (Founder / CEO)</option>
              <option>Marketing yoki tijorat rahbariman</option>
              <option>Boshqaruv jamoasi bilan birgalikda qaror qilamiz</option>
            </select>
          </div>

          {submitErr && <p role="alert" className="text-center text-xs text-red-600">{submitErr}</p>}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-full border border-neutral-200 py-3.5 px-6 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
            >
              Orqaga
            </button>
            <button
              type="submit"
              disabled={sending}
              aria-busy={sending}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-black py-4 text-sm font-semibold text-white transition-all hover:bg-neutral-800 disabled:opacity-60"
            >
              {sending ? 'Yuborilmoqda…' : 'Brand Strategy bo‘yicha uchrashuv belgilash'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

/* ─────────────── Asosiy Sahifa Komponenti ─────────────── */

export const BrandStrategyClient: FC = () => {
  const formRef = useRef<HTMLDivElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    trackEvent({
      action: 'brand_strategy_page_view',
      category: 'Brand Strategy Page',
      label: 'page_view',
      source: SOURCE,
    });
  }, []);

  const scrollToForm = (ctaLabel: string) => {
    trackEvent({
      action: 'brand_strategy_cta_click',
      category: 'Brand Strategy CTA',
      label: ctaLabel,
      source: SOURCE,
    });
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => phoneRef.current?.focus({ preventScroll: true }), 500);
  };

  const scrollToContent = () => {
    trackEvent({
      action: 'brand_strategy_cta_click',
      category: 'Brand Strategy CTA',
      label: 'view_deliverables',
      source: SOURCE,
    });
    document.getElementById('tarkib')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-white text-neutral-950">
      {/* 1. HERO */}
      <section aria-labelledby="bs-hero-heading" className="px-5 pb-16 pt-24 sm:px-8 md:pb-24 md:pt-32">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Eyebrow>BRAND STRATEGY</Eyebrow>
            <h1
              id="bs-hero-heading"
              className="font-bold tracking-tight text-neutral-950"
              style={{ fontSize: 'clamp(34px, 5.2vw, 62px)', letterSpacing: '-0.04em', lineHeight: 1.05 }}
            >
              Brendingiz bozorda qaysi joyni egallashi kerakligini aniqlaymiz
            </h1>
            <p className="mt-6 max-w-[54ch] text-neutral-600" style={{ fontSize: 18, lineHeight: 1.65 }}>
              Kim uchun ishlaysiz, nimasi bilan farqlanasiz, nima va’da qilasiz va odamlar nega aynan sizni tanlashi kerak — bularni bitta strategik tizimga keltiramiz.
            </p>

            <dl className="mt-8 flex flex-wrap items-baseline gap-x-10 gap-y-4 border-t border-neutral-200 pt-6">
              <div>
                <dt className="text-[11px] uppercase text-neutral-400" style={mono}>
                  Strategik xizmat narxi
                </dt>
                <dd className="mt-1 text-3xl font-bold tracking-tight text-neutral-950">{PRICE}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase text-neutral-400" style={mono}>
                  Formati
                </dt>
                <dd className="mt-1 text-base font-semibold text-neutral-800">
                  Rahbar bilan to‘g‘ridan-to‘g‘ri strategik jarayon
                </dd>
              </div>
            </dl>

            <div className="mt-9 flex flex-col gap-3.5 sm:flex-row">
              <PrimaryBtn onClick={() => scrollToForm('hero_primary')}>
                Brand Strategy bo‘yicha uchrashuv
              </PrimaryBtn>
              <SecondaryBtn onClick={scrollToContent}>
                Xizmat tarkibini ko‘rish
              </SecondaryBtn>
            </div>

            <p className="mt-6 max-w-[58ch] text-xs leading-relaxed text-neutral-500">
              Bu 30–40 betlik quruq taqdimot emas — biznesingiz bozorda kim bo‘lishi, kim uchun ishlashi va nima deyishi kerakligini belgilab beradigan tizim.
            </p>
          </div>

          <HeroStrategyMap />
        </div>

        {/* Hero Visual Banner */}
        <div className="mx-auto mt-14 max-w-6xl overflow-hidden rounded-3xl border border-neutral-200/80 bg-neutral-900 shadow-xl">
          <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
            <Image
              src="/images/brand-strategy/hero.jpg"
              alt="Jon Branding — Brand Strategy Boardroom & Executive Deliverables"
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-white sm:bottom-6 sm:left-6 sm:right-6">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-widest text-blue-300">Executive Process</p>
                <p className="text-sm font-semibold sm:text-base">Kompaniya ta’sischilari va top-menejment bilan strategik konsultatsiya</p>
              </div>
              <span className="rounded-full border border-white/20 bg-black/40 px-3.5 py-1 text-[11px] font-mono text-neutral-300 backdrop-blur">
                Jon Branding · Strategy System
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MUAMMO */}
      <Section labelledBy="bs-problem-heading" className="bg-neutral-50 border-y border-neutral-200/80">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <Eyebrow>Muammo</Eyebrow>
            <h2 id="bs-problem-heading" className="font-bold text-neutral-950" style={h2Style}>
              Brend strategiyasiz biznesda nima sodir bo‘ladi?
            </h2>
            <p className="mt-5 text-neutral-600" style={{ fontSize: 16, lineHeight: 1.65 }}>
              Tadbirkorda ko‘pincha:
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm font-medium text-neutral-700">
              {['logo bor', 'Instagram bor', 'reklama ishlayapti', 'sayt bor', 'sotuvchilar ishlayapti'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-neutral-600" style={{ fontSize: 16, lineHeight: 1.65 }}>
              lekin har biri biznesni boshqacha tushuntiradi.
            </p>
          </div>

          {/* Visual flow: Rahbar, Marketing, Sotuvchi, Dizayn -> Mijoz */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
            <p className="mb-4 text-[11px] font-semibold uppercase text-neutral-400" style={mono}>
              Biznesdagi odatiy holat
            </p>
            <div className="space-y-3">
              {[
                { actor: 'Rahbar', says: '«Biz eng innovatsion va sifatlimiz»' },
                { actor: 'Marketing', says: '«Aksiya va arzon narx bilan kelyapmiz»' },
                { actor: 'Sotuvchi', says: '«Mijozga nima kerak bo‘lsa, shuni beramiz»' },
                { actor: 'Dizayn', says: 'Rang-barang va boshqacha taassurot beradi' },
              ].map((row) => (
                <div key={row.actor} className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3 text-sm">
                  <span className="font-bold text-neutral-900">{row.actor}</span>
                  <span className="text-neutral-600">{row.says}</span>
                </div>
              ))}
            </div>

            <div className="my-4 flex justify-center">
              <ArrowDown className="h-5 w-5 text-neutral-400" />
            </div>

            <div className="rounded-2xl border-2 border-dashed border-red-300 bg-red-50/50 p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-red-700" style={mono}>
                Iste’molchi savoli
              </p>
              <p className="mt-1 text-base font-bold text-neutral-900">
                Mijoz: «Siz aslida nimasi bilan boshqachasiz?»
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 rounded-3xl bg-neutral-950 p-8 text-white sm:p-12 shadow-xl">
          <p className="font-bold tracking-tight text-white" style={{ fontSize: 'clamp(22px, 3vw, 34px)', lineHeight: 1.2 }}>
            Muammo logoda emas. Muammo — brendning bozordagi o‘rni aniqlanmaganida.
          </p>
          <p className="mt-4 max-w-3xl text-neutral-300" style={{ fontSize: 17, lineHeight: 1.6 }}>
            Brand Strategy kompaniyaning marketingi, dizayni va kommunikatsiyasi uchun yagona yo‘nalish beradi.
          </p>
        </div>
      </Section>

      {/* 3. ENG MUHIM SAVOL (Minimal qora section) */}
      <section aria-labelledby="bs-core-question" className="bg-black px-5 py-24 text-white sm:px-8 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <Eyebrow light>Eng muhim savol</Eyebrow>
          <h2
            id="bs-core-question"
            className="font-bold tracking-tight text-white"
            style={{ fontSize: 'clamp(32px, 5.5vw, 64px)', letterSpacing: '-0.04em', lineHeight: 1.1 }}
          >
            Nega mijoz bozordagi boshqa variantlar ichidan aynan sizni tanlashi kerak?
          </h2>

          <div className="mx-auto mt-10 max-w-2xl text-left rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-wider text-neutral-400" style={mono}>
              Kompaniyalarning odatiy javoblari:
            </p>
            <ul className="mt-4 space-y-2 text-base text-neutral-300">
              <li className="flex items-center gap-2">
                <span className="text-red-400">✕</span> «Sifatimiz yaxshi»
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400">✕</span> «Professional jamoamiz bor»
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400">✕</span> «Individual yondashamiz»
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400">✕</span> «Narximiz yaxshi»
              </li>
            </ul>
            <p className="mt-6 border-t border-white/10 pt-4 text-sm text-neutral-400 leading-relaxed">
              Agar javobingiz shulardan iborat bo‘lsa, bu hali kuchli positioning emas.
            </p>
          </div>

          <p
            className="mx-auto mt-10 max-w-2xl font-semibold text-blue-400"
            style={{ fontSize: 'clamp(20px, 2.6vw, 28px)', lineHeight: 1.35 }}
          >
            Chunki raqobatchilarning ko‘pi ham aynan shu gaplarni aytadi.
          </p>
        </div>
      </section>

      {/* 4. BRAND STRATEGY NIMA? */}
      <Section labelledBy="bs-what-heading">
        <div className="text-center max-w-3xl mx-auto">
          <Eyebrow>Ta’rif</Eyebrow>
          <h2 id="bs-what-heading" className="font-bold tracking-tight text-neutral-950" style={h2Style}>
            Brand Strategy — biznesning bozor uchun strategik kompasidir
          </h2>
          <p className="mt-4 text-neutral-600" style={{ fontSize: 17, lineHeight: 1.6 }}>
            U biznes qarorlarini bozor tili va mijoz qabul qiladigan qiymatga tarjima qiladi.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {[
            {
              q: 'KIM UCHUN?',
              desc: 'Eng muhim auditoriyani aniqlaymiz.',
              detail: 'Barcha odamlarga birdek sotishga urinmaymiz. Eng yuqori qiymat keltiradigan aniq segmentni belgilaymiz.',
              icon: Target,
            },
            {
              q: 'QANDAY MUAMMONI HAL QILAMIZ?',
              desc: 'Mijoz biznesni nima uchun tanlashini aniqlaymiz.',
              detail: 'Mijozning haqiqiy muammosi, xarid konteksti va qanday natijaga erishmoqchiligini ochib beramiz.',
              icon: Compass,
            },
            {
              q: 'NIMASI BILAN FARQLANAMIZ?',
              desc: 'Raqobatchilar takrorlay olmaydigan yoki ishonchli asosga ega farqni topamiz.',
              detail: 'Quruq so‘zlar emas, biznesning real imkoniyatlariga tayangan haqiqiy afzallikni shakllantiramiz.',
              icon: Sparkles,
            },
            {
              q: 'BOZORDA KIM BO‘LAMIZ?',
              desc: 'Mijoz ongida qaysi pozitsiyani egallash kerakligini belgilaymiz.',
              detail: 'Qaysi kategoriya vakili bo‘lishimiz va qanday assotsiatsiyalar uyg‘otishimiz kerakligini poydevor qilib qo‘yamiz.',
              icon: Layers,
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.q}
                className="flex flex-col rounded-3xl border border-neutral-200 bg-white p-7 sm:p-9 transition-all hover:border-neutral-300 hover:shadow-md"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900" style={{ letterSpacing: '-0.02em' }}>
                  {card.q}
                </h3>
                <p className="mt-2 text-base font-semibold text-blue-900">{card.desc}</p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{card.detail}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-blue-200 bg-blue-50/60 p-6 text-center">
          <p className="text-base font-bold text-blue-950 sm:text-lg">
            Brand Strategy → barcha keyingi brend qarorlarining filtri
          </p>
        </div>
      </Section>

      {/* 5. XIZMAT TARKIBI (12 ta blok grid) */}
      <Section id="tarkib" labelledBy="bs-deliverables-heading" className="bg-neutral-50 border-t border-neutral-200/80">
        <div className="max-w-3xl">
          <Eyebrow>12 ta strategik modul</Eyebrow>
          <h2 id="bs-deliverables-heading" className="font-bold tracking-tight text-neutral-950" style={h2Style}>
            Xizmat tarkibi
          </h2>
          <p className="mt-4 text-neutral-600" style={{ fontSize: 17, lineHeight: 1.6 }}>
            Brand Strategy 12 ta chuqur tahliliy va amaliy blokdan iborat. Har biri biznesning aniq bir savoliga javob beradi.
          </p>
        </div>

        {/* Strategy Documentation Visual */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-neutral-200 bg-white p-3 sm:p-4 shadow-sm">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-neutral-100 sm:aspect-[21/9]">
            <Image
              src="/images/brand-strategy/deck.jpg"
              alt="Brand Strategy Deck Framework — Positioning, Value Proposition & Target Audience"
              fill
              sizes="(max-width: 1200px) 100vw, 1000px"
              className="object-cover object-center"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 pt-3 text-xs text-neutral-500">
            <span className="font-semibold text-neutral-800">Strategik hujjat tarkibi: Bozor xaritasi, Value Proposition va auditoriya segmentatsiyasi</span>
            <span className="font-mono text-[11px] text-neutral-400">Jon Branding · Strategic Framework</span>
          </div>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DELIVERABLES.map((d) => (
            <article
              key={d.num}
              className="flex flex-col rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-7 shadow-sm transition-all hover:border-neutral-300 hover:shadow-md"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[12px] font-bold text-blue-700" style={mono}>
                  {d.num}
                </span>
                <Tag tone="neutral">Modul</Tag>
              </div>

              <h3 className="text-lg font-bold tracking-tight text-neutral-900">{d.title}</h3>
              <p className="mt-1 text-xs font-medium text-neutral-500">{d.subtitle}</p>

              <ul className="mt-5 space-y-2 border-t border-neutral-100 pt-4 text-xs leading-relaxed text-neutral-700">
                {d.details.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 text-blue-600">▪</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {d.formula && (
                <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-xs leading-relaxed font-mono text-neutral-800">
                  {d.formula}
                </div>
              )}

              {d.contrast && (
                <div className="mt-4 space-y-2 rounded-xl bg-neutral-50 p-3 text-xs">
                  <div className="border-b border-neutral-200/60 pb-1.5 text-neutral-500 line-through">
                    {d.contrast.left}
                  </div>
                  <div className="font-semibold text-blue-900">
                    {d.contrast.right}
                  </div>
                </div>
              )}

              {d.layers && (
                <div className="mt-4 space-y-1.5 rounded-xl bg-neutral-50 p-3 text-xs">
                  {d.layers.map((l) => (
                    <div key={l.label}>
                      <span className="font-semibold text-neutral-900">{l.label}: </span>
                      <span className="text-neutral-600">{l.question}</span>
                    </div>
                  ))}
                </div>
              )}

              {d.result && (
                <div className="mt-auto pt-5">
                  <p className="rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-2 text-[11px] font-semibold leading-snug text-blue-950">
                    Natija: {d.result}
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>
      </Section>

      {/* 6. BRAND ARCHITECTURE (Optional modul) */}
      <Section labelledBy="bs-architecture-heading">
        <div className="rounded-3xl border border-neutral-200 bg-neutral-50/70 p-8 sm:p-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Eyebrow>Qo‘shimcha modul</Eyebrow>
              <h2 id="bs-architecture-heading" className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
                Brand Architecture (Brend arxitekturasi)
              </h2>
            </div>
            <Tag tone="neutral">Optional / Ehtiyojga ko‘ra</Tag>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base">
            Agar kompaniyada bir nechta brend, sub-brand, mahsulot liniyalari yoki yangi xizmat yo‘nalishlari bo‘lsa, ularning o‘zaro tizimi va bog‘liqligi ishlab chiqiladi.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { title: 'Master Brand', desc: 'Asosiy kompaniya brendi va markaziy obro‘' },
              { title: 'Sub-brand', desc: 'Alohida auditoriya yoki toifaga yo‘naltirilgan brendlar' },
              { title: 'Product / Service Lines', desc: 'Har bir mahsulot va xizmat oilasining ierarxiyasi' },
            ].map((arch, i) => (
              <div key={arch.title} className="rounded-2xl border border-neutral-200 bg-white p-5 text-center shadow-sm">
                <span className="text-xs font-mono text-neutral-400">0{i + 1}</span>
                <p className="mt-2 font-bold text-neutral-900">{arch.title}</p>
                <p className="mt-1 text-xs text-neutral-500 leading-relaxed">{arch.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-neutral-500">
            * Bu modul har bir loyiha uchun majburiy emas. Agar bitta brend bitta mahsulot bilan ishlayotgan bo‘lsa, ortiqcha murakkablashtirilmaydi.
          </p>
        </div>
      </Section>

      {/* 7. MIJOZ 48 000 000 SO‘MGA NIMA OLADI? */}
      <Section labelledBy="bs-deliverables-doc-heading" className="bg-black text-white">
        <Eyebrow light>{PRICE}ga nima olasiz?</Eyebrow>
        <h2 id="bs-deliverables-doc-heading" className="font-bold tracking-tight text-white" style={h2Style}>
          Strategiya faqat uchrashuv bilan tugamaydi
        </h2>
        <p className="mt-4 max-w-2xl text-neutral-300" style={{ fontSize: 17, lineHeight: 1.6 }}>
          Natijada qo‘lingizda keyingi yillarda butun jamoangiz va pudratchilaringiz uchun bosh qo‘llanma bo‘ladigan 3 ta asosiy strategik hujjat topshiriladi.
        </p>

        {/* Deliverables Mockup Showcase */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-3 sm:p-4 backdrop-blur">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-neutral-900 sm:aspect-[21/9]">
            <Image
              src="/images/brand-strategy/deliverables.jpg"
              alt="Brand Strategy Deliverables Set — Executive Hardcover Book, Strategy Map & Platform Guide"
              fill
              sizes="(max-width: 1200px) 100vw, 1000px"
              className="object-cover object-center"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 pt-3 text-xs text-neutral-400">
            <span className="font-semibold text-white">Qo‘lingizga topshiriladigan jismoniy va raqamli boshqaruv to‘plami</span>
            <span className="font-mono text-[11px] text-blue-300">Executive Deliverables · 2026</span>
          </div>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          <div className="flex flex-col rounded-3xl border border-white/15 bg-white/5 p-7 backdrop-blur">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400" style={mono}>
              01 · Asosiy hujjat
            </span>
            <h3 className="mt-3 text-xl font-bold text-white">Brand Strategy Deck</h3>
            <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
              Professional strategik taqdimot hujjati. Taxminan 30–40+ sahifada biznes, bozor, auditoriya, raqobatchilar, positioning, value proposition, differentiation, brand essence, personality va messaging to‘liq ochib beriladi.
            </p>
            <div className="mt-6 border-t border-white/10 pt-4 text-xs text-neutral-400">
              * Sahifalar soni qat’iy kafolat emas — tarkib loyiha ko‘lamiga qarab belgilanadi.
            </div>
          </div>

          <div className="flex flex-col rounded-3xl border border-blue-500/40 bg-blue-950/30 p-7 backdrop-blur">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-300" style={mono}>
              02 · Bitta sahifada
            </span>
            <h3 className="mt-3 text-xl font-bold text-white">Brand Strategy Map</h3>
            <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
              Butun strategik yo‘nalish bitta ko‘rgazmali xaritada:
            </p>
            <div className="mt-4 space-y-1 rounded-xl bg-black/40 p-3 text-[11px] font-mono text-neutral-300">
              <p>AUDIENCE ↓ PROBLEM</p>
              <p>↓ POSITIONING</p>
              <p>↓ VALUE PROPOSITION</p>
              <p>↓ DIFFERENTIATION</p>
              <p>↓ REASON TO BELIEVE</p>
              <p>↓ BRAND ESSENCE & PERSONALITY</p>
            </div>
            <p className="mt-4 text-xs font-semibold text-blue-200">
              Rahbar 2 daqiqada butun strategik yo‘nalishni ko‘ra oladi.
            </p>
          </div>

          <div className="flex flex-col rounded-3xl border border-white/15 bg-white/5 p-7 backdrop-blur">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400" style={mono}>
              03 · Amaliy ko‘prik
            </span>
            <h3 className="mt-3 text-xl font-bold text-white">Creative Brief</h3>
            <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
              Strategiyani amaliy ishga ulaydigan hujjat. Keyingi Naming, Logo, Visual Identity, Packaging, Website va Marketing ishlari uchun aniq strategik yo‘nalish va vazifalar belgilab beriladi.
            </p>
            <div className="mt-auto border-t border-white/10 pt-5">
              <p className="text-xs font-semibold text-white">
                Strategiya PDF ichida qolib ketmasligi kerak. U keyingi qarorlarga ishlashi kerak.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* 8. OLDIN / KEYIN (Comparison) */}
      <Section labelledBy="bs-comparison-heading">
        <div className="text-center max-w-2xl mx-auto">
          <Eyebrow>O‘zgarish</Eyebrow>
          <h2 id="bs-comparison-heading" className="font-bold tracking-tight text-neutral-950" style={h2Style}>
            Brand Strategy’dan oldin va keyin
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {/* OLDIN */}
          <div className="rounded-3xl border border-red-200 bg-red-50/30 p-7 sm:p-9">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-red-950">Brand Strategy’dan oldin</h3>
              <Tag tone="neutral">Noaniqlik</Tag>
            </div>
            <ul className="space-y-3 text-sm text-neutral-700">
              {[
                '«Hamma bizning mijozimiz» degan noaniq tushuncha',
                '«Sifatimiz yaxshi» degan umumiy gaplar',
                'Raqobatchilardan farq tushunarsiz',
                'Marketing har safar boshqacha gapiradi',
                'Sotuvchi har bir mijozga boshqacha tushuntiradi',
                'Dizayn subyektiv («menga yoqdi / yoqmadi») tanlanadi',
                'Rahbar mayda operatsion qarorlarga doim aralashishga majbur',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* KEYIN */}
          <div className="rounded-3xl border-2 border-neutral-900 bg-white p-7 sm:p-9 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-950">Brand Strategy’dan keyin</h3>
              <Tag tone="blue">Strategik aniqlik</Tag>
            </div>
            <ul className="space-y-3 text-sm text-neutral-800">
              {[
                'Asosiy daromad keltiruvchi auditoriya aniq',
                'Hal qilinayotgan asosiy muammo aniq',
                'Bozordagi positioning aniq belgilangan',
                'Farqlanish real asoslar bilan mustahkamlangan',
                'Mijozga beriladigan asosiy va’da aniq',
                'Marketing va sotuv messaging’i bitta yo‘nalishda',
                'Dizayn va kreativ jamoa uchun aniq Creative Brief bor',
                'Barcha keyingi brend qarorlari uchun filtr mavjud',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* 9. BRAND STRATEGY NIMA EMAS? */}
      <Section labelledBy="bs-not-heading" className="bg-neutral-50 border-y border-neutral-200/80">
        <div className="max-w-2xl">
          <Eyebrow>Tushunmovchiliklarni yo‘qotish</Eyebrow>
          <h2 id="bs-not-heading" className="font-bold tracking-tight text-neutral-950" style={h2Style}>
            Brand Strategy nima emas?
          </h2>
          <p className="mt-4 text-neutral-600" style={{ fontSize: 16, lineHeight: 1.6 }}>
            Ko‘p kompaniyalar brend strategiyasini boshqa sohalar bilan adashtiradi. Chegaralarni aniq belgilaymiz:
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-neutral-200 bg-white p-7">
            <h3 className="text-base font-bold text-neutral-900">Brand Strategy ≠ Marketing Strategy</h3>
            <div className="mt-4 space-y-2 text-sm">
              <p className="rounded-xl bg-blue-50/70 p-3 font-semibold text-blue-950">
                Brand Strategy: Kim bo‘lamiz va nima deymiz?
              </p>
              <p className="rounded-xl bg-neutral-100 p-3 text-neutral-600">
                Marketing Strategy: Qayerda, qachon va qanday sotamiz?
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-7">
            <h3 className="text-base font-bold text-neutral-900">Brand Strategy ≠ Business Strategy</h3>
            <div className="mt-4 text-sm leading-relaxed text-neutral-600">
              Brand Strategy kompaniyaning barcha biznes qarorlarini (moliya, logistika, yuridik) almashtirmaydi. U biznesning bozor va mijoz bilan bog‘lanadigan brend qismini boshqaradi.
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-7">
            <h3 className="text-base font-bold text-neutral-900">Brand Strategy ≠ Visual Identity</h3>
            <div className="mt-4 space-y-2 text-sm">
              <p className="rounded-xl bg-blue-50/70 p-3 font-semibold text-blue-950">
                Brand Strategy: Bozorda kim bo‘lamiz?
              </p>
              <p className="rounded-xl bg-neutral-100 p-3 text-neutral-600">
                Visual Identity: Qanday ko‘rinamiz?
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-7">
            <h3 className="text-base font-bold text-neutral-900">Brand Strategy ≠ Brandbook</h3>
            <div className="mt-4 space-y-2 text-sm">
              <p className="rounded-xl bg-blue-50/70 p-3 font-semibold text-blue-950">
                Brand Strategy: Yo‘nalishni belgilaydi (Direction)
              </p>
              <p className="rounded-xl bg-neutral-100 p-3 text-neutral-600">
                Brandbook: Tayyor vizual tizimni ishlatish qoidalarini belgilaydi (Rules)
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl bg-neutral-900 p-6 text-center text-white">
          <p className="font-mono text-sm tracking-wider uppercase text-neutral-300">
            Strategy → Direction &nbsp;|&nbsp; Identity → Expression &nbsp;|&nbsp; Brandbook → Rules
          </p>
        </div>
      </Section>

      {/* 10. JON BRANDING TIZIMIDA QAYERDA? */}
      <Section labelledBy="bs-system-heading">
        <Eyebrow>Tizimli yondashuv</Eyebrow>
        <h2 id="bs-system-heading" className="font-bold tracking-tight text-neutral-950" style={h2Style}>
          Jon Branding tizimida Brand Strategy qayerda?
        </h2>
        <p className="mt-4 max-w-2xl text-neutral-600" style={{ fontSize: 16, lineHeight: 1.6 }}>
          Strategiya keyingi xizmatlarni almashtirmaydi. Ularga aniq va o‘zgarmas yo‘nalish beradi.
        </p>

        {/* Visual flow 7 xizmat */}
        <div className="mt-10">
          <p className="mb-3 text-xs font-semibold uppercase text-neutral-500" style={mono}>
            Tabiiy strategik ketma-ketlik:
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { name: 'Brand Strategy', main: true },
              { name: 'Naming' },
              { name: 'Logo' },
              { name: 'Visual Identity' },
              { name: 'Brandbook' },
              { name: 'Packaging' },
              { name: 'Patent' },
            ].map((srv, idx) => (
              <div key={srv.name} className="flex items-center gap-2">
                <span
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${
                    srv.main
                      ? 'border-2 border-blue-600 bg-blue-50 text-blue-900 shadow-sm'
                      : 'border border-neutral-200 bg-white text-neutral-800'
                  }`}
                >
                  {srv.name}
                </span>
                {idx < 6 && <span className="text-neutral-400">→</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
          <p className="text-xs font-semibold uppercase text-neutral-400" style={mono}>
            Mavjud brendlar uchun yo‘l:
          </p>
          <p className="mt-2 text-base font-semibold text-neutral-900">
            Brand Audit → Brand Strategy → Rebranding / Identity
          </p>
          <p className="mt-1 text-sm text-neutral-600">
            Agar brendingiz allaqachon mavjud bo‘lsa, avval audit orqali hozirgi holatni ko‘ramiz, keyin positioning’ni qayta ko‘rib chiqamiz.
          </p>
        </div>
      </Section>

      {/* 11. JARAYON (7 bosqich) */}
      <Section labelledBy="bs-process-heading" className="bg-neutral-50 border-t border-neutral-200/80">
        <div className="max-w-2xl">
          <Eyebrow>Qadamlar</Eyebrow>
          <h2 id="bs-process-heading" className="font-bold tracking-tight text-neutral-950" style={h2Style}>
            Ish jarayoni
          </h2>
          <p className="mt-4 text-neutral-600" style={{ fontSize: 16, lineHeight: 1.6 }}>
            Strategiya taxminlarga emas, aniq ketma-ketlik va tadqiqotga asoslanadi.
          </p>
        </div>

        {/* Workshop Collaboration Visual */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-neutral-200 bg-white p-3 sm:p-4 shadow-sm">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-neutral-100 sm:aspect-[21/9]">
            <Image
              src="/images/brand-strategy/workshop.jpg"
              alt="Jon Branding B2B Brand Strategy Workshop with Business Leadership"
              fill
              sizes="(max-width: 1200px) 100vw, 1000px"
              className="object-cover object-center"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 pt-3 text-xs text-neutral-500">
            <span className="font-semibold text-neutral-800">Strategik sessiya: Positioning, JTBD va Messaging ustunlari ustida jonli tahlil</span>
            <span className="font-mono text-[11px] text-neutral-400">Jon Branding · Strategic Workshop</span>
          </div>
        </div>

        <div className="mt-12 space-y-4">
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.num}
              className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-4">
                <span className="font-mono text-base font-bold text-blue-700">{step.num}</span>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">{step.title}</h3>
                  <p className="mt-1 text-sm text-neutral-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 12. KIMLAR UCHUN? */}
      <Section labelledBy="bs-who-heading">
        <div className="max-w-2xl">
          <Eyebrow>Auditoriya</Eyebrow>
          <h2 id="bs-who-heading" className="font-bold tracking-tight text-neutral-950" style={h2Style}>
            Bu xizmat kimlar uchun?
          </h2>
          <p className="mt-4 text-neutral-600" style={{ fontSize: 16, lineHeight: 1.6 }}>
            Brand Strategy bozorga jiddiy qaraydigan va o‘sishni rejalashtirayotgan kompaniyalar uchun mo‘ljallangan:
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'Yangi brend',
              desc: 'Bozorga chiqishdan oldin yo‘nalish va joylashuvni xatosiz aniqlash uchun.',
            },
            {
              title: 'Rebranding',
              desc: 'Faqat tashqi ko‘rinishni emas, kompaniyaning positioning’ini ham qayta ko‘rib chiqish uchun.',
            },
            {
              title: 'O‘sayotgan biznes',
              desc: 'Marketing, sotuv va rahbariyatni bitta umumiy tushuncha va yo‘nalishga keltirish uchun.',
            },
            {
              title: 'Yangi bozor',
              desc: 'Yangi iste’molchi segmenti, yangi hudud yoki eksportga chiqishdan oldin.',
            },
            {
              title: 'Bir nechta yo‘nalish',
              desc: 'Mahsulotlar, xizmatlar yoki sub-brandlar o‘rtasidagi tizimli munosabatni qurish uchun.',
            },
            {
              title: 'Premium segment',
              desc: 'Yuqoriroq narx va qiymatni bozorda asoslash va arzon raqobatdan chiqish uchun.',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm">
              <h3 className="text-lg font-bold text-neutral-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 13. KIMGA HOZIR KERAK EMAS? (Ishonch bo'limi) */}
      <Section labelledBy="bs-not-for-heading" className="bg-neutral-50 border-y border-neutral-200/80">
        <div className="max-w-2xl">
          <Eyebrow>Ochiq munosabat</Eyebrow>
          <h2 id="bs-not-for-heading" className="font-bold tracking-tight text-neutral-950" style={h2Style}>
            Kimga hozir Brand Strategy kerak emas?
          </h2>
          <p className="mt-4 text-neutral-600" style={{ fontSize: 16, lineHeight: 1.6 }}>
            Brand Strategy har bir biznesga shu zahoti kerak emas. Biz hamma loyihani ham bu xizmatga olmaymiz:
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {[
            'Faqat tezkor logo kerak bo‘lgan mikro loyiha',
            'Hali mahsuloti yoki biznes modeli aniqlanmagan boshlang‘ich g‘oya',
            'Strategik qaror qabul qiladigan rahbar jarayonda qatnashmaydigan loyiha',
            'Faqat qisqa muddatli reklama kampaniyasi kerak bo‘lgan biznes',
          ].map((text) => (
            <div key={text} className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-5 text-sm text-neutral-700">
              <span className="text-neutral-400">✕</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-neutral-900 p-6 text-white text-center">
          <p className="text-base font-semibold sm:text-lg">
            Brand Strategy — qaror qabul qilishga tayyor biznes uchun.
          </p>
        </div>
      </Section>

      {/* 14. 48 MILLION NIMAGA? (Objection handling) */}
      <Section labelledBy="bs-price-reason-heading">
        <div className="max-w-3xl">
          <Eyebrow>Biznes qiymati</Eyebrow>
          <h2 id="bs-price-reason-heading" className="font-bold tracking-tight text-neutral-950" style={h2Style}>
            {PRICE} nimaga to‘lanadi?
          </h2>
          <p className="mt-4 text-neutral-600" style={{ fontSize: 17, lineHeight: 1.6 }}>
            Bu xizmatga qanday qarash kerak?
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-7">
            <span className="text-xs font-semibold uppercase text-red-600" style={mono}>
              Noto‘g‘ri framing
            </span>
            <p className="mt-3 text-lg font-bold text-neutral-900">
              «Prezentatsiya uchun 48 million»
            </p>
            <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
              Agar qog‘oz yoki slaydlar soniga qaralsa, bu qimmat ko‘rinishi mumkin.
            </p>
          </div>

          <div className="rounded-3xl border-2 border-blue-600 bg-blue-50/50 p-7">
            <span className="text-xs font-semibold uppercase text-blue-700" style={mono}>
              To‘g‘ri framing
            </span>
            <p className="mt-3 text-lg font-bold text-blue-950">
              «Kompaniyaning keyingi yillardagi brend qarorlariga asos bo‘ladigan strategik tizim uchun»
            </p>
            <p className="mt-2 text-sm text-blue-900/80 leading-relaxed">
              Bu marketing byudjetini behuda sochmaslik, raqobatchi bilan narx urushiga kirmaslik va yagona yo‘nalishda rivojlanish vositasi.
            </p>
          </div>
        </div>

        {/* Value stack */}
        <div className="mt-10 rounded-3xl border border-neutral-200 bg-white p-7 sm:p-9 shadow-sm">
          <p className="mb-4 text-xs font-semibold uppercase text-neutral-400" style={mono}>
            Value Stack — xizmat ichidagi strategik qatlamlar:
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            {[
              'Business diagnosis',
              '+',
              'Market research',
              '+',
              'Competitor analysis',
              '+',
              'Audience JTBD',
              '+',
              'Positioning',
              '+',
              'Value Proposition',
              '+',
              'Differentiation',
              '+',
              'Brand Platform',
              '+',
              'Messaging Pillars',
              '+',
              'Strategy Map',
              '+',
              'Creative Brief',
            ].map((item, i) => (
              <span
                key={i}
                className={
                  item === '+'
                    ? 'text-neutral-400 font-bold'
                    : 'rounded-lg bg-neutral-100 px-3 py-1.5 text-neutral-800'
                }
              >
                {item}
              </span>
            ))}
          </div>
          <p className="mt-6 border-t border-neutral-100 pt-4 text-sm font-medium text-neutral-700">
            Narx sahifalar soniga emas, biznes uchun qabul qilinadigan strategik qarorlar hajmiga bog‘liq.
          </p>
        </div>
      </Section>

      {/* 15. JTBD SECTION (Qora fon) */}
      <section aria-labelledby="bs-jtbd-heading" className="bg-black px-5 py-24 text-white sm:px-8 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <Eyebrow light>Mijozning ichki maqsadi</Eyebrow>
          <blockquote
            id="bs-jtbd-heading"
            className="font-bold tracking-tight text-white leading-tight"
            style={{ fontSize: 'clamp(26px, 4.2vw, 50px)', letterSpacing: '-0.03em' }}
          >
            «Biznesim o‘sayotganida, brendim kim uchun va nimasi bilan boshqalardan farq qilishini aniqlamoqchiman — shunda marketing, sotuv va dizayn bir xil yo‘nalishda ishlaydi.»
          </blockquote>
          <p className="mt-8 text-neutral-400" style={{ fontSize: 18, lineHeight: 1.6 }}>
            Brand Strategy’ning vazifasi — “chiroyli brend” emas, <span className="text-white font-semibold">aniq brend</span> qurishga yordam berish.
          </p>
        </div>
      </section>

      {/* 16. FAQ (Accordion) */}
      <Section labelledBy="bs-faq-heading">
        <div className="max-w-2xl">
          <Eyebrow>FAQ</Eyebrow>
          <h2 id="bs-faq-heading" className="font-bold tracking-tight text-neutral-950" style={h2Style}>
            Ko‘p beriladigan savollar
          </h2>
        </div>

        <div className="mt-12 space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-neutral-200 bg-white transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between p-6 text-left text-base font-bold text-neutral-900"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`ml-4 h-5 w-5 shrink-0 text-neutral-400 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-neutral-100 px-6 pb-6 pt-2 text-sm leading-relaxed text-neutral-600">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* 17. FINAL CTA + LEAD FORMA */}
      <section aria-labelledby="bs-final-cta-heading" className="bg-neutral-950 px-5 py-24 text-white sm:px-8 md:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] items-start">
            <div>
              <Eyebrow light>Keyingi qadam</Eyebrow>
              <h2
                id="bs-final-cta-heading"
                className="font-bold tracking-tight text-white"
                style={{ fontSize: 'clamp(30px, 4.4vw, 54px)', letterSpacing: '-0.04em', lineHeight: 1.1 }}
              >
                Brendingiz qanday ko‘rinishidan oldin, bozorda kim bo‘lishini aniqlang.
              </h2>
              <p className="mt-6 text-neutral-300" style={{ fontSize: 17, lineHeight: 1.65 }}>
                Biznesingizni tushunamiz, bozordagi imkoniyatni topamiz va brendingiz uchun aniq strategik yo‘nalish ishlab chiqamiz.
              </p>

              <dl className="mt-8 border-t border-white/10 pt-6">
                <dt className="text-[11px] uppercase text-neutral-400" style={mono}>
                  Xizmat qiymati
                </dt>
                <dd className="mt-1 text-3xl font-bold tracking-tight text-white">{PRICE}</dd>
              </dl>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <PrimaryBtn dark onClick={() => scrollToForm('final_primary')}>
                  Brand Strategy bo‘yicha uchrashuv
                </PrimaryBtn>
                <SecondaryBtn dark onClick={() => scrollToForm('final_secondary')}>
                  Savolim bor
                </SecondaryBtn>
              </div>

              <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5 text-xs text-neutral-400 leading-relaxed">
                <p className="font-semibold text-neutral-200 mb-1">Jon Branding yondashuvi:</p>
                Biznesingiz operatsion jarayonini tushunmasdan turib chiroyli rasmlar chizmaymiz. Avval strategik aniqlik, keyin esa dizayn.
              </div>
            </div>

            <BrandStrategyForm formRef={formRef} phoneRef={phoneRef} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default BrandStrategyClient;

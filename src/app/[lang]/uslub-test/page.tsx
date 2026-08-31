'use client';

import { useState, useMemo, FC } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Share2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ContactModal from '@/components/contact-modal';
import { event as gtagEvent } from '@/lib/analytics/gtag';

type Type = '01' | '19';

type Option = { text: string; type: Type };
type Question = { question: string; options: [Option, Option] };

const QUESTIONS: Question[] = [
  {
    question: 'Yangi loyiha boshlanganda siz birinchi nima qilasiz?',
    options: [
      { text: 'Tezroq sinab ko‘rib, yo‘lda to‘g‘rilayman', type: '01' },
      { text: 'Avval jarayon va rejasini tushunib olaman', type: '19' },
    ],
  },
  {
    question: 'Kalendaringizda bo‘sh kun paydo bo‘lsa:',
    options: [
      { text: 'Yangi odam, mijoz yoki imkoniyat qidiraman', type: '01' },
      { text: 'Orqada qolgan ishlarimni tartibga solaman', type: '19' },
    ],
  },
  {
    question: 'Jamoada muammo chiqdi:',
    options: [
      { text: 'Odamlar bilan gaplashib tez yechim topaman', type: '01' },
      { text: 'Sabab nima ekanini topib, qayta takrorlanmasligi uchun tizim qilaman', type: '19' },
    ],
  },
  {
    question: 'Yangi biznes g‘oya keldi:',
    options: [
      { text: 'Darrov kim bilan amalga oshirish mumkinligini o‘ylayman', type: '01' },
      { text: 'Avval iqtisodiyoti va jarayonini hisoblayman', type: '19' },
    ],
  },
  {
    question: 'Qaysi ish sizni ko‘proq charchatadi?',
    options: [
      { text: 'Bir xil takrorlanuvchi ish', type: '01' },
      { text: 'Rejasiz va noaniq ish', type: '19' },
    ],
  },
  {
    question: 'Mijoz bilan uchrashuvda:',
    options: [
      { text: 'Vaziyatga qarab improvizatsiya qilaman', type: '01' },
      { text: 'Oldindan struktura va savollar tayyorlayman', type: '19' },
    ],
  },
  {
    question: 'Sizga ko‘proq nima yoqadi?',
    options: [
      { text: 'Yangi narsani boshlash', type: '01' },
      { text: 'Boshlangan ishni ideal tizimga keltirish', type: '19' },
    ],
  },
  {
    question: 'Jamoada yangi imkoniyat paydo bo‘ldi:',
    options: [
      { text: '"Sinab ko‘raylik"', type: '01' },
      { text: '"Avval qanday ishlashini aniqlaylik"', type: '19' },
    ],
  },
  {
    question: 'Hafta oxirida ishlaringiz haqida o‘ylasangiz, ko‘proq nimadan zavq olasiz?',
    options: [
      { text: 'Yangi kelishuv yoki mijoz topganimdan', type: '01' },
      { text: 'Hammasi rejadagidek, tartibli o‘tganidan', type: '19' },
    ],
  },
  {
    question: 'Xodim ishga kech qoldi. Siz:',
    options: [
      { text: 'Gaplashib, vaziyatni tushunib, davom ettiraman', type: '01' },
      { text: 'Qoida va jarimalarni aniq belgilayman', type: '19' },
    ],
  },
  {
    question: 'Sizga qaysi hujjat bilan ishlash osonroq?',
    options: [
      { text: 'Taqdimot, kontseptsiya, g‘oya', type: '01' },
      { text: 'Jadval, byudjet, hisobot', type: '19' },
    ],
  },
  {
    question: 'Loyiha muddati yaqinlashib qoldi, lekin hali ko‘p narsa tugallanmagan:',
    options: [
      { text: 'Tezlashtirib, yo‘l topib bo‘lsa ham yetkazaman', type: '01' },
      { text: 'Nima uchun kechikkanini tahlil qilib, jarayonni tuzataman', type: '19' },
    ],
  },
  {
    question: 'Sizni ko‘proq nima g‘ashingizga tegadi?',
    options: [
      { text: 'Sekin va ortiqcha muhokamali qarorlar', type: '19' },
      { text: 'Tartibsizlik va aniq bo‘lmagan masʼuliyat', type: '01' },
    ],
  },
  {
    question: 'Yangi hamkor yoki investor bilan uchrashuv taklif qilishsa:',
    options: [
      { text: 'Darrov roziman, imkoniyatni sinab ko‘raman', type: '01' },
      { text: 'Avval shartlar va raqamlarni ko‘rib chiqaman', type: '19' },
    ],
  },
  {
    question: 'Sizning ish stolingiz yoki jadvalingiz odatda qanday?',
    options: [
      { text: 'Bir nechta narsa parallel, tez almashinadi', type: '01' },
      { text: 'Aniq tartib bilan, oldindan rejalashtirilgan', type: '19' },
    ],
  },
  {
    question: 'Biznesda eng katta yutuq deb nimani hisoblaysiz?',
    options: [
      { text: 'Katta savdo yoki yangi bozorga chiqish', type: '01' },
      { text: 'Jarayonni odamsiz ham ishlaydigan qilib qo‘yish', type: '19' },
    ],
  },
];

type ResultKey = 'natural01' | 'dominant01' | 'dominant19' | 'natural19';

const RESULTS: Record<ResultKey, {
  title: (pct: number) => string;
  subtitle: string;
  strengths: string[];
  roles: string[];
  slowdowns: string[];
  teamNeed: string;
  teamInsight: string;
}> = {
  natural01: {
    title: (pct) => `${pct}% — 0.1 Visionary`,
    subtitle: 'Sizning tabiiy kuchingiz — yangi imkoniyat va harakatni boshlash.',
    strengths: ['Sotuv va muzokara', 'Networking', 'Yangi loyiha boshlash', 'Tez qaror qabul qilish', 'Risk olish', 'Imkoniyatni ko‘ra bilish'],
    roles: ['Founder', 'Business Development', 'Sales', 'Closer', 'Marketing', 'Partnership', 'Creative Lead'],
    slowdowns: ['Tizim, nazorat va yakunlash sizni tez charchatishi mumkin.'],
    teamNeed: 'Sizga kerak: kuchli 1.9 — Integrator.',
    teamInsight: 'G‘oya va harakat ko‘p, lekin yakunlash, nazorat va barqaror tizim yetishmasligi mumkin.',
  },
  dominant01: {
    title: (pct) => `${pct}% — 0.1 Visionary dominant`,
    subtitle: 'Sizda 0.1 kuchli, lekin kerak bo‘lganda tizim bilan ham ishlay olasiz.',
    strengths: ['Yangi imkoniyatlarni sezish', 'Tez qaror qabul qilish', 'Muzokara va savdo', 'Kerak bo‘lsa tizim bilan ham ishlash'],
    roles: ['Founder', 'Business Development', 'Sales', 'Marketing', 'Partnership'],
    slowdowns: ['Katta tizim va nazoratga uzoq vaqt bag‘ishlash sizni charchatadi.'],
    teamNeed: 'Sizga kerak: yonida kuchli Integrator.',
    teamInsight: 'G‘oya va harakat ko‘p, lekin yakunlash, nazorat va barqaror tizim yetishmasligi mumkin.',
  },
  dominant19: {
    title: (pct) => `${pct}% — 1.9 Integrator dominant`,
    subtitle: 'Siz tizim, nazorat va struktura tarafida kuchliroqsiz, lekin tashabbus ham qila olasiz.',
    strengths: ['Tizimlashtirish', 'Operatsion boshqaruv', 'Deadline va nazorat', 'Kerak bo‘lsa tashabbus ko‘rsatish'],
    roles: ['COO', 'Integrator', 'Project Manager', 'Operations', 'Finance'],
    slowdowns: ['Baʼzan yangi imkoniyatlarga sekinroq kirishasiz.'],
    teamNeed: 'Sizga kerak: yonida kuchli Visionary.',
    teamInsight: 'Tizim ko‘p, lekin yangi pul va yangi imkoniyat olib kiradigan odamlar yetishmasligi mumkin.',
  },
  natural19: {
    title: (pct) => `${pct}% — 1.9 Integrator`,
    subtitle: 'Sizning tabiiy kuchingiz — tartibsizlikni tizimga aylantirish.',
    strengths: ['Tizimlashtirish', 'Operatsion boshqaruv', 'Deadline', 'Nazorat', 'SOP', 'Moliya va raqam', 'Yakunlash'],
    roles: ['COO', 'Integrator', 'Project Manager', 'Finance', 'Operations', 'Administrator', 'Quality Control'],
    slowdowns: ['Juda ko‘p analiz qilib, yangi imkoniyatlarga sekin kirishingiz mumkin.'],
    teamNeed: 'Sizga kerak: kuchli 0.1 — Visionary / Entrepreneur.',
    teamInsight: 'Tizim ko‘p, lekin yangi pul va yangi imkoniyat olib kiradigan odamlar yetishmasligi mumkin.',
  },
};

function getResultKey(pct01: number): ResultKey {
  if (pct01 >= 70) return 'natural01';
  if (pct01 >= 55) return 'dominant01';
  if (pct01 <= 30) return 'natural19';
  if (pct01 <= 45) return 'dominant19';
  return pct01 >= 50 ? 'dominant01' : 'dominant19';
}

const StyleTestPage: FC = () => {
  const params = useParams();
  const lang = (params.lang as string) || 'uz';

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Type[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const total = QUESTIONS.length;

  const handleAnswer = (type: Type) => {
    const next = [...answers];
    next[step] = type;
    setAnswers(next);
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      setShowResult(true);
      gtagEvent('quiz_complete', { event_category: 'StyleTest', event_label: '0.1 vs 1.9' });
    }
  };

  const pct01 = useMemo(() => {
    if (answers.length < total) return 0;
    const count01 = answers.filter((a) => a === '01').length;
    return Math.round((count01 / total) * 100);
  }, [answers, total]);

  const resultKey = getResultKey(pct01);
  const result = RESULTS[resultKey];
  const isNatural01 = resultKey === 'natural01';
  const pctDisplay = isNatural01 || resultKey === 'dominant01' ? pct01 : 100 - pct01;

  const shareText = `Men ${pctDisplay}% ${isNatural01 || resultKey === 'dominant01' ? '0.1' : '1.9'} ekanman! Siz-chi? Testdan o‘ting:`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://www.jonbranding.uz/${lang}/uslub-test`;

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share({ title: 'Siz 0.1misiz yoki 1.9mi?', text: shareText, url: shareUrl });
        return;
      } catch {
        /* fall through to copy */
      }
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const packageSummary = `Uslub testi natijasi: ${pctDisplay}% ${isNatural01 || resultKey === 'dominant01' ? '0.1 (Visionary)' : '1.9 (Integrator)'}`;

  if (!showResult) {
    const q = QUESTIONS[step];
    const progress = ((step + 1) / total) * 100;

    return (
      <div className="flex-grow bg-background min-h-[100dvh]">
        <div className="container mx-auto px-5 py-10 sm:py-16 max-w-2xl">
          <div className="mb-10">
            <div className="flex justify-between items-center mb-3 text-sm font-medium text-foreground/50">
              <span>Siz 0.1misiz yoki 1.9mi?</span>
              <span>{step + 1} / {total}</span>
            </div>
            <div className="h-1 w-full bg-foreground/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-foreground leading-tight mb-8 sm:mb-10">
            {q.question}
          </h1>

          <div className="flex flex-col gap-4">
            {q.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(option.type)}
                className="text-left w-full p-5 sm:p-6 rounded-2xl border-2 border-foreground/10 hover:border-primary hover:bg-primary/5 active:scale-[0.98] transition-all text-base sm:text-lg font-medium text-foreground"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-background min-h-[100dvh]">
      <div className="container mx-auto px-5 py-10 sm:py-20 max-w-2xl">
        <div className="text-center mb-10">
          <p className="text-6xl sm:text-7xl font-extrabold text-foreground tracking-tight mb-4">
            {result.title(pctDisplay)}
          </p>
          <p className="text-lg sm:text-xl text-foreground/70 max-w-lg mx-auto">
            {result.subtitle}
          </p>

          <div className="mt-8 max-w-sm mx-auto">
            <div className="h-3 w-full rounded-full bg-foreground/10 overflow-hidden flex">
              <div className="h-full bg-primary" style={{ width: `${pct01}%` }} />
              <div className="h-full bg-foreground/30" style={{ width: `${100 - pct01}%` }} />
            </div>
            <div className="flex justify-between mt-2 text-sm font-medium text-foreground/50">
              <span>0.1 &mdash; {pct01}%</span>
              <span>1.9 &mdash; {100 - pct01}%</span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 mb-8">
          <div className="p-6 rounded-2xl border-2 border-foreground/10">
            <h3 className="font-bold text-lg mb-3 text-foreground">Kuchli tomonlaringiz</h3>
            <ul className="flex flex-wrap gap-2">
              {result.strengths.map((s) => (
                <li key={s} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-2xl border-2 border-foreground/10">
            <h3 className="font-bold text-lg mb-3 text-foreground">Sizga mos rollar</h3>
            <ul className="flex flex-wrap gap-2">
              {result.roles.map((r) => (
                <li key={r} className="px-3 py-1.5 rounded-full bg-foreground/5 text-foreground text-sm font-medium">
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-2xl border-2 border-foreground/10">
            <h3 className="font-bold text-lg mb-3 text-foreground">Sizni sekinlashtiradigan narsalar</h3>
            <p className="text-foreground/70">{result.slowdowns.join(' ')}</p>
          </div>

          <div className="p-6 rounded-2xl bg-foreground text-background">
            <h3 className="font-bold text-lg mb-3">Komandangizga qaysi tip kerak</h3>
            <p className="opacity-90">{result.teamNeed}</p>
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-primary/5 border-2 border-primary/20 mb-10">
          <div className="flex items-start gap-3">
            <Users className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <p className="font-bold text-foreground mb-1">
                Agar komandangizda sizga o‘xshaganlar juda ko‘p bo‘lsa&hellip;
              </p>
              <p className="text-foreground/70">{result.teamInsight}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={handleShare}
            className="w-full sm:w-auto h-14 rounded-full text-base font-bold border-2"
          >
            <Share2 className="mr-2 h-5 w-5" />
            {copied ? 'Nusxalandi!' : 'Testni ulashish'}
          </Button>
          <Button
            size="lg"
            onClick={() => setModalOpen(true)}
            className="w-full sm:w-auto h-14 rounded-full text-base font-bold"
          >
            Jamoamni tahlil qilish
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <div className="text-center mt-8">
          <Link href={`/${lang}`} className="text-sm text-foreground/50 hover:text-foreground underline underline-offset-4">
            Bosh sahifaga qaytish
          </Link>
        </div>
      </div>

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        packageSummary={packageSummary}
        lang={lang}
      />
    </div>
  );
};

export default StyleTestPage;

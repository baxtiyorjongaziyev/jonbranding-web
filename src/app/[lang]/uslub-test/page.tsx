'use client';

import { useState, useMemo, FC } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Lock, Share2, Users } from 'lucide-react';
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
    question: 'Yangi g‘oya yoki taklif keldi:',
    options: [
      { text: 'Darrov kim bilan amalga oshirish mumkinligini o‘ylayman', type: '01' },
      { text: 'Avval unumi va jarayonini hisoblayman', type: '19' },
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
      { text: 'Sekin va ortiqcha muhokamali qarorlar', type: '01' },
      { text: 'Tartibsizlik va aniq bo‘lmagan masʼuliyat', type: '19' },
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
    question: 'Ishingizda eng katta yutuq deb nimani hisoblaysiz?',
    options: [
      { text: 'Yangi mijoz, hamkor yoki imkoniyat topish', type: '01' },
      { text: 'Jarayonni sizsiz ham ishlaydigan qilib qo‘yish', type: '19' },
    ],
  },
];

type ResultKey = 'natural01' | 'dominant01' | 'dominant19' | 'natural19';

const RESULTS: Record<ResultKey, {
  title: (pct: number) => string;
  subtitle: string;
  strengthsIntro: string;
  strengths: string[];
  rolesIntro: string;
  roles: string[];
  slowdownsIntro: string;
  slowdowns: string[];
  teamNeedTitle: string;
  teamNeed: string;
  teamInsight: string;
}> = {
  natural01: {
    title: (pct) => `${pct}% — 0.1 Visionary`,
    subtitle: 'Sizning tabiiy kuchingiz — yangi imkoniyat va harakatni boshlash. Siz hayajon va tezlik bilan yashaysiz, boshqalar hali o‘ylab turganda siz allaqachon yo‘lda bo‘lasiz.',
    strengthsIntro: 'Sizda tabiiy ravishda kuchli:',
    strengths: ['Sotuv va muzokara', 'Networking', 'Yangi loyiha boshlash', 'Tez qaror qabul qilish', 'Risk olish', 'Imkoniyatni ko‘ra bilish'],
    rolesIntro: 'Bu uslub bilan siz eng ko‘p qiymatni shu rollarda yaratasiz:',
    roles: ['Founder', 'Business Development', 'Sales', 'Closer', 'Marketing', 'Partnership', 'Creative Lead'],
    slowdownsIntro: 'Lekin bu kuch bir narsani yashiradi:',
    slowdowns: ['Tizim, nazorat va yakunlash sizni tez charchatishi mumkin — g‘oya 10 ta, lekin oxirigacha yetgani 2 ta bo‘lishi mumkin. Buning oqibati: mijozlar tushib qoladi, sifat notekis bo‘ladi, jamoa sizdan keyingi qadamni kutib qoladi.'],
    teamNeedTitle: 'Komandangizga qaysi tip kerak',
    teamNeed: 'Sizga kerak — kuchli 1.9 Integrator: sizning g‘oyalaringizni ushlab qolib, oxirigacha yetkazadigan, tizim va nazoratni qo‘lga oladigan odam.',
    teamInsight: 'G‘oya va harakat ko‘p, lekin yakunlash, nazorat va barqaror tizim yetishmasligi mumkin — natijada bir xil xatolar qaytarilaveradi, sifat odamga qarab o‘zgaradi va ish jarayoni sizsiz to‘xtab qoladi.',
  },
  dominant01: {
    title: (pct) => `${pct}% — 0.1 Visionary dominant`,
    subtitle: 'Sizda 0.1 kuchli, lekin kerak bo‘lganda tizim bilan ham ishlay olasiz — bu sizni ancha moslashuvchan qiladi.',
    strengthsIntro: 'Sizda tabiiy ravishda kuchli:',
    strengths: ['Yangi imkoniyatlarni sezish', 'Tez qaror qabul qilish', 'Muzokara va savdo', 'Kerak bo‘lsa tizim bilan ham ishlash'],
    rolesIntro: 'Bu uslub bilan siz eng ko‘p qiymatni shu rollarda yaratasiz:',
    roles: ['Founder', 'Business Development', 'Sales', 'Marketing', 'Partnership'],
    slowdownsIntro: 'Lekin bu kuch bir narsani yashiradi:',
    slowdowns: ['Katta tizim va uzoq nazoratga vaqt sarflash sizni charchatadi — shuning uchun ko‘pincha yaxshi jarayonlar boshlab, oxirigacha etkazilmay qoladi.'],
    teamNeedTitle: 'Komandangizga qaysi tip kerak',
    teamNeed: 'Sizga kerak — yonida kuchli Integrator: siz olib kelgan imkoniyatlarni tizimga aylantiradigan odam.',
    teamInsight: 'G‘oya va harakat ko‘p, lekin yakunlash, nazorat va barqaror tizim yetishmasligi mumkin — bu tez o‘sishni sekinlashtiradigan asosiy omil.',
  },
  dominant19: {
    title: (pct) => `${pct}% — 1.9 Integrator dominant`,
    subtitle: 'Siz tizim, nazorat va struktura tarafida kuchliroqsiz, lekin tashabbus ham qila olasiz — bu kamdan-kam uchraydigan muvozanat.',
    strengthsIntro: 'Sizda tabiiy ravishda kuchli:',
    strengths: ['Tizimlashtirish', 'Operatsion boshqaruv', 'Deadline va nazorat', 'Kerak bo‘lsa tashabbus ko‘rsatish'],
    rolesIntro: 'Bu uslub bilan siz eng ko‘p qiymatni shu rollarda yaratasiz:',
    roles: ['COO', 'Integrator', 'Project Manager', 'Operations', 'Finance'],
    slowdownsIntro: 'Lekin bu kuch bir narsani yashiradi:',
    slowdowns: ['Ba’zan yangi imkoniyatlarga sekinroq kirishasiz — raqamlar va tartib hali aniq bo‘lmagan g‘oyani "yo‘q" deb qaytarib yuborishi mumkin.'],
    teamNeedTitle: 'Komandangizga qaysi tip kerak',
    teamNeed: 'Sizga kerak — yonida kuchli Visionary: yangi g‘oya va yangi imkoniyatlarni doimiy olib keladigan odam.',
    teamInsight: 'Tizim ko‘p, lekin yangi g‘oya va yangi imkoniyat olib kiradigan odamlar yetishmasligi mumkin — bu esa o‘sishni to‘xtatib, faqat "saqlab qolish" rejimida ushlab turadi.',
  },
  natural19: {
    title: (pct) => `${pct}% — 1.9 Integrator`,
    subtitle: 'Sizning tabiiy kuchingiz — tartibsizlikni tizimga aylantirish. Boshqalar tartibsizlikdan qochsa, siz aynan shu yerda ishlaysiz — va yaxshi ishlaysiz.',
    strengthsIntro: 'Sizda tabiiy ravishda kuchli:',
    strengths: ['Tizimlashtirish', 'Operatsion boshqaruv', 'Deadline', 'Nazorat', 'SOP', 'Moliya va raqam', 'Yakunlash'],
    rolesIntro: 'Bu uslub bilan siz eng ko‘p qiymatni shu rollarda yaratasiz:',
    roles: ['COO', 'Integrator', 'Project Manager', 'Finance', 'Operations', 'Administrator', 'Quality Control'],
    slowdownsIntro: 'Lekin bu kuch bir narsani yashiradi:',
    slowdowns: ['Juda ko‘p analiz qilib, yangi imkoniyatlarga sekin kirishingiz mumkin — raqam va tizim to‘liq aniq bo‘lgunicha "yo‘q" deb javob berish odat bo‘lib qolishi mumkin, va shu payt raqobatchi tezroq harakat qiladi.'],
    teamNeedTitle: 'Komandangizga qaysi tip kerak',
    teamNeed: 'Sizga kerak — kuchli 0.1 Visionary: yangi mijoz, yangi imkoniyat va yangi g‘oya olib keladigan odam.',
    teamInsight: 'Tizim ko‘p, lekin yangi imkoniyat va yangi g‘oya olib kiradigan odamlar yetishmasligi mumkin — bu o‘sishni emas, faqat mavjud holatni saqlab turadi.',
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
  const [finished, setFinished] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
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
      setFinished(true);
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

  const handleUnlock = () => {
    setUnlocked(true);
    gtagEvent('form_submit', { event_category: 'StyleTest', event_label: 'Result unlocked', value: pctDisplay });
  };

  if (!finished) {
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

  if (!unlocked) {
    return (
      <div className="flex-grow bg-background min-h-[100dvh]">
        <div className="container mx-auto px-5 py-16 sm:py-24 max-w-xl text-center">
          <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-4">
            Sizning natijangiz tayyor
          </h1>
          <p className="text-lg text-foreground/70 mb-10">
            16 ta javobingiz asosida siz qaysi ish uslubga ko‘proq moyilligingiz — Visionary (0.1) yoki Integrator (1.9) — aniqlandi. Bu qaysi sohada ishlashingizdan qat’i nazar amal qiladi. Natijani, kuchli tomonlaringizni va jamoangizga qaysi tip kerakligini ko‘rish uchun aloqa maʼlumotingizni qoldiring.
          </p>
          <Button
            size="lg"
            onClick={() => setModalOpen(true)}
            className="w-full sm:w-auto h-14 rounded-full text-base font-bold px-10"
          >
            Natijamni ko‘rish
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        <ContactModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onFormSubmitSuccess={handleUnlock}
          packageSummary={packageSummary}
          lang={lang}
        />
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
            <p className="text-sm text-foreground/60 mb-3">{result.strengthsIntro}</p>
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
            <p className="text-sm text-foreground/60 mb-3">{result.rolesIntro}</p>
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
            <p className="text-sm text-foreground/60 mb-2">{result.slowdownsIntro}</p>
            <p className="text-foreground/70">{result.slowdowns.join(' ')}</p>
          </div>

          <div className="p-6 rounded-2xl bg-foreground text-background">
            <h3 className="font-bold text-lg mb-3">{result.teamNeedTitle}</h3>
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
          <Button asChild size="lg" className="w-full sm:w-auto h-14 rounded-full text-base font-bold">
            <Link href={`/${lang}/aloqa`}>
              Jamoamni tahlil qilish
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        <div className="text-center mt-8">
          <Link href={`/${lang}`} className="text-sm text-foreground/50 hover:text-foreground underline underline-offset-4">
            Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StyleTestPage;

import type { ReactNode } from 'react';
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  GitBranch,
  MessageSquareQuote,
  ShieldCheck,
  Target,
  XCircle,
} from 'lucide-react';

type Technique = {
  id: string;
  name: string;
  short: string;
  purpose: string;
  when: string;
  formula: string[];
  wrong: string;
  strong: string;
  next: string;
};

const TECHNIQUES: Technique[] = [
  {
    id: 'spin',
    name: 'SPIN',
    short: 'Savol bilan muammoni mijozning o‘ziga anglatish',
    purpose: 'Mijoz “kerak emas”, “qimmat”, “keyin qilaman” deganda, tortishmasdan ehtiyojni chuqurlashtirish.',
    when: 'Mijoz muammoning qiymatini hali his qilmaganida.',
    formula: [
      'S — Situation: hozirgi holatni biling',
      'P — Problem: muammoni oching',
      'I — Implication: oqibatini kattalashtiring',
      'N — Need-payoff: yechimning foydasini mijozning o‘ziga ayttiring',
    ],
    wrong: '“880 ming qimmat emas, bu normal narx.”',
    strong:
      '“Nomni qancha vaqtdan beri ishlatyapsiz? Logo, qadoq yoki reklama uchun mablag‘ sarflaganmisiz? Agar keyin nomni almashtirishga to‘g‘ri kelsa, sizga qaysi xarajat eng ko‘p zarar qiladi? Shu riskni oldindan bilish foydali bo‘larmidi?”',
    next: '“Agar riskni oldindan bilsak, ekspert xulosaga o‘tishga tayyormisiz?”',
  },
  {
    id: 'crq',
    name: 'Clarify → Reframe → Question',
    short: 'E’tirozni aniqlash, ma’nosini qayta ramkalash va savol bilan boshqarish',
    purpose: 'Mijozning asl xavotirini topish va suhbatni himoyalanishdan diagnostikaga o‘tkazish.',
    when: '“Qimmat”, “pulim kuyadimi?”, “boshqa joy bepul” kabi e’tirozlarda.',
    formula: [
      'Clarify — “Sizni to‘g‘ri tushundimmi...?”',
      'Reframe — mahsulotni boshqa qiymat orqali ko‘rsating',
      'Question — keyingi savol bilan suhbatni davom ettiring',
    ],
    wrong: '“Yo‘q, pulingiz kuymaydi.”',
    strong:
      '“Sizni to‘g‘ri tushundimmi: 880 ming to‘lab, oxirida nom xavfli chiqib qolishidan xavotirdamisiz? Ekspert xulosaning vazifasi nomni ‘bo‘sh chiqarish’ emas, aynan shu riskni oldindan aniqlash. Riskni patentga katta mablag‘ sarflashdan oldin bilish siz uchun muhimmi?”',
    next: '“Siz uchun asosiy xavotir narxmi yoki natijaning noaniqligimi?”',
  },
  {
    id: 'fab',
    name: 'FAB',
    short: 'Xususiyatni emas, mijoz oladigan foydani sotish',
    purpose: 'Texnik terminlarni biznes qiymatiga aylantirish.',
    when: 'Mijoz “Nimaga pul to‘layman?” deganda.',
    formula: [
      'Feature — nima qilamiz',
      'Advantage — bu nimani yaxshilaydi',
      'Benefit — mijozga qanday foyda beradi',
    ],
    wrong: '“Klasslarni tekshiramiz va o‘xshash nomlarni ko‘ramiz.”',
    strong:
      '“Kerakli klasslarni aniqlaymiz → tekshiruv noto‘g‘ri yo‘nalishda ketmaydi → siz patentga va brendga katta mablag‘ sarflashdan oldin real riskni bilasiz.”',
    next: '“Siz uchun eng muhim natija qaysi: nomni himoya qilishmi yoki keyingi xarajatlarni xavfsiz qilishmi?”',
  },
  {
    id: 'jtbd',
    name: 'JTBD',
    short: 'Mijoz xizmatni emas, hal bo‘ladigan ishni sotib oladi',
    purpose: 'Xizmat nomidan chiqib, mijoz aslida nimaga erishmoqchi ekanini ko‘rsatish.',
    when: 'Xizmat “qimmat” yoki “keraksiz” ko‘ringanda.',
    formula: [
      'Qachon — mijoz qaysi vaziyatda?',
      'Men xohlayman — qanday ish bajarilishi kerak?',
      'Shunda — qanday biznes natija oladi?',
    ],
    wrong: '“Ekspert tekshiruv — 880 000 so‘m.”',
    strong:
      '“Siz 880 mingga qidiruv sotib olmayapsiz. Nomga logo, qadoq, reklama va boshqa katta mablag‘ sarflashdan oldin shu nom bilan davom etishdagi riskni bilib olyapsiz.”',
    next: '“Hozir shu nomga qaysi ishlarni qilib bo‘lgansiz?”',
  },
  {
    id: 'laer',
    name: 'LAER',
    short: 'E’tiroz bilan tortishmasdan ishlash',
    purpose: 'Mijozni himoyalanishga majbur qilmasdan asl sababni topish.',
    when: 'Raqobatchi, narx, ishonch yoki salbiy tajriba haqidagi e’tirozlarda.',
    formula: [
      'Listen — oxirigacha eshiting',
      'Acknowledge — e’tirozni tan oling',
      'Explore — sababni oching',
      'Respond — faqat keyin javob bering',
    ],
    wrong: '“Boshqalar bepul qilsa, sifati yaxshi emas.”',
    strong:
      '“Tushundim, bepul tekshiruv borligi siz uchun muhim. Siz uchun asosiy savol narxmi yoki tekshiruvdan qanday natija olishmi? Bizda umumiy tekshiruv bepul, ekspert xulosada esa klasslar, o‘xshash belgilar, risk va keyingi qadam chuqur tahlil qilinadi.”',
    next: '“Sizga dastlabki tekshiruv yetadimi yoki patentga topshirishdan oldin aniqroq xulosa kerakmi?”',
  },
  {
    id: 'contrast',
    name: 'Contrast',
    short: 'Ikki variantni yonma-yon ko‘rsatib qiymatni tushuntirish',
    purpose: 'Narxni yolg‘iz raqam sifatida emas, alternativalar bilan ko‘rsatish.',
    when: 'Mijoz xizmatlar o‘rtasidagi farqni ko‘rmayotganda.',
    formula: [
      'Variant A — arzon/bepul, nimani beradi?',
      'Variant B — pullik, nimani qo‘shimcha beradi?',
      'Farq — mijoz uchun qaysi risk yoki natijani o‘zgartiradi?',
    ],
    wrong: '“Ekspert tekshiruv yaxshiroq.”',
    strong:
      '“Umumiy tekshiruv — bepul, dastlabki screening. Ekspert xulosa — 880 ming, unda faoliyat, klasslar, o‘xshash belgilar, risk darajasi va keyingi qadam bo‘yicha mutaxassis xulosasi bor.”',
    next: '“Sizga hozir dastlabki screening yetadimi yoki topshirish qarorini qabul qilish uchun chuqur xulosa kerakmi?”',
  },
  {
    id: 'conditional-close',
    name: 'Conditional Close',
    short: 'Bitta to‘siq qolgan-qolmaganini tekshirish',
    purpose: 'Mijozning haqiqiy e’tirozini ochish va qarorga yaqinlashtirish.',
    when: 'Mijozda bitta aniq e’tiroz qolgandek ko‘ringanda.',
    formula: [
      '“Agar X hal bo‘lsa...”',
      '“...boshlashga tayyormisiz?”',
      'Yangi e’tiroz chiqsa — diagnostikaga qayting',
    ],
    wrong: '“Unda to‘lov qilasizmi?”',
    strong:
      '“Agar ekspert xulosada sizga klasslar, risk darajasi va keyingi qadam yozma ko‘rsatilsa, boshlashga tayyormisiz?”',
    next: '“Bundan tashqari qaror qilishingizga yana nima to‘sqinlik qilyapti?”',
  },
  {
    id: 'micro-commitment',
    name: 'Micro-commitment',
    short: 'Katta qarorni kichik keyingi qadamlarga bo‘lish',
    purpose: 'Mijozni bosimsiz oldinga siljitish.',
    when: 'Mijoz hali to‘liq xizmatga tayyor bo‘lmaganda.',
    formula: [
      '1-qadam — nom va faoliyatni aniqlash',
      '2-qadam — umumiy tekshiruv',
      '3-qadam — ekspert xulosa',
      '4-qadam — patentga topshirish',
    ],
    wrong: '“Patent qilamizmi?”',
    strong:
      '“Avval brend nomingiz va qaysi mahsulot/xizmatlar uchun ishlatishingizni aniqlab olaylik. Keyin sizga qaysi tekshiruv kerakligini aytamiz.”',
    next: '“Brend nomingizni yubora olasizmi?”',
  },
];

const OBJECTIONS = [
  {
    objection: '“880 ming qimmat.”',
    techniques: 'SPIN + CRQ + JTBD',
    answer:
      '“Tushunaman. Siz uchun 880 ming katta ko‘rinayotganining sababi tekshiruv natijasi noaniq ko‘rinayotganidami yoki umuman tekshiruvga pul to‘lash keraksizdek tuyulyaptimi? Ekspert xulosaning vazifasi — nomga katta mablag‘ sarflashdan oldin riskni bilish.”',
    next: '“Hozir shu nomga qaysi ishlarni qilib bo‘lgansiz?”',
  },
  {
    objection: '“Band bo‘lsa pulim kuyadimi?”',
    techniques: 'CRQ + FAB',
    answer:
      '“Siz 880 mingni nom ‘bo‘sh chiqishi’ uchun emas, mutaxassis tahlili uchun to‘laysiz. Agar nom xavfli chiqsa, tekshiruv aynan sizni patent, logo, qadoq va reklama uchun kattaroq xarajat qilishdan oldin ogohlantirgan bo‘ladi.”',
    next: '“Riskni oldindan bilish siz uchun qanchalik muhim?”',
  },
  {
    objection: '“Boshqa joy bepul tekshiradi.”',
    techniques: 'LAER + Contrast',
    answer:
      '“To‘g‘ri, dastlabki tekshiruv bepul bo‘lishi mumkin. Bizda ham umumiy tekshiruv bepul. Ekspert xulosa esa boshqa daraja: faoliyat, klasslar, o‘xshash belgilar, risk va keyingi qadam chuqur tahlil qilinadi.”',
    next: '“Sizga screening kerakmi yoki patentga topshirish qarori uchun chuqur xulosa kerakmi?”',
  },
  {
    objection: '“Avval ko‘ringlar, band bo‘lmasa keyin to‘laymiz.”',
    techniques: 'Contrast + Micro-commitment',
    answer:
      '“Umumiy dastlabki tekshiruvni bepul qilamiz. Agar chuqur tahlil kerak bo‘lsa, ekspert xulosaga o‘tamiz. Undagi to‘lov natijani ‘bo‘sh qilish’ uchun emas, mutaxassisning to‘liq tahlili uchun.”',
    next: '“Avval umumiy tekshiruv uchun nom va faoliyatingizni aniqlab olaylikmi?”',
  },
  {
    objection: '“Patent qancha turadi?”',
    techniques: 'EVQN + Micro-commitment',
    answer:
      '“Aniq hisob berishdan oldin bir nechta narsani aniqlab olay: brend nomingiz nima, qaysi mahsulot yoki xizmatlar uchun ishlatasiz, oldin tekshirilganmi va faqat nomni himoya qilasizmi yoki logoni ham?”',
    next: '“Brend nomingiz nima?”',
  },
  {
    objection: '“O‘ylab ko‘raman.”',
    techniques: 'LAER + Conditional Close',
    answer:
      '“Albatta. To‘g‘ri qaror qilishingiz uchun aniqlab olay: aynan qaysi qismni o‘ylab ko‘rmoqchisiz — narxni, xizmat kerakligini yoki natijaga ishonchni?”',
    next: '“Agar shu savolga aniq javob bersak, qaror qilish osonlashadimi?”',
  },
];

function SectionTitle({
  index,
  eyebrow,
  title,
  description,
  dark = false,
}: {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  dark?: boolean;
}) {
  return (
    <div className={`mb-8 border-b pb-6 ${dark ? 'border-white/10' : 'border-slate-200'}`}>
      <div className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
        <span>{index}</span>
        <span className="h-px w-8 bg-blue-600" />
        <span>{eyebrow}</span>
      </div>
      <h2 className={`max-w-4xl text-3xl font-bold tracking-tight sm:text-4xl ${dark ? 'text-white' : 'text-slate-950'}`}>{title}</h2>
      {description ? <p className={`mt-3 max-w-3xl text-base leading-7 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{description}</p> : null}
    </div>
  );
}

function FormulaStep({ children, number }: { children: ReactNode; number: number }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
        {number}
      </span>
      <p className="text-sm font-medium leading-6 text-slate-800">{children}</p>
    </div>
  );
}

export default function SalesTechniquesPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-20">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_.7fr] lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
                <Target className="h-3.5 w-3.5" />
                Jon Branding Sales Playbook
              </div>
              <h1 className="max-w-5xl text-4xl font-bold tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-7xl">
                Savolga javob bermang. <span className="text-blue-600">Suhbatni boshqaring.</span>
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
                Bu sahifa sotuvchiga mijoz e’tiroziga oddiy javob berish o‘rniga qaysi texnikani tanlash,
                qanday savol berish va suhbatni keyingi qadamga olib borishni ko‘rsatadi.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-blue-300">
                <ShieldCheck className="h-4 w-4" />
                Asosiy qoida
              </div>
              <p className="text-xl font-semibold leading-8">
                Sotuvchining vazifasi mijozni “yengish” emas. Muammoni to‘g‘ri tushunib, mos keyingi qadamga olib borish.
              </p>
            </div>
          </div>
        </div>
      </section>

      <nav className="sticky top-16 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          {[
            ['formula', 'Universal formula'],
            ['techniques', '8 texnika'],
            ['objections', 'Real e’tirozlar'],
            ['evqn', 'EVQN'],
            ['red-zone', 'Qizil zona'],
          ].map(([id, label]) => (
            <a
              key={id}
              href={'#' + id}
              className="whitespace-nowrap rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <section id="formula" className="scroll-mt-32 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            index="01"
            eyebrow="Default formula"
            title="Har bir e’tirozga 7 bosqichli javob"
            description="Menejer nimani aytishni bilmay qolsa, shu ketma-ketlikka qaytadi."
          />
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {[
              'E’tirozni tan ol',
              'Aniqlashtir',
              'Savol ber',
              'Muammoning oqibatini och',
              'Foydaga qayta ramkala',
              'Dalil yoki kontrast ber',
              'Keyingi qadamga olib bor',
            ].map((step, index) => (
              <FormulaStep key={step} number={index + 1}>
                {step}
              </FormulaStep>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
              <div className="mb-4 flex items-center gap-2 font-semibold text-red-700">
                <XCircle className="h-5 w-5" />
                Operator javobi
              </div>
              <p className="text-lg font-semibold text-slate-950">Mijoz: “880 ming qimmat.”</p>
              <blockquote className="mt-4 border-l-2 border-red-300 pl-4 text-slate-700">
                “Yo‘q, qimmat emas. Bizda sifatli tekshiruv.”
              </blockquote>
            </div>
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
              <div className="mb-4 flex items-center gap-2 font-semibold text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
                Konsultativ sotuv
              </div>
              <p className="text-lg font-semibold text-slate-950">Mijoz: “880 ming qimmat.”</p>
              <blockquote className="mt-4 border-l-2 border-emerald-300 pl-4 leading-7 text-slate-700">
                “Tushunaman. Siz uchun katta ko‘rinayotganining sababi natija noaniq ko‘rinayotganidami yoki umuman
                tekshiruvga pul to‘lash keraksizdek tuyulyaptimi?”
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <section id="techniques" className="scroll-mt-32 border-y border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            index="02"
            eyebrow="Sales techniques"
            title="8 ta asosiy texnika"
            description="Skriptni yodlash emas — vaziyatga qarab to‘g‘ri fikrlash usulini tanlash."
          />

          <div className="grid gap-5 lg:grid-cols-2">
            {TECHNIQUES.map((technique, index) => (
              <article key={technique.id} id={technique.id} className="scroll-mt-32 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-7">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <span className="font-mono text-xs font-semibold text-blue-600">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-2 text-2xl font-bold tracking-tight">{technique.name}</h3>
                    <p className="mt-2 text-sm font-medium text-blue-700">{technique.short}</p>
                  </div>
                  <Brain className="h-6 w-6 shrink-0 text-slate-400" />
                </div>

                <div className="space-y-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Maqsad</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{technique.purpose}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Qachon ishlatiladi</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{technique.when}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Formula</p>
                    <div className="mt-2 space-y-2">
                      {technique.formula.map((item) => (
                        <div key={item} className="flex gap-2 text-sm leading-6 text-slate-700">
                          <ChevronRight className="mt-1.5 h-3.5 w-3.5 shrink-0 text-blue-600" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                    <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-red-700">
                      <XCircle className="h-3.5 w-3.5" /> Noto‘g‘ri
                    </p>
                    <p className="text-sm leading-6 text-slate-700">{technique.wrong}</p>
                  </div>

                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Kuchli javob
                    </p>
                    <p className="text-sm leading-6 text-slate-700">{technique.strong}</p>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl bg-slate-950 p-4 text-white">
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Keyingi savol</p>
                      <p className="mt-1 text-sm leading-6">{technique.next}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="objections" className="scroll-mt-32 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            index="03"
            eyebrow="Real objections"
            title="Jon Branding’dagi real e’tirozlar"
            description="Har bir javobdan oldin qaysi texnika ishlatilayotganiga e’tibor bering."
          />

          <div className="space-y-4">
            {OBJECTIONS.map((item, index) => (
              <details key={item.objection} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6">
                  <div className="flex min-w-0 items-start gap-4">
                    <span className="font-mono text-xs font-semibold text-blue-600">{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className="text-lg font-bold text-slate-950 sm:text-xl">{item.objection}</h3>
                      <p className="mt-1 text-sm font-medium text-blue-700">{item.techniques}</p>
                    </div>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-xl transition group-open:rotate-45 group-open:bg-blue-600 group-open:text-white">
                    +
                  </span>
                </summary>
                <div className="border-t border-slate-200 p-5 sm:p-6">
                  <div className="grid gap-5 lg:grid-cols-[1fr_.55fr]">
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Kuchli javob</p>
                      <p className="text-base leading-7 text-slate-700">{item.answer}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-950 p-4 text-white">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Keyingi savol</p>
                      <p className="mt-2 text-sm leading-6">{item.next}</p>
                    </div>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="evqn" className="scroll-mt-32 border-y border-slate-200 bg-slate-950 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            index="04"
            eyebrow="Qualification"
            title="Texnika ≠ kvalifikatsiya. EVQN doim qoladi."
            description="SPIN, FAB yoki LAER suhbatni boshqaradi. EVQN esa lead uchrashuvga tayyormi — shuni tekshiradi."
            dark
          />
          <div className="grid gap-4 md:grid-cols-4">
            {[
              ['E', 'Ehtiyoj', 'Mijoz nimani hal qilmoqchi?'],
              ['V', 'Vaqt', 'Qachon boshlamoqchi?'],
              ['Q', 'Qaror', 'Yakuniy qarorni kim beradi?'],
              ['N', 'Narxga moslik', 'Xizmat darajasi va budjet mosmi?'],
            ].map(([letter, title, text]) => (
              <div key={letter} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold">{letter}</div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3 font-mono text-sm text-slate-300">
            <span>Lead</span><ArrowRight className="h-4 w-4 text-blue-400" />
            <span>Diagnostika</span><ArrowRight className="h-4 w-4 text-blue-400" />
            <span>EVQN</span><ArrowRight className="h-4 w-4 text-blue-400" />
            <span>Uchrashuv</span><ArrowRight className="h-4 w-4 text-blue-400" />
            <span>amoCRM</span>
          </div>
        </div>
      </section>

      <section id="red-zone" className="scroll-mt-32 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            index="05"
            eyebrow="Red zone"
            title="Sotuvchi qilmaydigan ishlar"
            description="Texnika ishlatish — manipulyatsiya qilish degani emas. Jon Branding sotuvchisi aniqlik va foyda bilan ishlaydi."
          />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              'Mijoz bilan bahslashmaydi.',
              'Darrov chegirma bermaydi yoki va’da qilmaydi.',
              'Savol bermasdan narx tashlamaydi.',
              '“100% patent chiqadi” demaydi.',
              'Bilmagan huquqiy savolga taxminiy xulosa bermaydi.',
              'Mijozning e’tirozini bosim bilan yopmaydi.',
              'Raqobatchini yomonlamaydi.',
              'Mijoz aytgan xizmatni avtomatik final ehtiyoj deb qabul qilmaydi.',
              'Keyingi qadamni belgilamasdan suhbatni tugatmaydi.',
            ].map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5">
                <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                <p className="text-sm font-medium leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-blue-600 py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-100">
                <GitBranch className="h-4 w-4" />
                Bir jumlada
              </div>
              <h2 className="max-w-4xl text-3xl font-bold tracking-tight sm:text-4xl">
                Har bir javob keyingi savol bilan tugasin.
              </h2>
              <p className="mt-3 max-w-3xl text-base leading-7 text-blue-100">
                Javob berdingizmi — suhbatni mijozga tashlab qo‘ymang. Diagnostika, EVQN yoki aniq keyingi qadamga olib boring.
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-5">
              <MessageSquareQuote className="mb-3 h-5 w-5 text-blue-100" />
              <p className="max-w-sm text-sm font-medium leading-6">
                “Siz uchun asosiy to‘siq qaysi: narx, vaqt, natijaga ishonch yoki qaror qiluvchi?”
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

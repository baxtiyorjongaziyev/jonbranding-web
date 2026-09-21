'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { HoneypotField } from '@/components/ui/honeypot-field';
import { generateEventId, getGaClientId, trackEvent, trackLead } from '@/lib/analytics';
import { isValidPhone, normalizePhone } from '@/lib/lead-contact';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const mono = { fontFamily: 'var(--font-mono), "JetBrains Mono", monospace' } as const;
const numerals = { fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' } as const;

function Eyebrow({ index, label, muted }: { index: string; label: string; muted?: boolean }) {
  return (
    <p
      className="mb-5 flex items-center justify-center gap-2.5 text-[11px] font-medium uppercase"
      style={{ ...mono, letterSpacing: '0.1em', color: muted ? 'rgba(255,255,255,.5)' : '#a3a3a3' }}
    >
      <span style={{ color: muted ? 'rgba(255,255,255,.85)' : '#000' }}>{index}</span>
      <span aria-hidden="true" className="inline-block h-px w-5" style={{ background: 'currentColor' }} />
      {label}
    </p>
  );
}

type Service = {
  name: string;
  price: string;
  duration: string;
  lead: string;
  deliverables: string[];
  benefit: string;
  audience: string;
  note?: string;
  addon?: { label: string; price: string };
};

type ServiceGroup = {
  title: string;
  intro: string;
  items: Service[];
};

const SERVICE_GROUPS: ServiceGroup[] = [
  {
    title: 'Brend qurish',
    intro: 'Nomdan to‘liq vizual tizimgacha. Har birini alohida ham olsangiz bo‘ladi.',
    items: [
      {
        name: 'Naming',
        price: '10 000 000',
        duration: '10 kun',
        lead: 'Brendingizga nom topamiz — aytishga oson, esda qoladigan va patentga o‘tadigan.',
        deliverables: [
          '30 dan ortiq variant ishlanadi, 3 tasi finalga chiqadi',
          'Har bir nom nimani anglatishi va uni mijozga qanday tushuntirish yozib beriladi',
          'Domen va ijtimoiy tarmoqlarda bandligi tekshiriladi',
          'Patent bazasidan dastlabki tekshiruv o‘tkaziladi',
          'Boshqa tillarda salbiy ma’no bermasligi tekshiriladi',
        ],
        benefit: 'Nomingizni tanitishga sarflagan har bir so‘m o‘zingizda qoladi — besh yildan keyin “bu nom bizniki” degan xat kelmaydi.',
        audience: 'Yangi biznes ochayotgan yoki hozirgi nomi ishlamayotganlar uchun',
        note: 'Nom noto‘g‘ri tanlansa, keyin patent, domen va reklama uch barobar qimmatga tushadi.',
      },
      {
        name: 'Logo',
        price: '8 000 000',
        duration: '7 kun',
        lead: 'Kichkina ekranda ham, katta bannerda ham bir xil ishlaydigan belgi.',
        deliverables: [
          '3 ta konsepsiya, tanlanganini oxirigacha sayqallaymiz',
          'Barcha formatlar: AI, EPS, SVG, PDF, PNG',
          'Rangli, oq-qora va bitta rangdagi versiyalar',
          'Gorizontal, vertikal va ixcham (ikonka) variantlari',
          'Minimal o‘lcham va bo‘sh joy qoidalari',
        ],
        benefit: 'Vizitkadan bannergacha, avatardan qadoqqacha — har safar dizaynerga “moslashtirib bering” deb pul to‘lamaysiz.',
        audience: 'Logosi yo‘q yoki eskirgan, zamonaviy ko‘rinmayotgan biznes uchun',
      },
      {
        name: 'Visual identity',
        price: '18 000 000',
        duration: '10 kun',
        lead: 'Logo — bu bitta belgi. Visual identity — brendingiz hamma joyda tanilishi.',
        deliverables: [
          'Rang palitrasi (Pantone, CMYK, RGB, HEX)',
          'Shrift tizimi: sarlavha, matn, urg‘u',
          'Grafik elementlar va patternlar',
          'Foto va rasm uslubi',
          '10 dan ortiq tashuvchi maketi: vizitka, blank, konvert, forma, banner, ijtimoiy tarmoq shablonlari',
        ],
        benefit: 'Reklamangiz har oy noldan tanishtirmaydi — har bir ko‘rish oldingisining ustiga qo‘shiladi. Byudjet yig‘iladi, teshik chelakka quyilmaydi.',
        audience: 'Logosi bor, lekin har joyda har xil ko‘rinayotgan biznes uchun',
      },
      {
        name: 'Brandbook',
        price: '24 000 000',
        duration: '7 kun',
        lead: 'Brendingiz qoidalari bitta hujjatda. Yangi dizayner kelsa ham tizim buzilmaydi.',
        deliverables: [
          '60 dan ortiq sahifali PDF qo‘llanma',
          'Logoni ishlatish va ishlatmaslik qoidalari (xato misollari bilan)',
          'Ranglar va tipografika to‘liq spetsifikatsiyasi',
          'Barcha tashuvchilar bo‘yicha tayyor maketlar',
          'Brend tili va murojaat uslubi (tone of voice)',
        ],
        benefit: 'Brendingiz odamga emas, qoidaga bog‘lanadi. Dizayner ketsa ham, yangi xodim kelsa ham brend o‘sha-o‘sha qoladi.',
        audience: 'Jamoasi o‘sayotgan, bir nechta dizayner va tipografiya bilan ishlaydiganlar uchun',
        note: 'Visual identity bilan birga olinsa, ikkalasi bitta tizim sifatida ishlanadi.',
      },
    ],
  },
  {
    title: 'Qadoq',
    intro: 'Do‘kon javonida mahsulotingizni qo‘lga oldiradigan qadoq.',
    items: [
      {
        name: 'Packaging (1 SKU)',
        price: '12 000 000',
        duration: '7 kun',
        lead: 'Bitta mahsulot uchun to‘liq qadoq dizayni — tipografiyaga tayyor holda.',
        deliverables: [
          'Qadoq dizayni va javondagi ko‘rinishi hisobga olinadi',
          'Dieline — texnik chizma bilan birga',
          '3D vizualizatsiya (taqdimot va marketplace uchun)',
          'Shtrix-kod, tarkib, muddat va belgilarning to‘g‘ri joylashuvi',
          'Tipografiyaga topshirishga tayyor fayllar',
        ],
        benefit: 'Mahsulot javonda o‘zini o‘zi sotadi — sotuvchi tushuntirib o‘tirmaydi. Va narxni ko‘tarishga asos paydo bo‘ladi.',
        audience: 'Do‘kon, marketplace yoki tarmoqqa chiqayotgan ishlab chiqaruvchilar uchun',
      },
      {
        name: 'Har qo‘shimcha SKU',
        price: '4 000 000 dan',
        duration: '+3 kun',
        lead: 'Birinchi qadoq tayyor bo‘lgach, qolgan mahsulotlar arzonroq.',
        deliverables: [
          'Bir xil tizimda, lekin har mahsulotga moslashtirilgan',
          'Ta’m, hajm va turlarni ajratib turadigan yechim',
          'Tayyor dieline va tipografiya fayllari',
        ],
        benefit: 'Butun liniyangiz javonda bitta oila bo‘lib turadi — bittasini olgan xaridor qolganini ham taniydi.',
        audience: 'Bir nechta mahsulot turi bor ishlab chiqaruvchilar uchun',
        note: 'Aniq narx qadoq turining murakkabligiga qarab belgilanadi.',
      },
    ],
  },
  {
    title: 'Huquqiy himoya',
    intro: 'Nom sizniki bo‘lishi uchun uni ro‘yxatdan o‘tkazish kerak. Shu ishni ham biz qilamiz.',
    items: [
      {
        name: 'Patent tekshiruvi',
        price: '880 000',
        duration: '2 kun',
        lead: 'Nomingiz band emasligini oldindan bilib oling — bu eng arzon xavfsizlik choralari.',
        deliverables: [
          'Rasmiy bazadan to‘liq tekshiruv',
          'O‘xshash belgilar ro‘yxati va xavf darajasi',
          'Ro‘yxatdan o‘tish ehtimoli bo‘yicha xulosa',
          'Sizga qaysi sinflar kerakligini o‘zimiz aniqlab beramiz',
        ],
        benefit: 'Bir kunlik tekshiruv sizni yillab tanitgan nomdan ayrilishdan saqlaydi. Eng arzon sug‘urta.',
        audience: 'Nomni tanlagan, lekin hali ro‘yxatdan o‘tkazmaganlar uchun',
        note: 'Narx bitta sinf uchun. Naming xizmatiga bu tekshiruv allaqachon kiritilgan.',
        addon: { label: 'Har qo‘shimcha sinf', price: '+440 000 so‘m' },
      },
      {
        name: 'Patent (oddiy)',
        price: '5 000 000',
        duration: '7 oy',
        lead: 'Tovar belgisini ro‘yxatdan o‘tkazish — odatdagi tartibda.',
        deliverables: [
          'Hujjatlar to‘liq tayyorlanadi va topshiriladi',
          'Sinflar to‘g‘ri tanlanadi',
          'Jarayon oxirigacha kuzatib boriladi',
          'Guvohnoma qo‘lingizga topshiriladi',
        ],
        benefit: 'Nom qonuniy sizniki bo‘ladi — franshiza sotish, eksportga chiqish va tenderga kirish yo‘li ochiladi. Brend aktivga aylanadi.',
        audience: 'Shoshilmayotgan, lekin nomini himoyalamoqchi bo‘lganlar uchun',
      },
      {
        name: 'Patent (tezkor)',
        price: '7 000 000',
        duration: '20–40 kun',
        lead: 'Xuddi shu ish, lekin tezlashtirilgan tartibda.',
        deliverables: [
          'Oddiy patentdagi barcha ishlar',
          'Tezlashtirilgan ekspertiza',
          'Muddat 7 oydan 20–40 kunga qisqaradi',
        ],
        benefit: 'Muddat sizni kutib turmaydigan joyda — yetti oy o‘rniga bir oycha. Shartnomani boy bermaysiz.',
        audience: 'Tender, marketplace yoki eksport muddati siqib turganlar uchun',
      },
    ],
  },
];

type Package = {
  name: string;
  price: string;
  separate: string;
  saving: string;
  audience: string;
  features: string[];
  duration: string;
  featured?: boolean;
  badge?: string;
};

const PACKAGES: Package[] = [
  {
    name: 'VIP',
    price: '70 000 000',
    separate: '85 000 000',
    saving: '15 000 000',
    audience: 'Eksportga chiqayotgan, marketplace yoki tarmoq do‘konga kirayotgan ishlab chiqaruvchilar uchun',
    features: ['Naming', 'Logo', 'Visual identity', 'Brandbook', 'Patent', 'Packaging (3 SKU)'],
    duration: '35–45 kun',
  },
  {
    name: 'PREMIUM',
    price: '55 000 000',
    separate: '65 000 000',
    saving: '10 000 000',
    audience: 'Brendini to‘liq tartibga solmoqchi bo‘lgan, o‘sayotgan biznes uchun',
    features: ['Naming', 'Logo', 'Visual identity', 'Brandbook', 'Patent'],
    duration: '30–35 kun',
    featured: true,
    badge: 'Ko‘p tanlanadi',
  },
  {
    name: 'STANDART',
    price: '20 000 000',
    separate: '23 000 000',
    saving: '3 000 000',
    audience: 'Endi boshlayotgan yoki brendi hali yo‘q biznes uchun',
    features: ['Naming', 'Logo', 'Patent'],
    duration: '20–25 kun',
  },
];

const ALL_SERVICES = SERVICE_GROUPS.flatMap((group) =>
  group.items.map((item) => ({ ...item, group: group.title }))
);

const JOBS = [
  {
    pain: 'Mahsulotingiz raqobatchinikidan yaxshi, lekin xaridor javondan chiroyliroq qadoqni oladi.',
    gain: 'Mahsulot o‘zini o‘zi sotadi — sotuvchi tushuntirib o‘tirmaydi.',
  },
  {
    pain: '“Sifatimiz yuqori” deysiz, lekin ko‘rinishi arzon. Shuning uchun arzon narxga rozi bo‘lasiz.',
    gain: 'Ko‘rinish narxni oqlaydi — narxni ko‘tarasiz va mijoz savol bermaydi.',
  },
  {
    pain: 'Har safar boshqa dizayner, har safar boshqa rang. Odam o‘n marta ko‘rsa ham esda qolmaydi.',
    gain: 'Har bir ko‘rish oldingisining ustiga qo‘shiladi — reklama byudjeti yig‘iladi.',
  },
  {
    pain: 'Nomingiz ro‘yxatdan o‘tmagan. Bir kun kelib “bu nom bizniki” degan xat kelishi mumkin.',
    gain: 'Nom qonuniy sizniki — franshiza, eksport va tender yo‘li ochiladi.',
  },
];

const PROCESS_STEPS = [
  { title: 'Brif va tahlil', desc: 'Biznesingizni, raqobatchilaringizni, auditoriyangizni o‘rganamiz' },
  { title: 'Konsepsiya', desc: '3 ta yo‘nalish taqdim etamiz, bittasini tanlaysiz' },
  { title: 'Ishlab chiqish', desc: 'Tanlangan yo‘nalish sayqallanadi' },
  { title: 'Topshirish', desc: 'Barcha fayllar va hujjatlar qo‘lingizda' },
];

const PRICE_FACTORS = [
  'Mahsulot turlari soni (SKU)',
  'Patent klasslari soni',
  'Tashuvchilar soni (vizitka, banner, forma va boshqalar)',
  'Muddat — tezkor bajarish +50%',
];

function LeadModal({ open, onClose, presetService }: { open: boolean; onClose: () => void; presetService: string }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(presetService);
  const [phoneErr, setPhoneErr] = useState('');
  const [submitErr, setSubmitErr] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const phoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName('');
      setPhone('');
      setService(presetService);
      setPhoneErr('');
      setSubmitErr('');
      setSending(false);
      setDone(false);
      trackEvent({ action: 'modal_open', category: 'Lead Form', label: 'Tariflar', source: 'tariflar_modal' });
    }
  }, [open, presetService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPhone(phone)) {
      setPhoneErr('Telefon raqamini to‘g‘ri kiriting');
      phoneRef.current?.focus();
      return;
    }
    setPhoneErr('');
    setSubmitErr('');
    setSending(true);

    const normalizedPhone = normalizePhone(phone);
    const eventId = generateEventId('lead');
    const gaClientId = getGaClientId();
    const pageLocation = typeof window !== 'undefined' ? window.location.href : undefined;

    trackEvent({
      action: 'lead_form_submitted',
      category: 'Lead Form',
      label: 'Tariflar',
      event_id: eventId,
      form_name: 'tariflar_page',
      cta_source: 'tariflar_modal',
      page_location: pageLocation,
    });

    let result: { ok?: boolean; eventId?: string; error?: string } = {};
    try {
      const res = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name || 'Mijoz',
          phone: normalizedPhone,
          role: service,
          source: 'tariflar_modal',
          lang: 'uz',
          eventId,
          gaClientId,
          pageLocation,
          ctaSource: 'tariflar_modal',
          companyWebsite: honeypot,
        }),
      });
      result = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitErr('Xatolik yuz berdi. Qayta urinib ko‘ring.');
        setSending(false);
        return;
      }
    } catch {
      setSubmitErr('Xatolik yuz berdi. Qayta urinib ko‘ring.');
      setSending(false);
      return;
    }

    trackLead({
      source: 'tariflar_modal',
      eventId: result.eventId || eventId,
      serverTracked: true,
      gaClientId,
      service,
      form_name: 'tariflar_page',
      cta_source: 'tariflar_modal',
    });
    setSending(false);
    setDone(true);
  };

  const allServices = SERVICE_GROUPS.flatMap((group) => group.items.map((item) => item.name));

  return (
    <Dialog.Root open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
          onOpenAutoFocus={(e) => { e.preventDefault(); phoneRef.current?.focus(); }}
        >
          <Dialog.Title className="mb-1.5 text-2xl font-bold text-black" style={{ letterSpacing: '-0.03em' }}>
            {done ? 'Rahmat!' : 'Ariza qoldirish'}
          </Dialog.Title>
          <Dialog.Description className="mb-6 text-sm text-neutral-500" style={{ lineHeight: 1.6 }}>
            {done ? 'Tez orada siz bilan bog‘lanamiz.' : 'Ism va telefon raqamingizni qoldiring, o‘zimiz aloqaga chiqamiz.'}
          </Dialog.Description>
          <Dialog.Close asChild>
            <button aria-label="Yopish" className="absolute top-5 right-5 w-8 h-8 rounded-full grid place-items-center border border-neutral-200 text-neutral-500 hover:bg-neutral-50">✕</button>
          </Dialog.Close>

          {done ? (
            <button onClick={onClose} className="w-full rounded-full bg-black text-white font-semibold py-4 text-sm">Yopish</button>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <HoneypotField value={honeypot} onChange={setHoneypot} />
              <div className="flex flex-col gap-1">
                <label htmlFor="tariflar-name" className="text-sm font-medium text-neutral-700">Ism</label>
                <input
                  id="tariflar-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ismingiz"
                  className="rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-black"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="tariflar-phone" className="text-sm font-medium text-neutral-700">Telefon *</label>
                <input
                  id="tariflar-phone"
                  ref={phoneRef}
                  type="tel"
                  inputMode="tel"
                  required
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setPhoneErr(''); }}
                  placeholder="+998 90 123 45 67"
                  aria-invalid={Boolean(phoneErr)}
                  className="rounded-xl border px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-black"
                  style={{ borderColor: phoneErr ? '#dc2626' : undefined }}
                />
                {phoneErr && <span role="alert" className="text-xs text-red-600">{phoneErr}</span>}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="tariflar-service" className="text-sm font-medium text-neutral-700">Xizmat</label>
                <select
                  id="tariflar-service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="rounded-xl border border-neutral-200 px-3 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-black"
                >
                  {allServices.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                  <option>VIP paket</option>
                  <option>PREMIUM paket</option>
                  <option>STANDART paket</option>
                  <option>Aniq emas — maslahat kerak</option>
                </select>
              </div>
              {submitErr && <p role="alert" className="text-xs text-red-600 text-center">{submitErr}</p>}
              <button
                type="submit"
                disabled={sending}
                aria-busy={sending}
                className="w-full rounded-full bg-black text-white font-semibold py-4 text-sm disabled:opacity-60"
              >
                {sending ? 'Yuborilmoqda…' : 'Yuborish'}
              </button>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default function TariflarClient() {
  const [modalOpen, setModalOpen] = useState(false);
  const [presetService, setPresetService] = useState('Aniq emas — maslahat kerak');

  const openModal = (service: string) => {
    setPresetService(service);
    setModalOpen(true);
  };

  return (
    <div className="bg-white text-black">
      {/* HERO */}
      <section className="px-5 sm:px-8 pt-20 pb-16 md:pt-28 md:pb-24 max-w-3xl mx-auto text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <Eyebrow index="§ 01" label="Narxlar" />
        </motion.div>
        <motion.h1
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="font-bold leading-[1.02]"
          style={{ fontSize: 'clamp(40px, 6.6vw, 72px)', letterSpacing: '-0.035em' }}
        >
          Narxlarimiz <span className="serif-highlight">ochiq</span>
        </motion.h1>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto mt-6 text-neutral-600"
          style={{ fontSize: 'clamp(16px, 1.5vw, 19px)', lineHeight: 1.65, maxWidth: '38ch' }}
        >
          Hamma uchun birdek — shaffof ishlaymiz. Narxni ham yashirmaymiz, ishni ham.
        </motion.p>
        <motion.dl
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-neutral-200 pt-6"
        >
          {[
            { value: '9', label: 'yil tajriba' },
            { value: '500+', label: 'mijoz' },
            { value: '1000+', label: 'loyiha' },
          ].map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block text-2xl font-bold sm:text-3xl" style={numerals}>{stat.value}</span>
                <span
                  className="mt-1 block text-[11px] uppercase text-neutral-400"
                  style={{ ...mono, letterSpacing: '0.08em' }}
                >
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </motion.dl>
      </section>

      {/* JTBD — BIZ NIMANI HAL QILAMIZ */}
      <section className="px-5 sm:px-8 pb-20 md:pb-28 max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <Eyebrow index="§ 02" label="Vazifa" />
          <h2 className="font-bold" style={{ fontSize: 'clamp(28px, 3.8vw, 44px)', letterSpacing: '-0.03em', lineHeight: 1.08 }}>
            Biz aslida nimani <span className="serif-highlight">hal qilamiz</span>
          </h2>
          <p className="mx-auto mt-5 text-neutral-600" style={{ fontSize: 17, lineHeight: 1.65, maxWidth: '46ch' }}>
            Mijoz bizga logo uchun kelmaydi. Mijoz bozorda jiddiy qabul qilinishi va narxini oqlay olishi uchun keladi.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2">
          {JOBS.map((job) => (
            <motion.div
              key={job.pain}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="rounded-2xl border border-neutral-200 p-6 sm:p-7"
            >
              <p
                className="mb-2 text-[10px] uppercase text-neutral-400"
                style={{ ...mono, letterSpacing: '0.12em' }}
              >
                Hozir
              </p>
              <p className="mb-5 text-[15px] text-neutral-500" style={{ lineHeight: 1.6 }}>{job.pain}</p>
              <p
                className="mb-2 text-[10px] uppercase text-neutral-400"
                style={{ ...mono, letterSpacing: '0.12em' }}
              >
                Biz bilan
              </p>
              <p className="text-[15px] font-medium text-neutral-900" style={{ lineHeight: 1.6 }}>{job.gain}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ALOHIDA XIZMATLAR */}
      <section className="px-5 sm:px-8 pb-20 md:pb-28 max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <Eyebrow index="§ 03" label="Xizmatlar" />
          <h2 className="font-bold" style={{ fontSize: 'clamp(28px, 3.8vw, 44px)', letterSpacing: '-0.03em', lineHeight: 1.08 }}>
            Bittalab <span className="serif-highlight">olish</span>
          </h2>
          <p className="mx-auto mt-5 text-neutral-600" style={{ fontSize: 17, lineHeight: 1.65, maxWidth: '46ch' }}>
            Hammasi birdan kerak emas. Hozir nima kerak bo‘lsa, shuni olasiz — har bir xizmat o‘zicha to‘liq ish
            va oxirida sizga tayyor fayllar topshiriladi.
          </p>
        </motion.div>

        <p
          className="mt-12 text-center text-[11px] uppercase text-neutral-400"
          style={{ ...mono, letterSpacing: '0.06em' }}
        >
          Narxlar xizmat uchun. Davlat bojlari alohida to‘lanadi.
        </p>
      </section>

      {/* HAR BIR XIZMAT — ALOHIDA EKRAN */}
      {ALL_SERVICES.map((service, i) => (
        <motion.section
          key={service.name}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="flex min-h-[100svh] items-center border-t border-neutral-200 px-5 py-20 sm:px-8"
        >
          <div className="mx-auto grid w-full max-w-5xl gap-10 md:grid-cols-2 md:gap-16">
            <div className="md:sticky md:top-24 md:self-start">
              <p
                className="mb-6 flex items-center gap-2.5 text-[11px] uppercase text-neutral-400"
                style={{ ...mono, letterSpacing: '0.1em' }}
              >
                <span className="text-black">{String(i + 1).padStart(2, '0')}</span>
                <span aria-hidden="true" className="inline-block h-px w-5 bg-neutral-300" />
                {service.group}
              </p>

              <h3
                className="font-bold"
                style={{ fontSize: 'clamp(30px, 4.4vw, 52px)', letterSpacing: '-0.035em', lineHeight: 1.05 }}
              >
                {service.name}
              </h3>

              <p className="mt-5 text-neutral-700" style={{ fontSize: 'clamp(16px, 1.5vw, 19px)', lineHeight: 1.6, maxWidth: '34ch' }}>
                {service.lead}
              </p>

              <div className="mt-8 flex items-end gap-6 border-t border-neutral-200 pt-6">
                <div>
                  <p
                    className="mb-1.5 text-[10px] uppercase text-neutral-400"
                    style={{ ...mono, letterSpacing: '0.12em' }}
                  >
                    Narx
                  </p>
                  <p className="text-2xl font-bold sm:text-3xl" style={{ ...numerals, letterSpacing: '-0.035em' }}>
                    {service.price}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-400">so‘m</p>
                </div>
                <div>
                  <p
                    className="mb-1.5 text-[10px] uppercase text-neutral-400"
                    style={{ ...mono, letterSpacing: '0.12em' }}
                  >
                    Muddat
                  </p>
                  <p className="text-2xl font-bold sm:text-3xl" style={{ ...numerals, letterSpacing: '-0.035em' }}>
                    {service.duration}
                  </p>
                </div>
              </div>

              {service.addon && (
                <p className="mt-5 flex items-center justify-between gap-3 border-t border-neutral-200 pt-4 text-sm">
                  <span className="text-neutral-600">{service.addon.label}</span>
                  <span className="whitespace-nowrap font-medium" style={numerals}>{service.addon.price}</span>
                </p>
              )}

              <button
                onClick={() => openModal(service.name)}
                className="mt-8 w-full rounded-full bg-black py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 md:w-auto md:px-10"
              >
                Ariza qoldirish
              </button>
            </div>

            <div>
              <p
                className="mb-4 text-[10px] uppercase text-neutral-400"
                style={{ ...mono, letterSpacing: '0.12em' }}
              >
                Nima olasiz
              </p>
              <ul className="mb-8 flex flex-col gap-3.5">
                {service.deliverables.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 border-b border-neutral-100 pb-3.5 text-[15px] text-neutral-700 last:border-b-0"
                    style={{ lineHeight: 1.55 }}
                  >
                    <span className="mt-[3px] shrink-0 text-xs text-neutral-900">✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="rounded-2xl bg-neutral-50 p-5 sm:p-6">
                <p
                  className="mb-2 text-[10px] uppercase text-neutral-400"
                  style={{ ...mono, letterSpacing: '0.12em' }}
                >
                  Bu sizga nima beradi
                </p>
                <p className="text-[15px] text-neutral-900" style={{ lineHeight: 1.6 }}>{service.benefit}</p>
              </div>

              <p className="mt-6 text-sm text-neutral-500" style={{ lineHeight: 1.55 }}>
                <span
                  className="text-[10px] uppercase text-neutral-400"
                  style={{ ...mono, letterSpacing: '0.12em' }}
                >
                  Kimga{' '}
                </span>
                {service.audience}
              </p>
              {service.note && (
                <p className="mt-3 text-xs text-neutral-400" style={{ lineHeight: 1.6 }}>{service.note}</p>
              )}
            </div>
          </div>
        </motion.section>
      ))}

      {/* ISHLASH TARTIBI */}
      <section className="px-5 sm:px-8 pb-20 md:pb-28 max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-12 text-center"
        >
          <Eyebrow index="§ 04" label="Jarayon" />
          <h2 className="font-bold" style={{ fontSize: 'clamp(28px, 3.8vw, 44px)', letterSpacing: '-0.03em', lineHeight: 1.08 }}>
            Qanday <span className="serif-highlight">ishlaymiz</span>
          </h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {PROCESS_STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="flex gap-4"
            >
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black text-[13px] font-medium text-white"
                style={mono}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="mb-1 font-semibold" style={{ letterSpacing: '-0.015em' }}>{step.title}</h3>
                <p className="text-sm text-neutral-600" style={{ lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="rounded-2xl border border-neutral-200 p-6 sm:p-8"
        >
          <h3
            className="mb-6 text-[10px] uppercase text-neutral-400"
            style={{ ...mono, letterSpacing: '0.14em' }}
          >
            To‘lov bosqichlari
          </h3>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { value: '50%', label: 'Shartnoma imzolanganda' },
              { value: '30%', label: 'Konsepsiya tasdiqlanganda' },
              { value: '20%', label: 'Fayllar topshirilganda' },
            ].map((stage) => (
              <div key={stage.value}>
                <p className="text-3xl font-bold" style={{ ...numerals, letterSpacing: '-0.035em' }}>{stage.value}</p>
                <p className="mt-1.5 text-sm text-neutral-600" style={{ lineHeight: 1.5 }}>{stage.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* NARXGA TA'SIR QILUVCHI OMILLAR */}
      <section className="px-5 sm:px-8 pb-20 md:pb-28 max-w-3xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-8 text-center"
        >
          <Eyebrow index="§ 05" label="Omillar" />
          <h2 className="font-bold" style={{ fontSize: 'clamp(26px, 3.2vw, 36px)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Narxga nima <span className="serif-highlight">ta’sir qiladi</span>
          </h2>
        </motion.div>
        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex flex-col gap-3"
        >
          {PRICE_FACTORS.map((factor) => (
            <li key={factor} className="flex items-start gap-3 text-sm sm:text-base text-neutral-700 border border-neutral-200 rounded-xl px-5 py-4">
              <span className="mt-0.5 shrink-0 font-semibold">•</span>
              {factor}
            </li>
          ))}
        </motion.ul>
      </section>

      {/* PAKETLAR */}
      <section className="px-5 sm:px-8 pb-20 md:pb-28 max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <Eyebrow index="§ 06" label="Paketlar" />
          <h2 className="font-bold" style={{ fontSize: 'clamp(28px, 3.8vw, 44px)', letterSpacing: '-0.03em', lineHeight: 1.08 }}>
            Bir nechtasi kerakmi? Paket <span className="serif-highlight">arzonroq</span>
          </h2>
          <p className="mx-auto mt-5 text-neutral-600" style={{ fontSize: 17, lineHeight: 1.65, maxWidth: '46ch' }}>
            Xizmatlarni alohida-alohida olgandan ko‘ra paket bilan olsangiz, ham arzonroq chiqadi,
            ham hamma narsa bitta tizimda ishlanadi.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {PACKAGES.map((pkg) => (
            <motion.div
              key={pkg.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className={`relative flex flex-col rounded-2xl p-8 ${pkg.featured ? 'bg-black text-white md:-translate-y-3 md:shadow-2xl' : 'bg-white text-black border border-neutral-200'}`}
            >
              {pkg.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white text-black text-xs font-semibold px-4 py-1 border border-neutral-200">
                  {pkg.badge}
                </span>
              )}
              <h3
                className="mb-4 text-xs uppercase"
                style={{ ...mono, letterSpacing: '0.14em', color: pkg.featured ? 'rgba(255,255,255,.65)' : '#737373' }}
              >
                {pkg.name}
              </h3>
              <div className="mb-1.5 flex items-baseline gap-2">
                <span className="font-bold" style={{ fontSize: 'clamp(30px, 3.2vw, 38px)', ...numerals, letterSpacing: '-0.035em' }}>
                  {pkg.price}
                </span>
                <span className="text-sm" style={{ color: pkg.featured ? 'rgba(255,255,255,.6)' : '#737373' }}>so‘m</span>
              </div>
              <p className="mb-5 text-xs" style={{ lineHeight: 1.5, color: pkg.featured ? 'rgba(255,255,255,.6)' : '#a3a3a3' }}>
                Alohida olinsa <span style={numerals}>{pkg.separate}</span> so‘m — <span style={numerals}>{pkg.saving}</span> so‘m tejaysiz
              </p>
              <p className="mb-7 text-[15px]" style={{ lineHeight: 1.6, color: pkg.featured ? 'rgba(255,255,255,.75)' : '#525252' }}>
                {pkg.audience}
              </p>
              <ul className="flex flex-col gap-2.5 mb-8 flex-grow">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 shrink-0" style={{ color: pkg.featured ? '#fff' : '#000' }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <p
                className="mb-5 text-[11px] uppercase"
                style={{ ...mono, letterSpacing: '0.08em', color: pkg.featured ? 'rgba(255,255,255,.5)' : '#a3a3a3' }}
              >
                Muddat: {pkg.duration}
              </p>
              <button
                onClick={() => openModal(`${pkg.name} paket`)}
                className={`w-full rounded-full py-4 text-sm font-semibold transition-opacity hover:opacity-90 ${pkg.featured ? 'bg-white text-black' : 'bg-black text-white'}`}
              >
                Ariza qoldirish
              </button>
            </motion.div>
          ))}
        </div>

        <p
          className="mt-10 text-center text-[11px] uppercase text-neutral-400"
          style={{ ...mono, letterSpacing: '0.06em', lineHeight: 1.7 }}
        >
          Muddat dizayn ishlari uchun. Patent guvohnomasi rasmiy tartibda alohida muddatda chiqadi.
        </p>
      </section>

      {/* CTA BLOK */}
      <section className="px-5 sm:px-8 py-20 md:py-28 bg-black text-white text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <Eyebrow index="§ 07" label="Suhbat" muted />
        </motion.div>
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto max-w-2xl font-bold"
          style={{ fontSize: 'clamp(28px, 4vw, 46px)', letterSpacing: '-0.03em', lineHeight: 1.08 }}
        >
          Qaysi paket sizga to‘g‘ri kelishini <span className="serif-highlight">bilmayapsizmi?</span>
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto mt-5 text-neutral-300"
          style={{ fontSize: 17, lineHeight: 1.65, maxWidth: '42ch' }}
        >
          20 daqiqalik bepul suhbatda aytamiz. Sotmaymiz — maslahat beramiz.
        </motion.p>
        <motion.button
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          onClick={() => openModal('Aniq emas — maslahat kerak')}
          className="mt-8 rounded-full bg-white text-black font-semibold px-8 py-4 text-sm hover:opacity-90 transition-opacity"
        >
          Suhbatga yozilish
        </motion.button>
      </section>

      {/* FOOTER ABOVE */}
      <p
        className="px-5 py-10 text-center text-[11px] uppercase text-neutral-400"
        style={{ ...mono, letterSpacing: '0.06em', lineHeight: 1.7 }}
      >
        Narxlar 2026 yil sentyabr holatiga. Yakuniy narx loyiha hajmiga qarab aniqlanadi.
      </p>

      <LeadModal open={modalOpen} onClose={() => setModalOpen(false)} presetService={presetService} />
    </div>
  );
}

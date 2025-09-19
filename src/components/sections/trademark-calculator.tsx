
'use client';

// =============================================================
// Jon.Branding – Patent hisoblagichi (React client, no emit deps)
// BHM = 412 000 so'm
// -------------------------------------------------------------
// Muhim dizayn qarorlari:
// • Hech qanday Suspense, event emitter, yoki tashqi UI kutubxonasi ishlatilmaydi
//   → 'emit' / 'addListener' xatolarining ildizi bo'ladigan joylar yo'q.
// • Hisob-kitoblar alohida pure-funktsiyada (calculateFees) → testlash oson.
// • Inline kommentlar murakkab qismlarni izohlaydi.
// =============================================================

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Logo } from '../icons/logo';
import { Loader2 } from 'lucide-react';

// ========================
// 1) Konstanta va tariflar
// ========================
const BHM = 412000;              // Bazaviy hisoblash miqdori
const PATENT_XIZMATI = 3000000;  // Agentlik xizmat haqi (doimiy)

// Tezkor topshirish (1.5 oy): 12×BHM + 12% NDS
// 12 * 412 000 * 1.12 = 5 537 280 (Math.round – ehtiyot chorasi)
const EXPEDITE_BASE = Math.round(12 * BHM * 1.12);

// Tezkor topshirishda har bir qo'shimcha klass uchun qat'iy summa
const EXPEDITE_PER_EXTRA_CLASS = 461000;

// 1-bosqich: talabnoma berish (1-klass bazaviy)
const STEP1_JISMONIY = 4 * BHM;      // 1 648 000
const STEP1_YURIDIK  = 6 * BHM;      // 2 472 000
// 1-bosqich qo'shimcha klasslar
const STEP1_EXTRA_JISMONIY = 0.5 * BHM; // 206 000 / klass
const STEP1_EXTRA_YURIDIK  = 4 * BHM;   // 1 648 000 / klass

// 2-bosqich: guvohnoma olish (1-klass bazaviy)
const STEP2_JISMONIY = 6.8 * BHM;    // 2 801 600
const STEP2_YURIDIK  = 11.6 * BHM;   // 4 779 200
// 2-bosqich qo'shimcha klasslar
const STEP2_EXTRA_JISMONIY = 1 * BHM;   // 412 000 / klass
const STEP2_EXTRA_YURIDIK  = 4 * BHM;   // 1 648 000 / klass

// Ekspert tekshiruvi: yoqilganda 2×BHM + har bir qo'shimcha klass uchun 1×BHM
const EXPERT_BASE = 2 * BHM;            // 824 000
const EXPERT_PER_EXTRA_CLASS = 1 * BHM; // 412 000

// ========================
// 2) Kichik yordamchi funksiyalar
// ========================
/** classCount qiymatini 1..45 oralig'ida ushlab turadi (xavfsiz clamp) */
const clampClassCount = (n) => {
  const x = Number(n);
  if (!Number.isFinite(x)) return 1;
  return Math.max(1, Math.min(45, Math.trunc(x)));
};

/** Telefon validatsiyasi: '+998' + 9 ta raqam (jami 13 belgi) */
const isUzPhone = (s) => {
  if (!s || s.length !== 13) return false;
  if (!s.startsWith('+998')) return false;
  for (let i = 4; i < s.length; i++) {
    const c = s[i];
    if (c < '0' || c > '9') return false;
  }
  return true;
};

/** Inputga telefon terishda qadam-baqadam cheklash (typing guard) */
const allowPhoneTyping = (s) => {
  if (!s.startsWith('+998')) return false;  // prefiks majburiy
  if (s.length > 13) return false;          // maksimal uzunlik
  for (let i = 4; i < s.length; i++) {
    const c = s[i];
    if (c < '0' || c > '9') return false;  // faqat raqam
  }
  return true;
};

// ========================
// 3) Hisob-kitoblar (pure function)
// ========================
/**
 * calculateFees — barcha to'lovlarni hisoblaydi (deterministik/pure)
 * Parametrlar:
 *  - isYuridik: true → yuridik, false → jismoniy
 *  - classCount: klasslar soni (1..45)
 *  - speed: 'oddiy' | 'tez' (tezkor topshirish)
 *  - hasEkspert: ekspert tekshiruvi yooqlimi
 * Qaytaradi: step1/step2/expedite/ekspert/davlatBoj/total
 */
export function calculateFees({
  isYuridik = false,
  classCount = 1,
  speed = 'oddiy',
  hasEkspert = false,
}) {
  const cc = clampClassCount(classCount);

  // --- 1-bosqich ---
  const step1Base = isYuridik ? STEP1_YURIDIK : STEP1_JISMONIY;
  const step1Extra = (cc - 1) * (isYuridik ? STEP1_EXTRA_YURIDIK : STEP1_EXTRA_JISMONIY);
  const step1 = step1Base + step1Extra;

  // --- 2-bosqich ---
  const step2Base = isYuridik ? STEP2_YURIDIK : STEP2_JISMONIY;
  const step2Extra = (cc - 1) * (isYuridik ? STEP2_EXTRA_YURIDIK : STEP2_EXTRA_JISMONIY);
  const step2 = step2Base + step2Extra;

  // --- Tezkor topshirish ---
  const expediteBase = speed === 'tez' ? EXPEDITE_BASE : 0;
  const expediteExtra = speed === 'tez' ? (cc - 1) * EXPEDITE_PER_EXTRA_CLASS : 0;
  const expediteTotal = expediteBase + expediteExtra;

  // --- Ekspert tekshiruvi ---
  const ekspertBase = hasEkspert ? EXPERT_BASE : 0;
  const ekspertExtra = hasEkspert ? (cc - 1) * EXPERT_PER_EXTRA_CLASS : 0;
  const ekspertTotal = ekspertBase + ekspertExtra;

  // --- Yakun ---
  const davlatBoj = step1 + step2 + expediteTotal;          // faqat davlat yig'imlari
  const total = davlatBoj + PATENT_XIZMATI + ekspertTotal;  // agentlik + (ixtiyoriy) ekspert

  return {
    step1, step1Base, step1Extra,
    step2, step2Base, step2Extra,
    expediteBase, expediteExtra, expediteTotal,
    ekspertBase, ekspertExtra, ekspertTotal,
    davlatBoj, total,
    classCount: cc,
  };
}

// ========================
// 4) UI komponent
// ========================
export default function TrademarkCalculator() {
  // --- Foydalanuvchi kiritmalari holati ---
  const [brand, setBrand] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998');
  const [activity, setActivity] = useState('');
  const [classCount, setClassCount] = useState(1);
  const [isYuridik, setIsYuridik] = useState(false); // default: jismoniy
  const [speed, setSpeed] = useState('oddiy');       // 'oddiy' | 'tez'
  const [hasEkspert, setHasEkspert] = useState(false);

  // --- Jarayon holati ---
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Hisobni memoga olish → keraksiz qayta-hisoblashlarni oldini oladi
  const fees = useMemo(
    () => calculateFees({ isYuridik, classCount, speed, hasEkspert }),
    [isYuridik, classCount, speed, hasEkspert]
  );

  // --- Forma yuborish ---
  const handleSubmit = async () => {
    // Minimal validatsiya
    if (!brand.trim()) return alert('Iltimos, brend nomini kiriting.');
    if (!name.trim()) return alert('Iltimos, ismingizni kiriting.');
    if (!isUzPhone(phone)) return alert('Iltimos, to‘g‘ri telefon raqam kiriting.');

    setLoading(true);

    // Telegram matni — massivni .join('\n') bilan birlashtirib quramiz
    const text = [
      '🧾 Yangi patent arizasi (Kalkulyatordan)',
      `🏢 Brend: ${brand}`,
      `👤 Ism: ${name}`,
      `📞 Telefon: ${phone}`,
      `📄 Faoliyat: ${activity || '—'}`,
      `👥 Turi: ${isYuridik ? 'Yuridik' : 'Jismoniy'}`,
      `🔢 Klasslar: ${fees.classCount}`,
      `⚡ Rejim: ${speed === 'tez' ? 'Tezkor (1.5 oy)' : 'Oddiy (7 oy)'}`,
      `🧠 Ekspert tekshiruvi: ${hasEkspert ? 'Bor' : 'Yo‘q'}`,
      `💰 Umumiy to‘lov: ${fees.total.toLocaleString()} so‘m`,
    ].join('\n');

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: name, phone, telegram: '', notes: text }),
      });

      if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || "Serverda xatolik yuz berdi.");
      }
      setSuccess(true);
    } catch (e) {
      console.error(e);
      alert('Xatolik yuz berdi. Qayta urinib ko‘ring.');
    } finally {
      setLoading(false);
    }
  };

  // Formani tozalash
  const resetForm = () => {
    setSuccess(false);
    setBrand('');
    setName('');
    setPhone('+998');
    setActivity('');
    setClassCount(1);
    setIsYuridik(false);
    setSpeed('oddiy');
    setHasEkspert(false);
  };

  // ========================
  // 5) UI
  // ========================
  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: Form */}
      <Card className="p-5 sm:p-6">
        <h2 className="text-xl font-bold text-dark-blue mb-4">Ma'lumotlarni kiriting</h2>
        <div className="space-y-4">
          <LabeledInput label="Brend nomi" placeholder="Masalan: MyBrand" value={brand} onChange={e=>setBrand(e.target.value)} />
          <LabeledInput label="Ismingiz" placeholder="To'liq ismingizni kiriting" value={name} onChange={e=>setName(e.target.value)} />
          <LabeledInput label="Telefon raqam" placeholder="+998901234567" value={phone} onChange={e=>{ const v=e.target.value; if(allowPhoneTyping(v)) setPhone(v); }} />

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Faoliyat yo'nalishlari soni (klass)</Label>
              <span className="text-xs text-slate-500">1 klass = 1 ta faoliyat turi (maks. 45 ta)</span>
            </div>
            <div className="flex items-center gap-3">
              <IconButton onClick={() => setClassCount(c=>clampClassCount((Number(c)||1)-1))}>-</IconButton>
              <div className="min-w-[3rem] text-center font-semibold text-lg">{fees.classCount}</div>
              <IconButton onClick={() => setClassCount(c=>clampClassCount((Number(c)||1)+1))}>+</IconButton>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {[1,3,5,10,15,20,25,30,45].map(n=> (
                <Chip key={n} active={fees.classCount===n} onClick={()=>setClassCount(n)}>{n}</Chip>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Shaxs turi</Label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <ToggleButton active={!isYuridik} onClick={()=>setIsYuridik(false)}>Jismoniy shaxs</ToggleButton>
              <ToggleButton active={isYuridik} onClick={()=>setIsYuridik(true)}>Yuridik shaxs</ToggleButton>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Ko‘rib chiqish tezligi</Label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <ToggleButton active={speed==='oddiy'} onClick={()=>setSpeed('oddiy')}>Oddiy (7 oy)</ToggleButton>
              <ToggleButton active={speed==='tez'} onClick={()=>setSpeed('tez')}>Tezkor (1.5 oy)</ToggleButton>
            </div>
            <p className="mt-1 text-xs text-slate-500">Tezkor: 12 BHM + 12% NDS ({EXPEDITE_BASE.toLocaleString()} so‘m) + har qo‘shimcha klass uchun {EXPEDITE_PER_EXTRA_CLASS.toLocaleString()} so‘m</p>
          </div>

          <div>
            <Label className="text-sm font-medium">Ekspert tekshiruvi</Label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <ToggleButton active={hasEkspert} onClick={()=>setHasEkspert(true)}>Yoqilgan</ToggleButton>
              <ToggleButton active={!hasEkspert} onClick={()=>setHasEkspert(false)}>O‘chirilgan</ToggleButton>
            </div>
            <p className="mt-1 text-xs text-slate-500">Ekspert: 2×BHM (bazaviy){fees.classCount>1 ? ` + ${(fees.classCount-1)}×1×BHM (qo‘shimcha klass)` : ''}</p>
          </div>

          <div>
            <Label className="text-sm font-medium">Faoliyat turlari</Label>
            <Textarea
              className="mt-1"
              rows={3}
              placeholder="Masalan: dizayn, qurilish..."
              value={activity}
              onChange={e=>setActivity(e.target.value)}
            />
          </div>

          <Button
            className="w-full text-base"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Jo‘natilmoqda...</> : 'Patentlashga buyurtma berish'}
          </Button>

          {success && (
            <div className="text-center text-green-700 bg-green-50 border border-green-200 p-3 rounded-xl flex items-center justify-center gap-4">
                <span>✅ Buyurtma qabul qilindi!</span>
              <Button variant="outline" size="sm" onClick={resetForm}>Yana yuborish</Button>
            </div>
          )}
        </div>
      </Card>

      {/* Right: Summary */}
      <aside className="lg:sticky lg:top-24 h-fit space-y-4">
        <Card className="p-6 bg-gradient-to-br from-primary to-blue-900 text-white shadow-xl">
          <div className="text-sm leading-5 opacity-90">10 yillik patent uchun umumiy xarajat</div>
          <div className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">{fees.total.toLocaleString()} so‘m</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Pill>{fees.classCount} klass</Pill>
            <Pill>{isYuridik ? 'Yuridik' : 'Jismoniy'} shaxs</Pill>
            <Pill>{speed==='tez' ? 'Tezkor (1.5 oy)' : 'Oddiy (7 oy)'}</Pill>
            <Pill>{hasEkspert ? 'Ekspert bor' : 'Ekspert yo‘q'}</Pill>
          </div>
          <div className="mt-1 text-xs leading-5 opacity-90">10 yil muddat bilan himoyalanadi</div>
        </Card>

        <Card className="p-5">
          <h3 className="font-bold text-dark-blue mb-3">Xarajatlar tafsiloti</h3>
          <div className="space-y-4">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="font-semibold text-primary">1-bosqich (Dastlabki to‘lov)</div>
              <Row label="Yuridik xizmat (hamkorimiz)" value={PATENT_XIZMATI} />
              <Row label="Tovar belgisi uchun ariza boji" value={fees.step1} />
              <Divider />
              <Row label="1-bosqich jami" value={PATENT_XIZMATI + fees.step1} bold />
            </div>

            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
              <div className="font-semibold text-green-700">2-bosqich (Guvohnoma olish)</div>
              <Row label="Davlat boji (bazaviy)" value={fees.step2Base} />
              {fees.classCount > 1 && (
                <Row label={`Qo‘shimcha klasslar (${fees.classCount-1} ta)`} value={fees.step2Extra} />
              )}
              <Divider />
              <Row label="2-bosqich jami" value={fees.step2} bold />
            </div>

            {speed==='tez' && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <div className="font-semibold text-amber-700">Tezkor topshirish</div>
                <Row label="Asosiy (12 BHM + 12% NDS)" value={fees.expediteBase} />
                {fees.classCount>1 && (
                  <Row label={`Qo‘shimcha klasslar tezkor (${fees.classCount-1} ta)`} value={fees.expediteExtra} />
                )}
                <Divider />
                <Row label="Tezkor qo‘shimcha jami" value={fees.expediteTotal} bold />
              </div>
            )}

            {hasEkspert && (
              <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
                <div className="font-semibold text-purple-700">Ekspert tekshiruv</div>
                <Row label="Bazaviy (2×BHM)" value={fees.ekspertBase} />
                {fees.classCount>1 && (
                  <Row label={`Qo‘shimcha klasslar (${fees.classCount-1} ta)`} value={fees.ekspertExtra} />
                )}
                <Divider />
                <Row label="Ekspert xizmati jami" value={fees.ekspertTotal} bold />
              </div>
            )}

            <div className="rounded-xl border border-amber-300 bg-amber-100/50 p-4 text-amber-900 text-xs">
              <div className="font-semibold mb-1">Eslatma</div>
              <p>
                Guvohnoma 10 yil amal qiladi. Uzaytirish: jismoniy — {(4*BHM).toLocaleString()} so‘m, yuridik — {(6*BHM).toLocaleString()} so‘m.
                Qo‘shimcha klass: jismoniy — {(0.5*BHM).toLocaleString()} so‘m (1-bosqich), {(1*BHM).toLocaleString()} so‘m (2-bosqich);
                yuridik — {(4*BHM).toLocaleString()} so‘m (ikkala bosqich). Tezkor opsiya har bir qo‘shimcha klass uchun {EXPEDITE_PER_EXTRA_CLASS.toLocaleString()} so‘m.
                Barcha narxlar BHM (bazaviy hisoblash miqdori)ga bog'liq va o'zgarishi mumkin. BHM hozirda {BHM.toLocaleString()} so'm.
              </p>
            </div>
          </div>
        </Card>
      </aside>
    </div>
  );
}

// ========================
// 6) Kichik prezentatsion komponentlar
// ========================
function LabeledInput({ label, ...rest }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input {...rest} />
    </div>
  );
}

function IconButton({ children, ...props }) {
  return (
    <Button type="button" variant="outline" size="icon" className="h-10 w-10 text-lg" {...props}>
      {children}
    </Button>
  );
}

function ToggleButton({ active, children, ...props }) {
  return (
    <Button type="button" variant={active ? 'default' : 'outline'} {...props}>
        {children}
    </Button>
  );
}

function Chip({ active, children, ...props }) {
  return (
    <Button type="button" size="sm" variant={active ? 'default' : 'outline'} {...props}>
        {children}
    </Button>
  );
}

function Pill({ children }) {
  return <span className="px-2.5 py-1 rounded-full text-xs bg-white/15 ring-1 ring-white/25">{children}</span>;
}

function Row({ label, value, bold=false }) {
  return (
    <div className="mt-2 flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn(bold ? 'font-bold text-foreground' : 'font-semibold text-foreground')}>{Number(value).toLocaleString()} so‘m</span>
    </div>
  );
}

function Divider() {
  return <div className="mt-2 pt-2 border-t" />;
}

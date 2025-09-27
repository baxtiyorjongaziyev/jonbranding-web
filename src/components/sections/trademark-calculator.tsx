'use client';

import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Loader2, Minus, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { event as gtagEvent } from '@/lib/gtag';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';


const BHM = 412000;
const PATENT_XIZMATI = 3000000;
const EXPEDITE_BASE = Math.round(12 * BHM * 1.12);
const EXPEDITE_PER_EXTRA_CLASS = 461000;
const STEP1_JISMONIY = 4 * BHM;
const STEP1_YURIDIK  = 6 * BHM;
const STEP1_EXTRA_JISMONIY = 0.5 * BHM;
const STEP1_EXTRA_YURIDIK  = 4 * BHM;
const STEP2_JISMONIY = 6.8 * BHM;
const STEP2_YURIDIK  = 11.6 * BHM;
const STEP2_EXTRA_JISMONIY = 1 * BHM;
const STEP2_EXTRA_YURIDIK  = 4 * BHM;
const EXPERT_BASE = 2 * BHM;
const EXPERT_PER_EXTRA_CLASS = 1 * BHM;

const clampClassCount = (n: number) => {
  const x = Number(n);
  if (!Number.isFinite(x)) return 1;
  return Math.max(1, Math.min(45, Math.trunc(x)));
};

const isUzPhone = (s: string) => {
  if (!s || s.length !== 13) return false;
  if (!s.startsWith('+998')) return false;
  for (let i = 4; i < s.length; i++) {
    const c = s[i];
    if (c < '0' || c > '9') return false;
  }
  return true;
};

const allowPhoneTyping = (s: string) => {
  if (!s.startsWith('+998')) return false;
  if (s.length > 13) return false;
  for (let i = 4; i < s.length; i++) {
    const c = s[i];
    if (c < '0' || c > '9') return false;
  }
  return true;
};

export function calculateFees({
  isYuridik = false,
  classCount = 1,
  speed = 'oddiy',
  hasEkspert = false,
}: {
    isYuridik?: boolean;
    classCount?: number;
    speed?: 'oddiy' | 'tez';
    hasEkspert?: boolean;
}) {
  const cc = clampClassCount(classCount);

  const step1Base = isYuridik ? STEP1_YURIDIK : STEP1_JISMONIY;
  const step1Extra = (cc - 1) * (isYuridik ? STEP1_EXTRA_YURIDIK : STEP1_EXTRA_JISMONIY);
  const step1 = step1Base + step1Extra;

  const step2Base = isYuridik ? STEP2_YURIDIK : STEP2_JISMONIY;
  const step2Extra = (cc - 1) * (isYuridik ? STEP2_EXTRA_YURIDIK : STEP2_EXTRA_JISMONIY);
  const step2 = step2Base + step2Extra;

  const expediteBase = speed === 'tez' ? EXPEDITE_BASE : 0;
  const expediteExtra = speed === 'tez' ? (cc - 1) * EXPEDITE_PER_EXTRA_CLASS : 0;
  const expediteTotal = expediteBase + expediteExtra;

  const ekspertBase = hasEkspert ? EXPERT_BASE : 0;
  const ekspertExtra = hasEkspert ? (cc - 1) * EXPERT_PER_EXTRA_CLASS : 0;
  const ekspertTotal = ekspertBase + ekspertExtra;

  const davlatBoj = step1 + step2 + expediteTotal;
  const total = davlatBoj + PATENT_XIZMATI + ekspertTotal;

  return {
    step1, step1Base, step1Extra,
    step2, step2Base, step2Extra,
    expediteBase, expediteExtra, expediteTotal,
    ekspertBase, ekspertExtra, ekspertTotal,
    davlatBoj, total,
    classCount: cc,
  };
}

const DynamicToggle = ({ id, options, selected, onSelect }: {
    id: string;
    options: { value: string, label: string }[];
    selected: string;
    onSelect: (value: string) => void;
}) => {
    return (
        <div className="relative flex w-full rounded-full bg-secondary p-1">
            {options.map(option => (
                <div key={option.value} className="relative flex-1">
                    {selected === option.value && (
                        <motion.div
                            layoutId={`calculator-toggle-bg-${id}`}
                            className="absolute inset-0 rounded-full bg-primary shadow-md"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}
                    <button
                        onClick={() => onSelect(option.value)}
                        className={cn(
                            "relative w-full rounded-full py-2 px-4 text-center text-sm font-semibold transition-colors",
                            selected === option.value ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {option.label}
                    </button>
                </div>
            ))}
        </div>
    );
};

const t = {
    uz: {
        formTitle: "Ma'lumotlarni kiriting",
        brandNameLabel: "Brend nomi",
        brandNamePlaceholder: "Masalan: MyBrand",
        yourNameLabel: "Ismingiz",
        yourNamePlaceholder: "To'liq ismingizni kiriting",
        phoneLabel: "Telefon raqam",
        phonePlaceholder: "+998901234567",
        classCountLabel: "Faoliyat yo'nalishlari soni (klass)",
        classCountMax: "Maks. 45 ta",
        personTypeLabel: "Shaxs turi",
        personTypeOptions: [
            { value: 'jismoniy', label: 'Jismoniy shaxs' },
            { value: 'yuridik', label: 'Yuridik shaxs' }
        ],
        speedLabel: "Ko‘rib chiqish tezligi",
        speedOptions: [
            { value: 'oddiy', label: 'Oddiy (7 oy)' },
            { value: 'tez', label: 'Tezkor (1.5 oy)' }
        ],
        expertCheckLabel: "Qo'shimcha ekspert tekshiruvi",
        expertCheckOptions: [
            { value: 'ha', label: 'Yoqilgan' },
            { value: 'yoq', label: 'O‘chirilgan' }
        ],
        activityLabel: "Faoliyat turlari (ixtiyoriy)",
        activityPlaceholder: "Masalan: dizayn, qurilish, kiyim-kechak ishlab chiqarish...",
        activityHelp: "Bu klasslarni aniqlashda yordam beradi.",
        submitButton: "Patentlashga buyurtma berish",
        submittingButton: "Yuborilmoqda...",
        successMessage: "✅ Buyurtma qabul qilindi!",
        tryAgainButton: "Yana hisoblash",
        summaryTitle: "Xarajatlar tafsiloti",
        totalCostTitle: "10 yillik patent uchun taxminiy umumiy xarajat",
        currency: "so'm",
        totalCostNote: "Barcha davlat bojlari va xizmatlar narxi ichida",
        step1Title: "1-bosqich (Dastlabki to‘lov)",
        ourServiceFee: "Jamoamiz xizmati",
        applicationFee: "Tovar belgisi uchun ariza boji",
        step1Total: "1-bosqich jami",
        step2Title: "2-bosqich (Guvohnoma olish)",
        stateFeeBase: "Davlat boji (bazaviy)",
        extraClassesFee: (count: number) => `Qo‘shimcha klasslar (${count} ta)`,
        step2Total: "2-bosqich jami",
        expediteTitle: "Tezkor topshirish uchun qo'shimcha",
        expediteBaseFee: "Asosiy (12 BHM + 12% NDS)",
        expediteTotal: "Tezkor to'lov jami",
        expertCheckTitle: "Ekspert tekshiruvi",
        expertBaseFee: "Bazaviy (2×BHM)",
        expertTotal: "Ekspert xizmati jami",
        importantNoteTitle: "Muhim eslatma",
        importantNoteText: (bhm: string) => `Barcha narxlar O'zbekiston Respublikasi Adliya vazirligi tomonidan belgilangan bazaviy hisoblash miqdori (BHM)ga bog'liq va o'zgarishi mumkin. Hozirgi BHM ${bhm} so'm. Bu kalkulyator ommaviy oferta emas va faqat tanishish uchun mo'ljallangan.`,
        error_brand: "Iltimos, brend nomini kiriting.",
        error_name: "Iltimos, ismingizni kiriting.",
        error_phone: "Iltimos, to‘g‘ri telefon raqam kiriting.",
        error_server: "Serverda xatolik yuz berdi.",
        success_toast_title: "Muvaffaqiyatli!",
        success_toast_desc: "So'rovingiz qabul qilindi. Tez orada siz bilan bog'lanamiz!",
        error_toast_title: "Xatolik!",
        error_toast_desc: (msg: string) => msg || 'So‘rovni yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.',
    },
    ru: {
        formTitle: "Введите данные",
        brandNameLabel: "Название бренда",
        brandNamePlaceholder: "Например: MyBrand",
        yourNameLabel: "Ваше имя",
        yourNamePlaceholder: "Введите ваше полное имя",
        phoneLabel: "Номер телефона",
        phonePlaceholder: "+998901234567",
        classCountLabel: "Количество классов деятельности",
        classCountMax: "Макс. 45",
        personTypeLabel: "Тип лица",
        personTypeOptions: [
            { value: 'jismoniy', label: 'Физическое лицо' },
            { value: 'yuridik', label: 'Юридическое лицо' }
        ],
        speedLabel: "Скорость рассмотрения",
        speedOptions: [
            { value: 'oddiy', label: 'Обычная (7 мес.)' },
            { value: 'tez', label: 'Ускоренная (1.5 мес.)' }
        ],
        expertCheckLabel: "Дополнительная экспертиза",
        expertCheckOptions: [
            { value: 'ha', label: 'Включена' },
            { value: 'yoq', label: 'Отключена' }
        ],
        activityLabel: "Виды деятельности (необязательно)",
        activityPlaceholder: "Например: дизайн, строительство, производство одежды...",
        activityHelp: "Это поможет определить классы.",
        submitButton: "Заказать патентование",
        submittingButton: "Отправка...",
        successMessage: "✅ Заявка принята!",
        tryAgainButton: "Рассчитать снова",
        summaryTitle: "Детализация расходов",
        totalCostTitle: "Примерная общая стоимость патента на 10 лет",
        currency: "сум",
        totalCostNote: "Включая все госпошлины и стоимость услуг",
        step1Title: "Этап 1 (Первоначальный платеж)",
        ourServiceFee: "Услуги нашей команды",
        applicationFee: "Пошлина за подачу заявки",
        step1Total: "Итого за 1-й этап",
        step2Title: "Этап 2 (Получение свидетельства)",
        stateFeeBase: "Госпошлина (базовая)",
        extraClassesFee: (count: number) => `Дополнительные классы (${count})`,
        step2Total: "Итого за 2-й этап",
        expediteTitle: "Доплата за ускоренное рассмотрение",
        expediteBaseFee: "Основная (12 БРВ + 12% НДС)",
        expediteTotal: "Итого за ускорение",
        expertCheckTitle: "Экспертиза",
        expertBaseFee: "Базовая (2×БРВ)",
        expertTotal: "Итого за экспертизу",
        importantNoteTitle: "Важное примечание",
        importantNoteText: (bhm: string) => `Все цены зависят от базовой расчетной величины (БРВ), установленной Министерством юстиции Республики Узбекистан, и могут меняться. Текущая БРВ составляет ${bhm} сум. Этот калькулятор не является публичной офертой и предназначен только для ознакомления.`,
        error_brand: "Пожалуйста, введите название бренда.",
        error_name: "Пожалуйста, введите ваше имя.",
        error_phone: "Пожалуйста, введите правильный номер телефона.",
        error_server: "Произошла ошибка на сервере.",
        success_toast_title: "Успешно!",
        success_toast_desc: "Ваш запрос принят. Мы скоро с вами свяжемся!",
        error_toast_title: "Ошибка!",
        error_toast_desc: (msg: string) => msg || 'Произошла ошибка при отправке запроса. Пожалуйста, попробуйте снова.',
    }
};

export default function TrademarkCalculator({ lang = 'uz' }: { lang: string }) {
  const { toast } = useToast();
  const translations = t[lang as 'uz' | 'ru'];

  const [brand, setBrand] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998');
  const [activity, setActivity] = useState('');
  const [classCount, setClassCount] = useState(1);
  const [isYuridik, setIsYuridik] = useState(false);
  const [speed, setSpeed] = useState<'oddiy' | 'tez'>('oddiy');
  const [hasEkspert, setHasEkspert] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const fees = useMemo(
    () => calculateFees({ isYuridik, classCount, speed, hasEkspert }),
    [isYuridik, classCount, speed, hasEkspert]
  );

  const handleSubmit = async () => {
    if (!brand.trim()) {
        toast({ title: translations.error_toast_title, description: translations.error_brand, variant: "destructive" });
        return;
    }
    if (!name.trim()) {
         toast({ title: translations.error_toast_title, description: translations.error_name, variant: "destructive" });
        return;
    }
    if (!isUzPhone(phone)) {
        toast({ title: translations.error_toast_title, description: translations.error_phone, variant: "destructive" });
        return;
    }

    setLoading(true);

    const telegramMessage = [
      `🧾 ${lang === 'ru' ? 'Новая заявка на патент (с калькулятора)' : 'Yangi patent arizasi (Kalkulyatordan)'}`,
      `Brend: ${brand}`,
      `${lang === 'ru' ? 'Виды деятельности' : 'Faoliyat turlari'}: ${activity || (lang === 'ru' ? 'Не указано' : 'Kiritilmagan')}`,
      '---',
      `${lang === 'ru' ? 'Тип' : 'Turi'}: ${isYuridik ? (lang === 'ru' ? 'Юридическое' : 'Yuridik') : (lang === 'ru' ? 'Физическое' : 'Jismoniy')}`,
      `${lang === 'ru' ? 'Кол-во классов' : 'Klasslar soni'}: ${fees.classCount}`,
      `${lang === 'ru' ? 'Режим' : 'Rejim'}: ${speed === 'tez' ? (lang === 'ru' ? 'Ускоренный (1.5 мес.)' : 'Tezkor (1.5 oy)') : (lang === 'ru' ? 'Обычный (7 мес.)' : 'Oddiy (7 oy)')}`,
      `${lang === 'ru' ? 'Экспертиза' : 'Ekspert tekshiruvi'}: ${hasEkspert ? (lang === 'ru' ? 'Да' : 'Bor') : (lang === 'ru' ? 'Нет' : 'Yo‘q')}`,
      '---',
      `${lang === 'ru' ? 'ОБЩАЯ СТОИМОСТЬ' : 'UMUMIY NARX'}: ${fees.total.toLocaleString()} ${translations.currency}`,
    ].join('\n');

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            fullName: name, 
            phone,
            packageSummary: telegramMessage,
            totalPrice: fees.total
        }),
      });

      if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || translations.error_server);
      }

      gtagEvent('form_submit', {
        'event_category': 'Calculator',
        'event_label': 'Trademark Calculator',
        'value': fees.total
      });

      toast({
        title: translations.success_toast_title,
        description: translations.success_toast_desc,
        variant: 'default',
      });
      setSuccess(true);
    } catch (e: any) {
       toast({
        title: translations.error_toast_title,
        description: translations.error_toast_desc(e.message),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card className="p-6">
        <h2 className="text-xl font-bold text-dark-blue mb-4">{translations.formTitle}</h2>
        <div className="space-y-6">
          <LabeledInput label={translations.brandNameLabel} placeholder={translations.brandNamePlaceholder} value={brand} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setBrand(e.target.value)} />
          <LabeledInput label={translations.yourNameLabel} placeholder={translations.yourNamePlaceholder} value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setName(e.target.value)} />
          <LabeledInput label={translations.phoneLabel} placeholder={translations.phonePlaceholder} value={phone} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{ const v=e.target.value; if(allowPhoneTyping(v)) setPhone(v); }} />

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="font-medium">{translations.classCountLabel}</Label>
              <span className="text-xs text-slate-500">{translations.classCountMax}</span>
            </div>
            <div className="flex items-center gap-2">
                <IconButton onClick={() => setClassCount(clampClassCount(classCount - 1))} disabled={classCount <= 1}>
                    <Minus className="h-4 w-4"/>
                </IconButton>
                <Slider
                    value={[classCount]}
                    onValueChange={(value) => setClassCount(value[0])}
                    min={1}
                    max={45}
                    step={1}
                    className="flex-1"
                />
                 <IconButton onClick={() => setClassCount(clampClassCount(classCount + 1))} disabled={classCount >= 45}>
                    <Plus className="h-4 w-4"/>
                </IconButton>
                <div className="flex items-center justify-center w-16 h-10 rounded-md border bg-secondary font-bold text-primary text-lg">
                    {classCount}
                </div>
            </div>
          </div>

          <div>
            <Label className="font-medium mb-2 block">{translations.personTypeLabel}</Label>
            <DynamicToggle 
              id="person-type"
              options={translations.personTypeOptions}
              selected={isYuridik ? 'yuridik' : 'jismoniy'}
              onSelect={(value) => setIsYuridik(value === 'yuridik')}
            />
          </div>

          <div>
            <Label className="font-medium mb-2 block">{translations.speedLabel}</Label>
             <DynamicToggle 
              id="speed"
              options={translations.speedOptions}
              selected={speed}
              onSelect={(value) => setSpeed(value as 'oddiy' | 'tez')}
            />
          </div>

          <div>
            <Label className="font-medium mb-2 block">{translations.expertCheckLabel}</Label>
            <DynamicToggle 
              id="expert-check"
              options={translations.expertCheckOptions}
              selected={hasEkspert ? 'ha' : 'yoq'}
              onSelect={(value) => setHasEkspert(value === 'ha')}
            />
          </div>

          <div>
            <Label className="font-medium">{translations.activityLabel}</Label>
            <Textarea
              className="mt-1"
              rows={3}
              placeholder={translations.activityPlaceholder}
              value={activity}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=>setActivity(e.target.value)}
            />
             <p className="mt-1 text-xs text-slate-500">{translations.activityHelp}</p>
          </div>
        
          {!success ? (
            <Button
                className="w-full text-base py-6 shadow-ocean animate-breathing"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {translations.submittingButton}</> : translations.submitButton}
            </Button>
          ) : (
             <div className="text-center text-green-700 bg-green-50 border border-green-200 p-3 rounded-xl flex items-center justify-center gap-4">
                <span>{translations.successMessage}</span>
                <Button variant="outline" size="sm" onClick={resetForm}>{translations.tryAgainButton}</Button>
            </div>
          )}
        </div>
      </Card>

      <aside className="lg:sticky lg:top-24 h-fit space-y-4">
        <Card className="p-6 bg-gradient-to-br from-primary to-blue-900 text-white shadow-xl rounded-2xl">
          <div className="text-sm leading-5 opacity-90">{translations.totalCostTitle}</div>
          <div className="mt-2 text-4xl sm:text-5xl font-extrabold tracking-tight flex items-baseline">
            {fees.total.toLocaleString('fr-FR')}
            <span className="text-2xl font-medium text-blue-200 ml-2">{translations.currency}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Pill>{fees.classCount} {lang === 'ru' ? 'класс' : 'klass'}</Pill>
            <Pill>{isYuridik ? (lang === 'ru' ? 'Юр. лицо' : 'Yuridik shaxs') : (lang === 'ru' ? 'Физ. лицо' : 'Jismoniy shaxs')}</Pill>
            <Pill>{speed==='tez' ? (lang === 'ru' ? 'Ускоренно' : 'Tezkor') : (lang === 'ru' ? 'Обычно' : 'Oddiy')}</Pill>
            {hasEkspert && <Pill>Ekspert+</Pill>}
          </div>
          <div className="mt-1 text-xs leading-5 opacity-90">{translations.totalCostNote}</div>
        </Card>

        <Card className="p-5">
          <h3 className="font-bold text-dark-blue mb-3">{translations.summaryTitle}</h3>
          <div className="space-y-4">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="font-semibold text-primary">{translations.step1Title}</div>
              <Row label={translations.ourServiceFee} value={PATENT_XIZMATI} currency={translations.currency} />
              <Row label={translations.applicationFee} value={fees.step1} currency={translations.currency} />
              <Divider />
              <Row label={translations.step1Total} value={PATENT_XIZMATI + fees.step1} bold currency={translations.currency} />
            </div>

            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
              <div className="font-semibold text-green-700">{translations.step2Title}</div>
              <Row label={translations.stateFeeBase} value={fees.step2Base} currency={translations.currency} />
              {fees.classCount > 1 && (
                <Row label={translations.extraClassesFee(fees.classCount - 1)} value={fees.step2Extra} currency={translations.currency} />
              )}
              <Divider />
              <Row label={translations.step2Total} value={fees.step2} bold currency={translations.currency} />
            </div>

            {speed==='tez' && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <div className="font-semibold text-amber-700">{translations.expediteTitle}</div>
                <Row label={translations.expediteBaseFee} value={fees.expediteBase} currency={translations.currency} />
                {fees.classCount>1 && (
                  <Row label={translations.extraClassesFee(fees.classCount - 1)} value={fees.expediteExtra} currency={translations.currency} />
                )}
                <Divider />
                <Row label={translations.expediteTotal} value={fees.expediteTotal} bold currency={translations.currency} />
              </div>
            )}

            {hasEkspert && (
              <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
                <div className="font-semibold text-purple-700">{translations.expertCheckTitle}</div>
                <Row label={translations.expertBaseFee} value={fees.ekspertBase} currency={translations.currency} />
                {fees.classCount>1 && (
                  <Row label={translations.extraClassesFee(fees.classCount - 1)} value={fees.ekspertExtra} currency={translations.currency} />
                )}
                <Divider />
                <Row label={translations.expertTotal} value={fees.ekspertTotal} bold currency={translations.currency} />
              </div>
            )}

            <div className="rounded-xl border border-amber-300 bg-amber-100/50 p-4 text-amber-900 text-xs">
              <div className="font-semibold mb-1">{translations.importantNoteTitle}</div>
              <p>{translations.importantNoteText(BHM.toLocaleString())}</p>
            </div>
          </div>
        </Card>
      </aside>
    </div>
  );
}

function LabeledInput({ label, ...rest }: {label: string, [key: string]: any}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input {...rest} />
    </div>
  );
}

function IconButton({ children, ...props }: { children: React.ReactNode, [key: string]: any }) {
  return (
    <Button type="button" variant="outline" size="icon" className="h-10 w-10 text-lg rounded-md" {...props}>
      {children}
    </Button>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="px-2.5 py-1 rounded-full text-xs bg-white/15 ring-1 ring-white/25">{children}</span>;
}

function Row({ label, value, bold=false, currency }: { label: string, value: number, bold?: boolean, currency: string }) {
  return (
    <div className="mt-2 flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-semibold text-foreground", bold && 'font-bold')}>{Number(value).toLocaleString('fr-FR')} {currency}</span>
    </div>
  );
}

function Divider() {
  return <div className="mt-2 pt-2 border-t" />;
}

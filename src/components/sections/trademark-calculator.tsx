
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

export default function TrademarkCalculator({ translations }: { translations: any }) {
  const { toast } = useToast();

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
  
  if (!translations) return null;

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
      `🧾 ${translations.telegramTitle}`,
      `Brend: ${brand}`,
      `${translations.activityLabel}: ${activity || translations.notSpecified}`,
      '---',
      `${translations.personTypeLabel}: ${isYuridik ? translations.personTypeOptions[1].label : translations.personTypeOptions[0].label}`,
      `${translations.classCountLabel}: ${fees.classCount}`,
      `${translations.speedLabel}: ${speed === 'tez' ? translations.speedOptions[1].label : translations.speedOptions[0].label}`,
      `${translations.expertCheckLabel}: ${hasEkspert ? translations.expertCheckOptions[0].label : translations.expertCheckOptions[1].label}`,
      '---',
      `${translations.totalCostTitle.toUpperCase()}: ${fees.total.toLocaleString()} ${translations.currency}`,
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
        description: e.message || translations.error_server,
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
  
  const getExtraClassesFeeLabel = () => {
    const count = fees.classCount - 1;
    return translations.extraClassesFee.replace('{count}', count.toString());
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
            <Pill>{fees.classCount} {translations.classLabel}</Pill>
            <Pill>{isYuridik ? translations.personTypeOptions[1].label : translations.personTypeOptions[0].label}</Pill>
            <Pill>{speed==='tez' ? translations.speedOptions[1].labelShort : translations.speedOptions[0].labelShort}</Pill>
            {hasEkspert && <Pill>{translations.expertCheckLabelShort}</Pill>}
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
                <Row label={getExtraClassesFeeLabel()} value={fees.step2Extra} currency={translations.currency} />
              )}
              <Divider />
              <Row label={translations.step2Total} value={fees.step2} bold currency={translations.currency} />
            </div>

            {speed==='tez' && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <div className="font-semibold text-amber-700">{translations.expediteTitle}</div>
                <Row label={translations.expediteBaseFee} value={fees.expediteBase} currency={translations.currency} />
                {fees.classCount>1 && (
                  <Row label={getExtraClassesFeeLabel()} value={fees.expediteExtra} currency={translations.currency} />
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
                  <Row label={getExtraClassesFeeLabel()} value={fees.ekspertExtra} currency={translations.currency} />
                )}
                <Divider />
                <Row label={translations.expertTotal} value={fees.ekspertTotal} bold currency={translations.currency} />
              </div>
            )}

            <div className="rounded-xl border border-amber-300 bg-amber-100/50 p-4 text-amber-900 text-xs">
              <div className="font-semibold mb-1">{translations.importantNoteTitle}</div>
              <p>{translations.importantNoteText}</p>
              <p>{translations.importantNoteBHM.replace("{bhm}", BHM.toLocaleString())}</p>
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

    


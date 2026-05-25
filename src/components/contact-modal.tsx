'use client';

import { FC, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, ArrowRight, ArrowLeft, MessageCircle, Mail, Phone, Instagram, Send, X, Globe, User, CheckCircle2, Linkedin, PhoneCall, Building2, Wallet, MapPin, Target, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTelegram } from '@/hooks/use-telegram';
import { generateEventId, getGaClientId, trackLead, trackEvent } from '@/lib/analytics';
import { getDictionary } from '@/lib/dictionaries';
import Magnetic from '@/components/ui/magnetic';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageSummary?: string;
  totalPrice?: number;
  onFormSubmitSuccess?: () => void;
  lang: string;
}

const ContactModal: FC<ContactModalProps> = ({ isOpen, onClose, packageSummary, totalPrice, onFormSubmitSuccess, lang }) => {
  const { toast } = useToast();
  const [isSubmitting, setSubmitting] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(4);
  const hasStartedRef = useRef(false);
  const { user } = useTelegram();
  const [translations, setTranslations] = useState<any>(null);
  const fallback = useMemo(() => {
    const defaultFallbacks: Record<string, any> = {
      uz: {
        quickContactLabel: "Tez aloqa",
        auditGivesLabel: "Auditda olasiz",
        auditOfferStack: [
          "5 ta ishonch yo'qotadigan nuqta",
          "Qaysi xizmat hozir kerakligini aniqlash",
          "Majburiy sotuvsiz aniq tavsiya"
        ],
        objectionCopy: "Hali loyiha boshlashga tayyor bo'lmasangiz ham mayli: auditdan keyin nima qilish kerakligini bilib olasiz.",
        riskCopy: "Telefon qoldirish shartnoma degani emas. Avval brendingizdagi muammo, imkoniyat va eng foydali keyingi qadamni ko'rsatamiz."
      },
      ru: {
        quickContactLabel: "Быстрая связь",
        auditGivesLabel: "Что дает аудит",
        auditOfferStack: [
          "5 слабых мест вашего бренда",
          "Четкая рекомендация по услугам",
          "Никакого давления"
        ],
        objectionCopy: "Даже если вы не готовы к покупке, аудит даст вам четкий следующий шаг.",
        riskCopy: "Оставить телефон — это не контракт. Сначала мы покажем вам проблему и возможность."
      },
      en: {
        quickContactLabel: "Quick contact",
        auditGivesLabel: "Free audit gives",
        auditOfferStack: [
          "5 trust gaps in your brand",
          "Clear service recommendation",
          "No pressure"
        ],
        objectionCopy: "Even if you are not ready to buy, the audit gives you a clear next step.",
        riskCopy: "Leaving your phone is not a contract. First we show the problem and opportunity."
      },
      zh: {
        quickContactLabel: "快速联系",
        auditGivesLabel: "免费审计提供",
        auditOfferStack: [
          "您品牌的 5 个信任漏洞",
          "明确的服务建议",
          "没有任何压力"
        ],
        objectionCopy: "即使您还没有准备好购买，审计也会给您一个明确的下一步。",
        riskCopy: "留下您的电话不是合同。首先我们会向您展示问题และ机会。"
      }
    };
    return defaultFallbacks[lang] || defaultFallbacks.uz;
  }, [lang]);

  const quickContactLabel = translations?.quickContactLabel || fallback.quickContactLabel;
  const auditOfferStack: string[] = translations?.auditOfferStack || fallback.auditOfferStack;
  const objectionCopy = translations?.objectionCopy || fallback.objectionCopy;
  const riskCopy = translations?.riskCopy || fallback.riskCopy;

  useEffect(() => {
    if (isOpen) {
      setStep(4);
      getDictionary(lang as any).then(dict => {
        if (dict && dict.contactModal) {
          setTranslations(dict.contactModal);
        }
      });
    }
  }, [isOpen, lang]);

  const formSchema = useMemo(() => {
    return z.object({
      role: z.string().optional(),
      revenue: z.string().optional(),
      ambition: z.string().optional(),
      pain: z.string().optional(),
      budget: z.string().optional(),
      fullName: z
        .string()
        .min(2, { message: translations?.formErrors?.fullName || 'Ism kiritilishi shart (minimal 2 ta harf)' })
        .max(100, { message: 'Ism 100 ta harfdan kam bo\'lishi kerak' })
        .regex(/^[a-zA-Z\s\u0400-\u04FF\u0600-\u06FF]+$/, { message: 'Ismda faqat harflar bo\'lishi mumkin' }),
      phone: z
        .string()
        .min(12, { message: translations?.formErrors?.phone || '+998 kodni bilan to\'liq telefon raqamini kiriting' })
        .regex(/^\+998\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}|^\+998\d{9,12}/, { message: 'Telefon raqami noto\'g\'ri formatda' }),
      telegram: z.string().optional(),
    });
  }, [translations]);

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      role: '',
      revenue: '',
      ambition: '',
      pain: '',
      budget: '',
      fullName: '',
      phone: '+998',
      telegram: '',
    },
  });

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return '+998';
    let formatted = '+998';
    if (numbers.length > 3) formatted += ` (${numbers.substring(3, 5)}`;
    if (numbers.length > 5) formatted += `) ${numbers.substring(5, 8)}`;
    if (numbers.length > 8) formatted += `-${numbers.substring(8, 10)}`;
    if (numbers.length > 10) formatted += `-${numbers.substring(10, 12)}`;
    return formatted;
  };

  const onSubmit: SubmitHandler<any> = async (data) => {
    setSubmitting(true);
    const eventId = generateEventId('lead');
    const gaClientId = getGaClientId();
    const pageLocation = typeof window !== 'undefined' ? window.location.href : undefined;
    const ctaSource = packageSummary ? 'package_builder' : 'brand_audit_modal';

    trackEvent({
      action: 'lead_form_submitted',
      category: 'Lead Form',
      label: 'Brand Audit',
      event_id: eventId,
      form_name: 'brand_audit',
      cta_source: ctaSource,
      page_location: pageLocation,
    });

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          packageSummary,
          totalPrice,
          source: 'brand_audit_offer',
          lang,
          eventId,
          gaClientId,
          pageLocation,
          ctaSource,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Server error');
      
      setSubmitted(true);
      confetti({ 
        particleCount: 150, 
        spread: 90, 
        origin: { y: 0.6 },
        colors: ['#2563eb', '#3b82f6', '#ffffff', '#000000']
      });

      // Remove instant closure to show success screen
      // if (onFormSubmitSuccess) onFormSubmitSuccess();

      setTimeout(() => {
        try {
          trackLead({ 
            source: 'brand_audit_offer', 
            value: totalPrice, 
            eventId: result.eventId || eventId,
            serverTracked: true,
            gaClientId,
            summary: packageSummary,
            form_name: 'brand_audit',
            cta_source: ctaSource,
            has_telegram: Boolean(data.telegram),
          });
        } catch (e) {}
      }, 100);

    } catch (error: any) {
      trackEvent({
        action: 'lead_form_error',
        category: 'Lead Form',
        label: 'Brand Audit',
        event_id: eventId,
        error_message: error.message,
      });
      toast({ title: translations?.errorToast?.title || 'Xato', description: error.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormStart = () => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    trackEvent({
      action: 'lead_form_started',
      category: 'Lead Form',
      label: 'Brand Audit',
      form_name: 'brand_audit',
    });
  };

  const nextStep = useCallback(async () => {
    let fields: string[] = [];
    if (step === 1) fields = ['role', 'revenue'];
    if (step === 2) fields = ['ambition', 'pain'];
    if (step === 3) fields = ['budget'];
    if (step === 4) fields = ['fullName', 'phone'];

    const isValid = await form.trigger(fields as any);
    if (isValid) {
      trackEvent({ action: 'form_step_completed', category: 'Contact Form', label: `Step ${step}`, value: step });
      setStep(prev => prev + 1);
    } else {
      trackEvent({ action: 'form_step_failed', category: 'Contact Form', label: `Step ${step}` });
    }
  }, [step, form]);

  const prevStep = () => setStep(prev => prev - 1);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && step < 4 && !isSubmitting) {
      e.preventDefault();
      nextStep();
    }
  };

  useEffect(() => {
    if (isOpen) {
      setStep(4);
      setSubmitted(false);
      hasStartedRef.current = false;
      if (user) form.setValue('fullName', `${user.first_name || ''} ${user.last_name || ''}`.trim());
      trackEvent({
        action: 'modal_opened',
        category: 'Lead Form',
        label: 'Brand Audit',
        form_name: 'brand_audit',
      });
    }
  }, [isOpen, form, user]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-h-[calc(100dvh-1rem)] w-[95vw] max-w-[1000px] overflow-hidden rounded-[2.5rem] sm:rounded-[3rem] md:rounded-[3.5rem] lg:rounded-[4rem] border-none bg-transparent p-0 shadow-none md:w-full [&>button:last-child]:hidden">
        <DialogDescription className="sr-only">
          {translations?.srDescription || 'Brand audit contact form'}
        </DialogDescription>
        {/* Safe, permanent close button that never scrolls away */}
        <button
          type="button"
          onClick={onClose}
          aria-label={translations?.buttons?.close}
          className="absolute right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/80 bg-white/95 text-slate-900 shadow-[0_18px_45px_-24px_rgba(15,23,42,0.9)] transition-[background-color,transform,color] duration-200 hover:bg-slate-950 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 active:scale-[0.96]"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="relative flex max-h-[calc(100dvh-1rem)] flex-col overflow-y-auto overscroll-contain rounded-[2.5rem] sm:rounded-[3rem] md:rounded-[3.5rem] lg:rounded-[4rem] bg-white shadow-2xl md:h-[620px] md:flex-row md:overflow-hidden" onKeyDown={handleKeyDown}>
          
          <div className="relative flex w-full shrink-0 flex-col justify-between overflow-hidden bg-[#050912] p-6 pr-16 text-white md:w-[40%] md:p-12 md:pr-12">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.26),transparent_55%,rgba(58,225,255,0.14))] pointer-events-none" />
            
            <div className="relative z-10 w-full">
              <h2 className="text-2xl md:text-5xl font-extrabold leading-tight mb-2 md:mb-4 text-white drop-shadow-sm">
                {translations?.sidebarTitle}
              </h2>
              <p className="text-gray-300/80 text-xs md:text-base leading-relaxed mb-4 md:mb-8 max-w-[280px]">
                {translations?.sidebarSubtitle || 'Build your high-profit branding system with our experts.'}
              </p>
              <div className="grid gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 md:p-4">
                <div className="text-[10px] font-black uppercase tracking-[0.24em] text-brand-cyan">
                  {translations?.auditGivesLabel || 'Free audit gives'}
                </div>
                {auditOfferStack.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-xs font-bold leading-5 text-white/90">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-lime" />
                    {item}
                  </div>
                ))}
              </div>
              
              <div className="mt-10 hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:block">
                <div className="text-[10px] font-black uppercase tracking-[0.24em] text-white/60">
                  {translations?.auditTimeLabel || 'Audit format'}
                </div>
                <div className="mt-3 grid gap-2">
                  {(translations?.auditFormat || []).map((item: string) => (
                    <div key={item} className="rounded-xl bg-white/[0.06] px-3 py-2 text-xs font-bold leading-5 text-white/86">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-6 md:mt-12 flex flex-col gap-4 md:gap-6 hidden md:flex">
              <div className="flex gap-4">
                <a href="https://t.me/jonbranding" target="_blank" rel="noopener noreferrer" aria-label={translations?.telegramLinkLabel || 'Telegram'} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all group">
                  <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              </div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">{translations?.footerCopyright}</p>
            </div>
          </div>

          <div className="relative flex w-full flex-1 flex-col overflow-hidden bg-white p-6 md:w-[60%] md:rounded-r-3xl md:p-8 lg:p-10">


            <div className="flex-1 flex flex-col h-full py-4 md:py-6">
              {!translations ? (
                <div className="flex items-center justify-center h-48">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                  <motion.div key="form-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full">
                    <div className="mb-6 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100 shadow-sm animate-pulse-subtle">
                        <Target className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{translations?.header}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {step < 4 && (
                          <button
                            type="button"
                            onClick={() => setStep(4)}
                            className="rounded-full bg-gray-900 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white transition-colors hover:bg-blue-600"
                          >
                            {quickContactLabel}
                          </button>
                        )}
                        <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">
                          {translations?.contactBadge}
                        </div>
                      </div>
                    </div>

                    {step === 1 && (
                      <div className="mb-5 grid grid-cols-1 gap-2 rounded-2xl border border-blue-100 bg-blue-50/70 p-3 sm:grid-cols-3">
                        <a href="tel:+998336450097" className="flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-black text-gray-900 shadow-sm transition-colors hover:text-blue-600">
                          <PhoneCall className="h-4 w-4 text-blue-600" />
                          +998 33 645 00 97
                        </a>
                        <a href="https://t.me/jonbranding" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-black text-gray-900 shadow-sm transition-colors hover:text-blue-600">
                          <MessageCircle className="h-4 w-4 text-blue-600" />
                          Telegram
                        </a>
                        <button type="button" onClick={() => setStep(4)} className="flex items-center justify-center rounded-xl bg-gray-900 px-3 py-2 text-xs font-black text-white shadow-sm transition-colors hover:bg-blue-600">
                          {quickContactLabel}
                        </button>
                      </div>
                    )}

                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} onFocus={handleFormStart} className="flex-1 flex flex-col">
                        <div className="flex-1 py-2 pr-1">
                          <AnimatePresence mode="wait">
                            {step === 1 && (
                              <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                                <div>
                                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{translations?.steps?.step1?.title}</h3>
                                  <p className="text-gray-500 text-xs leading-relaxed">{translations?.steps?.step1?.subtitle}</p>
                                </div>

                                <FormField control={form.control} name="role" render={({ field }) => (
                                  <FormItem className="space-y-3">
                                    <FormLabel className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{translations?.fields?.role?.label}</FormLabel>
                                    <FormControl>
                                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 gap-2">
                                        {translations?.fields?.role?.options?.map((opt: any) => (
                                          <FormItem key={opt.v}>
                                            <FormLabel className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 ${field.value === opt.v ? 'bg-blue-50 border-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.05)] scale-[1.01]' : 'bg-white border-gray-100 hover:border-gray-200'}`}>
                                              <FormControl><RadioGroupItem value={opt.v} className="sr-only" /></FormControl>
                                              <span className={`text-xs font-semibold ${field.value === opt.v ? 'text-blue-700' : 'text-gray-700'}`}>{opt.l}</span>
                                            </FormLabel>
                                          </FormItem>
                                        ))}
                                      </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )} />

                                <FormField control={form.control} name="revenue" render={({ field }) => (
                                  <FormItem className="space-y-3">
                                    <FormLabel className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{translations?.fields?.revenue?.label}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl><SelectTrigger className="border-gray-200 rounded-xl h-11 bg-gray-50/50"><SelectValue placeholder="..." /></SelectTrigger></FormControl>
                                      <SelectContent className="rounded-xl border-gray-100">
                                        {translations?.fields?.revenue?.options?.map((opt: string) => (
                                          <SelectItem key={opt} value={opt} className="rounded-lg">{opt}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )} />
                              </motion.div>
                            )}

                            {step === 2 && (
                              <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                                <div>
                                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{translations?.steps?.step2?.title}</h3>
                                  <p className="text-gray-500 text-xs">{translations?.steps?.step2?.subtitle}</p>
                                </div>

                                <FormField control={form.control} name="ambition" render={({ field }) => (
                                  <FormItem className="space-y-2">
                                    <FormLabel className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{translations?.fields?.ambition?.label}</FormLabel>
                                    <FormControl>
                                      <Textarea placeholder={translations?.fields?.ambition?.placeholder} className="min-h-[80px] md:min-h-[100px] border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white transition-all resize-none text-sm" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )} />

                                <FormField control={form.control} name="pain" render={({ field }) => (
                                  <FormItem className="space-y-3">
                                    <FormLabel className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{translations?.fields?.pain?.label}</FormLabel>
                                    <FormControl>
                                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 gap-2">
                                        {translations?.fields?.pain?.options?.map((opt: any) => (
                                          <FormItem key={opt.v}>
                                            <FormLabel className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 ${field.value === opt.v ? 'bg-blue-50 border-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.05)] scale-[1.01]' : 'bg-white border-gray-100 hover:border-gray-200'}`}>
                                              <FormControl><RadioGroupItem value={opt.v} className="sr-only" /></FormControl>
                                              <span className={`text-xs font-semibold ${field.value === opt.v ? 'text-blue-700' : 'text-gray-700'}`}>{opt.l}</span>
                                            </FormLabel>
                                          </FormItem>
                                        ))}
                                      </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )} />
                              </motion.div>
                            )}

                            {step === 3 && (
                              <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                                <div>
                                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{translations?.steps?.step3?.title}</h3>
                                  <p className="text-gray-500 text-xs">{translations?.steps?.step3?.subtitle}</p>
                                </div>

                                <FormField control={form.control} name="budget" render={({ field }) => (
                                  <FormItem className="space-y-3">
                                    <FormLabel className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{translations?.fields?.budget?.label}</FormLabel>
                                    <FormControl>
                                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 gap-2">
                                        {translations?.fields?.budget?.options?.map((opt: string) => (
                                          <FormItem key={opt}>
                                            <FormLabel className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:bg-gray-50 ${field.value === opt ? 'bg-blue-50 border-blue-600 shadow-[0_4px_15px_-5px_rgba(37,99,235,0.2)]' : 'bg-white border-gray-100'}`}>
                                              <FormControl><RadioGroupItem value={opt} className="sr-only" /></FormControl>
                                              <div className="flex items-center gap-3">
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${field.value === opt ? 'border-blue-600' : 'border-gray-300'}`}>
                                                  {field.value === opt && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                                                </div>
                                                <span className={`text-xs font-bold ${field.value === opt ? 'text-blue-900' : 'text-gray-900'}`}>{opt}</span>
                                              </div>
                                              <Wallet className={`w-3.5 h-3.5 transition-colors ${field.value === opt ? 'text-blue-600' : 'text-gray-400'}`} />
                                            </FormLabel>
                                          </FormItem>
                                        ))}
                                      </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )} />

                                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/50 flex gap-3 items-center">
                                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0 animate-pulse" />
                                  <p className="text-[10px] text-blue-800/80 italic font-medium">
                                    {translations?.description || objectionCopy}
                                  </p>
                                </div>
                              </motion.div>
                            )}

                            {step === 4 && (
                              <motion.div key="step4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                                <div>
                                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{translations?.steps?.step4?.title}</h3>
                                  <p className="text-gray-500 text-xs">{translations?.steps?.step4?.subtitle}</p>
                                </div>

                                <FormField control={form.control} name="fullName" render={({ field, fieldState }) => (
                                  <FormItem className="space-y-1">
                                    <FormLabel className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{translations?.fields?.name?.label}</FormLabel>
                                    <FormControl>
                                      <motion.div 
                                        animate={fieldState.invalid ? { x: [0, -6, 6, -6, 6, 0] } : {}}
                                        transition={{ duration: 0.4 }}
                                        className="relative"
                                      >
                                        <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                                        <Input
                                            placeholder={translations?.fields?.name?.placeholder}
                                            className={`pl-12 rounded-xl h-12 bg-gray-50/50 focus:bg-white transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-600 ${fieldState.invalid ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-200'}`}
                                            aria-invalid={fieldState.invalid ? "true" : "false"}
                                            autoComplete="name"
                                            {...field}
                                        />
                                      </motion.div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )} />

                                <FormField control={form.control} name="phone" render={({ field, fieldState }) => (
                                  <FormItem className="space-y-1">
                                    <FormLabel className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{translations?.fields?.phone?.label}</FormLabel>
                                    <FormControl>
                                      <motion.div 
                                        animate={fieldState.invalid ? { x: [0, -6, 6, -6, 6, 0] } : {}}
                                        transition={{ duration: 0.4 }}
                                        className="relative"
                                      >
                                        <PhoneCall className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                                        <Input 
                                          placeholder={translations?.fields?.phone?.placeholder} 
                                          className={`pl-12 rounded-xl h-12 bg-gray-50/50 focus:bg-white font-mono transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-600 ${fieldState.invalid ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-200'}`}
                                          value={field.value}
                                          aria-invalid={fieldState.invalid ? "true" : "false"}
                                          autoComplete="tel"
                                          inputMode="tel"
                                          onChange={(e) => {
                                            const formatted = formatPhoneNumber(e.target.value);
                                            field.onChange(formatted);
                                          }}
                                        />
                                      </motion.div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )} />

                                <FormField control={form.control} name="telegram" render={({ field }) => (
                                  <FormItem className="space-y-1">
                                    <FormLabel className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{translations?.fields?.telegram?.label}</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <MessageCircle className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                                        <Input placeholder={translations?.fields?.telegram?.placeholder || '@username'} className="pl-12 border-gray-200 rounded-xl h-12 bg-gray-50/50 focus:bg-white transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-600" autoComplete="off" {...field} />
                                      </div>
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="z-10 mt-auto shrink-0 border-t border-gray-50 bg-white pt-4 pb-[calc(env(safe-area-inset-bottom)+0.25rem)] md:pb-0 md:pt-4">
                          <div className="flex gap-4">
                            {step > 1 && step < 4 && (
                              <Button type="button" variant="ghost" onClick={prevStep} className="flex-1 h-11 md:h-12 rounded-full text-gray-500 font-bold hover:bg-gray-50 active:scale-[0.97] transition-transform duration-150">
                                {translations?.buttons?.back || 'Back'}
                              </Button>
                            )}
                            
                            {step < 4 ? (
                              <Button type="button" onClick={nextStep} className="flex-[2] h-11 md:h-12 bg-gray-900 hover:bg-slate-950 text-white rounded-full font-bold group shadow-xl shadow-gray-200/50 active:scale-[0.97] transition-transform duration-150">
                                {translations?.buttons?.next || 'Next Step'}
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            ) : (
                              <Button type="submit" disabled={isSubmitting} className="flex-[2] h-11 md:h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-xl shadow-blue-100 flex items-center justify-center gap-2 group transition-all active:scale-[0.97] duration-150">
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                  <>
                                    {translations?.buttons?.submit}
                                    <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-600 font-medium tracking-tight">
                            <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                            {translations?.trustBadge}
                          </div>
                          <div className="mx-auto mt-2 max-w-md text-center text-[10px] font-semibold leading-4 text-gray-600">
                            {riskCopy}
                          </div>
                        </div>
                      </form>
                    </Form>
                  </motion.div>
                ) : (
                  <motion.div key="success-container" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 20, stiffness: 200 }} className="flex flex-col items-center text-center py-12 px-4">
                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-8 relative">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1.2 }} transition={{ type: 'spring', delay: 0.2 }} className="absolute inset-0 bg-blue-100 rounded-full opacity-50" />
                      <CheckCircle2 className="w-12 h-12 text-blue-600 relative z-10" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                      {translations?.successStep?.title || 'Success!'}
                    </h3>
                    <p className="text-gray-500 max-w-sm mb-12 leading-relaxed">
                      {translations?.successStep?.description || 'We have received your request. Our strategist will contact you shortly.'}
                    </p>
                    
                    <div className="w-full max-w-sm p-6 bg-gray-50 rounded-3xl border border-gray-100 text-left space-y-4 mb-10">
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">{translations?.successStep?.nextSteps || 'Next Steps'}</p>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
                          <MessageCircle className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 mb-0.5">{translations?.successStep?.telegramButton || 'Join Telegram'}</p>
                          <p className="text-[11px] text-gray-500 leading-snug">{translations?.successStep?.telegramDesc || 'Get updates and insights.'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 w-full max-w-sm">
                      <Button asChild className="h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-xl shadow-blue-100 group">
                        <a href="https://t.me/jonbranding" target="_blank" rel="noopener noreferrer">
                          {translations?.successStep?.telegramButton || 'Open Telegram'}
                          <ExternalLink className="ml-2 w-4 h-4 opacity-70 group-hover:opacity-100" />
                        </a>
                      </Button>
                      <Button variant="ghost" onClick={onClose} className="h-12 rounded-full text-gray-600 font-bold">
                        {translations?.buttons?.close}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;

'use client';

import { FC, useState, useEffect, useMemo, useCallback } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, ArrowRight, ArrowLeft, MessageCircle, Mail, Phone, Instagram, Send, X, Globe, User, CheckCircle2, Linkedin, PhoneCall, Building2, Wallet, MapPin, Target, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTelegram } from '@/hooks/use-telegram';
import { trackLead, trackEvent } from '@/lib/analytics';
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
  const [step, setStep] = useState(1);
  const { user } = useTelegram();
  const [translations, setTranslations] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      getDictionary(lang as any).then(dict => {
        if (dict && dict.contactModal) {
          setTranslations(dict.contactModal);
        }
      });
    }
  }, [isOpen, lang]);

  const formSchema = useMemo(() => {
    return z.object({
      role: z.string().min(1, { message: translations?.formErrors?.role || 'Tanlang' }),
      revenue: z.string().min(1, { message: translations?.formErrors?.revenue || 'Tanlang' }),
      ambition: z.string().min(3, { message: translations?.formErrors?.ambition || 'Maqsad kiritilishi shart' }),
      pain: z.string().min(1, { message: translations?.formErrors?.pain || 'To\'siqni tanlang' }),
      budget: z.string().min(1, { message: translations?.formErrors?.budget || 'Byudjetni tanlang' }),
      fullName: z.string().min(2, { message: translations?.formErrors?.fullName || 'Ism kiritilishi shart' }),
      phone: z.string().min(12, { message: translations?.formErrors?.phone || 'To\'liq telefon raqamini kiriting' }),
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

  const onPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    form.setValue('phone', formatted, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<any> = async (data) => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, packageSummary, totalPrice, source: 'king_kong_lite_funnel', lang }),
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

      if (onFormSubmitSuccess) onFormSubmitSuccess();

      setTimeout(() => {
        try {
          trackLead({ 
            source: 'king_kong_lite_funnel', 
            value: totalPrice, 
            summary: packageSummary,
            lead_details: data
          });
        } catch (e) {}
      }, 100);

    } catch (error: any) {
      toast({ title: translations?.errorToast?.title || 'Xato', description: error.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
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
      setStep(1);
      setSubmitted(false);
      if (user) form.setValue('fullName', `${user.first_name || ''} ${user.last_name || ''}`.trim());
      trackEvent({ action: 'form_opened', category: 'Contact Form', label: 'Strategic Session' });
    }
  }, [isOpen, form, user]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1000px] p-0 rounded-3xl border-none bg-transparent shadow-none w-[95vw] md:w-full">
        <div className="flex flex-col md:flex-row h-auto min-h-fit md:h-[620px] bg-white rounded-3xl relative shadow-2xl overflow-hidden" onKeyDown={handleKeyDown}>
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 z-50 md:hidden">
            <motion.div className="h-full bg-blue-600" animate={{ width: `${(step / 4) * 100}%` }} />
          </div>

          <div className="w-full md:w-[40%] bg-[#0A0A0A] relative flex flex-col justify-between p-6 md:p-12 text-white overflow-hidden shrink-0">
            <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_100%_100%_at_0%_100%,rgba(37,99,235,0.4)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />
            
            <div className="relative z-10 w-full">
              <h2 className="text-2xl md:text-5xl font-extrabold leading-tight mb-2 md:mb-4 text-white drop-shadow-sm">
                {translations?.sidebarTitle || 'Strategic Session'}
              </h2>
              <p className="text-gray-300/80 text-xs md:text-base leading-relaxed mb-4 md:mb-8 max-w-[280px]">
                {translations?.sidebarSubtitle || 'Build your high-profit branding system with our experts.'}
              </p>
              
              <div className="space-y-6 mt-12 hidden md:block">
                {[
                  { s: 1, label: translations?.steps?.step1?.title || 'Qualification' },
                  { s: 2, label: translations?.steps?.step2?.title || 'Insight' },
                  { s: 3, label: translations?.steps?.step3?.title || 'Investment' },
                  { s: 4, label: translations?.steps?.step4?.title || 'Contact' },
                ].map((item) => (
                  <div key={item.s} className={`flex items-center gap-4 transition-all duration-500 ${step === item.s ? 'translate-x-2' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${step === item.s ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.6)]' : step > item.s ? 'bg-green-500/20 border-green-500 text-green-500' : 'border-white/20 text-white/20'} font-bold text-sm`}>
                      {step > item.s ? <CheckCircle2 className="w-5 h-5" /> : item.s}
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-widest transition-colors duration-300 ${step === item.s ? 'text-white' : 'text-white/30'}`}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-6 md:mt-12 flex flex-col gap-4 md:gap-6 hidden md:flex">
              <div className="flex gap-4">
                <a href="https://t.me/jonbranding" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all group">
                  <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              </div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">© 2026 Jon.Branding Agency</p>
            </div>
          </div>

          <div className="w-full md:w-[60%] p-6 md:p-8 lg:p-10 flex flex-col relative bg-white rounded-r-3xl overflow-hidden flex-1">


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
                        <span className="text-[10px] font-bold uppercase tracking-wider">{translations?.header || 'Strategic Session'}</span>
                      </div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">
                        Step {step} / 4
                      </div>
                    </div>

                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col">
                        <div className="flex-1 pr-1 py-2">
                          <AnimatePresence mode="wait">
                            {step === 1 && (
                              <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                                <div>
                                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{translations?.steps?.step1?.title}</h3>
                                  <p className="text-gray-500 text-xs leading-relaxed">{translations?.steps?.step1?.subtitle}</p>
                                </div>

                                <FormField control={form.control} name="role" render={({ field }) => (
                                  <FormItem className="space-y-3">
                                    <FormLabel className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{translations?.fields?.role?.label}</FormLabel>
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
                                    <FormLabel className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{translations?.fields?.revenue?.label}</FormLabel>
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
                                    <FormLabel className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{translations?.fields?.ambition?.label}</FormLabel>
                                    <FormControl>
                                      <Textarea placeholder={translations?.fields?.ambition?.placeholder} className="min-h-[80px] md:min-h-[100px] border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white transition-all resize-none text-sm" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )} />

                                <FormField control={form.control} name="pain" render={({ field }) => (
                                  <FormItem className="space-y-3">
                                    <FormLabel className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{translations?.fields?.pain?.label}</FormLabel>
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
                                    <FormLabel className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{translations?.fields?.budget?.label}</FormLabel>
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
                                    {translations?.description}
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

                                <FormField control={form.control} name="fullName" render={({ field }) => (
                                  <FormItem className="space-y-1">
                                    <FormLabel className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{translations?.fields?.name?.label}</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                        <Input placeholder={translations?.fields?.name?.placeholder} className="pl-12 border-gray-200 rounded-xl h-12 bg-gray-50/50 focus:bg-white" {...field} />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )} />

                                <FormField control={form.control} name="phone" render={({ field }) => (
                                  <FormItem className="space-y-1">
                                    <FormLabel className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{translations?.fields?.phone?.label}</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <PhoneCall className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                        <Input 
                                          placeholder={translations?.fields?.phone?.placeholder} 
                                          className="pl-12 border-gray-200 rounded-xl h-12 bg-gray-50/50 focus:bg-white font-mono" 
                                          {...field}
                                          onChange={onPhoneChange}
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )} />

                                <FormField control={form.control} name="telegram" render={({ field }) => (
                                  <FormItem className="space-y-1">
                                    <FormLabel className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Telegram / WhatsApp (opt)</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <MessageCircle className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                        <Input placeholder="@username" className="pl-12 border-gray-200 rounded-xl h-12 bg-gray-50/50 focus:bg-white" {...field} />
                                      </div>
                                    </FormControl>
                                  </FormItem>
                                )} />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="pt-4 md:pt-4 border-t border-gray-50 mt-auto bg-white z-10 shrink-0">
                          <div className="flex gap-4">
                            {step > 1 && (
                              <Button type="button" variant="ghost" onClick={prevStep} className="flex-1 h-11 md:h-12 rounded-2xl text-gray-500 font-bold hover:bg-gray-50">
                                {translations?.buttons?.back || 'Back'}
                              </Button>
                            )}
                            
                            {step < 4 ? (
                              <Button type="button" onClick={nextStep} className="flex-[2] h-11 md:h-12 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold group shadow-xl shadow-gray-200/50">
                                {translations?.buttons?.next || 'Next Step'}
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            ) : (
                              <Button type="submit" disabled={isSubmitting} className="flex-[2] h-11 md:h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 flex items-center justify-center gap-2 group transition-all">
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                  <>
                                    {translations?.buttons?.submit || 'Get Strategy'}
                                    <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-medium tracking-tight">
                            <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                            {translations?.trustBadge || 'Data is 100% encrypted and confidential.'}
                          </div>
                        </div>
                      </form>
                    </Form>
                  </motion.div>
                ) : (
                  <motion.div key="success-container" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center py-12 px-4">
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
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{translations?.successStep?.nextSteps || 'Next Steps'}</p>
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
                      <Button asChild className="h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 group">
                        <a href="https://t.me/jonbranding" target="_blank" rel="noopener noreferrer">
                          {translations?.successStep?.telegramButton || 'Open Telegram'}
                          <ExternalLink className="ml-2 w-4 h-4 opacity-70 group-hover:opacity-100" />
                        </a>
                      </Button>
                      <Button variant="ghost" onClick={onClose} className="h-12 rounded-xl text-gray-400 font-bold">
                        {translations?.buttons?.close || 'Close Window'}
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
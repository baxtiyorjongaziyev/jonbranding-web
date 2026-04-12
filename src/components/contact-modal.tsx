'use client';

import { FC, useState, useEffect, useMemo } from 'react';
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
import { Loader2, ArrowRight, ArrowLeft, MessageCircle, Mail, Phone, Instagram, Send, X, Globe, User, CheckCircle2, Linkedin, PhoneCall, Building2, Wallet, MapPin, Target } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTelegram } from '@/hooks/use-telegram';
import { trackLead } from '@/lib/analytics';
import { getDictionary } from '@/lib/dictionaries';

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
      // Step 1: Qualification
      role: z.string().min(1, { message: translations?.formErrors?.role || 'Tanlang' }),
      revenue: z.string().min(1, { message: translations?.formErrors?.revenue || 'Tanlang' }),
      
      // Step 2: Insight
      ambition: z.string().min(3, { message: translations?.formErrors?.ambition || 'Maqsad kiritilishi shart' }),
      pain: z.string().min(1, { message: translations?.formErrors?.pain || 'To\'siqni tanlang' }),

      // Step 3: Investment
      budget: z.string().min(1, { message: translations?.formErrors?.budget || 'Byudjetni tanlang' }),

      // Step 4: Contact
      fullName: z.string().min(2, { message: translations?.formErrors?.fullName || 'Ism kiritilishi shart' }),
      phone: z.string().min(9, { message: translations?.formErrors?.phone || 'Telefon kiritilishi shart' }),
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
      phone: '',
      telegram: '',
    },
  });

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
      
      form.reset();
      setStep(1);
      toast({ 
        title: translations?.successToast?.title || 'Rahmat!', 
        description: translations?.successToast?.description || "Ma'lumotlar qabul qilindi." 
      });
      onFormSubmitSuccess ? onFormSubmitSuccess() : onClose();

      setTimeout(() => {
        try {
          trackLead({ 
            source: 'king_kong_lite_funnel', 
            value: totalPrice, 
            summary: packageSummary,
            lead_details: data
          });
          confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
        } catch (e) {}
      }, 100);

    } catch (error: any) {
      toast({ title: 'Xato', description: error.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = async () => {
    let fields: string[] = [];
    if (step === 1) fields = ['role', 'revenue'];
    if (step === 2) fields = ['ambition', 'pain'];
    if (step === 3) fields = ['budget'];
    if (step === 4) fields = ['fullName', 'phone'];

    const isValid = await form.trigger(fields);
    if (isValid) setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      if (user) form.setValue('fullName', `${user.first_name || ''} ${user.last_name || ''}`.trim());
    }
  }, [isOpen, form, user]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1000px] p-0 rounded-3xl border-none bg-transparent shadow-none w-[95vw]">
        <div className="flex flex-col md:flex-row h-full min-h-[600px] bg-white rounded-3xl relative shadow-2xl">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 z-50 md:hidden">
            <motion.div className="h-full bg-blue-600" animate={{ width: `${(step / 4) * 100}%` }} />
          </div>

          <div className="w-full md:w-[40%] bg-[#0A0A0A] relative flex flex-col justify-between p-8 md:p-12 text-white overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_100%_100%_at_0%_100%,rgba(37,99,235,0.4)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                {translations?.header || 'Strategic Session'}
              </h2>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
                {translations?.description || 'Build your high-profit branding system.'}
              </p>
              
              <div className="space-y-6 mt-12 hidden md:block">
                {[
                  { s: 1, label: translations?.steps?.step1?.title || 'Qualification' },
                  { s: 2, label: translations?.steps?.step2?.title || 'Insight' },
                  { s: 3, label: translations?.steps?.step3?.title || 'Investment' },
                  { s: 4, label: translations?.steps?.step4?.title || 'Contact' },
                ].map((item) => (
                  <div key={item.s} className={`flex items-center gap-4 transition-all duration-300 ${step === item.s ? 'text-white' : 'text-gray-600'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${step === item.s ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-600 text-gray-600'} font-bold text-sm`}>
                      {step > item.s ? <CheckCircle2 className="w-5 h-5" /> : item.s}
                    </div>
                    <span className="text-sm font-semibold uppercase tracking-wider">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-12 flex flex-col gap-6">
              <div className="flex gap-4">
                <a href="https://t.me/jonbranding" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-blue-600 transition-all">
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">© 2026 Jon.Branding Agency</p>
            </div>
          </div>

          <div className="w-full md:w-[60%] p-6 md:p-10 lg:p-14 flex flex-col relative bg-white rounded-r-3xl">
            <button onClick={onClose} className="absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full bg-gray-50 hover:bg-gray-100 z-50 transition-all border border-gray-100 shadow-sm">
              <X className="w-5 h-5 text-gray-400" />
            </button>

            <div className="flex-1 flex flex-col justify-center">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100 shadow-sm animate-pulse-subtle">
                  <Target className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{translations?.header || 'Strategic Session'}</span>
                </div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Step {step} / 4
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
                  
                  <div className="flex-1 relative min-h-[400px] py-4">
                    <AnimatePresence mode="wait">
                      {step === 1 && (
                        <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{translations?.steps?.step1?.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{translations?.steps?.step1?.subtitle}</p>
                          </div>

                          <FormField control={form.control} name="role" render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{translations?.fields?.role?.label}</FormLabel>
                              <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 gap-2">
                                  {translations?.fields?.role?.options?.map((opt: any) => (
                                    <FormItem key={opt.v}>
                                      <FormLabel className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${field.value === opt.v ? 'bg-blue-50 border-blue-600' : 'bg-white border-gray-100'}`}>
                                        <FormControl><RadioGroupItem value={opt.v} className="sr-only" /></FormControl>
                                        <span className="text-sm font-medium">{opt.l}</span>
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
                              <FormLabel className="text-xs text-gray-400 font-medium uppercase">{translations?.fields?.revenue?.label}</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger className="border-gray-200 rounded-xl"><SelectValue placeholder="..." /></SelectTrigger></FormControl>
                                <SelectContent className="rounded-xl">
                                  {translations?.fields?.revenue?.options?.map((opt: string) => (
                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{translations?.steps?.step2?.title}</h3>
                            <p className="text-gray-500 text-sm">{translations?.steps?.step2?.subtitle}</p>
                          </div>

                          <FormField control={form.control} name="ambition" render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="text-xs text-gray-400 font-medium uppercase">{translations?.fields?.ambition?.label}</FormLabel>
                              <FormControl>
                                <Textarea placeholder={translations?.fields?.ambition?.placeholder} className="min-h-[100px] border-gray-200 rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />

                          <FormField control={form.control} name="pain" render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-xs text-gray-400 font-medium uppercase">{translations?.fields?.pain?.label}</FormLabel>
                              <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 gap-2">
                                  {translations?.fields?.pain?.options?.map((opt: any) => (
                                    <FormItem key={opt.v}>
                                      <FormLabel className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${field.value === opt.v ? 'bg-blue-50 border-blue-600' : 'bg-white border-gray-100'}`}>
                                        <FormControl><RadioGroupItem value={opt.v} className="sr-only" /></FormControl>
                                        <span className="text-sm font-medium">{opt.l}</span>
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
                        <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                           <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{translations?.steps?.step3?.title}</h3>
                            <p className="text-gray-500 text-sm">{translations?.steps?.step3?.subtitle}</p>
                          </div>

                          <FormField control={form.control} name="budget" render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-xs text-gray-400 font-medium uppercase">{translations?.fields?.budget?.label}</FormLabel>
                              <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 gap-3">
                                  {translations?.fields?.budget?.options?.map((opt: string) => (
                                    <FormItem key={opt}>
                                      <FormLabel className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-gray-50 ${field.value === opt ? 'bg-blue-50 border-blue-600 shadow-sm' : 'bg-white border-gray-100'}`}>
                                        <FormControl><RadioGroupItem value={opt} className="sr-only" /></FormControl>
                                        <div className="flex items-center gap-3">
                                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${field.value === opt ? 'border-blue-600' : 'border-gray-300'}`}>
                                            {field.value === opt && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                                          </div>
                                          <span className="text-sm font-semibold text-gray-900">{opt}</span>
                                        </div>
                                        <Wallet className={`w-4 h-4 ${field.value === opt ? 'text-blue-600' : 'text-gray-400'}`} />
                                      </FormLabel>
                                    </FormItem>
                                  ))}
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />

                          <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex gap-4 items-start">
                             <Target className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                             <p className="text-xs text-blue-800/80 italic leading-relaxed">
                                {translations?.description}
                             </p>
                          </div>
                        </motion.div>
                      )}

                      {step === 4 && (
                        <motion.div key="step4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{translations?.steps?.step4?.title}</h3>
                            <p className="text-gray-500 text-sm">{translations?.steps?.step4?.subtitle}</p>
                          </div>

                          <FormField control={form.control} name="fullName" render={({ field }) => (
                            <FormItem className="space-y-1">
                              <FormLabel className="text-xs text-gray-400 font-medium">{translations?.fields?.name?.label}</FormLabel>
                              <FormControl><Input placeholder={translations?.fields?.name?.placeholder} className="border-gray-200 rounded-xl h-12" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />

                          <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem className="space-y-1">
                              <FormLabel className="text-xs text-gray-400 font-medium">{translations?.fields?.phone?.label}</FormLabel>
                              <FormControl><Input placeholder={translations?.fields?.phone?.placeholder} className="border-gray-200 rounded-xl h-12" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />

                          <FormField control={form.control} name="telegram" render={({ field }) => (
                            <FormItem className="space-y-1">
                              <FormLabel className="text-xs text-gray-400 font-medium whitespace-nowrap">Telegram / WhatsApp</FormLabel>
                              <FormControl><Input placeholder="@..." className="border-gray-200 rounded-xl h-12" {...field} /></FormControl>
                            </FormItem>
                          )} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex gap-4 pt-8 border-t border-gray-50 mt-auto">
                    {step > 1 && (
                      <Button type="button" variant="ghost" onClick={prevStep} className="flex-1 h-12 rounded-xl text-gray-500 font-bold">
                        {translations?.buttons?.back}
                      </Button>
                    )}
                    
                    {step < 4 ? (
                      <Button type="button" onClick={nextStep} className="flex-[2] h-12 bg-gray-900 hover:bg-black text-white rounded-xl font-bold group">
                        {translations?.buttons?.next}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    ) : (
                      <Button type="submit" disabled={isSubmitting} className="flex-[2] h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-100 flex items-center justify-center gap-2 group transition-all">
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                          <>
                            {translations?.buttons?.submit}
                            <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
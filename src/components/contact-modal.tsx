'use client';

import { FC, useState, useEffect, useMemo } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, ArrowLeft, ArrowRight, Building2, MapPin, Coffee, Briefcase, User, Phone, MessageCircle, Globe, Target, DollarSign, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTelegram } from '@/hooks/use-telegram';
import { trackLead } from '@/lib/analytics';
import LiveLocationCard from './live-location-card';
import { getDictionary } from '@/lib/dictionaries';
import { Checkbox } from './ui/checkbox';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageSummary?: string;
  totalPrice?: number;
  onFormSubmitSuccess?: () => void;
  lang: string;
}

declare global {
  interface Window {
    amoSocialButton?: {
      sendLead: (data: any, callback?: () => void) => void;
    };
  }
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

  const STEPS = useMemo(() => {
    if (!translations) return [];
    return [
      { id: 1, title: translations.stepTitles.contact, fields: ['fullName', 'phone', 'telegram'] },
      { id: 2, title: translations.stepTitles.project, fields: ['companyName', 'website', 'goal'] },
      { id: 3, title: translations.stepTitles.budget, fields: ['budget'] },
      { id: 4, title: translations.stepTitles.meeting, fields: ['location', 'meetingPlace'] },
    ];
  }, [translations]);

  const formSchema = useMemo(() => {
    if (!translations) return z.object({});
    return z.object({
      fullName: z.string().min(2, { message: translations.formErrors.fullName }),
      phone: z.string().min(9, { message: translations.formErrors.phone }),
      telegram: z.string().optional(),
      companyName: z.string().optional(),
      website: z.string().optional(),
      goal: z.string({ required_error: translations.formErrors.goal }),
      budget: z.string({ required_error: translations.formErrors.budget }),
      location: z.string({ required_error: translations.formErrors.location }),
      meetingPlace: z.string().optional(),
      privacyPolicy: z.boolean().refine(val => val === true, {
          message: translations.formErrors.privacyPolicy,
      }),
    }).refine(data => {
        if ((data.location === translations.locationOptions[0] || data.location === translations.locationOptions[1]) && !data.meetingPlace) {
            return false;
        }
        return true;
    }, {
        message: translations.formErrors.meetingPlace,
        path: ["meetingPlace"],
    });
  }, [translations]);

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      phone: '',
      telegram: '',
      companyName: '',
      website: '',
      goal: '',
      budget: '',
      location: '',
      meetingPlace: '',
      privacyPolicy: false,
    },
  });

  const locationValue = form.watch('location');



  const onSubmit: SubmitHandler<any> = async (data) => {
    setSubmitting(true);
    try {
      const pickTwoPreferenceJSON = localStorage.getItem('pick2_pref');
      const pickTwoPreference = pickTwoPreferenceJSON ? JSON.parse(pickTwoPreferenceJSON) : [];

      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, packageSummary, totalPrice, pickTwoPreference }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Server error');
      
      trackLead({ source: 'main_contact_form', value: totalPrice, summary: packageSummary });

      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
      
      form.reset();
      
      if (data.budget === translations.budgetOptions[0]) {
         toast({ title: translations.leadMagnetToast.title, description: translations.leadMagnetToast.description });
         onClose();
         document.getElementById('lead-magnet')?.scrollIntoView({ behavior: 'smooth' });
      } else {
         toast({ title: translations.successToast.title, description: translations.successToast.description });
         onFormSubmitSuccess ? onFormSubmitSuccess() : onClose();
      }
    } catch (error: any) {
      toast({ title: translations?.errorToast?.title || 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
      setStep(1);
    }
  };

  const handleNext = async () => {
      if (!STEPS[step - 1]) return;
      const fields = STEPS[step - 1].fields;
      const output = await form.trigger(fields as any, { shouldFocus: true });
      if (!output) return;

      if (step < STEPS.length) {
          setStep(step + 1);
      } else {
        await form.handleSubmit(onSubmit)();
      }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  useEffect(() => {
    if (isOpen) {
      form.reset();
      setStep(1);
      if (user) {
        form.setValue('fullName', `${user.first_name || ''} ${user.last_name || ''}`.trim());
        if (user.username) form.setValue('telegram', user.username);
      }
    }
  }, [isOpen, form, user]);

  const stepIcons = [User, Target, DollarSign, MapPin];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-3xl p-0 gap-0 flex flex-col max-h-[90dvh]">
        {/* Header gradient */}
        <div className="bg-gradient-to-br from-primary/10 via-sky-blue/20 to-primary/5 px-6 pt-6 pb-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-dark-blue">
              {translations ? translations.title : "Bog'lanish"}
            </DialogTitle>
            {translations && <DialogDescription className="text-sm mt-1">{translations.description}</DialogDescription>}
          </DialogHeader>

          {/* Step dots indicator */}
          {translations && STEPS.length > 0 && (
            <div className="flex items-center gap-2 mt-4">
              {STEPS.map((s, i) => {
                const Icon = stepIcons[i];
                const isCompleted = step > s.id;
                const isActive = step === s.id;
                return (
                  <div key={s.id} className="flex items-center gap-2">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                      isCompleted ? 'bg-primary text-white shadow-md' :
                      isActive ? 'bg-white text-primary border-2 border-primary shadow-md scale-110' :
                      'bg-white/60 text-muted-foreground border border-border'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`h-0.5 w-8 rounded-full transition-all duration-500 ${step > s.id ? 'bg-primary' : 'bg-border'}`} />
                    )}
                  </div>
                );
              })}
              <span className="ml-auto text-xs font-medium text-muted-foreground">
                {step}/{STEPS.length}
              </span>
            </div>
          )}

          {/* Progress bar */}
          {translations && (
            <div className="mt-3 h-1.5 bg-white/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-ocean-blue rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(step / STEPS.length) * 100}%` }}
              />
            </div>
          )}
        </div>

        <div className="px-6 pb-6 pt-4 overflow-y-auto flex-1 min-h-0 overscroll-contain">
        {!translations ? (
          <div className="flex flex-col items-center justify-center p-8 gap-4 min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground animate-pulse">Yuklanmoqda...</p>
          </div>
        ) : (
          <>
            {/* Step title */}
            <p className="text-sm font-semibold text-primary mb-4 uppercase tracking-wide">
              {STEPS[step - 1]?.title}
            </p>
            <Form {...form}>
              <form className="space-y-4">
                {step === 1 && (
                    <div className="space-y-4 animate-fade-in">
                        <FormField control={form.control} name="fullName" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2"><User className="w-3.5 h-3.5 text-muted-foreground" />{translations.fullName}</FormLabel>
                              <FormControl><Input placeholder={translations.fullNamePlaceholder} className="rounded-xl h-11" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-muted-foreground" />{translations.phone}</FormLabel>
                              <FormControl><Input placeholder={translations.phonePlaceholder} className="rounded-xl h-11" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="telegram" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2"><MessageCircle className="w-3.5 h-3.5 text-muted-foreground" />{translations.telegram}</FormLabel>
                              <FormControl><Input placeholder={translations.telegramPlaceholder} className="rounded-xl h-11" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 animate-fade-in">
                         <FormField control={form.control} name="companyName" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5 text-muted-foreground" />{translations.companyName}</FormLabel>
                              <FormControl><Input placeholder={translations.companyNamePlaceholder} className="rounded-xl h-11" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="website" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-muted-foreground" />{translations.website}</FormLabel>
                              <FormControl><Input placeholder={translations.websitePlaceholder} className="rounded-xl h-11" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="goal" render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>{translations.goal}</FormLabel>
                                <FormControl>
                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-2">
                                        {(translations.goalOptions || []).map((option: any, index: number) => (
                                            <Label key={option.value} htmlFor={`goal-${index}`} className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:bg-secondary transition-all duration-200 has-[:checked]:bg-primary/10 has-[:checked]:border-primary has-[:checked]:shadow-sm">
                                                <RadioGroupItem value={option.value} id={`goal-${index}`} />
                                                <span className="font-medium text-sm text-gray-800">{option.label}</span>
                                            </Label>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                )}

                {step === 3 && (
                     <div className="space-y-4 animate-fade-in">
                        <FormField control={form.control} name="budget" render={({ field }) => (
                             <FormItem className="space-y-3">
                                <FormLabel>{translations.budget}</FormLabel>
                                <FormControl>
                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-2">
                                        {(translations.budgetOptions || []).map((option: string, index: number) => (
                                            <Label key={option} htmlFor={`budget-${index}`} className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:bg-secondary transition-all duration-200 has-[:checked]:bg-primary/10 has-[:checked]:border-primary has-[:checked]:shadow-sm">
                                                <RadioGroupItem value={option} id={`budget-${index}`} />
                                                <span className="font-medium text-sm text-gray-800">{option}</span>
                                            </Label>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                     </div>
                )}

                {step === 4 && (
                     <div className="space-y-6 animate-fade-in">
                        <FormField control={form.control} name="location" render={({ field }) => (
                            <FormItem>
                                <FormLabel>{translations.location}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger className="rounded-xl h-11"><SelectValue placeholder={translations.locationPlaceholder} /></SelectTrigger></FormControl>
                                    <SelectContent className="rounded-xl">
                                        {(translations.locationOptions || []).map((loc: string) => (
                                            <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        {(locationValue === translations.locationOptions[0] || locationValue === translations.locationOptions[1]) &&
                            <FormField control={form.control} name="meetingPlace" render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>{translations.meetingPlace}</FormLabel>
                                    <div className="space-y-2">
                                        {(translations.meetingPlaceOptions || []).map((option: any) => (
                                            <LiveLocationCard
                                                key={option.value}
                                                icon={option.value === 'our_office' ? Briefcase : option.value === 'neutral' ? Coffee : Building2}
                                                title={option.label}
                                                description={option.description}
                                                isSelected={field.value === option.value}
                                                onClick={() => field.onChange(option.value)}
                                            />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        }
                        {locationValue === translations.locationOptions[2] &&
                             <Alert variant="default" className="bg-sky-blue/30 border-primary/20 rounded-xl">
                               <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"/><AlertDescription>{translations.onlineMeetingAlert}</AlertDescription>
                               </div>
                            </Alert>
                        }
                     </div>
                )}

                {step === STEPS.length && (
                     <FormField control={form.control} name="privacyPolicy" render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border bg-muted/30 p-4 mt-2">
                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            <div className="space-y-1 leading-none"><FormLabel className="text-xs">{translations.privacyPolicyText}</FormLabel><FormMessage className="text-xs" /></div>
                        </FormItem>
                    )} />
                )}

                <div className="flex justify-between items-center pt-4 mt-2 border-t border-border/50">
                    <Button type="button" variant="ghost" onClick={handlePrev} disabled={step === 1 || isSubmitting} className="rounded-xl gap-2">
                        <ArrowLeft className="h-4 w-4" />{translations.backButton}
                    </Button>
                    <Button type="button" onClick={handleNext} disabled={isSubmitting} className="rounded-xl shadow-ocean bg-ocean-blue hover:bg-ocean-blue/90 gap-2 px-6">
                        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                        {step === STEPS.length ? translations.submitButton : translations.nextButton}
                        {!isSubmitting && step !== STEPS.length && <ArrowRight className="h-4 w-4" />}
                    </Button>
                </div>
              </form>
            </Form>
          </>
        )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
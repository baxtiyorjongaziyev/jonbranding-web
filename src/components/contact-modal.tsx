
'use client';

import { FC, useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, ArrowLeft, ArrowRight, Building2, MapPin, Coffee, Briefcase } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTelegram } from '@/hooks/use-telegram';
import { event as gtagEvent } from '@/lib/gtag';
import LiveLocationCard from './live-location-card';
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
  const [dictionary, setDictionary] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      getDictionary(lang as 'uz' | 'ru').then(dict => setDictionary(dict.contactModal));
    }
  }, [isOpen, lang]);

  const translations = dictionary;
  
  const STEPS = translations ? [
    { id: 1, title: translations.stepTitles.contact, fields: ['fullName', 'phone', 'telegram'] },
    { id: 2, title: translations.stepTitles.project, fields: ['companyName', 'website', 'goal'] },
    { id: 3, title: translations.stepTitles.budget, fields: ['budget'] },
    { id: 4, title: translations.stepTitles.meeting, fields: ['location', 'meetingPlace'] },
  ] : [];


  const formSchema = translations ? z.object({
    fullName: z.string().min(2, { message: translations.formErrors.fullName }),
    phone: z.string().min(9, { message: translations.formErrors.phone }),
    telegram: z.string().optional(),
    companyName: z.string().optional(),
    website: z.string().optional(),
    goal: z.string({ required_error: translations.formErrors.goal }),
    budget: z.string({ required_error: translations.formErrors.budget }),
    location: z.string({ required_error: translations.formErrors.location }),
    meetingPlace: z.string().optional(),
  }).refine(data => {
      if ((data.location === translations.locationOptions[0] || data.location === translations.locationOptions[1]) && !data.meetingPlace) {
          return false;
      }
      return true;
  }, {
      message: translations.formErrors.meetingPlace,
      path: ["meetingPlace"],
  }) : z.object({});

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      telegram: '',
      companyName: '',
      website: '',
      goal: undefined,
      budget: undefined,
      location: undefined,
      meetingPlace: undefined,
    },
  });

  const locationValue = form.watch('location');

  const onSubmit: SubmitHandler<FormData> = async (data) => {
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

      if (!response.ok) {
        throw new Error(result.error || 'Serverda xatolik yuz berdi.');
      }
      
      gtagEvent('form_submit', {
        'event_category': 'Contact',
        'event_label': 'Main Contact Form',
        'value': totalPrice
      });

      confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 }
      });
      
      form.reset();
      
      if (data.budget === translations.budgetOptions[0]) {
         toast({
            title: translations.leadMagnetToast.title,
            description: translations.leadMagnetToast.description,
         });
         onClose();
         const leadMagnetSection = document.getElementById('lead-magnet');
         if (leadMagnetSection) {
            leadMagnetSection.scrollIntoView({ behavior: 'smooth' });
         }
      } else {
         toast({
           title: translations.successToast.title,
           description: translations.successToast.description,
           variant: 'default',
         });
         if (onFormSubmitSuccess) {
             onFormSubmitSuccess();
         } else {
             onClose();
         }
      }


    } catch (error: any) {
      toast({
        title: translations.errorToast.title,
        description: (translations.errorToast.description as (msg: string) => string)(error.message),
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
      setStep(1);
    }
  };

  const handleNext = async () => {
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
    if (step > 1) {
      setStep(step - 1);
    }
  };

  useEffect(() => {
    if (isOpen) {
      form.reset();
      setStep(1);
       if (user) {
        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
        if (fullName) {
            form.setValue('fullName', fullName);
        }
        if (user.username) {
            form.setValue('telegram', user.username);
        }
      }
    }
  }, [isOpen, form, user]);
  
  useEffect(() => {
    if(dictionary) {
      form.trigger();
    }
  }, [dictionary, form]);


  if (!isOpen || !dictionary) {
    return null;
  }

  const progress = (step / STEPS.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-dark-blue">{translations.title}</DialogTitle>
          <DialogDescription>
            {translations.description}
          </DialogDescription>
        </DialogHeader>
        <Progress value={progress} className="h-2" />
        <Form {...form}>
          <form className="space-y-4">
            {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                    <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{translations.fullName}</FormLabel>
                        <FormControl>
                            <Input placeholder={translations.fullNamePlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{translations.phone}</FormLabel>
                        <FormControl>
                            <Input placeholder={translations.phonePlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="telegram"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{translations.telegram}</FormLabel>
                        <FormControl>
                            <Input placeholder={translations.telegramPlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
            )}
            
            {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                     <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{translations.companyName}</FormLabel>
                            <FormControl>
                                <Input placeholder={translations.companyNamePlaceholder} {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                         <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{translations.website}</FormLabel>
                            <FormControl>
                                <Input placeholder={translations.websitePlaceholder} {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                            control={form.control}
                            name="goal"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>{translations.goal}</FormLabel>
                                     <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-2"
                                        >
                                         {translations.goalOptions.map((option: {value: string, label: string}, index: number) => (
                                            <Label key={option.value} htmlFor={`goal-${index}`} className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:bg-secondary transition-colors has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                                                <RadioGroupItem value={option.value} id={`goal-${index}`} />
                                                <span className="font-medium text-sm text-gray-800">{option.label}</span>
                                            </Label>
                                        ))}
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                </div>
            )}

            {step === 3 && (
                 <div className="space-y-4 animate-fade-in">
                    <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                             <FormItem className="space-y-3">
                                <FormLabel>{translations.budget}</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                    >
                                    {translations.budgetOptions.map((option: string, index: number) => (
                                        <Label key={option} htmlFor={`budget-${index}`} className="flex items-center gap-4 p-3 border rounded-xl cursor-pointer hover:bg-secondary transition-colors has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                                            <RadioGroupItem value={option} id={`budget-${index}`} />
                                            <span className="font-medium text-sm text-gray-800">{option}</span>
                                        </Label>
                                    ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                 </div>
            )}

            {step === 4 && (
                 <div className="space-y-6 animate-fade-in">
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{translations.location}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={translations.locationPlaceholder} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {translations.locationOptions.map((loc: string) => (
                                            <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    { (locationValue === translations.locationOptions[0] || locationValue === translations.locationOptions[1]) &&
                        <FormField
                            control={form.control}
                            name="meetingPlace"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>{translations.meetingPlace}</FormLabel>
                                    <div className="space-y-2">
                                        {translations.meetingPlaceOptions.map((option: {value: string, label: string, description: string}) => (
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
                            )}
                        />
                    }
                    { locationValue === translations.locationOptions[2] &&
                         <Alert variant="default" className="bg-sky-blue/30 border-primary/20">
                           <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"/>
                            <AlertDescription>
                                {translations.onlineMeetingAlert}
                            </AlertDescription>
                           </div>
                        </Alert>
                    }
                 </div>
            )}
            
            <div className="flex justify-between items-center pt-4">
                <Button type="button" variant="ghost" onClick={handlePrev} disabled={step === 1 || isSubmitting}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {translations.backButton}
                </Button>
                <Button type="button" onClick={handleNext} disabled={isSubmitting} className="shadow-ocean bg-ocean-blue hover:bg-ocean-blue/90">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {step === STEPS.length ? translations.submitButton : translations.nextButton}
                    {step < STEPS.length && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;

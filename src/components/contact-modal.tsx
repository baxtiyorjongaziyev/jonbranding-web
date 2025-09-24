
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

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageSummary?: string;
  totalPrice?: number;
  onFormSubmitSuccess?: () => void;
}

const budgetOptions = [
  "Mavjud emas / Faqat o'rganayapman",
  "$500 gacha",
  "$500 - $1,500",
  "$1,500 - $3,000",
  "$3,000 dan yuqori"
];

const locationOptions = [
    "Toshkent",
    "Farg'ona",
    "Boshqa viloyat"
];

const goalOptions = [
    { value: "exploring", label: "Brending haqida ma'lumotga ega emasman, lekin biznesim uchun kerak deb o'ylayman." },
    { value: "has_problem", label: "Brendim bor, lekin u o'z samarasini bermayapti, tahlil va maslahat kerak." },
    { value: "ready_to_start", label: "Brending kuchini tushunaman va aniq maqsad bilan murojaat qilyapman." },
];

const meetingPlaceOptions = [
    { value: "our_office", label: "Bizning ofisimizda", icon: Briefcase, description: "Loyihaga to'liq sho'ng'ish va barcha materiallar bilan tanishish uchun eng yaxshi variant." },
    { value: "neutral", label: "Shahardagi neytral kafe/restoranda", icon: Coffee, description: "Erkin va norasmiy muhitda loyihani muhokama qilish uchun qulay tanlov." },
    { value: "client_office", label: "Sizning ofisingizda", icon: Building2, description: "Biznesingiz muhiti bilan yaqindan tanishib, siz uchun qulay joyda uchrashishimiz mumkin." },
];

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Ism-sharifingizni to'liq kiriting." }),
  phone: z.string().min(9, { message: "Telefon raqamingizni to'g'ri kiriting." }),
  telegram: z.string().optional(),
  companyName: z.string().optional(),
  website: z.string().optional(),
  goal: z.string({ required_error: "Asosiy maqsadingizni tanlang." }),
  budget: z.string({ required_error: "Taxminiy byudjetingizni tanlang." }),
  location: z.string({ required_error: "Joylashuvingizni tanlang." }),
  meetingPlace: z.string().optional(),
}).refine(data => {
    if ((data.location === 'Toshkent' || data.location === 'Farg\'ona') && !data.meetingPlace) {
        return false;
    }
    return true;
}, {
    message: "Uchrashuv joyini tanlashingiz kerak.",
    path: ["meetingPlace"],
});


type FormData = z.infer<typeof formSchema>;

const STEPS = [
    { id: 1, title: 'Aloqa ma’lumotlari', fields: ['fullName', 'phone', 'telegram'] },
    { id: 2, title: 'Loyiha haqida', fields: ['companyName', 'website', 'goal'] },
    { id: 3, title: 'Byudjet', fields: ['budget'] },
    { id: 4, title: 'Uchrashuv', fields: ['location', 'meetingPlace'] },
];

const ContactModal: FC<ContactModalProps> = ({ isOpen, onClose, packageSummary, totalPrice, onFormSubmitSuccess }) => {
  const { toast } = useToast();
  const [isSubmitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const { user } = useTelegram();

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
  const meetingPlaceValue = form.watch('meetingPlace');

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
      
      // Trigger Google Analytics event
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
      
      if (data.budget === budgetOptions[0]) {
         toast({
            title: "Siz uchun maxsus resurslar!",
            description: "So'rovingiz qabul qilindi! Boshlanishiga siz uchun tayyorlagan bepul materiallarimizga yo'naltiryapmiz.",
         });
         onClose();
         const leadMagnetSection = document.getElementById('lead-magnet');
         if (leadMagnetSection) {
            leadMagnetSection.scrollIntoView({ behavior: 'smooth' });
         }
      } else {
         toast({
           title: 'Muvaffaqiyatli!',
           description: "So'rovingiz qabul qilindi. Tez orada siz bilan bog'lanamiz!",
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
        title: 'Xatolik!',
        description: error.message || 'So‘rovni yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.',
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

  const progress = (step / STEPS.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-dark-blue">Sifatli konsultatsiya uchun</DialogTitle>
          <DialogDescription>
            Loyihangizni yaxshiroq tushunishimiz uchun bir nechta savollarga javob bering.
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
                        <FormLabel>Ism, Familiya</FormLabel>
                        <FormControl>
                            <Input placeholder="Murad Nazarov" {...field} />
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
                        <FormLabel>Telefon raqam</FormLabel>
                        <FormControl>
                            <Input placeholder="+998 90 123 45 67" {...field} />
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
                        <FormLabel>Telegram username (ixtiyoriy)</FormLabel>
                        <FormControl>
                            <Input placeholder="@username" {...field} />
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
                            <FormLabel>Kompaniya yoki loyiha nomi</FormLabel>
                            <FormControl>
                                <Input placeholder="Jon.Branding" {...field} />
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
                            <FormLabel>Veb-sayt yoki ijtimoiy tarmoq (ixtiyoriy)</FormLabel>
                            <FormControl>
                                <Input placeholder="https://t.me/jonbranding" {...field} />
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
                                    <FormLabel>Asosiy maqsadingiz qaysi biriga yaqin?</FormLabel>
                                     <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-2"
                                        >
                                         {goalOptions.map((option, index) => (
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
                                <FormLabel>Loyiha uchun taxminiy byudjet?</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                    >
                                    {budgetOptions.map((option, index) => (
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
                                <FormLabel>Uchrashuv uchun joylashuvingiz</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Viloyatingizni tanlang" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {locationOptions.map(loc => (
                                            <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    { (locationValue === 'Toshkent' || locationValue === 'Farg\'ona') &&
                        <FormField
                            control={form.control}
                            name="meetingPlace"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Uchrashuv qayerda bo'lishini xohlaysiz?</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-2"
                                        >
                                         {meetingPlaceOptions.map((option, index) => (
                                            <Label key={option.value} htmlFor={`place-${index}`} className="flex items-start gap-4 p-4 border rounded-xl cursor-pointer hover:bg-secondary transition-colors has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                                                <RadioGroupItem value={option.value} id={`place-${index}`} className="mt-1" />
                                                <div className="flex-1">
                                                    <span className="font-medium text-sm text-gray-800">{option.label}</span>
                                                    {meetingPlaceValue === option.value &&
                                                        <Alert variant="default" className="mt-2 text-xs bg-sky-blue/30 border-primary/20">
                                                             <div className="flex items-start gap-2">
                                                                <option.icon className="h-4 w-4 text-primary flex-shrink-0 mt-0.5"/>
                                                                <AlertDescription>{option.description}</AlertDescription>
                                                             </div>
                                                        </Alert>
                                                    }
                                                </div>
                                            </Label>
                                        ))}
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    }
                    { locationValue === 'Boshqa viloyat' &&
                         <Alert variant="default" className="bg-sky-blue/30 border-primary/20">
                           <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"/>
                            <AlertDescription>
                                Tushunarli. Siz bilan qulay vaqtni kelishib, onlayn uchrashuv o'tkazamiz.
                            </AlertDescription>
                           </div>
                        </Alert>
                    }
                 </div>
            )}
            
            <div className="flex justify-between items-center pt-4">
                <Button type="button" variant="ghost" onClick={handlePrev} disabled={step === 1 || isSubmitting}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Orqaga
                </Button>
                <Button type="button" onClick={handleNext} disabled={isSubmitting} className="shadow-ocean bg-ocean-blue hover:bg-ocean-blue/90">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {step === STEPS.length ? "So'rovni yuborish" : "Keyingisi"}
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

    
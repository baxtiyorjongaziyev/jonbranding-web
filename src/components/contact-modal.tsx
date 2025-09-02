
'use client';

import { FC, useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

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


const formSchema = z.object({
  fullName: z.string().min(2, { message: "Ism-sharifingizni to'liq kiriting." }),
  phone: z.string().min(9, { message: "Telefon raqamingizni to'g'ri kiriting." }),
  telegram: z.string().optional(),
  notes: z.string().optional(),
  companyName: z.string().optional(),
  website: z.string().optional(),
  goal: z.string().optional(),
  budget: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const STEPS = [
    { id: 1, title: 'Aloqa ma’lumotlari', fields: ['fullName', 'phone', 'telegram'] },
    { id: 2, title: 'Loyiha haqida', fields: ['companyName', 'website', 'goal'] },
    { id: 3, title: 'Byudjet', fields: ['budget'] },
];

const ContactModal: FC<ContactModalProps> = ({ isOpen, onClose, packageSummary, totalPrice, onFormSubmitSuccess }) => {
  const { toast } = useToast();
  const [isSubmitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      telegram: '',
      notes: '',
      companyName: '',
      website: '',
      goal: '',
      budget: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, packageSummary, totalPrice }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Serverda xatolik yuz berdi.');
      }
      
      confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 }
      });
      
      toast({
        title: 'Muvaffaqiyatli!',
        description: "So'rovingiz qabul qilindi. Tez orada siz bilan bog'lanamiz!",
        variant: 'default',
      });
      
      form.reset();
      
      if (onFormSubmitSuccess) {
          onFormSubmitSuccess();
      } else {
          onClose();
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
    }
  }, [isOpen, form]);

  const progress = (step / STEPS.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Sifatli konsultatsiya uchun</DialogTitle>
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
                            <Input placeholder="Abdulla Qodiriy" {...field} />
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
                            <FormItem>
                            <FormLabel>Asosiy maqsad nima?</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Masalan: brendni noldan yaratish, sotuvlarni oshirish, rebrending qilish..." {...field} />
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
                                    {budgetOptions.map(option => (
                                        <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value={option} />
                                            </FormControl>
                                            <FormLabel className="font-normal">{option}</FormLabel>
                                        </FormItem>
                                    ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                 </div>
            )}
            
            <div className="flex justify-between items-center pt-4">
                <Button type="button" variant="ghost" onClick={handlePrev} disabled={step === 1 || isSubmitting}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Orqaga
                </Button>
                <Button type="button" onClick={handleNext} disabled={isSubmitting} className="shadow-ocean">
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

'use client';

import { FC, useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle } from 'lucide-react';
import { event as trackEvent } from '@/lib/gtag';
import type { PriceDetails } from '@/lib/pricing';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageSummary: string;
  priceDetails: PriceDetails | null;
}

const formSchema = z.object({
  fullName: z.string().min(2, { message: "To'liq ismingizni kiriting." }),
  phone: z.string().regex(/^\+998\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/, { message: "Telefon raqami O'zbekiston formatida bo'lishi kerak (+998 XX XXX XX XX)." }),
  telegram: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const ContactModal: FC<ContactModalProps> = ({ isOpen, onClose, packageSummary, priceDetails }) => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      phone: '+998',
      telegram: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        fullName: '',
        phone: '+998 ',
        telegram: '',
        notes: '',
      });
      setSuccess(false);
    }
  }, [isOpen, form]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d+]/g, '');
    if (!value.startsWith('+998')) {
        value = '+998';
    }
    
    let formatted = '+998';
    const numbers = value.substring(4).replace(/\s/g, '');
    if (numbers.length > 0) formatted += ' ' + numbers.substring(0, 2);
    if (numbers.length > 2) formatted += ' ' + numbers.substring(2, 5);
    if (numbers.length > 5) formatted += ' ' + numbers.substring(5, 7);
    if (numbers.length > 7) formatted += ' ' + numbers.substring(7, 9);
    
    form.setValue('phone', formatted.slice(0, 17));
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setSubmitting(true);

    try {
      const res = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...data,
            packageSummary,
            totalPrice: priceDetails?.final ?? 0,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'So\'rovni yuborishda xatolik yuz berdi.');
      }
      
      trackEvent('generate_lead', {
        value: priceDetails?.final ?? 0,
        currency: 'USD',
        package_summary: packageSummary,
      });

      setSuccess(true);
      setTimeout(() => {
          onClose();
      }, 600);

    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Xatolik!',
        description: error.message || 'Xabarni yuborishda muammo yuzaga keldi. Iltimos, keyinroq qayta urinib ko\'ring yoki biz bilan to\'g\'ridan-to\'g\'ri bog\'laning.',
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const renderPackageInfo = () => {
    if (!priceDetails || priceDetails.base === 0) return null;

    const hasDiscount = priceDetails.discountApplied;

    return (
        <div className="mb-4 text-center text-sm text-muted-foreground bg-secondary/50 p-3 rounded-lg">
            Sizning tanlovingiz: {packageSummary.replace('Tanlangan xizmatlar: ', '').replace(/\| Chegirma.*$/, '')}.
            {hasDiscount ? (
                <>
                    <br /> Asl narx: <span className="line-through">${priceDetails.base.toLocaleString('en-US')}</span>.
                    <span className="font-bold text-primary"> {priceDetails.discountApplied} bilan yakuniy narx ${priceDetails.final.toLocaleString('en-US')}</span>.
                </>
            ) : (
                <>
                    <br /> Jami narx: <span className="font-bold text-primary">${priceDetails.final.toLocaleString('en-US')}</span>.
                </>
            )}
        </div>
    );
  };
  
  const getButtonText = () => {
    if (isSubmitting) {
      return <Loader2 className="mr-2 h-5 w-5 animate-spin" />;
    }
    if (priceDetails && priceDetails.final > 0) {
      return <>${priceDetails.final.toLocaleString('en-US')} ga buyurtma berish</>;
    }
    return 'Yuborish';
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] rounded-2xl">
        {isSuccess ? (
             <div className="flex flex-col items-center justify-center p-12 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <DialogTitle className="text-2xl">Rahmat!</DialogTitle>
                <DialogDescription>
                    So'rovingiz qabul qilindi. Tez orada siz bilan bog'lanamiz!
                </DialogDescription>
            </div>
        ) : (
            <>
                <DialogHeader>
                <DialogTitle className="text-2xl">Aloqaga chiqish</DialogTitle>
                <DialogDescription>
                    {priceDetails ? "Buyurtmani tasdiqlash uchun ma'lumotlarni to'ldiring." : "Ma'lumotlaringizni qoldiring, biz siz bilan tez orada bog'lanamiz."}
                </DialogDescription>
                </DialogHeader>

                {renderPackageInfo()}

                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                        <FormItem><FormLabel>To'liq ism</FormLabel><FormControl><Input placeholder="Ism Familya" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem><FormLabel>Telefon raqam</FormLabel><FormControl><Input placeholder="+998 XX XXX XX XX" {...field} onChange={handlePhoneChange} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="telegram" render={({ field }) => (
                        <FormItem><FormLabel>Telegram username (ixtiyoriy)</FormLabel><FormControl><Input placeholder="@username" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="notes" render={({ field }) => (
                        <FormItem><FormLabel>Qo'shimcha izoh (ixtiyoriy)</FormLabel><FormControl><Textarea placeholder="Loyiha haqida qisqacha ma'lumot..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />

                    <Button type="submit" disabled={isSubmitting} className="w-full text-lg py-6 shadow-ocean">
                      {getButtonText()}
                    </Button>
                </form>
                </Form>
            </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;

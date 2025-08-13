'use client';

import { FC, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageSummary: string;
  totalPrice: number;
}

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Ism-sharifingizni to'liq kiriting." }),
  phone: z.string().min(9, { message: "Telefon raqamingizni to'g'ri kiriting." }),
  telegram: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const ContactModal: FC<ContactModalProps> = ({ isOpen, onClose, packageSummary, totalPrice }) => {
  const { toast } = useToast();
  const [isSubmitting, setSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      telegram: '',
      notes: '',
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
      
      toast({
        title: 'Muvaffaqiyatli!',
        description: "So'rovingiz qabul qilindi. Tez orada siz bilan bog'lanamiz!",
        variant: 'default',
      });
      form.reset();
      onClose();

    } catch (error: any) {
      toast({
        title: 'Xatolik!',
        description: error.message || 'So‘rovni yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-dark-blue">Buyurtma berish</DialogTitle>
          <DialogDescription>
            Ma'lumotlaringizni qoldiring va biz siz bilan tez orada bog'lanamiz.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
             <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qo'shimcha izoh (ixtiyoriy)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Loyiha haqida qisqacha..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full shadow-ocean" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Yuborish
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;

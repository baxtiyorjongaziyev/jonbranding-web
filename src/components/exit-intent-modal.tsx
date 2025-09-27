
'use client';

import { FC, useState } from 'react';
import { useExitIntent } from '@/hooks/use-exit-intent';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ExitIntentModalProps {
  onPrimaryClick: () => void;
  lang: string;
}

const ExitIntentModal: FC<ExitIntentModalProps> = ({ onPrimaryClick, lang }) => {
  const [isOpen, setOpen] = useState(false);
  const router = useRouter();
  
  const handleClose = () => setOpen(false);

  const handleOpen = () => {
    router.push(`/${lang}/xizmatlar`);
    handleClose();
  }

  useExitIntent(() => setOpen(true));
  
  const t = {
    uz: {
        title: "Ketishga shoshilmang!",
        description: "Siz uchun maxsus taklifimiz bor. <br/>Bizda <span class='font-bold text-primary'>turli chegirmalar</span> mavjud. Imkoniyatdan foydalaning!",
        button: "Chegirmalarni ko'rish"
    },
    ru: {
        title: "Не спешите уходить!",
        description: "У нас есть специальное предложение для вас. <br/>У нас действуют <span class='font-bold text-primary'>различные скидки</span>. Воспользуйтесь возможностью!",
        button: "Посмотреть скидки"
    }
  }
  const translations = lang === 'ru' ? t.ru : t.uz;


  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md text-center rounded-2xl p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Gift className="h-10 w-10 text-primary" />
        </div>
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-foreground">{translations.title}</DialogTitle>
          <DialogDescription className="mt-2 text-lg text-gray-600" dangerouslySetInnerHTML={{ __html: translations.description }}>
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <Button onClick={handleOpen} size="lg" className="w-full text-lg py-6 shadow-ocean">
            {translations.button}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentModal;

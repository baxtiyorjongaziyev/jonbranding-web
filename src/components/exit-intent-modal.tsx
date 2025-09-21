'use client';

import { FC, useState } from 'react';
import { useExitIntent } from '@/hooks/use-exit-intent';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-react';

interface ExitIntentModalProps {
  onPrimaryClick: () => void;
}

const ExitIntentModal: FC<ExitIntentModalProps> = ({ onPrimaryClick }) => {
  const [isOpen, setOpen] = useState(false);
  
  const handleClose = () => setOpen(false);

  const handleOpen = () => {
    onPrimaryClick();
    handleClose();
  }

  useExitIntent(() => setOpen(true));

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md text-center rounded-2xl p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Gift className="h-10 w-10 text-primary" />
        </div>
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-primary-foreground">Ketishga shoshilmang!</DialogTitle>
          <DialogDescription className="mt-2 text-lg text-gray-600">
            Siz uchun maxsus taklifimiz bor. <br/>
            Bizda <span className="font-bold text-primary">turli chegirmalar</span> mavjud. Imkoniyatdan foydalaning!
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <Button onClick={handleOpen} size="lg" className="w-full text-lg py-6 shadow-ocean">
            Chegirmalarni ko'rish
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentModal;


'use client';

import { FC, useState } from 'react';
import { useScrollIntent } from '@/hooks/use-scroll-intent';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus } from 'lucide-react';

interface ScrollIntentModalProps {
  onPrimaryClick: () => void;
}

const ScrollIntentModal: FC<ScrollIntentModalProps> = ({ onPrimaryClick }) => {
  const [isOpen, setOpen] = useState(false);
  
  const handleClose = () => setOpen(false);

  const handleOpen = () => {
    onPrimaryClick();
    handleClose();
  }

  useScrollIntent(() => setOpen(true), 0.8);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md text-center rounded-2xl p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <MessageSquarePlus className="h-10 w-10 text-primary" />
        </div>
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-foreground">Yordam kerakmi?</DialogTitle>
          <DialogDescription className="mt-2 text-lg text-gray-600">
            Saytimizni deyarli oxirigacha ko'rib chiqdingiz. Keling, loyihangizni muhokama qilamiz va sizga qanday yordam bera olishimizni bilib olamiz.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <Button onClick={handleOpen} size="lg" className="w-full text-lg py-6 shadow-ocean">
            Bepul konsultatsiyaga yozilish
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScrollIntentModal;

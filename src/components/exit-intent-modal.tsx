
'use client';

import { FC, useState, useEffect } from 'react';
import { useExitIntent } from '@/hooks/use-exit-intent';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getDictionary, Locale } from '@/lib/dictionaries';

interface ExitIntentModalProps {
  onPrimaryClick: () => void;
  lang: string;
}

const ExitIntentModal: FC<ExitIntentModalProps> = ({ onPrimaryClick, lang }) => {
  const [isOpen, setOpen] = useState(false);
  const router = useRouter();
  const [translations, setTranslations] = useState<any>(null);

  useEffect(() => {
    getDictionary(lang as Locale).then(dict => setTranslations(dict.exitIntentModal));
  }, [lang]);
  
  const handleClose = () => setOpen(false);

  const handleOpen = () => {
    router.push(`/${lang}/xizmatlar`);
    handleClose();
  }

  useExitIntent(() => {
    // Only trigger if not already shown in this session
    if (!sessionStorage.getItem('exit_intent_shown')) {
      setOpen(true);
      sessionStorage.setItem('exit_intent_shown', 'true');
    }
  });
  
  if (!translations) {
    return null;
  }

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

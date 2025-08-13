'use client';

import { FC, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      // Give the iframe a moment to start loading
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-2xl">
        <div className="h-[600px] w-full">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background">
               <Skeleton className="h-full w-full" />
            </div>
          )}
          <iframe
            className="airtable-embed w-full h-full"
            src="https://airtable.com/embed/app8xoyx1XCumYFXV/pagcuWWURl14WnljJ/form"
            frameBorder="0"
            width="100%"
            height="100%"
            style={{ background: 'transparent', border: 'none' }}
            onLoad={() => setIsLoading(false)}
          ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;

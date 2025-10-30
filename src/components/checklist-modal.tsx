
'use client';

import { FC, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { marked } from 'marked';
import { Skeleton } from './ui/skeleton';
import { getDictionary } from '@/lib/dictionaries';
import { Button } from './ui/button';

interface ChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
}

const ChecklistModal: FC<ChecklistModalProps> = ({ isOpen, onClose, lang }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [translations, setTranslations] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
        setIsLoading(true);
        getDictionary(lang as 'uz' | 'ru').then(dict => setTranslations(dict.leadMagnet));

        const filePath = `/checklists/7-mistakes-in-branding-${lang}.md`;
        
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(text => {
                 // Remove frontmatter
                const cleanText = text.replace(/---[\s\S]*?---/, '');
                const htmlContent = marked(cleanText);
                setContent(htmlContent);
            })
            .catch(error => {
                console.error('Error fetching checklist:', error);
                setContent(`<p>Error loading content.</p>`);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }
  }, [isOpen, lang]);

  const handleOpenContact = () => {
    onClose();
    const event = new CustomEvent('openContactModal');
    window.dispatchEvent(event);
  };

  if (!isOpen) {
    return null;
  }
  
  const checklistData = translations?.magnets?.find((m: any) => m.id === 'pdf');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl rounded-2xl p-0">
        <DialogHeader className="p-6 pb-2">
            {checklistData && (
                 <>
                    <DialogTitle className="text-2xl font-bold text-dark-blue">{checklistData.title}</DialogTitle>
                    <DialogDescription>
                        {checklistData.subtitle}
                    </DialogDescription>
                 </>
            )}
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="p-6 pt-2 prose prose-lg max-w-none">
             {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-8 w-1/2 mt-4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                </div>
            ) : (
                <div dangerouslySetInnerHTML={{ __html: content }} />
            )}
          </div>
        </ScrollArea>
        {translations && (
          <div className="p-6 bg-secondary/50 border-t text-center">
            <h4 className="font-bold text-lg">{translations.cta.title}</h4>
            <p className="text-muted-foreground mt-1 mb-4">{translations.cta.description}</p>
            <Button onClick={handleOpenContact} className="shadow-ocean animate-breathing">
              {translations.cta.button}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChecklistModal;

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Download, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { trackEvent } from '@/lib/analytics';

interface LeadMagnetPopupProps {
  dictionary: {
    title: string;
    subtitle: string;
    description: string;
    cta: string;
    closeText: string;
  };
}

const LeadMagnetPopup: React.FC<LeadMagnetPopupProps> = ({ dictionary }) => {
  if (!dictionary) return null;
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed or converted
    const status = localStorage.getItem('lead_magnet_status');
    if (status === 'dismissed' || status === 'converted') {
      setIsDismissed(true);
      return;
    }

    // Show after 15 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 15000);

    // Also show on scroll depth (50%)
    const handleScroll = () => {
      if (window.scrollY > document.documentElement.scrollHeight / 2 && !isVisible) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('lead_magnet_status', 'dismissed');
    setIsDismissed(true);
  };

  const handleCTA = () => {
    // Logic for CTA (e.g., open contact modal with prefilled data or just download)
    trackEvent({ action: 'lead_magnet_click', category: 'Conversion', label: dictionary.title });
    const event = new CustomEvent('openContactModal', { detail: { source: 'lead_magnet' } });
    window.dispatchEvent(event);
    localStorage.setItem('lead_magnet_status', 'converted');
    setIsVisible(false);
    setIsDismissed(true);
  };

  if (isDismissed || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        className="fixed bottom-6 left-6 z-50 max-w-sm w-full p-4 hidden md:block"
      >
        <Card className="relative overflow-hidden border-none shadow-2xl bg-white ring-1 ring-slate-200">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 z-10"
          >
            <X className="w-4 h-4" />
          </Button>

          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Gift className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 leading-tight">
                  {dictionary.title}
                </h3>
                <p className="text-xs text-primary font-semibold uppercase tracking-wider">
                  {dictionary.subtitle}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-6 leading-relaxed" 
               dangerouslySetInnerHTML={{ __html: dictionary.description }} />

            <div className="space-y-3">
              <Button onClick={handleCTA} className="w-full bg-primary hover:bg-primary/90 text-white font-bold group shadow-lg shadow-primary/20">
                <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                {dictionary.cta}
              </Button>
              <button 
                onClick={handleClose}
                className="w-full text-center text-xs text-slate-400 hover:text-slate-500 transition-colors"
              >
                {dictionary.closeText}
              </button>
            </div>
            
            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-400 uppercase font-medium">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                Spamsiz. Faqat foydali ma'lumot.
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Mobile version (bottom sheet style) */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="fixed bottom-0 left-0 w-full z-50 md:hidden p-4"
      >
          <Card className="rounded-t-3xl border-none shadow-[0_-10px_40px_rgba(0,0,0,0.1)] bg-white overflow-hidden">
             <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-4" onClick={handleClose}></div>
             <CardContent className="p-6 pt-0 pb-8 text-center">
                 <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8 text-primary" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">{dictionary.title}</h3>
                 <p className="text-sm text-slate-600 mb-6" dangerouslySetInnerHTML={{ __html: dictionary.description }} />
                 <Button onClick={handleCTA} size="lg" className="w-full text-lg font-bold">
                    {dictionary.cta}
                 </Button>
                 <button onClick={handleClose} className="mt-4 text-sm text-slate-400 font-medium">
                    {dictionary.closeText}
                 </button>
             </CardContent>
          </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default LeadMagnetPopup;

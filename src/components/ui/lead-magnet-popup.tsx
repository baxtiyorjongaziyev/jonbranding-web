'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Download, CheckCircle2, Phone, ArrowRight, ShieldAlert, Building2, User, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { trackEvent, trackLead } from '@/lib/analytics';
import { useToast } from '@/hooks/use-toast';

interface LeadMagnetPopupProps {
  dictionary: any;
}

type FlowStep = 'intro' | 'qualification' | 'registration' | 'blocked' | 'success';

const LeadMagnetPopup: React.FC<LeadMagnetPopupProps> = ({ dictionary }) => {
  if (!dictionary || !dictionary.roleSelection) return null;
  
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [step, setStep] = useState<FlowStep>('intro');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    role: '',
    businessType: '',
    name: '',
    phone: ''
  });

  useEffect(() => {
    const status = localStorage.getItem('lead_magnet_status');
    if (status === 'dismissed' || status === 'converted') {
      setIsDismissed(true);
      return;
    }

    const timer = setTimeout(() => setIsVisible(true), 15000);
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

  const handleRoleSelect = (roleKey: string) => {
    setFormData({ ...formData, role: roleKey });
    if (roleKey === 'owner' || roleKey === 'ceo') {
      setStep('registration');
      trackEvent({ action: 'lead_magnet_qualified', category: 'Funnel', label: roleKey });
    } else {
      setStep('blocked');
      trackEvent({ action: 'lead_magnet_blocked', category: 'Funnel', label: roleKey });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.businessType) {
      toast({ title: "Xato", description: "Iltimos, barcha maydonlarni to'ldiring", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          source: 'lead_magnet_popup',
          message: `Lead Magnet roles/qualification flow. Role: ${formData.role}, Business: ${formData.businessType}`
        }),
      });

      if (response.ok) {
        trackLead({ 
          source: 'lead_magnet_popup', 
          role: formData.role, 
          business: formData.businessType,
          name: formData.name,
          phone: formData.phone
        });
        setStep('success');
        localStorage.setItem('lead_magnet_status', 'converted');
        setTimeout(() => setIsVisible(false), 5000);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      toast({ title: "Xato", description: "Ma'lumot yuborishda xatolik yuz berdi", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isDismissed || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-0 md:bottom-6 left-0 md:left-6 z-[100] w-full md:max-w-md p-4 md:p-0"
      >
        <Card className="relative overflow-hidden border-none shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-[#0A0A0A] text-white rounded-3xl md:rounded-2xl border border-white/5">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600"></div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute top-3 right-3 text-white/40 hover:text-white hover:bg-white/10 z-50 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>

          <CardContent className="p-8 md:p-10">
            <AnimatePresence mode="wait">
              {/* STEP: INTRO */}
              {step === 'intro' && (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className="bg-blue-600/20 p-3 rounded-2xl ring-1 ring-blue-500/30">
                      <Gift className="w-8 h-8 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold leading-tight tracking-tight">
                        {dictionary.title}
                      </h3>
                      <p className="text-xs text-blue-400 font-bold uppercase tracking-[0.2em] mt-1">
                        {dictionary.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="text-base text-gray-400 leading-relaxed font-medium" 
                     dangerouslySetInnerHTML={{ __html: dictionary.description }} />

                  <Button 
                    onClick={() => setStep('qualification')} 
                    className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl group transition-all shadow-xl shadow-blue-900/20"
                  >
                    {dictionary.cta}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              )}

              {/* STEP: QUALIFICATION */}
              {step === 'qualification' && (
                <motion.div
                  key="qualification"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-center mb-8">
                    {dictionary.roleSelection.title}
                  </h3>
                  <div className="grid gap-3">
                    {Object.entries(dictionary.roleSelection.roles).map(([key, label]: [string, any]) => (
                      <button
                        key={key}
                        onClick={() => handleRoleSelect(key)}
                        className="w-full h-14 px-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-blue-600 hover:border-blue-600 text-gray-300 hover:text-white font-semibold transition-all duration-300 text-left flex items-center justify-between group"
                      >
                        <span>{label}</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP: REGISTRATION FORM */}
              {step === 'registration' && (
                <motion.div
                  key="registration"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-1">{dictionary.registration.title}</h3>
                    <p className="text-sm text-gray-400">{dictionary.registration.subtitle}</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-gray-500 ml-2 tracking-widest">{dictionary.registration.businessLabel}</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                        <Input 
                          placeholder={dictionary.registration.businessPlaceholder}
                          className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl focus:ring-blue-600 focus:border-blue-600"
                          value={formData.businessType}
                          onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-gray-500 ml-2 tracking-widest">{dictionary.registration.nameLabel}</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                        <Input 
                          placeholder={dictionary.registration.namePlaceholder}
                          className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl focus:ring-blue-600 focus:border-blue-600"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-gray-500 ml-2 tracking-widest">{dictionary.registration.phoneLabel}</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                        <Input 
                          placeholder={dictionary.registration.phonePlaceholder}
                          className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl focus:ring-blue-600 focus:border-blue-600"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl mt-4 shadow-lg shadow-blue-900/20"
                    >
                      {isSubmitting ? "Yuklanmoqda..." : dictionary.registration.submit}
                    </Button>
                    <p className="text-[10px] text-center text-gray-500 mt-2 font-medium uppercase tracking-widest">
                      {dictionary.registration.limitHint}
                    </p>
                  </form>
                </motion.div>
              )}

              {/* STEP: BLOCKED SCREEN */}
              {step === 'blocked' && (
                <motion.div
                  key="blocked"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-8 py-2 text-center"
                >
                  <div className="flex justify-center">
                    <div className="bg-red-500/20 p-4 rounded-3xl ring-1 ring-red-500/30 animate-pulse">
                      <ShieldAlert className="w-12 h-12 text-red-500" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-3xl font-black text-white leading-tight uppercase tracking-tight">
                      {dictionary.blocked.title}
                    </h3>
                    <p className="text-gray-400 text-sm italic">
                      {dictionary.blocked.description}
                    </p>
                  </div>

                  <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
                    <p className="text-xs text-gray-300 font-medium">
                      {dictionary.blocked.socialHint}
                    </p>
                    <Button asChild className="w-full h-14 bg-[#24A1DE] hover:bg-[#24A1DE]/80 text-white font-bold text-base rounded-2xl shadow-lg shadow-[#24A1DE]/20">
                      <a href="https://t.me/JonBranding" target="_blank" rel="noopener noreferrer">
                        <X className="w-5 h-5 mr-3 rotate-45" /> {/* Telegram icon surrogate */}
                        {dictionary.blocked.telegramCTA}
                      </a>
                    </Button>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">
                      {dictionary.blocked.contactHint}
                    </p>
                    <a href={`tel:${dictionary.blocked.phone}`} className="text-2xl font-black text-blue-500 hover:text-blue-400 transition-colors">
                      {dictionary.blocked.phone}
                    </a>
                  </div>
                </motion.div>
              )}

              {/* STEP: SUCCESS */}
              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10 space-y-6"
                >
                  <div className="bg-green-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto ring-1 ring-green-500/30">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Muvaffaqiyatli!</h3>
                    <p className="text-gray-400">Material yuklab olish uchun tayyor. Rahmat!</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
          
          {/* Bottom decorative bar */}
          <div className="h-2 w-full bg-white/5 flex items-center justify-center gap-1.5 overflow-hidden">
             {[...Array(20)].map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-white/10"></div>
             ))}
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default LeadMagnetPopup;

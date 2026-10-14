'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Download, X, Share2, PlusSquare, MoreVertical } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import uz from '@/locales/uz.json';
import ru from '@/locales/ru.json';
import en from '@/locales/en.json';
import zh from '@/locales/zh.json';

interface PwaInstallerProps {
  installRequest?: number;
  lang?: string;
  dictionary?: {
    title?: string;
    description?: string;
    install?: string;
    ios_instruction?: string;
    android_instruction?: string;
    browser_menu?: string;
    dismiss?: string;
    share?: string;
    add_to_home?: string;
  };
}

export default function PwaInstaller({ lang = 'uz', dictionary, installRequest }: PwaInstallerProps) {
  const guideCopy = ({ uz, ru, en, zh }[lang as 'uz' | 'ru' | 'en' | 'zh'] || uz).pwa;
  const reduceMotion = useReducedMotion();
  const externallyTriggered = installRequest !== undefined;
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showManualGuide, setShowManualGuide] = useState(false);

  const t = {
    title: dictionary?.title || (lang === 'ru' ? 'Приложение Jon.Branding' : lang === 'en' ? 'Jon.Branding App' : "Jon.Branding Ilovasi"),
    description: dictionary?.description || (lang === 'ru' ? 'Установите на экран для быстрого доступа' : lang === 'en' ? 'Install on home screen for quick access' : "Telefoningizga o'rnating — qulay va tezkor ishlaydi"),
    install: dictionary?.install || (lang === 'ru' ? 'Установить' : lang === 'en' ? 'Install' : "O'rnatish"),
    iosInstruction: dictionary?.ios_instruction || (lang === 'ru' ? 'Нажмите «Поделиться» ⎋ и выберите «На экран «Домой» ⊕' : lang === 'en' ? 'Tap Share ⎋ and choose "Add to Home Screen" ⊕' : "Ulashish ⎋ tugmasini bosing va 'Bosh ekranga qo'shish' ⊕ ni tanlang"),
    dismiss: dictionary?.dismiss || (lang === 'ru' ? 'Закрыть' : lang === 'en' ? 'Dismiss' : 'Yopish'),
  };

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalhost && process.env.NODE_ENV !== 'production') return;
    let registration: ServiceWorkerRegistration | undefined;
    let active = true;
    const checkForUpdate = () => {
      if (document.visibilityState === 'visible' && navigator.onLine) {
        void registration?.update().catch(() => {});
      }
    };
    void navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })
      .then((result) => { if (active) registration = result; })
      .catch((err) => console.warn('[PWA] Service Worker ro\'yxatdan o\'tmadi:', err));
    document.addEventListener('visibilitychange', checkForUpdate);
    return () => {
      active = false;
      document.removeEventListener('visibilitychange', checkForUpdate);
    };
  }, []);

  useEffect(() => {
    // 2. Check if already installed / standalone
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    setIsStandalone(isStandaloneMode);
    if (isStandaloneMode) return;

    // Check iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isMobileDevice = isIosDevice || /android/.test(ua);
    // A narrow desktop window is still a desktop: install offers are mobile-only.
    if (!isMobileDevice) return;
    setIsIos(isIosDevice);

    // Check if dismissed recently (3 days)
    let dismissedAt: string | null = null;
    try {
      dismissedAt = localStorage.getItem('jb_pwa_dismissed');
    } catch {}
    const isDismissedRecently = dismissedAt && Date.now() - parseInt(dismissedAt, 10) < 3 * 24 * 60 * 60 * 1000;
    let promptTimer: ReturnType<typeof setTimeout> | undefined;
    const clearPromptTimer = () => {
      if (promptTimer !== undefined) clearTimeout(promptTimer);
    };
    const schedulePrompt = () => {
      clearPromptTimer();
      if (isDismissedRecently) return;
      promptTimer = setTimeout(() => {
        setShowPrompt(true);
        trackEvent({ action: 'pwa_prompt_shown', category: 'PWA', label: 'automatic' });
      }, 6000);
    };

    // 3. Listen for Android / Chrome beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);

      schedulePrompt();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. Listen for app installed
    const handleAppInstalled = () => {
      clearPromptTimer();
      setShowPrompt(false);
      setDeferredPrompt(null);
      setIsStandalone(true);
      trackEvent({
        action: 'pwa_installed_success',
        category: 'PWA',
        label: 'installed',
      });
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    // 5. Custom trigger from menu or buttons
    const handleCustomTrigger = () => {
      clearPromptTimer();
      setShowPrompt(true);
      if (isIosDevice && !isStandaloneMode) {
        setShowManualGuide(true);
      }
    };
    if (!externallyTriggered) window.addEventListener('openPwaInstallPrompt', handleCustomTrigger);
    // Safari does not emit beforeinstallprompt; offer its home-screen guide.
    if (isIosDevice) schedulePrompt();

    return () => {
      clearPromptTimer();
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('openPwaInstallPrompt', handleCustomTrigger);
    };
  }, [externallyTriggered]);

  useEffect(() => {
    if (!installRequest || isStandalone) return;
    const ua = navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (!ios && !/android/.test(ua)) return;
    if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true || document.referrer.includes('android-app://')) return;
    setShowPrompt(true);
    setShowManualGuide(ios);
  }, [installRequest, isStandalone]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          trackEvent({
            action: 'pwa_install_accepted',
            category: 'PWA',
            label: 'accepted',
          });
        } else {
          trackEvent({
            action: 'pwa_install_dismissed',
            category: 'PWA',
            label: 'user_dismissed',
          });
        }
        setDeferredPrompt(null);
        setShowPrompt(false);
      } catch (err) {
        console.error('[PWA] Prompt xatosi:', err);
      }
    } else {
      setShowManualGuide(true);
    }
  };

  const handleDismiss = useCallback(() => {
    setShowPrompt(false);
    setShowManualGuide(false);
    try {
      localStorage.setItem('jb_pwa_dismissed', Date.now().toString());
    } catch {}
    trackEvent({
      action: 'pwa_prompt_closed',
      category: 'PWA',
      label: 'closed_by_user',
    });
  }, []);

  if (isStandalone || (!showPrompt && !showManualGuide)) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: reduceMotion ? 0 : 0.2, ease: 'easeOut' }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.05, bottom: 0.6 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 40 || info.velocity.y > 250) {
            handleDismiss();
          }
        }}
        data-pwa-install=""
        className="fixed bottom-[calc(76px+env(safe-area-inset-bottom,0px))] md:bottom-[calc(16px+env(safe-area-inset-bottom,0px))] left-3 right-3 z-50 mx-auto max-w-sm touch-pan-y"
      >
        <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-[#080d16]/95 p-4 pt-3 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
          {/* Subtle swipe down pill */}
          <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-white/20 sm:hidden" aria-hidden="true" />
          {/* Subtle accent glow */}
          <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />

          {/* Close button */}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label={t.dismiss}
            className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-3.5 pr-6">
            {/* Logo / App Icon */}
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/40 shadow-inner">
              <Image
                src="/icon-192-v2.png"
                unoptimized
                alt="Jon.Branding"
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="text-[14px] font-bold tracking-tight text-white">{t.title}</div>
              <p className="mt-0.5 text-[12px] leading-relaxed text-white/70">
                {showManualGuide
                  ? (isIos ? t.iosInstruction : dictionary?.android_instruction || guideCopy.android_instruction)
                  : t.description}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-3.5 flex items-center justify-end gap-2">
            {showManualGuide ? (
              <div className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] text-white/80">
                <span className="flex items-center gap-1.5 font-medium">
                  {isIos ? <Share2 className="h-3.5 w-3.5 text-primary" /> : <MoreVertical className="h-3.5 w-3.5 text-primary" />}
                  1. {isIos ? dictionary?.share || guideCopy.share : dictionary?.browser_menu || guideCopy.browser_menu}
                </span>
                <span className="text-white/30">→</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <PlusSquare className="h-3.5 w-3.5 text-emerald-400" />
                  2. {dictionary?.add_to_home || guideCopy.add_to_home}
                </span>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="min-h-11 rounded-xl px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:text-white"
                >
                  {t.dismiss}
                </button>
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="flex min-h-11 items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-primary/90"
                >
                  <Download className="h-3.5 w-3.5" />
                  {t.install}
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

'use client';

import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { Loader2, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { OishaOrb, type OishaOrbState } from '@/components/ui/oisha-orb';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { isOishaWebUserId } from '@/lib/oisha';
import uz from '@/locales/uz.json';
import ru from '@/locales/ru.json';
import en from '@/locales/en.json';
import zh from '@/locales/zh.json';
import type { Locale } from '@/lib/dictionaries';
import { useVisualViewport } from '@/hooks/use-visual-viewport';

interface OishaMessage {
  id: string;
  text: string;
  role: 'user' | 'model';
  timestamp: string;
}

const OISHA_PROXY = '/api/oisha';
const widgetTranslations = {
  uz: uz.oishaWidget,
  ru: ru.oishaWidget,
  en: en.oishaWidget,
  zh: zh.oishaWidget,
} as const;

export function createOishaUserId() {
  return `web_${crypto.randomUUID()}`;
}

const OishaWidget: FC<{ lang: string; chatRequest?: number }> = ({ lang, chatRequest }) => {
  const [isOpen, setIsOpen] = useState(false);
  const visibleViewport = useVisualViewport(isOpen);
  const [messages, setMessages] = useState<OishaMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [proactiveMsg, setProactiveMsg] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const sessionUserIdRef = useRef<string | null>(null);
  const turnstileTokenRef = useRef<string | null>(null);
  const [turnstileReady, setTurnstileReady] = useState(false);
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const honeypotRef = useRef<string>('');
  const talkingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { toast } = useToast();

  const safeLang = (['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz') as Locale;
  const translations = widgetTranslations[safeLang];

  const triggerTalking = useCallback(() => {
    if (talkingTimeoutRef.current) clearTimeout(talkingTimeoutRef.current);
    setIsTalking(true);
    talkingTimeoutRef.current = setTimeout(() => {
      setIsTalking(false);
    }, 1800);
  }, []);

  useEffect(() => {
    return () => {
      if (talkingTimeoutRef.current) clearTimeout(talkingTimeoutRef.current);
    };
  }, []);

  const orbState: OishaOrbState = isLoading ? 'thinking' : isTalking ? 'talking' : 'idle';

  const fetchHistory = useCallback(async (uid: string) => {
    try {
      const res = await fetch(`${OISHA_PROXY}?user_id=${uid}`);
      const data = await res.json();
      // Bo'sh tarix (backend sozlanmagan) mavjud salom xabarini o'chirmasin.
      if (Array.isArray(data.history) && data.history.length > 0) {
        setMessages(
          data.history.map((message: any, idx: number) => ({
            id: `hist-${idx}`,
            text: message.parts?.[0]?.text ?? '',
            role: message.role,
            timestamp: new Date().toISOString(),
          })),
        );
      }
    } catch (error) {
      console.error('Oisha History Error:', error);
    }
  }, []);

  // Initialize User ID and Fetch History
  useEffect(() => {
    let storedId = sessionUserIdRef.current;
    try { storedId = localStorage.getItem('oisha_user_id') || storedId; } catch {}
    // Proxy faqat `web_<UUID>`ni qabul qiladi — eski yoki buzilgan ID bo'lsa yangisi olinadi.
    if (!isOishaWebUserId(storedId)) {
      storedId = createOishaUserId();
      try { localStorage.setItem('oisha_user_id', storedId); } catch {}
    }
    sessionUserIdRef.current = storedId;
    setUserId(storedId);

    // Initial welcome message if no history
    setMessages(prev => prev.length === 0 ? [{
        id: 'welcome',
        text: translations.welcome,
        role: 'model',
        timestamp: new Date().toISOString()
    }] : prev);
  }, [translations.welcome]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (chatRequest !== undefined) return;
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener('toggleOisha', handleToggle);
    return () => window.removeEventListener('toggleOisha', handleToggle);
  }, [chatRequest]);

  useEffect(() => {
    if (chatRequest) setIsOpen(true);
  }, [chatRequest]);

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const msg = e.detail?.message;
      if (msg && typeof msg === 'string') {
        setProactiveMsg(msg);
        setIsOpen(true);
      }
    };
    window.addEventListener('oishaProactive', handler as EventListener);
    return () => window.removeEventListener('oishaProactive', handler as EventListener);
  }, []);

  // Proaktiv xabar — Oisha'ning o'z savoli. U mehmon nomidan backend'ga
  // yuborilmaydi: aks holda har bir tashrif lid guruhiga "savol" bo'lib tushadi.
  useEffect(() => {
    if (!proactiveMsg) return;
    const text = proactiveMsg;
    setProactiveMsg(null);
    triggerTalking();
    setMessages((prev) =>
      prev.some((message) => message.role === 'model' && message.text === text)
        ? prev
        : [...prev, { id: `proactive-${Date.now()}`, text, role: 'model', timestamp: new Date().toISOString() }],
    );
  }, [proactiveMsg, triggerTalking]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !userId || isLoading) return;
    // Token tayyor bo'lmasa yubormaymiz — input saqlanadi, xabar yo'qolmaydi.
    if (!turnstileTokenRef.current) return;

    const userText = inputValue.trim();
    const newUserMsg: OishaMessage = {
      id: Date.now().toString(),
      text: userText,
      role: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue('');
    setIsLoading(true);

    // Turnstile token bir martalik: har xabardan keyin qayta olinadi.
    const turnstileToken = turnstileTokenRef.current;
    turnstileTokenRef.current = null;
    setTurnstileReady(false);
    turnstileRef.current?.reset();

    try {
      const res = await fetch(OISHA_PROXY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          text: userText,
          lang: safeLang,
          turnstileToken,
          // Honeypot: odam ko'rmaydi, bot to'ldiradi.
          companyWebsite: honeypotRef.current,
        }),
      });

      if (!res.ok) throw new Error('API Error');

      const data = await res.json();
      if (data && data.response) {
        triggerTalking();
        setMessages((prev) => [
          ...prev,
          {
            id: `reply-${Date.now()}`,
            text: data.response,
            role: 'model',
            timestamp: new Date().toISOString(),
          },
        ]);
      } else {
        // Fallback for asynchronous/queued routing
        setTimeout(() => {
          triggerTalking();
          setMessages((prev) => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg && lastMsg.role === 'user') {
              return [
                ...prev,
                {
                  id: `system-ack-${Date.now()}`,
                  text: translations.ack,
                  role: 'model',
                  timestamp: new Date().toISOString(),
                },
              ];
            }

            return prev;
          });
        }, 3000);

        setTimeout(() => fetchHistory(userId), 2000);
      }
    } catch {
      toast({
        title: translations.error,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className={cn(
          'fixed bottom-24 right-6 z-50 transition duration-500 md:bottom-6 hidden md:block',
          isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100',
        )}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="group relative w-14 h-14 rounded-full p-0 shadow-[0_14px_34px_-8px_rgba(37,84,255,0.65)] flex items-center justify-center transition-transform duration-300 hover:scale-105 active:scale-95 ring-2 ring-white/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          aria-label={translations.openButtonAriaLabel}
          aria-expanded={isOpen}
          aria-controls="oisha-chat-window"
        >
          <OishaOrb size="lg" state={orbState} decorative className="w-full h-full" />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="oisha-chat-window"
            id="oisha-chat-window"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            data-mobile-overlay="true"
            style={visibleViewport ? {
              bottom: `calc(env(safe-area-inset-bottom, 0px) + 12px + ${visibleViewport.bottom}px)`,
              maxHeight: Math.max(0, visibleViewport.height - 24),
            } : undefined}
            className="fixed bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] right-3 z-[60] w-[calc(100%_-_1.5rem)] sm:right-6 sm:bottom-6 sm:w-[400px] h-[600px] max-h-[85dvh]"
          >
            <Card className="h-full flex flex-col shadow-2xl rounded-3xl overflow-hidden border-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl ring-1 ring-black/10 dark:ring-white/10">
              <CardHeader className="shrink-0 p-4 border-b border-black/5 flex flex-row items-center justify-between bg-[#0A0B0E] text-white">
                <div className="flex items-center gap-3">
                  <OishaOrb size="md" state={orbState} label={translations.title} className="w-10 h-10 shrink-0" />
                  <div>
                    <CardTitle className="text-sm font-bold text-white">{translations.title}</CardTitle>
                    <p className="text-[10px] text-white/70 uppercase tracking-widest">
                      {translations.subtitle}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0A0B0E]"
                  aria-label={translations.closeButtonAriaLabel}
                  aria-expanded={isOpen}
                  aria-controls="oisha-chat-window"
                >
                  <X className="w-5 h-5" />
                </button>
              </CardHeader>

              <CardContent className="flex-1 p-0 min-h-0">
                <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          'flex flex-col gap-1',
                          msg.role === 'model' ? 'items-start' : 'items-end',
                        )}
                      >
                        <div
                          className={cn(
                            'max-w-[85%] p-3 rounded-2xl text-sm shadow-sm',
                            msg.role === 'model'
                              ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-none'
                              : 'bg-[#2554FF] text-white rounded-tr-none',
                          )}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex items-center gap-2 text-zinc-400 text-xs italic ml-2">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        {translations.thinking}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>

              <CardFooter className="shrink-0 p-4 border-t bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="flex w-full gap-2">
                  {/* Honeypot: ko'rinmas, odam to'ldirmaydi. */}
                  <input
                    type="text"
                    name="companyWebsite"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    onChange={(e) => { honeypotRef.current = e.target.value; }}
                    style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, opacity: 0 }}
                  />
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={translations.placeholder}
                    aria-label={translations.placeholder}
                    className="h-11 md:h-10 min-w-0 text-base md:text-sm rounded-xl border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                  />
                  {/* Invisible: foydalanuvchi ko'rmaydi, lekin token avtomatik olinadi. */}
                  <div className="absolute w-0 h-0 overflow-hidden">
                    <Turnstile
                      ref={turnstileRef}
                      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
                      options={{ size: 'invisible' }}
                      onSuccess={(token) => {
                        turnstileTokenRef.current = token;
                        setTurnstileReady(true);
                      }}
                      onExpire={() => {
                        turnstileTokenRef.current = null;
                        setTurnstileReady(false);
                      }}
                      onError={() => {
                        turnstileTokenRef.current = null;
                        setTurnstileReady(false);
                      }}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim() || !turnstileReady}
                    className="p-3 bg-[#2554FF] text-white rounded-xl hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
                    aria-label={translations.sendButtonAriaLabel}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OishaWidget;

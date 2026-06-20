'use client';

import { FC, useEffect, useRef, useState } from 'react';
import { Bot, Loader2, Send, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import uz from '@/locales/uz.json';
import ru from '@/locales/ru.json';
import en from '@/locales/en.json';
import zh from '@/locales/zh.json';
import type { Locale } from '@/lib/dictionaries';

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

const OishaWidget: FC<{ lang: string }> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<OishaMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const safeLang = (['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz') as Locale;
  const translations = widgetTranslations[safeLang];

  useEffect(() => {
    let storedId = localStorage.getItem('oisha_user_id');
    if (!storedId) {
      storedId = `web_${crypto.randomUUID()}`;
      localStorage.setItem('oisha_user_id', storedId);
    }

    setUserId(storedId);
    setMessages((prev) =>
      prev.length > 0
        ? prev
        : [
            {
              id: 'welcome',
              text: translations.welcome,
              role: 'model',
              timestamp: new Date().toISOString(),
            },
          ],
    );
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
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener('toggleOisha', handleToggle);
    return () => window.removeEventListener('toggleOisha', handleToggle);
  }, []);

  const fetchHistory = async (uid: string) => {
    try {
      const res = await fetch(`${OISHA_PROXY}?user_id=${uid}`);
      const data = await res.json();
      if (data.history) {
        setMessages(
          data.history.map((message: any, idx: number) => ({
            id: `hist-${idx}`,
            text: message.parts[0].text,
            role: message.role,
            timestamp: new Date().toISOString(),
          })),
        );
      }
    } catch (error) {
      console.error('Oisha History Error:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !userId || isLoading) return;

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

    try {
      const res = await fetch(OISHA_PROXY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, text: userText }),
      });

      if (!res.ok) throw new Error('API Error');

      const data = await res.json();
      if (data && data.response) {
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
          'fixed bottom-24 right-6 z-50 transition-all duration-500 md:bottom-6 hidden md:block',
          isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100',
        )}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-blue-600 text-white shadow-2xl flex items-center justify-center hover:bg-blue-700 transition-all ring-4 ring-white/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          aria-label={translations.openButtonAriaLabel}
          aria-expanded={isOpen}
          aria-controls="oisha-chat-window"
        >
          <Sparkles className="w-8 h-8 animate-pulse" />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="oisha-chat-window"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-[60] w-[calc(100%-3rem)] sm:bottom-6 sm:w-[400px] h-[600px] max-h-[80vh]"
          >
            <Card className="h-full flex flex-col shadow-2xl rounded-3xl overflow-hidden border-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/5">
              <CardHeader className="p-4 border-b flex flex-row items-center justify-between bg-blue-600 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold">{translations.title}</CardTitle>
                    <p className="text-[10px] opacity-80 uppercase tracking-widest">
                      {translations.subtitle}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 focus-visible:ring-offset-blue-600"
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
                              : 'bg-blue-600 text-white rounded-tr-none',
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

              <CardFooter className="p-4 border-t bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="flex w-full gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={translations.placeholder}
                    className="rounded-xl border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim()}
                    className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
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

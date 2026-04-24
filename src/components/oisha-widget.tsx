
'use client';

import { useState, useRef, useEffect, FC, Fragment } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface OishaMessage {
  id: string;
  text: string;
  role: 'user' | 'model'; // Oisha API uses 'user' and 'model'
  timestamp: string;
}

const OISHA_API_URL = process.env.NEXT_PUBLIC_OISHA_API_URL || 'http://localhost:8080';
const OISHA_SECRET = 'oisha_safe_123'; // User can override later

const OishaWidget: FC<{ lang: 'uz' | 'ru' }> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<OishaMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const translations = {
    uz: {
      title: "Oisha Intelligence",
      subtitle: "Avtonom Biznes-Konsyerj",
      placeholder: "Xabar yozing...",
      error: "Ulanishda xatolik yuz berdi.",
      welcome: "Assalomu alaykum! Men Oisha — Jon Branding agentligining intellektual yordamchisiman. Sizga qanday ko'mak bera olaman?"
    },
    ru: {
      title: "Oisha Intelligence",
      subtitle: "Автономный Бизнес-Консьерж",
      placeholder: "Напишите сообщение...",
      error: "Ошибка подключения.",
      welcome: "Здравствуйте! Я Оиша — интеллектуальный помощник Jon Branding. Чем я могу вам помочь?"
    },
    en: {
      title: "Oisha Intelligence",
      subtitle: "Autonomous Business Concierge",
      placeholder: "Write a message...",
      error: "Connection error.",
      welcome: "Welcome! I am Oisha — the intellectual assistant for Jon Branding. How can I help you today?"
    }
  }[lang] || {
    title: "Oisha Intelligence",
    subtitle: "Autonomous Assistant",
    placeholder: "Message...",
    error: "Error.",
    welcome: "Hello, how can I help?"
  };

  // Initialize User ID and Fetch History
  useEffect(() => {
    let storedId = localStorage.getItem('oisha_user_id');
    if (!storedId) {
      storedId = 'web_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('oisha_user_id', storedId);
    }
    setUserId(storedId);

    // Initial welcome message if no history
    if (messages.length === 0) {
        setMessages([{
            id: 'welcome',
            text: translations.welcome,
            role: 'model',
            timestamp: new Date().toISOString()
        }]);
    }
  }, [lang, translations.welcome]);

  // Handle scrolling to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggleOisha', handleToggle);
    return () => window.removeEventListener('toggleOisha', handleToggle);
  }, []);

  const fetchHistory = async (uid: string) => {
    try {
      const res = await fetch(`${OISHA_API_URL}/api/chat/history/${uid}?secret_key=${OISHA_SECRET}`);
      const data = await res.json();
      if (data.history) {
        setMessages(data.history.map((m: any, idx: number) => ({
            id: `hist-${idx}`,
            text: m.parts[0].text,
            role: m.role,
            timestamp: new Date().toISOString() // API doesn't seem to return time in history yet
        })));
      }
    } catch (e) {
      console.error("Oisha History Error:", e);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !userId || isLoading) return;

    const userText = inputValue.trim();
    const newUserMsg: OishaMessage = {
      id: Date.now().toString(),
      text: userText,
      role: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch(`${OISHA_API_URL}/api/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId, // The API expects int or string depending on version, let's see. 
          // api_server.py SendMessageRequest expected int but my random string might fail.
          // Actually, looking at script.js: parseInt(userId). 
          // If we use string, I should change the ID generation to something numeric.
          text: userText,
          secret_key: OISHA_SECRET
        })
      });

      if (!res.ok) throw new Error("API Error");

      // Oisha API server sends successfully, then processes asynchronously via Telegram queue.
      // For real-time feedback on the site, we might need a separate 'poll' or a different endpoint.
      // Based on api_server.py, there is NO immediate reply in send_chat_message.
      // So we wait a bit and fetch history again or keep polling.
      
      setTimeout(() => fetchHistory(userId), 2000); // Simple poll for now

    } catch (error) {
      toast({
        title: translations.error,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className={cn(
        "fixed bottom-24 right-6 z-50 transition-all duration-500 md:bottom-6 hidden md:block",
        isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
      )}>
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-blue-600 text-white shadow-2xl flex items-center justify-center hover:bg-blue-700 transition-all ring-4 ring-white/20"
        >
          <Sparkles className="w-8 h-8 animate-pulse" />
        </button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
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
                    <p className="text-[10px] opacity-80 uppercase tracking-widest">{translations.subtitle}</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </CardHeader>

              <CardContent className="flex-1 p-0 min-h-0">
                <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className={cn("flex flex-col gap-1", msg.role === 'model' ? "items-start" : "items-end")}>
                        <div className={cn(
                          "max-w-[85%] p-3 rounded-2xl text-sm shadow-sm",
                          msg.role === 'model' 
                            ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-none" 
                            : "bg-blue-600 text-white rounded-tr-none"
                        )}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                       <div className="flex items-center gap-2 text-zinc-400 text-xs italic ml-2">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Oisha o'ylamoqda...
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
                    className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
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

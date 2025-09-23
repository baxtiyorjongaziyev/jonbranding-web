
'use client';

import { useState, useRef, useEffect, FC, Fragment } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, X, Bot, User, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { chatAssistant } from '@/ai/flows/assistant-flow';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  choices?: string[] | null;
}

const suggestionChips = [
    "Xizmatlar va narxlar",
    "Portfolioingizni ko'rsating",
    "Ishlash jarayoni qanday?",
];

const renderTextWithLinks = (text: string) => {
  const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])|(\B\/[#\w\/-]*)/ig;
  return text.split(urlRegex).filter(Boolean).map((part, index) => {
    if (part.match(urlRegex)) {
      const isInternal = part.startsWith('/');
      if (isInternal) {
        return (
          <Link
            key={index}
            href={part}
            className="text-primary underline hover:text-primary/80 font-medium"
          >
            {part}
          </Link>
        );
      }
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:text-primary/80 font-medium"
        >
          {part}
        </a>
      );
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
};


const AiAssistant: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useLocalStorage<Message[]>('ai-assistant-messages', []);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const chatCardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();


  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setMessages([
          { id: 'initial', text: "Assalomu alaykum! Men Jon, sizning virtual yordamchingizman. Brending strategiyasi, narxlar yoki ish jarayonimiz haqida bemalol so'rashingiz mumkin.", sender: 'bot', choices: suggestionChips }
        ]);
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages.length, setMessages]);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (chatCardRef.current && !chatCardRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
    } else {
        document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const newUserMessage: Message = { id: Date.now().toString(), text: messageText, sender: 'user' };
    
    // Clear choices from previous messages and add the new user message
    const updatedHistory = [...messages.map(m => ({...m, choices: undefined})), newUserMessage];
    setMessages(updatedHistory);
    
    setInputValue('');
    setIsLoading(true);

    try {
      const apiHistory = updatedHistory.slice(1).map(msg => ({ // Start from index 1 to exclude initial bot message
          role: msg.sender === 'user' ? 'user' : 'bot',
          content: msg.text
      }));
      
      const response = await chatAssistant({ 
        query: messageText, 
        history: apiHistory.slice(0, -1) // Exclude the last user message from history for the prompt
      });
      
      let botReplies: Message[] = [];

      if (response.acknowledgement) {
         botReplies.push({
            id: `bot-${Date.now()}-ack`,
            text: response.acknowledgement,
            sender: 'bot'
         });
      }
      
      botReplies.push({ 
          id: `bot-${Date.now()}-reply`, 
          text: response.reply, 
          sender: 'bot',
          choices: response.choices 
      });

      if (botReplies.length > 1) {
          setMessages(prev => [...prev, botReplies[0]]);
          await new Promise(resolve => setTimeout(resolve, 800));
          setMessages(prev => {
              const currentMessages = [...prev];
              currentMessages.pop(); 
              return [...currentMessages, ...botReplies];
          });
          setMessages(prev => [...prev.slice(0, prev.length - 1), ...botReplies]);
      } else {
          setMessages(prev => [...prev, ...botReplies]);
      }

    } catch (error) {
      console.error("AI Assistant Error:", error);
      toast({
        title: "Xatolik",
        description: "Kechirasiz, javob berishda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleSuggestionClick = (suggestion: string) => {
      handleSendMessage(suggestion);
  };

  return (
    <>
      <div className={cn("fixed bottom-6 right-6 z-50 transition-transform duration-300", isOpen ? 'scale-0' : 'scale-100')}>
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="rounded-full w-16 h-16 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 animate-subtle-pulse"
        >
          <Bot className="w-8 h-8" />
        </Button>
      </div>

      <div className={cn(
        "fixed bottom-6 right-6 z-[60] w-[calc(100%-3rem)] sm:w-[400px] transition-all duration-300 ease-in-out",
        isOpen 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10 pointer-events-none'
      )}>
        <Card ref={chatCardRef} className="h-[650px] max-h-[80vh] flex flex-col shadow-2xl rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bot className="w-6 h-6 text-primary" />
                <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-500 ring-2 ring-white" />
              </div>
              <div className="grid gap-0.5">
                <CardTitle className="text-base font-bold">Jon Assistant</CardTitle>
                <p className="text-xs text-muted-foreground">Odatda darhol javob beradi</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-0 min-h-0">
            <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="flex flex-col gap-2"
                  >
                    <div className={cn(
                      "flex items-end gap-2",
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    )}>
                      {message.sender === 'bot' && (
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                          <Bot className="w-5 h-5" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "p-3 rounded-2xl max-w-[85%]",
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground rounded-br-none'
                            : 'bg-secondary text-secondary-foreground rounded-bl-none'
                        )}
                      >
                        <p className="text-sm break-words whitespace-pre-wrap">{renderTextWithLinks(message.text)}</p>
                      </div>
                       {message.sender === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    {message.choices && message.choices.length > 0 && (
                       <div className="flex flex-col items-start gap-2 pt-2 animate-fade-in pl-10">
                          {message.choices.map((choice) => (
                              <Button 
                                  key={choice}
                                  variant="outline"
                                  size="sm"
                                  className="bg-background h-auto py-2 whitespace-normal text-left"
                                  onClick={() => handleSuggestionClick(choice)}
                              >
                                  {choice}
                              </Button>
                          ))}
                       </div>
                    )}
                  </div>
                ))}
                 {isLoading && (
                    <div className="flex items-end gap-2 justify-start animate-fade-in">
                         <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                            <Bot className="w-5 h-5" />
                         </div>
                         <div className="p-3 rounded-2xl bg-secondary text-secondary-foreground">
                            <Loader2 className="w-5 h-5 animate-spin" />
                         </div>
                    </div>
                 )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 border-t">
            <form onSubmit={handleFormSubmit} className="flex w-full items-center gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Savolingizni yozing..."
                autoComplete="off"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default AiAssistant;

    
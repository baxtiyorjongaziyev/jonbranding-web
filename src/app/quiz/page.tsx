
'use client';

import { useState, FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, PartyPopper } from 'lucide-react';
import ContactModal from '@/components/contact-modal';

const questions = [
  {
    question: "Sizning biznesingizning asosiy g'oyasi yoki missiyasi bir jumla bilan ifodalanganmi?",
    options: ["Ha, aniq va hammaga tushunarli", "Qisman, lekin hali to'liq emas", "Yo'q, bu haqida o'ylab ko'rmaganman"],
  },
  {
    question: "Maqsadli auditoriyangizni (ideal mijozingizni) aniq tasavvur qila olasizmi?",
    options: ["Ha, ularning ehtiyojlari va xohishlarini bilaman", "Umumiy tasavvurga egaman", "Yo'q, hammaga sotishga harakat qilaman"],
  },
  {
    question: "Brendingiz raqobatchilardan qanday aniq ustunliklari bilan ajralib turadi?",
    options: ["Kamida 2-3 ta aniq ustunligim bor", "Faqat narx bilan ajralib turaman", "Hech qanday yaqqol ustunligim yo'q"],
  },
  {
    question: "Vizual ko'rinishingiz (logotip, ranglar, dizayn) biznesingiz qadriyatlarini aks ettiradimi?",
    options: ["Ha, to'liq mos keladi", "Qisman, ba'zi elementlarni yangilash kerak", "Yo'q, bunga e'tibor bermaganman"],
  },
  {
    question: "Mijozlaringiz siz haqingizda bir xil va ijobiy fikrdami?",
    options: ["Ha, brendim obro'si mustahkam", "Har xil, ba'zan salbiy fikrlar ham bor", "Bilmayman, so'rov o'tkazmaganman"],
  },
];

type Answers = (string | null)[];

const QuizPage: FC = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(Array(questions.length).fill(null));
  const [isModalOpen, setModalOpen] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[step] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setModalOpen(true);
    }
  };

  const handleFormSubmit = () => {
    // This is called when the contact form inside the modal is submitted successfully
    setModalOpen(false);
    setShowResult(true);
  };

  const progressPercentage = ((step + 1) / questions.length) * 100;
  const isCurrentStepAnswered = answers[step] !== null;

  if (showResult) {
    return (
        <main className="flex-grow bg-secondary/50">
            <section className="py-20 sm:py-28">
                <div className="container mx-auto px-4 text-center">
                     <Card className="max-w-2xl mx-auto p-8 shadow-2xl rounded-3xl animate-fade-in">
                        <PartyPopper className="h-20 w-20 text-primary mx-auto mb-6" />
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-dark-blue">
                            Test uchun rahmat!
                        </h1>
                        <p className="mx-auto mt-4 max-w-xl text-lg text-gray-700">
                            So'rovingiz qabul qilindi. Tez orada siz bilan bog'lanib, testingiz natijalari va brendingizni rivojlantirish bo'yicha shaxsiy tavsiyalarimizni beramiz.
                        </p>
                         <Button onClick={() => window.location.href = '/'} className="mt-8" size="lg">
                            Bosh sahifaga qaytish
                        </Button>
                    </Card>
                </div>
            </section>
             <ContactModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
        </main>
    )
  }

  return (
    <main className="flex-grow bg-secondary/50">
        <section className="py-20 sm:py-28">
            <div className="container mx-auto px-4">
                <Card className="max-w-3xl mx-auto shadow-2xl rounded-3xl">
                    <CardHeader className="p-8">
                        <Progress value={progressPercentage} className="mb-4 h-2" />
                        <CardTitle className="text-2xl sm:text-3xl font-bold text-dark-blue !mt-4">
                            {questions[step].question}
                        </CardTitle>
                        <CardDescription>Savol {step + 1} / {questions.length}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                        <RadioGroup
                            value={answers[step] || ''}
                            onValueChange={handleAnswerChange}
                            className="space-y-4"
                        >
                            {questions[step].options.map((option, index) => (
                                <Label key={index} htmlFor={`q${step}-o${index}`} className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:bg-white transition-colors has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                                    <RadioGroupItem value={option} id={`q${step}-o${index}`} />
                                    <span className="font-medium text-base text-gray-800">{option}</span>
                                </Label>
                            ))}
                        </RadioGroup>
                        <div className="mt-8 text-right">
                            <Button
                                size="lg"
                                onClick={handleNext}
                                disabled={!isCurrentStepAnswered}
                            >
                                {step < questions.length - 1 ? "Keyingisi" : "Natijani bilish"}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
        <ContactModal 
           isOpen={isModalOpen} 
           onClose={() => setModalOpen(false)}
           packageSummary={`Brending-test natijasini so'rash. Javoblar: ${JSON.stringify(answers)}`}
        />
    </main>
  );
};

export default QuizPage;

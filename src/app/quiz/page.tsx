
'use client';

import { useState, FC, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, PartyPopper, Rocket, Shield, TrendingUp } from 'lucide-react';
import ContactModal from '@/components/contact-modal';

const questions = [
  {
    question: "Sizning biznesingizning asosiy g'oyasi yoki missiyasi bir jumla bilan ifodalanganmi?",
    options: [
        { text: "Ha, aniq va hammaga tushunarli", score: 3 }, 
        { text: "Qisman, lekin hali to'liq emas", score: 2 },
        { text: "Yo'q, bu haqida o'ylab ko'rmaganman", score: 1 }
    ],
  },
  {
    question: "Maqsadli auditoriyangizni (ideal mijozingizni) aniq tasavvur qila olasizmi?",
    options: [
        { text: "Ha, ularning ehtiyojlari va xohishlarini bilaman", score: 3 },
        { text: "Umumiy tasavvurga egaman", score: 2 },
        { text: "Yo'q, hammaga sotishga harakat qilaman", score: 1 }
    ],
  },
  {
    question: "Brendingiz raqobatchilardan qanday aniq ustunliklari bilan ajralib turadi?",
    options: [
        { text: "Kamida 2-3 ta aniq ustunligim bor", score: 3 },
        { text: "Faqat narx bilan ajralib turaman", score: 2 },
        { text: "Hech qanday yaqqol ustunligim yo'q", score: 1 }
    ],
  },
  {
    question: "Vizual ko'rinishingiz (logotip, ranglar, dizayn) biznesingiz qadriyatlarini aks ettiradimi?",
    options: [
        { text: "Ha, to'liq mos keladi", score: 3 },
        { text: "Qisman, ba'zi elementlarni yangilash kerak", score: 2 },
        { text: "Yo'q, bunga e'tibor bermaganman", score: 1 }
    ],
  },
  {
    question: "Mijozlaringiz siz haqingizda bir xil va ijobiy fikrdami?",
    options: [
        { text: "Ha, brendim obro'si mustahkam", score: 3 },
        { text: "Har xil, ba'zan salbiy fikrlar ham bor", score: 2 },
        { text: "Bilmayman, so'rov o'tkazmaganman", score: 1 }
    ],
  },
];

type Answer = { text: string; score: number };
type Answers = (Answer | null)[];

const QuizPage: FC = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(Array(questions.length).fill(null));
  const [isModalOpen, setModalOpen] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers];
    const currentQuestion = questions[step];
    const selectedOption = currentQuestion.options.find(opt => opt.text === value);
    if (selectedOption) {
        newAnswers[step] = selectedOption;
    }
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setModalOpen(true);
    }
  };
  
  const totalScore = useMemo(() => {
    return answers.reduce((sum, answer) => sum + (answer?.score || 0), 0);
  }, [answers]);
  
  const resultData = useMemo(() => {
    if (totalScore >= 12) {
      return {
        icon: Rocket,
        title: "Ajoyib! Brendingiz uchishga tayyor!",
        description: "Sizda kuchli poydevor mavjud. Brendingizni keyingi bosqichga olib chiqish va bozor yetakchisiga aylanish uchun bir nechta strategik teginishlar qoldi. Keling, bu imkoniyatlarni birga muhokama qilamiz.",
        color: "text-green-500"
      };
    } else if (totalScore >= 7) {
      return {
        icon: TrendingUp,
        title: "Yaxshi! O'sish uchun imkoniyatlar bor!",
        description: "Siz to'g'ri yo'ldasiz, lekin brendingizning ba'zi jihatlarini kuchaytirish kerak. Biz sizga zaif nuqtalarni aniqlashga va ularni kuchli tomonlarga aylantirishga yordam beramiz.",
         color: "text-yellow-500"
      };
    } else {
      return {
        icon: Shield,
        title: "Poydevorni mustahkamlash vaqti keldi!",
        description: "Brendingiz hozircha himoyasiz. Raqobatda yutqazmaslik va barqaror o'sish uchun shoshilinch ravishda brend strategiyasini ishlab chiqish kerak. Biz sizga noldan mustahkam brend qurishga yordam beramiz.",
         color: "text-red-500"
      };
    }
  }, [totalScore]);


  const handleFormSubmit = () => {
    setModalOpen(false);
    setShowResult(true);
  };

  const progressPercentage = ((step + 1) / questions.length) * 100;
  const isCurrentStepAnswered = answers[step] !== null;
  
  const stringifiedAnswers = useMemo(() => {
      return JSON.stringify(answers.map(a => a?.text));
  }, [answers]);

  if (showResult) {
    const ResultIcon = resultData.icon;
    return (
        <main className="flex-grow bg-secondary/50">
            <section className="py-20 sm:py-28">
                <div className="container mx-auto px-4 text-center">
                     <Card className="max-w-2xl mx-auto p-8 shadow-2xl rounded-3xl animate-fade-in">
                        <ResultIcon className={`h-20 w-20 ${resultData.color} mx-auto mb-6`} />
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-dark-blue">
                           {resultData.title}
                        </h1>
                        <p className="mx-auto mt-4 max-w-xl text-lg text-gray-700">
                           {resultData.description}
                        </p>
                        <p className="font-bold mt-4">Umumiy ball: {totalScore}/{questions.length * 3}</p>
                        <div className="mt-8">
                             <p className="text-base text-gray-800">
                                Batafsil tahlil va shaxsiy tavsiyalar uchun siz bilan tez orada bog'lanamiz!
                             </p>
                             <Button onClick={() => window.location.href = '/'} className="mt-6" size="lg">
                                Bosh sahifaga qaytish
                            </Button>
                        </div>
                    </Card>
                </div>
            </section>
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
                            value={answers[step]?.text || ''}
                            onValueChange={handleAnswerChange}
                            className="space-y-4"
                        >
                            {questions[step].options.map((option, index) => (
                                <Label key={index} htmlFor={`q${step}-o${index}`} className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:bg-white transition-colors has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                                    <RadioGroupItem value={option.text} id={`q${step}-o${index}`} />
                                    <span className="font-medium text-base text-gray-800">{option.text}</span>
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
           onFormSubmitSuccess={handleFormSubmit}
           packageSummary={`Brending-test natijasini so'rash. Javoblar: ${stringifiedAnswers}`}
        />
    </main>
  );
};

export default QuizPage;

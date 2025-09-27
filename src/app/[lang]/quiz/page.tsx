
'use client';

import { useState, FC, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Frown, Meh, Smile } from 'lucide-react';
import ContactModal from '@/components/contact-modal';
import { event as gtagEvent } from '@/lib/gtag';
import Link from 'next/link';

const questions = [
  {
    uz: "Sizning biznesingizning asosiy g'oyasi yoki missiyasi bir jumla bilan ifodalanganmi?",
    ru: "Выражена ли основная идея или миссия вашего бизнеса в одном предложении?",
    options: {
      uz: [
          { text: "Ha, aniq va hammaga tushunarli", score: 3 }, 
          { text: "Qisman, lekin hali to'liq emas", score: 2 },
          { text: "Yo'q, bu haqida o'ylab ko'rmaganman", score: 1 }
      ],
      ru: [
          { text: "Да, четко и понятно для всех", score: 3 },
          { text: "Частично, но еще не полностью", score: 2 },
          { text: "Нет, не задумывался об этом", score: 1 }
      ]
    }
  },
  {
    uz: "Maqsadli auditoriyangizni (ideal mijozingizni) aniq tasavvur qila olasizmi?",
    ru: "Можете ли вы четко представить свою целевую аудиторию (идеального клиента)?",
    options: {
      uz: [
          { text: "Ha, ularning ehtiyojlari va xohishlarini bilaman", score: 3 },
          { text: "Umumiy tasavvurga egaman", score: 2 },
          { text: "Yo'q, hammaga sotishga harakat qilaman", score: 1 }
      ],
      ru: [
          { text: "Да, я знаю их потребности и желания", score: 3 },
          { text: "У меня есть общее представление", score: 2 },
          { text: "Нет, я пытаюсь продавать всем", score: 1 }
      ]
    }
  },
  {
    uz: "Brendingiz raqobatchilardan qanday aniq ustunliklari bilan ajralib turadi?",
    ru: "Какими конкретными преимуществами ваш бренд отличается от конкурентов?",
    options: {
      uz: [
          { text: "Kamida 2-3 ta aniq ustunligim bor", score: 3 },
          { text: "Faqat narx bilan ajralib turaman", score: 2 },
          { text: "Hech qanday yaqqol ustunligim yo'q", score: 1 }
      ],
      ru: [
          { text: "У меня есть как минимум 2-3 конкретных преимущества", score: 3 },
          { text: "Я отличаюсь только ценой", score: 2 },
          { text: "У меня нет явных преимуществ", score: 1 }
      ]
    }
  },
  {
    uz: "Vizual ko'rinishingiz (logotip, ranglar, dizayn) biznesingiz qadriyatlarini aks ettiradimi?",
    ru: "Отражает ли ваш визуальный облик (логотип, цвета, дизайн) ценности вашего бизнеса?",
    options: {
      uz: [
          { text: "Ha, to'liq mos keladi", score: 3 },
          { text: "Qisman, ba'zi elementlarni yangilash kerak", score: 2 },
          { text: "Yo'q, bunga e'tibor bermaganman", score: 1 }
      ],
      ru: [
          { text: "Да, полностью соответствует", score: 3 },
          { text: "Частично, некоторые элементы нужно обновить", score: 2 },
          { text: "Нет, я не обращал на это внимания", score: 1 }
      ]
    }
  },
  {
    uz: "Mijozlaringiz siz haqingizda bir xil va ijobiy fikrdami?",
    ru: "Придерживаются ли ваши клиенты единого и положительного мнения о вас?",
    options: {
      uz: [
          { text: "Ha, brendim obro'si mustahkam", score: 3 },
          { text: "Har xil, ba'zan salbiy fikrlar ham bor", score: 2 },
          { text: "Bilmayman, so'rov o'tkazmaganman", score: 1 }
      ],
      ru: [
          { text: "Да, репутация моего бренда прочна", score: 3 },
          { text: "По-разному, иногда бывают и негативные отзывы", score: 2 },
          { text: "Не знаю, я не проводил опрос", score: 1 }
      ]
    }
  },
];

type Answer = { text: string; score: number };
type Answers = (Answer | null)[];

const resultData = {
    uz: {
        bad: {
            icon: Frown,
            title: "Sizga yordam kerak (5-8 ball)",
            description: "Brendingiz poydevori zaif. Raqobatchilardan ajralib turish va mijozlar mehrini qozonish uchun sizga shubhasiz professional yordam kerak. Keling, buni birgalikda to'g'rilaymiz!",
            className: 'text-red-500'
        },
        medium: {
            icon: Meh,
            title: "Yaxshi potentsial, lekin bo'shliqlar bor (9-12 ball)",
            description: "Sizda yaxshi poydevor bor, lekin brendingiz yanada kuchliroq va samaraliroq bo'lishi mumkin. Keling, mavjud bo'shliqlarni to'ldirib, biznesingizni yangi bosqichga olib chiqamiz.",
            className: 'text-yellow-500'
        },
        good: {
            icon: Smile,
            title: "Ajoyib! Brendingiz poydevori mustahkam (13-15 ball)",
            description: "Tabriklaymiz! Siz brending borasida to'g'ri yo'ldasiz. Endi bu poydevorni yanada mustahkamlab, bozor yetakchisiga aylanish vaqti keldi. Biz sizga bu yo'lda yordam beramiz.",
            className: 'text-green-500'
        },
        afterSubmitText: "Tez orada mutaxassisimiz siz bilan bog'lanib, testingiz natijalari bo'yicha batafsil tahlil va shaxsiy tavsiyalar beradi.",
        backToHome: "Bosh sahifaga qaytish"
    },
    ru: {
        bad: {
            icon: Frown,
            title: "Вам нужна помощь (5-8 баллов)",
            description: "Фундамент вашего бренда слаб. Чтобы выделиться среди конкурентов и завоевать лояльность клиентов, вам, несомненно, нужна профессиональная помощь. Давайте исправим это вместе!",
            className: 'text-red-500'
        },
        medium: {
            icon: Meh,
            title: "Хороший потенциал, но есть пробелы (9-12 баллов)",
            description: "У вас хороший фундамент, но ваш бренд может быть еще сильнее и эффективнее. Давайте заполним существующие пробелы и выведем ваш бизнес на новый уровень.",
            className: 'text-yellow-500'
        },
        good: {
            icon: Smile,
            title: "Отлично! Фундамент вашего бренда прочен (13-15 баллов)",
            description: "Поздравляем! Вы на правильном пути в вопросах брендинга. Теперь пришло время укрепить этот фундамент и стать лидером рынка. Мы поможем вам в этом.",
            className: 'text-green-500'
        },
        afterSubmitText: "В ближайшее время наш специалист свяжется с вами для подробного анализа результатов вашего теста и предоставления личных рекомендаций.",
        backToHome: "Вернуться на главную"
    }
};

const QuizPage: FC<{ params: { lang: string } }> = ({ params: { lang } }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(Array(questions.length).fill(null));
  const [isModalOpen, setModalOpen] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [packageSummary, setPackageSummary] = useState('');
  
  const translations = lang === 'ru' ? resultData.ru : resultData.uz;
  const currentLang = lang as 'uz' | 'ru';

  const totalScore = useMemo(() => {
    return answers.reduce((acc, curr) => acc + (curr?.score || 0), 0);
  }, [answers]);

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers];
    const currentQuestion = questions[step];
    const selectedOption = currentQuestion.options[currentLang].find(opt => opt.text === value);
    if (selectedOption) {
        newAnswers[step] = selectedOption;
    }
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      const answerTexts = answers.map((a, index) => a ? `S${index+1}: ${a.text}` : null).filter(Boolean) as string[];
      const summaryLabel = currentLang === 'ru' ? 'Результат бренд-теста' : 'Brending-test natijasi';
      const answersLabel = currentLang === 'ru' ? 'Ответы' : 'Javoblar';
      const scoreLabel = currentLang === 'ru' ? 'Баллы' : 'Ball';
      const summary = `${summaryLabel}. ${answersLabel}: ${JSON.stringify(answerTexts)} | ${scoreLabel}: ${totalScore}`;
      setPackageSummary(summary);
      setModalOpen(true);
    }
  };

  const handleFormSubmit = () => {
    setModalOpen(false);
    setShowResult(true);
    // Trigger Google Analytics event
    gtagEvent('form_submit', {
      'event_category': 'Quiz',
      'event_label': 'Branding Quiz',
      'value': totalScore
    });
  };

  const progressPercentage = ((step + 1) / questions.length) * 100;
  const isCurrentStepAnswered = answers[step] !== null;

  if (showResult) {
      const resultKey = totalScore <= 8 ? 'bad' : totalScore <= 12 ? 'medium' : 'good';
      const result = translations[resultKey];
      const Icon = result.icon;

    return (
        <main className="flex-grow bg-secondary/50">
            <section className="py-20 sm:py-28">
                <div className="container mx-auto px-4 text-center">
                     <Card className="max-w-2xl mx-auto p-8 shadow-2xl rounded-3xl animate-fade-in">
                        <Icon className={`h-20 w-20 ${result.className} mx-auto mb-6`} />
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-dark-blue">
                           {result.title}
                        </h1>
                        <p className="mx-auto mt-4 max-w-xl text-lg text-gray-700">
                           {result.description}
                        </p>
                         <p className="mx-auto mt-4 max-w-xl text-lg text-gray-700 font-bold">
                           {translations.afterSubmitText}
                        </p>
                        <div className="mt-8">
                             <Button asChild className="mt-6" size="lg">
                                <Link href={`/${lang}`}>{translations.backToHome}</Link>
                            </Button>
                        </div>
                    </Card>
                </div>
            </section>
        </main>
    )
  }

  const currentQuestion = questions[step];
  const questionText = currentQuestion[currentLang];
  const questionOptions = currentQuestion.options[currentLang];
  const questionLabel = currentLang === 'ru' ? `Вопрос ${step + 1} / ${questions.length}` : `Savol ${step + 1} / ${questions.length}`;
  const nextButtonText = currentLang === 'ru' ? (step < questions.length - 1 ? "Далее" : "Узнать результат") : (step < questions.length - 1 ? "Keyingisi" : "Natijani bilish");

  return (
    <main className="flex-grow bg-secondary/50">
        <section className="py-20 sm:py-28">
            <div className="container mx-auto px-4">
                <Card className="max-w-3xl mx-auto shadow-2xl rounded-3xl">
                    <CardHeader className="p-8">
                        <Progress value={progressPercentage} className="mb-4 h-2" />
                        <CardTitle className="text-2xl sm:text-3xl font-bold text-dark-blue !mt-4">
                            {questionText}
                        </CardTitle>
                        <CardDescription>{questionLabel}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                        <RadioGroup
                            value={answers[step]?.text || ''}
                            onValueChange={handleAnswerChange}
                            className="space-y-4"
                        >
                            {questionOptions.map((option, index) => (
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
                                {nextButtonText}
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
           packageSummary={packageSummary}
           lang={lang}
        />
    </main>
  );
};

export default QuizPage;

    
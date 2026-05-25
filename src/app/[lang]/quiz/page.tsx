
'use client';

import { useState, FC, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Frown, Meh, Smile, Lightbulb } from 'lucide-react';
import ContactModal from '@/components/contact-modal';
import { event as gtagEvent } from '@/lib/gtag';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { Skeleton } from '@/components/ui/skeleton';

type Answer = { text: string; score: number };
type Answers = (Answer | null)[];

const QuizPage: FC = () => {
  const params = useParams();
  const lang = params.lang as Locale;
  const [translations, setTranslations] = useState<any>(null);
  
  const [step, setStep] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [packageSummary, setPackageSummary] = useState('');

  useEffect(() => {
    getDictionary(lang).then(dict => setTranslations(dict.quiz));
  }, [lang]);

  const questions = translations?.questions || [];
  const [answers, setAnswers] = useState<Answers>(Array(questions.length).fill(null));

  useEffect(() => {
    setAnswers(Array(questions.length).fill(null));
  }, [questions.length]);

  const totalScore = useMemo(() => {
    return answers.reduce((acc, curr) => acc + (curr?.score || 0), 0);
  }, [answers]);

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers];
    const currentQuestion = questions[step];
    const selectedOption = currentQuestion.options.find((opt: any) => opt.text === value);
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
      const summaryLabel = lang === 'ru' ? 'Результат бренд-теста' : (lang === 'en' ? 'Brand Test Result' : 'Brending-test natijasi');
      const answersLabel = lang === 'ru' ? 'Ответы' : (lang === 'en' ? 'Answers' : 'Javoblar');
      const scoreLabel = lang === 'ru' ? 'Баллы' : (lang === 'en' ? 'Score' : 'Ball');
      const summary = `${summaryLabel}. ${answersLabel}: ${JSON.stringify(answerTexts)} | ${scoreLabel}: ${totalScore}`;
      setPackageSummary(summary);
      setModalOpen(true);
    }
  };

  const handleFormSubmit = () => {
    setModalOpen(false);
    setShowResult(true);
    gtagEvent('form_submit', {
      'event_category': 'Quiz',
      'event_label': 'Branding Quiz',
      'value': totalScore
    });
  };

  if (!translations) {
      return <main className="flex-grow bg-secondary/50"><section className="py-20 sm:py-28"><Skeleton className="h-96 w-full container" /></section></main>
  }
  
  const progressPercentage = ((step + 1) / questions.length) * 100;
  const isCurrentStepAnswered = answers[step] !== null;

  if (showResult) {
      const resultKey = totalScore <= 8 ? 'bad' : totalScore <= 12 ? 'medium' : 'good';
      const result = translations.result[resultKey];
      const Icon = resultKey === 'bad' ? Frown : resultKey === 'medium' ? Meh : Smile;
      
      // Generate personalized recommendations
      const getRecommendations = () => {
        const recommendations = [];
        if (resultKey === 'bad') {
          recommendations.push(lang === 'uz' ? 'Faqat brend-auditni boshlab yuboring va sizning brendingdagi barcha muammolarni aniqlang' : lang === 'ru' ? 'Начните с полного аудита бренда, чтобы выявить все проблемы' : 'Start with a full brand audit to identify all brand issues');
          recommendations.push(lang === 'uz' ? 'Brend-strategiya yaratish zarur - bu sizning brendingizning xaritasi' : lang === 'ru' ? 'Разработайте бренд-стратегию - она станет картой вашего бренда' : 'Develop a brand strategy - it will be your brand roadmap');
          recommendations.push(lang === 'uz' ? 'Kompaniya imijini qayta qurish - premium darajaga ko\'tarish uchun muhim qadami' : lang === 'ru' ? 'Переделайте корпоративную идентичность для премиум-позиционирования' : 'Rebuild corporate identity for premium positioning');
        } else if (resultKey === 'medium') {
          recommendations.push(lang === 'uz' ? 'Brendingiz yaxshi, lekin hali 3-4 ta muhim nuqta bor' : lang === 'ru' ? 'Ваш бренд хорош, но есть 3-4 критических области' : 'Your brand is good, but there are 3-4 critical areas');
          recommendations.push(lang === 'uz' ? 'Logotip yoki qadoqni yangilab yuboring - vizual o\'ziga xoslikni kuchaytirib olasiz' : lang === 'ru' ? 'Обновите логотип или упаковку - усилите визуальное различие' : 'Refresh logo or packaging - strengthen visual differentiation');
          recommendations.push(lang === 'uz' ? 'Firma uslubini standartlashtirib qo\'ying - barcha kontentda yagona xirmo' : lang === 'ru' ? 'Стандартизируйте фирменный стиль - единство во всех каналах' : 'Standardize corporate style - consistency across all channels');
        } else {
          recommendations.push(lang === 'uz' ? 'Sizning brending juda kuchli - shuning uchun bozorga samarali kirib borish yo\'li loyihasiga e\'tibor bering' : lang === 'ru' ? 'Ваш бренд очень сильный - сосредоточьтесь на запуске на рынке' : 'Your brand is very strong - focus on market launch strategy');
          recommendations.push(lang === 'uz' ? 'Brendbook yaratish - vizual kengaytirishdagi barcha qoidalar va yo\'nalishlarni belgilang' : lang === 'ru' ? 'Создайте брендбук - зафиксируйте все правила визуального развития' : 'Create a brandbook - fix all visual development rules');
          recommendations.push(lang === 'uz' ? 'Sotuvchi qadoq dizayni - sizning premium imijingizni paketdagi raqiblardan farq qiling' : lang === 'ru' ? 'Дизайн продающей упаковки - отличайтесь прямо на полке' : 'Sales-focused packaging - differentiate directly on shelf');
        }
        return recommendations;
      };

    return (
        <main className="flex-grow bg-secondary/50">
            <section className="py-20 sm:py-28">
                <div className="container mx-auto px-4">
                     <Card className="max-w-3xl mx-auto p-8 shadow-2xl rounded-3xl animate-fade-in">
                        <div className="text-center mb-8">
                          <Icon className={`h-20 w-20 ${resultKey === 'bad' ? 'text-red-500' : resultKey === 'medium' ? 'text-yellow-500' : 'text-green-500'} mx-auto mb-6`} />
                          <h1 className="text-3xl sm:text-4xl font-extrabold text-dark-blue">
                             {result.title}
                          </h1>
                          <div className="mt-4 inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full text-2xl font-bold">
                            {totalScore} / 15 {lang === 'uz' ? 'ball' : lang === 'ru' ? 'баллов' : 'points'}
                          </div>
                        </div>
                        
                        <p className="mx-auto mt-6 max-w-xl text-lg text-gray-700">
                           {result.description}
                        </p>
                        
                        <div className="mt-8 space-y-3">
                          <h3 className="font-bold text-lg text-dark-blue">{lang === 'uz' ? 'Tavsiyalar:' : lang === 'ru' ? 'Рекомендации:' : 'Recommendations:'}</h3>
                          <ul className="space-y-2">
                            {getRecommendations().map((rec, idx) => (
                              <li key={idx} className="flex gap-3 p-3 bg-blue-50 rounded-lg">
                                <span className="text-blue-600 font-bold flex-shrink-0">{idx + 1}.</span>
                                <span className="text-gray-700">{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                         <p className="mx-auto mt-6 max-w-xl text-base text-gray-600">
                           {translations.result.afterSubmitText}
                        </p>
                        <div className="mt-8 flex flex-col gap-4">
                             <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                                <Link href={`/${lang}/xizmatlar`}>{lang === 'uz' ? 'Xizmatlarni ko\'rish' : lang === 'ru' ? 'Услуги' : 'View Services'}</Link>
                            </Button>
                             <Button asChild variant="outline" size="lg">
                                <Link href={`/${lang}`}>{translations.result.backToHome}</Link>
                            </Button>
                        </div>
                    </Card>
                </div>
            </section>
        </main>
    )
  }

  const currentQuestion = questions[step];
  const questionLabel = translations.questionLabel.replace('{step}', step + 1).replace('{total}', questions.length);
  const nextButtonText = step < questions.length - 1 ? translations.nextButton : translations.resultButton;

  return (
    <main className="flex-grow bg-secondary/50">
        <section className="py-20 sm:py-28">
            <div className="container mx-auto px-4">
                <Card className="max-w-3xl mx-auto shadow-2xl rounded-3xl">
                    <CardHeader className="p-8">
                        <Progress value={progressPercentage} className="mb-4 h-2" />
                        <CardTitle className="text-2xl sm:text-3xl font-bold text-dark-blue !mt-4">
                            {currentQuestion.question}
                        </CardTitle>
                        <CardDescription>{questionLabel}</CardDescription>
                         {currentQuestion.brandExample && (
                            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                                <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-amber-700">{translations.exampleTitle}</h4>
                                    <p className="text-sm text-amber-600">{currentQuestion.brandExample}</p>
                                </div>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                        <RadioGroup
                            value={answers[step]?.text || ''}
                            onValueChange={handleAnswerChange}
                            className="space-y-4"
                        >
                            {currentQuestion.options.map((option: any, index: number) => (
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

'use client';

import { FC, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { HoneypotField } from '@/components/ui/honeypot-field';
import { generateEventId, getGaClientId, trackEvent, trackLead } from '@/lib/analytics';
import {
  createEmptyAnswerSheet,
  DIAGNOSTIC_QUESTIONS,
  DIAGNOSTIC_RESULTS,
  isAnswerSheetComplete,
  NO_GAPS_RESULT,
  resolveSource,
  resolveUtmParams,
  scoreDiagnostic,
  SERVICES,
  TOTAL_QUESTIONS,
  type AnswerSheet,
  type OptionKey,
} from '@/lib/diagnostics';
import {
  isValidPhone,
  isValidTelegramUsername,
  normalizePhone,
  normalizeTelegramUsername,
} from '@/lib/lead-contact';

const TELEGRAM_URL = 'https://t.me/jonbranding';

type Stage = 'intro' | 'questions' | 'contact' | 'result';

type ContactForm = {
  fullName: string;
  companyName: string;
  industry: string;
  contact: string;
  consent: boolean;
  /** Bot tuzog'i — foydalanuvchi ko'rmaydi, serverda tekshiriladi. */
  companyWebsite: string;
};

const EMPTY_CONTACT: ContactForm = {
  fullName: '',
  companyName: '',
  industry: '',
  contact: '',
  consent: false,
  companyWebsite: '',
};

function isContactValid(value: string) {
  return isValidPhone(normalizePhone(value)) || isValidTelegramUsername(normalizeTelegramUsername(value));
}

const DiagnosticsClient: FC = () => {
  const params = useParams();
  const lang = (params?.lang as string) || 'uz';
  const searchParams = useSearchParams();

  const [stage, setStage] = useState<Stage>('intro');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerSheet>(createEmptyAnswerSheet);
  const [form, setForm] = useState<ContactForm>(EMPTY_CONTACT);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [isSubmitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const headingRef = useRef<HTMLHeadingElement>(null);
  const openedTracked = useRef(false);

  // ?source= va UTM'lar sahifa ochilganda o'qiladi va yakuniy yuborishgacha saqlanadi.
  const source = useMemo(() => resolveSource(searchParams), [searchParams]);
  const utm = useMemo(() => resolveUtmParams(searchParams), [searchParams]);

  const scoring = useMemo(() => scoreDiagnostic(answers), [answers]);
  // Bo'shliq topilmasa ro'yxat bo'sh qoladi, shuning uchun alohida matn kerak.
  const result = scoring.gaps.length
    ? DIAGNOSTIC_RESULTS[scoring.resultCategory]
    : NO_GAPS_RESULT;

  useEffect(() => {
    if (openedTracked.current) return;
    openedTracked.current = true;
    trackEvent({ action: 'diagnostic_opened', category: 'Diagnostic', label: source, source });
  }, [source]);

  // Bosqich almashganda fokusni sarlavhaga qaytaramiz — skrinrider uchun.
  useEffect(() => {
    if (stage === 'intro') return;
    headingRef.current?.focus();
  }, [stage, step]);

  const handleStart = () => {
    trackEvent({ action: 'diagnostic_started', category: 'Diagnostic', label: source, source });
    setStage('questions');
    setStep(0);
  };

  const handleSelect = useCallback(
    (value: string) => {
      setAnswers((previous) => {
        const next = [...previous];
        next[step] = value as OptionKey;
        return next;
      });
    },
    [step]
  );

  const handleNext = () => {
    const answer = answers[step];
    if (!answer) return;

    trackEvent({
      action: 'diagnostic_question_completed',
      category: 'Diagnostic',
      label: `q${step + 1}`,
      question_index: step + 1,
      answer_key: answer,
      source,
    });

    if (step < TOTAL_QUESTIONS - 1) {
      setStep(step + 1);
      return;
    }
    setStage('contact');
  };

  const handleBack = () => {
    if (stage === 'contact') {
      setStage('questions');
      setStep(TOTAL_QUESTIONS - 1);
      return;
    }
    if (step > 0) {
      setStep(step - 1);
      return;
    }
    setStage('intro');
  };

  const validateForm = () => {
    const nextErrors: Partial<Record<keyof ContactForm, string>> = {};
    if (form.fullName.trim().length < 2) nextErrors.fullName = 'Ismingizni kiriting';
    if (!isContactValid(form.contact)) {
      nextErrors.contact = "Telefon raqami (+998 90 123 45 67) yoki Telegram username (@username) kiriting";
    }
    if (!form.consent) nextErrors.consent = 'Davom etish uchun rozilik kerak';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (submitEvent: FormEvent) => {
    submitEvent.preventDefault();
    setSubmitError('');
    if (!validateForm()) return;
    if (!isAnswerSheetComplete(answers)) {
      setStage('questions');
      setStep(answers.findIndex((answer) => answer === null));
      return;
    }

    setSubmitting(true);
    const eventId = generateEventId('diagnostic');

    trackEvent({
      action: 'diagnostic_contact_submitted',
      category: 'Diagnostic',
      label: source,
      source,
      event_id: eventId,
    });

    try {
      const response = await fetch('/api/diagnostics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          companyName: form.companyName.trim(),
          industry: form.industry.trim(),
          contact: form.contact.trim(),
          consent: form.consent,
          answers,
          source,
          pageUrl: typeof window !== 'undefined' ? window.location.href : '',
          utmSource: utm.utm_source,
          utmMedium: utm.utm_medium,
          utmCampaign: utm.utm_campaign,
          eventId,
          gaClientId: getGaClientId(),
          companyWebsite: form.companyWebsite,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || `HTTP ${response.status}`);
      }

      trackLead({ source: `diagnostic:${source}`, eventId, value: scoring.totalScore, serverTracked: true });
      trackEvent({
        action: 'diagnostic_completed',
        category: 'Diagnostic',
        label: source,
        value: scoring.totalScore,
        source,
        event_id: eventId,
      });
      setStage('result');
    } catch (error) {
      // Server xabarlari o'zbekcha va foydalanuvchiga mo'ljallangan (masalan
      // rate-limit yoki validatsiya). Network xatosida umumiy matn qoladi.
      setSubmitError(
        error instanceof Error && error.message && !/^HTTP \d+$/.test(error.message)
          ? error.message
          : "Yuborishda xatolik yuz berdi. Yana bir bor urinib ko'ring."
      );
      console.error('Diagnostic submit failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCtaClick = (ctaLabel: string) => {
    trackEvent({
      action: 'diagnostic_cta_clicked',
      category: 'Diagnostic',
      label: ctaLabel,
      cta: ctaLabel,
      source,
      value: scoring.totalScore,
    });
  };

  const currentQuestion = DIAGNOSTIC_QUESTIONS[step];
  const progressValue = ((step + 1) / TOTAL_QUESTIONS) * 100;

  return (
    <main className="flex-grow bg-secondary/50">
      <section className="py-10 sm:py-20">
        <div className="container mx-auto px-4">
          {stage === 'intro' && (
            <Card className="mx-auto max-w-2xl rounded-3xl p-6 text-center shadow-2xl sm:p-10">
              <span className="mx-auto inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Brend diagnostikasi
              </span>
              <h1 className="mt-5 text-3xl font-extrabold text-dark-blue sm:text-4xl">
                Biznesingiz brendi o‘sishga tayyormi?
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-lg text-gray-700">
                7 ta savolga javob bering va 2 daqiqada brendingizdagi asosiy o‘sish nuqtasini aniqlang.
              </p>
              <p className="mx-auto mt-3 max-w-xl text-base text-gray-600">
                Natijada biznesingizning hozirgi bosqichi va birinchi navbatda nimalarga e’tibor berishingiz
                kerakligini bilib olasiz.
              </p>
              <Button
                size="lg"
                onClick={handleStart}
                className="mt-8 h-14 w-full rounded-full text-base font-bold sm:w-auto"
              >
                Diagnostikani boshlash
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
            </Card>
          )}

          {stage === 'questions' && currentQuestion && (
            <Card className="mx-auto max-w-3xl rounded-3xl shadow-2xl">
              <CardHeader className="p-5 sm:p-8">
                <Progress
                  value={progressValue}
                  className="h-2"
                  aria-label={`Diagnostika jarayoni: ${step + 1} / ${TOTAL_QUESTIONS}`}
                />
                <CardDescription className="!mt-4 font-semibold text-primary">
                  {step + 1}/{TOTAL_QUESTIONS}
                </CardDescription>
                <CardTitle
                  ref={headingRef}
                  tabIndex={-1}
                  className="!mt-2 text-2xl font-bold text-dark-blue outline-none sm:text-3xl"
                >
                  {currentQuestion.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 sm:p-8 sm:pt-0">
                <RadioGroup
                  value={answers[step] ?? ''}
                  onValueChange={handleSelect}
                  className="space-y-3"
                  aria-label={currentQuestion.question}
                >
                  {currentQuestion.options.map((option) => (
                    <Label
                      key={option.key}
                      htmlFor={`q${step}-${option.key}`}
                      className="press-effect flex min-h-[56px] cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors hover:bg-white has-[:checked]:border-primary has-[:checked]:bg-primary/10 active:scale-[0.99]"
                    >
                      <RadioGroupItem value={option.key} id={`q${step}-${option.key}`} />
                      <span className="text-base font-medium text-gray-800">{option.text}</span>
                    </Label>
                  ))}
                </RadioGroup>

                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={handleBack}
                    className="h-12 rounded-full text-base"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" aria-hidden="true" />
                    Orqaga
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    onClick={handleNext}
                    disabled={!answers[step]}
                    className="h-12 rounded-full text-base font-bold"
                  >
                    Davom etish
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {stage === 'contact' && (
            <Card className="mx-auto max-w-2xl rounded-3xl shadow-2xl">
              <CardHeader className="p-5 sm:p-8">
                <Progress value={100} className="h-2" aria-label="Diagnostika jarayoni: yakuniy bosqich" />
                <CardTitle
                  ref={headingRef}
                  tabIndex={-1}
                  className="!mt-4 text-2xl font-bold text-dark-blue outline-none sm:text-3xl"
                >
                  Natijangiz tayyor
                </CardTitle>
                <CardDescription className="!mt-2 text-base">
                  Tavsiyani sizga moslashtirish uchun bir necha ma’lumot qoldiring.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 sm:p-8 sm:pt-0">
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <HoneypotField
                    value={form.companyWebsite}
                    onChange={(value) => setForm((prev) => ({ ...prev, companyWebsite: value }))}
                  />
                  <div className="space-y-2">
                    <Label htmlFor="diagnostic-name">Ism *</Label>
                    <Input
                      id="diagnostic-name"
                      value={form.fullName}
                      onChange={(inputEvent) => setForm((prev) => ({ ...prev, fullName: inputEvent.target.value }))}
                      autoComplete="name"
                      required
                      aria-invalid={Boolean(errors.fullName)}
                      aria-describedby={errors.fullName ? 'diagnostic-name-error' : undefined}
                      className="h-12"
                    />
                    {errors.fullName && (
                      <p id="diagnostic-name-error" role="alert" className="text-sm text-destructive">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diagnostic-company">Kompaniya yoki biznes nomi</Label>
                    <Input
                      id="diagnostic-company"
                      value={form.companyName}
                      onChange={(inputEvent) => setForm((prev) => ({ ...prev, companyName: inputEvent.target.value }))}
                      autoComplete="organization"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diagnostic-industry">Faoliyat sohasi</Label>
                    <Input
                      id="diagnostic-industry"
                      value={form.industry}
                      onChange={(inputEvent) => setForm((prev) => ({ ...prev, industry: inputEvent.target.value }))}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diagnostic-contact">Telefon raqami yoki Telegram username *</Label>
                    <Input
                      id="diagnostic-contact"
                      value={form.contact}
                      onChange={(inputEvent) => setForm((prev) => ({ ...prev, contact: inputEvent.target.value }))}
                      placeholder="+998 90 123 45 67 yoki @username"
                      autoComplete="tel"
                      required
                      aria-invalid={Boolean(errors.contact)}
                      aria-describedby={errors.contact ? 'diagnostic-contact-error' : undefined}
                      className="h-12"
                    />
                    {errors.contact && (
                      <p id="diagnostic-contact-error" role="alert" className="text-sm text-destructive">
                        {errors.contact}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="diagnostic-consent"
                        checked={form.consent}
                        onCheckedChange={(checked) => setForm((prev) => ({ ...prev, consent: checked === true }))}
                        aria-invalid={Boolean(errors.consent)}
                        aria-describedby={errors.consent ? 'diagnostic-consent-error' : undefined}
                        className="mt-0.5 h-5 w-5"
                      />
                      <Label htmlFor="diagnostic-consent" className="cursor-pointer text-sm font-normal leading-relaxed">
                        Javoblarim asosida tavsiya olishga va men bilan bog‘lanishlariga roziman *
                      </Label>
                    </div>
                    {errors.consent && (
                      <p id="diagnostic-consent-error" role="alert" className="text-sm text-destructive">
                        {errors.consent}
                      </p>
                    )}
                  </div>

                  {submitError && (
                    <p role="alert" className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                      {submitError}
                    </p>
                  )}

                  <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={handleBack}
                      disabled={isSubmitting}
                      className="h-12 rounded-full text-base"
                    >
                      <ArrowLeft className="mr-2 h-5 w-5" aria-hidden="true" />
                      Orqaga
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="h-12 rounded-full text-base font-bold"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                          Yuborilmoqda…
                        </>
                      ) : (
                        <>
                          Natijani ko‘rish
                          <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {stage === 'result' && (
            <Card className="mx-auto max-w-2xl animate-fade-in rounded-3xl p-6 shadow-2xl sm:p-10">
              <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" aria-hidden="true" />
              <h1
                ref={headingRef}
                tabIndex={-1}
                className="mt-6 text-center text-3xl font-extrabold text-dark-blue outline-none sm:text-4xl"
              >
                {result.title}
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-center text-lg text-gray-700">{result.description}</p>

              {scoring.gaps.length > 0 && (
                <ol className="mt-8 space-y-4">
                  {scoring.gaps.map((gap, index) => (
                    <li
                      key={gap}
                      className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-5"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="text-lg font-bold text-dark-blue">{SERVICES[gap].label}</h3>
                        <p className="mt-1 text-base text-gray-700">{SERVICES[gap].what}</p>
                        <p className="mt-2 text-sm text-gray-600">{SERVICES[gap].why}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}

              <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <h2 className="text-sm font-bold uppercase tracking-wide text-primary">Tavsiya</h2>
                <p className="mt-2 text-base text-gray-800">{result.advice}</p>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <Button
                  asChild
                  size="lg"
                  onClick={() => handleCtaClick('free_brand_audit')}
                  className="h-14 rounded-full text-base font-bold"
                >
                  <Link href={`/${lang}/aloqa`}>15 daqiqalik bepul brend tahlilini olish</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  onClick={() => handleCtaClick('telegram_result')}
                  className="h-14 rounded-full text-base font-semibold"
                >
                  <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
                    <Send className="mr-2 h-5 w-5" aria-hidden="true" />
                    Natijani Telegram orqali olish
                  </a>
                </Button>
              </div>
            </Card>
          )}
        </div>
      </section>
    </main>
  );
};

export default DiagnosticsClient;

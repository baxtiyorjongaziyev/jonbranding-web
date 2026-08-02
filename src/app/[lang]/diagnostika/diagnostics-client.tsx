'use client';

import { FC, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
  indexOfQuestion,
  isAnswerSheetComplete,
  resolveSegment,
  resolveSource,
  resolveUtmParams,
  scoreDiagnostic,
  visibleQuestions,
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

type DiagnosticsDictionary = {
  ui: Record<string, string>;
  services: Record<string, { label: string; what: string; why: string }>;
  questions: Record<string, { question: string; hint?: string; options: Record<OptionKey, string> }>;
  results: Record<string, { title: string; description: string; advice: string }>;
  noGaps: { title: string; description: string; advice: string };
};

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

const DiagnosticsClient: FC<{ dictionary: DiagnosticsDictionary; lang: string }> = ({ dictionary, lang }) => {
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
  const result = scoring.gaps.length ? dictionary.results[scoring.resultCategory] : dictionary.noGaps;

  /**
   * Ko'rsatiladigan savollar bosqichga bog'liq. Birinchi savolga javob
   * berilgunicha ro'yxatda faqat o'sha savol turadi.
   */
  const visible = useMemo(() => visibleQuestions(scoring.segment), [scoring.segment]);

  /**
   * Mijoz orqaga qaytib bosqichni o'zgartirsa, yangi ro'yxat qisqaroq
   * bo'lishi mumkin — qadam chegaradan chiqib ketmasligi uchun qisqartiramiz.
   */
  const safeStep = Math.min(step, Math.max(visible.length - 1, 0));
  const baseQuestion = visible[safeStep];
  const currentQuestion = useMemo(() => {
    if (!baseQuestion) return undefined;
    const copy = dictionary.questions[String(baseQuestion.id)];
    if (!copy) return baseQuestion;
    return {
      ...baseQuestion,
      question: copy.question,
      hint: copy.hint,
      options: baseQuestion.options.map((option) => ({ ...option, text: copy.options[option.key] })),
    };
  }, [baseQuestion, dictionary]);

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
      if (!currentQuestion) return;
      setAnswers((previous) => {
        const next = [...previous];
        next[indexOfQuestion(currentQuestion.id)] = value as OptionKey;
        return next;
      });
    },
    [currentQuestion]
  );

  const handleNext = () => {
    if (!currentQuestion) return;
    const answer = answers[indexOfQuestion(currentQuestion.id)];
    if (!answer) return;

    trackEvent({
      action: 'diagnostic_question_completed',
      category: 'Diagnostic',
      label: `q${currentQuestion.id}`,
      question_index: safeStep + 1,
      answer_key: answer,
      source,
    });

    // Bosqich savoliga javob berilgach ro'yxat kengayadi, shuning uchun
    // qadam chegarasi shu yerda qayta hisoblanadi.
    const nextVisible = visibleQuestions(resolveSegment(answers));
    if (safeStep < nextVisible.length - 1) {
      setStep(safeStep + 1);
      return;
    }
    setStage('contact');
  };

  const handleBack = () => {
    if (stage === 'contact') {
      setStage('questions');
      setStep(visible.length - 1);
      return;
    }
    if (safeStep > 0) {
      setStep(safeStep - 1);
      return;
    }
    setStage('intro');
  };

  const validateForm = () => {
    const nextErrors: Partial<Record<keyof ContactForm, string>> = {};
    if (form.fullName.trim().length < 2) nextErrors.fullName = dictionary.ui.nameError;
    if (!isContactValid(form.contact)) {
      nextErrors.contact = dictionary.ui.contactError;
    }
    if (!form.consent) nextErrors.consent = dictionary.ui.consentError;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (submitEvent: FormEvent) => {
    submitEvent.preventDefault();
    setSubmitError('');
    if (!validateForm()) return;
    if (!isAnswerSheetComplete(answers)) {
      // Javobsiz qolgan birinchi ko'rinadigan savolga qaytaramiz.
      const missing = visible.findIndex((question) => !answers[indexOfQuestion(question.id)]);
      setStage('questions');
      setStep(missing === -1 ? 0 : missing);
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
        lang === 'uz' && error instanceof Error && error.message && !/^HTTP \d+$/.test(error.message)
          ? error.message
          : dictionary.ui.submitError
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

  // Bosqich tanlanmaguncha jami savollar soni noma'lum. Progress birinchi
  // savolda 0 ko'rinmasligi uchun ro'yxat uzunligiga nisbatan hisoblanadi.
  const totalVisible = visible.length;
  const progressValue = ((safeStep + 1) / totalVisible) * 100;

  return (
    <main className="flex-grow bg-secondary/50">
      <section className="py-10 sm:py-20">
        <div className="container mx-auto px-4">
          {stage === 'intro' && (
            <Card className="mx-auto max-w-2xl rounded-3xl p-6 text-center shadow-2xl sm:p-10">
              <span className="mx-auto inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {dictionary.ui.title}
              </span>
              <h1 className="mt-5 text-3xl font-extrabold text-dark-blue sm:text-4xl">
                {dictionary.ui.headline}
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-lg text-gray-700">
                {dictionary.ui.intro}
              </p>
              <p className="mx-auto mt-3 max-w-xl text-base text-gray-600">
                {dictionary.ui.introDetail}
              </p>
              <Button
                size="lg"
                onClick={handleStart}
                className="mt-8 h-14 w-full rounded-full text-base font-bold sm:w-auto"
              >
                {dictionary.ui.start}
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
                  aria-label={`${dictionary.ui.progress}: ${safeStep + 1} / ${totalVisible}`}
                />
                <CardDescription className="!mt-4 font-semibold text-primary">
                  {safeStep + 1}/{totalVisible}
                </CardDescription>
                <CardTitle
                  ref={headingRef}
                  tabIndex={-1}
                  className="!mt-2 text-2xl font-bold text-dark-blue outline-none sm:text-3xl"
                >
                  {currentQuestion.question}
                </CardTitle>
                {currentQuestion.hint && (
                  <CardDescription className="!mt-2 text-base">{currentQuestion.hint}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="p-5 pt-0 sm:p-8 sm:pt-0">
                <RadioGroup
                  value={answers[indexOfQuestion(currentQuestion.id)] ?? ''}
                  onValueChange={handleSelect}
                  className="space-y-3"
                  aria-label={currentQuestion.question}
                >
                  {currentQuestion.options.map((option) => (
                    <Label
                      key={option.key}
                      htmlFor={`q${currentQuestion.id}-${option.key}`}
                      className="press-effect flex min-h-[56px] cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors hover:bg-white has-[:checked]:border-primary has-[:checked]:bg-primary/10 active:scale-[0.99]"
                    >
                      <RadioGroupItem value={option.key} id={`q${currentQuestion.id}-${option.key}`} />
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
                    {dictionary.ui.back}
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    onClick={handleNext}
                    disabled={!answers[indexOfQuestion(currentQuestion.id)]}
                    className="h-12 rounded-full text-base font-bold"
                  >
                    {dictionary.ui.continue}
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {stage === 'contact' && (
            <Card className="mx-auto max-w-2xl rounded-3xl shadow-2xl">
              <CardHeader className="p-5 sm:p-8">
                <Progress value={100} className="h-2" aria-label={`${dictionary.ui.progress}: 100%`} />
                <CardTitle
                  ref={headingRef}
                  tabIndex={-1}
                  className="!mt-4 text-2xl font-bold text-dark-blue outline-none sm:text-3xl"
                >
                  {dictionary.ui.ready}
                </CardTitle>
                <CardDescription className="!mt-2 text-base">
                  {dictionary.ui.contactIntro}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 sm:p-8 sm:pt-0">
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <HoneypotField
                    value={form.companyWebsite}
                    onChange={(value) => setForm((prev) => ({ ...prev, companyWebsite: value }))}
                  />
                  <div className="space-y-2">
                    <Label htmlFor="diagnostic-name">{dictionary.ui.name} *</Label>
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
                    <Label htmlFor="diagnostic-company">{dictionary.ui.company}</Label>
                    <Input
                      id="diagnostic-company"
                      value={form.companyName}
                      onChange={(inputEvent) => setForm((prev) => ({ ...prev, companyName: inputEvent.target.value }))}
                      autoComplete="organization"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diagnostic-industry">{dictionary.ui.industry}</Label>
                    <Input
                      id="diagnostic-industry"
                      value={form.industry}
                      onChange={(inputEvent) => setForm((prev) => ({ ...prev, industry: inputEvent.target.value }))}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diagnostic-contact">{dictionary.ui.contact} *</Label>
                    <Input
                      id="diagnostic-contact"
                      value={form.contact}
                      onChange={(inputEvent) => setForm((prev) => ({ ...prev, contact: inputEvent.target.value }))}
                      placeholder={dictionary.ui.contactPlaceholder}
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
                        {dictionary.ui.consent} *
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
                      {dictionary.ui.back}
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
                          {dictionary.ui.submitting}
                        </>
                      ) : (
                        <>
                          {dictionary.ui.showResult}
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
                        <h3 className="text-lg font-bold text-dark-blue">{dictionary.services[gap].label}</h3>
                        <p className="mt-1 text-base text-gray-700">{dictionary.services[gap].what}</p>
                        <p className="mt-2 text-sm text-gray-600">{dictionary.services[gap].why}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}

              <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <h2 className="text-sm font-bold uppercase tracking-wide text-primary">{dictionary.ui.recommendation}</h2>
                <p className="mt-2 text-base text-gray-800">{result.advice}</p>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <Button
                  asChild
                  size="lg"
                  onClick={() => handleCtaClick('free_brand_audit')}
                  className="h-14 rounded-full text-base font-bold"
                >
                  <Link href={`/${lang}/aloqa`}>{dictionary.ui.auditCta}</Link>
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
                    {dictionary.ui.telegramCta}
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

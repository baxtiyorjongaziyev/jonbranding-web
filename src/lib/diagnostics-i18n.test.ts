import { describe, expect, it } from 'vitest';
import uz from '@/locales/uz.json';
import ru from '@/locales/ru.json';
import en from '@/locales/en.json';
import zh from '@/locales/zh.json';
import { SERVICE_ORDER } from './diagnostics';

const dictionaries = { uz, ru, en, zh } as const;
const requiredUiKeys = [
  'title', 'headline', 'intro', 'introDetail', 'start', 'back', 'continue', 'ready',
  'contactIntro', 'name', 'company', 'industry', 'contact', 'contactPlaceholder',
  'consent', 'submitting', 'showResult', 'recommendation', 'auditCta', 'telegramCta',
  'nameError', 'contactError', 'consentError', 'submitError', 'progress',
] as const;

describe('diagnostika tarjimalari', () => {
  it.each(Object.entries(dictionaries))('%s lug‘ati to‘liq', (_locale, dictionary) => {
    const diagnostics = dictionary.diagnostics;

    for (const key of requiredUiKeys) expect(diagnostics.ui[key].length).toBeGreaterThan(0);

    expect(Object.keys(diagnostics.questions)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8']);
    for (const question of Object.values(diagnostics.questions)) {
      expect(question.question.length).toBeGreaterThan(5);
      expect(Object.keys(question.options)).toEqual(['A', 'B', 'C']);
    }
    for (const service of SERVICE_ORDER) {
      expect(diagnostics.services[service].label.length).toBeGreaterThan(1);
      expect(diagnostics.services[service].what.length).toBeGreaterThan(5);
      expect(diagnostics.services[service].why.length).toBeGreaterThan(5);
    }
    expect(Object.keys(diagnostics.results)).toEqual(['nurture', 'potential', 'qualified']);
    for (const result of [...Object.values(diagnostics.results), diagnostics.noGaps]) {
      expect(result.title.length).toBeGreaterThan(0);
      expect(result.description.length).toBeGreaterThan(0);
      expect(result.advice.length).toBeGreaterThan(0);
    }
  });
});

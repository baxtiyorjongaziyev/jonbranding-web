import uz from '@/locales/uz.json';
import ru from '@/locales/ru.json';
import en from '@/locales/en.json';
import zh from '@/locales/zh.json';
import { fillFacts, yearsOfExperience } from '@/lib/company-facts';

type DeepDictionary = { [key: string]: any };

const dictionaries: Record<Locale, DeepDictionary> = { uz, ru, en, zh };

export type Locale = 'uz' | 'ru' | 'en' | 'zh';

// Yil/mijoz/loyiha raqamlari lug'atda {{years}} kabi belgilar bilan yoziladi.
// Tajriba yili o'zgarguncha to'ldirilgan lug'at keshda turadi.
const filled = new Map<string, DeepDictionary>();

export const getDictionary = async (locale: Locale): Promise<DeepDictionary> => {
  const safe = dictionaries[locale] ? locale : 'uz';
  const key = `${safe}:${yearsOfExperience()}`;
  let dict = filled.get(key);
  if (!dict) {
    dict = fillFacts(dictionaries[safe]);
    filled.set(key, dict);
  }
  return dict;
};

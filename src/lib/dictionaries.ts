import uz from '@/locales/uz.json';
import ru from '@/locales/ru.json';
import en from '@/locales/en.json';
import zh from '@/locales/zh.json';

type DeepDictionary = { [key: string]: any };

const dictionaries: Record<Locale, DeepDictionary> = { uz, ru, en, zh };

export type Locale = 'uz' | 'ru' | 'en' | 'zh';

export const getDictionary = async (locale: Locale): Promise<DeepDictionary> => {
  return dictionaries[locale] || dictionaries.uz;
};

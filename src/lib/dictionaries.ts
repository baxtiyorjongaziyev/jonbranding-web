import uz from '@/locales/uz.json';
import ru from '@/locales/ru.json';
import en from '@/locales/en.json';
import zh from '@/locales/zh.json';

const dictionaries: any = {
  uz,
  ru,
  en,
  zh,
};

export type Locale = 'uz' | 'ru' | 'en' | 'zh';

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale] || dictionaries.uz;
};

import uz from '@/locales/uz.json';
import ru from '@/locales/ru.json';
import en from '@/locales/en.json';
import zh from '@/locales/zh.json';

export function getSalesFlow(lang = 'uz') {
  return ({ uz, ru, en, zh }[lang as 'uz' | 'ru' | 'en' | 'zh'] || uz).salesFlow;
}

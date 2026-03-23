
const dictionaries = {
  uz: () => import('@/locales/uz.json').then((module) => module.default),
  ru: () => import('@/locales/ru.json').then((module) => module.default),
  en: () => import('@/locales/en.json').then((module) => module.default),
  zh: () => import('@/locales/zh.json').then((module) => module.default),
}

export type Locale = keyof typeof dictionaries;

export const getDictionary = async (locale: Locale) => {
  try {
    const loader = dictionaries[locale] || dictionaries.uz;
    return await loader();
  } catch (error) {
    console.error(`Failed to load dictionary for ${locale}:`, error);
    // Hard fallback to UZ if everything fails
    return dictionaries.uz();
  }
};

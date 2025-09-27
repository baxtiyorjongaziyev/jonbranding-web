
const dictionaries = {
  uz: () => import('@/locales/uz.json').then((module) => module.default),
  ru: () => import('@/locales/ru.json').then((module) => module.default),
  en: () => import('@/locales/en.json').then((module) => module.default),
}

export type Locale = keyof typeof dictionaries;

export const getDictionary = async (locale: Locale) => {
    const loader = dictionaries[locale] || dictionaries.uz;
    return loader();
}

    
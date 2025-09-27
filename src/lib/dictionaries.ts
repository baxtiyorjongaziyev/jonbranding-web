
const dictionaries = {
  uz: () => import('@/locales/uz.json').then((module) => module.default),
  ru: () => import('@/locales/ru.json').then((module) => module.default),
}

export const getDictionary = async (locale: 'uz' | 'ru') => {
    const loader = dictionaries[locale] || dictionaries.uz;
    return loader();
}

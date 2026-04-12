const fs = require('fs');

const langs = ['uz', 'ru', 'en'];
langs.forEach(lang => {
  const p = `./src/locales/${lang}.json`;
  if (!fs.existsSync(p)) return;
  
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  
  // Results consolidation
  d.results = {
    badge: lang === 'uz' ? 'MIJOZ NATIJASI' : (lang === 'ru' ? 'РЕЗУЛЬТАТ КЛИЕНТА' : 'CLIENT RESULTS'),
    title: lang === 'uz' ? 'Mijozlarimizning natijalari' : (lang === 'ru' ? 'Результаты наших клиентов' : 'Our Client Results'),
    subtitle: lang === 'uz' 
      ? "Biz nafaqat chiroyli dizayn, balki biznesingiz rivojiga hissa qo'shadigan strategik yechimlar yaratamiz." 
      : (lang === 'ru' ? "Мы создаем не просто красивый дизайн, а стратегические решения для роста вашего бизнеса." : "We create not just beautiful design, but strategic solutions that contribute to your business development."),
    items: [
      { 
        impact: '60%+', 
        title: lang === 'uz' ? 'Den Aroma' : 'Den Aroma', 
        desc: lang === 'uz' ? "O'rtacha chekning oshishi" : (lang === 'ru' ? 'Увеличение среднего чека' : 'Increase in average check')
      },
      { 
        impact: '40%+', 
        title: lang === 'uz' ? 'Bexruz Market' : 'Bexruz Market', 
        desc: lang === 'uz' ? "Mijozlar oqimining ko'payishi" : (lang === 'ru' ? 'Увеличение потока клиентов' : 'Increase in customer flow')
      }
    ],
    detail: lang === 'uz' 
      ? "Har bir loyiha biz uchun shunchaki dizayn emas, balki biznes o'sishi uchun vositadir." 
      : (lang === 'ru' ? "Каждый проект для нас — это не просто дизайн, а инструмент для роста бизнеса." : "Every project for us is more than just design; it is a tool for business growth.")
  };

  // Stats consolidation
  d.stats = {
    badge: 'JON.BRANDING STAT',
    projects: lang === 'uz' ? 'Muvaffaqiyatli loyihalar' : (lang === 'ru' ? 'Успешных проектов' : 'Successful projects'),
    experience: lang === 'uz' ? 'Yillik tajriba' : (lang === 'ru' ? 'Лет опыта' : 'Years of experience'),
    clients: lang === 'uz' ? 'Mamnun mijozlar' : (lang === 'ru' ? 'Довольных клиентов' : 'Happy clients'),
    recommend: lang === 'uz' ? 'Tavsiya qilishadi' : (lang === 'ru' ? 'Рекомендуют нас' : 'Recommend us'),
    detail: d.results.detail,
    projects_val: '1000+',
    experience_val: '9+',
    clients_val: '500+',
    recommend_val: '90%'
  };

  fs.writeFileSync(p, JSON.stringify(d, null, 4));
});
console.log('Dictionaries updated successfully.');

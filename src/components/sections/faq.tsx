
'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import CtaBlock from './cta-block';
import { type FaqItem } from '@/lib/types';
import { useState, useEffect } from 'react';

const t = {
    uz: {
        title: "Ko'p beriladigan savollar",
        subtitle: "Brending jarayoni, narxlar va boshqa mavzular bo'yicha eng ko'p uchraydigan savollarga javoblar.",
        faqItems: [
           {
            question: "Nima uchun narxlar qat'iy belgilanmagan?",
            answer: "Har bir loyiha o'ziga xos. Narx loyihaning murakkabligi, ish hajmi va sizning vazifalaringizga qarab individual ravishda hisoblanadi. Biz sizning brendingiz uchun eng maqbul yechimni taklif qilamiz."
          },
          {
            question: "Ish jarayoni qanday quriladi?",
            answer: "Jarayon bosqichlarga bo'lingan: tadqiqot, strategiya, vizual uslub, kommunikatsiya. Har bir bosqich siz bilan kelishilgan holda amalga oshiriladi va siz jarayonni to'liq nazorat qilasiz."
          },
          {
            question: "Faqat logotip buyurtma qilsam bo'ladimi?",
            answer: "Biz shunchaki logotip emas, balki brendni taniladigan va samarali qiladigan to'laqonli identifikatsiya tizimini ishlab chiqamiz. Bu sizning biznesingizga uzoq muddatli qiymat yaratadi."
          },
          {
            question: "To'lov shartlari qanday?",
            answer: "Standart sxema — 50% oldindan to'lov, 50% loyiha topshirilgandan so'ng. Sizning qulayligingiz uchun individual shartlarni ham muhokama qilishimiz mumkin."
          },
          {
            question: "Ish qancha vaqt davom etadi?",
            answer: "Muddlatlar xizmat turiga bog'liq. Masalan, logotip yaratish — 2-4 hafta, brend-strategiya — 8 haftadan boshlanadi. Yakuniy muddat loyiha tasdiqlangandan so'ng aniq bo'ladi."
          },
          {
            question: "Loyiha tugagandan keyin qo'llab-quvvatlash bormi?",
            answer: "Ha, loyiha tugagandan so'ng 1 oy davomida sizga brend materiallaridan to'g'ri foydalanish bo'yicha bepul maslahat va yordam beramiz."
          },
        ],
        ctaTitle: "Ikkilanishlarga o'rin qoldirmang!",
        ctaDesc: "Barcha savollaringizga javob oldingizmi? Keling, loyihangizni muhokama qilamiz va brendingizni keyingi bosqichga olib chiqamiz.",
        ctaButton: "Barcha savollarga javob oldim, boshlashga tayyorman!"
    },
    ru: {
        title: "Часто задаваемые вопросы",
        subtitle: "Ответы на самые распространенные вопросы о процессе брендинга, ценах и других темах.",
        faqItems: [
            {
                question: "Почему цены не фиксированы?",
                answer: "Каждый проект уникален. Цена рассчитывается индивидуально в зависимости от сложности проекта, объема работы и ваших задач. Мы предлагаем оптимальное решение для вашего бренда."
            },
            {
                question: "Как строится рабочий процесс?",
                answer: "Процесс разделен на этапы: исследование, стратегия, визуальный стиль, коммуникация. Каждый этап согласовывается с вами, и вы полностью контролируете процесс."
            },
            {
                question: "Можно ли заказать только логотип?",
                answer: "Мы создаем не просто логотип, а полноценную систему идентификации, которая делает бренд узнаваемым и эффективным. Это создает долгосрочную ценность для вашего бизнеса."
            },
            {
                question: "Каковы условия оплаты?",
                answer: "Стандартная схема — 50% предоплата, 50% после сдачи проекта. Мы также можем обсудить индивидуальные условия для вашего удобства."
            },
            {
                question: "Сколько времени занимает работа?",
                answer: "Сроки зависят от вида услуги. Например, создание логотипа — 2-4 недели, бренд-стратегия — от 8 недель. Окончательный срок определяется после утверждения проекта."
            },
            {
                question: "Есть ли поддержка после завершения проекта?",
                answer: "Да, в течение 1 месяца после завершения проекта мы предоставляем бесплатные консультации и помощь по правильному использованию бренд-материалов."
            }
        ],
        ctaTitle: "Не оставляйте места сомнениям!",
        ctaDesc: "Получили ответы на все свои вопросы? Давайте обсудим ваш проект и выведем ваш бренд на новый уровень.",
        ctaButton: "Я получил все ответы, готов начать!"
    }
}

const Faq = ({ lang }: { lang: string }) => {
  const translations = lang === 'ru' ? t.ru : t.uz;
  
  const handleOpenModal = () => {
    const event = new CustomEvent('openContactModal');
    window.dispatchEvent(event);
  }
  
  return (
    <section id="faq" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              {translations.title}
          </h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto text-muted-foreground">
              {translations.subtitle}
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <Accordion type="single" collapsible defaultValue="item-0" className="w-full space-y-4">
                {translations.faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-lg font-semibold text-foreground">
                    {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pt-2 text-base">
                    {item.answer}
                    </AccordionContent>
                </AccordionItem>
                ))}
            </Accordion>
        </div>
      </div>
      <CtaBlock 
        title={translations.ctaTitle}
        description={translations.ctaDesc}
        buttonText={translations.ctaButton}
        onCtaClick={handleOpenModal}
      />
    </section>
  )
}

export default Faq;

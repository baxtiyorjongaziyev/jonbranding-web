'use client';
import { useState } from 'react';

type Lang = 'uz' | 'ru' | 'en' | 'zh';

interface Props { lang?: string; }

const translations = {
  uz: {
    sectionLabel: 'Jarayon',
    heading: '14 kunda',
    headingEm: 'aniqlik.',
    subtitle: '3 bosqich — barchasi masofadan. Hech qanday ofisga kelish kerak emas.',
    exampleLabel: 'Haqiqiy misol',
    steps: [
      {
        n: '01',
        title: 'Brif va materiallar',
        dur: '1–2 kun',
        summary: 'Siz materiallarni yuboresiz — biz ishga tushamiz.',
        detail: "Siz logotip fayllar, sayt manzili, ijtimoiy tarmoqlar va mavjud brend materiallarini yuborasiz. 1–2 kun ichida brif anketa yuboramiz — 20 daqiqa vaqt oladi. Hech qanday uchrashuv kerak emas.",
        example: "Qumri Coffee brifi: 3 yillik logotip fayllar, 2 ta sayt versiyasi, Instagram profil + oqim screenshot.",
      },
      {
        n: '02',
        title: "12 mezon bo'yicha tashxis",
        dur: '10–12 kun',
        summary: "3 ta mutaxassis har bir mezonni alohida tekshiradi.",
        detail: "Dizayner, strateg va marketolog — har biri o'z sohasida 4 ta mezonni tekshiradi. Ball tizimi: 0–100. Har bir mezon uchun aniq dalil va yo'qotish hisobi. Taqqoslash: sizning natijangiz vs soha o'rtacha.",
        example: "Qumri Coffee natijasi: Logotip o'qilishi 62/100, Rang konsistentligi 48/100, Raqamli adaptatsiya 31/100.",
      },
      {
        n: '03',
        title: 'Prezentatsiya va reja',
        dur: '1 kun',
        summary: 'Onlayn uchrashuv + PDF hisobot + 90 kunlik reja.',
        detail: "45–60 daqiqalik onlayn prezentatsiya (Zoom/Meet). Barcha topilmalar, reyting asoslari va tavsiyalar. 90 kunlik harakat rejasi: kim bajaradi, qancha turadi, qachon natija ko'rinadi. Keyin 2 hafta ichida savol-javob uchun ochiqmiz.",
        example: "Qumri Coffee: Prezentatsiyadan keyin 3 hafta ichida yangi logotip asosida qadoq qayta ishlanildi — sotuvda +18%.",
      },
    ],
  },
  ru: {
    sectionLabel: 'Процесс',
    heading: '14 дней —',
    headingEm: 'ясность.',
    subtitle: '3 этапа — всё удалённо. Офис посещать не нужно.',
    exampleLabel: 'Реальный пример',
    steps: [
      {
        n: '01',
        title: 'Бриф и материалы',
        dur: '1–2 дня',
        summary: 'Вы отправляете материалы — мы приступаем.',
        detail: 'Вы присылаете файлы логотипа, адрес сайта, соцсети и имеющиеся брендовые материалы. За 1–2 дня мы пришлём бриф-анкету — займёт 20 минут. Встречи не нужны.',
        example: 'Бриф Qumri Coffee: файлы логотипа за 3 года, 2 версии сайта, профиль Instagram + скриншоты ленты.',
      },
      {
        n: '02',
        title: 'Диагностика по 12 критериям',
        dur: '10–12 дней',
        summary: '3 специалиста проверяют каждый критерий отдельно.',
        detail: 'Дизайнер, стратег и маркетолог — каждый проверяет 4 критерия в своей области. Система баллов: 0–100. Для каждого критерия — конкретные доказательства и расчёт потерь. Сравнение: ваш результат vs среднее по отрасли.',
        example: 'Результат Qumri Coffee: читаемость логотипа 62/100, консистентность цвета 48/100, цифровая адаптация 31/100.',
      },
      {
        n: '03',
        title: 'Презентация и план',
        dur: '1 день',
        summary: 'Онлайн-встреча + PDF-отчёт + план на 90 дней.',
        detail: 'Онлайн-презентация 45–60 минут (Zoom/Meet). Все находки, обоснования оценок и рекомендации. План действий на 90 дней: кто делает, сколько стоит, когда будет результат. Затем 2 недели открыты для вопросов.',
        example: 'Qumri Coffee: через 3 недели после презентации переработана упаковка на основе нового логотипа — продажи +18%.',
      },
    ],
  },
  en: {
    sectionLabel: 'Process',
    heading: '14 days to',
    headingEm: 'clarity.',
    subtitle: '3 stages — all remote. No office visits needed.',
    exampleLabel: 'Real example',
    steps: [
      {
        n: '01',
        title: 'Brief & materials',
        dur: '1–2 days',
        summary: 'You send the materials — we get to work.',
        detail: 'You send logo files, website URL, social media links, and existing brand materials. Within 1–2 days we send a brief questionnaire — takes 20 minutes. No meetings required.',
        example: 'Qumri Coffee brief: 3 years of logo files, 2 website versions, Instagram profile + feed screenshots.',
      },
      {
        n: '02',
        title: 'Diagnosis across 12 criteria',
        dur: '10–12 days',
        summary: '3 specialists evaluate each criterion separately.',
        detail: 'Designer, strategist, and marketer — each reviews 4 criteria in their domain. Scoring system: 0–100. Concrete evidence and loss calculation for each criterion. Comparison: your result vs industry average.',
        example: 'Qumri Coffee results: logo legibility 62/100, colour consistency 48/100, digital adaptation 31/100.',
      },
      {
        n: '03',
        title: 'Presentation & plan',
        dur: '1 day',
        summary: 'Online meeting + PDF report + 90-day action plan.',
        detail: '45–60 minute online presentation (Zoom/Meet). All findings, rating rationale, and recommendations. 90-day action plan: who does what, costs, and when results show. Then open for questions for 2 weeks.',
        example: 'Qumri Coffee: 3 weeks after the presentation, packaging was redesigned around the new logo — sales +18%.',
      },
    ],
  },
  zh: {
    sectionLabel: '流程',
    heading: '14天内',
    headingEm: '获得清晰度。',
    subtitle: '3个阶段——全程远程。无需到访办公室。',
    exampleLabel: '真实案例',
    steps: [
      {
        n: '01',
        title: '简报与材料',
        dur: '1–2天',
        summary: '您发送材料——我们开始工作。',
        detail: '您发送标志文件、网站地址、社交媒体链接和现有品牌材料。1–2天内我们发送简报问卷——需要20分钟。不需要任何会议。',
        example: 'Qumri Coffee简报：3年的标志文件，2个网站版本，Instagram个人资料+动态截图。',
      },
      {
        n: '02',
        title: '12项标准诊断',
        dur: '10–12天',
        summary: '3位专家分别评估每项标准。',
        detail: '设计师、策略师和营销人员——每人在自己领域审查4项标准。评分系统：0–100。每项标准都有具体证据和损失计算。比较：您的结果与行业平均水平。',
        example: 'Qumri Coffee结果：标志可读性62/100，色彩一致性48/100，数字适应性31/100。',
      },
      {
        n: '03',
        title: '演示与计划',
        dur: '1天',
        summary: '在线会议 + PDF报告 + 90天行动计划。',
        detail: '45–60分钟在线演示（Zoom/Meet）。所有发现、评级依据和建议。90天行动计划：谁来做、费用多少、何时见效。之后2周内随时解答问题。',
        example: 'Qumri Coffee：演示后3周，基于新标志重新设计了包装——销售额+18%。',
      },
    ],
  },
} as const;

export default function AtProcess({ lang = 'uz' }: Props) {
  const [open, setOpen] = useState<string | null>('01');
  const l = translations[(lang as Lang) in translations ? (lang as Lang) : 'uz'];

  return (
    <section className="py-16 md:py-24" id="jarayon" style={{ background: 'var(--at-paper)' }}>
      <div className="max-w-[1320px] mx-auto px-8 sm:px-5">
        {/* Header */}
        <div className="mb-12">
          <div
            className="inline-flex items-center gap-2 mb-4"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--at-muted)' }}
          >
            <span className="at-pulse inline-block w-1.5 h-1.5 rounded-full" style={{ background: 'var(--at-green)' }} />
            <span style={{ color: 'var(--at-ink)', fontWeight: 500 }}>§ 08</span>
            <span>{l.sectionLabel}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2
              className="font-bold leading-none"
              style={{ fontSize: 'clamp(36px, 4.4vw, 64px)', letterSpacing: '-0.035em', color: 'var(--at-ink)' }}
            >
              {l.heading}{' '}
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--at-accent)' }}>
                {l.headingEm}
              </span>
            </h2>
            <p style={{ color: 'var(--at-ink-2)', fontSize: 15, lineHeight: 1.65, maxWidth: 300 }}>
              {l.subtitle}
            </p>
          </div>
        </div>

        {/* Accordion steps */}
        <div className="flex flex-col" style={{ borderTop: '1px solid var(--at-line)' }}>
          {l.steps.map((s) => (
            <div key={s.n} style={{ borderBottom: '1px solid var(--at-line)' }}>
              <button
                className="w-full flex items-center gap-5 py-6 text-left"
                onClick={() => setOpen(open === s.n ? null : s.n)}
              >
                <span
                  className="shrink-0 font-bold"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: open === s.n ? 'var(--at-accent)' : 'var(--at-muted)', minWidth: 28 }}
                >
                  {s.n}
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold text-base" style={{ color: 'var(--at-ink)' }}>{s.title}</h3>
                  <div style={{ fontSize: 13, color: 'var(--at-muted)', marginTop: 2 }}>{s.summary}</div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span
                    className="hidden sm:block text-xs px-2.5 py-1 rounded-full"
                    style={{ background: 'var(--at-bg)', color: 'var(--at-ink-2)', fontFamily: 'var(--font-mono)' }}
                  >
                    {s.dur}
                  </span>
                  <span
                    className="text-xl leading-none transition-transform duration-200"
                    style={{ color: 'var(--at-muted)', transform: open === s.n ? 'rotate(45deg)' : 'none' }}
                  >
                    +
                  </span>
                </div>
              </button>

              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: open === s.n ? '400px' : '0', opacity: open === s.n ? 1 : 0 }}
              >
                <div className="pl-[52px] pb-6 grid md:grid-cols-2 gap-5">
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--at-ink-2)' }}>{s.detail}</p>
                  <div
                    className="rounded-xl p-4"
                    style={{ background: 'var(--at-accent-soft)', border: '1px solid rgba(27,77,255,0.12)' }}
                  >
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--at-accent)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
                      {l.exampleLabel}
                    </div>
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--at-ink)' }}>{s.example}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

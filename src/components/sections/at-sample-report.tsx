'use client';

const BAR_COLORS = ['var(--at-green)', 'var(--at-accent)', 'var(--at-terra)', 'var(--at-green)', 'var(--at-accent)'];
const REC_DOTS = ['var(--at-terra)', 'var(--at-accent)', 'var(--at-green)'];

interface Props {
  onOpen: () => void;
  lang?: string;
}

type Lang = 'uz' | 'ru' | 'en' | 'zh';

const t = {
  uz: {
    sectionN: '§ 05',
    sectionLabel: 'Namuna hisobot',
    heading: 'Nima olasiz —',
    headingEm: "ko'ring.",
    desc: "48 betlik PDF hisobot: har bir mezon bo'yicha ball, yo'qotish hisob-kitobi va 90 kunlik aniq reja.",
    chapters: [
      { n: '01', title: 'Ijroiya xulosasi', pages: '3–5' },
      { n: '02', title: 'Vizual identifikatsiya auditi', pages: '6–14' },
      { n: '03', title: 'Raqamli mavjudlik tahlili', pages: '15–22' },
      { n: '04', title: 'Raqobat matritsasi', pages: '23–30' },
      { n: '05', title: "Yo'qotilgan daromad hisob-kitobi", pages: '31–38' },
      { n: '06', title: '90 kunlik harakat rejasi', pages: '39–48' },
    ],
    bars: [
      { label: "O'qish", score: 82 },
      { label: 'Esda qolish', score: 64 },
      { label: 'Farqlanish', score: 38 },
      { label: 'Masshtablanish', score: 91 },
      { label: 'Konseptual', score: 55 },
    ],
    recs: [
      'Logotip versiyalarini birlashtirish zarur',
      "Raqamli kanallar uchun adaptatsiya yo'q",
      'Brand voice hujjati yaratish tavsiya etiladi',
    ],
    btn: "Namuna so'rash",
    coverLabel: "Brend Tashxisi · To'liq",
    scoreLabel: "O'rta daraja",
    clientLabel: 'Mijoz',
    chapterLabel: '§02 · Vizual identifikatsiya',
  },
  ru: {
    sectionN: '§ 05',
    sectionLabel: 'Образец отчёта',
    heading: 'Что вы получаете —',
    headingEm: 'смотрите.',
    desc: 'PDF-отчёт на 48 страницах: баллы по каждому критерию, расчёт потерь и чёткий 90-дневный план.',
    chapters: [
      { n: '01', title: 'Исполнительное резюме', pages: '3–5' },
      { n: '02', title: 'Аудит визуальной идентичности', pages: '6–14' },
      { n: '03', title: 'Анализ цифрового присутствия', pages: '15–22' },
      { n: '04', title: 'Конкурентная матрица', pages: '23–30' },
      { n: '05', title: 'Расчёт упущенной выручки', pages: '31–38' },
      { n: '06', title: '90-дневный план действий', pages: '39–48' },
    ],
    bars: [
      { label: 'Читаемость', score: 82 },
      { label: 'Запоминаемость', score: 64 },
      { label: 'Дифференциация', score: 38 },
      { label: 'Масштабируемость', score: 91 },
      { label: 'Концептуальность', score: 55 },
    ],
    recs: [
      'Необходимо унифицировать версии логотипа',
      'Отсутствует адаптация для цифровых каналов',
      'Рекомендуется создать документ brand voice',
    ],
    btn: 'Запросить образец',
    coverLabel: 'Бренд-диагностика · Полная',
    scoreLabel: 'Средний уровень',
    clientLabel: 'Клиент',
    chapterLabel: '§02 · Визуальная идентичность',
  },
  en: {
    sectionN: '§ 05',
    sectionLabel: 'Sample report',
    heading: 'What you get —',
    headingEm: 'see for yourself.',
    desc: '48-page PDF report: scores for each criterion, loss calculation, and a clear 90-day action plan.',
    chapters: [
      { n: '01', title: 'Executive summary', pages: '3–5' },
      { n: '02', title: 'Visual identity audit', pages: '6–14' },
      { n: '03', title: 'Digital presence analysis', pages: '15–22' },
      { n: '04', title: 'Competitive matrix', pages: '23–30' },
      { n: '05', title: 'Lost revenue calculation', pages: '31–38' },
      { n: '06', title: '90-day action plan', pages: '39–48' },
    ],
    bars: [
      { label: 'Readability', score: 82 },
      { label: 'Memorability', score: 64 },
      { label: 'Differentiation', score: 38 },
      { label: 'Scalability', score: 91 },
      { label: 'Conceptual', score: 55 },
    ],
    recs: [
      'Logo versions need consolidation',
      'No adaptation for digital channels',
      'Brand voice document recommended',
    ],
    btn: 'Request sample',
    coverLabel: 'Brand Diagnostics · Full',
    scoreLabel: 'Medium level',
    clientLabel: 'Client',
    chapterLabel: '§02 · Visual identity',
  },
  zh: {
    sectionN: '§ 05',
    sectionLabel: '示例报告',
    heading: '您将获得什么 —',
    headingEm: '一看便知。',
    desc: '48页PDF报告：每项标准评分、损失计算及清晰的90天行动计划。',
    chapters: [
      { n: '01', title: '执行摘要', pages: '3–5' },
      { n: '02', title: '视觉识别审计', pages: '6–14' },
      { n: '03', title: '数字存在分析', pages: '15–22' },
      { n: '04', title: '竞争矩阵', pages: '23–30' },
      { n: '05', title: '收入损失计算', pages: '31–38' },
      { n: '06', title: '90天行动计划', pages: '39–48' },
    ],
    bars: [
      { label: '可读性', score: 82 },
      { label: '记忆度', score: 64 },
      { label: '差异化', score: 38 },
      { label: '可扩展性', score: 91 },
      { label: '概念性', score: 55 },
    ],
    recs: [
      '需要整合标志版本',
      '缺乏数字渠道适配',
      '建议创建品牌声音文档',
    ],
    btn: '索取示例',
    coverLabel: '品牌诊断 · 完整版',
    scoreLabel: '中等水平',
    clientLabel: '客户',
    chapterLabel: '§02 · 视觉识别',
  },
} as const;

export default function AtSampleReport({ onOpen, lang = 'uz' }: Props) {
  const l = t[(lang as Lang) in t ? (lang as Lang) : 'uz'];
  return (
    <section className="py-16 md:py-24" style={{ background: 'var(--at-bg)' }}>
      <div className="max-w-[1320px] mx-auto px-8 sm:px-5">
        <div className="grid md:grid-cols-[320px_1fr] gap-12 md:gap-20 items-start">
          {/* Left */}
          <div>
            <div
              className="inline-flex items-center gap-2 mb-5"
              style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--at-muted)' }}
            >
              <span className="at-pulse inline-block w-1.5 h-1.5 rounded-full" style={{ background: 'var(--at-green)' }} />
              <span style={{ color: 'var(--at-ink)', fontWeight: 500 }}>{l.sectionN}</span>
              <span>{l.sectionLabel}</span>
            </div>
            <h2
              className="font-bold leading-none mb-5"
              style={{ fontSize: 'clamp(32px, 4vw, 56px)', letterSpacing: '-0.035em', color: 'var(--at-ink)' }}
            >
              {l.heading}{' '}
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--at-accent)' }}>
                {l.headingEm}
              </span>
            </h2>
            <p style={{ color: 'var(--at-ink-2)', fontSize: 15, lineHeight: 1.65, maxWidth: 300, marginBottom: 28 }}>
              {l.desc}
            </p>

            {/* TOC */}
            <div className="flex flex-col gap-0" style={{ borderTop: '1px solid var(--at-line)' }}>
              {l.chapters.map((c) => (
                <div key={c.n} className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid var(--at-line)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--at-muted)', minWidth: 20 }}>{c.n}</span>
                  <span style={{ flex: 1, fontSize: 13, color: 'var(--at-ink)' }}>{c.title}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--at-muted)' }}>{c.pages}</span>
                </div>
              ))}
            </div>

            <button
              onClick={onOpen}
              className="mt-6 inline-flex items-center gap-2 font-semibold text-sm rounded-full px-5 py-3 transition-colors"
              style={{ border: '1px solid var(--at-line)', background: 'var(--at-paper)', color: 'var(--at-ink)' }}
            >
              {l.btn} <span style={{ color: 'var(--at-accent)' }}>↗</span>
            </button>
          </div>

          {/* Right: PDF mockup */}
          <div className="flex gap-4">
            {/* Cover */}
            <div
              className="flex-none w-44 md:w-52 rounded-xl p-5 flex flex-col justify-between"
              style={{ background: 'var(--at-ink)', minHeight: 320, aspectRatio: '1/1.41' }}
            >
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(244,241,232,.4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 32 }}>
                  {l.coverLabel}
                </div>
                <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1 }}>
                  68<span style={{ fontSize: 18, fontWeight: 400, opacity: 0.4 }}>/100</span>
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 13, color: 'var(--at-terra)', marginTop: 4 }}>
                  {l.scoreLabel}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(244,241,232,.5)', marginBottom: 4 }}>{l.clientLabel}</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', letterSpacing: '-0.02em' }}>Qumri Coffee.</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(244,241,232,.3)', marginTop: 8 }}>2024 · Jon Atelier</div>
              </div>
            </div>

            {/* Inner page */}
            <div
              className="flex-1 rounded-xl p-5 flex flex-col gap-4"
              style={{ background: 'var(--at-paper)', border: '1px solid var(--at-line)', minHeight: 320 }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--at-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {l.chapterLabel}
              </div>

              <div className="flex flex-col gap-3 flex-1">
                {l.bars.map((b, i) => (
                  <div key={b.label}>
                    <div className="flex justify-between mb-1">
                      <span style={{ fontSize: 12, color: 'var(--at-ink-2)' }}>{b.label}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--at-ink)', fontWeight: 600 }}>{b.score}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: 'var(--at-line)' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${b.score}%`, background: BAR_COLORS[i] }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2 pt-3" style={{ borderTop: '1px solid var(--at-line)' }}>
                {l.recs.map((r, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: REC_DOTS[i] }} />
                    <span style={{ fontSize: 11, color: 'var(--at-ink-2)', lineHeight: 1.4 }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { FC, useState } from 'react';

export const ATProcess: FC<{ dictionary: any; lang?: string }> = ({ dictionary, lang = 'uz' }) => {
  const [open, setOpen] = useState<number | null>(null);
  const processItems = dictionary?.process || [];

  const extra = [
    {
      ex:
        lang === 'ru'
          ? 'Пример: Qumri Coffee'
          : lang === 'en'
            ? 'Example: Qumri Coffee'
            : lang === 'zh'
              ? '示例：Qumri Coffee'
              : 'Misol: Qumri Coffee',
      t:
        lang === 'ru'
          ? '7 страниц онлайн-анкеты, запрошено 12 материалов. Техническое задание утверждено на 2-й день.'
          : lang === 'en'
            ? '7 pages of online questionnaire, 12 materials requested. Technical specification approved on day 2.'
            : lang === 'zh'
              ? '7页在线问卷，索取12份材料。技术规范在第2天获得批准。'
              : "7 betlik onlayn anketa, 12 ta materiallar so'raldi. 2-kunga texnik topshiriq tasdiqlandi.",
    },
    {
      ex:
        lang === 'ru'
          ? 'Пример: Oltin Bulut'
          : lang === 'en'
            ? 'Example: Oltin Bulut'
            : lang === 'zh'
              ? '示例：Oltin Bulut'
              : 'Misol: Oltin Bulut',
      t:
        lang === 'ru'
          ? 'Проанализировано 5 конкурентов, 6 интервью с клиентами, 12 упаковок продуктов. Упущенная выгода: 3.7 млн в месяц.'
          : lang === 'en'
            ? '5 competitors, 6 customer interviews, 12 product packaging analyzed. Lost revenue: 3.7M/month.'
            : lang === 'zh'
              ? '分析了5个竞争对手，6个客户访谈，12个产品包装。每月流失：370万。'
              : "5 raqobatchi, 6 ta mijoz interviyu, 12 ta mahsulot qadog'i tahlil qilindi. Yo'qotish: oyiga 3.7M.",
    },
    {
      ex:
        lang === 'ru'
          ? 'Пример: Humo'
          : lang === 'en'
            ? 'Example: Humo'
            : lang === 'zh'
              ? '示例：Humo'
              : 'Misol: Humo',
      t:
        lang === 'ru'
          ? 'PDF + 1 час онлайн-презентации. 90-дневный план с 12 конкретными действиями.'
          : lang === 'en'
            ? 'PDF + 1-hour online presentation. 90-day plan with 12 specific actions.'
            : lang === 'zh'
              ? 'PDF + 1小时在线展示。90天计划，包含12个具体行动。'
              : 'PDF + 1 soatlik onlayn prezentatsiya. 90 kunlik reja 12 ta aniq harakat bilan.',
    },
  ];

  return (
    <section className="sec wrap" id="jarayon">
      <div className="sec-head">
        <h2>
          {dictionary?.process_title?.includes('\n') ? (
            <>
              {dictionary.process_title.split('\n')[0]}
              <br />
              <span className="it">{dictionary.process_title.split('\n')[1]}</span>
            </>
          ) : (
            <span className="it">
              {dictionary?.process_title || '3 qadam, hech narsa yashirin emas.'}
            </span>
          )}
        </h2>
        <div className="lede">
          <span className="eb" style={{ marginBottom: 14, display: 'inline-flex' }}>
            <span className="dot" />
            <span className="ix">§ 04</span>
            <span>{dictionary?.nav?.[4]?.label || 'Jarayon'}</span>
          </span>
          <p
            dangerouslySetInnerHTML={{
              __html:
                dictionary?.process_lede ||
                "Har bosqichda sizning fikringizni olamiz. Yoqtirmaganingizni qayta ishlaymiz. <strong>Mamnun bo'lmasangiz, pulni qaytaramiz.</strong>",
            }}
          />
        </div>
      </div>
      <div className="proc">
        {processItems.map((p: any, i: number) => (
          <div
            key={p.n}
            className={`proc-col ${open === i ? 'open' : ''}`}
            onClick={() => setOpen(open === i ? null : i)}
          >
            <div className="plus-toggle">+</div>
            <div className="num">{p.n}</div>
            <h3>{p.name}</h3>
            <p>{p.note}</p>
            <div className="reveal">
              <div className="reveal-inner">
                {extra[i] ? extra[i].t : ''}
                <em>— {extra[i] ? extra[i].ex : ''}</em>
              </div>
            </div>
            <div className="meta">
              <span>
                {dictionary?.process_step_label || 'Bosqich'} · {p.n}
              </span>
              <span className="v">{p.time}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

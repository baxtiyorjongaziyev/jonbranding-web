import Link from 'next/link';

type AnswerItem = {
  question: string;
  answer: string;
  linkLabel: string;
  href: string;
};

type Props = {
  eyebrow: string;
  title: string;
  intro: string;
  items: AnswerItem[];
  lang: string;
};

export default function SeoAnswerHub({ eyebrow, title, intro, items, lang }: Props) {
  return (
    <section
      aria-labelledby="branding-answers-title"
      className="border-y border-black/10 bg-[#f2efe6] py-20 text-[#171714] md:py-28"
    >
      <div className="mx-auto grid max-w-[1320px] gap-12 px-5 md:grid-cols-[0.8fr_1.2fr] md:px-8">
        <div>
          <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#59574f]">
            {eyebrow}
          </p>
          <h2
            id="branding-answers-title"
            className="max-w-xl text-4xl font-bold leading-[0.95] tracking-[-0.04em] md:text-6xl"
          >
            {title}
          </h2>
          <p className="mt-6 max-w-lg text-base leading-7 text-[#59574f]">{intro}</p>
        </div>

        <div className="divide-y divide-black/10 border-t border-black/10">
          {items.map((item, index) => (
            <article key={item.question} className="py-7">
              <div className="grid gap-3 sm:grid-cols-[44px_1fr]">
                <span className="font-mono text-xs text-[#77746a]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-xl font-semibold tracking-[-0.02em]">
                    {item.question}
                  </h3>
                  <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#59574f]">
                    {item.answer}
                  </p>
                  <Link
                    href={`/${lang}${item.href}`}
                    className="mt-4 inline-flex text-sm font-semibold underline decoration-black/25 underline-offset-4 transition-colors hover:decoration-black"
                  >
                    {item.linkLabel}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

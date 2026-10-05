import { FC, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQS, h2Style } from '../data';
import { Eyebrow, Section } from './ui';

export const FaqSection: FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <Section labelledBy="bs-faq-heading">
      <div className="max-w-2xl">
        <Eyebrow>FAQ</Eyebrow>
        <h2 id="bs-faq-heading" className="font-bold tracking-tight text-neutral-950" style={h2Style}>
          Ko‘p beriladigan savollar
        </h2>
      </div>

      <div className="mt-12 space-y-4">
        {FAQS.map((faq, index) => {
          const isOpen = openFaq === index;
          return (
            <div
              key={faq.q}
              className="rounded-2xl border border-neutral-200 bg-white transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between p-6 text-left text-base font-bold text-neutral-900"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`ml-4 h-5 w-5 shrink-0 text-neutral-400 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="border-t border-neutral-100 px-6 pb-6 pt-2 text-sm leading-relaxed text-neutral-600">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
};

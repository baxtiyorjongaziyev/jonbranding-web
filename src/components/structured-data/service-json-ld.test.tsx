import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ServiceJsonLd from './service-json-ld';

vi.mock('next/script', () => ({
  default: (props: Record<string, unknown>) => <script {...props} />,
}));

describe('ServiceJsonLd', () => {
  it('emits Offer price when priceValue is provided and HowTo steps when howToSteps are passed', () => {
    const { container } = render(
      <ServiceJsonLd
        lang="ru"
        path="/xizmatlar/neyming"
        name="Нейминг"
        description="Разработка названия бренда"
        priceValue={10000000}
        howToSteps={[
          { title: 'Бриф', desc: 'Интервью о бизнесе' },
          { title: 'Проверка', desc: 'База товарных знаков' },
        ]}
        faqs={[{ q: 'Сколько стоит нейминг?', a: '10 000 000 сум.' }]}
        faqLang="ru"
      />,
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const graph = JSON.parse(script!.innerHTML)['@graph'] as Array<Record<string, unknown>>;

    const service = graph.find((node) => node['@type'] === 'Service');
    expect(service?.offers).toEqual({
      '@type': 'Offer',
      price: '10000000',
      priceCurrency: 'UZS',
      availability: 'https://schema.org/InStock',
      url: 'https://www.jonbranding.uz/ru/xizmatlar/neyming',
    });

    const howTo = graph.find((node) => node['@type'] === 'HowTo');
    expect(howTo).toEqual(
      expect.objectContaining({
        name: 'Нейминг',
        inLanguage: 'ru',
        step: [
          expect.objectContaining({ '@type': 'HowToStep', position: 1, name: 'Бриф', text: 'Интервью о бизнесе' }),
          expect.objectContaining({ '@type': 'HowToStep', position: 2, name: 'Проверка', text: 'База товарных знаков' }),
        ],
      }),
    );

    const faq = graph.find((node) => node['@type'] === 'FAQPage');
    expect(faq?.inLanguage).toBe('ru');
  });
});

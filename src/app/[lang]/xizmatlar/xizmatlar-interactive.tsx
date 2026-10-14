'use client';

import type { ComponentProps } from 'react';
import AtHero from '@/components/sections/at-hero';
import AtServices from '@/components/sections/at-services';
import AtFinalCta from '@/components/sections/at-final-cta';

function openContactModal() {
  window.dispatchEvent(
    new CustomEvent('openContactModal', { detail: { section: 'xizmatlar', source: 'xizmatlar_page' } })
  );
}

export function XizmatlarHero({ lang, dictionary }: { lang: string; dictionary?: ComponentProps<typeof AtHero>["dictionary"] }) {
  return (
    <AtHero
      onOpen={() =>
        window.dispatchEvent(
          new CustomEvent('openContactModal', { detail: { section: 'xizmatlar_hero', source: 'xizmatlar_page', via: 'oisha' } })
        )
      }
      lang={lang}
      dictionary={dictionary}
    />
  );
}

export function XizmatlarServices({ lang }: { lang: string }) {
  return <AtServices onOpen={openContactModal} lang={lang} />;
}

export function XizmatlarFinalCta({ lang }: { lang: string }) {
  return <AtFinalCta onOpen={openContactModal} lang={lang} />;
}

import Script from 'next/script';
import { ExternalLink, Rss, Star } from 'lucide-react';
import type { Locale } from '@/lib/i18n/locale';

export const PREFERRED_SOURCES_URL = 'https://www.google.com/preferences/source?q=jonbranding.uz';

export interface PreferredSourcesCopy {
  preferredTitle: string;
  preferredDesc: string;
  preferredAction: string;
  rssLabel: string;
}

interface PreferredSourcesCardProps {
  lang: Locale;
  copy: PreferredSourcesCopy;
}

export function PreferredSourcesCard({ lang, copy }: PreferredSourcesCardProps) {
  return (
    <aside
      aria-labelledby="preferred-sources-heading"
      className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <Script
        id="google-preferred-sources-sdk"
        src="https://news.google.com/swg/js/v1/publisher.js"
        strategy="lazyOnload"
      />

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#2554FF]">
            <Star className="h-3.5 w-3.5" aria-hidden="true" />
            Google Search
          </div>
          <h2
            id="preferred-sources-heading"
            className="mt-2 text-lg font-bold tracking-tight text-[#0A0B0E] sm:text-xl"
          >
            {copy.preferredTitle}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-[#4B5563]">
            {copy.preferredDesc}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div
            {...{
              'google-add-preferred-source-btn': '',
              'data-lang': lang,
            }}
          />

          <a
            href={PREFERRED_SOURCES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#2554FF] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2554FF] focus-visible:ring-offset-2"
          >
            <span>{copy.preferredAction}</span>
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>

          <a
            href={`/feed.xml?lang=${lang}`}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-[#0A0B0E] transition-colors duration-200 hover:border-[#2554FF] hover:text-[#2554FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2554FF] focus-visible:ring-offset-2"
          >
            <Rss className="h-4 w-4 text-[#2554FF]" aria-hidden="true" />
            <span>{copy.rssLabel}</span>
          </a>
        </div>
      </div>
    </aside>
  );
}

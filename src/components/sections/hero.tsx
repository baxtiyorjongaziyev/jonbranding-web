'use client';

import type { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { projects } from '@/lib/static-data';
import type { GalleryImage } from '@/lib/types';

const portfolioImages: GalleryImage[] = projects
  .filter((project) => !project.hiddenInHero)
  .flatMap((project) => project.galleryImages || [])
  .filter((image) => !image.src.toLowerCase().endsWith('.gif'))
  .slice(0, 4);

interface HeroProps {
  onOpenContact: () => void;
  lang: string;
  dictionary: any;
  renderHeadline: (headline: string, className?: string) => React.ReactNode;
}

function localizedPath(lang: string, path: string) {
  return lang === 'uz' ? path : `/${lang}${path}`;
}

const Hero: FC<HeroProps> = ({ onOpenContact, lang, dictionary, renderHeadline }) => {
  if (!dictionary) return null;

  const heroCopy =
    lang === 'uz'
      ? {
          preHeadline: "O'zbekiston bizneslari uchun branding agentligi",
          title: "Biznesingiz **ishonchli ko'rinib**, qimmatroq sotilsin.",
          description:
            "Jon.Branding nom, logo, qadoq, brand strategy va brandbook orqali biznesingizni mijoz ko'zida aniq, esda qolarli va professional qiladi.",
          cta: 'Bepul brand audit olish',
          ctaSecondary: "Ishlarni ko'rish",
          proofItems: ['15 daqiqada 3 ta aniq xato', 'Qaysi xizmat kerakligini aytamiz', 'Bosimsiz, majburiyatsiz suhbat'],
          visualProofTitle: 'Audit natijasi',
          visualProofText:
            "Logo, nom, qadoq va kommunikatsiyadagi ishonchni pasaytirayotgan nuqtalarni aniq ko'rsatamiz.",
        }
      : dictionary;

  const proofItems: string[] = heroCopy.proofItems || [
    'Auditda 3 ta aniq muammo',
    'Qaysi xizmat kerakligini aytamiz',
    'Sotuvsiz bosim yoq',
  ];

  return (
    <section className="relative isolate max-w-[100vw] overflow-hidden bg-[#f6f1e8] pt-24 sm:pt-28 lg:pt-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(37,99,235,0.13),transparent_28rem),radial-gradient(circle_at_88%_12%,rgba(14,165,233,0.12),transparent_24rem),linear-gradient(180deg,#fbf7ef_0%,#eef5ff_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-white/90 to-transparent" />

      <div className="container mx-auto max-w-[1320px] overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[calc(100svh-7rem)] items-center gap-10 py-12 lg:grid-cols-[0.94fr_1.06fr] lg:gap-14 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto w-full max-w-[300px] text-center sm:max-w-3xl lg:mx-0 lg:w-full lg:text-left"
          >
            <div className="mb-5 inline-flex w-full max-w-[300px] items-center justify-center gap-2 rounded-full border border-slate-900/10 bg-white/70 px-4 py-2 text-center text-[8px] font-black uppercase tracking-[0.04em] text-slate-700 shadow-sm backdrop-blur sm:w-auto sm:max-w-full sm:text-[11px] sm:tracking-[0.22em]">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="min-w-0 text-balance">{heroCopy.preHeadline || 'Brendingni tushunarli qilamiz'}</span>
            </div>

            <h1 className="mx-auto max-w-[300px] text-balance text-[34px] font-black leading-[0.94] tracking-[-0.045em] text-slate-950 sm:max-w-none sm:text-[64px] sm:tracking-[-0.07em] lg:mx-0 lg:text-[78px] xl:text-[88px]">
              {renderHeadline(heroCopy.title || '', 'text-slate-950')}
            </h1>

            <p className="mx-auto mt-6 max-w-[300px] text-pretty text-base leading-8 text-slate-600 sm:max-w-2xl sm:text-xl lg:mx-0">
              {heroCopy.description}
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Button
                onClick={onOpenContact}
                size="lg"
                className="h-14 w-full rounded-2xl bg-slate-950 px-5 text-base font-black text-white shadow-[0_22px_60px_-28px_rgba(15,23,42,0.9)] hover:bg-blue-700 sm:h-16 sm:w-auto sm:px-9"
              >
                {heroCopy.cta || 'Bepul audit olish'}
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 w-full rounded-2xl border-slate-200 bg-white/75 px-5 text-base font-black text-slate-900 shadow-none hover:bg-white sm:h-16 sm:w-auto sm:px-7"
              >
                <Link href={localizedPath(lang, '/portfolio')}>
                  {heroCopy.ctaSecondary || 'Ishlarni ko‘rish'}
                </Link>
              </Button>
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-3">
              {proofItems.map((item) => (
                <div key={item} className="flex items-center justify-center gap-2 rounded-2xl border border-white/70 bg-white/62 px-3 py-3 text-sm font-bold text-slate-700 shadow-sm backdrop-blur lg:justify-start">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            className="relative mx-auto w-full max-w-2xl lg:max-w-none"
          >
            <div className="relative rounded-[2.25rem] border border-white/80 bg-white/62 p-3 shadow-[0_35px_100px_-55px_rgba(15,23,42,0.85)] backdrop-blur-xl sm:p-4">
              <div className="grid min-h-[360px] gap-3 sm:min-h-[520px] sm:grid-cols-2">
                {portfolioImages.length > 0 ? (
                  portfolioImages.map((image, index) => (
                    <div
                      key={`${image.src}-${index}`}
                      className={[
                        'relative overflow-hidden rounded-[1.65rem] bg-slate-100 ring-1 ring-slate-900/5',
                        index === 0 ? 'sm:row-span-2' : '',
                      ].join(' ')}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt || 'Jon.Branding portfolio namunasi'}
                        fill
                        priority={index < 2}
                        sizes="(max-width: 768px) 92vw, 48vw"
                        className="object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full flex items-center justify-center rounded-[1.65rem] bg-slate-100 p-10 text-center text-sm font-bold text-slate-500">
                    Portfolio namunalarini yuklash uchun Sanity media tekshiriladi.
                  </div>
                )}
              </div>

              <div className="absolute -bottom-6 left-5 right-5 rounded-3xl border border-slate-900/10 bg-slate-950 p-5 text-white shadow-[0_24px_70px_-35px_rgba(15,23,42,0.95)] sm:left-8 sm:right-auto sm:max-w-sm">
                <div className="mb-2 flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-blue-200">
                  <ShieldCheck className="h-4 w-4" />
                  {heroCopy.visualProofTitle || 'Audit natijasi'}
                </div>
                <p className="text-sm leading-6 text-white/78">
                  {heroCopy.visualProofText || 'Logo, nom, qadoq va kommunikatsiyadagi ishonchni pasaytirayotgan nuqtalarni aniq ko‘rsatamiz.'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

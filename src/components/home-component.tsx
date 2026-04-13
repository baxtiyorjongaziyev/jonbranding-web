
'use client';

import type { FC } from 'react';
import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Hero from '@/components/sections/hero';
import BentoResultsStats from '@/components/sections/bento-results-stats';
import TrustedBy from '@/components/sections/trusted-by';
import TargetAudience from '@/components/sections/target-audience';
import WhyUs from '@/components/sections/why-us';
import { Skeleton } from '@/components/ui/skeleton';
import { useTelegram } from '@/hooks/use-telegram';

const BeforeAfter = dynamic(() => import('@/components/sections/before-after'), { 
    loading: () => <Skeleton className="h-96 w-full rounded-3xl" /> 
});
const Testimonials = dynamic(() => import('@/components/sections/testimonials'), { 
    loading: () => <Skeleton className="h-64 w-full rounded-2xl" /> 
});
const Gallery = dynamic(() => import('@/components/sections/gallery'), { 
    loading: () => <Skeleton className="h-screen w-full" /> 
});
const FeaturedCaseStudy = dynamic(() => import('@/components/sections/featured-case-study'), { 
    loading: () => <Skeleton className="h-[500px] w-full rounded-3xl" /> 
});
const Founder = dynamic(() => import('@/components/sections/founder'), { 
    loading: () => <Skeleton className="h-96 w-full" /> 
});
const Faq = dynamic(() => import('@/components/sections/faq'), { 
    loading: () => <Skeleton className="h-64 w-full" /> 
});

const MobileCtaBar = dynamic(() => import('@/components/sections/mobile-cta-bar'), { ssr: false });
const Process = dynamic(() => import('@/components/sections/process'), { ssr: false });
const LeadMagnet = dynamic(() => import('@/components/sections/lead-magnet'), { ssr: false });
const PickTwoSelector = dynamic(() => import('@/components/sections/pick-two-selector'), { 
    loading: () => <Skeleton className="h-96 w-full" /> 
});
const LeadMagnetPopup = dynamic(() => import('@/components/ui/lead-magnet-popup'), { ssr: false });
const CtaBlock = dynamic(() => import('@/components/sections/cta-block'), { 
    loading: () => <Skeleton className="h-48 w-full rounded-2xl" /> 
});
const Video = dynamic(() => import('@/components/sections/video'), { ssr: false });
const Comparison = dynamic(() => import('@/components/sections/comparison'), { 
    loading: () => <Skeleton className="h-96 w-full" /> 
});
const Guarantee = dynamic(() => import('@/components/sections/guarantee'), { 
    loading: () => <Skeleton className="h-64 w-full" /> 
});
const UrgencyBlock = dynamic(() => import('@/components/sections/urgency-block'), { 
    loading: () => <Skeleton className="h-48 w-full" /> 
});
const QueueStatus = dynamic(() => import('@/components/sections/queue-status'), { 
    loading: () => <Skeleton className="h-64 w-full" /> 
});
const PersonalOfferBlock = dynamic(() => import('@/components/sections/personal-offer-block'), { 
    loading: () => <Skeleton className="h-[500px] w-full" /> 
});

const fadeInVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }
  }
};

const HomeComponent: FC<{ lang: string, dictionary: any }> = ({ lang, dictionary }) => {
    const [mounted, setMounted] = useState(false);
    const { tg } = useTelegram();

    const handleOpenModal = useCallback(() => {
        if (typeof window !== 'undefined') {
            const event = new CustomEvent('openContactModal');
            window.dispatchEvent(event);
        }
    }, []);
    
    useEffect(() => {
        setMounted(true);
        if (tg?.BackButton) {
            tg.BackButton.show();
        }
    }, [tg]);

    const renderHeadline = (headline: string) => {
        if (!headline) return '';
        
        // Split by both | and ** markers and whitespace to handle individual words
        // First handle markers to get chunks, then split chunks into words
        const segments = headline.split(/(\*\*.*?\*\*|\|.*?\|)/g);
        
        let wordCount = 0;

        return (
          <motion.span 
            initial="hidden" 
            animate="visible" 
            className="inline-block"
          >
            {segments.map((segment, i) => {
                const isDoubleStar = segment.startsWith('**') && segment.endsWith('**');
                const isPipe = segment.startsWith('|') && segment.endsWith('|');
                
                if (isDoubleStar || isPipe) {
                    const text = isDoubleStar ? segment.slice(2, -2) : segment.slice(1, -1);
                    return (
                        <motion.span 
                          key={i} 
                          variants={{
                            hidden: { opacity: 0, y: 10 },
                            visible: { 
                              opacity: 1, 
                              y: 0,
                              transition: { duration: 0.5, delay: wordCount++ * 0.05 }
                            }
                          }}
                          className="gradient inline-block animate-text-glow font-black"
                        >
                            {text}
                        </motion.span>
                    );
                }
                
                // For regular text, split into words for staggered reveal
                return segment.split(' ').map((word, j) => {
                  if (!word) return ' ';
                  return (
                    <motion.span
                      key={`${i}-${j}`}
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { 
                          opacity: 1, 
                          y: 0,
                          transition: { duration: 0.5, delay: wordCount++ * 0.05 }
                        }
                      }}
                      className="inline-block mr-[0.25em]"
                    >
                      {word}
                    </motion.span>
                  );
                });
            })}
          </motion.span>
        );
    };
    
    if (!dictionary || !dictionary.hero) {
        return <div className="py-20 text-center"><Skeleton className="h-screen w-full" /></div>;
    }

    return (
        <div suppressHydrationWarning>
            {/* SEO Keywords - Hidden from UI but visible to search engines */}
            <div className="sr-only">
                {lang === 'uz' ? "Ma'no Branding, Mountain Branding, Abba Marketing, Minim, RedFox Branding, Branding uz, Logo dizayn Tashkent, Neyming xizmati, Strategik brending." : 
                 lang === 'ru' ? "Брендинговое агентство Ташкент, дизайн логотипа, нейминг, брендинг в Узбекистане." :
                 "Branding Agency Tashkent, logo design Uzbekistan, naming services, brand strategy."}
            </div>
            
            <main>
                <Hero onPrimaryClick={handleOpenModal} lang={lang} dictionary={dictionary.hero} renderHeadline={renderHeadline} />
                
                <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
                    <TrustedBy lang={lang} dictionary={dictionary.trustedBy} />
                </motion.div>

                <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
                    <TargetAudience lang={lang} dictionary={dictionary.targetAudience} />
                </motion.div>

                <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
                    <WhyUs onCtaClick={handleOpenModal} lang={lang} dictionary={dictionary.whyUs} />
                </motion.div>

                <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
                    <PickTwoSelector onCtaClick={handleOpenModal} lang={lang} dictionary={dictionary.pickTwoSelector} />
                </motion.div>

                <BentoResultsStats dictionary={dictionary} />

                <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
                    <BeforeAfter onCtaClick={handleOpenModal} lang={lang} dictionary={dictionary.beforeAfter} />
                </motion.div>

                <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
                    <Testimonials lang={lang} dictionary={dictionary.testimonials} />
                </motion.div>

                <Gallery lang={lang} dictionary={dictionary.gallery} />
                
                <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
                    <FeaturedCaseStudy lang={lang} dictionary={dictionary.featuredCaseStudy || {}} />
                </motion.div>

                {mounted && (
                    <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
                        <Guarantee dictionary={dictionary.guaranteeBlock} />
                    </motion.div>
                )}
                {mounted ? (
                    <>
                        <QueueStatus onCtaClick={handleOpenModal} />

                        <Video />
                        
                        <CtaBlock 
                            title={dictionary.home?.cta1_title}
                            description={dictionary.home?.cta1_desc}
                            buttonText={dictionary.home?.cta1_button}
                            onCtaClick={handleOpenModal}
                        />

                        <Founder lang={lang} dictionary={dictionary.founder} />
                        <Process onCtaClick={handleOpenModal} lang={lang} dictionary={dictionary.process} />
                        <LeadMagnet onCtaClick={handleOpenModal} lang={lang} dictionary={dictionary.leadMagnet} />
                        <Faq lang={lang} dictionary={dictionary.faq} />
                    </>
                ) : (
                    <div className="space-y-20 py-20 container mx-auto">
                        <Skeleton className="h-96 w-full rounded-3xl" />
                    </div>
                )}
            </main>
            {mounted && <MobileCtaBar onOpenModal={handleOpenModal} lang={lang} dictionary={dictionary.mobileCtaBar} />}
        </div>
    )
};

export default HomeComponent;

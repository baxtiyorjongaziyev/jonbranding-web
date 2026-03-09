
'use client';

import type { FC } from 'react';
import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Hero from '@/components/sections/hero';
import Stats from '@/components/sections/stats';
import TrustedBy from '@/components/sections/trusted-by';
import TargetAudience from '@/components/sections/target-audience';
import WhyUs from '@/components/sections/why-us';
import BeforeAfter from '@/components/sections/before-after';
import Testimonials from '@/components/sections/testimonials';
import Gallery from '@/components/sections/gallery';
import FeaturedCaseStudy from '@/components/sections/featured-case-study';
import Video from '@/components/sections/video';
import CtaBlock from '@/components/sections/cta-block';
import Founder from '@/components/sections/founder';
import Faq from '@/components/sections/faq';
import { Skeleton } from '@/components/ui/skeleton';
import { useTelegram } from '@/hooks/use-telegram';

const MobileCtaBar = dynamic(() => import('@/components/sections/mobile-cta-bar'), { ssr: false });
const Process = dynamic(() => import('@/components/sections/process'), { ssr: false });
const LeadMagnet = dynamic(() => import('@/components/sections/lead-magnet'), { ssr: false });

const fadeInVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
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
        const parts = headline.split('|');
        if (parts.length === 3) {
            return (
                <>
                    {parts[0]}
                    <span className="gradient">{parts[1]}</span>
                    {parts[2]}
                </>
            );
        }
        return headline.replace(/\|/g, '');
    };
    
    if (!dictionary || !dictionary.hero) {
        return <div className="py-20 text-center"><Skeleton className="h-screen w-full" /></div>;
    }

    return (
        <div suppressHydrationWarning>
            {/* SEO Keywords - Hidden from UI but visible to search engines */}
            <div className="sr-only">
                Ma'no Branding, Mountain Branding, Abba Marketing, Minim, RedFox Branding, Branding uz, Logo dizayn Tashkent, Neyming xizmati, Strategik brending.
            </div>
            
            <main>
                <Hero onPrimaryClick={handleOpenModal} lang={lang} dictionary={dictionary.hero} renderHeadline={renderHeadline} />
                
                <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
                    <Stats dictionary={dictionary.stats} />
                </motion.div>

                <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
                    <TrustedBy lang={lang} dictionary={dictionary.trustedBy} />
                </motion.div>

                <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
                    <TargetAudience lang={lang} dictionary={dictionary.targetAudience} />
                </motion.div>

                <motion.div variants={fadeInVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
                    <WhyUs onCtaClick={handleOpenModal} lang={lang} />
                </motion.div>

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
                
                {mounted ? (
                    <>
                        <Video />
                        <CtaBlock 
                            title={dictionary.home?.cta1_title || "Sizning brendingiz ham shunday ko'rinishi mumkin."}
                            description={dictionary.home?.cta1_desc || "Professional dizayn bilan biznesingizni yangi bosqichga olib chiqing."}
                            buttonText={dictionary.home?.cta1_button || "Mening biznesim uchun ham"}
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

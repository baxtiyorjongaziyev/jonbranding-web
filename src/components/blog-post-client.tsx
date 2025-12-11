
'use client';

import { type BlogPost } from '@/lib/types';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { uz, ru, enUS } from 'date-fns/locale';
import CtaBlock from '@/components/sections/cta-block';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { Skeleton } from './ui/skeleton';

const BlogPostClient = ({ post }: { post: BlogPost }) => {
  const params = useParams();
  const lang = params.lang as Locale;
  const [translations, setTranslations] = useState<any>(null);

  useEffect(() => {
    if (lang) {
      getDictionary(lang).then(dict => setTranslations(dict.blogPost));
    }
  }, [lang]);
  
  const handleOpenModal = () => {
    const contactEvent = new CustomEvent('openContactModal');
    window.dispatchEvent(contactEvent);
  };
  
  if (!translations) {
    return <main className="flex-grow bg-white"><Skeleton className="h-screen w-full"/></main>;
  }

  const locale = lang === 'ru' ? ru : (lang === 'en' ? enUS : uz);

  return (
    <main className="flex-grow bg-white">
      <article>
        <header className="py-16 sm:py-24 bg-secondary/70">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-dark-blue leading-tight">
              {post.title}
            </h1>
            <p className="mt-6 text-lg text-gray-600">
                <span>{format(parseISO(post.date), 'MMMM d, yyyy', { locale })}</span>
                {' '} &bull; {' '}
                <span>{translations.author}: {post.author}</span>
            </p>
          </div>
        </header>

        <div className="container mx-auto px-4 -mt-16 z-10 relative">
          <div className="w-full rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="https://img1.teletype.in/files/81/55/8155bf93-39f5-45b3-b996-55115f926e79.jpeg"
              alt={post.title}
              data-ai-hint={post.imageHint}
              width={1200}
              height={630}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto prose lg:prose-xl">
             <p className="text-xl text-gray-700 font-semibold leading-relaxed mb-8 border-l-4 border-primary pl-4">
                {post.description}
            </p>
            <div dangerouslySetInnerHTML={{ __html: post.htmlContent || '' }} />
          </div>
        </div>
      </article>
      
       <CtaBlock 
            title={translations.ctaTitle}
            description={translations.ctaDesc}
            buttonText={translations.ctaButton}
            onCtaClick={handleOpenModal}
        />
    </main>
  );
};

export default BlogPostClient;

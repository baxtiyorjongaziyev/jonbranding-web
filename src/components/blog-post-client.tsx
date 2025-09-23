
'use client';

import { type BlogPost } from '@/lib/types';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { uz } from 'date-fns/locale';
import CtaBlock from '@/components/sections/cta-block';
import React from 'react';

const BlogPostClient = ({ post }: { post: BlogPost }) => {
  
  const handleOpenModal = () => {
    const contactEvent = new CustomEvent('openContactModal');
    window.dispatchEvent(contactEvent);
  };

  return (
    <main className="flex-grow bg-white">
      <article>
        <header className="py-16 sm:py-24 bg-secondary/70">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-dark-blue leading-tight">
              {post.title}
            </h1>
            <p className="mt-6 text-lg text-gray-600">
                <span>{format(parseISO(post.date), 'd-MMMM, yyyy', { locale: uz })}</span>
                {' '} &bull; {' '}
                <span>Muallif: {post.author}</span>
            </p>
          </div>
        </header>

        <div className="container mx-auto px-4 -mt-16 z-10 relative">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={post.image}
              alt={post.title}
              data-ai-hint={post.imageHint}
              fill
              className="object-cover"
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
            title="Maqola foydali bo'ldimi?"
            description="Endi nazariyadan amaliyotga o'tish vaqti keldi. Brendingizni biz bilan keyingi bosqichga olib chiqing."
            buttonText="Bepul konsultatsiya olish"
            onCtaClick={handleOpenModal}
        />
    </main>
  );
};

export default BlogPostClient;

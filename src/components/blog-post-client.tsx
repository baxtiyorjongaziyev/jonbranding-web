'use client';

import { type BlogPost } from '@/lib/types';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { uz } from 'date-fns/locale';
import CtaBlock from '@/components/sections/cta-block';
import React from 'react';

// Renders simple markdown-like syntax to HTML elements for both bold and italic
const renderTextWithFormatting = (text: string) => {
    // Regex to find **bold** or *italic* text. It's important to check for ** first.
    const markdownRegex = /(\*\*(.*?)\*\*|\*(.*?)\*)/g;
    const parts = text.split(markdownRegex);

    return parts.filter(Boolean).map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            // It's a bold part
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            // It's an italic part
            return <em key={index}>{part.slice(1, -1)}</em>;
        }
        // It's a regular text part
        return part;
    });
};


// Markdown-like content to HTML
const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let listBuffer: { type: 'ul' | 'ol'; items: React.ReactNode[] } | null = null;

    const flushListBuffer = () => {
        if (listBuffer) {
            const ListComponent = listBuffer.type;
            const key = `${ListComponent}-${elements.length}`;
            elements.push(
                <ListComponent key={key} className={`list-${listBuffer.type === 'ul' ? 'disc' : 'decimal'} pl-5 my-6 space-y-2`}>
                    {listBuffer.items}
                </ListComponent>
            );
            listBuffer = null;
        }
    };

    lines.forEach((line, i) => {
        const trimmedLine = line.trim();

        if (trimmedLine.startsWith('## ')) {
            flushListBuffer();
            elements.push(<h2 key={i} className="text-2xl sm:text-3xl font-bold text-dark-blue mt-8 mb-4">{renderTextWithFormatting(trimmedLine.substring(3))}</h2>);
        } else if (trimmedLine.startsWith('> ')) {
            flushListBuffer();
            elements.push(
                <blockquote key={i} className="border-l-4 border-primary pl-4 italic text-gray-700 my-6">
                    {renderTextWithFormatting(trimmedLine.substring(2))}
                </blockquote>
            );
        } else if (trimmedLine.startsWith('* ')) {
            if (listBuffer?.type !== 'ul') flushListBuffer();
            if (!listBuffer) listBuffer = { type: 'ul', items: [] };
            listBuffer.items.push(<li key={i} className="text-lg text-gray-800 leading-relaxed">{renderTextWithFormatting(trimmedLine.substring(2))}</li>);
        } else if (trimmedLine.match(/^\d+\.\s/)) {
            if (listBuffer?.type !== 'ol') flushListBuffer();
            if (!listBuffer) listBuffer = { type: 'ol', items: [] };
            listBuffer.items.push(<li key={i} className="text-lg text-gray-800 leading-relaxed">{renderTextWithFormatting(trimmedLine.substring(trimmedLine.indexOf(' ') + 1))}</li>);
        } else if (trimmedLine === '') {
            flushListBuffer();
        } else {
            flushListBuffer();
            elements.push(<p key={i} className="text-lg text-gray-800 leading-relaxed mb-4">{renderTextWithFormatting(trimmedLine)}</p>);
        }
    });

    flushListBuffer(); // Flush any remaining list items at the end

    return elements;
};


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
            {renderContent(post.content)}
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

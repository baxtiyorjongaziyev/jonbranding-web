
import { blogPosts } from '@/lib/blog-data';
import { type BlogPost } from '@/lib/types';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { uz } from 'date-fns/locale';
import { Metadata } from 'next';
import CtaBlock from '@/components/sections/cta-block';
import React from 'react';

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    return {
      title: 'Maqola topilmadi',
    };
  }

  return {
    title: `${post.title} | Jon.Branding Blog`,
    description: post.description,
     alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} | Jon.Branding Blog`,
      description: post.description,
      url: `https://jonbranding.uz/blog/${post.slug}`,
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author],
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | Jon.Branding Blog`,
      description: post.description,
      images: [post.image],
    },
  };
}

// Markdown-like content to HTML
const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements = [];
    let listItems: {type: 'ul' | 'ol', items: string[]} = {type: 'ul', items: []};

    const flushList = () => {
        if (listItems.items.length > 0) {
            if (listItems.type === 'ul') {
                 elements.push(<ul key={`ul-${elements.length}`} className="list-disc pl-5 my-6 space-y-2">{listItems.items.map((li, idx) => <li key={idx} className="text-lg text-gray-800 leading-relaxed">{li}</li>)}</ul>);
            } else {
                elements.push(<ol key={`ol-${elements.length}`} className="list-decimal pl-5 my-6 space-y-2">{listItems.items.map((li, idx) => <li key={idx} className="text-lg text-gray-800 leading-relaxed">{li}</li>)}</ol>);
            }
            listItems = {type: 'ul', items: []};
        }
    };


    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        if (line.startsWith('## ')) {
            flushList();
            elements.push(<h2 key={i} className="text-2xl sm:text-3xl font-bold text-dark-blue mt-8 mb-4">{line.substring(3)}</h2>);
        } else if (line.startsWith('> ')) {
            flushList();
            elements.push(
                <blockquote key={i} className="border-l-4 border-primary pl-4 italic text-gray-700 my-6">
                    {line.substring(2)}
                </blockquote>
            );
        } else if (line.startsWith('*   ')) {
            if (listItems.type !== 'ul') flushList();
            listItems.type = 'ul';
            listItems.items.push(line.substring(4));
        } else if (line.match(/^\d+\.\s/)) {
            if (listItems.type !== 'ol') flushList();
            listItems.type = 'ol';
            listItems.items.push(line.substring(line.indexOf(' ') + 1));
        } else if (line === '') {
            flushList();
            elements.push(<br key={i} />);
        } else {
            flushList();
            elements.push(<p key={i} className="text-lg text-gray-800 leading-relaxed mb-4">{line}</p>);
        }
    }
    
    flushList(); // End of content flush

    return elements;
};


const BlogPostPage = ({ params }: { params: { slug: string } }) => {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }
  
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

export default BlogPostPage;

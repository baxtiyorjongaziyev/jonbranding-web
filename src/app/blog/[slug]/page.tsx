
import { blogPosts } from '@/lib/blog-data';
import { type BlogPost } from '@/lib/types';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { uz } from 'date-fns/locale';
import { Metadata } from 'next';
import CtaBlock from '@/components/sections/cta-block';

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
    return content
        .split('\n')
        .map((line, index) => {
            line = line.trim();
            if (line.startsWith('## ')) {
                return <h2 key={index} className="text-2xl sm:text-3xl font-bold text-dark-blue mt-8 mb-4">{line.substring(3)}</h2>;
            }
            if (line.startsWith('> ')) {
                return (
                    <blockquote key={index} className="border-l-4 border-primary pl-4 italic text-gray-700 my-6">
                        {line.substring(2)}
                    </blockquote>
                );
            }
            if (line.startsWith('*   ')) {
                 return <li key={index} className="mb-2 ml-6">{line.substring(4)}</li>;
            }
            if (line.match(/^\d+\.\s/)) {
                 return <li key={index} className="mb-2 ml-6">{line.substring(line.indexOf(' ') + 1)}</li>;
            }
            if (line === '') {
                return <br key={index} />;
            }
            return <p key={index} className="text-lg text-gray-800 leading-relaxed mb-4">{line}</p>;
        });
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
`
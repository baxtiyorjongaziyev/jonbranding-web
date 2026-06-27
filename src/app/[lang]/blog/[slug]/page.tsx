import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { getPostData, getAllPostSlugs } from '@/lib/blog-posts';

export const revalidate = 300;

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((s) => ({ lang: s.lang, slug: s.slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang, slug } = await props.params;
  const safeLang = (['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz') as Locale;
  const post = await getPostData(safeLang, slug);
  if (!post) return { title: 'Maqola topilmadi' };
  return {
    title: `${post.title} | Jon.Branding Blog`,
    description: post.description || post.title,
    openGraph: { title: post.title, description: post.description, images: post.image ? [{ url: post.image }] : [] },
  };
}

export default async function BlogPostPage(props: Props) {
  const { lang, slug } = await props.params;
  const safeLang = (['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz') as Locale;

  const post = await getPostData(safeLang, slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-[#05070f] pt-32 pb-24 text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none z-0" />

      <article className="container mx-auto px-4 max-w-3xl relative z-10">
        <Link href={`/${safeLang}/blog`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-8">
          ← {safeLang === 'uz' ? 'Blogga qaytish' : safeLang === 'ru' ? 'Назад к блогу' : safeLang === 'zh' ? '返回博客' : 'Back to blog'}
        </Link>

        {post.date && (
          <time className="text-xs text-gray-500 uppercase tracking-widest">
            {new Date(post.date).toLocaleDateString(safeLang === 'uz' ? 'uz-UZ' : safeLang === 'ru' ? 'ru-RU' : safeLang === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
        )}

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mt-4 mb-6 leading-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
          {post.title}
        </h1>

        {post.description && (
          <p className="text-lg text-gray-400 mb-10 leading-relaxed">{post.description}</p>
        )}

        {post.image && (
          <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden mb-12 border border-white/5">
            <Image src={post.image} alt={post.title} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" priority />
          </div>
        )}

        {post.htmlContent && (
          <div
            className="prose prose-invert prose-lg max-w-none [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-white [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-white [&_p]:text-gray-300 [&_p]:leading-relaxed [&_p]:mb-4 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500/50 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-400 [&_li]:text-gray-300 [&_strong]:text-white"
            dangerouslySetInnerHTML={{ __html: post.htmlContent }}
          />
        )}
      </article>
    </div>
  );
}

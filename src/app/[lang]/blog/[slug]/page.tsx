import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import Link from 'next/link';
import Image from 'next/image';
import { getDictionary, Locale } from '@/lib/dictionaries';

export const revalidate = 300;

type Props = { params: Promise<{ lang: string; slug: string }> };

const POST_QUERY = `*[_type == "post" && slug.current == $slug && language == $lang][0] {
  _id,
  title,
  "slug": slug.current,
  description,
  "image": image.asset->url + "?w=1200&q=85",
  content,
  publishedAt
}`;

const ALL_POSTS_QUERY = `*[_type == "post" && language == $lang] { "slug": slug.current }`;

export async function generateStaticParams() {
  const posts = await client.fetch(ALL_POSTS_QUERY, { lang: 'uz' }).catch(() => []);
  const params: { lang: string; slug: string }[] = [];
  ['uz', 'ru', 'en', 'zh'].forEach((lang) => {
    posts.forEach((p: any) => params.push({ lang, slug: p.slug }));
  });
  return params;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang, slug } = await props.params;
  const safeLang = (['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz') as Locale;
  const post = await client.fetch(POST_QUERY, { slug, lang: safeLang }).catch(() => null);
  if (!post) return { title: 'Maqola topilmadi' };
  return {
    title: `${post.title} | Jon.Branding Blog`,
    description: post.description || post.title,
    openGraph: { title: post.title, description: post.description, images: post.image ? [{ url: post.image }] : [] },
  };
}

function PortableText({ content }: { content: any[] }) {
  if (!content || !Array.isArray(content)) return null;
  return (
    <div className="prose prose-invert prose-lg max-w-none">
      {content.map((block: any, i: number) => {
        if (block._type === 'block') {
          const text = block.children?.map((c: any) => c.text).join('') || '';
          const Tag = block.style === 'h2' ? 'h2' : block.style === 'h3' ? 'h3' : 'p';
          return <Tag key={i} className={block.style === 'h2' ? 'text-2xl font-bold mt-10 mb-4 text-white' : block.style === 'h3' ? 'text-xl font-semibold mt-8 mb-3 text-white' : 'text-gray-300 leading-relaxed mb-4'}>{text}</Tag>;
        }
        if (block._type === 'image' && block.asset) {
          return (
            <div key={i} className="relative h-64 sm:h-96 rounded-2xl overflow-hidden my-8 border border-white/5">
              <Image src={block.asset.url} alt="" fill sizes="100vw" className="object-cover" />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

export default async function BlogPostPage(props: Props) {
  const { lang, slug } = await props.params;
  const safeLang = (['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz') as Locale;

  const post = await client.fetch(POST_QUERY, { slug, lang: safeLang }).catch(() => null);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-[#05070f] pt-32 pb-24 text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none z-0" />

      <article className="container mx-auto px-4 max-w-3xl relative z-10">
        <Link href={`/${safeLang}/blog`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-8">
          ← {safeLang === 'uz' ? 'Blogga qaytish' : safeLang === 'ru' ? 'Назад к блогу' : safeLang === 'zh' ? '返回博客' : 'Back to blog'}
        </Link>

        {post.publishedAt && (
          <time className="text-xs text-gray-500 uppercase tracking-widest">
            {new Date(post.publishedAt).toLocaleDateString(safeLang === 'uz' ? 'uz-UZ' : safeLang === 'ru' ? 'ru-RU' : safeLang === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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

        <PortableText content={post.content} />
      </article>
    </div>
  );
}

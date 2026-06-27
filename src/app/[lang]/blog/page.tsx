import { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import Link from 'next/link';
import Image from 'next/image';
import { getDictionary, Locale } from '@/lib/dictionaries';

export const revalidate = 300;

type Props = { params: Promise<{ lang: string }> };

const POSTS_QUERY = `*[_type == "post" && language == $lang] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  description,
  "image": image.asset->url + "?w=800&q=80",
  publishedAt
}`;

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang } = await props.params;
  const safeLang = (['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz') as Locale;
  const titles = {
    uz: 'Blog | Jon.Branding',
    ru: 'Блог | Jon.Branding',
    en: 'Branding Blog | Jon.Branding',
    zh: '博客 | Jon.Branding'
  };
  const descs = {
    uz: 'Brending, dizayn va marketing haqida foydali maqolalar. Neyming, logotip, brend strategiyasi va qadoq dizayni bo\'yicha ekspert maslahatlari.',
    ru: 'Полезные статьи и аналитика о брендинге, дизайне и маркетинге. Экспертные советы по неймингу, логотипу, бренд-стратегии и дизайну упаковки.',
    en: 'Actionable articles about branding, naming, logo design and marketing strategy. Expert tips to grow your business with professional brand identity.',
    zh: '关于品牌塑造、命名、标志设计和营销策略的实用文章。通过专业品牌标识发展业务的专家建议。',
  };
  return {
    title: titles[safeLang],
    description: descs[safeLang],
    openGraph: {
      title: titles[safeLang],
      description: descs[safeLang],
      images: [{ url: '/images/cms/og-image.jpeg', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[safeLang],
      description: descs[safeLang],
      images: ['/images/cms/og-image.jpeg'],
    },
  };
}

export default async function BlogPage(props: Props) {
  const { lang } = await props.params;
  const safeLang = (['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz') as Locale;

  let posts: any[] = [];
  try {
    posts = await client.fetch(POSTS_QUERY, { lang: safeLang });
  } catch (e) {
    console.error('Blog fetch failed:', e);
  }

  let dictionary;
  try { dictionary = await getDictionary(safeLang); } catch { dictionary = await getDictionary('uz'); }

  const l = {
    uz: { label: 'Blog', title: 'Maqolalar', empty: 'Hozircha maqolalar yo\'q.', back: 'Bosh sahifaga' },
    ru: { label: 'Блог', title: 'Статьи', empty: 'Пока нет статей.', back: 'На главную' },
    en: { label: 'Blog', title: 'Articles', empty: 'No articles yet.', back: 'Homepage' },
    zh: { label: '博客', title: '文章', empty: '暂无文章。', back: '首页' },
  }[safeLang];

  return (
    <div className="min-h-screen bg-[#05070f] pt-32 pb-24 text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[150px] pointer-events-none z-0" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            {l.label}
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            {l.title}
          </h1>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p>{l.empty}</p>
            <Link href={`/${safeLang}`} className="mt-4 inline-block text-blue-400 hover:text-blue-300 text-sm font-medium">
              {l.back} →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {posts.map((post) => (
              <Link key={post._id} href={`/${safeLang}/blog/${post.slug}`} className="group block">
                <div className="relative h-56 rounded-2xl overflow-hidden mb-4 border border-white/5">
                  {post.image ? (
                    <Image src={post.image} alt={post.title} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-600/20 to-violet-600/20" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                  {post.title}
                </h3>
                {post.description && (
                  <p className="text-sm text-gray-400 line-clamp-2">{post.description}</p>
                )}
                {post.publishedAt && (
                  <time className="text-xs text-gray-600 mt-2 block">
                    {new Date(post.publishedAt).toLocaleDateString(safeLang === 'uz' ? 'uz-UZ' : safeLang === 'ru' ? 'ru-RU' : safeLang === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </time>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

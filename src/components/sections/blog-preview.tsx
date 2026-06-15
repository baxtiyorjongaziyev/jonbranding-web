import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import DOMPurify from 'isomorphic-dompurify';
import { getSortedPostsData } from '@/lib/blog-posts';
import { BrandSection, SectionIntro } from '@/components/ui/design-system';
import { Locale } from '@/lib/dictionaries';
import { getLocalizedPath } from '@/lib/i18n/locale';

const blogCardImages = [
  '/images/cms/blog-post-hero.jpeg',
  '/images/cms/brandbook-guide.jpeg',
  '/images/cms/corporate-identity.jpeg',
  '/images/cms/packaging-shelf.webp',
  '/images/cms/naming-process.webp',
  '/images/cms/brand-strategy-team.webp',
];

interface BlogPreviewProps {
  lang: string;
  dictionary?: {
    title?: string;
    subtitle?: string;
    readMore?: string;
    viewAll?: string;
  };
}

const sanitizePlainText = (value?: string) =>
  DOMPurify.sanitize(value || '', { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim();

const sanitizeSlug = (slug: string) => slug.toLowerCase().replace(/[^a-z0-9-]/g, '');

export default function BlogPreview({ lang, dictionary }: BlogPreviewProps) {
  const posts = getSortedPostsData(lang).slice(0, 3);

  const t = {
    title: dictionary?.title || (lang === 'ru' ? 'Наш Блог' : lang === 'en' ? 'Our Blog' : lang === 'zh' ? '我们的博客' : 'Blog'),
    subtitle: dictionary?.subtitle || (lang === 'ru' ? 'Статьи о брендинге, дизайне и маркетинге.' : lang === 'en' ? 'Articles on branding, design and marketing.' : lang === 'zh' ? '关于品牌、设计和营销的文章。' : 'Brending, dizayn va marketing haqida maqolalar.'),
    readMore: dictionary?.readMore || (lang === 'ru' ? 'Подробнее' : lang === 'en' ? 'Read more' : lang === 'zh' ? '阅读更多' : 'Batafsil'),
    viewAll: dictionary?.viewAll || (lang === 'ru' ? 'Все статьи' : lang === 'en' ? 'All articles' : lang === 'zh' ? '所有文章' : 'Barcha maqolalar'),
  };

  if (!posts.length) return null;

  return (
    <BrandSection id="blog-preview" tone="light">
      <div className="container mx-auto px-4">
        <SectionIntro eyebrow="Blog" title={t.title} description={t.subtitle} />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {posts.map((post, index) => {
            const slug = sanitizeSlug(post.slug);
            const title = sanitizePlainText(post.title);
            const description = sanitizePlainText(post.description);

            if (!slug) return null;

            return (
              <Link
                key={slug}
                href={getLocalizedPath(lang as Locale, `/blog/${slug}`)}
                className="group block"
              >
              <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-brand-line/60 bg-white/80 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="relative h-48 w-full overflow-hidden flex-shrink-0">
                  <Image
                    src={blogCardImages[index % blogCardImages.length]}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="flex flex-grow flex-col p-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-blue">
                    {post.date?.slice(0, 7)}
                  </p>
                  <h3 className="mb-3 flex-grow text-base font-bold leading-snug text-brand-ink line-clamp-3 group-hover:text-brand-blue transition-colors duration-200">
                    {title}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-brand-slate line-clamp-2">
                    {description}
                  </p>
                  <span className="mt-auto flex items-center gap-1 text-sm font-semibold text-brand-blue">
                    {t.readMore}
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </div>
              </article>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href={getLocalizedPath(lang as Locale, '/blog')}
            className="inline-flex items-center gap-2 rounded-full border border-brand-line bg-white px-7 py-3 text-sm font-semibold text-brand-ink shadow-sm transition-all duration-200 hover:border-brand-blue hover:text-brand-blue hover:shadow-md"
          >
            {t.viewAll}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </BrandSection>
  );
}

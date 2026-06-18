import { Metadata } from 'next';
import { getSortedPostsData } from '@/lib/blog-posts';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { uz, ru, enUS } from 'date-fns/locale';
import { getDictionary, Locale } from '@/lib/dictionaries';
import { getLocalizedPath } from '@/lib/i18n/locale';

type Props = {
  params: Promise<{ lang: string }>;
};

const isSafePathSegment = (value: string) => /^[a-z0-9-]+$/i.test(value);

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang } = await props.params;
  const safeLang = (['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz') as Locale;
  const titles: Record<string, string> = {
    uz: "Jon.Branding Blog | Branding, Dizayn va Marketing",
    ru: "Блог Jon.Branding | Брендинг, Дизайн и Маркетинг",
    en: "Jon.Branding Blog | Branding, Design and Marketing",
    zh: "Jon.Branding 博客 | 品牌、设计和营销",
  };
  const descs: Record<string, string> = {
    uz: "Brending, neyming va dizayn sohasidagi eng so'nggi maqolalar va tavsiyalar.",
    ru: "Последние статьи и советы по брендингу, неймингу и дизайну.",
    en: "Latest articles and tips on branding, naming and design.",
    zh: "关于品牌、命名和设计的最新文章和技巧。",
  };
  return {
    title: titles[safeLang],
    description: descs[safeLang],
  };
}

const BlogPage = async (props: Props) => {
  const { lang } = await props.params;
  const safeLang = isSafePathSegment(lang) ? lang : 'uz';
  const sortedPosts = getSortedPostsData(safeLang as Locale);
  const dictionary = await getDictionary(safeLang as Locale);
  const translations = dictionary.blog;
  const blogCardImages = [
    '/images/cms/blog-post-hero.jpeg',
    '/images/cms/brandbook-guide.jpeg',
    '/images/cms/corporate-identity.jpeg',
    '/images/cms/packaging-shelf.webp',
    '/images/cms/naming-process.webp',
    '/images/cms/brand-strategy-team.webp',
  ];
  
  const locale = safeLang === 'ru' ? ru : (safeLang === 'en' ? enUS : uz);

  return (
    <main className="flex-grow bg-secondary/50">
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-dark-blue" suppressHydrationWarning>
              {translations?.title}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg md:text-xl text-gray-700" suppressHydrationWarning>
              {translations?.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedPosts.map((post, index) => {
              if (!isSafePathSegment(post.slug)) return null;

              const postHref = getLocalizedPath(safeLang as Locale, `/blog/${post.slug}`);

              return (
                <Link key={post.slug} href={postHref} className="block group press-effect">
                  <Card className="h-full flex flex-col overflow-hidden shadow-lg rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl">
                    <div className="relative w-full h-56 flex-shrink-0 overflow-hidden">
                      <Image
                        src={blogCardImages[index % blogCardImages.length]}
                        alt={post.title}
                        data-ai-hint={post.imageHint}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>
                    </div>
                    <div className="flex flex-col flex-grow">
                      <CardHeader>
                        <CardDescription className="text-sm text-gray-500 pt-1">
                          <span>{format(parseISO(post.date), 'MMMM d, yyyy', { locale })}</span>
                          {' '} &bull; {' '}
                          <span>{post.author}</span>
                        </CardDescription>
                        <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-gray-600 line-clamp-3">{post.description}</p>
                      </CardContent>
                      <div className="p-6 pt-0 mt-auto">
                         <span className="font-semibold text-primary flex items-center transition-all duration-300">
                            {translations?.readMore} <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                         </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default BlogPage;

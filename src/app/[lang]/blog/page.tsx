
import { getSortedPostsData } from '@/lib/blog-posts';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { uz, ru, enUS } from 'date-fns/locale';
import { getDictionary, Locale } from '@/lib/dictionaries';

const BlogPage = async (props: { params: Promise<{ lang: string }> }) => {
  const { lang } = await props.params;
  const sortedPosts = getSortedPostsData(lang);
  const dictionary = await getDictionary(lang as Locale);
  const translations = dictionary.blog;
  
  const locale = lang === 'ru' ? ru : (lang === 'en' ? enUS : uz);

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
            {sortedPosts.map((post) => (
              <Link key={post.slug} href={`/${lang}/blog/${post.slug}`} className="block group">
                <Card className="h-full flex flex-col overflow-hidden shadow-lg rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl">
                  <div className="relative w-full h-56 flex-shrink-0 overflow-hidden">
                    <Image
                      src={post.image}
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
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default BlogPage;

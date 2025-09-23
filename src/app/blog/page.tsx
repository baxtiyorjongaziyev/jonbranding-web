
import { getSortedPostsData } from '@/lib/blog-posts';
import { type BlogPost } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { uz } from 'date-fns/locale';

const BlogPage = () => {
  const sortedPosts = getSortedPostsData();

  return (
    <main className="flex-grow bg-secondary/50">
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-dark-blue">
              Bizning Blog
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg md:text-xl text-gray-700">
              Brending, marketing va dizayn olamidagi so'nggi yangiliklar, maslahatlar va tahliliy maqolalar. Biznesingizni o'stirishga yordam beramiz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <Card className="h-full flex flex-col overflow-hidden shadow-lg rounded-2xl transform hover:-translate-y-2 transition-transform duration-300">
                  <div className="relative w-full h-56 flex-shrink-0">
                    <Image
                      src={post.image}
                      alt={post.title}
                      data-ai-hint={post.imageHint}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 pt-1">
                      <span>{format(parseISO(post.date), 'd-MMMM, yyyy', { locale: uz })}</span>
                      {' '} &bull; {' '}
                      <span>{post.author}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-600 line-clamp-3">{post.description}</p>
                  </CardContent>
                  <div className="p-6 pt-0 mt-auto">
                     <span className="font-semibold text-primary group-hover:underline flex items-center">
                        Batafsil o'qish <ArrowRight className="ml-2 h-4 w-4" />
                     </span>
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

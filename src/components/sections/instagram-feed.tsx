'use client';
import { FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Instagram, Heart, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InstagramPost {
  id: string;
  media_url: string;
  permalink: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
}

interface InstagramFeedProps {
  dictionary: any;
  lang: string;
}

const FALLBACK_POSTS = [
  {
    id: '1',
    media_url: 'https://cdn.sanity.io/images/h6ymmj0v/production/892bb83f982187c34f37dc1d2830f3050fb3f9f7-2880x1800.png',
    permalink: 'https://instagram.com/jonbranding',
    media_type: 'IMAGE',
  },
  {
    id: '2',
    media_url: 'https://cdn.sanity.io/images/h6ymmj0v/production/9ed2b146afb3bb379b3846b0d912b7a421685718-2880x1800.png',
    permalink: 'https://instagram.com/jonbranding',
    media_type: 'IMAGE',
  },
  {
    id: '3',
    media_url: 'https://cdn.sanity.io/images/h6ymmj0v/production/9f38c64bb9c5de20bdfbdfcd99dcc313e658ceab-2880x1800.png',
    permalink: 'https://instagram.com/jonbranding',
    media_type: 'IMAGE',
  },
  {
    id: '4',
    media_url: 'https://cdn.sanity.io/images/h6ymmj0v/production/02521dd9d7c0792cd8e411ef84f6834b6ba3028c-2880x1800.png',
    permalink: 'https://instagram.com/jonbranding',
    media_type: 'IMAGE',
  },
  {
    id: '5',
    media_url: 'https://cdn.sanity.io/images/h6ymmj0v/production/9ec96c0baab4043b8110b98eb6970bc2eab59df5-2880x1800.png',
    permalink: 'https://instagram.com/jonbranding',
    media_type: 'IMAGE',
  },
  {
    id: '6',
    media_url: 'https://cdn.sanity.io/images/h6ymmj0v/production/2d0e2e5e1e550eef530e872d829dc7792691e847-2880x1800.png',
    permalink: 'https://instagram.com/jonbranding',
    media_type: 'IMAGE',
  },
];

const InstagramFeed: FC<InstagramFeedProps> = ({ dictionary, lang }) => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInstagram() {
      try {
        const res = await fetch('/api/instagram');
        const data = await res.json();
        if (data && data.data && data.data.length > 0) {
          setPosts(data.data.slice(0, 6));
        } else {
          setPosts(FALLBACK_POSTS as any);
        }
      } catch (err) {
        setPosts(FALLBACK_POSTS as any);
      } finally {
        setLoading(false);
      }
    }
    fetchInstagram();
  }, []);

  if (loading) return null; // Or a sleek skeleton
  if (posts.length === 0) return null;

  return (
    <section className="py-24 bg-[var(--at-bg)] overflow-hidden relative">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--at-ink)] mb-4">
              {dictionary.instagram?.title || "Instagram"}
            </h2>
            <p className="text-lg text-[var(--at-ink)]/70">
              {dictionary.instagram?.subtitle || "So'nggi loyihalar"}
            </p>
          </motion.div>
          
          <motion.a
            href="https://instagram.com/jonbranding"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--at-ink)] text-[var(--at-bg)] hover:bg-[var(--at-brand)] hover:text-white transition-all duration-300 w-fit"
          >
            <Instagram className="w-5 h-5" />
            <span className="font-medium">{dictionary.instagram?.followBtn || "Kuzatish"}</span>
          </motion.a>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[300px]">
          {posts.map((post, index) => {
            // Layout logic for bento grid
            const isLarge = index === 0; // First post is large
            const isMedium = index === 1 || index === 2; // Next two are normal
            
            return (
              <motion.a
                key={post.id || index}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "group relative rounded-3xl overflow-hidden block bg-black/5",
                  isLarge ? "col-span-2 row-span-2 md:col-span-2 md:row-span-2" : "col-span-1 row-span-1",
                  index === 3 && "col-span-2 md:col-span-1",
                )}
              >
                <Image
                  src={post.media_url}
                  alt={post.caption || "Instagram post"}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes={isLarge ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center gap-4">
                  <Instagram className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 translate-y-4 group-hover:translate-y-0" />
                  <div className="flex items-center gap-6 text-white font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 delay-150 translate-y-4 group-hover:translate-y-0">
                    <span className="flex items-center gap-2"><Heart className="w-5 h-5 fill-white" /></span>
                    <span className="flex items-center gap-2"><MessageCircle className="w-5 h-5 fill-white" /></span>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;

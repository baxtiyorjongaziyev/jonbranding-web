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
    media_url: '/images/cms/arfadel-cover.webp',
    permalink: 'https://instagram.com/jon.branding',
    media_type: 'IMAGE',
  },
  {
    id: '2',
    media_url: '/images/cms/beyaz-cover.webp',
    permalink: 'https://instagram.com/jon.branding',
    media_type: 'IMAGE',
  },
  {
    id: '3',
    media_url: '/images/cms/diletta-cover.webp',
    permalink: 'https://instagram.com/jon.branding',
    media_type: 'IMAGE',
  },
  {
    id: '4',
    media_url: '/images/cms/enros-cover.webp',
    permalink: 'https://instagram.com/jon.branding',
    media_type: 'IMAGE',
  },
  {
    id: '5',
    media_url: '/images/cms/logo-design-showcase.webp',
    permalink: 'https://instagram.com/jon.branding',
    media_type: 'IMAGE',
  },
  {
    id: '6',
    media_url: '/images/cms/arfadel-card.webp',
    permalink: 'https://instagram.com/jon.branding',
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
            href="https://instagram.com/jon.branding"
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

        {/* Masonry Layout */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
          {posts.map((post, index) => {
            const isReel = post.media_type === 'VIDEO';
            
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
                  "group relative rounded-2xl md:rounded-3xl overflow-hidden block bg-black/5 w-full break-inside-avoid transform transition-all hover:-translate-y-1 hover:shadow-xl",
                  isReel ? "aspect-[9/16]" : "aspect-[4/5]"
                )}
              >
                <Image
                  src={post.media_type === 'VIDEO' && (post as any).thumbnail_url ? (post as any).thumbnail_url : post.media_url}
                  alt={post.caption || "Instagram post"}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
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

'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const VideoSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Map scroll progress to border radius
  // When the component is in the middle of the viewport (progress 0.5), radius is 0
  // When it's at the top or bottom edges, radius is 24px (1.5rem)
  const borderRadius = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    ['1.5rem', '0rem', '0rem', '1.5rem']
  );

  return (
    <section id="video" className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Ish jarayonimiz videoda
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-700">
            Nega strategiyaga asoslangan brending muhim? Nega shunchaki chiroyli
            logotip yetarli emas? Bizning yondashuvimiz biznesingizga qanday
            qilib o'lchanadigan natijalar keltirishini videoda ko'ring.
          </p>
        </div>
        <div ref={ref} className="mt-12 max-w-4xl mx-auto">
          <motion.div
            className="shadow-2xl overflow-hidden"
            style={{ borderRadius }}
          >
            <div
              style={{ padding: '56.25% 0 0 0', position: 'relative' }}
            >
              <iframe
                src="https://player.vimeo.com/video/1109613592?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&dnt=1"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
                title="Blue and White Minimalist Goodbye Winter Video"
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;

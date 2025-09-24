'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const VideoSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.9, 1, 0.9]
  );
  
  const borderRadius = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    ["24px", "0px", "0px", "24px"]
  );

  const maxWidth = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['1280px', '100vw', '1280px']
  );

  return (
    <section id="video" className="h-[200vh] bg-white" ref={ref}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          className="relative w-full aspect-video shadow-2xl bg-black"
          style={{ scale, borderRadius, maxWidth }}
        >
          <iframe
            src="https://player.vimeo.com/video/1109613592?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&dnt=1"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            className="absolute top-0 left-0 w-full h-full"
            title="Blue and White Minimalist Goodbye Winter Video"
            allowFullScreen
          ></iframe>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;

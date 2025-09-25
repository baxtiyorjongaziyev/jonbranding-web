
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
    [0, 0.4, 0.6, 1],
    [0.9, 1, 1, 0.9]
  );
  
  const borderRadius = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    ["24px", "0px", "0px", "24px"]
  );

  const videoUrl = "https://player.vimeo.com/video/1109613592?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&dnt=1&title=0&byline=0&portrait=0";

  return (
    <section id="video" className="h-[200vh] bg-white" ref={ref}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden p-4 sm:p-8 md:p-12">
        <motion.div
          className="relative w-full max-w-6xl aspect-video shadow-2xl bg-black"
          style={{ scale, borderRadius }}
        >
          {/* Blurred background video (Ambilight effect) */}
          <div className="absolute -inset-12 w-[calc(100%+6rem)] h-[calc(100%+6rem)] -z-10">
            <iframe
              src={videoUrl}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              className="w-full h-full blur-3xl opacity-50"
              title="Jon.Branding Showreel Background"
            ></iframe>
          </div>
          {/* Main video */}
          <div className="relative w-full h-full z-10">
            <iframe
              src={videoUrl}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              className="w-full h-full"
              title="Jon.Branding Showreel"
              allowFullScreen
            ></iframe>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;

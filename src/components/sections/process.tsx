'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import CtaBlock from './cta-block';

interface ProcessProps {
  onCtaClick: () => void;
}

const processPhases = [
  {
    title: 'Discovery',
    subtitle: 'Beginning the Journey',
    tasks: ['Briefing', 'People Problem', 'Market Research', 'People Needs', 'Creative Ideation'],
  },
  {
    title: 'Strategy',
    subtitle: 'Mapping the Path',
    tasks: ['Goal Setting', 'User Analysis', 'Competitor Analysis', 'Design Principles', 'Roadmapping', 'Design Vision'],
  },
  {
    title: 'Evaluation',
    subtitle: 'Challenging the Views',
    tasks: ['Heuristic Evaluation', 'User Testing', 'A/B Testing', 'Feedback Analysis', 'Design System', 'Accessibility Checks'],
  },
  {
    title: 'Development',
    subtitle: 'Crafting the Experience',
    tasks: ['Wireframing', 'Interactive Design', 'Visual Design', 'Prototyping', 'Handoff'],
  },
];

const Process: React.FC<ProcessProps> = ({ onCtaClick }) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  // We have 4 items, so we want to scroll through 3 "screens" worth of content.
  // We'll map scrollYProgress (0 to 1) to a horizontal translation.
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-75%']);

  return (
    <>
      <section ref={targetRef} id="process" className="relative h-[300vh] bg-white">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="absolute top-0 left-0 right-0 pt-16 sm:pt-24 pb-12">
            <div className="container mx-auto px-4 text-center">
              <p className="text-lg font-medium text-gray-600">From Vision To Perfection</p>
              <h2 className="text-4xl sm:text-5xl font-bold text-dark-blue">
                Our Design Journey
              </h2>
              <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-500">
                Jon.Branding offers a convenient and proactive process from brainstorming design ideas to unfolding them into a magnificent digital product, delighting your users.
              </p>
            </div>
          </div>
        
          <motion.div style={{ x }} className="flex gap-8">
            <div className="w-[10vw] flex-shrink-0"></div> {/* Start padding */}
            {processPhases.map((phase, index) => (
              <div key={index} className="w-[80vw] md:w-[40vw] lg:w-[20vw] flex-shrink-0">
                <div className="relative pt-16">
                  <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-200">
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 w-3 h-3 rounded-full bg-primary z-10"></div>
                  </div>
                </div>
                <div className="h-full rounded-2xl flex flex-col items-start p-4">
                  <h3 className="text-2xl font-bold text-dark-blue">{phase.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">{phase.subtitle}</p>
                  <div className="flex flex-wrap gap-2 justify-start">
                    {phase.tasks.map((task) => (
                      <Badge key={task} variant="secondary" className="font-normal bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg px-3 py-1 text-sm">
                        {task}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
             <div className="w-[10vw] flex-shrink-0"></div> {/* End padding */}
          </motion.div>
        </div>
      </section>
      
      <CtaBlock
        title="Keling, ishni boshlaymiz!"
        description="Biznesingizni strategik brending orqali yangi bosqichga olib chiqishga tayyormisiz? Bizning sinovdan o'tgan tizimimiz sizga yordam beradi."
        buttonText="Loyihani muhokama qilish"
        onCtaClick={onCtaClick}
      />
    </>
  );
};

export default Process;

'use client';
import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const steps = [
  { id: 1, title: 'Sign Up', text: 'Create your Callrio.ai account and set up your workspace.' },
  { id: 2, title: 'Start a Call', text: 'Host or join meetings with AI-powered recording.' },
  { id: 3, title: 'Transcribe & Summarize', text: 'Automatic transcription and intelligent meeting summaries.' },
  { id: 4, title: 'Review Insights', text: 'Access analytics, highlights, and share notes instantly.' },
];

export default function StepsSection() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-20 text-gray-900 dark:text-white">
        How Callrio.ai Works
      </h2>

      <div className="hidden md:block absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400/40 via-purple-400/40 to-pink-400/40 -translate-y-1/2 z-0" />
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-center relative z-10">
        {steps.map((step, index) => (
          <Step key={step.id} step={step} index={index} />
        ))}
      </div>
    </section>
  );
}

function Step({ step, index }: { step: { id: number; title: string; text: string }; index: number }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.3 });
  const isEven = index % 2 === 0;

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0, x: 0 });
    } else {
      controls.start({
        opacity: 0,
        x: isEven ? -100 : 100,
        y: 0,
      });
    }
  }, [inView, controls, isEven]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial={{
        opacity: 0,
        x: isEven ? -100 : 100,
        y: 0,
      }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative flex flex-col items-center md:w-1/4 px-4 mb-20 md:mb-0"
    >
      <div
        className={`glass-card p-6 md:w-60 rounded-2xl text-center transition-all duration-300 hover:scale-105 ${
          isEven ? 'md:-mt-20' : 'md:mt-20'
        }`}
      >
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
          {step.id}
        </div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{step.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">{step.text}</p>
      </div>
    </motion.div>
  );
}

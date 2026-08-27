'use client';

import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  highlightWords?: string[];
  highlightClass?: string;
  delay?: number;
}

export default function AnimatedText({
  text,
  className = '',
  highlightWords = [],
  highlightClass = 'gold-text-shimmer italic font-serif-title',
  delay = 0,
}: AnimatedTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(' ');

  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>;
  }

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i: number = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: delay * i },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring' as const,
        damping: 14,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 18,
      filter: 'blur(4px)',
    },
  };

  return (
    <motion.span
      className={`inline-block flex-wrap ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {words.map((word, index) => {
        const cleanWord = word.replace(/[^a-zA-ZÀ-ÿ0-9]/g, '').toLowerCase();
        const isHighlighted = highlightWords.some(
          (hw) => hw.toLowerCase() === cleanWord || word.toLowerCase().includes(hw.toLowerCase())
        );

        return (
          <motion.span
            variants={child}
            key={index}
            className={`inline-block mr-[0.25em] ${isHighlighted ? highlightClass : ''}`}
          >
            {word}
          </motion.span>
        );
      })}
    </motion.span>
  );
}

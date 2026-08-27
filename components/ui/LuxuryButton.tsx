'use client';

import React from 'react';

interface LuxuryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'wine' | 'forest' | 'gold' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  sheen?: boolean;
}

export default function LuxuryButton({
  children,
  className = '',
  variant = 'wine',
  size = 'md',
  sheen = true,
  ...props
}: LuxuryButtonProps) {
  const variantStyles = {
    wine: 'bg-gradient-to-r from-[#58111A] via-[#681823] to-[#722F37] text-[#FDFBF7] border-2 border-[#D4AF37] shadow-[0_10px_25px_-5px_rgba(88,17,26,0.45)] hover:shadow-[0_15px_35px_-5px_rgba(88,17,26,0.65),0_0_20px_-3px_rgba(212,175,55,0.4)]',
    forest: 'bg-gradient-to-r from-[#14281D] via-[#1B3B2B] to-[#264E3A] text-[#FDFBF7] border border-[#D4AF37]/60 shadow-[0_10px_25px_-5px_rgba(20,40,29,0.45)] hover:shadow-[0_15px_35px_-5px_rgba(20,40,29,0.65),0_0_20px_-3px_rgba(212,175,55,0.35)]',
    gold: 'bg-gradient-to-r from-[#E5C158] via-[#D4AF37] to-[#C59B27] text-[#380B11] border-2 border-[#FDFBF7]/80 shadow-[0_10px_25px_-5px_rgba(212,175,55,0.4)] hover:shadow-[0_15px_35px_-5px_rgba(212,175,55,0.65)]',
    glass: 'bg-[#14281D]/75 text-[#FDFBF7] border border-[#D4AF37]/40 backdrop-blur-md shadow-lg hover:border-[#D4AF37] hover:bg-[#1B3B2B]/90',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs rounded-xl gap-2',
    md: 'px-6 py-3.5 text-xs sm:text-sm rounded-2xl gap-2.5',
    lg: 'px-8 py-4 text-sm sm:text-base rounded-2xl gap-3',
  };

  return (
    <button
      className={`relative inline-flex items-center justify-center font-bold tracking-wide overflow-hidden transition-all duration-300 ease-out group hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {/* 1. Luminous Gold Sheen Beam sweeping across on hover */}
      {sheen && (
        <span
          className="absolute inset-0 w-full h-full -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.03) 20%, rgba(255, 240, 180, 0.28) 50%, rgba(255, 255, 255, 0.03) 80%, transparent 100%)',
            transform: 'skewX(-20deg)',
          }}
        />
      )}

      {/* 2. Top-Lit Inner Edge Highlight */}
      <span className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FDFBF7]/40 to-transparent pointer-events-none" />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-[inherit]">
        {children}
      </span>
    </button>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useData } from '@/lib/context/DataContext';
import { formatDateFrench } from '@/lib/utils';
import { Newspaper, Clock, ArrowRight, Tag, Sparkles, Filter } from 'lucide-react';
import SocialFeedSection from '@/components/home/SocialFeedSection';
import TiltCard from '@/components/ui/TiltCard';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function ActualitesPage() {
  const { posts } = useData();
  const [selectedCat, setSelectedCat] = useState<string>('all');

  const categories = ['all', 'Dégustation', 'Voyage', 'Partenariat', 'Vie de l\'asso'];

  const filteredPosts = posts.filter((post) => {
    return selectedCat === 'all' || post.category === selectedCat;
  });

  return (
    <div className="py-12 sm:py-16 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Banner */}
        <ScrollReveal direction="up" className="rounded-3xl bg-[#58111A] text-[#FDFBF7] p-8 sm:p-12 relative overflow-hidden border border-[#D4AF37]/40 shadow-2xl">
          <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14281D] text-[#D4AF37] text-xs font-bold uppercase tracking-wider border border-[#D4AF37]/30 shadow-md">
              <Newspaper className="w-3.5 h-3.5" />
              Journal du Terroir & Carnets d&apos;Épicure
            </div>
            <h1 className="font-serif-title font-extrabold text-3xl sm:text-5xl leading-tight">
              Actualités, Récits & Coulisses
            </h1>
            <p className="text-sm sm:text-base text-[#D8CCC0]">
              Retours sur nos dégustations, secrets d&apos;affinage, recettes de terroir, chroniques gourmandes et annonces officielles du bureau ECE Terroir.
            </p>
          </div>
        </ScrollReveal>

        {/* Category Filters */}
        <ScrollReveal direction="up" delay={0.1} className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-[#58111A] shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCat === cat
                  ? 'bg-[#58111A] text-[#FDFBF7] shadow-sm font-extrabold'
                  : 'bg-[#F6F1EA] text-[#78716C] hover:text-[#58111A] hover:bg-[#EAE2D8]'
              }`}
            >
              {cat === 'all' ? 'Toutes les actualités' : cat}
            </button>
          ))}
        </ScrollReveal>

        {/* Articles Grid with TiltCard */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-[#FFFFFF] rounded-3xl border border-[#EAE2D8] p-8 space-y-4">
            <Newspaper className="w-12 h-12 text-[#D8CCC0] mx-auto" />
            <h3 className="font-serif-title font-bold text-xl text-[#58111A]">Gazette en cours de rédaction</h3>
            <p className="text-sm text-[#78716C]">
              Les récits de dégustations, chroniques gourmandes et actualités officielles de la Confrérie seront publiés prochainement.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredPosts.map((post, idx) => (
            <ScrollReveal key={post.id} direction="up" delay={idx * 0.1} className="flex">
              <TiltCard maxTilt={5} className="w-full">
                <Link
                  href={`/actualites/${post.slug}`}
                  className="bento-card rounded-3xl overflow-hidden flex flex-col justify-between group bg-[#FFFFFF] h-full"
                >
                  <div>
                    {/* Cover Image */}
                    <div className="relative h-56 w-full overflow-hidden">
                      <img
                        src={post.coverImageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-[#58111A] text-[#FDFBF7] text-xs font-bold shadow-md border border-[#D4AF37]/30">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-3 text-xs text-[#78716C]">
                        <span>{formatDateFrench(post.publishedAt)}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#D4AF37]" /> {post.readTimeMinutes} min de lecture
                        </span>
                      </div>

                      <h3 className="font-serif-title font-bold text-xl text-[#1D1917] group-hover:text-[#58111A] transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-xs text-[#78716C] line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Author & Read More */}
                  <div className="p-6 pt-0 border-t border-[#F6F1EA] flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2.5">
                      {post.author.avatarUrl ? (
                        <img
                          src={post.author.avatarUrl}
                          alt={post.author.name}
                          className="w-7 h-7 rounded-full object-cover border border-[#EAE2D8]"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-[#58111A] text-[#D4AF37] text-[10px] font-bold flex items-center justify-center">
                          {post.author.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-[#1D1917] leading-none">{post.author.name}</span>
                        <span className="text-[10px] text-[#78716C] leading-none mt-0.5">{post.author.role}</span>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-[#58111A] flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                      Lire <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </span>
                  </div>
                </Link>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
        )}
      </div>

      {/* Social Feed Section */}
      <div className="pt-12">
        <SocialFeedSection />
      </div>
    </div>
  );
}

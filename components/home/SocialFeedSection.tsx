'use client';

import React, { useState, useEffect } from 'react';
import { useData } from '@/lib/context/DataContext';
import { Heart, MessageCircle, ExternalLink, Sparkles, Filter, Camera } from 'lucide-react';
import { formatDateFrench } from '@/lib/utils';
import { SocialPost } from '@/lib/types';
import TiltCard from '@/components/ui/TiltCard';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function SocialFeedSection() {
  const { socialPosts: fallbackPosts } = useData();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePlatform, setActivePlatform] = useState<'all' | 'instagram' | 'tiktok'>('all');

  useEffect(() => {
    let isMounted = true;
    const fetchFeed = async () => {
      try {
        const res = await fetch('/api/instagram/feed');
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.posts) && data.posts.length > 0) {
          setPosts(data.posts);
        } else if (isMounted) {
          setPosts(fallbackPosts);
        }
      } catch (err) {
        if (isMounted) setPosts(fallbackPosts);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchFeed();
    return () => { isMounted = false; };
  }, [fallbackPosts]);

  const filteredPosts = posts.filter((post) => {
    return activePlatform === 'all' || post.platform === activePlatform;
  });

  return (
    <section className="py-24 bg-[#141716] text-[#FDFBF7] relative overflow-hidden border-y border-[#D4AF37]/30">
      {/* Decorative Aura Lights */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#58111A]/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#58111A] text-[#D4AF37] text-xs font-bold uppercase tracking-wider border border-[#D4AF37]/40 shadow-xl">
            <Sparkles className="w-3.5 h-3.5" />
            Flux Direct Instagram & TikTok
          </div>
          <h2 className="font-serif-title font-extrabold text-3xl sm:text-5xl text-[#FDFBF7] tracking-tight">
            L&apos;Ambiance ECE Terroir sur les Réseaux
          </h2>
          <p className="text-sm sm:text-base text-[#D8CCC0]">
            Suivez en direct les aventures, dégustations, coulisses et bons plans du bureau sur nos comptes officiels.
          </p>

          {/* Social Profiles Direct Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="https://www.instagram.com/eceterroir/"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#58111A] to-[#722F37] text-[#FDFBF7] hover:scale-105 text-xs font-bold transition-all border border-[#D4AF37]/50 shadow-xl flex items-center gap-2"
            >
              <svg className="w-4 h-4 fill-current text-[#D4AF37]" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span>@eceterroir sur Instagram</span>
            </a>

            <a
              href="https://www.tiktok.com/@ece.terroir"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-2xl bg-[#1B3B2B] text-[#FDFBF7] hover:bg-[#264E3A] hover:scale-105 text-xs font-bold transition-all border border-[#D4AF37]/50 shadow-xl flex items-center gap-2"
            >
              <svg className="w-4 h-4 fill-current text-[#D4AF37]" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .55.04.81.12v-3.5a6.37 6.37 0 0 0-.81-.05A6.34 6.34 0 0 0 3 15.67 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.33V8.87a8.28 8.28 0 0 0 5-1.63v-3.5a4.87 4.87 0 0 1-1.09.95z" />
              </svg>
              <span>@ece.terroir sur TikTok</span>
            </a>
          </div>
        </ScrollReveal>

        {/* Platform Tabs Filter */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setActivePlatform('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activePlatform === 'all'
                ? 'bg-[#D4AF37] text-[#58111A] shadow-md font-extrabold scale-105'
                : 'bg-[#1B3B2B] text-[#D8CCC0] hover:text-[#FDFBF7]'
            }`}
          >
            Tous les flux ({posts.length})
          </button>
          <button
            onClick={() => setActivePlatform('instagram')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activePlatform === 'instagram'
                ? 'bg-[#58111A] text-[#D4AF37] border border-[#D4AF37] shadow-md scale-105 font-bold'
                : 'bg-[#1B3B2B] text-[#D8CCC0] hover:text-[#FDFBF7]'
            }`}
          >
            <span>Instagram</span>
          </button>
          <button
            onClick={() => setActivePlatform('tiktok')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activePlatform === 'tiktok'
                ? 'bg-[#1B3B2B] text-[#D4AF37] border border-[#D4AF37] shadow-md scale-105 font-bold'
                : 'bg-[#1B3B2B] text-[#D8CCC0] hover:text-[#FDFBF7]'
            }`}
          >
            <span>TikTok</span>
          </button>
        </div>

        {/* Social Feed Cards with TiltCard & Stagger */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 rounded-3xl bg-white/5 border border-[#D4AF37]/30 p-8 space-y-3">
            <Camera className="w-10 h-10 text-[#D4AF37] mx-auto" />
            <h3 className="font-serif-title font-bold text-xl text-[#FDFBF7]">Publications en cours de synchronisation</h3>
            <p className="text-xs sm:text-sm text-[#D8CCC0]">
              Retrouvez nos dernières actualités directement sur notre compte <a href="https://instagram.com/eceterroir" target="_blank" rel="noreferrer" className="text-[#D4AF37] underline">@eceterroir</a>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, idx) => (
              <ScrollReveal key={post.id} direction="up" delay={idx * 0.1} className="flex">
                <TiltCard
                  maxTilt={6}
                  className="w-full rounded-3xl bg-[#1C2220] border border-[#D4AF37]/30 overflow-hidden shadow-2xl flex flex-col justify-between group"
                >
                  {/* Media Preview */}
                  <div className="relative h-64 w-full overflow-hidden bg-black">
                    <img
                      src={post.mediaUrl}
                      alt={post.content}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C2220] via-transparent to-transparent" />
                    
                    {/* Platform Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-bold text-[#FDFBF7] flex items-center gap-1.5 border border-[#D4AF37]/40 shadow-md">
                        <svg className="w-3.5 h-3.5 fill-[#D4AF37]" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        <span>{post.handle}</span>
                      </span>
                    </div>
                  </div>

                  {/* Content & Stats */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-[#FDFBF7] leading-relaxed line-clamp-3 whitespace-pre-line">
                      {post.content}
                    </p>

                    <div className="pt-3 border-t border-[#2C3833] flex items-center justify-between text-xs text-[#D8CCC0]">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[#D4AF37] font-semibold text-[11px]">
                          <Heart className="w-3.5 h-3.5 fill-current" /> {post.likesCount}
                        </span>
                        <span className="flex items-center gap-1 text-[11px]">
                          <MessageCircle className="w-3.5 h-3.5" /> {post.commentsCount}
                        </span>
                      </div>

                      <a
                        href={post.postUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 px-3 rounded-xl bg-[#58111A] hover:bg-[#722F37] text-[#D4AF37] hover:text-white transition-all flex items-center gap-1 text-[11px] font-bold shadow-md border border-[#D4AF37]/30"
                      >
                        <span>Voir le post</span> <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

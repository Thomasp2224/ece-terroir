'use client';

import React, { useState, useEffect } from 'react';
import { Video, Heart, Camera, ExternalLink, Sparkles, RefreshCw } from 'lucide-react';
import { SocialPost } from '@/lib/types';

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

export function SocialLiveFeedWidget() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likes, setLikes] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    let isMounted = true;
    const fetchInstagramFeed = async () => {
      try {
        const res = await fetch('/api/instagram/feed');
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.posts) && data.posts.length > 0) {
          setPosts(data.posts);
        }
      } catch (err) {
        console.error('Erreur chargement Instagram live feed:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchInstagramFeed();
    return () => { isMounted = false; };
  }, []);

  const handleLike = (id: string, initialLikes: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setLikes((prev) => ({
      ...prev,
      [id]: (prev[id] || initialLikes) + 1,
    }));
  };

  const displayPosts = posts.slice(0, 3);

  return (
    <div className="liquid-glass rounded-3xl p-5 sm:p-7 border border-white/90 shadow-xl relative overflow-hidden space-y-5">
      
      {/* Background Subtle Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#D4AF37]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14281D] text-[#D4AF37] text-[11px] font-extrabold uppercase tracking-wider border border-[#D4AF37]/30 shadow-sm">
            <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Direct Instagram • @eceterroir</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <h3 className="font-serif-title font-extrabold text-xl sm:text-2xl text-[#14281D]">
            Échos des Banquets & Vie de la Confrérie
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://www.instagram.com/eceterroir/"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-2xl bg-white/90 hover:bg-white border border-[#EAE2D8] text-[#58111A] hover:scale-105 transition-all shadow-sm flex items-center gap-2 text-xs font-extrabold group"
          >
            <InstagramIcon className="w-4 h-4 text-[#58111A] group-hover:scale-110 transition-transform" />
            <span>Suivre @eceterroir</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#78716C]" />
          </a>
        </div>
      </div>

      {/* Grid of Real Instagram Posts */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className="p-3 rounded-2xl bg-white/70 border border-[#EAE2D8] animate-pulse space-y-3">
              <div className="aspect-[4/3] w-full rounded-xl bg-neutral-200" />
              <div className="h-3 w-3/4 bg-neutral-200 rounded" />
              <div className="h-2.5 w-1/2 bg-neutral-200 rounded" />
            </div>
          ))}
        </div>
      ) : displayPosts.length === 0 ? (
        <div className="text-center py-10 rounded-2xl bg-white/60 border border-[#EAE2D8] p-6 space-y-2">
          <Camera className="w-8 h-8 text-[#D4AF37] mx-auto" />
          <p className="font-serif-title font-bold text-sm text-[#14281D]">
            Les publications officielles arrivent sur @eceterroir
          </p>
          <p className="text-xs text-[#78716C]">
            Rejoignez-nous dès maintenant sur Instagram pour ne manquer aucun banquet !
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
          {displayPosts.map((photo, idx) => {
            const currentLikes = likes[photo.id] || photo.likesCount || 0;
            const tiltClass = idx === 0 ? '-rotate-1 hover:rotate-0' : idx === 1 ? 'rotate-1 hover:rotate-0' : '-rotate-0.5 hover:rotate-0';

            return (
              <a
                key={photo.id}
                href={photo.postUrl}
                target="_blank"
                rel="noreferrer"
                className={`p-3 rounded-2xl bg-white border border-[#EAE2D8] shadow-md hover:shadow-2xl transition-all duration-300 transform ${tiltClass} flex flex-col justify-between space-y-3 cursor-pointer group block text-left`}
              >
                {/* Photo Frame */}
                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#FAF7F2]">
                  <img
                    src={photo.mediaUrl}
                    alt={photo.content}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2.5">
                    <span className="text-[10px] font-bold text-white flex items-center gap-1">
                      <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
                      Voir sur Instagram
                    </span>
                  </div>
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold flex items-center gap-1">
                    <InstagramIcon className="w-2.5 h-2.5 text-pink-400" />
                    @eceterroir
                  </span>
                </div>

                {/* Caption & Like */}
                <div className="space-y-1.5 px-1">
                  <p className="text-xs font-medium text-[#1D1917] line-clamp-2 leading-relaxed whitespace-pre-line">
                    {photo.content}
                  </p>
                  <div className="flex items-center justify-between pt-1.5 border-t border-[#F4EFEA] text-[11px] text-[#78716C]">
                    <button
                      type="button"
                      onClick={(e) => handleLike(photo.id, photo.likesCount, e)}
                      className="flex items-center gap-1 text-[#58111A] hover:scale-110 transition-transform font-bold"
                    >
                      <Heart className="w-3.5 h-3.5 fill-[#58111A]" />
                      <span>{currentLikes} likes</span>
                    </button>
                    <span className="text-[10px] text-[#78716C] font-semibold">Campus Eiffel 1</span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}

    </div>
  );
}

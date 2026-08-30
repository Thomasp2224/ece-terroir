'use client';

import React, { useState } from 'react';
import { Video, Heart, Camera } from 'lucide-react';
import { useData } from '@/lib/context/DataContext';

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

export function SocialLiveFeedWidget() {
  const [likes, setLikes] = useState<{ [key: string]: number }>({});

  const handleLike = (id: string, initialLikes: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikes((prev) => ({
      ...prev,
      [id]: (prev[id] || initialLikes) + 1,
    }));
  };

  const samplePhotos = [
    {
      id: 'photo-1',
      title: 'Grand Banquet de Rentree',
      caption: 'Raclette au feu de bois & convivialite au Foyer 🧀🍷',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop',
      likes: 142,
      platform: 'instagram',
      author: '@ece_terroir'
    },
    {
      id: 'photo-2',
      title: 'Visite Vignerons en Bourgogne',
      caption: 'Immersion dans les caves du Domaine & degustation des crus 🍇',
      image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800&auto=format&fit=crop',
      likes: 98,
      platform: 'instagram',
      author: '@ece_terroir'
    },
    {
      id: 'photo-3',
      title: 'Concours de Decapsulage & Sommelerie',
      caption: 'Nos etudiants aux commandes du couteau sommelier en olivier ✨',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
      likes: 185,
      platform: 'tiktok',
      author: '@eceterroir_tiktok'
    }
  ];

  return (
    <div className="liquid-glass rounded-3xl p-5 sm:p-7 border border-white/90 shadow-xl relative overflow-hidden space-y-5">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14281D] text-[#D4AF37] text-[11px] font-extrabold uppercase tracking-wider border border-[#D4AF37]/30 shadow-sm">
            <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
            Échos des Banquets • Instagram & TikTok
          </div>
          <h3 className="font-serif-title font-extrabold text-xl sm:text-2xl text-[#14281D]">
            La Vie de la Confrérie en Direct
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-2xl bg-white/80 hover:bg-white border border-[#EAE2D8] text-[#58111A] hover:scale-105 transition-all shadow-sm flex items-center gap-1.5 text-xs font-bold"
          >
            <InstagramIcon className="w-4 h-4 text-[#58111A]" />
            <span className="hidden sm:inline">@ece_terroir</span>
          </a>
        </div>
      </div>

      {/* 3 Polaroids in Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
        {samplePhotos.map((photo, idx) => {
          const currentLikes = likes[photo.id] || photo.likes;
          const tiltClass = idx === 0 ? '-rotate-1 hover:rotate-0' : idx === 1 ? 'rotate-1 hover:rotate-0' : '-rotate-0.5 hover:rotate-0';

          return (
            <div
              key={photo.id}
              className={`p-3 rounded-2xl bg-white border border-[#EAE2D8] shadow-md hover:shadow-2xl transition-all duration-300 transform ${tiltClass} flex flex-col justify-between space-y-3 cursor-pointer group`}
            >
              {/* Photo Frame */}
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#FAF7F2]">
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold flex items-center gap-1">
                  {photo.platform === 'instagram' ? <InstagramIcon className="w-2.5 h-2.5" /> : <Video className="w-2.5 h-2.5" />}
                  {photo.author}
                </span>
              </div>

              {/* Caption & Like */}
              <div className="space-y-1.5 px-1">
                <p className="text-xs font-medium text-[#1D1917] line-clamp-2 leading-relaxed">
                  {photo.caption}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-[#F4EFEA] text-[11px] text-[#78716C]">
                  <button
                    onClick={(e) => handleLike(photo.id, photo.likes, e)}
                    className="flex items-center gap-1 text-[#58111A] hover:scale-110 transition-transform font-bold"
                  >
                    <Heart className="w-3.5 h-3.5 fill-[#58111A]" />
                    <span>{currentLikes}</span>
                  </button>
                  <span className="text-[10px] text-[#A8A29E]">ECE Paris</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

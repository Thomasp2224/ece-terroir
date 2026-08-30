'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useData } from '@/lib/context/DataContext';
import { EventItem } from '@/lib/types';
import { formatDateFrench, formatPrice } from '@/lib/utils';
import { Calendar, MapPin, ArrowRight, Sparkles, Flame } from 'lucide-react';
import EventModal from '../events/EventModal';

export default function UpcomingEventsPreview() {
  const { events: allEvents } = useData();
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // Take top events
  const featuredEvent = allEvents[0];
  const secondaryEvents = allEvents.slice(1, 3);

  return (
    <section className="py-6 relative overflow-hidden">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#14281D] text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-2 border border-[#D4AF37]/30 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Agenda & Billetterie Officielle
          </div>
          <h2 className="font-serif-title font-extrabold text-2xl sm:text-4xl text-[#14281D] tracking-tight">
            Les Grands Rendez-vous du Terroir
          </h2>
          <p className="text-xs sm:text-sm text-[#78716C] mt-1 max-w-xl">
            Banquets au feu de bois, soirées dégustations de meules AOP et rassemblements gourmands au Foyer.
          </p>
        </div>

        <Link
          href="/evenements"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#14281D] hover:text-[#2D5A3F] transition-colors px-4 py-2 rounded-2xl liquid-glass border border-[#EAE2D8] shadow-sm hover:shadow-md"
        >
          <span>Consulter le calendrier complet ({allEvents.length})</span>
          <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
        </Link>
      </div>

      {/* Bento Grid Layout */}
      {allEvents.length === 0 ? (
        <div className="text-center py-12 rounded-3xl liquid-glass border border-[#EAE2D8] p-8 space-y-3">
          <Calendar className="w-10 h-10 text-[#D4AF37] mx-auto" />
          <h3 className="font-serif-title font-bold text-xl text-[#14281D]">
            Programmation des festins en cours de finalisation
          </h3>
          <p className="text-xs sm:text-sm text-[#78716C] max-w-md mx-auto">
            Les dates des dégustations de fromages, ateliers et week-ends terroir seront publiées très prochainement ici et sur nos réseaux.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. Featured Event Card */}
        {featuredEvent && (
          <div
            onClick={() => setSelectedEvent(featuredEvent)}
            className="lg:col-span-7 rounded-3xl liquid-glass border-2 border-[#D4AF37]/40 shadow-xl overflow-hidden flex flex-col justify-between group cursor-pointer hover:border-[#D4AF37] transition-all"
          >
            {/* Image */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden">
              <img
                src={featuredEvent.coverImageUrl}
                alt={featuredEvent.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14281D] via-[#14281D]/30 to-transparent" />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#14281D] text-[#D4AF37] text-xs font-extrabold shadow-md border border-[#D4AF37]/40 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>À l&apos;Affiche • {featuredEvent.eventType}</span>
                </span>
              </div>

              {/* Bottom Image Info */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-2 text-xs font-semibold bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{formatDateFrench(featuredEvent.startDate)}</span>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-[#D4AF37] text-[#14281D] text-xs font-extrabold shadow-md">
                  {featuredEvent.remainingSeats > 0 ? `${featuredEvent.remainingSeats} places` : 'Entrée Libre'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#78716C]">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="font-bold text-[#14281D]">{featuredEvent.location}</span>
                </div>
                <h3 className="font-serif-title font-extrabold text-xl sm:text-2xl text-[#14281D] group-hover:text-[#2D5A3F] transition-colors leading-tight">
                  {featuredEvent.title}
                </h3>
                <p className="text-xs text-[#5C554E] line-clamp-2 leading-relaxed">
                  {featuredEvent.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#EAE2D8]/80 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-[#78716C] uppercase font-bold">Tarif Adhérent</span>
                  <div className="font-serif-title font-black text-lg text-[#14281D]">
                    {formatPrice(featuredEvent.priceCents)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEvent(featuredEvent);
                    }}
                    className="skeuo-btn-pine px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow"
                  >
                    <span>Réserver ma place</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Secondary Events List */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {secondaryEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="rounded-3xl liquid-glass border border-[#EAE2D8] hover:border-[#D4AF37]/60 p-5 shadow-lg flex flex-col justify-between space-y-4 group cursor-pointer hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#14281D]/10 text-[#14281D] text-[10px] font-extrabold uppercase tracking-wider inline-block">
                    {event.eventType}
                  </span>
                  <h4 className="font-serif-title font-bold text-base text-[#14281D] group-hover:text-[#2D5A3F] transition-colors leading-snug line-clamp-1">
                    {event.title}
                  </h4>
                  <p className="text-xs text-[#78716C] flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-[#D4AF37]" />
                    <span>{formatDateFrench(event.startDate)}</span>
                  </p>
                </div>

                <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-[#FAF7F2] border border-[#EAE2D8]">
                  <img
                    src={event.coverImageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#EAE2D8]/60 flex items-center justify-between text-xs">
                <span className="font-bold text-[#14281D]">
                  {formatPrice(event.priceCents)} <span className="text-[10px] text-[#78716C] font-normal">(Pass)</span>
                </span>
                <span className="text-[11px] font-bold text-[#2D5A3F] flex items-center gap-1">
                  <span>Détails & Réservation</span>
                  <ArrowRight className="w-3 h-3 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
      )}

      {/* Event Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </section>
  );
}

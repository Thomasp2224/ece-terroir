'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useData } from '@/lib/context/DataContext';
import { EventItem } from '@/lib/types';
import { formatDateFrench, formatPrice } from '@/lib/utils';
import { Calendar, MapPin, Ticket, ArrowRight, Sparkles, Flame, Clock, Download } from 'lucide-react';
import { downloadEventIcs } from '@/lib/utils/calendar';
import EventModal from '../events/EventModal';
import TiltCard from '@/components/ui/TiltCard';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function UpcomingEventsPreview() {
  const { events: allEvents } = useData();
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // Take top events: 1 featured + 2 secondary
  const featuredEvent = allEvents[0];
  const secondaryEvents = allEvents.slice(1, 3);

  return (
    <section className="py-24 bg-[#FDFBF7] relative overflow-hidden">
      {/* Background Decorative Gold Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#58111A]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Staggered Entrance */}
        <ScrollReveal direction="up" distance={20} className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#58111A]/10 text-[#58111A] text-xs font-bold uppercase tracking-wider mb-3 border border-[#58111A]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              Agenda & Billetterie Officielle
            </div>
            <h2 className="font-serif-title font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#58111A] tracking-tight">
              Les Grands Rendez-vous du Terroir
            </h2>
            <p className="text-sm sm:text-base text-[#78716C] mt-2 max-w-xl">
              Réservez vos places via HelloAsso pour nos banquets, soirées dégustations de meules, voyages viticoles et rassemblements au Foyer.
            </p>
          </div>

          <Link
            href="/evenements"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#58111A] hover:text-[#722F37] group transition-colors px-4 py-2 rounded-2xl bg-[#FFFFFF] border border-[#EAE2D8] shadow-sm hover:shadow-md"
          >
            <span>Consulter le calendrier complet</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </ScrollReveal>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* ======================================================== */}
          {/* 1. FEATURED HERO EVENT CARD (Cols 1 to 7)                */}
          {/* ======================================================== */}
          {featuredEvent && (
            <ScrollReveal direction="up" delay={0.1} className="lg:col-span-7 flex">
              <TiltCard
                maxTilt={6}
                className="w-full rounded-3xl overflow-hidden bg-[#FFFFFF] border-2 border-[#D4AF37]/50 shadow-2xl flex flex-col justify-between group cursor-pointer relative"
                onClick={() => setSelectedEvent(featuredEvent)}
              >
                {/* Big Immersive Image */}
                <div className="relative h-72 sm:h-80 w-full overflow-hidden">
                  <img
                    src={featuredEvent.coverImageUrl}
                    alt={featuredEvent.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141716] via-[#141716]/40 to-transparent" />

                  {/* Top Floating Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#58111A] text-[#FDFBF7] text-xs font-bold shadow-lg border border-[#D4AF37]/50 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>À l&apos;Affiche • {featuredEvent.eventType}</span>
                    </span>
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-white">
                    <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{formatDateFrench(featuredEvent.startDate)}</span>
                    </div>

                    <span className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#D4AF37] text-[#58111A] text-[11px] sm:text-xs font-extrabold shadow-md">
                      {featuredEvent.requiresBooking === false || featuredEvent.eventType === 'Rassemblement'
                        ? '🎉 Entrée Libre'
                        : `${featuredEvent.remainingSeats} places`}
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-[#78716C]">
                      <MapPin className="w-3.5 h-3.5 text-[#58111A]" />
                      <span>{featuredEvent.location}</span>
                    </div>

                    <h3 className="font-serif-title font-extrabold text-xl sm:text-3xl text-[#58111A] group-hover:text-[#722F37] transition-colors leading-tight">
                      {featuredEvent.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed line-clamp-3">
                      {featuredEvent.description}
                    </p>
                  </div>

                  {/* Footer Row with Price and CTA */}
                  <div className="pt-5 border-t border-[#EAE2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] text-[#78716C] uppercase font-bold tracking-wider">Tarif Adhérent / Entrée</span>
                      <p className="font-serif-title font-extrabold text-xl sm:text-2xl text-[#58111A]">
                        {featuredEvent.requiresBooking === false || featuredEvent.eventType === 'Rassemblement' || featuredEvent.priceCents === 0
                          ? 'Gratuit'
                          : formatPrice(featuredEvent.priceCents)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadEventIcs(featuredEvent);
                        }}
                        className="px-3.5 py-3 rounded-2xl bg-[#F6F1EA] hover:bg-[#EAE2D8] text-[#58111A] border border-[#EAE2D8] font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm hover:scale-105"
                        title="Ajouter au calendrier (.ics)"
                      >
                        <Calendar className="w-4 h-4 text-[#D4AF37]" />
                        <span>+ Agenda</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(featuredEvent);
                        }}
                        className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-[#58111A] to-[#722F37] hover:from-[#722F37] hover:to-[#58111A] text-[#FDFBF7] font-bold text-xs sm:text-sm shadow-xl hover:shadow-[#58111A]/40 transition-all flex items-center justify-center gap-2 border border-[#D4AF37]/50"
                      >
                        <Ticket className="w-4 h-4 text-[#D4AF37]" />
                        <span>{featuredEvent.requiresBooking === false ? 'Détails' : 'Réserver'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </ScrollReveal>
          )}

          {/* ======================================================== */}
          {/* 2. SATELLITE EVENT CARDS (Cols 8 to 12)                  */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {secondaryEvents.map((event, idx) => (
              <ScrollReveal key={event.id} direction="up" delay={0.2 + idx * 0.15} className="flex-1 flex">
                <TiltCard
                  maxTilt={5}
                  className="w-full rounded-3xl overflow-hidden bg-[#FFFFFF] border border-[#EAE2D8] hover:border-[#D4AF37]/60 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between group cursor-pointer p-6 space-y-4"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex gap-4 items-start">
                    {/* Thumbnail */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 relative border border-[#EAE2D8]">
                      <img
                        src={event.coverImageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-[#58111A] text-[#FDFBF7] text-[9px] font-bold shadow-md">
                        {event.eventType}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1B3B2B]">
                        <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{formatDateFrench(event.startDate)}</span>
                      </div>

                      <h4 className="font-serif-title font-bold text-base sm:text-lg text-[#58111A] group-hover:text-[#722F37] transition-colors leading-snug line-clamp-2">
                        {event.title}
                      </h4>

                      <p className="text-xs text-[#78716C] line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  {/* Satellite Footer */}
                  <div className="pt-3 border-t border-[#EAE2D8] flex items-center justify-between text-xs">
                    <span className="font-serif-title font-bold text-[#58111A]">
                      {event.requiresBooking === false || event.eventType === 'Rassemblement' || event.priceCents === 0
                        ? 'Accès Libre'
                        : formatPrice(event.priceCents)}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadEventIcs(event);
                        }}
                        className="p-1.5 rounded-lg bg-[#F6F1EA] hover:bg-[#EAE2D8] text-[#58111A] transition-colors"
                        title="Ajouter au calendrier (.ics)"
                      >
                        <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      </button>

                      <span className="font-bold text-[#58111A] group-hover:text-[#722F37] flex items-center gap-1">
                        <span>Voir</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}

            {/* Link to all events banner */}
            <ScrollReveal direction="up" delay={0.5}>
              <Link
                href="/evenements"
                className="p-5 rounded-3xl bg-gradient-to-r from-[#14281D] to-[#1E3A2B] text-[#FDFBF7] border border-[#D4AF37]/40 shadow-xl flex items-center justify-between group hover:scale-[1.02] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#58111A] text-[#D4AF37] flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-serif-title font-bold text-sm text-[#FDFBF7]">
                      Rejoignez le prochain gueuleton
                    </h5>
                    <span className="text-xs text-[#D8CCC0]">
                      Dégustations exclusives réservées aux membres
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#D4AF37] group-hover:translate-x-2 transition-transform" />
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Modal for Details & HelloAsso */}
      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </section>
  );
}

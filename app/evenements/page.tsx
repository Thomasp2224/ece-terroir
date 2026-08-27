'use client';

import React, { useState } from 'react';
import { useData } from '@/lib/context/DataContext';
import { EventItem, EventType } from '@/lib/types';
import { formatDateFrench, formatDateTimeFrench, formatPrice } from '@/lib/utils';
import { Calendar, MapPin, Ticket, Sparkles, Filter, Users, Search, CheckCircle2, Flame, Download, AlertCircle } from 'lucide-react';
import { downloadEventIcs } from '@/lib/utils/calendar';
import EventModal from '@/components/events/EventModal';
import TiltCard from '@/components/ui/TiltCard';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function EvenementsPage() {
  const { events } = useData();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const eventTypes = ['all', 'Dégustation', 'Rassemblement', 'Voyage', 'Soirée', 'Atelier'];

  const filteredEvents = events.filter((evt) => {
    const matchesType = selectedType === 'all' || evt.eventType === selectedType;
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="py-12 sm:py-16 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Banner */}
        <ScrollReveal direction="up" className="rounded-3xl bg-[#14281D] text-[#FDFBF7] p-8 sm:p-12 relative overflow-hidden border border-[#D4AF37]/30 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#58111A]/40 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#58111A] text-[#D4AF37] text-xs font-bold uppercase tracking-wider border border-[#D4AF37]/40">
              <Calendar className="w-3.5 h-3.5" />
              Saison 2026-2027
            </div>
            <h1 className="font-serif-title font-extrabold text-3xl sm:text-5xl leading-tight">
              Calendrier & Rassemblements du Terroir
            </h1>
            <p className="text-sm sm:text-base text-[#D8CCC0]">
              Retrouvez toutes les soirées dégustations, grands gueuletons, ateliers du goût, voyages et rassemblements libres organisés par ECE Terroir.
            </p>
          </div>
        </ScrollReveal>

        {/* Filter & Search Bar */}
        <ScrollReveal direction="up" delay={0.1} className="p-4 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#EAE2D8] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <Filter className="w-4 h-4 text-[#58111A] shrink-0 hidden sm:block" />
            {eventTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedType === type
                    ? 'bg-[#58111A] text-[#FDFBF7] shadow-sm'
                    : 'bg-[#F6F1EA] text-[#78716C] hover:text-[#58111A] hover:bg-[#EAE2D8]'
                }`}
              >
                {type === 'all' ? 'Tous les Événements' : type}
              </button>
            ))}
          </div>

          {/* Search input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher une soirée, lieu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#F6F1EA] border border-[#EAE2D8] text-xs font-medium text-[#1D1917] placeholder:text-[#78716C] focus:outline-none focus:border-[#58111A] transition-colors"
            />
          </div>
        </ScrollReveal>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-[#FFFFFF] rounded-3xl border border-[#EAE2D8] p-8 space-y-4">
            <Calendar className="w-12 h-12 text-[#D8CCC0] mx-auto" />
            <h3 className="font-serif-title font-bold text-xl text-[#58111A]">Aucun événement trouvé</h3>
            <p className="text-sm text-[#78716C]">Essayez de modifier vos filtres ou revenez prochainement.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, idx) => {
              const isGathering = event.requiresBooking === false || event.eventType === 'Rassemblement';
              const isSoldOut = !isGathering && event.remainingSeats === 0;
              const isUrgent = !isGathering && event.remainingSeats > 0 && event.remainingSeats <= 5;

              return (
                <ScrollReveal key={event.id} direction="up" delay={idx * 0.08} className="flex">
                  <TiltCard
                    maxTilt={6}
                    className="bento-card w-full rounded-3xl overflow-hidden flex flex-col justify-between group cursor-pointer bg-[#FFFFFF]"
                    onClick={() => setSelectedEvent(event)}
                  >
                    {/* Cover & Badges */}
                    <div className="relative h-60 w-full overflow-hidden">
                      <img
                        src={event.coverImageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      
                      <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-[#58111A] text-[#FDFBF7] text-xs font-bold shadow-md border border-[#D4AF37]/40">
                          {event.eventType}
                        </span>
                        {isUrgent && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500 text-amber-950 text-[11px] font-extrabold shadow-md animate-pulse flex items-center gap-1">
                            <Flame className="w-3 h-3 text-amber-950 fill-amber-950" />
                            {event.remainingSeats} places !
                          </span>
                        )}
                        {isSoldOut && (
                          <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-[11px] font-extrabold shadow-md flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Complet
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 right-4">
                        <span className={`px-2.5 py-1 rounded-full backdrop-blur-md text-[11px] font-semibold ${
                          isUrgent
                            ? 'bg-amber-950/80 text-amber-200 border border-amber-500/40'
                            : isSoldOut
                            ? 'bg-red-950/80 text-red-200 border border-red-500/40'
                            : 'bg-black/60 text-[#FDFBF7]'
                        }`}>
                          {isGathering
                            ? '🎉 Entrée Libre'
                            : isSoldOut
                            ? 'Complet'
                            : `${event.remainingSeats} places restantes`}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#1B3B2B]">
                          <Calendar className="w-4 h-4 text-[#D4AF37]" />
                          <span>{formatDateTimeFrench(event.startDate)}</span>
                        </div>

                        <h3 className="font-serif-title font-bold text-xl text-[#58111A] group-hover:text-[#722F37] transition-colors leading-snug">
                          {event.title}
                        </h3>

                        <div className="flex items-center gap-1.5 text-xs text-[#78716C]">
                          <MapPin className="w-3.5 h-3.5 text-[#58111A] shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>

                        <p className="text-xs text-[#78716C] line-clamp-3 leading-relaxed pt-1">
                          {event.description}
                        </p>
                      </div>

                      {/* Footer & Reserve / Calendar CTA */}
                      <div className="pt-4 border-t border-[#EAE2D8] flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] text-[#78716C] uppercase font-bold">Accès</span>
                          <p className="font-serif-title font-extrabold text-base sm:text-lg text-[#58111A]">
                            {isGathering || event.priceCents === 0 ? 'Accès Libre' : formatPrice(event.priceCents)}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadEventIcs(event);
                            }}
                            className="px-2.5 py-2 rounded-xl bg-[#F6F1EA] hover:bg-[#EAE2D8] text-[#58111A] border border-[#EAE2D8] font-bold text-[11px] transition-all flex items-center gap-1.5 shadow-sm hover:scale-105"
                            title="Ajouter au calendrier (.ics Apple/Outlook/Google)"
                          >
                            <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>+ Agenda</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(event);
                            }}
                            className="px-4 py-2 rounded-xl bg-[#58111A] text-[#FDFBF7] font-semibold text-xs hover:bg-[#722F37] transition-all flex items-center gap-1.5 shadow-sm hover:scale-105"
                          >
                            {isGathering ? (
                              <>
                                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                                <span>Détails</span>
                              </>
                            ) : isSoldOut ? (
                              <>
                                <AlertCircle className="w-3.5 h-3.5 text-red-300" />
                                <span>Complet</span>
                              </>
                            ) : (
                              <>
                                <Ticket className="w-3.5 h-3.5 text-[#D4AF37]" />
                                <span>Réserver</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>

      {/* Event Details & Booking Modal */}
      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}

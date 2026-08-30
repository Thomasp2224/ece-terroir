'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Flame, Users, CalendarPlus, MapPin } from 'lucide-react';
import { useData } from '@/lib/context/DataContext';
import { getGoogleCalendarUrl, downloadEventIcs } from '@/lib/utils/calendar';
import { formatPrice } from '@/lib/utils';
import EventModal from '@/components/events/EventModal';
import { EventItem } from '@/lib/types';

export function LiveEventCountdownWidget() {
  const { events } = useData();
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // Find next upcoming event (or first event)
  const nextEvent = events[0];

  // Countdown state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!nextEvent) return;

    const targetDate = new Date(nextEvent.startDate || '2026-10-15T19:30:00');

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nextEvent]);

  if (!nextEvent) return null;

  const spotsLeft = nextEvent.remainingSeats ?? 0;
  const currentAttendees = nextEvent.capacity - nextEvent.remainingSeats;
  const progressPercent = nextEvent.capacity > 0 
    ? Math.min(100, Math.round((currentAttendees / nextEvent.capacity) * 100))
    : 80;
  const isAlmostFull = spotsLeft <= 5 && spotsLeft > 0;

  return (
    <>
      <div className="liquid-glass rounded-3xl p-5 sm:p-7 border border-white/90 shadow-xl relative overflow-hidden group w-full flex flex-col justify-between">
        
        {/* Background Atmosphere Lights */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#D4AF37]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#14281D]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
          
          {/* Header Tag */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14281D] text-[#D4AF37] text-[11px] font-extrabold uppercase tracking-wider border border-[#D4AF37]/30 shadow-sm">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              Prochain Banquet • Live Countdown
            </div>

            {isAlmostFull && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#58111A] text-[#FAF7F2] text-[10px] font-extrabold border border-[#D4AF37]/40 animate-pulse">
                <Flame className="w-3 h-3 text-[#D4AF37]" />
                Plus que {spotsLeft} places !
              </span>
            )}
          </div>

          {/* Event Title & Meta */}
          <div className="space-y-1.5">
            <h3 className="font-serif-title font-extrabold text-xl sm:text-2xl text-[#14281D] group-hover:text-[#2D5A3F] transition-colors leading-tight">
              {nextEvent.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#78716C]">
              <span className="flex items-center gap-1.5 font-medium text-[#14281D]">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                {nextEvent.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#2D5A3F]" />
                {currentAttendees}/{nextEvent.capacity} convives inscrits
              </span>
            </div>
          </div>

          {/* Liquid Glass Numbers Countdown */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 py-1">
            {[
              { label: 'Jours', value: timeLeft.days },
              { label: 'Heures', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Secondes', value: timeLeft.seconds },
            ].map((unit, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-2xl bg-white/80 border border-[#EAE2D8] shadow-sm relative overflow-hidden group/box"
              >
                <span className="font-serif-title font-black text-2xl sm:text-3xl text-[#14281D] tracking-tight tabular-nums">
                  {String(unit.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider mt-0.5">
                  {unit.label}
                </span>
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 group-hover/box:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>

          {/* Jauge de Remplissage */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-[#14281D]">Jauge de la salle</span>
              <span className="text-[#D4AF37]">{progressPercent}% complet</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#EAE2D8] overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#14281D] via-[#2D5A3F] to-[#D4AF37] transition-all duration-700 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              onClick={() => setSelectedEvent(nextEvent)}
              className="flex-1 skeuo-btn-pine py-2.5 sm:py-3 px-4 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] transition-all"
            >
              <span>Réserver Ma Place ({formatPrice(nextEvent.priceCents)})</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            </button>

            <a
              href={getGoogleCalendarUrl(nextEvent)}
              target="_blank"
              rel="noreferrer"
              title="Ajouter à Google Agenda"
              className="p-2.5 sm:p-3 rounded-2xl skeuo-btn-cream text-[#14281D] hover:text-[#D4AF37] flex items-center justify-center transition-all"
            >
              <CalendarPlus className="w-4 h-4" />
            </a>
          </div>

        </div>
      </div>

      {/* Modal Détails & Billetterie */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>
  );
}

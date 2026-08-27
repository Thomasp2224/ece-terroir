'use client';

import React, { useState } from 'react';
import { EventItem } from '@/lib/types';
import { formatDateTimeFrench, formatPrice } from '@/lib/utils';
import { downloadEventIcs, getGoogleCalendarUrl, getOutlookCalendarUrl } from '@/lib/utils/calendar';
import { 
  X, 
  Calendar, 
  MapPin, 
  Users, 
  ExternalLink, 
  Ticket, 
  CheckCircle2, 
  Sparkles,
  Download,
  Flame,
  AlertCircle
} from 'lucide-react';

interface EventModalProps {
  event: EventItem | null;
  onClose: () => void;
}

export default function EventModal({ event, onClose }: EventModalProps) {
  const [showCalendarMenu, setShowCalendarMenu] = useState(false);

  if (!event) return null;

  const isGathering = event.requiresBooking === false || event.eventType === 'Rassemblement';
  const isSoldOut = !isGathering && event.remainingSeats === 0;
  const isUrgent = !isGathering && event.remainingSeats > 0 && event.remainingSeats <= 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Card with mobile scroll safety */}
      <div className="relative bg-[#FDFBF7] text-[#1D1917] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#D4AF37]/40 z-10 animate-in zoom-in-95 duration-200">
        {/* Cover image header */}
        <div className="relative h-48 sm:h-72 w-full shrink-0">
          <img
            src={event.coverImageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#58111A] via-[#58111A]/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-block px-3 py-1 rounded-full bg-[#D4AF37] text-[#58111A] text-xs font-bold uppercase tracking-wider">
                {event.eventType}
              </span>
              {isUrgent && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-amber-950 text-xs font-extrabold shadow-md animate-pulse">
                  <Flame className="w-3.5 h-3.5 text-amber-950 fill-amber-950" />
                  Dernières places ({event.remainingSeats} restantes)
                </span>
              )}
              {isSoldOut && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-extrabold shadow-md">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Complet
                </span>
              )}
            </div>
            <h3 className="font-serif-title font-bold text-2xl sm:text-3xl leading-tight">
              {event.title}
            </h3>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key metadata grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#F6F1EA] border border-[#EAE2D8] flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#58111A] shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-[#78716C]">Date & Heure</span>
                <p className="text-xs font-bold text-[#1D1917] leading-snug">
                  {formatDateTimeFrench(event.startDate)}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F6F1EA] border border-[#EAE2D8] flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#1B3B2B] shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-[#78716C]">Lieu</span>
                <p className="text-xs font-bold text-[#1D1917] truncate leading-snug">
                  {event.location}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F6F1EA] border border-[#EAE2D8] flex items-center gap-3">
              <Users className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-[#78716C]">
                  {isGathering ? 'Accès' : 'Places'}
                </span>
                <p className={`text-xs font-bold ${isUrgent ? 'text-amber-700' : isSoldOut ? 'text-red-700' : 'text-[#58111A]'}`}>
                  {isGathering
                    ? 'Entrée Libre • Ouvert à tous'
                    : isSoldOut
                    ? 'Complet (0 place)'
                    : `${event.remainingSeats} restantes / ${event.capacity}`}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="font-serif-title font-bold text-lg text-[#58111A]">À propos de cet événement</h4>
            <p className="text-sm text-[#5C554E] leading-relaxed">
              {event.longDescription || event.description}
            </p>
          </div>

          {/* Calendar Sync Bar */}
          <div className="p-4 rounded-2xl bg-[#F6F1EA] border border-[#EAE2D8] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#58111A] text-[#D4AF37] flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#1D1917]">
                Ajouter à votre agenda personnel :
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => downloadEventIcs(event)}
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF7F2] text-[#58111A] border border-[#EAE2D8] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                title="Télécharger fichier .ics compatible Apple Calendar & Outlook"
              >
                <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Fichier .ics</span>
              </button>

              <a
                href={getGoogleCalendarUrl(event)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF7F2] text-[#1B3B2B] border border-[#EAE2D8] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                title="Ajouter directement à Google Calendar"
              >
                <span>Google Agenda</span>
                <ExternalLink className="w-3 h-3 text-[#78716C]" />
              </a>
            </div>
          </div>

          {/* Action / Booking / Gathering Block */}
          {isGathering ? (
            <div className="p-5 rounded-2xl bg-[#1B3B2B] text-[#FDFBF7] border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs text-[#D4AF37] font-semibold uppercase tracking-wider flex items-center gap-1.5 justify-center sm:justify-start">
                  <Sparkles className="w-3.5 h-3.5" />
                  Rassemblement Convivial
                </span>
                <p className="font-serif-title font-extrabold text-xl text-[#FDFBF7]">
                  Accès Libre • Sans Réservation
                </p>
                <p className="text-[11px] text-[#D8CCC0]">
                  Pas besoin de billet. Venez simplement au lieu indiqué pour partager un bon moment !
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#58111A] text-[#FDFBF7] hover:bg-[#722F37] font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 border border-[#D4AF37]/50 shrink-0"
              >
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>C&apos;est noté, j&apos;y serai !</span>
              </button>
            </div>
          ) : isSoldOut ? (
            <div className="p-5 rounded-2xl bg-red-950/20 text-red-950 border border-red-300 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs text-red-800 font-bold uppercase tracking-wider flex items-center gap-1.5 justify-center sm:justify-start">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                  Inscriptions Closes
                </span>
                <p className="font-serif-title font-bold text-lg text-red-950">
                  Cette soirée est désormais complète
                </p>
                <p className="text-[11px] text-red-800">
                  Rejoignez-nous lors du prochain événement ou surveillez les désistements au foyer !
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-bold text-xs transition-colors"
              >
                Fermer
              </button>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-[#14281D] text-[#FDFBF7] border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs text-[#D4AF37] font-semibold uppercase tracking-wider">
                  Billetterie Officielle HelloAsso
                </span>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="font-serif-title font-extrabold text-2xl text-[#FDFBF7]">
                    {event.priceCents === 0 ? 'Gratuit' : formatPrice(event.priceCents)}
                  </span>
                  <span className="text-xs text-[#D8CCC0]">/ place</span>
                </div>
              </div>

              <a
                href={event.helloAssoUrl || 'https://www.helloasso.com'}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#58111A] text-[#FDFBF7] hover:bg-[#722F37] font-bold text-sm transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 border border-[#D4AF37]/50"
              >
                <Ticket className="w-4 h-4 text-[#D4AF37]" />
                <span>Réserver sur HelloAsso</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

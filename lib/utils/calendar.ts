import { EventItem } from '@/lib/types';

/**
 * Formats a Date or ISO string into iCalendar UTC timestamp format: YYYYMMDDTHHmmssZ
 */
function formatIcsDate(isoString: string, durationHours = 3): { start: string; end: string } {
  const startDate = new Date(isoString);
  // Default end date is 3 hours after start
  const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);

  const pad = (n: number) => String(n).padStart(2, '0');

  const toUtcFormat = (d: Date) => {
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
  };

  return {
    start: toUtcFormat(startDate),
    end: toUtcFormat(endDate),
  };
}

/**
 * Escapes characters for iCalendar text fields according to RFC 5545
 */
function escapeIcsText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Generates and downloads a standard RFC 5545 `.ics` file for the given event
 */
export function downloadEventIcs(event: EventItem, durationHours = 3) {
  if (typeof window === 'undefined') return;

  const { start, end } = formatIcsDate(event.startDate, durationHours);
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const stamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;

  const summary = escapeIcsText(`🧀 ECE Terroir — ${event.title}`);
  const location = escapeIcsText(`${event.location} (Campus ECE Paris, 10 Rue Sextius Michel, 75015 Paris)`);
  
  let descriptionText = event.description;
  if (event.helloAssoUrl) {
    descriptionText += `\n\nBilletterie & Inscriptions : ${event.helloAssoUrl}`;
  }
  descriptionText += `\n\nAssociation ECE Terroir • L'Art du Bien-Manger à l'ECE Paris`;
  const description = escapeIcsText(descriptionText);

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ECE Terroir//Calendrier Evenements//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:ece-terroir-${event.id}-${start}@eceterroir.fr`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    event.helloAssoUrl ? `URL:${event.helloAssoUrl}` : 'URL:https://eceterroir.fr/evenements',
    'ORGANIZER;CN=ECE Terroir:mailto:contact@eceterroir.fr',
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Rappel Dégustation ECE Terroir',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `ECE-Terroir-${event.slug || event.id}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Generates direct Google Calendar Web URL
 */
export function getGoogleCalendarUrl(event: EventItem, durationHours = 3): string {
  const { start, end } = formatIcsDate(event.startDate, durationHours);
  const title = encodeURIComponent(`🧀 ECE Terroir — ${event.title}`);
  
  let details = `${event.description}\n\n`;
  if (event.helloAssoUrl) {
    details += `Billetterie HelloAsso : ${event.helloAssoUrl}\n`;
  }
  details += `Association ECE Terroir • Campus ECE Paris`;
  const detailsEncoded = encodeURIComponent(details);
  const locationEncoded = encodeURIComponent(`${event.location} (Campus ECE Paris, 75015)`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${detailsEncoded}&location=${locationEncoded}`;
}

/**
 * Generates direct Outlook / Office 365 Web URL
 */
export function getOutlookCalendarUrl(event: EventItem, durationHours = 3): string {
  const startDate = new Date(event.startDate);
  const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);
  
  const title = encodeURIComponent(`🧀 ECE Terroir — ${event.title}`);
  let details = `${event.description}\n\n`;
  if (event.helloAssoUrl) {
    details += `Billetterie HelloAsso : ${event.helloAssoUrl}\n`;
  }
  details += `Association ECE Terroir • Campus ECE Paris`;

  const startIso = startDate.toISOString();
  const endIso = endDate.toISOString();

  return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=${startIso}&enddt=${endIso}&body=${encodeURIComponent(details)}&location=${encodeURIComponent(event.location)}`;
}

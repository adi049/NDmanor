import { rooms, site } from '../data/site';

export function createWhatsAppUrl(message) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message) {
  const url = createWhatsAppUrl(message);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  return url;
}

export function formatDate(date) {
  if (!date) return 'Not specified';
  const parsed = new Date(`${date}T12:00:00`);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
}

export function bookingMessage(data) {
  const roomPreference = rooms.find((room) => room.slug === data.roomPreference)?.name || 'No preference';
  return [
    'Hello Hotel ND Manor, I would like to request a reservation.',
    '',
    `Name: ${data.name || 'Not provided'}`,
    `Phone: ${data.phone || 'Not provided'}`,
    `Email: ${data.email || 'Not provided'}`,
    `Check-in: ${formatDate(data.checkIn)}`,
    `Check-out: ${formatDate(data.checkOut)}`,
    `Adults: ${data.adults}`,
    `Children: ${data.children}`,
    `Rooms: ${data.rooms}`,
    `Room preference: ${roomPreference}`,
    `Special requests: ${data.requests?.trim() || 'None'}`,
    '',
    'Please confirm availability, room details and the applicable rate. I understand this is an inquiry, not a confirmed booking.',
  ].join('\n');
}

export function availabilityMessage(data) {
  return [
    'Hello Hotel ND Manor, I would like to check room availability.',
    '',
    `Check-in: ${formatDate(data.checkIn)}`,
    `Check-out: ${formatDate(data.checkOut)}`,
    `Adults: ${data.adults}`,
    `Children: ${data.children}`,
    `Rooms: ${data.rooms}`,
    '',
    'Please share available room options and rates. I understand this is an inquiry, not a confirmed booking.',
  ].join('\n');
}

export function eventMessage(data) {
  return [
    'Hello Hotel ND Manor, I would like to plan an event.',
    '',
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `Event type: ${data.eventType}`,
    `Preferred date: ${formatDate(data.eventDate)}`,
    `Estimated guests: ${data.guests || 'To be discussed'}`,
    `Requirements: ${data.message?.trim() || 'To be discussed'}`,
    '',
    'Please contact me to discuss suitable event spaces, arrangements and pricing.',
  ].join('\n');
}

export function contactMessage(data) {
  return [
    'Hello Hotel ND Manor, I have a general inquiry.',
    '',
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email || 'Not provided'}`,
    `Inquiry: ${data.subject}`,
    `Message: ${data.message}`,
  ].join('\n');
}

export function diningMessage(data = {}) {
  return [
    'Hello Hotel ND Manor, I would like to make a dining inquiry.',
    '',
    data.name ? `Name: ${data.name}` : null,
    data.phone ? `Phone: ${data.phone}` : null,
    data.date ? `Preferred date: ${formatDate(data.date)}` : null,
    data.guests ? `Guests: ${data.guests}` : null,
    data.message ? `Request: ${data.message}` : null,
    '',
    'Please share the current dining details and availability.',
  ].filter(Boolean).join('\n');
}

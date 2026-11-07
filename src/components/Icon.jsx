export default function Icon({ name, size = 20, className = '' }) {
  const paths = {
    'arrow-right': <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    'arrow-up-right': <><path d="M7 17 17 7"/><path d="M7 7h10v10"/></>,
    'arrow-up': <><path d="m6 10 6-6 6 6"/><path d="M12 4v16"/></>,
    'chevron-down': <path d="m6 9 6 6 6-6"/>,
    'chevron-left': <path d="m15 18-6-6 6-6"/>,
    'chevron-right': <path d="m9 18 6-6-6-6"/>,
    close: <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
    menu: <><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></>,
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.56 2.81.69A2 2 0 0 1 22 16.92z"/>,
    whatsapp: <><path d="M21 11.5a8.5 8.5 0 0 1-12.57 7.46L3 20.5l1.56-5.25A8.5 8.5 0 1 1 21 11.5z"/><path d="M8.2 8.1c.5 3.1 2.6 5.2 5.7 5.7l1.1-1.2c.3-.3.7-.4 1.1-.2l2 .9"/></>,
    'map-pin': <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="2.5"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    car: <><path d="m5 11 2-5h10l2 5"/><path d="M3 11h18v7H3zM6 18v2M18 18v2"/><circle cx="7" cy="14.5" r=".5"/><circle cx="17" cy="14.5" r=".5"/></>,
    wifi: <><path d="M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M2 9a14 14 0 0 1 20 0"/><circle cx="12" cy="20" r=".6" fill="currentColor" stroke="none"/></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".7" fill="currentColor" stroke="none"/></>,
    facebook: <path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v6h4v-6h3l1-4h-4V9c0-.6.4-1 1-1z"/>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 7 9 6 9-6"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
  };
  return (
    <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {paths[name] || paths['arrow-right']}
    </svg>
  );
}

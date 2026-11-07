import { Link } from 'react-router-dom';

const logoSources = [
  { src: '/images/nd-manor-logo-128.webp', width: 128 },
  { src: '/images/nd-manor-logo-256.webp', width: 256 },
  { src: '/images/nd-manor-logo-512.webp', width: 512 },
  { src: '/images/nd-manor-logo-1024.webp', width: 1024 },
];

// Decorative presentation of the hotel's circular ND Mandala logo. The visible
// "ND MANOR / DEHRADUN" wordmark beside it carries the accessible name.
export function BrandLogo({ className = '', sizes = '96px' }) {
  return (
    <img
      className={className}
      data-brand-logo=""
      src="/images/nd-manor-logo-256.webp"
      srcSet={logoSources.map((source) => `${source.src} ${source.width}w`).join(', ')}
      sizes={sizes}
      width="512"
      height="512"
      alt=""
      aria-hidden="true"
      decoding="async"
    />
  );
}

export function Monogram({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 58 58" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M12 40V18h3.6l10.8 14.2V18h3.4v22h-3.5L15.4 25.7V40H12Z" fill="currentColor" />
      <path d="M33 18h6.2C46.3 18 50 22.1 50 29s-3.7 11-10.8 11H33V18Zm3.4 3.2v15.6h2.6c4.8 0 7.4-2.7 7.4-7.8s-2.6-7.8-7.4-7.8h-2.6Z" fill="currentColor" />
    </svg>
  );
}

export default function Logo({ light = false, onClick }) {
  return (
    <Link to="/" className={`logo ${light ? 'logo--light' : ''}`} onClick={onClick}>
      <BrandLogo className="logo__mark" sizes="(max-width: 800px) 42px, 47px" />
      <span className="logo__type">
        <span className="logo__name">ND MANOR</span>
        <span className="logo__place">DEHRADUN</span>
      </span>
    </Link>
  );
}

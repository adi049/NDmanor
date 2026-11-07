import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { navigation, site } from '../data/site';
import Logo from './Logo';
import Icon from './Icon';

export default function Header() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef = useRef(null);
  const menuButtonRef = useRef(null);
  const isHome = pathname === '/';
  const light = isHome && !scrolled && !menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const panel = panelRef.current;
    const focusable = () => Array.from(panel?.querySelectorAll('a[href], button:not([disabled])') || []);
    focusable()[0]?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
      if (event.key === 'Tab') {
        const elements = focusable();
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className={`site-header ${light ? 'site-header--light' : 'site-header--solid'} ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container site-header__inner">
        <Logo light={light} />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => isActive ? 'active' : ''}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="site-header__actions">
          <a className="header-phone" href={`tel:${site.phone}`} aria-label={`Call Hotel ND Manor on ${site.phoneDisplay}`}>
            <Icon name="phone" size={17} /><span>Call</span>
          </a>
          <Link to="/booking" className="button button--gold header-book">Book Your Stay</Link>
          <button
            ref={menuButtonRef}
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={25} />
          </button>
        </div>
      </div>
      <div className={`mobile-menu ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <button className="mobile-menu__backdrop" aria-label="Close navigation menu" tabIndex={menuOpen ? 0 : -1} onClick={() => setMenuOpen(false)} />
        <div className="mobile-menu__panel" id="mobile-navigation" ref={panelRef} role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div className="mobile-menu__top">
            <Logo light onClick={() => setMenuOpen(false)} />
            <button type="button" className="mobile-menu__close" aria-label="Close navigation menu" onClick={() => setMenuOpen(false)}>
              <Icon name="close" size={25} />
            </button>
          </div>
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {navigation.map((item, index) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} tabIndex={menuOpen ? 0 : -1}>
                <span>{String(index + 1).padStart(2, '0')}</span>{item.label}<Icon name="arrow-right" size={18} />
              </NavLink>
            ))}
          </nav>
          <div className="mobile-menu__footer">
            <Link to="/booking" className="button button--gold button--wide" tabIndex={menuOpen ? 0 : -1}>Book Your Stay</Link>
            <a href={`tel:${site.phone}`} tabIndex={menuOpen ? 0 : -1}><Icon name="phone" size={17} />{site.phoneDisplay}</a>
            <p>{site.shortAddress}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

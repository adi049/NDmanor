import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { galleryCategories } from '../data/gallery';
import HotelImage, { responsiveImage, responsiveSrcSet } from './HotelImage';
import Icon from './Icon';

function galleryImageSizes(index, layout) {
  const variant = index % 6;
  const mobile = variant === 0 ? '100vw' : '50vw';
  let desktop = '(min-width: 1500px) 420px, 33vw';
  if (layout === 'wide' || (layout === 'events' && (variant === 3 || variant === 4))) {
    desktop = '(min-width: 1500px) 680px, 50vw';
  } else if (variant === 0) {
    desktop = '(min-width: 1500px) 780px, 58vw';
  } else if (variant === 1 || variant === 2) {
    desktop = '(min-width: 1500px) 560px, 42vw';
  }
  return `(max-width: 800px) ${mobile}, ${desktop}`;
}

function Lightbox({ items, index, onClose, onChange, returnFocus }) {
  const closeRef = useRef(null);
  const touchStart = useRef(null);
  const item = items[index];

  const current = useRef({ index, items, onClose, onChange });

  useEffect(() => {
    current.current = { index, items, onClose, onChange };
  }, [index, items, onClose, onChange]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      const active = current.current;
      if (event.key === 'Escape') active.onClose();
      if (event.key === 'ArrowRight') active.onChange((active.index + 1) % active.items.length);
      if (event.key === 'ArrowLeft') active.onChange((active.index - 1 + active.items.length) % active.items.length);
      if (event.key === 'Tab') {
        const dialog = document.getElementById('gallery-lightbox');
        const focusable = Array.from(dialog?.querySelectorAll('button, a[href]') || []);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
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
      returnFocus.current?.focus();
    };
  }, [returnFocus]);

  if (!item) return null;
  const previous = () => onChange((index - 1 + items.length) % items.length);
  const next = () => onChange((index + 1) % items.length);

  return createPortal(
    <div className="lightbox" id="gallery-lightbox" role="dialog" aria-modal="true" aria-label={`${item.caption}, image ${index + 1} of ${items.length}`}>
      <button className="lightbox__backdrop" type="button" onClick={onClose} aria-label="Close image viewer" />
      <div className="lightbox__topbar">
        <span>{item.category} <span aria-hidden="true">/</span> {String(index + 1).padStart(2, '0')} of {String(items.length).padStart(2, '0')}</span>
        <button ref={closeRef} type="button" className="lightbox__close" onClick={onClose} aria-label="Close image viewer"><Icon name="close" size={26} /></button>
      </div>
      <button type="button" className="lightbox__nav lightbox__nav--previous" onClick={previous} aria-label="Previous image"><Icon name="chevron-left" size={30} /></button>
      <figure
        className="lightbox__figure"
        onTouchStart={(event) => { touchStart.current = event.changedTouches[0].clientX; }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) return;
          const distance = event.changedTouches[0].clientX - touchStart.current;
          if (Math.abs(distance) > 50) distance > 0 ? previous() : next();
          touchStart.current = null;
        }}
      >
        <img
          key={item.id}
          src={item.src}
          srcSet={responsiveSrcSet(item.src)}
          sizes="100vw"
          width={responsiveImage(item.src)?.width}
          height={responsiveImage(item.src)?.height}
          alt={item.alt}
          decoding="async"
        />
        <figcaption><span>{item.caption}</span><small>Hotel ND Manor, Dehradun</small></figcaption>
      </figure>
      <button type="button" className="lightbox__nav lightbox__nav--next" onClick={next} aria-label="Next image"><Icon name="chevron-right" size={30} /></button>
    </div>,
    document.body,
  );
}

export default function Gallery({ items, filters = false, limit, className = '', layout = 'default' }) {
  const [category, setCategory] = useState('All Photos');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const returnFocus = useRef(null);
  const filtered = useMemo(() => {
    const visible = category === 'All Photos' || !filters ? items : items.filter((item) => item.category === category);
    return limit ? visible.slice(0, limit) : visible;
  }, [category, filters, items, limit]);

  const open = (index, event) => {
    returnFocus.current = event.currentTarget;
    setSelectedIndex(index);
  };
  const close = () => setSelectedIndex(null);

  return (
    <div className={`gallery-component ${className}`}>
      {filters && (
        <div className="gallery-filters" role="group" aria-label="Filter photographs by category">
          {galleryCategories.map((filter) => (
            <button
              key={filter}
              type="button"
              className={category === filter ? 'active' : ''}
              aria-pressed={category === filter}
              onClick={() => { setCategory(filter); setSelectedIndex(null); }}
            >
              {filter}
              <span>{filter === 'All Photos' ? items.length : items.filter((item) => item.category === filter).length}</span>
            </button>
          ))}
        </div>
      )}
      <div className="gallery-grid" aria-live="polite">
        {filtered.map((item, index) => (
          <button className={`gallery-item gallery-item--${index % 6}`} type="button" key={item.id} onClick={(event) => open(index, event)} aria-label={`Open photograph: ${item.caption}`}>
            <HotelImage image={item} thumbnail className="gallery-item__image" sizes={galleryImageSizes(index, layout)} />
            <span className="gallery-item__caption"><span>{item.caption}</span><small>{item.category}</small></span>
            <span className="gallery-item__open" aria-hidden="true">+</span>
          </button>
        ))}
      </div>
      {filtered.length === 0 && <p className="gallery-empty">No photographs are currently listed in this category.</p>}
      {selectedIndex !== null && <Lightbox items={filtered} index={selectedIndex} onClose={close} onChange={setSelectedIndex} returnFocus={returnFocus} />}
    </div>
  );
}

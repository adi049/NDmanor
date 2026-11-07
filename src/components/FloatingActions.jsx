import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { createWhatsAppUrl } from '../utils/whatsapp';
import Icon from './Icon';

const clearanceSelector = '.booking-bar, .form-submit-row, .room-card__actions, .room-detail__content .button-group, .site-footer';

export default function FloatingActions() {
  const { pathname } = useLocation();
  const [showTop, setShowTop] = useState(false);
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 800px)').matches);
  const [yieldToContent, setYieldToContent] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 650);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 800px)');
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const visible = new Set();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      setYieldToContent(visible.size > 0);
    }, { threshold: 0.02 });
    document.querySelectorAll(clearanceSelector).forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      visible.clear();
    };
  }, [compact, pathname]);

  return (
    <div className="floating-actions">
      {showTop && (
        <button className="back-to-top" type="button" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}>
          <Icon name="arrow-up" size={19} />
        </button>
      )}
      {!yieldToContent && (
        <a
          className="whatsapp-float"
          href={createWhatsAppUrl('Hello Hotel ND Manor, I have an inquiry. Please assist me.')}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with Hotel ND Manor on WhatsApp"
        >
          <Icon name="whatsapp" size={21} /><span>WhatsApp</span>
        </a>
      )}
    </div>
  );
}

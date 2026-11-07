import { useEffect } from 'react';
import { getSeo, site } from '../data/site';

function setMeta(selector, attribute, value) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    const match = selector.match(/\[(name|property)="([^"]+)"\]/);
    if (match) element.setAttribute(match[1], match[2]);
    document.head.appendChild(element);
  }
  element.setAttribute(attribute, value);
}

export default function SEO({ path }) {
  useEffect(() => {
    const seo = getSeo(path);
    const title = seo?.title || 'Page Not Found | Hotel ND Manor';
    const description = seo?.description || 'The page you requested could not be found. Return to Hotel ND Manor to explore rooms, dining and events in Dehradun.';
    const base = (site.domain || window.location.origin).replace(/\/$/, '');
    const canonical = `${base}${path === '/' ? '/' : path}`;
    const socialImage = `${base}/og-image.jpg`;
    document.title = title;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', canonical);
    setMeta('meta[property="og:image"]', 'content', socialImage);
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:image"]', 'content', socialImage);
    let canonicalLink = document.head.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;
    if (!seo) setMeta('meta[name="robots"]', 'content', 'noindex, follow');
    else document.head.querySelector('meta[name="robots"]')?.remove();
  }, [path]);
  return null;
}

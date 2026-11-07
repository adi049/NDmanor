import { chromium } from '@playwright/test';
import { seoRoutes } from '../src/data/site.js';

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
const mobileWidths = [360, 375, 390, 414, 430];
const desktopWidths = [1280, 1366, 1440, 1600, 1920];
const failures = [];
const routes = seoRoutes.map((route) => route.path);

const browser = await chromium.launch();

async function inspect(width) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  for (const route of routes) {
    await page.goto(`${base}${route}`, { waitUntil: 'load' });
    await page.waitForTimeout(250);
    await page.evaluate(async () => {
      const step = Math.round(window.innerHeight * 0.9);
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 70));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(300);
    const result = await page.evaluate(() => {
      const problems = { overflow: 0, distorted: [], spilling: [], tinyTargets: [], shortButtons: [], unevenCards: [] };
      problems.overflow = document.documentElement.scrollWidth - window.innerWidth;
      const box = (el) => el.getBoundingClientRect();
      document.querySelectorAll('img').forEach((image) => {
        if (!image.complete || !image.naturalWidth) return;
        const styles = getComputedStyle(image);
        const rect = box(image);
        if (rect.width < 4 || rect.height < 4) return;
        const fit = styles.objectFit;
        if (fit === 'fill' || fit === '') {
          const natural = image.naturalWidth / image.naturalHeight;
          const shown = rect.width / rect.height;
          if (Math.abs(natural - shown) / natural > 0.04) problems.distorted.push(image.currentSrc.split('/').pop());
        }
        const holder = image.closest('.hotel-image, .gallery-item__image, figure, picture') || image.parentElement;
        if (holder) {
          const hb = box(holder);
          const tolerance = 1.5;
          if (rect.left < hb.left - tolerance || rect.right > hb.right + tolerance || rect.top < hb.top - tolerance || rect.bottom > hb.bottom + tolerance) {
            problems.spilling.push(image.currentSrc.split('/').pop());
          }
        }
        if (rect.width > window.innerWidth + 1) problems.spilling.push(`wide:${image.currentSrc.split('/').pop()}`);
      });
      document.querySelectorAll('a, button').forEach((el) => {
        if (el.closest('.mobile-menu, .desktop-nav, .breadcrumbs, .footer__column, .site-footer .text-link')) return;
        const rect = box(el);
        if (!rect.width || !rect.height) return;
        const styles = getComputedStyle(el);
        if (styles.visibility === 'hidden' || styles.opacity === '0' || styles.pointerEvents === 'none') return;
        const label = (el.textContent || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 32);
        if (rect.height < 44 && el.matches('.button, .header-book, .gallery-filters button, .whatsapp-float, .back-to-top, .menu-toggle')) {
          problems.tinyTargets.push(`${label}=${Math.round(rect.height)}px`);
        }
      });
      document.querySelectorAll('.button').forEach((el) => {
        const rect = box(el);
        if (!rect.height) return;
        if (rect.height < 50) problems.shortButtons.push(`${(el.textContent || '').trim().slice(0, 24)}=${Math.round(rect.height)}px`);
      });
      document.querySelectorAll('.room-grid, .experience-grid, .event-possibility-grid, .contact-methods, .booking-notes, .editorial-cards').forEach((grid) => {
        const rows = new Map();
        [...grid.children].forEach((child) => {
          const rect = box(child);
          const row = Math.round(rect.top / 4);
          if (!rows.has(row)) rows.set(row, []);
          rows.get(row).push(Math.round(rect.height));
        });
        rows.forEach((heights) => {
          if (heights.length > 1 && Math.max(...heights) - Math.min(...heights) > 2) {
            problems.unevenCards.push(`${grid.className.split(' ')[0]}:${heights.join('/')}`);
          }
        });
      });
      return problems;
    });
    const key = `${width}px ${route}`;
    if (result.overflow > 1) failures.push(`${key}: horizontal overflow ${result.overflow}px`);
    if (result.distorted.length) failures.push(`${key}: distorted images ${result.distorted.join(', ')}`);
    if (result.spilling.length) failures.push(`${key}: images outside their frame ${result.spilling.join(', ')}`);
    if (result.tinyTargets.length) failures.push(`${key}: small control targets ${result.tinyTargets.join(', ')}`);
    if (width >= 800 && result.shortButtons.length) failures.push(`${key}: buttons under 50px ${result.shortButtons.join(', ')}`);
    if (result.unevenCards.length) failures.push(`${key}: uneven card heights ${result.unevenCards.join(' ')}`);
  }
  await context.close();
}

for (const width of [...mobileWidths, ...desktopWidths]) await inspect(width);
await browser.close();

if (failures.length) {
  console.log(failures.join('\n'));
  throw new Error(`Layout audit failed with ${failures.length} issues`);
}
console.log(`Layout audit passed: ${routes.length} routes at ${[...mobileWidths, ...desktopWidths].join('/')}px, no overflow, distortion, spill, small controls or uneven card rows.`);

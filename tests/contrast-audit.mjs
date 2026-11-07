import { chromium } from '@playwright/test';
import { seoRoutes } from '../src/data/site.js';

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
const viewports = [{ width: 1440, height: 900 }, { width: 390, height: 844 }];
const failures = [];
const browser = await chromium.launch();

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
  const page = await context.newPage();
  for (const route of seoRoutes.map((r) => r.path)) {
    await page.goto(`${base}${route}`, { waitUntil: 'load' });
    await page.waitForTimeout(250);
    await page.evaluate(async () => {
      const step = Math.round(window.innerHeight * 0.9);
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(250);
    const issues = await page.evaluate(() => {
      const parse = (value) => {
        const match = value.match(/rgba?\(([^)]+)\)/);
        if (!match) return null;
        const parts = match[1].split(',').map((part) => parseFloat(part));
        return { r: parts[0], g: parts[1], b: parts[2], a: parts[3] ?? 1 };
      };
      const luminance = ({ r, g, b }) => {
        const channel = (value) => {
          const c = value / 255;
          return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
      };
      const blend = (top, bottom) => ({
        r: top.r * top.a + bottom.r * (1 - top.a),
        g: top.g * top.a + bottom.g * (1 - top.a),
        b: top.b * top.a + bottom.b * (1 - top.a),
        a: 1,
      });
      const ground = (element) => {
        const layers = [];
        let node = element;
        while (node && node !== document.documentElement) {
          const style = getComputedStyle(node);
          if (style.backgroundImage !== 'none' && !style.backgroundImage.startsWith('linear-gradient(rgba(0, 0, 0, 0)')) return null;
          const colour = parse(style.backgroundColor);
          if (colour && colour.a > 0) {
            layers.push(colour);
            if (colour.a >= 1) break;
          }
          node = node.parentElement;
        }
        let result = { r: 255, g: 255, b: 255, a: 1 };
        for (let index = layers.length - 1; index >= 0; index -= 1) result = blend(layers[index], result);
        return result;
      };
      const found = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const seen = new Set();
      while (walker.nextNode()) {
        const text = walker.currentNode.textContent.trim();
        if (!text) continue;
        const element = walker.currentNode.parentElement;
        if (!element || seen.has(element)) continue;
        seen.add(element);
        if (element.closest('.mobile-menu, .lightbox, [aria-hidden="true"], .skip-link')) continue;
        const rect = element.getBoundingClientRect();
        if (rect.width < 2 || rect.height < 2) continue;
        const style = getComputedStyle(element);
        if (style.visibility === 'hidden' || style.opacity === '0' || style.display === 'none') continue;
        const bg = ground(element);
        if (!bg) continue;
        const fgRaw = parse(style.color);
        if (!fgRaw) continue;
        const fg = blend(fgRaw, bg);
        const light = Math.max(luminance(fg), luminance(bg));
        const dark = Math.min(luminance(fg), luminance(bg));
        const ratio = (light + 0.05) / (dark + 0.05);
        const size = parseFloat(style.fontSize);
        const large = size >= 24 || (size >= 18.66 && parseInt(style.fontWeight, 10) >= 700);
        const required = large ? 3 : 4.5;
        if (ratio < required - 0.01) {
          found.push(`${element.className || element.tagName} "${text.slice(0, 26)}" ${ratio.toFixed(2)} < ${required}`);
        }
      }
      return found;
    });
    if (issues.length) failures.push(`${viewport.width}px ${route}: ${issues.join(' | ')}`);
  }
  await context.close();
}
await browser.close();

if (failures.length) {
  console.log(failures.slice(0, 40).join('\n'));
  throw new Error(`Contrast audit failed with ${failures.length} route/viewport issues`);
}
console.log(`Contrast audit passed: ${seoRoutes.length} routes at 1440px and 390px meet WCAG AA for every text/background pair.`);

import { chromium } from '@playwright/test';
import { access, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { galleryItems } from '../src/data/gallery.js';
import { rooms, seoRoutes } from '../src/data/site.js';

const root = new URL('..', import.meta.url).pathname;
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
const manifest = JSON.parse(await readFile(join(root, 'src/data/image-manifest.json'), 'utf8'));
const devices = [
  { name: 'Desktop 1920', width: 1920, height: 1080 },
  { name: 'Laptop 1440', width: 1440, height: 900 },
  { name: 'Laptop 1366', width: 1366, height: 768 },
  { name: 'Tablet 768', width: 768, height: 1024 },
  { name: 'Mobile 430', width: 430, height: 932 },
  { name: 'Mobile 390', width: 390, height: 844 },
  { name: 'Mobile 360', width: 360, height: 800 },
];
const sourceWidths = new Map();
const sourceFamilies = new Map();
const familySources = new Map();
for (const [name, entry] of Object.entries(manifest)) {
  familySources.set(name, entry.sources.map((source) => source.width).sort((a, b) => a - b));
  for (const source of entry.sources) {
    sourceWidths.set(source.src, source.width);
    sourceFamilies.set(source.src, name);
  }
}
const propertyAssets = new Set();
for (const entry of Object.values(manifest)) for (const source of entry.sources) propertyAssets.add(source.src);
for (const item of galleryItems) propertyAssets.add(item.thumbnail);
const supportAssets = ['/og-image.jpg', '/favicon.svg', '/apple-touch-icon.png'];
const allAssets = [...propertyAssets, ...supportAssets].sort();
const failures = [];
const assetResults = [];
const routeResults = [];
const lightboxResults = [];
const sourceLimited = new Set();
let placements = 0;
let loadedPlacements = 0;
let emptyPanels = 0;

for (const path of allAssets) {
  try {
    await access(join(root, 'dist', path));
    const response = await fetch(`${base}${path}`);
    const body = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || '';
    const ok = response.status === 200 && body.byteLength > 0 && contentType.startsWith('image/');
    assetResults.push({ path, status: response.status, bytes: body.byteLength, contentType, ok });
    if (!ok) failures.push(`Asset HTTP failure: ${path} returned ${response.status}, ${contentType}, ${body.byteLength} bytes`);
  } catch (error) {
    assetResults.push({ path, status: 0, bytes: 0, contentType: '', ok: false });
    failures.push(`Missing production asset: ${path}: ${error.message}`);
  }
}

const browser = await chromium.launch({ headless: true });
const decodeContext = await browser.newContext({ viewport: { width: 1200, height: 800 }, reducedMotion: 'reduce' });
const decodePage = await decodeContext.newPage();
await decodePage.goto(base, { waitUntil: 'domcontentloaded' });
for (let start = 0; start < allAssets.length; start += 12) {
  const batch = allAssets.slice(start, start + 12);
  const decoded = await decodePage.evaluate(async ({ paths, origin }) => Promise.all(paths.map((path) => new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve({ path, ok: image.naturalWidth > 0 && image.naturalHeight > 0, width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => resolve({ path, ok: false, width: 0, height: 0 });
    image.src = `${origin}${path}`;
  }))), { paths: batch, origin: base });
  for (const result of decoded) {
    const asset = assetResults.find((item) => item.path === result.path);
    asset.decoded = result.ok;
    asset.decodedWidth = result.width;
    asset.decodedHeight = result.height;
    if (!result.ok) failures.push(`Browser decode failure: ${result.path}`);
  }
}
await decodeContext.close();

async function scrollThrough(page, height) {
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < pageHeight; y += Math.max(500, height - 150)) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(45);
  }
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(250);
  await page.waitForFunction(() => Array.from(document.images).every((image) => image.complete), null, { timeout: 12000 });
}

for (const device of devices) {
  const context = await browser.newContext({ viewport: { width: device.width, height: device.height }, reducedMotion: 'reduce' });
  for (const route of seoRoutes) {
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    const response = await page.goto(`${base}${route.path}`, { waitUntil: 'domcontentloaded' });
    await scrollThrough(page, device.height);
    const images = await page.locator('img').evaluateAll((elements) => elements.map((image) => {
      const rect = image.getBoundingClientRect();
      const style = getComputedStyle(image);
      return {
        alt: image.getAttribute('alt'),
        currentSrc: image.currentSrc,
        complete: image.complete,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        renderedWidth: rect.width,
        renderedHeight: rect.height,
        loading: image.loading,
        fetchPriority: image.fetchPriority,
        objectFit: style.objectFit,
        objectPosition: style.objectPosition,
        hero: Boolean(image.closest('.home-hero__image, .page-hero__image')),
        brandLogo: image.hasAttribute('data-brand-logo'),
      };
    }));
    const missing = [];
    const undersized = [];
    for (const image of images) {
      placements += 1;
      const path = image.currentSrc ? new URL(image.currentSrc).pathname : '';
      if (image.complete && image.naturalWidth > 0 && image.naturalHeight > 0) loadedPlacements += 1;
      else missing.push(path || image.alt || 'unknown image');
      if (image.brandLogo) {
        if (!image.renderedWidth || !image.renderedHeight) failures.push(`${device.name} ${route.path}: zero-sized brand logo ${path}`);
        if (image.alt !== '') failures.push(`${device.name} ${route.path}: brand logo should be decorative, found alt "${image.alt}"`);
        if (!path.startsWith('/images/nd-manor-logo')) failures.push(`${device.name} ${route.path}: unregistered brand logo URL ${path}`);
        continue;
      }
      if (!image.alt) failures.push(`${device.name} ${route.path}: missing alt text for ${path}`);
      if (!image.renderedWidth || !image.renderedHeight) failures.push(`${device.name} ${route.path}: zero-sized image ${path}`);
      if (image.objectFit !== 'cover') failures.push(`${device.name} ${route.path}: incorrect object-fit for ${path}: ${image.objectFit}`);
      if (!image.objectPosition) failures.push(`${device.name} ${route.path}: missing object-position for ${path}`);
      if (image.hero && (image.loading !== 'eager' || image.fetchPriority !== 'high')) failures.push(`${device.name} ${route.path}: hero is not eager/high priority: ${path}`);
      if (!image.hero && image.loading !== 'lazy') failures.push(`${device.name} ${route.path}: below-fold image is not lazy: ${path}`);
      const selectedWidth = sourceWidths.get(path);
      const family = sourceFamilies.get(path);
      if (!selectedWidth || !family) {
        failures.push(`${device.name} ${route.path}: unregistered image URL ${path}`);
      } else {
        const largest = Math.max(...familySources.get(family));
        if (image.renderedWidth > selectedWidth * 1.08) {
          if (selectedWidth < largest) undersized.push(`${family}: rendered ${Math.round(image.renderedWidth)}px, selected ${selectedWidth}px, larger source available`);
          else sourceLimited.add(family);
        }
      }
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const fallbacks = await page.locator('.image-fallback, .photo-pending').count();
    emptyPanels += fallbacks;
    if (response.status() !== 200) failures.push(`${device.name} ${route.path}: HTTP ${response.status()}`);
    if (overflow > 1) failures.push(`${device.name} ${route.path}: horizontal overflow ${overflow}px`);
    if (fallbacks) failures.push(`${device.name} ${route.path}: ${fallbacks} empty/fallback image panels`);
    for (const item of missing) failures.push(`${device.name} ${route.path}: broken image ${item}`);
    for (const item of undersized) failures.push(`${device.name} ${route.path}: undersized responsive selection ${item}`);
    for (const error of errors) failures.push(`${device.name} ${route.path}: console ${error}`);
    routeResults.push({ device: device.name, route: route.path, images: images.length, loaded: images.length - missing.length, missing, undersized, overflow, errors, passed: !missing.length && !undersized.length && overflow <= 1 && !errors.length && !fallbacks && response.status() === 200 });
    await page.close();
  }
  await context.close();
}

for (const device of [devices[0], devices[4]]) {
  const context = await browser.newContext({ viewport: { width: device.width, height: device.height }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(`${base}/gallery`, { waitUntil: 'domcontentloaded' });
  await page.locator('.gallery-item').first().click();
  for (let index = 0; index < galleryItems.length; index += 1) {
    const image = page.locator('.lightbox__figure img');
    await image.waitFor({ state: 'visible' });
    await page.waitForFunction(() => {
      const current = document.querySelector('.lightbox__figure img');
      return current?.complete && current.naturalWidth > 0;
    });
    const result = await image.evaluate((element) => ({ src: element.currentSrc, alt: element.alt, width: element.naturalWidth, height: element.naturalHeight, objectFit: getComputedStyle(element).objectFit }));
    const expected = galleryItems[index];
    const ok = result.width > 0 && result.height > 0 && result.alt === expected.alt && result.objectFit === 'contain';
    lightboxResults.push({ device: device.name, index: index + 1, id: expected.id, ...result, ok });
    if (!ok) failures.push(`${device.name} lightbox ${expected.id}: decode, alt or object-fit failure`);
    if (index < galleryItems.length - 1) await page.getByRole('button', { name: 'Next image' }).click();
  }
  await page.getByRole('button', { name: 'Previous image' }).click();
  const previousCaption = await page.locator('.lightbox__figure figcaption > span').textContent();
  if (previousCaption !== galleryItems[galleryItems.length - 2].caption) failures.push(`${device.name} lightbox: previous navigation failed`);
  await page.locator('.lightbox__close').click();
  if (await page.locator('.lightbox').count()) failures.push(`${device.name} lightbox: close failed`);
  for (const error of errors) failures.push(`${device.name} lightbox: console ${error}`);
  await context.close();
}
await browser.close();

const successfulAssets = assetResults.filter((item) => item.ok && item.decoded).length;
const successfulLightbox = lightboxResults.filter((item) => item.ok).length;
const routeSummary = seoRoutes.map((route) => {
  const rows = routeResults.filter((item) => item.route === route.path);
  return { route: route.path, devicesPassed: rows.filter((item) => item.passed).length, images: rows.reduce((sum, item) => sum + item.images, 0), loaded: rows.reduce((sum, item) => sum + item.loaded, 0) };
});
const report = {
  date: '2026-11-06',
  base,
  uniquePhotographs: Object.keys(manifest).length,
  webpAssets: propertyAssets.size,
  supportAssets: supportAssets.length,
  totalAssets: allAssets.length,
  successfulAssets,
  routeDeviceChecks: routeResults.length,
  placements,
  loadedPlacements,
  lightboxChecks: lightboxResults.length,
  successfulLightbox,
  missing: allAssets.length - successfulAssets,
  emptyPanels,
  unusedPhotographs: Object.keys(manifest).filter((name) => !galleryItems.some((item) => item.id === name)),
  awaitingHotelConfirmation: rooms.filter((room) => room.photoPending).map((room) => room.name),
  sourceLimitedOriginals: [...sourceLimited].sort(),
  failures,
  assetResults,
  routeResults,
  routeSummary,
  lightboxResults,
};
await writeFile(join(root, 'research/image-audit.json'), `${JSON.stringify(report, null, 2)}\n`);

const markdown = `# Complete Website Image Audit\n\nAudit date: 6 November 2026  \nProduction preview: \`${base}\`\n\n## Verified totals\n\n| Measure | Result |\n| --- | ---: |\n| Unique ND Manor photographs referenced | ${report.uniquePhotographs} |\n| WebP files referenced, including thumbnails and responsive derivatives | ${report.webpAssets} |\n| Open Graph and icon assets referenced | ${report.supportAssets} |\n| Total unique image URLs audited | ${report.totalAssets} |\n| Image URLs returned successfully and decoded in Chromium | ${successfulAssets} / ${report.totalAssets} |\n| Route/device browser checks | ${routeResults.length} / ${routeResults.length} completed |\n| Image placements loaded across all routes and seven device sizes | ${loadedPlacements} / ${placements} |\n| Gallery lightbox images loaded on desktop and 430px mobile | ${successfulLightbox} / ${lightboxResults.length} |\n| Missing or broken image files | ${allAssets.length - successfulAssets} |\n| Empty placeholder image boxes | ${emptyPanels} |\n| Verified photographs absent from the gallery | ${report.unusedPhotographs.length} |\n\n## Route coverage\n\nEvery route was opened at 1920 x 1080, 1440 x 900, 1366 x 768, 768 x 1024, 430 x 932, 390 x 844 and 360 x 800. Lazy loading was triggered by scrolling through each complete page. Checks cover HTTP status, browser decoding, currentSrc, intrinsic dimensions, alt text, object-fit, object-position, responsive source selection, eager hero loading, below-fold lazy loading, horizontal overflow, empty fallbacks and console errors.\n\n| Route | Device sizes passed | Image placements loaded |\n| --- | ---: | ---: |\n${routeSummary.map((item) => `| \`${item.route}\` | ${item.devicesPassed} / ${devices.length} | ${item.loaded} / ${item.images} |`).join('\n')}\n\n## Gallery and interaction coverage\n\nAll ${galleryItems.length} gallery photographs were opened in the lightbox at 1920px desktop and 430px mobile sizes. Next navigation was exercised through the complete gallery, previous navigation and close behavior were checked, and every lightbox image was verified with non-zero intrinsic dimensions, correct alt text and \`object-fit: contain\`.\n\n## Images replaced or repositioned\n\n- Family Room's former lobby context image and oversized panel were replaced with a compact Midnight Navy branded pending visual. No exterior, lobby or unrelated room photograph is assigned to Family Room.\n- Royal Room's former exterior context image and oversized panel were replaced with a compact Midnight Navy branded pending visual. No exterior, lobby or unrelated room photograph is assigned to Royal Room.\n- The Gallery hero now uses the higher-resolution genuine entrance photograph.\n- The bathtub-detail and lobby photographs were moved into larger gallery slots; lower-resolution bathtub-feature and corridor photographs remain in smaller slots. No image files were renamed, deleted, artificially upscaled or reassigned to an unverified room category.\n\n## Still awaiting hotel confirmation\n\n${report.awaitingHotelConfirmation.map((name) => `- **${name}:** the original category-specific photograph set is still required from the hotel. No unrelated guest-room photograph is presented as this category.`).join('\n')}\n\n## Source-resolution notes\n\n${sourceLimited.size ? `The following originals are the highest verified resolutions currently available and can be smaller than some display slots: ${[...sourceLimited].sort().map((name) => `\`${name}\``).join(', ')}. No upscaled derivative files were created. Hotel-owned higher-resolution originals would improve these placements.` : 'No source-limited placements were identified at the audited device sizes.'}\n\n## Result\n\n${failures.length ? `The audit found ${failures.length} failure(s). See \`research/image-audit.json\` for details.` : 'All audited image URLs loaded and decoded, all route/device image placements passed, and all gallery lightbox checks passed. This result applies to the tested local production build and does not claim that unverified Family or Royal category photography exists.'}\n`;
await writeFile(join(root, 'research/IMAGE_AUDIT.md'), markdown);

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Image audit passed: ${successfulAssets}/${allAssets.length} unique assets, ${loadedPlacements}/${placements} route/device placements, ${successfulLightbox}/${lightboxResults.length} lightbox checks, 0 missing images.`);

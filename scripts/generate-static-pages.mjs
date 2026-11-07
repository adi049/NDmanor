import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { seoRoutes, site } from '../src/data/site.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const template = await readFile(join(dist, 'index.html'), 'utf8');
const imageManifest = JSON.parse(await readFile(join(root, 'src/data/image-manifest.json'), 'utf8'));
const assetBase = process.env.GITHUB_PAGES === 'true' ? '/NDmanor/' : '/';
const productionDomain = (process.env.SITE_URL || site.domain || '').replace(/\/$/, '');
if (productionDomain) {
  const parsed = new URL(productionDomain);
  if (parsed.protocol !== 'https:' || parsed.origin !== productionDomain) {
    throw new Error('SITE_URL must be a verified HTTPS origin without a path.');
  }
}
const socialImage = `${productionDomain}/og-image.jpg`;
const schemaUrl = `${productionDomain}/`;
const escapeHtml = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const routeImages = {
  '/': 'exterior-hero',
  '/about': 'exterior-day',
  '/rooms': 'room-super-deluxe',
  '/dining': 'restaurant-main',
  '/events': 'banquet-rounds',
  '/gallery': 'exterior-hero',
  '/contact': 'exterior-hero',
  '/booking': 'room-deluxe',
  '/rooms/deluxe-room': 'room-deluxe',
  '/rooms/super-deluxe-room': 'room-super-deluxe',
  '/rooms/family-room': 'room-family',
  '/rooms/royal-room': 'room-royal',
};

function renderMeta(route) {
  const canonical = `${productionDomain}${route.path === '/' ? '/' : route.path}`;
  let html = template
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(route.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeHtml(route.description)}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${escapeHtml(canonical)}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escapeHtml(route.title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${escapeHtml(route.description)}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${escapeHtml(canonical)}" />`)
    .replace(/<meta property="og:image" content="[^"]*"\s*\/>/, `<meta property="og:image" content="${escapeHtml(socialImage)}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`)
    .replace(/<meta name="twitter:image" content="[^"]*"\s*\/>/, `<meta name="twitter:image" content="${escapeHtml(socialImage)}" />`)
    .replace(/"url": "[^"]*"/, `"url": "${schemaUrl}"`)
    .replace(/"image": "[^"]*"/, `"image": "${socialImage}"`);
  const routeImage = routeImages[route.path];
  const responsive = routeImage ? imageManifest[routeImage] : undefined;
  const srcSet = responsive?.sources.map((source) => assetBase + source.src.slice(1) + ' ' + source.width + 'w').join(', ');
  const preload = routeImage ? '<link rel="preload" href="' + assetBase + 'images/' + routeImage + '.webp" as="image" fetchpriority="high"' + (srcSet ? ' imagesrcset="' + srcSet + '" imagesizes="100vw"' : '') + ' />' : '';
  html = html.replace(/<link rel="preload" href="[^"]*exterior-hero\.webp" as="image"[^>]*\/>/, preload);
  if (route.noindex) html = html.replace('<meta name="theme-color"', '<meta name="robots" content="noindex, follow" />\n    <meta name="theme-color"');
  return html;
}

for (const route of seoRoutes) {
  const html = renderMeta(route);
  if (route.path === '/') {
    await writeFile(join(dist, 'index.html'), html);
    continue;
  }
  const routePath = route.path.slice(1);
  const directoryEntry = join(dist, routePath, 'index.html');
  await mkdir(dirname(directoryEntry), { recursive: true });
  await writeFile(directoryEntry, html);
  await mkdir(dirname(join(dist, `${routePath}.html`)), { recursive: true });
  await writeFile(join(dist, `${routePath}.html`), html);
}

await writeFile(join(dist, '404.html'), renderMeta({
  path: '/404',
  title: 'Page Not Found | Hotel ND Manor',
  description: 'The page you requested could not be found. Return to Hotel ND Manor to explore rooms, dining and events in Dehradun.',
  noindex: true,
}));

const sitemapBody = productionDomain
  ? seoRoutes.map((route) => `  <url>\n    <loc>${productionDomain}${route.path === '/' ? '/' : route.path}</loc>\n    <lastmod>2026-11-05</lastmod>\n    <changefreq>${route.path === '/' ? 'weekly' : 'monthly'}</changefreq>\n    <priority>${route.path === '/' ? '1.0' : route.path.startsWith('/rooms') ? '0.9' : '0.7'}</priority>\n  </url>`).join('\n')
  : '  <!-- Sitemap URLs are enabled after SITE_URL is configured for a verified domain. -->';
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapBody}\n</urlset>\n`;
const robots = `User-agent: *\nAllow: /\n${productionDomain ? `\nSitemap: ${productionDomain}/sitemap.xml\n` : ''}`;
await writeFile(join(dist, 'sitemap.xml'), sitemap);
await writeFile(join(root, 'public', 'sitemap.xml'), sitemap);
await writeFile(join(dist, 'robots.txt'), robots);
await writeFile(join(root, 'public', 'robots.txt'), robots);
console.log(`Generated ${seoRoutes.length} route pages, 404.html, sitemap.xml and robots.txt. Domain mode: ${productionDomain || 'relative metadata pending verified SITE_URL'}.`);

import { seoRoutes, site } from '../src/data/site.js';

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
const productionDomain = (process.env.SITE_URL || site.domain || '').replace(/\/$/, '');
const expectedSocialImage = `${productionDomain}/og-image.jpg`;
const decode = (value) => value?.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const failures = [];

for (const route of seoRoutes) {
  const response = await fetch(`${base}${route.path}`);
  const html = await response.text();
  const title = decode(html.match(/<title>(.*?)<\/title>/)?.[1]);
  const description = decode(html.match(/<meta name="description" content="([^"]+)"/)?.[1]);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const ogUrl = html.match(/<meta property="og:url" content="([^"]+)"/)?.[1];
  const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
  const twitterImage = html.match(/<meta name="twitter:image" content="([^"]+)"/)?.[1];
  const expectedCanonical = `${productionDomain}${route.path}`;
  if (response.status !== 200) failures.push(`${route.path}: HTTP ${response.status}`);
  if (title !== route.title) failures.push(`${route.path}: incorrect static title`);
  if (description !== route.description) failures.push(`${route.path}: incorrect static description`);
  if (canonical !== expectedCanonical) failures.push(`${route.path}: incorrect canonical URL`);
  if (ogUrl !== expectedCanonical) failures.push(`${route.path}: incorrect Open Graph URL`);
  if (ogImage !== expectedSocialImage || twitterImage !== expectedSocialImage) failures.push(`${route.path}: incorrect social image metadata`);
  for (const url of html.match(/https?:\/\/[^"'\s)]+/g) || []) {
    if (/ndmanor\.com/i.test(url) && !url.startsWith(productionDomain)) failures.push(`${route.path}: non-canonical domain form ${url}`);
  }
  if (/localhost|127\.0\.0\.1/.test(canonical + ogUrl + ogImage)) failures.push(`${route.path}: local origin in production metadata`);
  if (/https:\/\/www\.(instagram|facebook)\.com\//i.test(html)) failures.push(`${route.path}: unverified social URL in static HTML`);
  const schemaText = html.match(/<script type="application\/ld\+json" id="hotel-schema">([\s\S]*?)<\/script>/)?.[1];
  try {
    const schema = JSON.parse(schemaText);
    if (schema.telephone !== site.phoneDisplay) failures.push(`${route.path}: incorrect schema telephone`);
    if (schema.url !== `${productionDomain}/` || schema.image !== expectedSocialImage) failures.push(`${route.path}: incorrect schema URLs`);
    if (schema.sameAs) failures.push(`${route.path}: schema sameAs requires verified official profiles`);
  } catch { failures.push(`${route.path}: invalid Hotel JSON-LD`); }
  if (!['/privacy', '/terms'].includes(route.path)) {
    const preload = html.match(/<link rel="preload" href="\/images\/[^"]+" as="image"[^>]*\/>/)?.[0];
    if (!preload?.includes('imagesrcset=') || !preload.includes('imagesizes="100vw"')) failures.push(`${route.path}: missing responsive hero preload`);
    const preloadPath = preload?.match(/href="([^"]+)"/)?.[1];
    if (preloadPath) {
      const imageResponse = await fetch(`${base}${preloadPath}`);
      if (imageResponse.status !== 200) failures.push(`${route.path}: hero preload HTTP ${imageResponse.status}`);
    }
  }
}

for (const path of ['/robots.txt', '/sitemap.xml', '/favicon.svg', '/og-image.jpg', '/apple-touch-icon.png', '/404.html']) {
  const response = await fetch(`${base}${path}`);
  if (response.status !== 200) failures.push(`${path}: HTTP ${response.status}`);
  if (path === '/robots.txt') {
    const text = await response.text();
    if (productionDomain && !text.includes(`Sitemap: ${productionDomain}/sitemap.xml`)) failures.push('robots.txt has an incorrect sitemap URL');
    if (!productionDomain && /Sitemap:/i.test(text)) failures.push('robots.txt advertises a sitemap before domain verification');
  }
  if (path === '/sitemap.xml') {
    const xml = await response.text();
    const expectedCount = productionDomain ? seoRoutes.length : 0;
    if ((xml.match(/<url>/g) || []).length !== expectedCount) failures.push('Sitemap route count mismatch for the domain verification state');
    if (!xml.includes('<urlset')) failures.push('Sitemap XML is invalid');
  }
  if (path === '/og-image.jpg') {
    if (!response.headers.get('content-type')?.startsWith('image/jpeg')) failures.push('Open Graph image has an incorrect content type');
    const body = await response.arrayBuffer();
    if (body.byteLength < 10000) failures.push('Open Graph image is empty or incomplete');
  }
  if (path === '/404.html') {
    const html = await response.text();
    if (!html.includes('noindex, follow')) failures.push('404 page is missing noindex');
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Production audit passed at ${base}: ${seoRoutes.length} clean URLs, domain-safe static SEO, Open Graph assets, responsive preloads, Hotel schema, sitemap, robots and 404.`);

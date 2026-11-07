import { test, expect } from '@playwright/test';
import { seoRoutes, site } from '../src/data/site.js';

const allPaths = [...seoRoutes.map((route) => route.path), '/not-a-real-page'];

async function scrollThrough(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 800) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(45);
  }
  await page.waitForTimeout(250);
}

async function blockWhatsApp(page) {
  await page.addInitScript(() => {
    window.__whatsappUrls = [];
    const originalClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function click() {
      if (this.href.includes('wa.me')) {
        window.__whatsappUrls.push(this.href);
        return;
      }
      return originalClick.call(this);
    };
  });
}

for (const route of seoRoutes) {
  test(`${route.path} renders with SEO, images and no runtime errors`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(route.path, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page).toHaveTitle(route.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', route.description);
    const origin = (site.domain || new URL(page.url()).origin).replace(/\/$/, '');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${origin}${route.path}`);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `${origin}${route.path}`);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', `${origin}/og-image.jpg`);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', `${origin}/og-image.jpg`);
    await scrollThrough(page);
    const broken = await page.locator('img').evaluateAll((images) => images.filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src));
    expect(broken).toEqual([]);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}

test('all internal links resolve to implemented routes', async ({ page }) => {
  const discovered = new Set();
  for (const path of seoRoutes.map((route) => route.path)) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    const links = await page.locator('a[href]').evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute('href')));
    for (const href of links) {
      if (href?.startsWith('/')) discovered.add(href.split('#')[0].split('?')[0]);
      expect(href).not.toBe('#');
    }
    const blanks = await page.locator('a[target="_blank"]').evaluateAll((anchors) => anchors.filter((anchor) => !anchor.rel.includes('noreferrer') && !anchor.rel.includes('noopener')).map((anchor) => anchor.href));
    expect(blanks).toEqual([]);
  }
  for (const path of discovered) {
    expect(allPaths).toContain(path);
  }
});

test('mobile pages do not overflow and navigation works', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of seoRoutes.map((route) => route.path)) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `Horizontal overflow at ${path}`).toBeLessThanOrEqual(1);
  }
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  await expect(page.locator('#mobile-navigation')).toBeVisible();
  const menuLayout = await page.locator('#mobile-navigation').evaluate((panel) => ({ height: panel.getBoundingClientRect().height, viewport: window.innerHeight, firstLinkBottom: panel.querySelector('.mobile-nav a').getBoundingClientRect().bottom }));
  expect(menuLayout.height).toBeGreaterThanOrEqual(menuLayout.viewport - 1);
  expect(menuLayout.firstLinkBottom).toBeLessThan(menuLayout.viewport);
  await page.locator('.mobile-nav').getByRole('link', { name: /Rooms & Suites/ }).click();
  await expect(page).toHaveURL(/\/rooms$/);
  await expect(page.locator('.mobile-menu')).not.toHaveClass(/is-open/);
  await page.goto('/');
  await expect(page.locator('.whatsapp-float')).toHaveCount(0);
  await page.locator('.welcome-grid').scrollIntoViewIfNeeded();
  await expect(page.locator('.whatsapp-float')).toBeVisible();
});

test('availability bar validates dates and prepares complete WhatsApp inquiry', async ({ page }) => {
  await blockWhatsApp(page);
  await page.goto('/');
  const form = page.locator('.booking-bar');
  await form.locator('[name="checkIn"]').fill('2027-05-10');
  await form.locator('[name="checkOut"]').fill('2027-05-10');
  await form.getByRole('button', { name: /Check Availability/ }).click();
  await expect(form.locator('#bar-checkout-error')).toContainText('after check-in');
  await form.locator('[name="checkOut"]').fill('2027-05-12');
  await form.locator('[name="adults"]').fill('3');
  await form.locator('[name="children"]').fill('1');
  await form.locator('[name="rooms"]').fill('2');
  await form.getByRole('button', { name: /Check Availability/ }).click();
  await expect(form.locator('.form-message--success')).toBeVisible();
  const urls = await page.evaluate(() => window.__whatsappUrls);
  expect(urls).toHaveLength(1);
  const url = new URL(urls[0]);
  expect(url.hostname).toBe('wa.me');
  expect(url.pathname).toBe('/917078944451');
  const message = url.searchParams.get('text');
  expect(message).toContain('10 May 2027');
  expect(message).toContain('12 May 2027');
  expect(message).toContain('Adults: 3');
  expect(message).toContain('Children: 1');
  expect(message).toContain('Rooms: 2');
  expect(message).toContain('not a confirmed booking');
});

test('reservation form validates guest fields and includes all submitted details', async ({ page }) => {
  await blockWhatsApp(page);
  await page.goto('/booking?room=royal-room');
  const form = page.locator('.premium-form');
  await expect(form.locator('[name="roomPreference"]')).toHaveValue('royal-room');
  await form.getByRole('button', { name: /Submit Reservation Request/ }).click();
  await expect(form.locator('[name="name"]')).toHaveAttribute('aria-invalid', 'true');
  await form.locator('[name="name"]').fill('Aarav Sharma');
  await form.locator('[name="phone"]').fill('+91 98765 43210');
  await form.locator('[name="email"]').fill('aarav@example.com');
  await form.locator('[name="checkIn"]').fill('2027-06-14');
  await form.locator('[name="checkOut"]').fill('2027-06-16');
  await form.locator('[name="adults"]').fill('2');
  await form.locator('[name="children"]').fill('1');
  await form.locator('[name="rooms"]').fill('1');
  await form.locator('[name="requests"]').fill('Please confirm a quiet room and late arrival.');
  await form.getByRole('button', { name: /Submit Reservation Request/ }).click();
  await expect(page.locator('.prepared-message')).toBeVisible();
  const urls = await page.evaluate(() => window.__whatsappUrls);
  const message = new URL(urls[0]).searchParams.get('text');
  for (const expected of ['Aarav Sharma', '+91 98765 43210', 'aarav@example.com', '14 Jun 2027', '16 Jun 2027', 'Royal Room', 'quiet room and late arrival']) expect(message).toContain(expected);
});

test('event and contact forms prepare their own detailed inquiries', async ({ page }) => {
  await blockWhatsApp(page);
  await page.goto('/events');
  const eventForm = page.locator('.event-form');
  await eventForm.locator('[name="name"]').fill('Neha Verma');
  await eventForm.locator('[name="phone"]').fill('9876543210');
  await eventForm.locator('[name="email"]').fill('neha@');
  await eventForm.locator('[name="eventType"]').selectOption({ label: 'Birthday celebration' });
  await eventForm.locator('[name="eventDate"]').fill('2027-08-20');
  await eventForm.locator('[name="guests"]').fill('75');
  await eventForm.locator('[name="message"]').fill('Dinner and a simple stage setup.');
  await eventForm.getByRole('button', { name: /Plan Your Event/ }).click();
  await expect(eventForm.locator('[name="email"]')).toHaveAttribute('aria-invalid', 'true');
  await eventForm.locator('[name="email"]').fill('neha@example.com');
  await eventForm.getByRole('button', { name: /Plan Your Event/ }).click();
  let urls = await page.evaluate(() => window.__whatsappUrls);
  let message = new URL(urls[0]).searchParams.get('text');
  for (const expected of ['Neha Verma', 'neha@example.com', 'Birthday celebration', '20 Aug 2027', 'Estimated guests: 75', 'simple stage setup']) expect(message).toContain(expected);

  await page.goto('/contact');
  const contactForm = page.locator('.premium-form');
  await contactForm.locator('[name="name"]').fill('Rahul Singh');
  await contactForm.locator('[name="phone"]').fill('9876543210');
  await contactForm.locator('[name="email"]').fill('rahul@example.com');
  await contactForm.locator('[name="subject"]').selectOption({ label: 'Restaurant inquiry' });
  await contactForm.locator('[name="message"]').fill('Please share the current menu and dining timings.');
  await contactForm.getByRole('button', { name: /Send via WhatsApp/ }).click();
  urls = await page.evaluate(() => window.__whatsappUrls);
  message = new URL(urls.at(-1)).searchParams.get('text');
  for (const expected of ['Rahul Singh', 'Restaurant inquiry', 'current menu and dining timings']) expect(message).toContain(expected);
});

test('gallery filters, lightbox controls and focus return work', async ({ page }) => {
  await page.goto('/gallery');
  await page.getByRole('button', { name: /^Rooms/ }).click();
  await expect(page.locator('.gallery-item')).toHaveCount(11);
  const firstImage = page.locator('.gallery-item').first();
  await firstImage.click();
  await expect(page.locator('#gallery-lightbox')).toBeVisible();
  await expect(page.locator('#gallery-lightbox')).toHaveAttribute('aria-label', /image 1 of 11/);
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#gallery-lightbox')).toHaveAttribute('aria-label', /image 2 of 11/);
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#gallery-lightbox')).toHaveAttribute('aria-label', /image 1 of 11/);
  await page.locator('.lightbox__figure').evaluate((element) => {
    const start = new Touch({ identifier: 1, target: element, clientX: 300, clientY: 300 });
    element.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, changedTouches: [start] }));
    const end = new Touch({ identifier: 1, target: element, clientX: 80, clientY: 300 });
    element.dispatchEvent(new TouchEvent('touchend', { bubbles: true, changedTouches: [end] }));
  });
  await expect(page.locator('#gallery-lightbox')).toHaveAttribute('aria-label', /image 2 of 11/);
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#gallery-lightbox')).toHaveAttribute('aria-label', /image 1 of 11/);
  await page.keyboard.press('Escape');
  await expect(page.locator('#gallery-lightbox')).toHaveCount(0);
  await expect(firstImage).toBeFocused();
  await page.getByRole('button', { name: /^Banquets/ }).click();
  await expect(page.locator('.gallery-item')).toHaveCount(5);
  await page.getByRole('button', { name: /^Dining/ }).click();
  await expect(page.locator('.gallery-item')).toHaveCount(4);
  await page.getByRole('button', { name: /^Exterior/ }).click();
  await expect(page.locator('.gallery-item')).toHaveCount(4);
  await page.getByRole('button', { name: /^All Photos/ }).click();
  await expect(page.locator('.gallery-item')).toHaveCount(26);
});

test('phone, WhatsApp and map links use verified destinations while social profiles stay hidden', async ({ page }) => {
  await page.goto('/contact');
  const phones = await page.locator('a[href^="tel:"]').evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute('href')));
  expect(phones.length).toBeGreaterThan(0);
  for (const phone of phones) expect(phone).toBe('tel:+917078944451');
  const whatsapp = await page.locator('a[href*="wa.me"]').evaluateAll((anchors) => anchors.map((anchor) => anchor.href));
  for (const url of whatsapp) expect(url).toMatch(/^https:\/\/wa\.me\/917078944451\?text=/);
  const directions = page.getByRole('link', { name: /Get Directions/ }).first();
  await expect(directions).toHaveAttribute('href', /destination=30\.2596878%2C78\.0360893/);
  await expect(page.locator('iframe[title*="Map showing Hotel ND Manor"]')).toHaveAttribute('src', /30\.2596878,78\.0360893/);
  await expect(page.locator('a[href*="instagram.com"], a[href*="facebook.com"]')).toHaveCount(0);
});

test('responsive images expose valid sources and mobile loads an appropriately sized hero', async ({ page }) => {
  await page.goto('/rooms');
  const invalid = await page.locator('img').evaluateAll((images) => images.filter((image) => {
    const sources = image.getAttribute('srcset');
    return !sources || !image.getAttribute('sizes') || !image.getAttribute('width') || !image.getAttribute('height');
  }).map((image) => image.src));
  expect(invalid).toEqual([]);
  await expect(page.locator('.room-card img')).toHaveCount(4);
  await expect(page.locator('.room-card .room-pending-visual')).toHaveCount(0);
  await expect(page.locator('.room-card img[src*="room-family"]')).toHaveCount(1);
  await expect(page.locator('.room-card img[src*="room-royal"]')).toHaveCount(1);
  await expect(page.locator('.room-card__context-label')).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(page.locator('.page-hero__image')).toHaveClass(/is-loaded/);
  const currentSource = await page.locator('.page-hero__image img').evaluate((image) => new URL(image.currentSrc).pathname);
  expect(currentSource).toBe('/images/room-super-deluxe-480.webp');
  await page.goto('/rooms/family-room');
  await expect(page.locator('.page-hero--editorial')).toHaveCount(0);
  await expect(page.locator('.page-hero__image img')).toHaveAttribute('src', /room-family/);
  await expect(page.locator('.room-detail__visual img')).toHaveAttribute('src', /room-family/);
  await expect(page.locator('.room-detail__visual .room-pending-visual')).toHaveCount(0);
  await expect(page.locator('.room-detail__visual .image-caption')).toContainText('Accommodation at ND Manor');
  await expect(page.locator('.image-caption')).not.toContainText('Category photography pending');
  await expect(page.locator('.room-disclosure')).not.toContainText('awaiting hotel confirmation');
  await expect(page.locator('.amenity-pending')).toHaveCount(0);
  await page.goto('/rooms/royal-room');
  await expect(page.locator('.page-hero--editorial')).toHaveCount(0);
  await expect(page.locator('.page-hero__image img')).toHaveAttribute('src', /room-royal/);
  await expect(page.locator('.room-detail__visual img')).toHaveAttribute('src', /room-royal/);
  await expect(page.locator('.room-detail__visual .room-pending-visual')).toHaveCount(0);
  await expect(page.locator('.image-caption')).not.toContainText('Category photography pending');
  await expect(page.locator('.amenity-pending')).toHaveCount(0);
});

test('Open Graph and icon assets load with valid content and dimensions', async ({ page }) => {
  await page.goto('/');
  for (const [path, type] of [['/og-image.jpg', 'image/jpeg'], ['/favicon.svg', 'image/svg+xml'], ['/apple-touch-icon.png', 'image/png']]) {
    const response = await page.request.get(path);
    expect(response.ok(), `${path} should load`).toBeTruthy();
    expect(response.headers()['content-type']).toContain(type);
  }
  const dimensions = await page.evaluate(async () => {
    const image = new Image();
    image.src = '/og-image.jpg';
    await image.decode();
    return { width: image.naturalWidth, height: image.naturalHeight };
  });
  expect(dimensions).toEqual({ width: 1200, height: 630 });
  const socialImage = await page.locator('meta[property="og:image"]').getAttribute('content');
  const canonicalBase = (site.domain || new URL(page.url()).origin).replace(/\/$/, '');
  expect(socialImage).toBe(`${canonicalBase}/og-image.jpg`);
  // The absolute URL resolves once DNS points ndmanor.com at the host, so the shipped asset is fetched directly.
  const socialResponse = await page.request.get('/og-image.jpg');
  expect(socialResponse.ok()).toBeTruthy();
});

test('premium homepage navigation, hero and scroll progress work', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#home-hero-title')).toContainText('Discover Comfort.');
  await expect(page.locator('#home-hero-title')).toContainText('Experience ND Manor.');
  await expect(page.getByRole('link', { name: 'Explore Our Rooms' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Book Your Stay' }).first()).toBeVisible();
  await expect(page.locator('.desktop-nav a.active')).toHaveText('Home');
  await expect(page.locator('.scroll-progress span')).toHaveAttribute('style', 'transform: scaleX(0);');
  await page.evaluate(() => window.scrollTo(0, 1200));
  await expect.poll(() => page.locator('.scroll-progress span').evaluate((element) => element.style.transform)).not.toBe('scaleX(0)');
  await expect(page.locator('.site-header')).toHaveClass(/site-header--solid/);
  await expect(page.locator('.site-header')).toHaveClass(/is-scrolled/);
  await page.getByRole('link', { name: 'Explore Our Rooms' }).click();
  await expect(page).toHaveURL(/\/rooms$/);
});

const deviceAudits = [
  { name: 'desktop 1920', width: 1920, height: 1080 },
  { name: 'laptop 1440', width: 1440, height: 900 },
  { name: 'laptop 1366', width: 1366, height: 768 },
  { name: 'tablet 768', width: 768, height: 1024 },
  { name: 'mobile 430', width: 430, height: 932 },
  { name: 'mobile 390', width: 390, height: 844 },
  { name: 'mobile 360', width: 360, height: 800 },
];

for (const device of deviceAudits) {
  test(`${device.name} layouts keep navigation, forms and controls usable`, async ({ page }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width: device.width, height: device.height });
    for (const path of ['/', '/rooms', '/rooms/family-room', '/events', '/gallery', '/booking', '/contact']) {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('h1')).toBeVisible();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `Horizontal overflow at ${path} on ${device.name}`).toBeLessThanOrEqual(1);
      const undersized = await page.locator('.button:visible, input:visible, select:visible, .menu-toggle:visible').evaluateAll((elements) => elements.filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width < 40 || rect.height < 40;
      }).map((element) => ({ tag: element.tagName, className: element.className, width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height })));
      expect(undersized, `Undersized controls at ${path} on ${device.name}`).toEqual([]);
    }
    if (device.width <= 1120) {
      await page.goto('/');
      await page.getByRole('button', { name: 'Open navigation menu' }).click();
      const menuLayout = await page.locator('#mobile-navigation').evaluate((panel) => ({ height: panel.getBoundingClientRect().height, viewport: window.innerHeight, firstLinkBottom: panel.querySelector('.mobile-nav a').getBoundingClientRect().bottom }));
      expect(menuLayout.height, `Full-height navigation at ${device.name}`).toBeGreaterThanOrEqual(menuLayout.viewport - 1);
      expect(menuLayout.firstLinkBottom, `Visible navigation links at ${device.name}`).toBeLessThan(menuLayout.viewport);
    }
  });
}

test('back to top, reduced motion and custom 404 work', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, 1000));
  await expect(page.getByRole('button', { name: 'Back to top' })).toBeVisible();
  await page.getByRole('button', { name: 'Back to top' }).click();
  await page.waitForTimeout(800);
  expect(await page.evaluate(() => window.scrollY)).toBeLessThan(30);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  const opacity = await page.locator('.reveal').first().evaluate((element) => getComputedStyle(element).opacity);
  expect(opacity).toBe('1');
  await page.goto('/not-a-real-page');
  await expect(page.locator('h1')).toContainText('The page you’re looking for isn’t here.');
  await expect(page).toHaveTitle('Page Not Found | Hotel ND Manor');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
});

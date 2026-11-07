# Hotel ND Manor Website

A complete premium hospitality website for Hotel ND Manor on Doon University Road, Mothrowala, Dehradun. Built with React, Vite and React Router using locally hosted fonts and genuine property photography.

## Run locally

```bash
npm install
npm run dev
```

The development server binds to `0.0.0.0` so it can be previewed in the workspace.

## Production build

```bash
npm run build
npm run preview
```

The build creates static entry pages for the homepage, all main pages and every room detail route. It also creates `404.html`, `sitemap.xml`, `robots.txt` and route-specific SEO metadata. The output is in `dist/` and can be deployed to Netlify, Vercel, GitHub Pages with appropriate routing support, or conventional static hosting.

## Main routes

- `/`
- `/about`
- `/rooms`
- `/rooms/deluxe-room`
- `/rooms/super-deluxe-room`
- `/rooms/family-room`
- `/rooms/royal-room`
- `/dining`
- `/events`
- `/gallery`
- `/contact`
- `/booking`
- `/privacy`
- `/terms`

Unknown routes show a custom 404 experience.

## Logo and brand assets

The navbar, mobile navigation drawer, footer and 404 page use the hotel's original circular golden ND Mandala logo. It is served as transparent-background WebP at 128, 256, 512 and 1024 pixels with `srcset`, so it stays sharp on every display without distortion. The favicon uses the inner emblem of the same artwork and the Apple touch icon is an opaque tile. The master file is kept in `brand/` and is not shipped in the build. See `research/ASSETS.md` for the asset register.

## Royal colour identity

One palette drives every surface, defined as design tokens at the top of `src/styles.css`:

| Token | Value | Role |
| --- | --- | --- |
| Royal Midnight Navy | `#15263D` | navigation, footer, dark sections, primary buttons |
| Navy shade | `#101D2E` | footer, 404 and image overlays |
| Deep Burgundy | `#542B43` | premium section ground, active filters, hover states |
| Rich Magenta | `#963F69` | small decorative rules and accent lines |
| Champagne Gold | `#C7A46A` | logo, primary CTAs, borders, dividers, icons |
| Gold tints | `#E3CDA6` / `#7C5F35` | gold text on dark / on light grounds |
| Emerald Green | `#245647` | experience cards, guest experience band, WhatsApp control |
| Soft Sage | `#DCE8DF` / `#EEF4EF` | information and secondary content bands |
| Pearl Ivory | `#F7F5EF` / `#F1EEE6` | page ground and alternating card bands |
| Silver Grey | `#D9DEE5` / `#E9ECF1` | dividers, borders, cool neutral bands |
| Blush | `#F4EBEF` | burgundy-tinted editorial band |
| Charcoal | `#24272D` | body text |

Rough distribution across a page: 40 percent pearl ivory and white, 25 percent navy, 15 percent champagne gold, 10 percent burgundy and magenta, 10 percent emerald and sage. Sections alternate pearl, sage, silver and blush grounds with pure white breathers, and strong navy or burgundy bands anchor the dining, event and closing sections. Every text and background pair meets WCAG AA (verified by `npm run audit:contrast`).

Buttons share one control system: 54px tall on desktop with 34px side padding, 11px uppercase labels with 0.14em tracking, square corners and a 1px border. Primary CTAs are champagne gold or navy, secondary CTAs are transparent with a fine border, and hover states move to navy or burgundy with a 2px lift. Gallery filters, the header CTA, the WhatsApp pill and the back-to-top control follow the same scale, and all controls stay at least 44px tall on touch screens.

Motion includes lightweight reveals, selected parallax, navigation and menu transitions, a scroll-progress indicator and an animated back-to-top control. Reduced-motion preferences disable animation and delay. The gallery provides All Photos, Exterior, Rooms, Interiors, Dining and Banquets filters with keyboard, swipe and next/previous lightbox controls.

## Editing hotel information

- `src/data/site.js`: verified contact details, address, map links, room preferences, amenities, verification notes and SEO text. Unverified social profiles are intentionally absent.
- `src/data/gallery.js`: gallery categories, captions, alt text and image references.
- `src/data/image-manifest.json`: intrinsic dimensions and responsive sources for all 24 photographs.
- `src/components/Forms.jsx`: reservation, event and contact forms.
- `src/components/Logo.jsx`: circular ND Mandala logo (navbar, footer, drawer, 404) and the decorative monogram ornament.
- `src/components/RoomPendingVisual.jsx`: branded non-photographic treatment for unverified room categories.
- `src/components/ScrollProgress.jsx`: lightweight global scroll-progress indicator.
- `src/utils/whatsapp.js`: WhatsApp message templates and URL encoding.
- `src/styles.css`: visual system, motion and seven-width responsive layouts.
- `public/images/`: optimized local WebP photographs, proportional thumbnails and responsive derivatives.

## Inquiry workflow

No booking engine, inventory system, payment gateway, form database or email service is connected. Forms validate entries in the browser and create a prefilled WhatsApp message to the verified hotel number, `+91 70789 44451`. Reservation messages include guest and stay details. Event messages include name, phone, email, occasion, preferred date, estimated guests and requirements.

The guest must review and send that message in WhatsApp. The interface explicitly describes this as an inquiry, never as an instant booking or confirmed event reservation. No availability, rates, capacities or packages are simulated.

To connect a future booking engine, replace the submit workflow in `src/components/BookingBar.jsx` and `src/components/Forms.jsx` while retaining the current validation and accessible status messages.

## SEO and domain

The official origin is `https://ndmanor.com`, set once in `src/data/site.js` (`site.domain`) and used by `npm run build` for the canonical link, `og:url`, `og:image`, the Hotel schema `url` and `image`, all 14 sitemap entries and the `robots.txt` sitemap directive. No localhost or preview origin appears in production metadata, and the audits fail the build if a non-canonical domain form (`http://`, a `www.` variant or any other host) appears in the HTML.

Override with `SITE_URL=https://another-origin.example npm run build` if the site ever moves; the value must be an HTTPS origin without a path or trailing slash.

DNS and hosting are still pending: on 7 November 2026 `ndmanor.com` and `www.ndmanor.com` returned `ENOTFOUND` from two independent resolvers, so the domain does not yet serve the site. `DEPLOYMENT.md` lists the exact records to add, host configuration for Netlify, Vercel and Cloudflare Pages, the HTTPS steps and the post-deploy checks. The site should not be described as live until those checks pass.

## Photography and claims

All website photographs depict ND Manor and were obtained from publicly accessible property-specific profiles. No stock hotel photography or AI-generated interiors are used. See `research/ASSETS.md` for the original source of every selected image and `research/RESEARCH.md` for verification decisions.

The hotel must confirm reuse rights or replace the images with hotel-owned originals before commercial launch. Deluxe and Super Deluxe galleries use unique category-labelled public listing series; the Deluxe bathroom image shared across source categories was removed. Family and Royal now use hotel-supplied room photographs on their cards, detail pages, page heroes and gallery entries. Their bedding, amenities and occupancy details still require hotel confirmation. Bathtub photographs appear only as generic ND Manor accommodation images, never as Royal Room photographs. The Royal category name itself still requires direct hotel confirmation.

## Quality checks

```bash
npm run audit
npm test
```

The 32-test Playwright suite covers every route, SEO metadata, broken images, Open Graph and icon loading, internal links, full-height mobile navigation, date validation, reservation and event inquiries, contact forms, complete WhatsApp payloads, gallery filters, lightbox keyboard and touch controls, responsive image selection, strict pending-room behavior, hidden social profiles, telephone and map links, scroll progress, reduced motion, back-to-top and the custom 404 page. The device matrix checks 1920, 1440, 1366, 768, 430, 390 and 360 pixel widths for overflow, visible navigation and minimum interactive sizes. Compact floating WhatsApp behavior is also tested so it yields to booking and inquiry controls.

With the production preview running on port 4173, also run:

```bash
npm run audit:production   # 14 URLs: canonical, Open Graph, schema, sitemap, robots, preloads
npm run audit:images       # 111 assets, 987 route/device placements, 52 lightbox checks
npm run audit:layout       # 14 routes at 360/375/390/414/430/1280/1366/1440/1600/1920
npm run audit:contrast     # WCAG AA for every text/background pair at 1440 and 390
```

This verifies that every clean URL serves its own static title, description and domain-safe canonical metadata before React loads. It also checks Open Graph image loading, responsive hero preloads, Hotel structured data without unverified `sameAs` profiles, the sitemap, robots file and 404 metadata.

The image audit checks every production image URL and browser decode, all 14 routes at the same seven device sizes, responsive source selection and the complete gallery lightbox. See `research/IMAGE_AUDIT.md` for the measured totals and `research/QUALITY.md` for the design, responsive, integration, Lighthouse and external-destination results.

For a new environment, install the test browser once with:

```bash
npx playwright install chromium
```
"# NDmanor" 

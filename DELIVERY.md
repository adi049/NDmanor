# ND Manor · final refinement and release notes

Delivered on the existing project. No rebuild from scratch, no new sections, no changed copy, photography or routing.

## 1. What changed

| Area | Change | Files |
| --- | --- | --- |
| Royal colour identity | One token palette replaces the previous mix: navy `#15263D`, burgundy `#542B43`, magenta `#963F69`, gold `#C7A46A`, emerald `#245647`, sage `#DCE8DF`, ivory `#F7F5EF`, silver `#D9DEE5`, charcoal `#24272D`. Alternating section grounds, navy navigation and footer, emerald and burgundy feature bands. | `src/styles.css` |
| Desktop controls | Shared button system: 54px height, 34px side padding, 11px labels, 1px borders, square corners, gold or navy primary, outlined secondary, burgundy/navy hover with a 2px lift. Header CTA 50px, gallery filters 48px, WhatsApp 52px, back-to-top 46px, text links 44px. | `src/styles.css` |
| Mobile experience | 52px buttons, full-width stacked hero buttons, 46 to 50px icon controls, tuned drawer spacing, smaller logo lockup, tightened section padding, no horizontal scroll from 360px up. | `src/styles.css` |
| Image alignment | Hero framing re-set to keep the architecture in view, page heroes gained a bottom scrim, header gains a top scrim over photography, all images verified as cover-fitted with no distortion, spill or uneven rows. | `src/styles.css` |
| Floating controls | The WhatsApp pill now yields to booking and inquiry controls at every viewport, not just mobile, so it never covers a CTA. | `src/components/FloatingActions.jsx` |
| Domain | `https://ndmanor.com` set once and propagated to canonical, Open Graph, schema, sitemap and robots. Navy theme colour. Absolute URLs in the base template. | `src/data/site.js`, `index.html` |
| Hosting | Ready-made config for Netlify, Vercel and Cloudflare Pages with security and cache headers. | `netlify.toml`, `vercel.json`, `public/_headers`, `public/_redirects` |
| Verification | Two new permanent audits: layout across 10 widths and WCAG AA contrast. Domain checks tightened to fail on any non-canonical host form. | `tests/layout-audit.mjs`, `tests/contrast-audit.mjs`, `tests/*`, `package.json` |

## 2. Colour distribution as built

- **40 percent pearl ivory and white** - page grounds, room cards, form cards, legal pages, gallery and culinary sections.
- **25 percent royal navy** - navigation bar, footer, dining feature, closing call to action, 404, booking bar, hero overlays.
- **15 percent champagne gold** - logo, primary CTAs, card borders on hover, dividers, eyebrow rules, icons, footer headings.
- **10 percent burgundy and magenta** - events inquiry band, active gallery filters, button hover states, eyebrow labels, small accent lines, room numbers.
- **10 percent emerald and sage** - experience cards, guest experience band, information and amenities bands, WhatsApp control.

## 3. Test results (executed, not assumed)

| Check | Command | Result |
| --- | --- | --- |
| Production build | `npm run build` | Passed, 14 route pages, 404, sitemap and robots generated with `https://ndmanor.com` |
| Content audit | `npm run audit` | Passed, 14 SEO routes, 4 room pages, 26 photographs, 26 responsive sets |
| Production audit | `npm run audit:production` | Passed, 14 URLs with canonical, Open Graph, schema, preloads, sitemap, robots, 404 |
| Image audit | `npm run audit:images` | Passed, 111/111 assets, 987/987 placements, 52/52 lightbox checks |
| Layout audit | `npm run audit:layout` | Passed, 14 routes at 360/375/390/414/430/1280/1366/1440/1600/1920 px, no overflow, distortion, spill, small controls or uneven rows |
| Contrast audit | `npm run audit:contrast` | Passed, 14 routes at 1440 and 390 px meet WCAG AA |
| Playwright suite | `npx playwright test` | 32/32 passed |
| Lighthouse desktop | homepage | Performance 99, Accessibility 100, Best practices 100, SEO 100, LCP 0.9 s, TBT 10 ms, CLS 0 |
| Lighthouse mobile | homepage | Performance 93, Accessibility 100, Best practices 100, SEO 100, LCP 3.1 s, TBT 90 ms, CLS 0 |

Functional checks executed in the browser during this round: every telephone link is `tel:+917078944451`; every WhatsApp link is `wa.me/917078944451` with a prefilled message; both Google Maps links resolve to the verified property coordinates and address; the three inquiry forms validate and build WhatsApp messages without claiming a booking; gallery filters and the lightbox (arrows, counter, Escape) work; the mobile drawer opens, traps focus and closes on Escape; smooth section reveals, hero entrance, page transitions and scroll progress all fire, and reduced motion disables them.

## 4. Screenshots

`public/` is untouched; screenshots live in `screenshots/`.

- `screenshots/desktop/1440-01-home.jpg` through `1440-09-booking.jpg` - home, about, rooms, royal room, dining, events, gallery, contact, booking.
- `screenshots/desktop/1280|1366|1600|1920-01-home.jpg` - homepage at each desktop width.
- `screenshots/mobile/390-01-home.jpg` through `390-09-booking.jpg` - same nine pages at 390px.
- `screenshots/mobile/360|375|414|430-01-home.jpg` - homepage at each mobile width.
- `screenshots/overview-desktop-1440.jpg` and `overview-mobile-390.jpg` - contact sheets of every page.

## 5. Domain status

`https://ndmanor.com` is configured in the project and in every generated metadata file. It is **not live** yet: on 7 November 2026 `ndmanor.com` and `www.ndmanor.com` both returned `ENOTFOUND` from two independent resolvers, so DNS and hosting are still pending. Deployment records, HTTPS steps and post-deploy checks are in `DEPLOYMENT.md`.

## 6. Remaining external actions

1. Add the DNS records for `ndmanor.com` and `www.ndmanor.com` at the registrar (values from the chosen host dashboard).
2. Connect the repository to the host, publish `dist/` and attach the custom domain.
3. Issue the HTTPS certificate and force HTTPS.
4. Submit `https://ndmanor.com/sitemap.xml` in Google Search Console once DNS resolves.
5. Confirm the hotel's Google Business Profile, phone number and address match the site.
6. Replace any photograph whose reuse rights the hotel has not confirmed (`research/ASSETS.md` lists each source).

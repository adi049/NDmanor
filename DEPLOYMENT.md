# Deploying ndmanor.com

The project is a static Vite build. Every route is pre-rendered to its own `index.html`, so it runs on any static host with no server runtime.

Domain configuration inside the project is complete:

- `src/data/site.js` -> `domain: 'https://ndmanor.com'`
- `index.html` -> canonical, Open Graph, Twitter and Hotel schema URLs use `https://ndmanor.com`
- `npm run build` -> absolute canonical, `og:url`, `og:image`, schema `url`/`image`, a 14-URL `sitemap.xml` and a `robots.txt` sitemap directive

**Current status (checked 7 November 2026):** `ndmanor.com` and `www.ndmanor.com` return `ENOTFOUND` from two independent resolvers, so DNS and hosting are still pending. Nothing in the code depends on that: the build already carries the final URLs, and the site will serve correctly the moment DNS points at the host.

---

## 1. Build

```bash
npm ci
npm run build        # vite build + scripts/generate-static-pages.mjs
npm run preview      # http://localhost:4173 to verify the production output
```

Output: `dist/` (14 route pages, `404.html`, `sitemap.xml`, `robots.txt`, hashed `/assets`).

Publish directory: `dist`. Build command: `npm run build`. Node 20 or newer.

## 2. Deploy to a static host

Ready-made configuration is included. Pick one host, connect the repository, and use the file that matches.

| Host | Config file | Notes |
| --- | --- | --- |
| Netlify | `netlify.toml`, `public/_headers`, `public/_redirects` | Rebuild on push. Headers and cache rules ship automatically. |
| Vercel | `vercel.json` | `cleanUrls` serves the pre-rendered directories without `.html`. |
| Cloudflare Pages | `public/_headers`, `public/_redirects` | Build command `npm run build`, output `dist`. |
| Any Apache/nginx host | none | Upload `dist/`. Enable `try_files $uri $uri/ $uri.html =404;` (nginx) so extensionless routes resolve. |

## 3. DNS records to add at the domain registrar

Add these once the host gives you its target values. Both `ndmanor.com` and `www.ndmanor.com` must serve the site; keep one as the canonical host and redirect the other.

| Type | Name / host | Value | TTL |
| --- | --- | --- | --- |
| `A` | `@` (apex, `ndmanor.com`) | IPv4 address shown in the host dashboard | 3600 |
| `A` | `@` | second IPv4 address, if the host supplies one | 3600 |
| `CNAME` | `www` | host target shown in the dashboard (for example `your-site.netlify.app`, `cname.vercel-dns.com`, `your-project.pages.dev`) | 3600 |
| `TXT` | `@` | host ownership / verification token, if requested | 3600 |
| `CAA` | `@` | `0 issue "letsencrypt.org"` (or the host's CA) so HTTPS certificates can be issued | 3600 |

Notes:

- Do not point the apex at a `CNAME` unless the registrar or DNS provider supports `ALIAS`/`ANAME` at the apex (Cloudflare, DNSimple and Route 53 do).
- Keep any existing `MX`, `SPF`/`DMARC` and other mail records untouched.
- Exact IP addresses and CNAME targets must come from the host dashboard; they change over time, so they are not hard-coded here.

## 4. HTTPS

1. Add the custom domain in the host dashboard first, then add the DNS records above.
2. The host issues a Let's Encrypt certificate automatically once DNS resolves. Wait for the dashboard to report "certificate issued".
3. Enable "force HTTPS" / automatic `http` to `https` redirect in the host dashboard.
4. `public/_headers` already sends `Strict-Transport-Security`. Do not enable preload until both hosts are confirmed working.

## 5. Post-deploy verification

Run these once DNS has propagated:

```bash
dig +short ndmanor.com            # expect the host IPv4 address(es)
dig +short www.ndmanor.com        # expect a CNAME chain ending at the host
curl -I https://ndmanor.com       # expect HTTP/2 200 and a valid certificate
curl -s https://ndmanor.com/about | grep canonical   # expect https://ndmanor.com/about
curl -s https://ndmanor.com/robots.txt               # expect Sitemap: https://ndmanor.com/sitemap.xml
curl -s https://ndmanor.com/sitemap.xml | grep -c "<url>"   # expect 14
```

Then in a browser:

1. Visit all 14 routes plus a deliberately wrong URL to confirm the styled 404.
2. Confirm `tel:+917078944451`, the `wa.me/917078944451` prefilled messages and the Google Maps directions link open correctly on a real phone.
3. Submit the reservation, event and contact forms and confirm each opens WhatsApp with the prefilled message.
4. Add the property to Google Search Console and submit `https://ndmanor.com/sitemap.xml`.

## 6. Cache and header behaviour

`public/_headers` sets:

- `/assets/*` and `/fonts/*`: one year, immutable (content-hashed filenames)
- `/images/*`: 30 days
- HTML: no explicit long cache, so new builds are picked up immediately
- `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`

## 7. What still needs an external action

1. Register or keep `ndmanor.com` at a registrar and add the DNS records above.
2. Connect the repository to the chosen host and add the custom domain.
3. Issue and confirm the HTTPS certificate, then force HTTPS.
4. Confirm with the hotel that its Google Business Profile, WhatsApp number and address match the site, and submit the sitemap to Search Console.
5. Replace any photograph for which the hotel has not confirmed reuse rights (`research/ASSETS.md` lists the source of each image).

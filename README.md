# Summer Sail — website

A hand-built static rebuild of summer-sail.com. No framework, no build step required
to run or deploy: every `.html` file at the root is finished, plain HTML.

## Running it

Open `index.html` in a browser, or serve the folder:

```bash
npx http-server . -p 4173 -c-1
```

## Live

Published to GitHub Pages from `main`, root folder:

**https://ioannisbekas.github.io/summer-sail/**

`.nojekyll` is committed so Pages serves the folder as-is rather than running
Jekyll (which would silently drop `_build/` and `_originals/` and could mangle
other files). `404.html` is picked up automatically and returns a real 404.

### Which domain is canonical

`<link rel="canonical">`, `og:url` and `sitemap.xml` currently point at
**https://www.summer-sail.com/** — correct while the Pages copy is a preview,
because it stops the preview competing with the live site in search results.

If Pages becomes the primary site, rebuild with the base URL overridden:

```bash
SITE_URL="https://ioannisbekas.github.io/summer-sail/" node _build/build.js
```

Then update the `Sitemap:` line in `robots.txt` and the `<loc>` entries in
`sitemap.xml` to match, and commit.

## Deploying

Upload the whole folder to any static host (Netlify, Vercel, Cloudflare Pages, or
plain FTP to the existing server). There is nothing to compile.

Set `404.html` as the not-found page in your host's settings.

## Structure

```
index.html                 Home
all-inclusive.html         All Inclusive Pack (packages, prices, itineraries)
yachts.html                Fleet overview + comparison table
yacht-*.html               One page per yacht (5)
saronic-gulf.html          Route: Saronic Gulf
aegean-cyclades.html       Route: Aegean & Cyclades
about.html                 About us, team, why choose us
contact.html               Contact details, form, map
404.html                   Not found

css/style.css              The entire design system (one file, documented)
js/i18n.js                 EN/EL dictionary + language switching
js/main.js                 Nav, scroll reveal, lightbox, forms, back-to-top

assets/img/brand/          Logo
assets/img/hero/           Page heroes and lifestyle photography
assets/img/destinations/   Route and destination imagery
assets/img/yachts/         Per-yacht galleries and accommodation layouts

robots.txt, sitemap.xml    Update the sitemap date when content changes
```

## Editing

**Text** lives in `js/i18n.js`, not in the HTML. Every visible string has a key,
and both the English and Greek versions sit next to each other. Change the string
there and it updates on every page, in both languages, including `<title>` and the
meta description.

**Header, footer and navigation** are shared. They are authored once in
`_build/header.html` and `_build/footer.html`, then stitched into every page:

```bash
node _build/build.js
```

**The five yacht pages** are generated from one data file so the specifications can
never drift apart between pages:

```bash
node _build/gen-yachts.js && node _build/build.js
```

Edit `_build/yachts.data.js` to change a price, a spec or a gallery.

**Page content** lives in `_build/pages/*.html` — each file is just the `<main>`
content plus a small config header naming its title/description keys.

> You never *need* to run these scripts. They only exist so the shared chrome and
> the fleet data live in one place. The generated `.html` files at the root are the
> real, deployable site.

## Images

`_build/optimize.py` turns a large source image into a web-sized WebP:

```bash
python _build/optimize.py source.png assets/img/hero/my-image hero
```

Presets: `hero` (2560px), `page` (2048px), `card` (1600px), `thumb` (1200px),
`square` (1400px, cropped to 4:3).

## Forms

All forms validate in the browser and then open the visitor's mail client addressed
to info@summer-sail.com, so nothing typed is ever lost — but there is **no server**.

To send properly, add a `data-endpoint` attribute pointing at a form service
(Formspree, Netlify Forms, Basin, or your own handler):

```html
<form data-ss-form data-endpoint="https://formspree.io/f/xxxxxxx">
```

`js/main.js` will POST the form data there instead and show a success message
in-page. Nothing else needs changing.

## Language

The site opens in English, or Greek if the visitor's browser is set to Greek. The
EN/ΕΛ switch in the top bar remembers the choice in `localStorage`. Adding a
language means adding a third block to the dictionary in `js/i18n.js`.

## Design system

The look is editorial/magazine luxury — the reference points are Aman, Belmond
and Burgess rather than a typical charter site. Everything lives in
`css/style.css` as custom properties at the top of the file.

| | |
|---|---|
| Display | Cormorant Garamond, 300–500, oversized, tight tracking |
| UI / body | Inter, 300–600; uppercase micro-labels at `.26em` tracking |
| Ink | `#14120F` · body `#56514B` · muted `#6F675E` |
| Sand | `#E1BD85` fills · `#8A6529` for small text and links |
| Corners | square (`--radius: 0`) |
| Motion | 400–800ms; luxury reads slow, never snappy |

Every text colour was contrast-checked: body 7.9:1, muted 5.6:1 and the deep
sand 5.3:1 on white — all clear of the WCAG AA 4.5:1 threshold. The original
`#C69F63` sand failed at 2.4:1, which is why links and small type use the
deeper tone while the light sand is reserved for fills and large accents.

Structural choices worth knowing:

- **The header floats over the hero** and turns solid white on scroll.
  `js/main.js` measures the real topbar + header height into a `--chrome-h`
  custom property, so the hero slides under it exactly at any breakpoint.
- **Rules run along the top of grid cells**, never down the side, so a wrapped
  row can never leave an orphaned divider.
- **The hero booking card** is glass (`backdrop-filter`) with its own scrim and
  a solid fallback for browsers without backdrop-filter support.
- **Button hover fills** use a `z-index:-1` pseudo-element, so plain-text
  buttons need no wrapper span.

## Notes on imagery

Hero, lifestyle and destination photography was generated at 4K and downscaled;
the yacht galleries and accommodation layouts are the operator's own originals.
The logo was re-cut: the supplied PNG had no alpha channel (dark artwork on an
opaque white square), so any attempt to show it on a dark background produced a
white block. `logo.png` is now transparent RGBA and `logo-mark.png` is the sail
symbol alone, used beside the typographic wordmark. `Serenity` has no photography of her own — her page says so plainly and
points to her sister ship `Whisper` rather than showing another boat as if it were
hers. Replace that section as soon as real photographs exist.

## Hero video

`assets/video/hero.mp4` (3.1 MB, H.264 1080p) and `assets/video/hero.webm`
(1.4 MB, VP9) are the homepage hero film, generated at 1080p and transcoded for
web. `assets/img/hero/hero-poster.webp` is its first frame.

The poster ships in the HTML, so the hero is complete before any video loads.
`js/main.js` attaches the film only when it is actually wanted:

- viewport ≥ 768px (phones keep the still)
- `prefers-reduced-motion` is not set
- the browser is not in data-saver mode and not on 2G

If autoplay is refused, the poster simply stays. To re-encode a replacement:

```bash
ffmpeg -i source.mp4 -an -vf scale=1920:-2 -c:v libx264 -crf 27 -preset slow \
  -pix_fmt yuv420p -movflags +faststart assets/video/hero.mp4
```

## `_originals/`

The 14 original low-resolution photographs that the AI-generated imagery
replaced. Nothing references them — keep them for reference or delete the folder
before deploying. `_build/` is likewise not needed on the server.

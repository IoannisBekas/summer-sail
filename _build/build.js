/* ==========================================================================
   Summer Sail — static assembler
   Stitches _build/pages/*.html into finished HTML files at the project root,
   wrapping each with the shared head, header and footer.

   Run:  node _build/build.js

   You do NOT need this to run the site — the files it produces are plain
   static HTML. It only exists so the header and footer live in one place.
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

/* Absolute base URL used for <link rel=canonical>, og:url and sitemap.xml.
   Point this at whichever host is the primary one. While the GitHub Pages
   copy is a preview, leaving it on the real domain stops the preview
   competing with the live site in search results. */
const SITE_URL = process.env.SITE_URL || 'https://www.summer-sail.com/';

const ROOT = path.resolve(__dirname, '..');
const BUILD = __dirname;
const PAGES = path.join(BUILD, 'pages');

const read = (p) => fs.readFileSync(p, 'utf8');

const head = read(path.join(BUILD, 'head.html'));
const header = read(path.join(BUILD, 'header.html'));
const footer = read(path.join(BUILD, 'footer.html'));

/* ---- pull the English strings out of js/i18n.js for static <title>/meta -- */
const i18nSrc = read(path.join(ROOT, 'js', 'i18n.js'));
const enBlock = i18nSrc.slice(
  i18nSrc.indexOf('en: {'),
  i18nSrc.indexOf('/* ============================ GREEK')
);

function en(key) {
  const esc = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp("'" + esc + "':\\s*(['\"])([\\s\\S]*?)\\1\\s*,");
  const m = enBlock.match(re);
  if (!m) {
    console.warn('  ! missing en string for key: ' + key);
    return '';
  }
  return m[2].replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/<br>/g, ' ');
}

const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/* ------------------------------------------------------------------ build */
const files = fs.readdirSync(PAGES).filter((f) => f.endsWith('.html')).sort();
let count = 0;

for (const file of files) {
  const raw = read(path.join(PAGES, file));

  const cfgMatch = raw.match(/^<!--@([\s\S]*?)-->\s*/);
  if (!cfgMatch) {
    console.warn('  ! ' + file + ' has no <!--@ ... --> config block, skipped');
    continue;
  }

  const cfg = {};
  cfgMatch[1].split('\n').forEach((line) => {
    const m = line.match(/^\s*([a-z]+)\s*:\s*(.+?)\s*$/i);
    if (m) cfg[m[1]] = m[2];
  });

  const body = raw.slice(cfgMatch[0].length);
  const slug = file === 'index.html' ? '' : file;

  let out = head
    .replace(/\{\{TITLE\}\}/g, cfg.title || '')
    .replace(/\{\{DESC\}\}/g, cfg.desc || '')
    .replace(/\{\{TITLE_TEXT\}\}/g, attr(en(cfg.title)))
    .replace(/\{\{DESC_TEXT\}\}/g, attr(en(cfg.desc)))
    .replace(/\{\{SLUG\}\}/g, slug)
    .replace(/https:\/\/www\.summer-sail\.com\//g, SITE_URL);

  let hdr = header;
  if (cfg.nav) {
    hdr = hdr.replace(
      new RegExp('(<a class="nav__link" data-nav-id="' + cfg.nav + '")'),
      '$1 aria-current="page"'
    );
  }

  out += hdr + '\n' + body.trim() + '\n' + footer;

  fs.writeFileSync(path.join(ROOT, file), out, 'utf8');
  console.log('  built  ' + file);
  count++;
}

console.log('\n' + count + ' page' + (count === 1 ? '' : 's') + ' written to ' + ROOT);

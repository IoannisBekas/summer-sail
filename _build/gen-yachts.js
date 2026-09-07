/* ==========================================================================
   Summer Sail — yacht page generator
   Writes _build/pages/yacht-*.html from _build/yachts.data.js.
   Run:  node _build/gen-yachts.js   (then node _build/build.js)
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const { YACHTS, COMMON } = require('./yachts.data.js');

const OUT = path.join(__dirname, 'pages');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const ARROW = '<svg width="16" height="10" viewBox="0 0 18 12" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M1 6h15m0 0-5-5m5 5-5 5"/></svg>';

function specBlock(labelKey, fallback, value) {
  if (!value) return '';
  return `        <div class="spec-block">
          <h4 data-i18n="${labelKey}">${fallback}</h4>
          <p>${esc(value)}</p>
        </div>\n`;
}

function priceTable(y) {
  const p = y.prices;
  const head = p.columns.map((c) => `<th class="num">${c.replace(/ – /g, '<br>– ')}</th>`).join('\n            ');
  const cells = p.rates
    ? p.rates.map((r) => `<td class="num">${r}</td>`).join('\n            ')
    : p.columns.map(() => '<td class="num"><span data-i18n="y.tba">on request</span></td>').join('\n            ');

  return `      <div class="table-wrap">
        <table>
          <caption data-i18n="y.pricing">Price list</caption>
          <thead>
            <tr>
            <th data-i18n="y.thType">Yacht type</th>
            <th data-i18n="y.thCabins">Cabins / berths / heads</th>
            <th data-i18n="y.thBuilt">Built year</th>
            ${head}
            <th class="num" data-i18n="y.thDeposit">Security deposit (&euro;)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
            <td><strong>${esc(y.fullName.replace(/,\s*\d{4}$/, ''))}</strong></td>
            <td>${esc(y.berths)}</td>
            <td>${esc(y.year)}</td>
            ${cells}
            <td class="num">${esc(y.deposit)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="table-scroll-hint" data-i18n="pack.scrollHint">Swipe the table sideways to see every column.</p>
      <p class="form-note" style="margin-top:14px" data-i18n="${p.rates ? 'y.priceNote' : 'y.tbaNote'}">${
        p.rates
          ? 'Weekly rates in euro. Periods run Saturday to Saturday. Send us your dates and we will confirm the exact price.'
          : 'Rates for this yacht are quoted on request — tell us your dates and we will come straight back to you.'
      }</p>`;
}

function gallery(y) {
  return y.images
    .map((img, i) => `        <button class="gallery__item${i === 0 && y.images.length > 3 ? ' gallery__item--wide' : ''}" type="button" data-lightbox data-full="${img[0]}">
          <img src="${img[0]}" alt="${esc(img[1])}" loading="lazy">
        </button>`)
    .join('\n');
}

function otherYachts(current) {
  return YACHTS.filter((y) => y.slug !== current.slug)
    .slice(0, 4)
    .map((y) => `        <a class="card" href="${y.slug}.html">
          <div class="card__media"><img src="${y.hero}" alt="${esc(y.name)}" loading="lazy"></div>
          <div class="card__body">
            <h3>${esc(y.name)}</h3>
            <p style="margin-bottom:0">${y.cabins} <span data-i18n="fleet.specCabins">cabins</span> &middot; ${y.guests} <span data-i18n="fleet.specGuests">guests</span> &middot; ${y.loaFt} <span data-i18n="fleet.specLength">feet</span></p>
          </div>
        </a>`)
    .join('\n');
}

function page(y) {
  const s = y.specs;
  return `<!--@
  title: y.${y.key}.title
  desc: y.${y.key}.desc
  nav: yachts
-->

<!-- ======================================================== page hero -- -->
<section class="page-hero">
  <div class="page-hero__media">
    <img src="${y.heroScene[0]}" alt="${esc(y.heroScene[1])}" fetchpriority="high">
  </div>
  <div class="container">
    <div class="page-hero__inner">
      <p class="breadcrumb">
        <a href="index.html" data-i18n="nav.home">Home</a> <span>/</span>
        <a href="yachts.html" data-i18n="nav.yachts">Our Yachts</a> <span>/</span>
        <span>${esc(y.name)}</span>
      </p>
      <h1>${esc(y.fullName)}</h1>
      <p>${esc(y.base)} &middot; ${y.cabins} <span data-i18n="fleet.specCabins">cabins</span> &middot; ${y.guests} <span data-i18n="fleet.specGuests">guests</span> &middot; ${y.heads} <span data-i18n="fleet.specHeads">heads</span> &middot; ${y.loaFt} <span data-i18n="fleet.specLength">feet</span></p>
    </div>
  </div>
</section>

<!-- ======================================================== overview -- -->
<section class="section">
  <div class="container">
    <div class="split">
      <div data-reveal>
        <p class="eyebrow" data-i18n="y.overview">Overview</p>
        <h2>${esc(y.name)}</h2>
        <p class="lede">${esc(y.intro)}</p>
        <p style="margin-top:26px;display:flex;gap:12px;flex-wrap:wrap">
          <a class="btn" href="#enquire" data-i18n="y.enquireThis">Enquire about this yacht</a>
          ${y.images.length ? '<a class="btn btn--outline" href="#gallery" data-i18n="y.viewGallery">Open gallery</a>' : ''}
        </p>
      </div>

      <div data-reveal data-delay="1">
        <p class="eyebrow" data-i18n="y.keyFacts">Key facts</p>
        <ul class="spec-list">
          <li><span class="k" data-i18n="y.type">Type</span> <span class="v" data-i18n="y.sailboat">Sailboat</span></li>
          <li><span class="k" data-i18n="y.brand">Brand</span> <span class="v">${esc(y.brand)}</span></li>
          <li><span class="k" data-i18n="y.model">Model</span> <span class="v">${esc(y.model)}</span></li>
          <li><span class="k" data-i18n="y.built">Built year</span> <span class="v">${esc(y.year)}</span></li>
          <li><span class="k" data-i18n="y.length">Length</span> <span class="v">${esc(y.loaM)} m &middot; ${esc(y.loaFt)} ft</span></li>
          <li><span class="k" data-i18n="y.cabins">Cabins</span> <span class="v">${esc(y.cabins)}</span></li>
          <li><span class="k" data-i18n="y.guests">Guests</span> <span class="v">${esc(y.guests)}</span></li>
          <li><span class="k" data-i18n="y.heads">Heads (WC)</span> <span class="v">${esc(y.heads)}</span></li>
          <li><span class="k" data-i18n="y.engine">Engine</span> <span class="v">${esc(y.engine)}</span></li>
          <li><span class="k" data-i18n="y.fuel">Fuel capacity</span> <span class="v">${esc(y.fuel)}</span></li>
          <li><span class="k" data-i18n="y.water">Water capacity</span> <span class="v">${esc(y.water)}</span></li>
          <li><span class="k" data-i18n="y.base">Home port</span> <span class="v">${esc(y.base)}</span></li>
        </ul>
      </div>
    </div>
  </div>
</section>

${
  y.images.length
    ? `
<!-- ========================================================= gallery -- -->
<section class="section section--warm" id="gallery">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="eyebrow" data-i18n="y.gallery">Gallery</p>
      <h2>${esc(y.name)}</h2>
    </div>
    <div class="gallery" data-reveal>
${gallery(y)}
    </div>
  </div>
</section>
`
    : `
<!-- ================================================ no gallery yet -- -->
<section class="section section--warm" id="gallery">
  <div class="container container--narrow">
    <div class="tile text-center" data-reveal>
      <h4 data-i18n="y.gallery">Gallery</h4>
      <p data-i18n="y.noPhotos">Photography of this yacht is being updated. She is the sister ship to Whisper and shares the same layout, specification and equipment — the Whisper gallery shows exactly what to expect on board.</p>
      <p style="margin-top:18px">
        <a class="btn btn--outline btn--sm" href="yacht-whisper.html" data-i18n="y.seeSister">See the Whisper gallery</a>
      </p>
    </div>
  </div>
</section>
`
}${
  y.layout
    ? `
<!-- ========================================================== layout -- -->
<section class="section">
  <div class="container">
    <div class="split">
      <div class="split__media figure-accent" data-reveal>
        <img src="${y.layout[0]}" alt="${esc(y.layout[1])}" loading="lazy">
      </div>
      <div data-reveal data-delay="1">
        <p class="eyebrow" data-i18n="y.layout">Accommodation layout</p>
        <h2>${y.cabins} <span data-i18n="fleet.specCabins">cabins</span>, ${y.heads} <span data-i18n="fleet.specHeads">heads</span></h2>
        <p>${esc(y.layout[1])}. Sleeping ${y.guests} in comfort, with the saloon convertible for anyone who prefers to be near the companionway.</p>
      </div>
    </div>
  </div>
</section>
`
    : ''
}
<!-- ========================================================= pricing -- -->
<section class="section${y.layout ? ' section--warm' : ''}">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="eyebrow" data-i18n="y.pricing">Price list</p>
      <h2>${esc(y.name)}</h2>
    </div>
    <div data-reveal>
${priceTable(y)}
    </div>
  </div>
</section>

<!-- =========================================================== specs -- -->
<section class="section">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="eyebrow" data-i18n="y.specs">Details and specifications</p>
      <h2 data-i18n="y.specs">Details and specifications</h2>
    </div>
    <div class="grid grid--2" data-reveal>
      <div>
${specBlock('y.sails', 'Sails', s.sails)}${specBlock('y.instruments', 'Instruments', COMMON.instruments)}${
    s.bowThruster
      ? `        <div class="spec-block">
          <h4 data-i18n="y.bowThruster">Bow thruster</h4>
          <p data-i18n="y.yes">Yes</p>
        </div>\n`
      : ''
  }${specBlock('y.cockpit', 'Cockpit', s.cockpit || COMMON.cockpit)}${specBlock('y.entertainment', 'Entertainment', COMMON.entertainment)}${specBlock('y.waste', 'Waste water system', COMMON.waste)}${specBlock('y.freshwater', 'Fresh water system', COMMON.freshwater)}      </div>
      <div>
${specBlock('y.electrical', 'Electrical', s.electrical)}${s.aircon ? specBlock('y.aircon', 'Air conditioning', s.aircon) : ''}${specBlock('y.galley', 'Galley', s.galley)}${specBlock('y.deck', 'Deck', COMMON.deck)}${specBlock('y.extraGear', 'Also on board', COMMON.extraGear)}${specBlock('y.safety', 'Safety equipment', COMMON.safety)}${specBlock('y.equipment', 'Equipment', s.equipment)}      </div>
    </div>

    <div class="grid grid--2" style="margin-top:40px" data-reveal>
      <div class="tile">
        <h4 data-i18n="y.freeExtras">Free extras</h4>
        <p>${esc(COMMON.freeExtras)}</p>
      </div>
      <div class="tile">
        <h4 data-i18n="y.optExtras">Optional extras</h4>
        <ul class="tick-list" style="margin-top:.6em">
${y.optExtras.map((e) => `          <li>${esc(e)}</li>`).join('\n')}
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- ========================================================= enquiry -- -->
<section class="section section--warm" id="enquire">
  <div class="container container--narrow">
    <div class="booking-card" data-reveal>
      <div class="section-head text-center" style="margin-bottom:32px">
        <p class="eyebrow" data-i18n="cta.book">Book your date</p>
        <h2 data-i18n="form.enquiryTitle">Book your departure date</h2>
        <p data-i18n="form.enquiryText">Tell us when you want to sail and how many you are.</p>
      </div>
      <form data-ss-form data-subject="Summer Sail enquiry — ${esc(y.fullName)}">
        <input type="hidden" name="yacht" value="${esc(y.fullName)}">
        <div class="form-grid">
          <div class="field">
            <label for="y-date"><span data-i18n="form.date">Departure date</span> <span class="req">*</span></label>
            <input id="y-date" type="date" name="departure_date" required>
          </div>
          <div class="field">
            <label for="y-guests"><span data-i18n="form.guests">Guests on board</span> <span class="req">*</span></label>
            <select id="y-guests" name="guests" required>
              <option value="" data-i18n="form.select">Please select</option>
              <option value="2" data-i18n="form.g2">2 persons</option>
              <option value="4" data-i18n="form.g4">4 persons</option>
              <option value="6" data-i18n="form.g6">6 persons</option>
              <option value="8" data-i18n="form.g8">8 persons</option>
              <option value="10" data-i18n="form.g10">10 persons</option>
            </select>
          </div>
          <div class="field">
            <label for="y-email"><span data-i18n="form.email">Email address</span> <span class="req">*</span></label>
            <input id="y-email" type="email" name="email" required data-i18n-attr="placeholder:form.email" placeholder="Email address">
          </div>
          <div class="field">
            <label for="y-phone" data-i18n="form.phone">Telephone</label>
            <input id="y-phone" type="tel" name="telephone" data-i18n-attr="placeholder:form.phone" placeholder="Telephone">
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;margin-top:24px">
          <button class="btn" type="submit" data-i18n="form.send">Send enquiry</button>
          <p class="form-note" data-i18n="form.note">No deposit required to enquire.</p>
        </div>
        <p class="form-status" role="status"></p>
      </form>
    </div>
  </div>
</section>

<!-- ==================================================== other yachts -- -->
<section class="section">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="eyebrow" data-i18n="fleet.heroKicker">The fleet</p>
      <h2 data-i18n="y.otherYachts">Other yachts in the fleet</h2>
    </div>
    <div class="grid grid--4" data-reveal>
${otherYachts(y)}
    </div>
  </div>
</section>

<!-- ======================================================== lightbox -- -->
<div class="lightbox" role="dialog" aria-modal="true" aria-label="${esc(y.name)} gallery">
  <button class="lightbox__close" type="button" data-i18n-attr="aria-label:y.lightboxClose">&times;</button>
  <button class="lightbox__nav lightbox__nav--prev" type="button" data-i18n-attr="aria-label:y.lightboxPrev">&#8249;</button>
  <img alt="">
  <button class="lightbox__nav lightbox__nav--next" type="button" data-i18n-attr="aria-label:y.lightboxNext">&#8250;</button>
  <span class="lightbox__count"></span>
</div>
`;
}

let n = 0;
for (const y of YACHTS) {
  fs.writeFileSync(path.join(OUT, y.slug + '.html'), page(y), 'utf8');
  console.log('  generated  pages/' + y.slug + '.html');
  n++;
}
console.log('\n' + n + ' yacht pages generated.');

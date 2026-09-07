/* ==========================================================================
   Summer Sail — fleet data
   Single source of truth for the five yachts. Used by gen-yachts.js to write
   _build/pages/yacht-*.html, and by hand when updating the fleet grid.
   Figures transcribed from the operator's own specification sheets.
   ========================================================================== */
'use strict';

/* Equipment blocks shared by most of the fleet. */
const COMMON = {
  instruments: 'Main deck compass, echo sounder, speedometer, GPS chartplotter, wind direction / speed, autopilot',
  cockpit: 'Cockpit table, bathing platform, cockpit cushions, aft shower, bathing ladder',
  entertainment: 'Saloon speaker, cockpit speakers, radio/CD, USB MP3 / AUX',
  waste: 'Holding tank (1)',
  freshwater: 'Water heater',
  deck: 'Rail openings both sides, bimini top, spring cleats, sprayhood',
  extraGear: 'Inflatable dinghy, nautical charts and nautical guide',
  safety: 'Liferaft, auxiliary anchor, EPIRB (GMDSS), main anchor, fire extinguisher, first aid kit, floating line, horseshoe lifebuoy with light, distress flares',
  freeExtras: 'Starter pack, linen and duvets'
};

const OCEANIS43_PRICES = {
  columns: ['23/04 – 21/05', '21/05 – 18/06', '18/06 – 30/07', '30/07 – 20/08',
            '20/08 – 17/09', '17/09 – 01/10', '01/10 – 15/10', '15/10 – 23/12'],
  rates:   ['2.192', '2.861', '3.309', '3.896', '3.272', '2.885', '2.490', '2.015']
};

const TBA_PRICES = {
  columns: ['01/01 – 25/05', '25/05 – 05/06', '05/06 – 03/07', '03/07 – 31/07',
            '31/07 – 14/08', '14/08 – 28/08', '28/08 – 31/12'],
  rates:   null   // quoted on request
};

const YACHTS = [
  {
    slug: 'yacht-oceanis-461',
    heroScene: ['assets/img/hero/cta-band.webp', 'A Greek bay at sunset'],
    key: 'oceanis461',
    name: 'Oceanis 46.1',
    fullName: 'BENETEAU Oceanis 46.1, 2019',
    navName: 'Oceanis 46.1, 2019',
    brand: 'BENETEAU',
    model: 'Oceanis 46.1',
    year: '2019',
    loaFt: '46',
    loaM: '14.6',
    cabins: '5',
    guests: '10',
    heads: '3',
    engine: '57 HP',
    fuel: '200 L',
    water: '570 L',
    base: 'Athens, Greece',
    berths: '5 / 10 / 3',
    deposit: '3.000',
    prices: TBA_PRICES,
    hero: 'assets/img/yachts/oceanis461/o461-3.jpg',
    images: [
      ['assets/img/yachts/oceanis461/o461-3.jpg', 'Oceanis 46.1 at anchor in a Greek bay'],
      ['assets/img/yachts/oceanis461/o461-1.jpg', 'Oceanis 46.1 cockpit and twin wheels'],
      ['assets/img/yachts/oceanis461/o461-10.jpg', 'Oceanis 46.1 deck detail'],
      ['assets/img/yachts/oceanis461/o461-2.jpg', 'Oceanis 46.1 at anchor at dusk'],
      ['assets/img/yachts/oceanis461/o461-4.jpg', 'Oceanis 46.1 cabin'],
      ['assets/img/yachts/oceanis461/o461-5.jpg', 'Oceanis 46.1 galley'],
      ['assets/img/yachts/oceanis461/o461-6.jpg', 'Oceanis 46.1 interior detail'],
      ['assets/img/yachts/oceanis461/o461-7.jpg', 'Oceanis 46.1 heads'],
      ['assets/img/yachts/oceanis461/o461-8.jpg', 'Oceanis 46.1 berth'],
      ['assets/img/yachts/oceanis461/o461-9.jpg', 'Oceanis 46.1 navigation station'],
      ['assets/img/yachts/oceanis461/o461-12.jpg', 'Oceanis 46.1 foredeck']
    ],
    layout: ['assets/img/yachts/layouts/oceanis461-layout.png', 'Oceanis 46.1 accommodation layout — 5 cabins, 3 heads'],
    intro: 'The largest yacht in the fleet and the one to take when the crew is a proper group. Five cabins, three heads, and enough deck space that nobody has to negotiate for a spot in the sun.',
    specs: {
      sails: 'Main: rolling, genoa: furling',
      bowThruster: true,
      electrical: 'Fans, 12V socket, shore power connection cable, battery charger, 220V sockets (on shore power)',
      galley: 'Gas cooker with oven, cutlery, 2 refrigerators, sink, kitchen utensils',
      equipment: 'Pillows / duvets, deck shower, steering wheel (×2), water hose, electric anchor winch, genoa sheet winches (2), electric halyard winch, self-tailing winches'
    },
    optExtras: [
      'Children safety railing nets — €160 per booking',
      'Outboard engine — €120 per week',
      'Skipper — €160 per day',
      'End cleaning — €150 per booking'
    ]
  },

  {
    slug: 'yacht-bavaria-c42',
    heroScene: ['assets/img/destinations/saronic-hero.webp', 'A traditional Greek island harbour at golden hour'],
    key: 'bavariac42',
    name: 'Bavaria C42',
    fullName: 'Bavaria C42, 2022',
    navName: 'Bavaria C42, 2022',
    brand: 'Bavaria',
    model: 'C 42',
    year: '2022',
    loaFt: '42',
    loaM: '12.38',
    cabins: '3',
    guests: '6+1',
    heads: '2',
    engine: '40 HP',
    fuel: '210 L',
    water: '460 L',
    base: 'Athens, Greece',
    berths: '3 / 6+1 / 2',
    deposit: '2.500',
    prices: TBA_PRICES,
    hero: 'assets/img/yachts/bavaria/c42-01.jpg',
    images: [
      ['assets/img/yachts/bavaria/c42-01.jpg', 'Bavaria C42 under sail'],
      ['assets/img/yachts/bavaria/c42-08.jpg', 'Bavaria C42 on the water'],
      ['assets/img/yachts/bavaria/c42-05.jpg', 'Bavaria C42 cockpit'],
      ['assets/img/yachts/bavaria/c42-02.jpg', 'Bavaria C42 interior'],
      ['assets/img/yachts/bavaria/c42-04.jpg', 'Bavaria C42 cabin'],
      ['assets/img/yachts/bavaria/c42-06.jpg', 'Bavaria C42 detail']
    ],
    layout: null,
    intro: 'The newest hull in the fleet, and the easiest to handle. A self-tacking jib means one person can work the boat while everyone else stays exactly where they are — and it is the only yacht here with air conditioning on shore power.',
    specs: {
      sails: 'Main: rolling, genoa: furling and self-tacking',
      bowThruster: true,
      electrical: '12V socket, shore power connection cable, battery charger, 220V sockets (on shore power)',
      aircon: 'Yes — on shore power, plus fans',
      galley: 'Gas cooker with oven, cutlery, 2 refrigerators, sink, kitchen utensils',
      equipment: 'Pillows / duvets, deck shower, steering wheel (×2), water hose, electric anchor winch, genoa sheet winches (2), electric halyard winch, self-tailing winches'
    },
    optExtras: [
      'Children safety railing nets — €160 per booking',
      'Outboard engine — €120 per week',
      'Skipper — €160 per day',
      'End cleaning — €150 per booking'
    ]
  },

  {
    slug: 'yacht-hanse-458',
    heroScene: ['assets/img/hero/fleet-hero.webp', 'A sailing yacht at anchor in a secluded Greek bay'],
    key: 'hanse458',
    name: 'Hanse 458',
    fullName: 'Hanse 458, 2020',
    navName: 'Hanse 458, 2020',
    brand: 'Hanse',
    model: '458',
    year: '2020',
    loaFt: '45',
    loaM: '13.95',
    cabins: '4',
    guests: '8+2',
    heads: '2',
    engine: '57 HP',
    fuel: '210 L',
    water: '450 L',
    base: 'Athens, Greece',
    berths: '4 / 8+2 / 2',
    deposit: '2.500',
    prices: TBA_PRICES,
    hero: 'assets/img/yachts/hanse/hanse-26.webp',
    images: [
      ['assets/img/yachts/hanse/hanse-26.webp', 'Hanse 458 under sail'],
      ['assets/img/yachts/hanse/hanse-29.webp', 'Hanse 458 sailing, seen from above'],
      ['assets/img/yachts/hanse/hanse-2b.webp', 'Hanse 458 at anchor'],
      ['assets/img/yachts/hanse/hanse-2e.webp', 'Hanse 458 saloon'],
      ['assets/img/yachts/hanse/hanse-2f.webp', 'Hanse 458 galley'],
      ['assets/img/yachts/hanse/hanse-30.webp', 'Hanse 458 interior'],
      ['assets/img/yachts/hanse/hanse-31.webp', 'Hanse 458 berth'],
      ['assets/img/yachts/hanse/hanse-32.webp', 'Hanse 458 saloon table']
    ],
    layout: ['assets/img/yachts/hanse/hanse-25.webp', 'Hanse 458 accommodation layout — 4 cabins, 2 heads'],
    intro: 'Four cabins, a wide beam and a big cockpit — the balanced choice for two families or a group of eight. Hanse build them to be sailed shorthanded, which shows the moment the wind gets up.',
    specs: {
      sails: 'Main: rolling, genoa: furling',
      bowThruster: true,
      electrical: 'Fans, 12V socket, shore power connection cable, battery charger, 220V sockets (on shore power)',
      galley: 'Gas cooker with oven, cutlery, 2 refrigerators, sink, kitchen utensils',
      equipment: 'Pillows / duvets, deck shower, steering wheel (×2), water hose, electric anchor winch, genoa sheet winches (2), electric halyard winch, self-tailing winches'
    },
    optExtras: [
      'Children safety railing nets — €160 per booking',
      'Outboard engine — €120 per week',
      'Skipper — €160 per day',
      'End cleaning — €150 per booking'
    ]
  },

  {
    slug: 'yacht-whisper',
    heroScene: ['assets/img/destinations/aegean-split.webp', 'A Cycladic village above the caldera'],
    key: 'whisper',
    name: 'Whisper',
    fullName: 'Bénéteau Oceanis 43 — Whisper',
    navName: 'Oceanis 43 — Whisper',
    brand: 'Bénéteau',
    model: 'Oceanis 43',
    year: '2011',
    loaFt: '43',
    loaM: '13.1',
    cabins: '4',
    guests: '8+2',
    heads: '2',
    engine: '54 HP',
    fuel: '200 L',
    water: '360 L',
    base: 'Marina Kalamaki (Alimos Marina), Athens',
    berths: '4 / 10 / 2',
    deposit: '2.000',
    prices: OCEANIS43_PRICES,
    hero: 'assets/img/yachts/whisper/whisper-01.jpg',
    images: [
      ['assets/img/yachts/whisper/whisper-01.jpg', 'Oceanis 43 Whisper']
    ],
    layout: ['assets/img/yachts/layouts/oceanis43-layout.jpg', 'Oceanis 43 accommodation layout — 4 cabins, 2 heads'],
    intro: 'A teak-decked Oceanis 43 with four cabins and a diesel heater, which makes her the one to take at the shoulders of the season. Solar panels keep the batteries up when you are away from a pontoon for days.',
    specs: {
      sails: 'Furling main sail, roller furling genoa',
      bowThruster: true,
      cockpit: 'Cockpit table, bathing platform, teak laid seats, cockpit cushions, teak sole, aft shower, bathing ladder',
      electrical: '12V socket, solar panel, shore power connection cable, battery charger, 220V sockets (on shore power)',
      galley: 'Gas cooker with oven, cutlery, refrigerator, 2 sinks, kitchen utensils',
      equipment: 'Teak deck, pillows / duvets, deck shower, steering wheel (×2), water hose, electric anchor winch, genoa sheet winches (2), electric fans (7), self-tailing winches, diesel heater'
    },
    optExtras: [
      'Children safety railing nets — €160 per booking',
      'Outboard engine — €60 per week',
      'Skipper — €170 per day',
      'End cleaning — €150 per booking'
    ]
  },

  {
    slug: 'yacht-serenity',
    heroScene: ['assets/img/destinations/saronic-card.webp', 'A sailing yacht at anchor in clear Greek water'],
    key: 'serenity',
    name: 'Serenity',
    fullName: 'Bénéteau Oceanis 43 — Serenity',
    navName: 'Oceanis 43 — Serenity',
    brand: 'Bénéteau',
    model: 'Oceanis 43',
    year: '2010',
    loaFt: '43',
    loaM: '13.1',
    cabins: '4',
    guests: '8+2',
    heads: '2',
    engine: '54 HP',
    fuel: '200 L',
    water: '360 L',
    base: 'Marina Kalamaki (Alimos Marina), Athens',
    berths: '4 / 10 / 2',
    deposit: '2.000',
    prices: OCEANIS43_PRICES,
    hero: 'assets/img/destinations/saronic-card.webp',
    photoNote: true,
    images: [],
    layout: ['assets/img/yachts/layouts/oceanis43-layout.jpg', 'Oceanis 43 accommodation layout — 4 cabins, 2 heads'],
    intro: 'Whisper’s sister ship, and the workhorse of the fleet. Same four-cabin layout, same teak deck, same easy manners in a breeze — book whichever of the two is free on your dates.',
    specs: {
      sails: 'Furling main sail, roller furling genoa',
      bowThruster: true,
      cockpit: 'Cockpit table, bathing platform, teak laid seats, cockpit cushions, teak sole, aft shower, bathing ladder',
      electrical: '12V socket, solar panel, shore power connection cable, battery charger, 220V sockets (on shore power)',
      galley: 'Gas cooker with oven, cutlery, refrigerator, 2 sinks, kitchen utensils',
      equipment: 'Teak deck, pillows / duvets, deck shower, steering wheel (×2), water hose, electric anchor winch, genoa sheet winches (2), electric fans (7), self-tailing winches'
    },
    optExtras: [
      'Children safety railing nets — €160 per booking',
      'Outboard engine — €60 per week',
      'Skipper — €170 per day',
      'End cleaning — €150 per booking'
    ]
  }
];

module.exports = { YACHTS, COMMON };

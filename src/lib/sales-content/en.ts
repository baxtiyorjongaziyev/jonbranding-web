/**
 * Sotuv kontenti — INGLIZ tili.
 *
 * Narxlar o'zbekchadagi bilan bir xil (so'mda). Faqat matn tarjima qilingan.
 * O'zgarish avval uz.ts da, keyin bu yerda.
 */

import type { Package, SalesContent, ServiceGroup } from './types';

const SERVICE_GROUPS: ServiceGroup[] = [
  {
    title: 'Building the brand',
    intro: 'From the name to a complete visual system. Each part can be taken on its own.',
    items: [
      {
        id: 'brand-strategy',
        name: "Brand strategy",
        price: '48 000 000',
        lead: 'We work out the place your brand should hold in the market. Who you serve, what sets you apart and what you say — brought into one strategic system.',
        deliverables: [
          'Brand Strategy Deck — a strategic document of 30–40+ pages (business, market, audience, positioning, messaging)',
          'Brand Strategy Map — the whole strategic system on a single page',
          'Creative Brief — the compass for every design, marketing and communication decision that follows',
          'Business diagnostics and market trend analysis',
          'Competitor analysis and identification of open strategic positions',
          'Audience segments and a jobs-to-be-done needs analysis',
          'Positioning formula, value proposition and a differentiation you can defend',
          'Brand essence, brand personality and the core messaging pillars',
        ],
        benefit: 'Marketing, sales and design all pull in one direction. The 48 million som is not for a presentation — it is for the strategic system every later brand decision rests on.',
        audience: 'Founders, CEOs, marketing leads, and businesses launching a new brand or going through a rebrand',
      },
      {
        id: 'naming',
        name: "Naming",
        price: '10 000 000',
        duration: '10 days',
        lead: "We develop a memorable name for your business and explain the choice.",
        deliverables: [
          'A professional name that fits your business',
          'The strategic reasoning — why this name',
          'Competitor analysis and a similarity check against their names',
          '.uz and .com domains, Telegram and Instagram usernames checked',
          'Trademark search across the Uzbekistan register',
          '3 free revisions',
        ],
        benefit: "A name, the reasoning behind it and availability checks. Registration is a separate service.",
        audience: 'For people starting a business, or whose current name is not working',
        note: "Domain, social account and trademark availability are considered.",
        proof: {
          label: 'Names we have created',
          items: [
            'Savod', 'Fidda', 'Shirona', 'Belif', 'Unvan', 'Parfino', 'Naf', 'Revo', 'Petron', 'Estem',
            'Zayyan', 'Mercato', 'Geonest', 'Rutera', 'Sofmir', 'Arfadel', 'Melamus', 'Polentra', 'Viton',
          ],
        },
      },
      {
        id: 'logo',
        name: "Logo",
        price: '8 000 000',
        duration: '7 days',
        lead: 'A mark that works the same on a small screen and on a large banner.',
        deliverables: [
          '3 concepts; the one you choose is taken all the way',
          'Every format: AI, EPS, SVG, PDF, PNG',
          'Colour, black-and-white and single-colour versions',
          'Horizontal, vertical and compact (icon) variants',
          'Minimum size and clear space rules',
        ],
        benefit: "Ready logo files in different sizes and formats make application easier.",
        audience: 'For a business with no logo, or one that looks dated',
      },
      {
        id: 'visual-identity',
        name: "Visual identity",
        price: '18 000 000',
        duration: '10 days',
        lead: 'A logo is one mark. A visual identity is your brand being recognised everywhere.',
        deliverables: [
          'Colour palette (Pantone, CMYK, RGB, HEX)',
          'Type system: headline, body, accent',
          'Graphic elements and patterns',
          'Photography and illustration style',
          'More than 10 applications: business card, letterhead, envelope, uniform, banner, social templates',
        ],
        benefit: "Colours, fonts and layouts help keep materials consistent.",
        audience: 'For a business that has a logo but looks different everywhere it appears',
      },
      {
        id: 'brandbook',
        name: "Brandbook — usage rules",
        price: '24 000 000',
        duration: '7 days',
        lead: 'Your brand’s rules in one document. A new designer joins and nothing breaks.',
        deliverables: [
          'A PDF manual of more than 60 pages',
          'How the logo may and may not be used (with examples of mistakes)',
          'Full colour and typography specification',
          'Ready artwork across every application',
          'Brand language and tone of voice',
        ],
        benefit: 'The brand rests on rules, not on a person. A designer leaves, a new hire arrives — the brand stays the same.',
        audience: 'For teams that are growing and work with several designers and printers',
        note: 'Taken together with the visual identity, the two are built as one system.',
      },
    ],
  },
  {
    title: 'Packaging',
    intro: 'Packaging that gets your product picked up off the shelf.',
    items: [
      {
        id: 'packaging',
        name: "Packaging design (1 product variant)",
        price: '12 000 000',
        duration: '7 days',
        lead: 'Complete packaging design for one product — ready for the printer.',
        deliverables: [
          'Packaging design that accounts for how it reads on the shelf',
          'Dieline, with the technical drawing',
          '3D visualisation (for presentations and marketplaces)',
          'Barcode, ingredients, dates and symbols correctly placed',
          'Print-ready files',
        ],
        benefit: "Packaging helps distinguish the product and present its information clearly.",
        audience: 'For producers moving into shops, marketplaces or retail chains',
      },
      {
        id: 'packaging-extra',
        name: "Each additional product variant",
        price: 'from 4 000 000',
        duration: '+3 days',
        lead: 'Once the first pack is done, the rest of the range costs less.',
        deliverables: [
          'One system, adapted to each product',
          'A solution that separates flavours, sizes and variants',
          'Dielines and print files included',
        ],
        benefit: 'Your whole range sits on the shelf as one family — a buyer who picks up one recognises the others.',
        audience: 'For producers with several product lines',
        note: 'The exact price depends on how complex the pack format is.',
      },
    ],
  },
  {
    title: 'Legal protection',
    intro: 'For the name to be yours, it has to be registered. We handle that too.',
    items: [
      {
        id: 'trademark-search',
        name: 'Trademark search',
        price: '880 000',
        duration: '2 days',
        lead: 'Find out in advance whether your name is free — the cheapest safeguard there is.',
        deliverables: [
          'A full search of the official register',
          'A list of similar marks and the level of risk',
          'A verdict on the likelihood of registration',
          'We work out which classes you need',
        ],
        benefit: "An assessment of similar names and registration risks. This is not a registration guarantee.",
        audience: 'For those who have chosen a name but not yet registered it',
        note: 'Price is per class. This search is already included in the Naming service.',
        addon: { label: 'Each additional class', price: '+440 000 UZS' },
      },
      {
        id: 'trademark-standard',
        name: 'Trademark (standard)',
        price: '5 000 000',
        duration: '7 months',
        lead: 'Trademark registration through the standard procedure.',
        deliverables: [
          'Documents fully prepared and filed',
          'Classes selected correctly',
          'The process followed through to the end',
          'The certificate handed to you',
        ],
        benefit: "Document preparation and registration support. The decision depends on examination.",
        audience: 'For those in no hurry who still want the name protected',
      },
      {
        id: 'trademark-express',
        name: 'Trademark (expedited)',
        price: '7 000 000',
        duration: '20–40 days',
        lead: 'The same work, on an accelerated track.',
        deliverables: [
          'Everything in the standard registration',
          'Expedited examination',
          'The wait drops from 7 months to 20–40 days',
        ],
        benefit: "Application preparation and support through the expedited procedure. Final timing depends on the official process.",
        audience: 'For those under pressure from a tender, marketplace or export deadline',
      },
    ],
  },
];

const PACKAGES: Package[] = [
  {
    name: 'VIP',
    price: '70 000 000',
    separate: '85 000 000',
    saving: '15 000 000',
    audience: 'For producers going into export, marketplaces or retail chains',
    features: ['Naming', 'Logo', 'Visual identity', 'Brandbook', 'Trademark', 'Packaging (3 SKU)'],
    duration: '35–45 days',
  },
  {
    name: 'PREMIUM',
    price: '55 000 000',
    separate: '65 000 000',
    saving: '10 000 000',
    audience: 'For a growing business that wants the brand fully in order',
    features: ['Naming', 'Logo', 'Visual identity', 'Brandbook', 'Trademark'],
    duration: '30–35 days',
    featured: true,
    badge: 'Most chosen',
  },
  {
    name: 'STANDARD',
    price: '20 000 000',
    separate: '23 000 000',
    saving: '3 000 000',
    audience: 'For those just starting out, or with no brand yet',
    features: ['Naming', 'Logo', 'Trademark'],
    duration: '20–25 days',
  },
];

export const en: SalesContent = {
  serviceGroups: SERVICE_GROUPS,
  packages: PACKAGES,
  faqs: [
    {
      q: 'Why 8 million when Instagram designers do a logo for 500 thousand?',
      a: 'A 500-thousand logo is one picture. After that you pay again for every banner, pack and business card, because the files are incomplete, there are no rules, and everything gets redrawn each time. Ours arrives in every format, in every version, with rules for use — plus a trademark search, so the name does not turn out to belong to someone else. The difference is not the price; it is what you pay afterwards.',
    },
    {
      q: 'What if I do not like it?',
      a: 'You will not be shown a finished piece out of nowhere. First we present 3 directions and you pick one — only then do we refine it. Nothing moves to the next stage until you approve. Revisions are made within the direction you chose.',
    },
    {
      q: 'What is needed from me, and how much of my time?',
      a: 'One brief at the start — a 40–60 minute conversation, or written answers. Then at each stage you look at the presentation and give feedback: usually 2–3 times, none longer than half an hour. We do the rest.',
    },
    {
      q: 'Can I pay in instalments?',
      a: 'Yes, in two stages: 50% on signing the contract, 50% on delivery of the project. Half upfront, half once you have seen the result.',
    },
    {
      q: 'What if the trademark is refused?',
      a: 'That is exactly why we search the official register before filing and tell you the level of risk. If the risk is high we say so plainly and suggest changing the name — we will not knowingly gamble with your money.',
    },
  ],
  whyUs: [
    {
      title: 'A contract and official payment',
      desc: 'Work starts from a contract: deadlines, scope and the files to be delivered are written down. You are dealing with a registered company, not someone who can disappear.',
    },
    {
      title: 'The trademark is on us as well',
      desc: 'A designer draws a logo and leaves. We check the name, register it and hand you the certificate — the brand becomes yours in law.',
    },
    {
      title: 'A structured process with internal review',
      desc: "Each project follows a brief, analysis, concept and handover. Decisions are presented for approval.",
    },
    {
      title: 'The files stay with you',
      desc: 'All source files and rules are handed over. Even if you leave us, your brand keeps working — you are not tied to anyone.',
    },
  ],
  guarantees: [
    'A contract: deadlines, scope and deliverables written down in advance',
    'Nothing moves to the next stage until you approve it',
    'Not a single concept — you choose from 3 directions',
    '3 free revisions on naming',
    'Payment in stages: you pay as you see the result',
  ],
  jobs: [
    {
      pain: 'Your product is better than your competitor’s, but the buyer picks the better-looking pack off the shelf.',
      gain: "Packaging that distinguishes the product and presents information clearly.",
    },
    {
      pain: 'You say “our quality is high”, but it looks cheap. So you settle for a low price.',
      gain: "A visual identity suited to the product and the business.",
    },
    {
      pain: 'A different designer each time, a different colour each time. Someone can see you ten times and still not remember you.',
      gain: "Consistent colours, fonts and style across advertising and materials.",
    },
    {
      pain: 'Your name is not registered. One day a letter may arrive saying the name belongs to someone else.',
      gain: "Help with trademark checks and the registration process.",
    },
  ],
  processSteps: [
    { title: 'Brief and analysis', desc: 'We study your business, your competitors and your audience' },
    { title: 'Concept', desc: 'We present 3 directions; you choose one' },
    { title: 'Development', desc: 'The chosen direction is refined' },
    { title: 'Handover', desc: 'Every file and document is in your hands' },
  ],
  priceFactors: [
    'Number of product lines (SKU)',
    'Number of trademark classes',
    'Number of applications (business card, banner, uniform and so on)',
    'Timing — expedited delivery +50%',
  ],
  ui: {
    currency: 'UZS',
    stats: { experience: 'clear stages', clients: 'split payment', projects: 'upfront payment' },
    payment: {
      contract: 'On signing the contract',
      delivery: 'On delivery of the project',
    },
    notSure: 'Not sure — I need advice',
    eyebrows: {
      prices: 'Prices', task: 'The job', services: 'Services', process: 'Process',
      factors: 'Factors', packages: 'Packages', trust: 'Trust', difference: 'Difference',
      faq: 'Questions', talk: 'Talk',
    },
    hero: {
      pre: 'Our prices are', hi: 'open',
      sub: 'The same for everyone — we work transparently. We hide neither the price nor the work.',
    },
    jobs: {
      pre: 'What we actually', hi: 'solve',
      sub: 'Clients do not come to us for a logo. They come to be taken seriously in the market and to justify their price.',
      now: 'Today', withUs: 'With us',
    },
    services: {
      pre: 'Take them', hi: 'one at a time',
      sub: 'You do not need everything at once. Take what you need now — each service is a complete piece of work that ends with finished files in your hands.',
      note: 'Prices are for the service. State fees are paid separately.',
      showcase: 'Pages from our brandbooks', cases: 'Our work in this service',
      price: 'Price', duration: 'Timing', cta: 'Send a request',
      deliverables: 'What you get', benefit: 'What it does for you',
    },
    process: { pre: 'How we', hi: 'work', paymentTitle: 'Payment stages' },
    factors: { pre: 'What affects', hi: 'the price' },
    packages: {
      pre: 'Need several? A package is', hi: 'cheaper',
      sub: 'Taken as a package it costs less than buying the services separately, and everything is built as one system.',
      separate: { pre: 'Bought separately', mid: '— you save', suf: '' },
      cta: 'Send a request',
      note: 'Timing covers the design work. The trademark certificate is issued separately, on the official schedule.',
    },
    trust: { pre: 'They have worked', hi: 'with us' },
    difference: { pre: 'Why not a cheap', hi: 'designer', guaranteesTitle: 'To reduce your risk' },
    faq: { pre: 'Frequently asked', hi: 'questions' },
    cta: {
      pre: 'Not sure which package', hi: 'fits you?',
      sub: 'We will tell you in a free 20-minute call. We do not sell — we advise.',
      button: 'Book a call',
    },
    footnote: 'Prices as of September 2026. The final price depends on the scope of the project.',
    modal: {
      title: 'Send a request',
      titleDone: 'Thank you',
      desc: 'Leave your name and phone number — we will get in touch.',
      descDone: 'We will be in touch shortly.',
      close: 'Close',
      name: 'Name',
      namePlaceholder: 'Your name',
      phone: 'Phone *',
      phonePlaceholder: '+998 90 123 45 67',
      service: 'Service',
      submit: 'Send',
      sending: 'Sending…',
      phoneError: 'Please enter a valid phone number',
      submitError: 'Something went wrong. Please try again.',
      packageSuffix: 'package',
    },
  },
};

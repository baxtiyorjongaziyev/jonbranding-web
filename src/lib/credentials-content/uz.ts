/**
 * `/credentials` slayd matnlari — O'ZBEK (asosiy til).
 * Uzbek-first: o'zgarish avval shu faylda, keyin ru/en/zh da.
 */

import type { CredentialsCopy } from './types';

export const uz: CredentialsCopy = {
  meta: {
    title: 'Credentials',
    description: 'Jon Branding agentligi taqdimoti: ishlar, xizmatlar, narxlar va ish jarayoni bitta sahifada.',
  },
  nav: {
    cover: 'Muqova',
    clients: 'Mijozlar',
    problem: 'Muammo',
    solution: 'Yechim',
    naming: 'Nomlash',
    services: 'Xizmatlar',
    packages: 'Paketlar',
    process: 'Jarayon',
    guarantees: 'Kafolatlar',
    quote: 'Fikrlar',
    cta: 'Keyingi qadam',
  },
  cover: {
    eyebrow: 'Jon Branding — Taqdimot',
    title: ['Brend — bu ko‘rinish emas.', 'Bu sotuv vositasi.'],
    subtitle:
      'Nom, logo, aydentika, brandbook, qadoq va patent — bitta jamoa, bitta shartnoma. Ishni boshlaymiz, guvohnomani qo‘lingizga beramiz.',
    stats: {
      years: 'yil bozorda',
      clients: 'mijoz',
      projects: 'loyiha',
    },
  },
  clients: {
    eyebrow: 'Kimlar bilan ishladik',
    title: 'Bizga ishongan brendlar',
  },
  problem: {
    eyebrow: 'Tanish holat',
    title: 'Mahsulotingiz yaxshi. Lekin buni hech kim bilmaydi.',
  },
  solution: {
    eyebrow: 'Biz bilan ishlagandan keyin',
    title: 'Nima o‘zgaradi',
  },
  naming: {
    eyebrow: 'Neyming · Nom ishlab chiqish',
    title: 'Bozorga kiritgan va patentlangan nomlarimiz',
    intro:
      'Nom — brendning bir umrlik poydevori. Biz ishlab chiqqan har bir nom 100% patentdan o‘tadi, xaridor ongida esda qoladi va sotuvga xizmat qiladi.',
    fields: {
      SAVOD: 'Ta’lim & O‘quv markazi',
      SHIRONA: 'Kafe & Novvoyxona',
      FIDDA: 'Zargarlik brendi',
      REVO: 'Fintex & Biznes',
      PETRON: 'Polimer & Sanoat',
      ZAYYAN: 'Savdo & Distribyutsiya',
      GEONEST: 'Muhandislik & Geodeziya',
      RUTERA: 'Logistika & Transport',
      SOFMIR: 'Mebel aksessuarlari',
      ARFADEL: 'Selektiv parfyumeriya',
      ENROS: 'Texnologik servis',
      BELIF: 'Kosmetika & Go‘zallik',
      UNVAN: 'Yuridik konsalting',
      PARFINO: 'Parfyumeriya tarmog‘i',
      ESTEM: 'Stomatologiya & Tibbiyot',
      MERCATO: 'Chakana savdo',
      MELAMUS: 'Qandolat mahsulotlari',
      POLENTRA: 'Ishlab chiqarish',
      VITON: 'Farmatsevtika',
    },
    facts: [
      { value: '100%', label: 'Patentga toza tekshiruv (IMA bazasi)' },
      { value: '.uz / .com', label: 'Domen va username mavjudligi' },
      { value: '10 kun', label: 'Nom ishlab chiqish va taqdimot muddati' },
    ],
  },
  cases: {
    eyebrow: 'Keys',
    fallbackCategory: 'Brending',
  },
  services: {
    eyebrow: 'Xizmatlar — narxlarimiz ochiq',
  },
  packages: {
    eyebrow: 'Paketlar',
    title: 'Birga olinsa arzonroq',
    cta: 'Shu paketni tanlash',
    note: 'Muddatlar dizayn ishlariga tegishli. Patent guvohnomasi alohida: oddiy tartibda 7 oy, tezkorda 20–40 kun.',
  },
  process: {
    eyebrow: 'Qanday ishlaymiz',
    title: 'To‘rt bosqich. Har birida siz tasdiqlaysiz.',
    paymentLabel: 'To‘lov bosqichma-bosqich:',
  },
  guarantees: {
    eyebrow: 'Shartnomada yoziladi',
    title: 'Xavfni o‘zimiz olamiz',
  },
  quote: {
    eyebrow: 'Mijoz fikri',
  },
  cta: {
    eyebrow: 'Keyingi qadam',
    title: ['Qaysi paket sizga', 'to‘g‘ri kelishini', 'birga aniqlaymiz'],
    subtitle:
      'Qisqa suhbat: biznesingizni so‘raymiz, nima kerakligini va qancha turishini aytamiz. Majburiyatsiz.',
    button: 'Ariza qoldirish',
  },
};

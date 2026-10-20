import { defineType, defineField } from 'sanity'

export const REEL_LANGS = ['uz', 'ru', 'en', 'zh'] as const
export const REEL_STATUSES = ['none', 'draft', 'approved', 'scheduled', 'published', 'rejected'] as const
export type ReelStatus = (typeof REEL_STATUSES)[number]
const REEL_STATUS_TITLES: Record<ReelStatus, string> = {
  none: "Yo'q",
  draft: 'Render qilindi — tasdiq kutilmoqda',
  approved: 'Egasi tasdiqladi',
  scheduled: 'Rejalashtirildi',
  published: 'Chiqarildi',
  rejected: 'Rad etildi',
}

export const portfolio = defineType({
  name: 'portfolio',
  title: 'Portfolio Loyihalar',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Loyiha nomi',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Mijoz nomi',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Kategoriya',
      type: 'string',
      options: {
        list: [
          { title: 'Brend-strategiya', value: 'brand-strategy' },
          { title: 'Logotip dizayni', value: 'logo-design' },
          { title: 'Brendbuk', value: 'brandbook' },
          { title: 'Firma uslubi', value: 'corporate-style' },
          { title: 'Qadoq dizayni', value: 'packaging' },
          { title: 'Neyming', value: 'naming' },
        ],
      },
    }),
    defineField({
      name: 'city',
      title: 'Shahar',
      type: 'string',
    }),
    defineField({
      name: 'industry',
      title: 'Soha',
      type: 'string',
      options: {
        list: [
          { title: 'Oziq-ovqat', value: 'food' },
          { title: 'FMCG', value: 'fmcg' },
          { title: 'Fintech', value: 'fintech' },
          { title: 'Moda', value: 'fashion' },
        ],
      },
    }),
    defineField({
      name: 'tags',
      title: 'Teglar',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'coverImage',
      title: 'Muqova rasmi',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'beforeImage',
      title: 'Oldin (before)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'afterImage',
      title: 'Keyin (after)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'galleryImages',
      title: 'Galereya rasmlari',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'description',
      title: 'Qisqa tavsif',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'body',
      title: 'Case Study (to\'liq matn)',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'metaTitle',
      title: 'SEO sarlavha (meta title)',
      description: '60 belgigacha — qidiruv natijalarida sahifa nomi sifatida chiqadi',
      type: 'string',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'metaDescription',
      title: 'SEO tavsif (meta description)',
      description: '150-160 belgi — qidiruv natijalarida sahifa tavsifi sifatida chiqadi',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(180),
    }),
    defineField({
      name: 'seoKeywords',
      title: 'SEO kalit so\'zlar',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'results',
      title: 'Natijalar',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'metric', title: 'Ko\'rsatkich', type: 'string' },
          { name: 'value', title: 'Qiymat', type: 'string' },
          { name: 'sourceUrl', title: 'Dalil manbasi URL', type: 'url' },
          { name: 'period', title: 'Natija davri', type: 'string' },
          { name: 'approved', title: 'Dalil tekshirildi va nashr tasdiqlandi', type: 'boolean', initialValue: false },
        ]
      }],
    }),
    defineField({
      name: 'featured',
      title: 'Featured (bosh sahifada ko\'rsat)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Tartib raqami',
      type: 'number',
    }),
    defineField({
      name: 'googleDriveFolderId',
      title: 'Google Drive Folder ID',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Chiqarilgan sana',
      type: 'datetime',
    }),    // Reels Zavodi (docs/reels-factory/PRD.md, F-04). Ixtiyoriy — mavjud keyslarga ta'sir qilmaydi.
    // Holatni faqat egasi "approved"ga o'tkazadi; avtomatika faqat draft yozadi.
    defineField({
      name: 'reel',
      title: 'Reels (avtomat video)',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        {
          name: 'status',
          title: 'Holat',
          type: 'string',
          initialValue: 'none',
          options: {
            list: REEL_STATUSES.map((value) => ({ value, title: REEL_STATUS_TITLES[value] })),
            layout: 'radio',
          },
        },
        {
          name: 'videos',
          title: 'Render qilingan videolar',
          type: 'object',
          fields: REEL_LANGS.map((lang) => ({ name: lang, title: lang.toUpperCase(), type: 'url' })),
        },
        { name: 'renderedAt', title: 'Render sanasi', type: 'datetime', readOnly: true },
        { name: 'scheduledAt', title: 'Rejadagi chiqish vaqti', type: 'datetime' },
        { name: 'postUrl', title: 'Instagram post havolasi', type: 'url' },
        { name: 'note', title: 'Izoh (masalan, "Qayta" sababi)', type: 'text', rows: 2 },
      ],
    }),
  ],
  orderings: [
    { title: 'Tartib bo\'yicha', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
    { title: 'Yangi avval', name: 'dateDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'client',
      media: 'coverImage',
    },
  },
})

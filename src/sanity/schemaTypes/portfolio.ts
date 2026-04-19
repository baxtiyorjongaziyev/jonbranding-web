import { defineType, defineField } from 'sanity'

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
      name: 'results',
      title: 'Natijalar',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'metric', title: 'Ko\'rsatkich', type: 'string' },
          { name: 'value', title: 'Qiymat', type: 'string' },
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
      name: 'publishedAt',
      title: 'Chiqarilgan sana',
      type: 'datetime',
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

import { defineType, defineField } from 'sanity';

export const brand = defineType({
  name: 'brand',
  title: 'Brand / Mijoz',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nomi',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo (Sanity Asset)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'logoUrl',
      title: 'Logo URL (tashqi CDN)',
      type: 'url',
    }),
    defineField({
      name: 'hiddenInHero',
      title: 'Hero da yashirin',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Tartib raqami',
      type: 'number',
      initialValue: 99,
    }),
  ],
  orderings: [
    {
      title: 'Tartib bo\'yicha',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'name', media: 'logo' },
  },
});

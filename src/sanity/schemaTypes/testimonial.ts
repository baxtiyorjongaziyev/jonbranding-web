import { defineType, defineField } from 'sanity';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial / Mijoz izohi',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Ism',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar initials (masalan: IM)',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Rasm',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'imageHint',
      title: 'Rasm tavsifi (alt text hint)',
      type: 'string',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL (Vimeo)',
      type: 'url',
    }),
    defineField({
      name: 'audioUrl',
      title: 'Audio fayl yo\'li (/audio/...)',
      type: 'string',
    }),
    defineField({
      name: 'company',
      title: 'Kompaniya (barcha tillarda)',
      type: 'object',
      fields: [
        defineField({ name: 'uz', title: 'O\'zbekcha', type: 'string' }),
        defineField({ name: 'ru', title: 'Ruscha', type: 'string' }),
        defineField({ name: 'en', title: 'Inglizcha', type: 'string' }),
        defineField({ name: 'zh', title: 'Xitoycha', type: 'string' }),
      ],
    }),
    defineField({
      name: 'quote',
      title: 'Iqtibos (barcha tillarda)',
      type: 'object',
      fields: [
        defineField({ name: 'uz', title: 'O\'zbekcha', type: 'text' }),
        defineField({ name: 'ru', title: 'Ruscha', type: 'text' }),
        defineField({ name: 'en', title: 'Inglizcha', type: 'text' }),
        defineField({ name: 'zh', title: 'Xitoycha', type: 'text' }),
      ],
    }),
    defineField({
      name: 'order',
      title: 'Tartib raqami',
      type: 'number',
      initialValue: 99,
    }),
    defineField({
      name: 'featured',
      title: 'Tanlangan (featured)',
      type: 'boolean',
      initialValue: false,
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
    select: { title: 'name', subtitle: 'company.uz', media: 'image' },
  },
});

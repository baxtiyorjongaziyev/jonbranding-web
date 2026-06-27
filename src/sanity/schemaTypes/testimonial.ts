import { defineField, defineType } from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial / Mijoz sharhi',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Ism', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'avatar', title: 'Avatar (initials fallback)', type: 'string' }),
    defineField({ name: 'image', title: 'Rasm', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'imageHint', title: 'Rasm tavsifi', type: 'string' }),
    defineField({ name: 'videoUrl', title: 'Video URL', type: 'url' }),
    defineField({ name: 'audioUrl', title: 'Audio URL', type: 'string' }),
    defineField({
      name: 'audioFile',
      title: 'Audio fayl (yuklash)',
      type: 'file',
      options: { accept: 'audio/*' }
    }),
    defineField({
      name: 'videoFile',
      title: 'Video fayl (yuklash)',
      type: 'file',
      options: { accept: 'video/*' }
    }),
    defineField({
      name: 'company',
      title: 'Kompaniya (ko\'p tilli)',
      type: 'object',
      fields: [
        defineField({ name: 'uz', title: 'O\'zbek', type: 'string' }),
        defineField({ name: 'ru', title: 'Rus', type: 'string' }),
        defineField({ name: 'en', title: 'Ingliz', type: 'string' }),
        defineField({ name: 'zh', title: 'Xitoy', type: 'string' }),
      ],
    }),
    defineField({
      name: 'quote',
      title: 'Sharh (ko\'p tilli)',
      type: 'object',
      fields: [
        defineField({ name: 'uz', title: 'O\'zbek', type: 'text' }),
        defineField({ name: 'ru', title: 'Rus', type: 'text' }),
        defineField({ name: 'en', title: 'Ingliz', type: 'text' }),
        defineField({ name: 'zh', title: 'Xitoy', type: 'text' }),
      ],
    }),
    defineField({
      name: 'rating',
      title: 'Reyting (1-5 yulduz)',
      type: 'number',
      initialValue: 5,
      validation: (r) => r.min(1).max(5),
    }),
    defineField({ name: 'order', title: 'Tartib raqami', type: 'number', initialValue: 99 }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
  ],
  preview: { select: { title: 'name', subtitle: 'company.uz', media: 'image' } },
})

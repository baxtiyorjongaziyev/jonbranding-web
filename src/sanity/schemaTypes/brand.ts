import { defineField, defineType } from 'sanity'

export const brand = defineType({
  name: 'brand',
  title: 'Brand / Mijoz Logo',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Brand nomi', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'logo', title: 'Logo (rasm)', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'logoUrl', title: 'Logo URL (alternative)', type: 'url' }),
    defineField({ name: 'hiddenInHero', title: 'Hero sectionda yashirish', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', title: 'Tartib raqami', type: 'number', initialValue: 99 }),
  ],
  preview: { select: { title: 'name', media: 'logo' } },
})

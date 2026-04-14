import { defineType, defineField } from 'sanity'

export const comparison = defineType({
  name: 'comparison',
  title: 'Before & After',
  type: 'document',
  fields: [
    defineField({
      name: 'brand',
      title: 'Brand Name',
      type: 'string',
    }),
    defineField({
      name: 'oldImg',
      title: 'Old Image',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'newImg',
      title: 'New Image',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'oldHint',
      title: 'Old Image Hint',
      type: 'string',
    }),
    defineField({
      name: 'newHint',
      title: 'New Image Hint',
      type: 'string',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
    })
  ]
})

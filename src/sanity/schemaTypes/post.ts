import { defineType, defineField } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' }
    }),
    defineField({
      name: 'description',
      title: 'Direct answer / meta description',
      type: 'text',
      description: 'Answer the main query directly in 1–2 concise sentences.',
      validation: (rule) => rule.required().min(70).max(220),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      initialValue: 'Baxtiyorjon Gaziyev',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'keywords',
      title: 'Topics and entities',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }]
    }),
    defineField({
      name: 'image',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'sources',
      title: 'Sources',
      description: 'Add only primary or authoritative sources that support article claims.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Source title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'Source URL',
              type: 'url',
              validation: (rule) => rule.required().uri({ scheme: ['http', 'https'] }),
            }),
            defineField({
              name: 'publisher',
              title: 'Publisher',
              type: 'string',
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'publisher' },
          },
        },
      ],
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          { title: 'Uzbek', value: 'uz' },
          { title: 'Russian', value: 'ru' },
          { title: 'English', value: 'en' },
          { title: 'Chinese', value: 'zh' }
        ]
      }
    })
  ]
})

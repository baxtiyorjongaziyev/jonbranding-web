import { createClient } from 'next-sanity'

export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'h6ymmj0v'
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const SANITY_REVALIDATE_SECONDS = 3600

export const SANITY_TAGS = {
  all: 'sanity',
  portfolio: 'sanity:portfolio',
  testimonials: 'sanity:testimonials',
  comparisons: 'sanity:comparisons',
  brands: 'sanity:brands',
  post: 'sanity:post',
} as const

export const client = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: '2024-04-14',
  useCdn: process.env.NODE_ENV === 'production', // In production, this should be true for faster delivery
})

/** Cached Sanity fetch with shared tag/ISR defaults so webhook revalidation updates pages cleanly. */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  options: { tags?: readonly string[]; revalidate?: number | false } = {},
): Promise<T> {
  const tags = options.tags?.length ? [...options.tags] : [SANITY_TAGS.all]
  const revalidate = options.revalidate ?? SANITY_REVALIDATE_SECONDS
  return client.fetch<T>(query, params, {
    next: { revalidate, tags },
  })
}

import { createImageUrlBuilder } from '@sanity/image-url'

const builder = createImageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

import { createClient } from 'next-sanity'

export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'h6ymmj0v'
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const client = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: '2024-04-14',
  useCdn: process.env.NODE_ENV === 'production', // In production, this should be true for faster delivery
})

import { createImageUrlBuilder } from '@sanity/image-url'

const builder = createImageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

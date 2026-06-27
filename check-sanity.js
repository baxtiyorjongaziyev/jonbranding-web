const { createClient } = require('next-sanity');
const client = createClient({
  projectId: 'h6ymmj0v',
  dataset: 'production',
  apiVersion: '2024-04-14',
  useCdn: false,
});

const LIST_QUERY = `
  *[_type == "portfolio"] | order(order asc, publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    client,
    category,
    city,
    industry,
    tags,
    "coverImage": coverImage.asset->url + "?w=800&q=80",
    "beforeImage": beforeImage.asset->url + "?w=1200&q=85",
    "afterImage": afterImage.asset->url + "?w=1200&q=85",
    description,
    results,
    featured,
    order
  }
`;

async function check() {
  const data = await client.fetch(LIST_QUERY);
  console.log('Items returned:', data.length);
  
  const withCover = data.filter(p => p.coverImage);
  const withoutCover = data.filter(p => !p.coverImage);
  
  console.log('With coverImage:', withCover.length);
  console.log('Without coverImage:', withoutCover.length);
  
  if (withoutCover.length > 0) {
    console.log('\nMISSING coverImage items:');
    withoutCover.forEach(p => console.log('  -', p.title));
  }
  
  // Simulate what fetchPortfolioList does with fallbacks
  console.log('\nFallback items would be added for non-existing slugs');
}

check().catch(e => console.error('ERROR:', e));

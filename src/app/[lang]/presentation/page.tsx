import { client } from '@/sanity/lib/client';
import PresentationClient from './presentation-client';

export const revalidate = 60; // revalidate every minute

export default async function PresentationPage({ params }: { params: { lang: string } }) {
  const lang = (['uz', 'ru', 'en', 'zh'].includes(params.lang) ? params.lang : 'uz');

  // Fetch top 3 portfolio cases
  const query = `*[_type == "portfolio"] | order(order asc)[0...4] {
    title,
    slug,
    mainImage,
    category
  }`;
  
  let portfolioCases = [];
  try {
    portfolioCases = await client.fetch(query);
  } catch (err) {
    console.error("Failed to fetch portfolio cases for presentation:", err);
  }

  return <PresentationClient lang={lang} portfolioCases={portfolioCases} />;
}

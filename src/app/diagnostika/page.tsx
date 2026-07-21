import { redirect } from 'next/navigation';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/**
 * /diagnostika → /uz/diagnostika. Reklama havolalari prefiksiz keladi,
 * shuning uchun ?source= va UTM parametrlari redirectda saqlanadi.
 */
export default async function DiagnosticsRootPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, item));
    } else if (value !== undefined) {
      query.set(key, value);
    }
  }

  const queryString = query.toString();
  redirect(`/uz/diagnostika${queryString ? `?${queryString}` : ''}`);
}

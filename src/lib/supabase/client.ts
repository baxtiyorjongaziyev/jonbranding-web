import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !key) {
    return null;
  }

  try {
    return createBrowserClient(url, key);
  } catch (err) {
    console.warn('Failed to initialize Supabase browser client:', err);
    return null;
  }
}


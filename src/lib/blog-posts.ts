import fs from 'fs';
import path from 'path';
import type { Locale } from '@/lib/i18n/locale';

const POSTS_DIR = path.join(process.cwd(), 'src/posts');
const SUPPORTED_LOCALES = new Set<Locale>(['uz', 'ru', 'en', 'zh']);

export interface BlogPostSlug {
  slug: string;
  lang: Locale;
}

export function getAllPostSlugs(): BlogPostSlug[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && SUPPORTED_LOCALES.has(entry.name as Locale))
    .flatMap((entry) => {
      const lang = entry.name as Locale;
      const localeDir = path.join(POSTS_DIR, lang);

      return fs
        .readdirSync(localeDir, { withFileTypes: true })
        .filter((file) => file.isFile() && file.name.endsWith('.md'))
        .map((file) => ({
          slug: file.name.replace(/\.md$/, ''),
          lang,
        }));
    });
}

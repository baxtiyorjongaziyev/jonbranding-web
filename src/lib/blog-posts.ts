import fs from 'node:fs';
import path from 'node:path';
import { load as loadYaml } from 'js-yaml';
import { Marked } from 'marked';
import type { BlogPost } from '@/lib/types';
import bundledMarkdownIndex from './blog-markdown-index.json';

const postsDirectory = path.join(process.cwd(), 'src/posts');
const postsRoot = path.resolve(postsDirectory);

function resolveLangDirectory(lang: string): string | null {
  switch (lang) {
    case 'uz':
      return path.resolve(postsRoot, 'uz');
    case 'ru':
      return path.resolve(postsRoot, 'ru');
    case 'en':
      return path.resolve(postsRoot, 'en');
    case 'zh':
      return path.resolve(postsRoot, 'zh');
    default:
      return null;
  }
}
type BundledMarkdownSummary = {
  slug: string;
  title: string;
  date: string;
  author: string;
  description: string;
  image: string;
  imageHint: string;
  source: 'markdown';
};
const fallbackMarkdownIndex = bundledMarkdownIndex as Record<string, BundledMarkdownSummary[]>;
const markdown = new Marked({ async: true });

markdown.use({
  renderer: {
    // Repository markdown is trusted, but raw embedded HTML is unnecessary and
    // would create a stored-XSS sink when rendered.
    html() {
      return '';
    },
  },
});

export function sanitizeText(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value !== 'string') return '';
  // Frontmatter is displayed as plain text. Removing each angle bracket
  // independently prevents nested input from reconstructing a tag.
  return value.replace(/[<>]/g, '').trim();
}

function sanitizeUrl(value: unknown): string {
  if (typeof value !== 'string') return '';
  if (/^https?:\/\//i.test(value) || value.startsWith('/')) return value;
  return '';
}

function parseMarkdownFile(fileContents: string): {
  data: Record<string, unknown>;
  content: string;
} {
  if (!fileContents.startsWith('---')) {
    return { data: {}, content: fileContents };
  }

  const endIndex = fileContents.indexOf('\n---', 3);
  if (endIndex === -1) {
    return { data: {}, content: fileContents };
  }

  const frontmatter = fileContents.slice(3, endIndex);
  const parsed = loadYaml(frontmatter);
  const data =
    parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  const content = fileContents.slice(endIndex).replace(/^\n---\r?\n?/, '');

  return { data, content };
}

function processFiles(fileNames: string[], directory: string) {
  const safeDir = path.resolve(directory);
  return fileNames
    .map((fileName) => {
      if (path.basename(fileName) !== fileName || !fileName.endsWith('.md')) {
        return null;
      }
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.resolve(safeDir, fileName);
      if (!fullPath.startsWith(`${safeDir}${path.sep}`)) {
        return null;
      }
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = parseMarkdownFile(fileContents);

      return {
        slug,
        title: sanitizeText(data.title),
        date: sanitizeText(data.date),
        author: sanitizeText(data.author),
        description: sanitizeText(data.description),
        image: sanitizeUrl(data.image),
        imageHint: sanitizeText(data.imageHint),
        source: 'markdown' as const,
      };
    })
    .filter((post): post is NonNullable<typeof post> =>
      Boolean(post && post.title && post.date),
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getSortedPostsData(lang = 'uz') {
  const langDirectory = resolveLangDirectory(lang);
  if (!langDirectory) return [];

  // Cloudflare Workers edge isolates do not expose local src/posts files via fs.
  if (!fs.existsSync(postsRoot)) {
    return fallbackMarkdownIndex[lang] ?? [];
  }

  try {
    const fileNames = fs
      .readdirSync(langDirectory)
      .filter((fileName) => fileName.endsWith('.md'));
    return processFiles(fileNames, langDirectory);
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code === 'ENOENT') return [];
    throw error;
  }
}

export async function getPostData(
  lang: string,
  slug: string,
): Promise<BlogPost | null> {
  const langDirectory = resolveLangDirectory(lang);
  if (!langDirectory) return null;
  if (!/^[a-z0-9][a-z0-9._-]*$/i.test(slug) || slug.includes('..')) {
    return null;
  }

  let files: string[];
  try {
    files = fs.readdirSync(langDirectory);
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code === 'ENOENT') return null;
    throw error;
  }

  const matchedFile = files.find((file) => file === `${slug}.md`);
  if (!matchedFile) return null;

  const fullPath = path.resolve(langDirectory, matchedFile);
  if (!fullPath.startsWith(`${langDirectory}${path.sep}`)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = parseMarkdownFile(fileContents);
  const htmlContent = await markdown.parse(content);

  return {
    slug,
    htmlContent,
    title: sanitizeText(data.title),
    date: sanitizeText(data.date),
    author: sanitizeText(data.author),
    description: sanitizeText(data.description),
    image: sanitizeUrl(data.image),
    imageHint: sanitizeText(data.imageHint),
  };
}

export function getAllPostSlugs(): Array<{ slug: string; lang: string }> {
  if (!fs.existsSync(postsDirectory)) {
    return Object.entries(fallbackMarkdownIndex).flatMap(([lang, posts]) =>
      posts.map((post) => ({ lang, slug: post.slug })),
    );
  }

  return fs
    .readdirSync(postsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .flatMap((entry) => {
      const langDirectory = path.join(postsDirectory, entry.name);
      return fs
        .readdirSync(langDirectory)
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => ({
          lang: entry.name,
          slug: fileName.replace(/\.md$/, ''),
        }));
    });
}

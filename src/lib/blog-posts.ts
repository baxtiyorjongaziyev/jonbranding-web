import fs from 'node:fs';
import path from 'node:path';
import { load as loadYaml } from 'js-yaml';
import { Marked } from 'marked';
import type { BlogPost } from '@/lib/types';

const postsDirectory = path.join(process.cwd(), 'src/posts');
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

function sanitizeText(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value !== 'string') return '';
  return value.replace(/<[^>]*>/g, '').trim();
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
  return fileNames
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(directory, fileName);
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
    .filter((post) => post.title && post.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getSortedPostsData(lang = 'uz') {
  const langDirectory = path.join(postsDirectory, lang);
  if (!fs.existsSync(langDirectory)) return [];

  const fileNames = fs
    .readdirSync(langDirectory)
    .filter((fileName) => fileName.endsWith('.md'));
  return processFiles(fileNames, langDirectory);
}

export async function getPostData(
  lang: string,
  slug: string,
): Promise<BlogPost | null> {
  const fullPath = path.join(postsDirectory, lang, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

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
  if (!fs.existsSync(postsDirectory)) return [];

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

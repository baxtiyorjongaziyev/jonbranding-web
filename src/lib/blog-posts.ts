import fs from 'fs';
import path from 'path';
import { load as loadYaml } from 'js-yaml';
import { Marked } from 'marked';
import { type BlogPost } from '@/lib/types';

const postsDirectory = path.join(process.cwd(), 'src/posts');
const safeMarked = new Marked({
  async: true,
});

safeMarked.use({
  renderer: {
    // Drop any raw HTML embedded inside markdown to avoid stored XSS.
    html() {
      return '';
    },
  },
});

export function getSortedPostsData(lang: string = 'en'): Omit<BlogPost, 'content' | 'htmlContent'>[] {
  const langDirectory = path.join(postsDirectory, lang);
  if (!fs.existsSync(langDirectory)) {
    // Fallback to English if the language directory doesn't exist
    const enDirectory = path.join(postsDirectory, 'en');
     if (!fs.existsSync(enDirectory)) return [];
     const fileNames = fs.readdirSync(enDirectory);
     return processFiles(fileNames, enDirectory);
  }
  
  const fileNames = fs.readdirSync(langDirectory);
  return processFiles(fileNames, langDirectory);
}

function sanitizeText(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value !== 'string') return '';
  // Strip any HTML tags but keep the text human-readable. Do NOT HTML-encode:
  // every consumer renders these values through React/Next metadata, which
  // escape on output. Encoding here caused double-encoding (e.g. O'z -> O&#x27;z
  // shown literally). The one raw-HTML sink (JSON-LD) escapes separately.
  return value.replace(/<[^>]*>/g, '').trim();
}

function sanitizeUrl(value: unknown): string {
  if (typeof value !== 'string') return '';
  if (/^https?:\/\//.test(value) || value.startsWith('/')) return value;
  return '';
}

function parseMarkdownFile(fileContents: string): { data: Record<string, unknown>; content: string } {
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
    const allPostsData = fileNames.map((fileName) => {
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
        };
    });

    return allPostsData.sort((a, b) => {
        if (new Date(a.date) < new Date(b.date)) {
            return 1;
        } else {
            return -1;
        }
    });
}


export async function getPostData(lang: string, slug: string): Promise<BlogPost | null> {
  let fullPath = path.join(postsDirectory, lang, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    // Fallback to English if the post doesn't exist in the current language
    fullPath = path.join(postsDirectory, 'en', `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
        return null;
    }
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = parseMarkdownFile(fileContents);

  const processedContent = await safeMarked.parse(content);

  return {
    slug,
    htmlContent: processedContent,
    title: sanitizeText(data.title),
    date: sanitizeText(data.date),
    author: sanitizeText(data.author),
    description: sanitizeText(data.description),
    image: sanitizeUrl(data.image),
    imageHint: sanitizeText(data.imageHint),
  };
}

export function getAllPostSlugs() {
  const languages = fs.readdirSync(postsDirectory).filter(item => {
    const itemPath = path.join(postsDirectory, item);
    // Check if it's a directory and not a hidden file like .DS_Store
    return fs.statSync(itemPath).isDirectory() && !item.startsWith('.');
  });
  
  const allSlugs: { slug: string, lang: string }[] = [];

  languages.forEach(lang => {
    const langDirectory = path.join(postsDirectory, lang);
    try {
      const fileNames = fs.readdirSync(langDirectory);
      fileNames.forEach(fileName => {
        if (fileName.endsWith('.md')) {
            allSlugs.push({
            lang,
            slug: fileName.replace(/\.md$/, ''),
          });
        }
      });
    } catch (error) {
        console.error(`Could not read directory: ${langDirectory}`, error);
    }
  });

  return allSlugs;
}

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { type BlogPost } from '@/lib/types';

const postsDirectory = path.join(process.cwd(), 'src/posts');

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

function processFiles(fileNames: string[], directory: string) {
    const allPostsData = fileNames.map((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(directory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);

        return {
        slug,
        ...(matterResult.data as {
            title: string;
            date: string;
            author: string;
            description: string;
            image: string;
            imageHint: string;
        }),
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
  const matterResult = matter(fileContents);
  
  const processedContent = await marked(matterResult.content);

  return {
    slug,
    htmlContent: processedContent,
    ...(matterResult.data as {
      title: string;
      date: string;
      author: string;
      description: string;
      image: string;
      imageHint: string;
    }),
  };
}

export function getAllPostSlugs() {
  const languages = fs.readdirSync(postsDirectory).filter(item => fs.statSync(path.join(postsDirectory, item)).isDirectory());
  
  const allSlugs: { slug: string, lang: string }[] = [];

  languages.forEach(lang => {
    const langDirectory = path.join(postsDirectory, lang);
    const fileNames = fs.readdirSync(langDirectory);
    fileNames.forEach(fileName => {
      allSlugs.push({
        lang,
        slug: fileName.replace(/\.md$/, ''),
      });
    });
  });

  return allSlugs;
}

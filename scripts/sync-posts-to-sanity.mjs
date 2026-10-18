import fs from 'fs';
import path from 'path';
import { createClient } from '@sanity/client';
import { load as loadYaml } from 'js-yaml';
import { Marked } from 'marked';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'h6ymmj0v',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2024-04-14',
});

const marked = new Marked({ async: false, breaks: true });
marked.use({ renderer: { html() { return ''; } } });

const POSTS_DIR = path.join(process.cwd(), 'src/posts');
const SUPPORTED_LANGS = ['uz', 'ru', 'en', 'zh'];
const LANG_NAMES = { uz: 'Uzbek', ru: 'Russian', en: 'English', zh: 'Chinese' };

function parseFrontmatter(text) {
  if (!text.startsWith('---')) return { data: {}, content: text };
  const end = text.indexOf('\n---', 3);
  if (end === -1) return { data: {}, content: text };
  return {
    data: (loadYaml(text.slice(3, end)) || {}),
    content: text.slice(end).replace(/^\n---\n?/, ''),
  };
}

function toPortableText(md) {
  const tokens = marked.lexer(md);
  const blocks = [];

  for (const t of tokens) {
    if (t.type === 'heading') {
      blocks.push({ _type: 'block', style: `h${t.depth}`, children: spans(t.tokens), markDefs: defs(t.tokens) });
    } else if (t.type === 'paragraph') {
      blocks.push({ _type: 'block', style: 'normal', children: spans(t.tokens), markDefs: defs(t.tokens) });
    } else if (t.type === 'blockquote') {
      const raw = t.tokens.map(x => x.raw || '').join('').replace(/^>\s?/gm, '').trim();
      blocks.push({ _type: 'block', style: 'blockquote', children: [{ _type: 'span', text: raw, marks: [] }], markDefs: [] });
    } else if (t.type === 'list') {
      for (const item of t.items) {
        const text = item.tokens.filter(x => x.type === 'text' || x.type === 'paragraph')
          .map(x => x.tokens ? x.tokens.map(s => s.raw || s.text || '').join('') : x.raw || x.text || '').join(' ');
        blocks.push({ _type: 'block', style: 'normal', listItem: t.ordered ? 'number' : 'bullet', level: 1, children: [{ _type: 'span', text, marks: [] }], markDefs: [] });
      }
    }
  }
  return blocks;
}

function spans(inline) {
  if (!inline?.length) return [{ _type: 'span', text: '', marks: [] }];
  return inline.flatMap(t => {
    if (t.type === 'link') {
      const childText = t.tokens?.map(s => s.raw || s.text || '').join('') || t.text || '';
      return [{ _type: 'span', text: childText, marks: ['_mark_link'] }];
    }
    if (t.type === 'strong') {
      const childText = t.tokens?.map(s => s.raw || s.text || '').join('') || t.text || '';
      return [{ _type: 'span', text: childText, marks: ['strong'] }];
    }
    if (t.type === 'em') {
      const childText = t.tokens?.map(s => s.raw || s.text || '').join('') || t.text || '';
      return [{ _type: 'span', text: childText, marks: ['em'] }];
    }
    if (t.type === 'text' && t.tokens) {
      return spans(t.tokens);
    }
    return [{ _type: 'span', text: t.raw || t.text || '', marks: [] }];
  });
}

function defs(inline) {
  const out = [];
  if (!inline) return out;
  for (const t of inline) {
    if (t.type === 'link' && t.href) {
      if (!out.find(d => d.href === t.href)) {
        out.push({ _key: `link_${out.length}`, _type: 'link', href: t.href });
      }
    }
    if (t.tokens) out.push(...defs(t.tokens));
  }
  return out;
}

async function run() {
  console.log('Syncing markdown posts to Sanity...\n');

  for (const lang of SUPPORTED_LANGS) {
    const dir = path.join(POSTS_DIR, lang);
    if (!fs.existsSync(dir)) { console.warn(`  [${lang}] no directory`); continue; }

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
    console.log(`  [${lang}] ${files.length} posts`);

    for (const file of files) {
      const slug = file.replace(/\.md$/, '');
      const raw = fs.readFileSync(path.join(dir, file), 'utf8');
      const { data, content } = parseFrontmatter(raw);

      try {
        const existing = await client.fetch(`*[_type == "post" && slug.current == $slug && language == $lang][0]{_id}`, { slug, lang });

        const doc = {
          _type: 'post',
          title: String(data.title || slug),
          slug: { _type: 'slug', current: slug },
          description: String(data.description || ''),
          content: toPortableText(content),
          publishedAt: data.date ? String(data.date) : new Date().toISOString(),
          language: lang,
        };

        if (existing) {
          await client.createOrReplace({ ...doc, _id: existing._id });
          console.log(`    ✅ ${slug} (${lang}) — updated`);
        } else {
          await client.create(doc);
          console.log(`    ✅ ${slug} (${lang}) — created`);
        }
      } catch (e) {
        console.error(`    ❌ ${slug} (${lang}) — ${e.message}`);
      }
    }
  }
  console.log('\nDone!');
}

run();

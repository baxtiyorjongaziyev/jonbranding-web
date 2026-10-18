import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

// Manually load .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line.includes('=') && !line.startsWith('#'))
    .map(line => line.split('=').map(s => s.trim()))
);

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'h6ymmj0v',
  dataset: 'production',
  apiVersion: '2024-03-12',
  token: env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

async function findTeletypeUrls(dir) {
    let urls = new Set();
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            // Skip node_modules and .next
            if (file === 'node_modules' || file === '.next' || file === '.git') continue;
            const nested = await findTeletypeUrls(fullPath);
            nested.forEach(u => urls.add(u));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const matches = content.match(/https:\/\/img\d\.teletype\.in\/files\/[^\s\"']+/g);
            if (matches) {
                matches.forEach(u => urls.add(u));
            }
        }
    }
    return urls;
}

async function migrate() {
  const teletypeUrls = await findTeletypeUrls(path.join(process.cwd(), 'src'));
  console.log(`Found ${teletypeUrls.size} unique Teletype URLs.`);

  let mapping = {};
  if (fs.existsSync('migration-mapping.json')) {
    mapping = JSON.parse(fs.readFileSync('migration-mapping.json', 'utf8'));
  }

  for (const url of teletypeUrls) {
    if (mapping[url]) {
        console.log(`Skipping (already mapped): ${url}`);
        continue;
    }

    try {
      console.log(`Migrating: ${url}...`);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch ${url}`);
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const asset = await client.assets.upload('image', buffer, {
        filename: path.basename(url),
      });

      mapping[url] = asset.url;
      console.log(`Success: ${asset.url}`);
      
      // Save progress incrementally
      fs.writeFileSync('migration-mapping.json', JSON.stringify(mapping, null, 2));
    } catch (error) {
      console.error(`Error migrating ${url}:`, error.message);
    }
  }

  console.log('Migration complete. Mapping saved to migration-mapping.json');
}

migrate();

const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');

// Configuration from environment
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2024-04-14',
});

const targetDir = 'G:\\My Drive\\JonBranding\\Mijozlar\\Avval Hozir';

async function uploadAsset(filePath) {
  console.log(`Uploading asset: ${filePath}`);
  const asset = await client.assets.upload('image', fs.createReadStream(filePath), {
    filename: path.basename(filePath)
  });
  return asset._id;
}

async function run() {
  try {
    const files = fs.readdirSync(targetDir);
    const projects = {};

    // Group files by project name
    files.forEach(file => {
      if (file.toLowerCase().includes('desktop.ini')) return;
      
      const parts = file.split('_');
      if (parts.length < 2) return;
      
      const projectName = parts[0];
      const type = parts[1].split('.')[0].toLowerCase(); // 'avval' or 'hozir'

      if (!projects[projectName]) projects[projectName] = {};
      projects[projectName][type === 'avval' ? 'before' : 'after'] = path.join(targetDir, file);
    });

    console.log('Detected projects:', Object.keys(projects));

    for (const [name, paths] of Object.entries(projects)) {
      if (!paths.before || !paths.after) {
        console.warn(`Skipping ${name}: missing before or after image.`);
        continue;
      }

      console.log(`Processing project: ${name}`);

      // 1. Upload assets
      const beforeId = await uploadAsset(paths.before);
      const afterId = await uploadAsset(paths.after);

      // 2. Create comparison document
      const doc = {
        _type: 'comparison',
        brand: name,
        oldImg: {
          _type: 'image',
          asset: { _type: 'reference', _ref: beforeId }
        },
        newImg: {
          _type: 'image',
          asset: { _type: 'reference', _ref: afterId }
        },
        oldHint: 'AVVAL',
        newHint: 'HOZIR'
      };

      const result = await client.create(doc);
      console.log(`Successfully created comparison for ${name}: ${result._id}`);
    }

    console.log('Migration complete!');
  } catch (error) {
    console.error('Migration failed:', error.message);
  }
}

run();

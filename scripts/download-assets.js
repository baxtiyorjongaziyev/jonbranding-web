const fs = require('fs');
const path = require('path');

const projectRoot = 'C:\\Users\\baxti\\.gemini\\antigravity\\playground\\jonbranding-veb-sayti';
const publicDir = path.join(projectRoot, 'public', 'images', 'cms');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const assets = [
  { url: 'https://img3.teletype.in/files/e2/90/e290fd28-87f2-4175-bc39-f15f945ac215.png', name: 'logo-denaroma.png' },
  { url: 'https://img1.teletype.in/files/06/12/06122643-c462-4c8d-aa63-55a8ca1dca38.jpeg', name: 'founder-portrait.jpeg' },
  { url: 'https://img1.teletype.in/files/81/55/8155bf93-39f5-45b3-b996-55115f926e79.jpeg', name: 'blog-post-hero.jpeg' },
  { url: 'https://img1.teletype.in/files/48/fb/48fbe9e5-c83d-46da-9425-aa8b8b18d501.jpeg', name: 'og-image.jpeg' },
  { url: 'https://img1.teletype.in/files/84/db/84dbe512-edc1-4386-a986-29114e8d8be2.png', name: 'packaging-shelf.png' },
  { url: 'https://img3.teletype.in/files/ae/08/ae08ba83-e433-45a6-8518-9e9973256316.png', name: 'naming-process.png' },
  { url: 'https://img1.teletype.in/files/c1/27/c1276cf1-3338-47ab-a744-193da4049b4d.png', name: 'logo-design-showcase.png' },
  { url: 'https://img2.teletype.in/files/d3/40/d3406311-28bc-4c55-bf19-19aa3f17e306.png', name: 'brand-strategy-chart.png' },
  { url: 'https://img4.teletype.in/files/bd/d7/bdd7f837-5be9-47eb-9a9e-43dafefe5a17.png', name: 'brand-strategy-team.png' },
  { url: 'https://img1.teletype.in/files/84/76/8476f287-2ba0-4164-898a-d2d7c353a27e.jpeg', name: 'corporate-identity.jpeg' },
  { url: 'https://img1.teletype.in/files/88/92/8892f18d-a298-485d-8fe5-7d0444defd89.png', name: 'corporate-process.png' },
  { url: 'https://img2.teletype.in/files/92/3c/923cd394-a437-47e1-86a1-51e1a2a3eb38.png', name: 'logo-icon.png' },
  { url: 'https://images.unsplash.com/photo-1581080247486-57989c1f14ab?q=80&w=1080', name: 'brandbook-guide.jpeg' }
];

async function download(url, dest) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(dest, Buffer.from(buffer));
  console.log(`Downloaded: ${url} -> ${dest}`);
}

async function run() {
  for (const asset of assets) {
    const dest = path.join(publicDir, asset.name);
    try {
      await download(asset.url, dest);
    } catch (err) {
      console.error(`Error downloading ${asset.name}:`, err.message);
    }
  }
}

run();

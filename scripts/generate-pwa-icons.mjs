import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

// Render the existing brand vector directly: no upscaling or transparent app tiles.
const source = await readFile(new URL('../public/icon.svg', import.meta.url), 'utf8');
const paths = source.match(/<path\b[\s\S]*?<\/path>|<path\b[^>]*\/>/g)?.join('\n');
if (!paths) throw new Error('Brand vector paths missing');
const svg = (maskable) => {
  const box = maskable ? '-75.87 -91.38 873.92 873.92' : '46.83 31.32 628.52 628.52';
  const [x, y, size] = box.split(' ');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}" role="img" aria-label="Jon Branding"><rect x="${x}" y="${y}" width="${size}" height="${size}" fill="#F2EFE6"/>${paths}</svg>\n`;
};
for (const [name, size, maskable] of [
  ['icon-192', 192, false], ['icon-512', 512, false],
  ['icon-maskable-192', 192, true], ['icon-maskable-512', 512, true],
  ['apple-touch-icon', 180, false],
]) {
  const png = await sharp(Buffer.from(svg(maskable))).resize(size, size).removeAlpha().png().toBuffer();
  await writeFile(new URL(`../public/${name}.png`, import.meta.url), png);
  // New URLs let browsers discover the corrected icon without stale image caches.
  await writeFile(new URL(`../public/${name}-v2.png`, import.meta.url), png);
}
await writeFile(new URL('../public/icon.svg', import.meta.url), svg(false));
await writeFile(new URL('../public/icon-v2.svg', import.meta.url), svg(false));
console.info('PWA icons rendered from brand vector with opaque cream background.');

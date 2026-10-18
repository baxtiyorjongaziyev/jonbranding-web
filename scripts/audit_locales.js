const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/locales');
const files = ['uz.json', 'ru.json', 'en.json', 'zh.json'];

const loadedData = {};
files.forEach(f => {
  const filePath = path.join(localesDir, f);
  loadedData[f] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
});

function getAllKeys(d, prefix = '') {
  let keys = [];
  for (const k in d) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    keys.push(fullKey);
    if (d[k] && typeof d[k] === 'object' && !Array.isArray(d[k])) {
      keys = keys.concat(getAllKeys(d[k], fullKey));
    }
  }
  return keys;
}

const keySets = {};
files.forEach(f => {
  keySets[f] = new Set(getAllKeys(loadedData[f]));
});

console.log('--- LOCALIZATION AUDIT REPORT ---');
const baseFile = 'uz.json';
const baseSet = keySets[baseFile];
console.log(`Base locale: ${baseFile} with ${baseSet.size} total keys.`);

files.forEach(f => {
  if (f === baseFile) return;
  const targetSet = keySets[f];
  
  const missing = [...baseSet].filter(x => !targetSet.has(x));
  const extra = [...targetSet].filter(x => !baseSet.has(x));
  
  console.log(`\nLocale: ${f}`);
  console.log(`- Total keys: ${targetSet.size}`);
  console.log(`- Missing keys relative to ${baseFile}: ${missing.length}`);
  if (missing.length > 0) {
    console.log(`  First 10 missing keys:`);
    missing.slice(0, 10).forEach(k => console.log(`    * ${k}`));
  }
  console.log(`- Extra keys relative to ${baseFile}: ${extra.length}`);
  if (extra.length > 0) {
    console.log(`  First 10 extra keys:`);
    extra.slice(0, 10).forEach(k => console.log(`    * ${k}`));
  }
});

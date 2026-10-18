const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/locales');
const files = ['uz.json', 'ru.json', 'en.json', 'zh.json'];

const data = {};
files.forEach(f => {
  data[f] = JSON.parse(fs.readFileSync(path.join(localesDir, f), 'utf8'));
});

function getLeafNodes(obj, prefix = '', res = {}) {
  for (const k in obj) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (obj[k] && typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
      getLeafNodes(obj[k], fullKey, res);
    } else {
      res[fullKey] = obj[k];
    }
  }
  return res;
}

const leafNodes = {};
files.forEach(f => {
  leafNodes[f] = getLeafNodes(data[f]);
});

console.log('--- TRANSLATION QUALITY AUDIT ---');

// Check Chinese vs English
const zhLeaves = leafNodes['zh.json'];
const enLeaves = leafNodes['en.json'];
const uzLeaves = leafNodes['uz.json'];

let untranslatedZhCount = 0;
const untranslatedZhKeys = [];

for (const key in zhLeaves) {
  const zhVal = zhLeaves[key];
  const enVal = enLeaves[key];
  
  if (typeof zhVal === 'string' && zhVal.trim() !== '') {
    // If Chinese value equals English value and contains no Chinese characters (range \u4e00-\u9fa5)
    // AND is longer than 5 chars (to avoid short numbers/brand names like 'Jon.Branding')
    const hasChinese = /[\u4e00-\u9fa5]/.test(zhVal);
    const hasEnglish = /[a-zA-Z]/.test(zhVal);
    
    if (zhVal === enVal && !hasChinese && zhVal.length > 5 && !['link', 'url', 'href', 'slug', 'image', 'vimeo', 'id'].some(p => key.toLowerCase().includes(p))) {
      untranslatedZhCount++;
      untranslatedZhKeys.push({ key, value: zhVal });
    }
  }
}

console.log(`\nChinese (zh.json) Untranslated Keys (matching English, no Chinese characters, length > 5): ${untranslatedZhCount} keys`);
if (untranslatedZhCount > 0) {
  console.log(`First 15 examples:`);
  untranslatedZhKeys.slice(0, 15).forEach(x => {
    console.log(`  * ${x.key} => "${x.value}"`);
  });
} else {
  console.log(`  ✓ All keys seem to have Chinese character content or represent appropriate values.`);
}

// Let's check if there are empty or placeholder values in any locale
files.forEach(f => {
  let emptyCount = 0;
  const emptyKeys = [];
  const leaves = leafNodes[f];
  for (const key in leaves) {
    const val = leaves[key];
    if (val === '' || val === null || val === undefined) {
      emptyCount++;
      emptyKeys.push(key);
    }
  }
  console.log(`\nLocale: ${f} - Empty/Null values: ${emptyCount}`);
  if (emptyCount > 0) {
    emptyKeys.slice(0, 10).forEach(k => console.log(`  * ${k}`));
  }
});

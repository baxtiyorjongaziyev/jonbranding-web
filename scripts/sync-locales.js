const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/locales');
const baseFile = path.join(localesDir, 'ru.json');
const otherLocales = ['uz.json', 'en.json', 'zh.json'];

const ruData = JSON.parse(fs.readFileSync(baseFile, 'utf8'));

function deepMerge(target, source) {
    for (const key in source) {
        if (source[key] instanceof Object && key in target) {
            deepMerge(target[key], source[key]);
        } else if (!(key in target)) {
            target[key] = source[key];
        }
    }
    return target;
}

otherLocales.forEach(file => {
    const filePath = path.join(localesDir, file);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(ruData, null, 4));
        console.log(`Created ${file}`);
        return;
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const merged = deepMerge(data, ruData);
    
    // Sort keys to match ru.json order if possible (simple version)
    const sortedMerged = {};
    Object.keys(ruData).forEach(key => {
        if (merged[key]) sortedMerged[key] = merged[key];
    });

    fs.writeFileSync(filePath, JSON.stringify(merged, null, 4));
    console.log(`Synced ${file}`);
});

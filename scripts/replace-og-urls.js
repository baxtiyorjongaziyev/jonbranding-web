const fs = require('fs');
const path = require('path');

const projectRoot = 'C:\\Users\\baxti\\.gemini\\antigravity\\playground\\jonbranding-veb-sayti';
const srcApp = path.join(projectRoot, 'src', 'app');

const targetUrl = 'https://img1.teletype.in/files/48/fb/48fbe9e5-c83d-46da-9425-aa8b8b18d501.jpeg?v=2';
const replacementPath = '/images/cms/og-image.jpeg';

function walk(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walk(filePath);
    } else if (file === 'layout.tsx' || file === 'page.tsx') {
      let content = fs.readFileSync(filePath, 'utf8');
      if (content.includes(targetUrl)) {
        content = content.split(targetUrl).join(replacementPath);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
      }
    }
  });
}

walk(srcApp);
console.log('Replacement complete.');

const https = require('https');
const fs = require('fs');
const path = require('path');

const targetDir = 'G:\\My Drive\\JonBranding\\Mijozlar\\Avval Hozir';

const images = [
    { name: 'Fidda_Avval.jpeg', url: 'https://img2.teletype.in/files/9c/66/9c66a85f-486c-4f54-9682-fb4838061ab2.jpeg' },
    { name: 'Fidda_Hozir.png', url: 'https://img1.teletype.in/files/c1/27/c1276cf1-3338-47ab-a744-193da4049b4d.png' },
    { name: 'Boyarin_Avval.jpeg', url: 'https://img1.teletype.in/files/83/47/83479180-eeb6-4e39-9169-c4f4fb22e375.jpeg' },
    { name: 'Boyarin_Hozir.png', url: 'https://img2.teletype.in/files/17/9c/179c7811-8cf7-4ee9-87ad-66709208b115.png' },
    { name: 'Savod_Avval.png', url: 'https://img2.teletype.in/files/55/fe/55fe2252-db0f-4fd2-8ee8-d674bffab68a.png' },
    { name: 'Savod_Hozir.png', url: 'https://img2.teletype.in/files/dc/5c/dc5cd481-115e-4d57-ac2a-3ea3142e5f54.png' }
];

async function download(url, name) {
    const dest = path.join(targetDir, name);
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded: ${name}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

(async () => {
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }
    for (const img of images) {
        try {
            await download(img.url, img.name);
        } catch (e) {
            console.error(`Failed to download ${img.name}:`, e.message);
        }
    }
    console.log('All downloads finished.');
})();

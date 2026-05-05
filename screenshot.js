const puppeteer = require('puppeteer');

(async () => {
    try {
        console.log('Launching browser...');
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({width: 1920, height: 1080});
        console.log('Navigating to http://localhost:9005/uz...');
        await page.goto('http://localhost:9005/uz', {waitUntil: 'networkidle2'});
        
        console.log('Taking screenshot...');
        await page.screenshot({path: 'C:\\Users\\baxti\\.gemini\\antigravity\\brain\\1da1d1a2-117c-4321-99a7-683333a62dc4\\artifacts\\current_homepage.png', fullPage: true});
        
        await browser.close();
        console.log('Screenshot saved.');
    } catch (e) {
        console.error('Error:', e);
    }
})();

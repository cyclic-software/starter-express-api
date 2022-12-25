const puppeteer = require('puppeteer');

(async () => {
    // const browser = await puppeteer.launch({executablePath: '/usr/bin/chromium-browser'});
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const ONE_SEC_IN_MS = 1000;

    page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36')
    await page.goto('https://www.mage.space/');

    await page.type('#search-bar', 'car');

    await page.click('.icon-tabler-arrow-right');

    setTimeout(async () => {
        await page.screenshot({ path: 'test.png' });

        const IMAGE_SELECTOR = `#mantine-R3bm-body > div > div.mantine-Container-root.mantine-bpygq5 > div > div.mantine-1avyp1d > div > figure > div > img`

        let imageHref = await page.evaluate((sel) => {
            return document.querySelector(sel).getAttribute('src').replace('/', '');
        }, IMAGE_SELECTOR);

        console.log(imageHref);
        await browser.close();
    }, 45 * ONE_SEC_IN_MS);

})();
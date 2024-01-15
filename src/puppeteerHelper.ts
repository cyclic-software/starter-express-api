// your-project-name/src/puppeteerHelper.ts
import puppeteer from 'puppeteer';

async function scrapeTextFromPage(url: string): Promise<string> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);

    // Customize the following code based on the structure of the webpage
    const scrapedText = await page.evaluate(() => {
        // Example: Extract text from all paragraphs on the page
        const paragraphs = document.querySelectorAll('p');
        return Array.from(paragraphs, (p) => p.textContent).join('\n');
    });

    await browser.close();
    return scrapedText;
}

export { scrapeTextFromPage };

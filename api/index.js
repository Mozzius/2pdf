const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

const getPDF = (url) => {
    const browser = await puppeteer.launch({
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless,
    });

    const page = await browser.newPage();
    await page.goto(url);
    const file = await page.pdf();
    await browser.close();
    return file;
}

module.exports = async (req, res) => {
    const { pathname = '/' } = parse(req.url, true);
    let url = pathname.slice(1);
    if (!url.startsWith('http')) {
        url = 'https://' + url;
    }
    const pdf = await getPDF(url);
    const stream = await pdf.toStream();
    res.statusCode = 200;
    res.set('Content-type', 'application/pdf');
    stream.pipe(res)
};
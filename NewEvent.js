const puppeteer = require("puppeteer");
const chromium = require("chrome-aws-lambda");

async function checkRunner(viewPortWidth, viewPortHeight) {
  const exPath = await chromium.executablePath;
  if (!exPath) {
    return puppeteer.launch({
      headless: true,
      visible: false,
      defaultViewport: { width: viewPortWidth, height: viewPortHeight },
      args: [
        "--no-sandbox",
        "--proxy-server='direct://'",
        "--proxy-bypass-list=*",
      ],
      ignoreDefaultArgs: ["--disable-extensions"],
      ignoreHTTPSErrors: true,
    });
  }

  return (browser = await chromium.puppeteer.launch({
    args: [
      ...chromium.args,
      "--hide-scrollbars",
      "--disable-web-security",
      "--proxy-server='direct://'",
      "--proxy-bypass-list=*",
    ],
    defaultViewport: { width: viewPortWidth, height: viewPortHeight },
    executablePath: await chromium.executablePath,
    headless: false,
    visible: false,
    ignoreDefaultArgs: ["--disable-extensions"],
    ignoreHTTPSErrors: true,
  }));
}

module.exports = checkRunner;

// if (!chromePath) {
//   browser = await puppeteer.launch({
//     headless: true,
//     visible: false,
//     defaultViewport: {
//       width: viePortData.width,
//       height: viePortData.height,
//     },
//     args: ["--no-sandbox"],
//     ignoreDefaultArgs: ["--disable-extensions"],
//   });
// }

// if (chromePath) {
//   browser = await chromium.puppeteer.launch({
//     args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
//     defaultViewport: chromium.defaultViewport,
//     executablePath: await chromium.executablePath,
//     headless: true,
//     ignoreHTTPSErrors: true,
//   });
// }

// browser = await puppeteer.launch({
//   headless: true,
//   visible: false,
//   defaultViewport: { width: viePortData.width, height: viePortData.height },
//   args: ["--no-sandbox"],
//   ignoreDefaultArgs: ["--disable-extensions"],
//   executablePath: puppeteer.executablePath(),
// });

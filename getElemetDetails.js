const checkRunner = require("./NewEvent");

async function getElementDetails(url, selector, viewPortWidth, viewPortHeight) {
  let viePortData = {
    width: parseInt(viewPortWidth),
    height: parseInt(viewPortHeight),
  };

  const browser = await checkRunner(viePortData.width, viePortData.height);

  const page = await browser.newPage({ timeout: 3000 });
  await page.setDefaultNavigationTimeout(3000);
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36"
  );
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 0 });
  // await page.waitForSelector(selector);

  await page.setRequestInterception(true);

  page.on("request", (req) => {
    if (req.resourceType() === "stylesheet") {
      req.continue();
    } else {
      req.abort();
    }
  });

  try {
    if (selector?.slice(selector.indexOf(" ") + 1) === "p") {
      let eleDetails;

      eleDetails = await page.evaluate((selector) => {
        const elements = Array.from(document.querySelectorAll(selector));
        return elements.map((element) => {
          const styles = window.getComputedStyle(element);

          const obj = {
            elementDetails: element?.innerText,
            color: styles.getPropertyValue("color"),
            backgroundColor: styles.getPropertyValue("background-color"),
            fontSize: styles.getPropertyValue("font-size"),
            lineHeight: styles.getPropertyValue("line-height"),
            fontFamily: styles.getPropertyValue("font-family"),
            padding: styles.getPropertyValue("padding"),
            margin: styles.getPropertyValue("margin"),
            letterSpacing: styles.getPropertyValue("letter-spacing"),
            fontWidth: styles.getPropertyValue("font-weight"),
            textIndent: styles.getPropertyValue("text-indent"),
          };
          return obj;
        });
      }, selector);

      await browser.close();
      return eleDetails;
    } else if (selector?.slice(selector.indexOf(" ") + 1) === "div") {
      const eleDetails = await page.evaluate((selector) => {
        const elements = Array.from(document.querySelectorAll(selector));
        return elements.map((element) => {
          const styles = window.getComputedStyle(element);
          const classDetails = element?.getAttribute("class");
          const idDetails = element?.getAttribute("id");
          const obj = {
            elementDetails: element?.innerText,
            idDetail: idDetails,
            classes: classDetails,
            backgroundColor: styles.getPropertyValue("background-color"),
            backgroundImage: styles.getPropertyValue("background-image"),
            border: styles.getPropertyValue("border"),
            borderRadius: styles.getPropertyValue("border-radius"),
            height: styles.getPropertyValue("height"),
            width: styles.getPropertyValue("width"),
            maxHeight: styles.getPropertyValue("max-height"),
            maxWidth: styles.getPropertyValue("max-width"),
            minWidth: styles.getPropertyValue("min-width"),
            minHeight: styles.getPropertyValue("min-height"),
            margin: styles.getPropertyValue("margin"),
            padding: styles.getPropertyValue("padding"),
          };
          return obj;
        });
      }, selector);
      await browser.close();
      return eleDetails;
    } else if (selector?.slice(selector.indexOf(" ") + 1) === "li") {
      const eleDetails = await page.evaluate((selector) => {
        const elements = Array.from(document.querySelectorAll(selector));
        return elements.map((element) => {
          const styles = window.getComputedStyle(element);

          const obj = {
            elementDetails: element?.innerText,
            color: styles.getPropertyValue("color"),
            backgroundColor: styles.getPropertyValue("background-color"),
            fontSize: styles.getPropertyValue("font-size"),
            lineHeight: styles.getPropertyValue("line-height"),
            fontFamily: styles.getPropertyValue("font-family"),
            padding: styles.getPropertyValue("padding"),
            margin: styles.getPropertyValue("margin"),
            letterSpacing: styles.getPropertyValue("letter-spacing"),
            fontWidth: styles.getPropertyValue("font-weight"),
            textIndent: styles.getPropertyValue("text-indent"),
            listStyle: styles.getPropertyValue("list-style"),
          };
          return obj;
        });
      }, selector);
      await browser.close();
      return eleDetails;
    } else if (selector?.slice(selector.indexOf(" ") + 1) === "ul") {
      const eleDetails = await page.evaluate((selector) => {
        const elements = Array.from(document.querySelectorAll(selector));
        return elements.map((element) => {
          const styles = window.getComputedStyle(element);

          const obj = {
            elementDetails: element?.innerText,
            color: styles.getPropertyValue("color"),
            backgroundColor: styles.getPropertyValue("background-color"),
            fontSize: styles.getPropertyValue("font-size"),
            lineHeight: styles.getPropertyValue("line-height"),
            fontFamily: styles.getPropertyValue("font-family"),
            padding: styles.getPropertyValue("padding"),
            margin: styles.getPropertyValue("margin"),
            letterSpacing: styles.getPropertyValue("letter-spacing"),
            fontWidth: styles.getPropertyValue("font-weight"),
            textIndent: styles.getPropertyValue("text-indent"),
          };
          return obj;
        });
      }, selector);
      await browser.close();
      return eleDetails;
    } else if (selector?.slice(selector.indexOf(" ") + 1) === "a") {
      const eleDetails = await page.evaluate((selector) => {
        const elements = Array.from(document.querySelectorAll(selector));
        return elements.map((element) => {
          const styles = window.getComputedStyle(element);
          const href = element?.getAttribute("href");
          const obj = {
            elementDetails: element?.innerText,
            link: href,
            color: styles.getPropertyValue("color"),
            backgroundColor: styles.getPropertyValue("background-color"),
            fontSize: styles.getPropertyValue("font-size"),
            lineHeight: styles.getPropertyValue("line-height"),
            fontFamily: styles.getPropertyValue("font-family"),
            padding: styles.getPropertyValue("padding"),
            margin: styles.getPropertyValue("margin"),
            letterSpacing: styles.getPropertyValue("letter-spacing"),
            fontWidth: styles.getPropertyValue("font-weight"),
            textIndent: styles.getPropertyValue("text-indent"),
            textDecoration: styles.getPropertyValue("text-decoration"),
          };
          return obj;
        });
      }, selector);
      await browser.close();
      return eleDetails;
    } else if (selector?.slice(selector.indexOf(" ") + 1) === "span") {
      const eleDetails = await page.evaluate((selector) => {
        const elements = Array.from(document.querySelectorAll(selector));
        return elements.map((element) => {
          const styles = window.getComputedStyle(element);

          const obj = {
            elementDetails: element?.innerText,
            color: styles.getPropertyValue("color"),
            backgroundColor: styles.getPropertyValue("background-color"),
            fontSize: styles.getPropertyValue("font-size"),
            lineHeight: styles.getPropertyValue("line-height"),
            fontFamily: styles.getPropertyValue("font-family"),
            padding: styles.getPropertyValue("padding"),
            margin: styles.getPropertyValue("margin"),
            letterSpacing: styles.getPropertyValue("letter-spacing"),
            fontWidth: styles.getPropertyValue("font-weight"),
            textIndent: styles.getPropertyValue("text-indent"),
          };
          return obj;
        });
      }, selector);
      await browser.close();
      return eleDetails;
    } else if (
      selector?.slice(selector.indexOf(" ") + 1) === "h1" ||
      selector?.slice(selector.indexOf(" ") + 1) === "h2" ||
      selector?.slice(selector.indexOf(" ") + 1) === "h3" ||
      selector?.slice(selector.indexOf(" ") + 1) === "h4" ||
      selector?.slice(selector.indexOf(" ") + 1) === "h5" ||
      selector?.slice(selector.indexOf(" ") + 1) === "h6"
    ) {
      const eleDetails = await page.evaluate((selector) => {
        const elements = Array.from(document.querySelectorAll(selector));
        return elements.map((element) => {
          const styles = window.getComputedStyle(element);
          const obj = {
            elementDetails: element?.innerText,
            color: styles.getPropertyValue("color"),
            backgroundColor: styles.getPropertyValue("background-color"),
            fontSize: styles.getPropertyValue("font-size"),
            lineHeight: styles.getPropertyValue("line-height"),
            fontFamily: styles.getPropertyValue("font-family"),
            padding: styles.getPropertyValue("padding"),
            margin: styles.getPropertyValue("margin"),
            letterSpacing: styles.getPropertyValue("letter-spacing"),
            fontWidth: styles.getPropertyValue("font-weight"),
          };
          return obj;
        });
      }, selector);
      await browser.close();
      return eleDetails;
    } else if (selector?.slice(selector.indexOf(" ") + 1) === "button") {
      const eleDetails = await page.evaluate((selector) => {
        const elements = Array.from(document.querySelectorAll(selector));
        return elements.map((element) => {
          const styles = window.getComputedStyle(element);
          const obj = {
            elementDetails: element?.innerText,
            color: styles.getPropertyValue("color"),
            backgroundColor: styles.getPropertyValue("background-color"),
            fontSize: styles.getPropertyValue("font-size"),
            lineHeight: styles.getPropertyValue("line-height"),
            fontFamily: styles.getPropertyValue("font-family"),
            padding: styles.getPropertyValue("padding"),
            margin: styles.getPropertyValue("margin"),
            letterSpacing: styles.getPropertyValue("letter-spacing"),
            fontWidth: styles.getPropertyValue("font-weight"),
            borderRadius: styles.getPropertyValue("border-radius"),
            height: styles.getPropertyValue("height"),
            width: styles.getPropertyValue("width"),
            maxHeight: styles.getPropertyValue("max-height"),
            maxWidth: styles.getPropertyValue("max-width"),
            minWidth: styles.getPropertyValue("min-width"),
            minHeight: styles.getPropertyValue("min-height"),
            border: styles.getPropertyValue("border"),
          };
          return obj;
        });
      }, selector);
      await browser.close();
      return eleDetails;
    } else if (selector?.slice(selector.indexOf(" ") + 1) === "img") {
      const eleDetails = await page.evaluate((selector) => {
        const elements = Array.from(document.querySelectorAll(selector));
        return elements.map((element) => {
          const styles = window.getComputedStyle(element);
          const src = element?.getAttribute("src");
          const altTag = element?.getAttribute("alt");
          const obj = {
            url: src,
            altText: altTag,
            width: styles.getPropertyValue("width"),
            height: styles.getPropertyValue("height"),
          };
          return obj;
        });
      }, selector);
      await browser.close();
      return eleDetails;
    } else {
      const eleDetails = await page.evaluate((selector) => {
        const elements = Array.from(document.querySelectorAll(selector));
        return elements.map((element) => {
          const styles = window.getComputedStyle(element);
          const tagName = element?.tagName.toLowerCase();
          const obj = {
            elementDetails: element?.innerText,
            tag: tagName,
            color: styles.getPropertyValue("color"),
            backgroundColor: styles.getPropertyValue("background-color"),
            fontSize: styles.getPropertyValue("font-size"),
            lineHeight: styles.getPropertyValue("line-height"),
            fontFamily: styles.getPropertyValue("font-family"),
            padding: styles.getPropertyValue("padding"),
            margin: styles.getPropertyValue("margin"),
            letterSpacing: styles.getPropertyValue("letter-spacing"),
            fontWidth: styles.getPropertyValue("font-weight"),
            borderRadius: styles.getPropertyValue("border-radius"),
            height: styles.getPropertyValue("height"),
            width: styles.getPropertyValue("width"),
            maxHeight: styles.getPropertyValue("max-height"),
            maxWidth: styles.getPropertyValue("max-width"),
            minWidth: styles.getPropertyValue("min-width"),
            minHeight: styles.getPropertyValue("min-height"),
            border: styles.getPropertyValue("border"),
            top: styles.getPropertyValue("top"),
          };
          return obj;
        });
      }, selector);
      await browser.close();
      return eleDetails;
    }
  } catch (e) {
    console.log(e);
  }
}

module.exports = getElementDetails;

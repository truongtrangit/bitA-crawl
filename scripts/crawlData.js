const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
const fs = require("fs");
const path = require("path");
const fakeUa = require("fake-useragent");
const { DB_URI, STEPS, TARGET_URL } = require("./configs.json");
const { processData, scrollToEndOfPage } = require("./utils/puppeteer");
const { connectDatabase, delay } = require("./utils/utils");

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));
const filePath = path.resolve(__dirname + "/out/products.json");

async function startBrowser() {
  let browser;
  try {
    console.log("Opening the browser");
    browser = await puppeteer.launch({
      headless: false,
      ignoreHTTPSErrors: true,
      args: ["--no-sandbox"],
    });
  } catch (err) {
    console.log("Could not create a browser instance => : ", err);
  }
  return browser;
}

async function crawlAllProducts(page) {
  console.log("🚀 ~ Calling crawlAllProducts function");
  // Query product card
  const productCardSelector = "div.qmXQo";
  // wait until exist
  await page.waitForSelector(productCardSelector);
  await page.waitForSelector("img[src^='http']");

  const products = await page.$$eval(productCardSelector, (cards) => {
    return cards.map((card) => {
      const imageElement = card.querySelector("div.picture-wrapper img");
      const nameElement = card.querySelector("div.RfADt a");
      const priceElement = card.querySelector("div.aBrP0 span.ooOxS");
      const originalPriceElement = card.querySelector(
        "div.WNoq3 span._1m41m del.ooOxS"
      );
      const discountPercentageElement = card.querySelector(
        "div.WNoq3 span.IcOsH"
      );
      const soldElement = card.querySelector(
        "div._6uN7R span._1cEkb span:first-child"
      );
      const starElements = card.querySelectorAll("div.mdmmT._32vUv i._9-ogB");
      const addressElement = card.querySelector("div._6uN7R span.oa6ri");

      const stars = starElements.length;

      // Extract small images
      const thumbImagesElements = card.querySelectorAll(
        "div.jBwCF img[type='thumb']"
      );
      const thumbnails = Array.from(thumbImagesElements).map((img) => img.src);

      return {
        image: imageElement ? imageElement.getAttribute("src") : null,
        name: nameElement ? nameElement.getAttribute("title") : null,
        price: priceElement ? priceElement.innerText : null,
        originalPrice: originalPriceElement
          ? originalPriceElement.innerText
          : null,
        discountPercentage: discountPercentageElement
          ? discountPercentageElement.innerText
          : null,
        sold: soldElement ? soldElement.innerText : null,
        stars,
        address: addressElement ? addressElement.innerText : null,
        thumbnails,
      };
    });
  });

  console.log("Crawled all product in this page");

  return products;
}

async function crawlData(url) {
  let allProducts = [];
  try {
    //#region Crawl data
    let browser;
    if (STEPS.crawlData) {
      // Init Puppeteer
      browser = await startBrowser();
      let page = await browser.newPage();
      page.setUserAgent(fakeUa());
      page.setDefaultTimeout(120000);
      await page.setViewport({
        width: 1280,
        height: 800,
        deviceScaleFactor: 1,
      });
      await page.goto(url, { waitUntil: "load" });
      page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

      // Click next page
      let currentPage = 1;
      while (true) {
        console.log("🚀 ~ currentPage:", currentPage);
        await scrollToEndOfPage(page, "div.e5J1n");
        const _allProd = await crawlAllProducts(page);

        // fs.writeFileSync(
        //   __dirname + `/out/out-${currentPage}.json`,
        //   JSON.stringify(_allProd)
        // );

        allProducts = allProducts.concat(_allProd);

        const nextPageButton = await page.$('li[title="Next Page"]');
        if (nextPageButton) {
          const isNextButtonEnabled = await page.$eval(
            'li[title="Next Page"] > button.ant-pagination-item-link',
            (button) => {
              return !button.hasAttribute("disabled");
            }
          );
          console.log({ isNextButtonEnabled });

          if (isNextButtonEnabled) {
            await Promise.all([
              page.click('li[title="Next Page"]'),
              page.waitForNavigation(),
            ]);
            await delay(2000);
            console.log("Clicked on the next page button.");

            let newUrl = await page.evaluate(() => window.location.href);
            console.log("🚀 ~ newUrl:", newUrl);
            const urlParams = new URLSearchParams(newUrl.split("?")[1]);
            const pageParam = urlParams.get("page");

            if (parseInt(pageParam, 10) !== currentPage + 1) {
              console.log(
                "URL or page content did not update correctly. Retrying...",
                { currentPage, urlPage: parseInt(pageParam, 10) }
              );

              let retryCount = 0;
              const maxRetries = 50;

              while (retryCount < maxRetries) {
                // Click the "Next Page" button again
                await Promise.all([
                  page.click('li[title="Next Page"]'),
                  page.waitForNavigation(),
                ]);
                console.log("Clicked on the next page button again");
                await delay(2000);
                newUrl = await page.evaluate(() => window.location.href);
                console.log("🚀 ~ newUrl:", newUrl);
                const urlParams = new URLSearchParams(newUrl.split("?")[1]);
                const pageParam = urlParams.get("page");

                if (parseInt(pageParam, 10) === currentPage + 1) {
                  console.log("URL is correct. Continuing crawl");
                  break;
                }

                retryCount++;
              }

              if (retryCount === maxRetries) {
                console.log("Maximum retries reached. Stopping crawl");
                break;
              }
            }

            await scrollToEndOfPage(page, "div.e5J1n");
            currentPage++;
          } else {
            console.log("The next page button is disabled.");
            break;
          }
        } else {
          console.log("No next page button found.");
          break;
        }
      }

      allProducts = processData(allProducts);
      fs.writeFileSync(filePath, JSON.stringify(allProducts));
    }
    //#endregion

    //#region Insert into DB
    if (STEPS.insertDB) {
      if (allProducts.length === 0) {
        const existsDataFile = fs.existsSync(filePath);
        if (!existsDataFile) {
          console.log("Can not found any data file. Can not insert DB");
          return;
        }

        allProducts = fs.readFileSync(filePath, { encoding: "utf-8" });
        allProducts = JSON.parse(allProducts);
      }

      const dbIns = await connectDatabase(DB_URI);

      await dbIns.collection("products").insertMany(allProducts);

      console.log("Inserted all products");
      await dbIns.close();
    }
    //#endregion
    console.log(">>>>>> DONE <<<<<<");
    await browser?.close();
  } catch (error) {
    console.warn("CRAWL ERROR:", error);
    process.exit(1);
  }
}

crawlData(TARGET_URL);

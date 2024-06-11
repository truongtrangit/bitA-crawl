const { delay } = require("./utils");

async function scrollToEndOfPage(page, footerSelector) {
  const distance = 100;
  const delayTime = 200;

  let isNearFooter = false;
  while (!isNearFooter) {
    await page.evaluate((y) => {
      window.scrollBy(0, y);
    }, distance);
    await delay(delayTime);

    isNearFooter = await page.evaluate(
      (footerSelector, distance) => {
        const footer = document.querySelector(footerSelector);
        if (!footer) return false;
        const footerRect = footer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        return footerRect.top <= viewportHeight - distance;
      },
      footerSelector,
      distance
    );
  }
}

function toSlug(str) {
  str = str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/([^0-9a-z-\s])/g, "")
    .replace(/(\s+)/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return str;
}

function handlePriceData(data) {
  return parseInt(data?.replace(/\D/g, "").trim());
}

function handleDiscountPercent(data) {
  return Math.abs(parseInt(data?.replace("%", "")));
}

function processData(data) {
  for (const item of data) {
    item.slug = toSlug(item.name);
    item.price = handlePriceData(item.price);
    item.originalPrice = handlePriceData(item.originalPrice) || item.price;
    item.discountPercentage =
      handleDiscountPercent(item.discountPercentage) || 0;
  }

  return data;
}

module.exports = {
  processData,
  scrollToEndOfPage,
};

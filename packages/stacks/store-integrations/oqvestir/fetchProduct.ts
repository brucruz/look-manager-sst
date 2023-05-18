import chromium from "chrome-aws-lambda";
import { load } from "cheerio";
import { ProductInsertion } from "@look-manager/core/db/product/product.types";
import fetch from "node-fetch";

const puppeteer = chromium.puppeteer;

export async function fetchOqVestirProduct(
  url: string,
  domain: string,
  domainWithoutWWW: string
) {
  console.log("fetching product from oqvestir");

  // test if url is valid
  try {
    const response = await fetch(url);

    if (response.status !== 200) {
      throw new Error("Product not found");
    }
  } catch (error) {
    throw new Error("Problem connecting to webpage");
  }

  // Launch a headless browser
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath,
    headless: process.env.IS_LOCAL ? false : chromium.headless,
  });

  try {
    // Create a new page
    const page = await browser.newPage();

    // Navigate to the product page
    await page.goto(url);

    // get page html
    const html = await page.content();

    await browser.close();

    const $ = load(html);

    const name = $(".produt-title--name").text().trim();
    const sku = $(".product--sku").text().trim();
    const brand = $(".produt-title--brand a").text().trim();
    const description = $(".stylesTips .panel-body").text().trim();
    const old_price = getNumber(
      $(".product-price span.price[id^=old]").text().trim()
    );
    const price = getNumber(
      $(".product-price span.price[id^=product]").text().trim()
    );

    const installment_quantity = parseInt(
      $(".product-price .product-installment").text().trim().split("x de ")[0]
    );

    const installment_value = getNumber(
      $(".product-price .product-installment").text().trim().split("x de ")[1]
    );

    const available = $(".availability").attr("class")
      ? !$(".availability").attr("class")!.includes("out-of-stock")
      : false;

    const images = $(".slick-cloned img")
      .map(function () {
        return $(this).attr("src");
      })
      .get();

    const sizes = $("#attribute185 option")
      .filter(function () {
        return $(this).attr("data-label") !== undefined;
      })
      .map(function () {
        const size = $(this).attr("data-label") || "not-found";
        const available = !$(this).attr("class")?.includes("out-of-stock");

        if (!size) {
          console.log({
            error: 1,
            errorName: "Size not found",
            store: "oqvestir",
            url: url,
            domain,
          });
        }
        return { size, available };
      })
      .get();

    const product: ProductInsertion = {
      name,
      sku,
      brand,
      description,
      old_price,
      price,
      available,
      images,
      sizes,
      store: "oqvestir",
      store_url: domainWithoutWWW,
      currency: "BRL",
      installment_value,
      installment_quantity,
    };

    return product;
  } catch (error: any) {
    // Handle any errors that occur during crawling
    await browser.close();

    throw new Error(error);
  }
}

interface DOMPrice {
  old?: number;
  new: number;
  installments: {
    qty: number;
    value: number;
  };
}

function getNumber(valueString: string) {
  // get the value as a string, but keep the commas
  const stringValue = valueString.replace(/[^0-9\,]+/g, "");
  return parseLocaleNumber(stringValue, "pt-BR");
}

function parseLocaleNumber(
  stringNumber: string,
  locale: string | string[] | undefined
) {
  var thousandSeparator = Intl.NumberFormat(locale)
    .format(11111)
    .replace(/\p{Number}/gu, "");
  var decimalSeparator = Intl.NumberFormat(locale)
    .format(1.1)
    .replace(/\p{Number}/gu, "");

  return parseFloat(
    stringNumber
      .replace(new RegExp("\\" + thousandSeparator, "g"), "")
      .replace(new RegExp("\\" + decimalSeparator), ".")
  );
}

import jest from "jest";
import puppeteer, { Browser, Page } from "puppeteer";

let page: Page;
let browser: Browser;

beforeAll(async () => {
  browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  page = await browser.newPage();
  await page.goto("http://localhost:8080");
});
afterAll(() => {
  browser.close();
});

const ACTION_TIMEOUT = 1100;

const clearText = async (page: Page, selector: string) => {
  await page.click(selector);
  await page.keyboard.press("Home");
  await page.keyboard.down("Shift");
  await page.keyboard.press("End");
  await page.keyboard.up("Shift");
  await page.keyboard.press("Backspace");
};
describe("Simple e2e tests", () => {
  test("title", async () => {
    await expect(page.title()).resolves.toMatch("Currency exchange");
  });
  test("exchange first currency", async () => {
    await page.waitForSelector("#iFUSD", { visible: true });
    await expect(
      page.$eval("#nFUSD", (e: any) => e.innerText)
    ).resolves.toMatch("USD");
    await expect(
      page.$eval("#nTEUR", (e: any) => e.innerText)
    ).resolves.toMatch("EUR");
    const usdPocket = await page.$eval("#pUSD", (e: any) => e.innerText);
    const euroPocket = await page.$eval("#pEUR", (e: any) => e.innerText);
    expect(usdPocket).toBeTruthy();
    expect(euroPocket).toBeTruthy();
    await page.type("#iFUSD", "1hi0");
    await page.waitFor(ACTION_TIMEOUT);
    await expect(
      page.$eval("#iTEUR", (e: any) => e.innerText)
    ).resolves.toBeTruthy();
    const raite = await page.$eval("#cFUSD", (e: any) => e.innerText);
    await page.click("#exch");
    const usdPocketNew = await page.$eval("#pUSD", (e: any) => e.innerText);
    const euroPocketNew = await page.$eval("#pEUR", (e: any) => e.innerText);
    expect((parseInt(usdPocket) - 10).toFixed()).toBe(
      parseInt(usdPocketNew).toFixed()
    );
    expect((parseInt(euroPocket) + 10 * parseFloat(raite)).toFixed()).toBe(
      parseInt(euroPocketNew).toFixed()
    );
  });
  test("change for positive input", async () => {
    await page.waitForSelector("#iFUSD", { visible: true });
    await page.type("#iFUSD", "999999");
    await page.waitFor(ACTION_TIMEOUT);
    const usdPocket = await page.$eval("#pUSD", (e: any) => e.innerText);
    const euroPocket = await page.$eval("#pEUR", (e: any) => e.innerText);
    expect(page.$eval("#iFUSD", (e: any) => e.innerText)).resolves.toBe(
      parseFloat(usdPocket).toString()
    );
    await page.type("#iTEUR", "999999");
    await page.waitFor(ACTION_TIMEOUT);
    const euroMax = await page.$eval("#iTEUR", (e: any) => e.innerText);
    const newEuroMax = await page.$eval("#iTEUR", (e: any) => e.innerText);
    expect(Math.floor(euroMax)).toBe(Math.floor(newEuroMax));
    await clearText(page, "#iTEUR");
    await page.type("#iTEUR", "1");
    await page.waitFor(ACTION_TIMEOUT);
    const raite = await page.$eval("#cTEUR", (e: any) => e.innerText);
    await page.click("#exch");
    await page.waitFor(ACTION_TIMEOUT);
    const usdPocketNew = await page.$eval("#pUSD", (e: any) => e.innerText);
    const euroPocketNew = await page.$eval("#pEUR", (e: any) => e.innerText);
    expect((parseFloat(usdPocket) - 1 * parseFloat(raite)).toFixed()).toBe(
      parseFloat(usdPocketNew).toFixed()
    );
    expect((parseFloat(euroPocket) + 1).toFixed()).toBe(
      parseFloat(euroPocketNew).toFixed()
    );
  });
  test("change currnecys on top and bottom", async () => {
    await expect(
      page.$eval("#nFUSD", (e: any) => e.innerText)
    ).resolves.toMatch("USD");
    await page.waitForSelector("#iFUSD", { visible: true });
    await page.type("#iFUSD", "9");
    await page.waitFor(ACTION_TIMEOUT);
    const gbp = await page.$("#nFGBP");
    await expect(gbp!.isIntersectingViewport()).resolves.toBeFalsy();
    await expect(
      page.$eval("#iTEUR", (e: any) => e.innerText)
    ).resolves.toBeTruthy();
    await page.click("#dFGBP");
    await page.waitFor(ACTION_TIMEOUT);
    expect(gbp).toBeTruthy();
    await expect(gbp!.isIntersectingViewport()).resolves.toBeTruthy();
    await expect(
      page.$eval("#iTEUR", (e: any) => e.innerText)
    ).resolves.toBeFalsy();
    await page.type("#iFGBP", "10");
    await page.waitFor(ACTION_TIMEOUT);
    const euroRaite = await page.$eval("#cFGBP", (e: any) => e.innerText);
    const euroAmount = await page.$eval("#iTEUR", (e: any) => e.innerText);
    expect(parseFloat(euroAmount).toFixed()).toBe(
      (10 * parseFloat(euroRaite)).toFixed()
    );
    await page.click("#dTUSD");
    await page.waitFor(ACTION_TIMEOUT);
    const usdRaite = await page.$eval("#cFGBP", (e: any) => e.innerText);
    const usdAmount = await page.$eval("#iTUSD", (e: any) => e.innerText);
    expect(parseFloat(usdAmount).toFixed()).toBe(
      (10 * parseFloat(usdRaite)).toFixed()
    );
  }, 10000);
});

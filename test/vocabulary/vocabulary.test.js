import "expect-puppeteer";

// jest.setTimeout(20000);
describe("Vocabulary", () => {
  beforeAll(async () => {
    await page.goto("http://localhost:9123/vocabulary", {
      // waitUntil: "domcontentloaded",
      // waitUntil: "networkidle0",
    });
    page.on("pageerror", function (err) {
      console.log("Page error: " + err.toString());
    });
    await page.waitForSelector(".deck-loaded");
  });

  it("Logged out user's schedule is stable", async () => {
    await page.toClick("button", { text: "Start a study session" });
    for (let i = 0; i < 10; i++) {
      await page.toClick("button", { text: "Click to show answer" });
      await page.toClick("button", { text: "Good" });
    }
    await page.toClick("button", { text: "Quit" });
    const works = await page.evaluate(async () => {
      return Object.keys(window.deck);
      return false;
    });
    console.log(works);
    // expect(works).toBe(true);
  });
});

// const puppeteer = require("puppeteer");
//
// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   page.on("pageerror", function (err) {
//     console.error("Page error: " + err.toString());
//   });
//   await page.goto("http://localhost:9123/vocabulary");
//   await page.waitForSelector(".deck-loaded");
//   // await page.screenshot({ path: "example.png" });
//
//   /*  */
//   const works = await page.evaluate(async () => {
//     // return Object.keys(window.deck);
//     // // return window.deck;
//     // return false;
//   });
//   console.log(works);
//
//   await browser.close();
//   process.exit();
// })();

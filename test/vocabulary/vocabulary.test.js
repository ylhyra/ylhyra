// import "expect-puppeteer";
// //
// // // jest.setTimeout(20000);
// // describe("Vocabulary", () => {
// //   beforeAll(async () => {
// //     await page.goto("http://localhost:9123/vocabulary", {
// //       waitUntil: "domcontentloaded",
// //       // waitUntil: "networkidle0",
// //     });
// //   });
// //
// //   it("blabla", async () => {
// //     // await new Promise((resolve) => {
// //     //   setTimeout(resolve, 1000);
// //     // });
// //     await page.waitForSelector(".deck-loaded");
// //     const works = await page.evaluate(async () => {
// //       return window.deck;
// //       return false;
// //     });
// //     console.log(works);
// //     // expect(works).toBe(true);
// //   });
// // });
//
// const run = async () => {
//   await page.goto("http://localhost:9123/vocabulary", {
//     waitUntil: "domcontentloaded",
//     // waitUntil: "networkidle0",
//   });
//   await page.waitForSelector(".deck-loaded");
//   process.exit();
// };
// run();

const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:9123/vocabulary");
  await page.waitForSelector(".deck-loaded");
  // await page.screenshot({ path: "example.png" });
  const works = await page.evaluate(async () => {
    return Object.keys(window.deck);
    // return window.deck;
    return false;
  });
  console.log(works);

  await browser.close();
  process.exit();
})();

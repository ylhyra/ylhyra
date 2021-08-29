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
    await page.waitForSelector(".deck-loaded", { timeout: 2000 });
  });

  it("Logged out user's schedule is correctly saved on signup", async () => {
    await expect(page).toClick("a", { text: "Start a study session" });
    for (let i = 0; i < 10; i++) {
      await expect(page).toClick("button", { text: "Click to show answer" });
      await expect(page).toClick("button", { text: "Good" });
    }
    await expect(page).toClick("button", { text: "Quit" });
    const known1 = await page.evaluate(async () => {
      const i = window.PercentageKnownOverall();
      localStorage.clear();
      return i;
    });
    expect(known1).not.toBeNull();

    /* Sign up & log out */
    const username = "test_" + Math.round(Math.random() * 100000);
    await expect(page).toClick("a", { text: "Sign up" });
    await expect(page).toFillForm("form", {
      username,
      password: username,
    });
    await page.screenshot({ path: "example1.png" });
    setTimeout(() => {
      page.screenshot({ path: "example3.png" });
    }, 30);
    await expect(page).toClick("button[type=submit]");
    await page.screenshot({ path: "example3.5.png" });
    await page.waitForSelector(".logged-in-as", { timeout: 500 });
    await expect(page).toClick("a.logged-in-as");
    await wait(200);
    await page.screenshot({ path: "example4.png" });
    await expect(page).toClick("button", { text: "Log out" });

    /* Log in again */
    await expect(page).toClick("a", { text: "Log in" });
    await page.screenshot({ path: "example5.png" });
    await expect(page).toFillForm("form", {
      username,
      password: username,
    });
    await expect(page).toClick("form button");

    await page.goto("http://localhost:9123/vocabulary");
    await page.waitForSelector(".deck-loaded", { timeout: 500 });
    const known2 = await page.evaluate(async () => {
      return window.PercentageKnownOverall();
    });

    console.log({
      known1,
      known2,
    });
    expect(known1).toEqual(known2);
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

const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms || 20);
  });
};

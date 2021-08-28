import "expect-puppeteer";

describe("Vocabulary", () => {
  beforeAll(async () => {
    await page.goto("http://localhost:9123", {
      // waitUntil: "networkidle0",
    });
  });

  it("blabla", async () => {
    // await new Promise((resolve) => {
    //   setTimeout(resolve, 1000);
    // });
    const works = await page.evaluate(() => {
      return window.deck;
      return false;
    });
    console.log(works);
    // expect(works).toBe(true);
  });
});

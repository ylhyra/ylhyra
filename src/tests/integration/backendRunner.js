/*
node -r esm src/tests/integration/backendRunner.js
 */
const puppeteer = require("puppeteer-core");

const exit = (err) => {
  console.error("ERROR", err);
  process.exit(1);
};

(async () => {
  const browser = await puppeteer.launch({
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const page = await browser.newPage();
  await page.goto("http://localhost:9123");

  page.on("console", (msg) => {
    if (msg.type() === "trace") {
      console.log(msg.args());
    } else if (msg.type() === "error") {
      exit(msg.text());
    }
  });
  page.on("error", exit);
  page.on("pageerror", exit);
  await page.exposeFunction("logToPuppeteer", console.log);
  await page.evaluate(async () => {
    window.logToPuppeteer("Puppeteer started");
    await window.testing();
  });
  await browser.close();
  process.exit();
})();

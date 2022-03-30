var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const puppeteer = require("puppeteer-core");
const exit = (err) => {
    console.error("ERROR", err);
    process.exit(1);
};
(() => __awaiter(this, void 0, void 0, function* () {
    const browser = yield puppeteer.launch({
        executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    });
    const page = yield browser.newPage();
    yield page.goto("http://localhost:9123");
    page.on("console", (msg) => {
        if (msg.type() === "trace") {
            console.log(msg.args());
        }
        else if (msg.type() === "error") {
            exit(msg.text());
        }
    });
    page.on("error", exit);
    page.on("pageerror", exit);
    yield page.exposeFunction("logToPuppeteer", console.log);
    yield page.evaluate(() => __awaiter(this, void 0, void 0, function* () {
        window.logToPuppeteer("Puppeteer started");
        yield window.testing();
    }));
    yield browser.close();
    process.exit();
}))();

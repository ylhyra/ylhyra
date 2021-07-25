import "expect-puppeteer";

const TEST_USER1 = "test_user1";
const TEST_USER2 = "test_user2";

describe("User", () => {
  beforeAll(async () => {
    await page.goto("http://localhost:3000");
  });

  it("Incorrect login should throw error", async () => {
    await expect(page).toClick("a", { text: "Log in" });
    await expect(page).toFillForm("form", {
      username: "sladkjf",
      password: "lsakdj",
    });
    await page.click("form button");
    // await page.waitForNavigation();
    await expect(page).toMatch("No user with that");
  });

  it("Signup", async () => {
    await expect(page).toClick("a", { text: "Log in" });
    await expect(page).toClick("a", { text: "Sign up" });
    await expect(page).toFillForm("form", {
      username: TEST_USER1,
      password: TEST_USER1,
    });
    await page.click("form button");
    // await page.waitForNavigation();
    await expect(page).toMatch(TEST_USER1);
  });
});

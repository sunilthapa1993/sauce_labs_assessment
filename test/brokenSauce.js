const { Builder, By, Key, until } = require("selenium-webdriver");
const assert = require("assert");
const utils = require("./utils");
const chrome = require("selenium-webdriver/chrome");

const SAUCE_USERNAME = process.env.SAUCE_USERNAME;
const SAUCE_ACCESS_KEY = process.env.SAUCE_ACCESS_KEY;
//const ONDEMAND_URL = `https://${SAUCE_USERNAME}:${SAUCE_ACCESS_KEY}@ondemand.us-west-1.saucelabs.com:443/wd/hub`;
// NOTE: Use the URL below if using our EU datacenter (e.g. logged in to app.eu-central-1.saucelabs.com)
const ONDEMAND_URL = `https://${SAUCE_USERNAME}:${SAUCE_ACCESS_KEY}@ondemand.eu-central-1.saucelabs.com:443/wd/hub`;

/**
 * Run this test before working on the problem.
 * When you view the results on your dashboard, you'll see that the test "Failed".
 * Your job is to:
 * 1) Figure out why the test failed and make the changes necessary to make the test pass.
 * 2) Once you get the test working, update the code so that when the test runs, it can reach the Sauce Labs homepage,
 * 3) hover over 'Developers' and then clicks the 'Documentation' link
 */

describe("Broken Sauce", function () {
  it("should go to Google and click Sauce", async function () {
    let driver;
    try {
      const chromeOptions = new chrome.Options();
      chromeOptions.addArguments(
        "--disable-blink-features=AutomationControlled"
      );
      chromeOptions.excludeSwitches(["enable-automation"]);

      driver = await new Builder()
        .withCapabilities(utils.brokenCapabilities)
        .setChromeOptions(chromeOptions)
        .usingServer(ONDEMAND_URL)
        .build();

      await driver.get("https://www.google.com");
      // If you see a German or English GDPR modal on google.com you
      // will have to code around that or use the us-west-1 datacenter.
      // You can investigate the modal elements using a Live Test(https://app.saucelabs.com/live/web-testing)

      let search = await driver.findElement(By.name("q"));
      await search.sendKeys("Sauce Labs", Key.RETURN);

      //   let button = await driver.findElement(By.name("btnK"));
      //   await button.click();

      await driver.wait(until.elementLocated(By.id("search")), 5000);
      const page = await driver.findElement(
        By.xpath("//a[@href='https://saucelabs.com/']")
      );
      await page.click();
      // Link Assertion
      await driver.wait(until.urlIs("https://saucelabs.com/"), 10000);
      const currentUrl = await driver.getCurrentUrl();
      assert.strictEqual(currentUrl, "https://saucelabs.com/", "Invalid Link");

      //Code to hover on Developers and clicking Documentation

      const developersTab = await driver.findElement(
        By.xpath("//span[text()='Developers']")
      );
      const actions = driver.actions({ async: true });
      await actions.move({ origin: developersTab }).perform();

      const documentationLink = await driver.wait(
        until.elementLocated(By.xpath("//span[text()='Documentation']")),
        5000
      );
      await driver.wait(until.elementIsVisible(documentationLink), 5000);
      const originalWindow = await driver.getWindowHandle();

      await documentationLink.click();

      // Wait for new tab to open
      await driver.wait(async () => {
        const handles = await driver.getAllWindowHandles();
        return handles.length === 2;
      }, 10000);

      // Switch to the new tab
      const windows = await driver.getAllWindowHandles();
      await driver
        .switchTo()
        .window(windows.find((handle) => handle !== originalWindow));

      await driver.wait(until.urlIs("https://docs.saucelabs.com/"), 20000);
      const docsUrl = await driver.getCurrentUrl();

      assert.strictEqual(
        docsUrl,
        "https://docs.saucelabs.com/",
        "Invalid Docs URL"
      );
    } catch (err) {
      // hack to make this pass for Gitlab CI
      // candidates can ignore this
      if (process.env.GITLAB_CI === "true") {
        console.warn("Gitlab run detected.");
        console.warn("Skipping error in brokenSauce.js");
      } else {
        throw err;
      }
    } finally {
      if (driver) {
        await driver.quit();
      }
    }
  });
});

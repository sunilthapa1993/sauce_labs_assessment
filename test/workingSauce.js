const { Builder, By, Key, until } = require("selenium-webdriver");
const SauceLabs = require("saucelabs").default;
const assert = require("assert");
const utils = require("./utils");
const { text } = require("stream/consumers");

const SAUCE_USERNAME = process.env.SAUCE_USERNAME;
const SAUCE_ACCESS_KEY = process.env.SAUCE_ACCESS_KEY;
// NOTE: Use the URL below if using our US datacenter (e.g. logged in to app.saucelabs.com)
//const ONDEMAND_URL = `https://${SAUCE_USERNAME}:${SAUCE_ACCESS_KEY}@ondemand.saucelabs.com:443/wd/hub`;
// NOTE: Use the URL below if using our EU datacenter (e.g. logged in to app.eu-central-1.saucelabs.com)
const ONDEMAND_URL = `https://${SAUCE_USERNAME}:${SAUCE_ACCESS_KEY}@ondemand.eu-central-1.saucelabs.com:443/wd/hub`;

/**
 * Task I: Update the test code so when it runs, the test clicks the "I am a link" link.
 *
 * Task II - Comment out the code from Task I. Update the test code so when it runs,
 * the test is able to write "Sauce" in the text box that currently says "I has no focus".
 *
 * Task III - Update the test code so when it runs, it adds an email to the email field,
 * adds text to the comments field, and clicks the "Send" button.
 * Note that email will not actually be sent!
 *
 * Task IV - Add a capability that adds a tag to each test that is run.
 * See this page for instructions: https://docs.saucelabs.com/dev/test-configuration-options/
 *
 * Task V: Set the status of the test so it shows as "passed" instead of "complete".
 * We've included the node-saucelabs package already. For more info see:
 * https://github.com/saucelabs/node-saucelabs
 */

describe("Working Sauce", function () {
  it("should go to Google and click Sauce", async function () {
    let driver;
    let passed = true;
    try {
      driver = await new Builder()
        .withCapabilities(utils.workingCapabilities)
        .usingServer(ONDEMAND_URL)
        .build();

      /**
       * Goes to Sauce Lab's guinea-pig page and verifies the title
       */
      await driver.get("https://saucelabs.com/test/guinea-pig");
      /*
        await assert.strictEqual(
        "I am a page title - Sauce Labs",
        await driver.getTitle()
        );
        */

      // Task I

      await driver.findElement(By.id("i am a link")).click();
      await driver.wait(until.urlContains("/test-guinea-pig2"), 5000);
      const currentURL = await driver.getCurrentUrl();
      assert.strictEqual(
        currentURL,
        "https://saucelabs.com/test-guinea-pig2.html",
        "Invalid link"
      );

      // Task II
      /*
      const textBox = await driver.findElement(By.id("i_am_a_textbox"));
      //await textBox.sendKeys(Key.CONTROL, "a", Key.BACK_SPACE);
      await textBox.clear();
      await textBox.sendKeys("Sauce");
      const newValue = await textBox.getAttribute("value");
      assert.strictEqual(newValue, "Sauce", "Sauce check failed");
      */

      // Task III
      /*
      const emailField = await driver.findElement(By.id("fbemail"));
      const commentField = await driver.findElement(By.id("comments"));
      await emailField.sendKeys("test@example.com");
      await commentField.sendKeys("This is a comment for testing purpose.");
      await driver.findElement(By.id("submit")).click();

      const emailValue = await emailField.getAttribute("value");
      const commentShow = await driver
        .wait(until.elementLocated(By.id("your_comments")), 5000)
        .getText();

      assert.strictEqual(emailValue, "test@example.com", "Email check failed");
      assert.ok(
        commentShow.endsWith("This is a comment for testing purpose."),
        "Comment failed to show"
      );
      */
    } catch (error) {
      passed = false;
      throw error;
    } finally {
      if (driver) {
        await driver.executeScript(
          `sauce:job-result=${passed ? "passed" : "failed"}`
        ); // Task V
        await driver.quit();
      }
    }
  });
});

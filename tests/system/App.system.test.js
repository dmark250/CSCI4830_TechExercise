import { describe, it, expect, beforeAll, afterAll, } from "vitest";

import { Builder, By, until, } from "selenium-webdriver";

const APP_URL = "http://localhost:5173";

describe("System tests", () => {
  let driver;

  // The browser is opened in chrome
  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  }, 30000);

  // The browser is closed
  afterAll(async () => {
    await driver.quit();
  }, 30000);

  // The browser goes to the website url
  async function openApp() {
    await driver.get(APP_URL);

    await driver.wait(until.elementLocated(By.css(".add-entry-button")), 5000);

    // IndexedDB has some initial load time before a test
    await driver.sleep(200);
  }

  // Clicks the Yes! button
  async function clickYes() {
    const yesButton = await driver.wait(until.elementLocated(By.css(".are-you-sure-yes")), 5000);

    await yesButton.click();

    await driver.wait(async () => {
      const popups = await driver.findElements(By.css(".are-you-sure"));

      return popups.length === 0;
    }, 5000);
  }

  // Clicks the Clear Entries button, Yes! button, Save Entries button, and Yes! button.
  async function clearSavedEntries() {
    await openApp();

    await driver.findElement(By.css(".clear-entries-button")).click();

    await clickYes();

    await driver.wait(async () => {
      const entries = await driver.findElements(By.css(".entry-value"));

      return entries.length === 0;
    }, 5000);

    // Save the cleared entries so the DB is empty
    await driver.findElement(By.css(".save-entries-button")).click();

    await clickYes();

    await driver.sleep(200);
  }

  // Opens the github links when clicking the website title and author name
  it("Github page links open properly", async () => {
    // Clicking the title goes to the project github repo
    await openApp();
    await driver.findElement(By.css(".app-title")).click();
    await driver.wait(until.urlContains("github.com/dmark250/CSCI4830_TechExercise"), 15000);
    expect(await driver.getCurrentUrl()).toContain("github.com/dmark250/CSCI4830_TechExercise");

    // Clicking the title goes to the author github repo
    await openApp();
    await driver.findElement(By.css(".app-author")).click();
    await driver.wait(until.urlContains("github.com/dmark250"), 15000);
    expect(await driver.getCurrentUrl()).toContain("github.com/dmark250");
  }, 30000);

  // Confirmation is done before clearing entries
  it("Adds an Entry and a confirmation page is displayed before it is cleared", async () => {
    await openApp();

    // Add an Entry and verify it is called New Entry
    await driver.findElement(By.css(".add-entry-button")).click();
    const entry = await driver.wait(until.elementLocated(By.css(".entry-value")), 5000);
    expect(await entry.getAttribute("value")).toBe("New Entry");

    // Click clear entries and verify the new entry still exists
    await driver.findElement(By.css(".clear-entries-button")).click();
    let entries = await driver.findElements(By.css(".entry-value"));
    expect(entries.length).toBeGreaterThan(0);
    expect(await entries[0].getAttribute("value")).toBe("New Entry");
    expect(await driver.findElement(By.css(".are-you-sure-title")).getText()).toBe("Are you sure?");

    // Click Yes and ensure no entries remain
    await clickYes();
    entries = await driver.findElements(By.css(".entry-value"));
    expect(entries).toHaveLength(0);
  }, 30000);

  // Adds a new entry and ensures that it is the only thing saved and loaded when the page is refreshed.
  it("Add an Entry and verify that it saves and loads after a refresh", async () => {
    await clearSavedEntries();

    // Add an Entry and name it test entry
    await driver.findElement(By.css(".add-entry-button")).click();
    const entry = await driver.wait(until.elementLocated(By.css(".entry-value")), 5000);
    await entry.clear();
    await entry.sendKeys("test entry");

    // Save the Entry
    await driver.findElement(By.css(".save-entries-button")).click();
    await clickYes();

    // Allow IndexDB time to finish saving
    await driver.sleep(200);

    // Refresh
    await driver.navigate().refresh();

    // ensure only the saved entry is in the DB and has proper values
    const savedEntries = await driver.wait(async () => {
      const entries = await driver.findElements(By.css(".entry-value"));
      return entries.length === 1 ? entries : false;
    }, 5000);

    expect(savedEntries).toHaveLength(1);
    expect(await savedEntries[0].getAttribute("value")).toBe("test entry");
  }, 30000);
});

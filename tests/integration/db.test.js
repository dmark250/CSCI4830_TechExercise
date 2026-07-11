import "fake-indexeddb/auto";

import { describe, it, expect, afterAll, } from "vitest";

import { Entry } from "@/Entry.js";

import { db, loadEntriesDB, addEntryDB, updateEntryDB, deleteEntryDB, } from "@/db.js";

describe("Database integration tests", () => {

  // Delete the temp database after the test is done
  afterAll(async () => {
    await db.delete();
  });

  it("An entry is added and verified, updated and verified, and deleted and verified all by loading", async () => {
    // Make a new test entry with a set value and time
    const entry = new Entry("Test Entry", 1000);

    // Add the entry to the DB and set its id as the DB ID.
    const returnedId = await addEntryDB(entry);
    entry.setId(returnedId);

    // Ensure the entry is present in the DB with the proper values
    let loadedEntries = await loadEntriesDB();
    expect(loadedEntries).toHaveLength(1);
    expect(loadedEntries[0].getId()).toBe(entry.getId());
    expect(loadedEntries[0].getValue()).toBe(entry.getValue());
    expect(loadedEntries[0].getTime()).toBe(entry.getTime());

    // Update the entry value and time
    entry.setValue("Updated Test Entry");
    entry.setTime(2000);

    await updateEntryDB(entry);

    // Ensure the entry is present in the DB with the proper values
    loadedEntries = await loadEntriesDB();
    expect(loadedEntries).toHaveLength(1);
    expect(loadedEntries[0].getId()).toBe(entry.getId());
    expect(loadedEntries[0].getValue()).toBe("Updated Test Entry");
    expect(loadedEntries[0].getTime()).toBe(2000);

    // Delete the entry from the DB and ensure it no longer exists
    await deleteEntryDB(entry);
    loadedEntries = await loadEntriesDB();
    expect(loadedEntries).toHaveLength(0);
  });
});

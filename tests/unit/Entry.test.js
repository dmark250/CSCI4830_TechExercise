import { describe, it, expect } from "vitest";
import { Entry } from "@/Entry.js";

// Unit tests for the Entry class
describe("Entry Class Unit Tests", () => {
  it("Entry is made with given values", () => {
    const entry = new Entry("Test Entry", 1000, 5);
    expect(entry.getValue()).toBe("Test Entry");
    expect(entry.getTime()).toBe(1000);
    expect(entry.getId()).toBe(5);
  });

  // A default ID for an Entry is null
  it("uses null as the default ID", () => {
    const entry = new Entry("Test Entry", 1000);
    expect(entry.getId()).toBeNull();
  });

  // An entry's values are updated properly with setters
  it("updates the entry values using its setters", () => {
    const entry = new Entry("Original Entry", 1000);
    entry.setValue("Updated Entry");
    entry.setTime(2000);
    entry.setId(10);

    expect(entry.getValue()).toBe("Updated Entry");
    expect(entry.getTime()).toBe(2000);
    expect(entry.getId()).toBe(10);
  });
});

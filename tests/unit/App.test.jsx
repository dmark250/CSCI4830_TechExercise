// @vitest-environment jsdom

import { describe, it, expect, vi, afterEach, } from "vitest";

import { render, screen, cleanup, } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";

import App from "@/App.jsx";

// Actual file path is used here, @ only works in imports
vi.mock("../../src/db.js", () => ({
  loadEntriesDB: vi.fn().mockResolvedValue([]),
  addEntryDB: vi.fn(),
  updateEntryDB: vi.fn(),
  deleteEntryDB: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("App Unit Tests", () => {
  // Ensure all elements exist on opening the page
  it("App Elements Are Displayed", () => {
    render(<App />);

    expect(screen.getByText("CSCI4830_TechExercise")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Entry" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear Entries" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Load Entries" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save Entries" })).toBeInTheDocument();
    expect(screen.queryAllByRole("textbox")).toHaveLength(0);
  });

  // Add Entry button makes a new entry appear with a text value "New Entry"
  it("Add Entry Makes A New Entry", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Add Entry" }));
    expect(screen.getByRole("textbox")).toHaveValue("New Entry");
  });

  // Clicking the remove button on an entry removes it
  it("Remove Entry Deletes It From the Screen", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Add Entry" }));
    expect(screen.getByRole("textbox")).toHaveValue("New Entry");

    await user.click(screen.getByRole("button", { name: "Remove" }));
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });
});

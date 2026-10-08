import assert from "node:assert/strict";
import test from "node:test";
import Storage from "../scripts/localStorage.js";

const data = new Map();
globalThis.localStorage = {
  getItem: (key) => data.get(key) ?? null,
  setItem: (key, value) => data.set(key, String(value)),
};

test("default tags are restored without replacing user-created tags", () => {
  data.clear();
  Storage.saveTag("Travel");

  Storage.saveDefaultTags();
  Storage.saveDefaultTags();

  assert.deepEqual(Storage.getAllTags(), [
    "Travel",
    "Shopping🛍️",
    "Food😋",
    "Subscription📱",
    "Manik👨‍💻",
    "Misc.",
  ]);
});

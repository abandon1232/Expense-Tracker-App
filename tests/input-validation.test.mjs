import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const js = await readFile(new URL("../scripts/app.js", import.meta.url), "utf8");
const input = (id) => html.match(new RegExp(`<input[^>]*id="${id}"[^>]*>`))[0];

test("amount fields use the same strict native validation", () => {
  for (const id of ["addAmount", "editAmount"]) {
    const markup = input(id);
    assert.match(markup, /type="text"/);
    assert.match(markup, /inputmode="decimal"/);
    assert.match(markup, /required/);
    assert.match(markup, /pattern=/);
  }

  const patterns = ["addAmount", "editAmount"].map(
    (id) => input(id).match(/pattern="([^"]+)"/)[1]
  );
  assert.equal(patterns[0], patterns[1]);
  for (const pattern of patterns) {
    const amount = new RegExp(`^(?:${pattern})$`);
    for (const value of ["5", "0.5", "10.50"]) assert.match(value, amount);
    for (const value of ["", "0", "-5", "+5", "005", "01.5", "text"])
      assert.doesNotMatch(value, amount);
  }
});

test("duplicate tag comparison is independent of the user's locale", () => {
  assert.doesNotMatch(js, /toLocaleLowerCase/);
});

test("tag fields use native required and length limits", () => {
  for (const id of ["tagInputField", "tagName"]) {
    assert.match(input(id), /required/);
    assert.match(input(id), /maxlength="20"/);
  }
});

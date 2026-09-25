import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../style.css", import.meta.url), "utf8");
const app = readFileSync(new URL("../scripts/app.js", import.meta.url), "utf8");
const storage = readFileSync(new URL("../scripts/localStorage.js", import.meta.url), "utf8");

test("the application has no external runtime assets", () => {
  assert.doesNotMatch(`${html}\n${css}\n${app}\n${storage}`, /(?:https?:)?\/\/(?:[a-z\d-]+\.)+[a-z]{2,}/i);
});

test("Chart.js is stored locally with its license", () => {
  const license = readFileSync(new URL("../vendor/chartjs-LICENSE.md", import.meta.url), "utf8");
  const chart = require("../vendor/chart.umd.min.js");

  assert.match(html, /src="\.\/vendor\/chart\.umd\.min\.js"/);
  assert.equal(chart.version, "4.5.1");
  assert.match(license, /The MIT License/);
});

test("Font Awesome and Poppins are stored locally", () => {
  assert.match(html, /href="\.\/vendor\/fontawesome\/css\/fontawesome\.min\.css"/);
  assert.match(html, /class="fa-solid fa-plus"/);
  assert.match(css, /font-family: "Poppins", sans-serif/);

  for (const asset of [
    "../vendor/fontawesome/css/fontawesome.min.css",
    "../vendor/fontawesome/css/solid.min.css",
    "../vendor/fontawesome/css/regular.min.css",
    "../vendor/fontawesome/webfonts/fa-solid-900.woff2",
    "../vendor/fontawesome/webfonts/fa-regular-400.woff2",
    "../vendor/poppins/poppins-latin-400-normal.woff2",
    "../vendor/poppins/poppins-latin-500-normal.woff2",
    "../vendor/poppins/poppins-latin-600-normal.woff2",
    "../vendor/poppins/poppins-latin-700-normal.woff2",
    "../vendor/poppins/poppins-latin-800-normal.woff2",
  ]) {
    assert.ok(readFileSync(new URL(asset, import.meta.url)).byteLength > 100);
  }
});

test("local stylesheets only reference bundled font files", () => {
  for (const stylesheet of [
    "../style.css",
    "../vendor/fontawesome/css/solid.min.css",
    "../vendor/fontawesome/css/regular.min.css",
  ]) {
    const stylesheetUrl = new URL(stylesheet, import.meta.url);
    const source = readFileSync(stylesheetUrl, "utf8");

    for (const [, asset] of source.matchAll(/url\(["']?([^"'()]+)["']?\)/g)) {
      assert.ok(readFileSync(new URL(asset, stylesheetUrl)).byteLength > 100);
    }
  }
});

test("local icons keep their accessible button structure", () => {
  assert.match(html, /<button class="mobile-add-btn" aria-label="[^"]+"><i class="fa-solid fa-plus" aria-hidden="true"><\/i><\/button>/);
  assert.match(app, /<div class="trans-item-btn">\s*<button id="transEdit" aria-label="Edit expense"><i class="fa-regular fa-pen-to-square" aria-hidden="true"><\/i><\/button>\s*<button id="transDelete" aria-label="Delete expense"><i class="fa-regular fa-trash-can" aria-hidden="true"><\/i><\/button>/s);
});

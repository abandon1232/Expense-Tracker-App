import assert from "node:assert/strict";
import test from "node:test";
import { MAX_AMOUNT, getChartState, parseAmount } from "../scripts/money.js";

test("amounts must be finite and within the supported maximum", () => {
  assert.equal(parseAmount("999999999.99"), MAX_AMOUNT);
  assert.equal(parseAmount("1000000000"), null);
  assert.equal(parseAmount("9".repeat(400)), null);
});

test("an empty chart uses a visible placeholder", () => {
  assert.deepEqual(getChartState(0, 0), {
    data: [1],
    empty: true,
  });
});

test("chart data ignores invalid and negative values", () => {
  assert.deepEqual(getChartState(Infinity, -10), {
    data: [1],
    empty: true,
  });
  assert.deepEqual(getChartState(75, 25), {
    data: [75, 25],
    empty: false,
  });
});

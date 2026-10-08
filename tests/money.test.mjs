import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_AMOUNT,
  getExpenseTotal,
  getChartState,
  parseAmount,
  updateBudgetForIncome,
} from "../scripts/money.js";

test("amounts must be finite and within the supported maximum", () => {
  assert.equal(parseAmount("999999999.99"), MAX_AMOUNT);
  assert.equal(parseAmount("1000000000"), null);
  assert.equal(parseAmount("9".repeat(400)), null);
});

test("income changes the budget without exceeding the supported maximum", () => {
  assert.equal(updateBudgetForIncome(500, 0, 200), 700);
  assert.equal(updateBudgetForIncome(700, 200, 300), 800);
  assert.equal(updateBudgetForIncome(700, 200, 0), 500);
  assert.equal(updateBudgetForIncome(900000000, 0, 200000000), null);
});

test("income records are not counted as expenses", () => {
  assert.equal(
    getExpenseTotal([
      { amount: 50 },
      { amount: 25, type: "expense" },
      { amount: 200, type: "income" },
    ]),
    75
  );
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

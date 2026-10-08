export const MAX_AMOUNT = 999999999.99;

export function parseAmount(value) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 && amount <= MAX_AMOUNT
    ? amount
    : null;
}

export function getChartState(expense, budgetLeft) {
  const safeExpense = Number.isFinite(expense) && expense > 0 ? expense : 0;
  const safeBudgetLeft =
    Number.isFinite(budgetLeft) && budgetLeft > 0 ? budgetLeft : 0;
  const empty = safeExpense === 0 && safeBudgetLeft === 0;

  return {
    data: empty ? [1] : [safeExpense, safeBudgetLeft],
    empty,
  };
}

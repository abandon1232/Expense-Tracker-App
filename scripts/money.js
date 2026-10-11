export const MAX_AMOUNT = 999999999.99;

function toCents(amount) {
  return Math.round(amount * 100);
}

function fromCents(cents) {
  return cents / 100;
}

export function parseAmount(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  const cents = toCents(amount);
  return cents > 0 && cents <= toCents(MAX_AMOUNT)
    ? fromCents(cents)
    : null;
}

export function updateBudgetForIncome(currentBudget, previousAmount, nextAmount) {
  const current = Number(currentBudget);
  const previous = Number(previousAmount);
  const next = Number(nextAmount);
  if (
    !Number.isFinite(current) ||
    !Number.isFinite(previous) ||
    !Number.isFinite(next) ||
    current < 0 ||
    previous < 0 ||
    next < 0
  ) {
    return null;
  }

  const totalCents = toCents(current) - toCents(previous) + toCents(next);

  return totalCents >= 0 && totalCents <= toCents(MAX_AMOUNT)
    ? fromCents(totalCents)
    : null;
}

export function getExpenseTotal(transactions = []) {
  const totalCents = transactions.reduce((total, transaction) => {
    if (transaction?.type === "income") {
      return total;
    }

    const amount = parseAmount(transaction?.amount);
    return total + (amount === null ? 0 : toCents(amount));
  }, 0);

  return fromCents(totalCents);
}

export function getBudgetLeft(totalBudget, totalExpense) {
  const budget = Number(totalBudget);
  const expense = Number(totalExpense);
  if (!Number.isFinite(budget) || !Number.isFinite(expense)) {
    return null;
  }

  return fromCents(toCents(budget) - toCents(expense));
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

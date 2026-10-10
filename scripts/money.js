export const MAX_AMOUNT = 999999999.99;

export function parseAmount(value) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 && amount <= MAX_AMOUNT
    ? amount
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

  const total = current - previous + next;

  return total >= 0 && total <= MAX_AMOUNT ? total : null;
}

export function getExpenseTotal(transactions = []) {
  return transactions.reduce((total, transaction) => {
    if (transaction?.type === "income") {
      return total;
    }

    return total + (parseAmount(transaction?.amount) ?? 0);
  }, 0);
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

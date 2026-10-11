const EMPTY_CHART_COLOR = "#d8d8d8";
const EXPENSE_COLOR = "#F38181";
const BUDGET_LEFT_COLOR = "#297054b0";

function applyChartState(chart, chartContainer, chartEmpty, expense, budgetLeft) {
  const safeExpense = Number.isFinite(expense) && expense > 0 ? expense : 0;
  const safeBudgetLeft =
    Number.isFinite(budgetLeft) && budgetLeft > 0 ? budgetLeft : 0;
  const empty = safeExpense === 0 && safeBudgetLeft === 0;

  chartContainer.classList.toggle("chart-empty-state", empty);
  chartEmpty.classList.toggle("chart-empty-visible", empty);
  chart.data.labels = empty ? ["No data"] : ["Expense", "Budget Left"];
  chart.data.datasets[0].data = empty ? [1] : [safeExpense, safeBudgetLeft];
  chart.data.datasets[0].backgroundColor = empty
    ? [EMPTY_CHART_COLOR]
    : [EXPENSE_COLOR, BUDGET_LEFT_COLOR];
}

export function createExpenseChart(
  ctx,
  chartContainer,
  chartEmpty,
  expense,
  budgetLeft
) {
  const chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });

  updateExpenseChart(chart, chartContainer, chartEmpty, expense, budgetLeft);
  return chart;
}

export function updateExpenseChart(
  chart,
  chartContainer,
  chartEmpty,
  expense,
  budgetLeft
) {
  applyChartState(chart, chartContainer, chartEmpty, expense, budgetLeft);
  chart.update();
}

export function createTransactionHTML(transaction = {}) {
  const isIncome = transaction?.type === "income";
  const sign = isIncome ? "+" : "-";

  return `<div class="trans-item${isIncome ? " trans-income" : ""}" id="${transaction?.id}">
  <div>
      <h4>${sign}<span name="currency"></span>${transaction?.amount}</h4>
      <div class="tranTagContainer">
        <p>${transaction?.tag}</p>
        <p class="trans-date">${new Date(transaction?.time).toLocaleString()}</p>
      </div>
  </div>
  <p class="trans-date">${new Date(transaction?.time).toLocaleString()}</p>
  <div class="trans-item-btn">
      <button class="trans-edit" aria-label="Edit transaction"><i class="fa-regular fa-pen-to-square" aria-hidden="true"></i></button>
      <button class="trans-delete" aria-label="Delete transaction"><i class="fa-regular fa-trash-can" aria-hidden="true"></i></button>
  </div>
  </div>`;
}

export function renderTransactionHistory(
  transactions = [],
  historyContainer,
  emptyState,
  onCurrencyChange
) {
  historyContainer
    .querySelectorAll(".trans-item")
    .forEach((transactionElement) => transactionElement.remove());

  if (transactions.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;
  transactions.forEach((transaction) => {
    historyContainer.insertAdjacentHTML(
      "beforeend",
      createTransactionHTML(transaction)
    );
  });
  onCurrencyChange();
}

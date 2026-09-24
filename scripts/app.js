import localStorage from "./localStorage.js";

// ---------------------------all data here ------------------------

const colors = {
  red: "#F38181",
  green: "#297054b0",
  yellow: "#FCE38A",
  purple: "#8b8dff",
  lightBlue: "#d2dfff",
};

let totalExpData, totalBudgetLeftData;
let expenseChart;

// ---------------------------------refrense of html element here---------------------------
const ctx = document.getElementById("myChart");
const budgetLeftEle = document.getElementById("budgetLeft");

const currencyEles = document.getElementsByName("currency");
const currencySelectorEle = document.getElementById("currencySelector");
function changeCurrency(){
  for (const currencyEle of currencyEles) {
    currencyEle.textContent = currencySelectorEle.value;
  }
  localStorage.saveCurrency(currencySelectorEle.value);
}

const totalBudgetEle = document.getElementById("totalBudget");
const totalExpEle = document.getElementById("totalExp");
const addExpBtnEle = document.querySelector(".add-exp-btn");
const addBudBtnEle = document.querySelector(".add-bud-btn");
const expForSelectEle = document.querySelector(".exp-for");
const tagContainer = document.querySelector(".tags-conatiner");
let allOptionLabel = document.querySelectorAll(".tags-conatiner label");
const addBtnEle = document.getElementById("addBtn");
const clearBtnEle = document.getElementById("clearBtn");
const transAmountEle = document.getElementById("addAmount");
const expForEle = document.querySelectorAll('[name="expFor"]');
const transHistoryParentEle = document.querySelector(
  ".money-history-container"
);
const mobileAddScreenShowBtn = document.querySelector(".mobile-add-btn");
const moneyAddCardEle = document.querySelector(".add-money-card");
const addNewTagBtnEle = document.getElementById("addTagBtn");
const confirmTagBtnEle = document.getElementById("confirmNewTag");
const tagInputEle = document.querySelector(".tag-input");
const tagInputField = document.getElementById("tagInputField");
const sortTransSelectEle = document.getElementById("sortTrans");
const editCardEle = document.querySelector(".edit-money-card");
const editAmountEle = document.getElementById("editAmount");
const editTagEle = document.getElementById("tagName");
const editTranBtn = document.getElementById("editTranBtn");
const closeEditCardBtn = document.getElementById("closeEdit");
const addAmountCardInfo = document.querySelector(".add-money-card .info");
const editCardInfo = document.querySelector(".edit-money-card .info");

// -----------------------------code logic here --------------------------------

currencySelectorEle.value = localStorage.loadCurrency();

function totalCalculate() {
  const allTrans = localStorage.getAllTrans();
  let total = 0;
  for (let i = 0; i < allTrans.length; i++) {
    total += allTrans[i].amount;
  }
  totalExpEle.textContent = `${total}`;
  const leftBudget = Number(localStorage.getTotalBudget()) - total;
  totalExpData = total;
  totalBudgetLeftData = leftBudget;
  budgetLeftEle.textContent = `${leftBudget}`;
  totalBudgetEle.textContent = localStorage.getTotalBudget();
  updateChart();
}

totalCalculate();

function showInfo(ele, txt = "") {
  ele.parentElement.style.display = "flex";
  ele.textContent = txt;
  ele.closest(".add-money-card, .edit-money-card")?.classList.add("has-error");
}
function hideInfo(ele) {
  ele.textContent = "";
  ele.parentElement.style.display = "none";
  ele.closest(".add-money-card, .edit-money-card")?.classList.remove("has-error", "has-success");
}
function showSuccess(ele, txt) {
  const card = ele.closest(".add-money-card, .edit-money-card");
  ele.parentElement.style.display = "flex";
  ele.textContent = txt;
  card?.classList.remove("has-error");
  card?.classList.add("has-success");
  setTimeout(() => {
    if (ele.textContent === txt) {
      hideInfo(ele);
    }
  }, 2500);
}

function addBudgetInput() {
  if (transAmountEle.value == "") {
    showInfo(addAmountCardInfo, "Please enter budget amount.");
  } else {
    localStorage.setTotalBudget(Number(transAmountEle.value));
    totalCalculate();
    hideInfo(addAmountCardInfo);
  }
}

const showBudgetInput = () => {
  addExpBtnEle.classList.remove("selected-add-exp");
  addBudBtnEle.classList.add("selected-add-bud");
  expForSelectEle.style.display = "none";
  transAmountEle.value = localStorage.getTotalBudget();
  addBtnEle.removeEventListener("click", addTransItem);
  addBtnEle.addEventListener("click", addBudgetInput);
};

const showExpInput = () => {
  addBudBtnEle.classList.remove("selected-add-bud");
  addExpBtnEle.classList.add("selected-add-exp");
  expForSelectEle.style.display = "flex";
  transAmountEle.value = "";
  addBtnEle.removeEventListener("click", addBudgetInput);
  addBtnEle.addEventListener("click", addTransItem);
};

function createTranHTML(obj = {}) {
  return `<div class="trans-item" id="${obj?.id}">
  <div>
      <h4>-<span name="currency"></span>${obj?.amount}</h4>
      <div class="tranTagContainer">
        <p>${obj?.tag}</p>
        <p class="trans-date">${new Date(obj?.time).toLocaleString()}</p>
      </div>
  </div>
  <p class="trans-date">${new Date(obj?.time).toLocaleString()}</p>
  <div class="trans-item-btn">
      <button id="transEdit"><i class="fa-regular fa-pen-to-square"></i></button>
      <button id="transDelete"><i class="fa-regular fa-trash-can"></i></button>
  </div>
  </div>`;
}

localStorage.saveTag("Manik👨‍💻");
localStorage.saveTag("Misc.");    // Default for transactions without a tag

function createTagHTML(str) {
  return `
  <input type="radio" id="${str}" name="expFor" value="${str}">
  <label for="${str}">${str}</label>
  `;
}

function renderTags() {
  tagContainer.innerHTML = ``;
  const tagArray = localStorage.getAllTags();
  if (tagArray == []) {
    return;
  } else {
    tagArray.forEach((tag) => {
      const tagEle = createTagHTML(tag);
      tagContainer.insertAdjacentHTML("afterbegin", tagEle);
    });
  }
  allOptionLabel = document.querySelectorAll(".exp-for label");
  allOptionLabel.forEach((label) => {
    label.addEventListener("click", () => {
      allOptionLabel.forEach((label) => {
        label.style.backgroundColor = colors.lightBlue;
      });
      label.style.backgroundColor = colors.yellow;
    });
  });
}

renderTags();

function addNewTag() {
  const tagValue = tagInputField.value;
  if (tagValue != "") {
    localStorage.saveTag(tagValue);
    renderTags();
  }
  tagInputField.value = "";
  tagInputEle.classList.remove("show");
}

function renderTransHistory(transArr = []) {
  transHistoryParentEle.innerHTML = "";
  if (transArr == []) {
    return;
  } else {
    transArr.forEach((transObj) => {
      const transEle = createTranHTML(transObj);
      transHistoryParentEle.insertAdjacentHTML("beforeend", transEle);
    });
  }
  changeCurrency();
}

renderTransHistory(localStorage.getAllTrans());

function updateChart() {
  if (!expenseChart) {
    return;
  }

  expenseChart.data.datasets[0].data = [
    totalExpData,
    totalBudgetLeftData >= 0 ? totalBudgetLeftData : 0,
  ];
  expenseChart.update();
}

function showChart() {
  expenseChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Expence", "Buget Left"],
      datasets: [
        {
          data: [
            totalExpData,
            totalBudgetLeftData >= 0 ? totalBudgetLeftData : 0,
          ],
          backgroundColor: [colors.red, colors.green],
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
}

function findChekedTag(arr) {
  let checkedTag = undefined;
  arr.forEach((tag) => {
    if (tag.checked) {
      checkedTag = tag;
    }
  });

  return checkedTag;
}

function addTransItem() {
  const amountEle = document.getElementById("addAmount");
  const checkedTag = findChekedTag(
    Array.from(document.querySelectorAll('[name="expFor"]'))
  );
  const amount = amountEle.value;
  // If a tag is selected -> grab value, if not assign "Misc." tag
  const checkedTagValue = checkedTag ? checkedTag.value : "Misc.";

  if (amount && Number(amount) > 0) {
    let transObj = {
      id: Math.floor(Math.random() * 10000000),
      amount: Number(amount),
      tag: checkedTagValue,
      time: new Date().toISOString(),
    };
    localStorage.saveTrans(transObj);
    renderTransHistory(localStorage.getAllTrans());
    addTranBtnEvent();
    totalCalculate();
    showSuccess(addAmountCardInfo, "Expense added.");
  } else {
    if (amount == "" || Number(amount) <= 0) {
      showInfo(addAmountCardInfo, "Please enter proper amount.");
    } else if (checkedTagValue == undefined) {
      showInfo(addAmountCardInfo, "Please select a tag.");
    }
  }

  amountEle.value = "";
  if (checkedTag) {
    checkedTag.checked = false;
    const checkedLabel = document.querySelector(`[for="${checkedTag.id}"]`);
    checkedLabel.style.backgroundColor = colors.lightBlue;
  }
}

function clearInputForm() {
  transAmountEle.value = "";
  Array.from(document.querySelectorAll('[name="expFor"]')).forEach((input) => {
    input.checked = false;
  });
  document.querySelectorAll(".tags-conatiner label").forEach((label) => {
    label.style.backgroundColor = `${colors.lightBlue}`;
  });
  hideInfo(addAmountCardInfo);
}

function addTranBtnEvent() {
  document.querySelectorAll(".trans-item").forEach((item) => {
    item.lastElementChild.lastElementChild.addEventListener("click", () => {
      const sure = window.confirm("Are you really wanna delete this?");
      if (sure) {
        localStorage.deleteTrans(item.id);
        renderTransHistory(localStorage.getAllTrans());
        addTranBtnEvent();
        totalCalculate();
      }
    });
    item.lastElementChild.firstElementChild.addEventListener("click", () => {
      const tranObj = localStorage.findTran(item.id);
      editAmountEle.value = "";
      editTagEle.value = "";
      editCardEle.style.display = "flex";
      editAmountEle.value = tranObj?.amount;
      editTagEle.value = tranObj?.tag;
      editCardEle.id = tranObj?.id;
    });
  });
}

function editTran() {
  if (
    editAmountEle.value != "" &&
    Number(editAmountEle.value) > 0 &&
    editTagEle.value != ""
  ) {
    const transObj = {
      id: Number(editCardEle.id),
      amount: Number(editAmountEle.value),
      tag: editTagEle.value,
    };
    localStorage.saveTrans(transObj);
    renderTransHistory(localStorage.getAllTrans());
    addTranBtnEvent();
    totalCalculate();
    editAmountEle.value = "";
    editTagEle.value = "";
    showSuccess(editCardInfo, "Expense updated.");
    setTimeout(() => {
      editCardEle.style.display = "none";
      hideInfo(editCardInfo);
    }, 1200);
    return;
  } else {
    showInfo(editCardInfo, "Please enter proper value.");
  }

  editCardEle.style.display = "none";
}

const sortTransHelper = (arr = [], sortTypeNum) => {
  let sortedArray;
  if (sortTypeNum == 1) {
    sortedArray = arr.sort((trans1, trans2) => {
      if (trans1?.amount > trans2?.amount) {
        return -1;
      } else if (trans1?.amount < trans2?.amount) {
        return 1;
      } else {
        return 0;
      }
    });
  } else if (sortTypeNum == -1) {
    sortedArray = arr.sort((trans1, trans2) => {
      if (trans1?.amount > trans2?.amount) {
        return 1;
      } else if (trans1?.amount < trans2?.amount) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  return sortedArray;
};

function sortTrans(e) {
  const sortType = e.target.value;
  switch (sortType) {
    case "highToLow":
      renderTransHistory(sortTransHelper(localStorage.getAllTrans(), 1));
      addTranBtnEvent();
      break;
    case "lowToHigh":
      renderTransHistory(sortTransHelper(localStorage.getAllTrans(), -1));
      addTranBtnEvent();
      break;
    default:
      renderTransHistory(localStorage.getAllTrans());
      addTranBtnEvent();
      break;
  }
}

mobileAddScreenShowBtn.addEventListener("click", (e) => {
  moneyAddCardEle.classList.toggle("show");
  mobileAddScreenShowBtn.children[0].classList.toggle("rotatePlus");
});
closeEditCardBtn.addEventListener("click", () => {
  editCardEle.style.display = "none";
  hideInfo(editCardInfo);
});
editTranBtn.addEventListener("click", editTran);
addBudBtnEle.addEventListener("click", showBudgetInput);
addExpBtnEle.addEventListener("click", showExpInput);
addBtnEle.addEventListener("click", addTransItem);
clearBtnEle.addEventListener("click", clearInputForm);
addNewTagBtnEle.addEventListener("click", () => {
  tagInputEle.classList.toggle("show");
});

confirmTagBtnEle.addEventListener("click", addNewTag);
sortTransSelectEle.addEventListener("change", sortTrans);
currencySelectorEle.addEventListener("change", changeCurrency)

addTranBtnEvent();
showChart();

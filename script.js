const form = document.getElementById("quoteForm");
const resetButton = document.getElementById("resetButton");
const errorMessage = document.getElementById("errorMessage");

const riskBox = document.getElementById("riskBox");
const riskStatus = document.getElementById("riskStatus");
const riskMessage = document.getElementById("riskMessage");

const originalProfitEl = document.getElementById("originalProfit");
const originalMarginEl = document.getElementById("originalMargin");
const newMaterialCostEl = document.getElementById("newMaterialCost");
const profitAfterIncreaseEl = document.getElementById("profitAfterIncrease");
const marginAfterIncreaseEl = document.getElementById("marginAfterIncrease");
const profitAfterDiscountEl = document.getElementById("profitAfterDiscount");
const minimumSafeQuoteEl = document.getElementById("minimumSafeQuote");

function getNumber(id) {
  const value = document.getElementById(id).value;
  return Number(value);
}

function formatMoney(value) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatPercent(value) {
  return `${value.toFixed(2)}%`;
}

function setRiskStatus(status) {
  riskBox.classList.remove("neutral", "safe", "warning", "loss");

  if (status === "Safe") {
    riskBox.classList.add("safe");
    riskStatus.textContent = "Safe";
    riskMessage.textContent = "This quote is still above your target profit margin after the cost increase and discount.";
  } else if (status === "Warning") {
    riskBox.classList.add("warning");
    riskStatus.textContent = "Warning";
    riskMessage.textContent = "This quote still has profit, but it is below your target profit margin.";
  } else if (status === "Loss") {
    riskBox.classList.add("loss");
    riskStatus.textContent = "Loss";
    riskMessage.textContent = "This quote may lose money after the cost increase and discount.";
  } else {
    riskBox.classList.add("neutral");
    riskStatus.textContent = "Enter numbers to calculate";
    riskMessage.textContent = "Your result will appear here after calculation.";
  }
}

function resetResults() {
  errorMessage.textContent = "";
  setRiskStatus("Neutral");

  originalProfitEl.textContent = "$0.00";
  originalMarginEl.textContent = "0.00%";
  newMaterialCostEl.textContent = "$0.00";
  profitAfterIncreaseEl.textContent = "$0.00";
  marginAfterIncreaseEl.textContent = "0.00%";
  profitAfterDiscountEl.textContent = "$0.00";
  minimumSafeQuoteEl.textContent = "$0.00";
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  errorMessage.textContent = "";

  const quotedPrice = getNumber("quotedPrice");
  const materialCost = getNumber("materialCost");
  const laborCost = getNumber("laborCost");
  const otherCosts = getNumber("otherCosts");
  const materialIncreasePercent = getNumber("materialIncreasePercent");
  const discountPercent = getNumber("discountPercent");
  const targetMarginPercent = getNumber("targetMarginPercent");

  if (quotedPrice <= 0) {
    errorMessage.textContent = "Please enter a quoted price greater than 0.";
    return;
  }

  if (materialCost < 0 || laborCost < 0 || otherCosts < 0) {
    errorMessage.textContent = "Costs cannot be negative.";
    return;
  }

  if (materialIncreasePercent < 0) {
    errorMessage.textContent = "Material cost increase cannot be negative.";
    return;
  }

  if (discountPercent < 0 || discountPercent >= 100) {
    errorMessage.textContent = "Customer discount must be between 0 and 99.";
    return;
  }

  if (targetMarginPercent < 0 || targetMarginPercent >= 100) {
    errorMessage.textContent = "Target profit margin must be between 0 and 99.";
    return;
  }

  const originalTotalCost = materialCost + laborCost + otherCosts;
  const originalProfit = quotedPrice - originalTotalCost;
  const originalMargin = (originalProfit / quotedPrice) * 100;

  const newMaterialCost = materialCost * (1 + materialIncreasePercent / 100);
  const newTotalCost = newMaterialCost + laborCost + otherCosts;

  const profitAfterIncrease = quotedPrice - newTotalCost;
  const marginAfterIncrease = (profitAfterIncrease / quotedPrice) * 100;

  const discountedPrice = quotedPrice * (1 - discountPercent / 100);
  const profitAfterDiscount = discountedPrice - newTotalCost;
  const marginAfterDiscount = (profitAfterDiscount / discountedPrice) * 100;

  const minimumSafeQuote = newTotalCost / (1 - targetMarginPercent / 100);

  originalProfitEl.textContent = formatMoney(originalProfit);
  originalMarginEl.textContent = formatPercent(originalMargin);
  newMaterialCostEl.textContent = formatMoney(newMaterialCost);
  profitAfterIncreaseEl.textContent = formatMoney(profitAfterIncrease);
  marginAfterIncreaseEl.textContent = formatPercent(marginAfterIncrease);
  profitAfterDiscountEl.textContent = formatMoney(profitAfterDiscount);
  minimumSafeQuoteEl.textContent = formatMoney(minimumSafeQuote);

  if (profitAfterDiscount <= 0) {
    setRiskStatus("Loss");
  } else if (marginAfterDiscount < targetMarginPercent) {
    setRiskStatus("Warning");
  } else {
    setRiskStatus("Safe"); 
  }
});

resetButton.addEventListener("click", function () {
  form.reset();

  document.getElementById("otherCosts").value = 0;
  document.getElementById("materialIncreasePercent").value = 10;
  document.getElementById("discountPercent").value = 0;
  document.getElementById("targetMarginPercent").value = 20;

  resetResults();
});

resetResults();
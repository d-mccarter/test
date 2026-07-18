import "./style.css";

const displayEl = document.getElementById("display");
const expressionEl = document.getElementById("expression");
const keypad = document.getElementById("keypad");

const state = {
  display: "0",
  firstOperand: null,
  operator: null,
  waitingForSecond: false,
  expression: "",
};

function formatNumber(value) {
  if (!Number.isFinite(value)) return "Error";
  const asString = String(value);
  if (asString.includes("e")) return asString;
  const [whole, fraction = ""] = asString.split(".");
  const withCommas = Number(whole).toLocaleString("en-US");
  return fraction ? `${withCommas}.${fraction}` : withCommas;
}

function parseDisplay() {
  return Number(state.display.replace(/,/g, ""));
}

function updateView() {
  displayEl.textContent = state.display;
  expressionEl.textContent = state.expression;
  displayEl.classList.remove("pulse");
  void displayEl.offsetWidth;
  displayEl.classList.add("pulse");

  keypad.querySelectorAll("[data-op]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.op === state.operator && state.waitingForSecond);
  });
}

function inputDigit(digit) {
  if (state.display === "Error") clearAll();

  if (state.waitingForSecond) {
    state.display = digit === "." ? "0." : digit;
    state.waitingForSecond = false;
    updateView();
    return;
  }

  if (digit === ".") {
    if (!state.display.includes(".")) {
      state.display += ".";
    }
    updateView();
    return;
  }

  if (state.display === "0") {
    state.display = digit;
  } else if (state.display.replace(/[^\d]/g, "").length < 12) {
    state.display += digit;
  }

  updateView();
}

function compute(a, b, operator) {
  switch (operator) {
    case "+":
      return a + b;
    case "−":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      return b === 0 ? NaN : a / b;
    default:
      return b;
  }
}

function setOperator(nextOperator) {
  if (state.display === "Error") return;

  const inputValue = parseDisplay();

  if (state.firstOperand === null) {
    state.firstOperand = inputValue;
  } else if (state.operator && !state.waitingForSecond) {
    const result = compute(state.firstOperand, inputValue, state.operator);
    if (!Number.isFinite(result)) {
      state.display = "Error";
      state.firstOperand = null;
      state.operator = null;
      state.waitingForSecond = false;
      state.expression = "";
      updateView();
      return;
    }
    state.firstOperand = result;
    state.display = formatNumber(result);
  }

  state.operator = nextOperator;
  state.waitingForSecond = true;
  state.expression = `${formatNumber(state.firstOperand)} ${nextOperator}`;
  updateView();
}

function equals() {
  if (state.operator === null || state.firstOperand === null || state.waitingForSecond) {
    return;
  }

  const second = parseDisplay();
  const result = compute(state.firstOperand, second, state.operator);

  state.expression = `${formatNumber(state.firstOperand)} ${state.operator} ${formatNumber(second)} =`;

  if (!Number.isFinite(result)) {
    state.display = "Error";
  } else {
    const rounded = Math.round(result * 1e10) / 1e10;
    state.display = formatNumber(rounded);
  }

  state.firstOperand = null;
  state.operator = null;
  state.waitingForSecond = false;
  updateView();
}

function clearAll() {
  state.display = "0";
  state.firstOperand = null;
  state.operator = null;
  state.waitingForSecond = false;
  state.expression = "";
  updateView();
}

function toggleSign() {
  if (state.display === "Error" || state.display === "0") return;
  state.display = state.display.startsWith("-")
    ? state.display.slice(1)
    : `-${state.display}`;
  updateView();
}

function percent() {
  if (state.display === "Error") return;
  const value = parseDisplay() / 100;
  state.display = formatNumber(value);
  updateView();
}

keypad.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.digit !== undefined) {
    inputDigit(button.dataset.digit);
    return;
  }

  if (button.dataset.op) {
    setOperator(button.dataset.op);
    return;
  }

  switch (button.dataset.action) {
    case "clear":
      clearAll();
      break;
    case "sign":
      toggleSign();
      break;
    case "percent":
      percent();
      break;
    case "equals":
      equals();
      break;
  }
});

window.addEventListener("keydown", (event) => {
  const { key } = event;

  if (/\d/.test(key) || key === ".") {
    event.preventDefault();
    inputDigit(key);
    return;
  }

  const opMap = {
    "+": "+",
    "-": "−",
    "*": "×",
    "x": "×",
    "X": "×",
    "/": "÷",
  };

  if (opMap[key]) {
    event.preventDefault();
    setOperator(opMap[key]);
    return;
  }

  if (key === "Enter" || key === "=") {
    event.preventDefault();
    equals();
    return;
  }

  if (key === "Escape" || key === "Delete") {
    event.preventDefault();
    clearAll();
    return;
  }

  if (key === "%") {
    event.preventDefault();
    percent();
  }
});

updateView();

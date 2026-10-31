const currentEl = document.getElementById("current");
const historyEl = document.getElementById("history");

let current = "0";
let previous = "";
let operator = null;
let justEvaluated = false;

const symbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };

function updateDisplay() {
  currentEl.textContent = current;
  historyEl.textContent = operator ? `${previous} ${symbols[operator]}` : "";
}

function appendNumber(num) {
  if (justEvaluated) {
    current = "0";
    justEvaluated = false;
  }
  if (num === "." && current.includes(".")) return;
  current = current === "0" && num !== "." ? num : current + num;
}

function chooseOperator(op) {
  if (operator && !justEvaluated && current !== "") {
    compute();
  }
  operator = op;
  previous = current;
  current = "0";
  justEvaluated = false;
}

function compute() {
  if (!operator) return;
  const a = parseFloat(previous);
  const b = parseFloat(current);
  let result;

  switch (operator) {
    case "+": result = a + b; break;
    case "-": result = a - b; break;
    case "*": result = a * b; break;
    case "/":
      if (b === 0) {
        current = "Error";
        operator = null;
        previous = "";
        justEvaluated = true;
        return;
      }
      result = a / b;
      break;
  }

  current = String(parseFloat(result.toFixed(10)));
  operator = null;
  previous = "";
  justEvaluated = true;
}

function clearAll() {
  current = "0";
  previous = "";
  operator = null;
  justEvaluated = false;
}

function deleteLast() {
  if (justEvaluated || current === "Error") {
    current = "0";
    justEvaluated = false;
    return;
  }
  current = current.length > 1 ? current.slice(0, -1) : "0";
}

function percent() {
  if (current === "Error") return;
  current = String(parseFloat(current) / 100);
}

document.querySelector(".buttons").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (current === "Error" && !btn.dataset.action) current = "0";

  if (btn.dataset.num !== undefined) appendNumber(btn.dataset.num);
  else if (btn.dataset.op) chooseOperator(btn.dataset.op);
  else if (btn.dataset.action === "equals") compute();
  else if (btn.dataset.action === "clear") clearAll();
  else if (btn.dataset.action === "delete") deleteLast();
  else if (btn.dataset.action === "percent") percent();

  updateDisplay();
});

// Keyboard support
document.addEventListener("keydown", (e) => {
  if (current === "Error") current = "0";

  if (/^[0-9.]$/.test(e.key)) appendNumber(e.key);
  else if (["+", "-", "*", "/"].includes(e.key)) chooseOperator(e.key);
  else if (e.key === "Enter" || e.key === "=") { e.preventDefault(); compute(); }
  else if (e.key === "Backspace") deleteLast();
  else if (e.key === "Escape") clearAll();
  else if (e.key === "%") percent();
  else return;

  updateDisplay();
});

updateDisplay();

/**
 * Voice Scientific Calculator
 * Owner: Devender Singh (0.dark.phantom.8@gmail.com)
 * License: Restricted Usage License (See LICENSE.txt)
 */

const display = document.getElementById("display");
const resultBox = document.getElementById("result");
const pad = document.getElementById("pad");
const sciPanel = document.getElementById("scientificPanel");
const historyList = document.getElementById("historyList");
const historyBox = document.getElementById("historyBox");
const menu = document.getElementById("menu");
const menuBtn = document.getElementById("menuBtn");
const voiceToggle = document.getElementById("voiceOutput");

let history = [];
let justCalculated = false;

// Init Theme from LocalStorage
const savedTheme = localStorage.getItem("calc-theme") || "dark";
document.body.className = savedTheme;

/* BUTTON GENERATION */
const buttons = ["7","8","9","⌫","4","5","6","/","1","2","3","*","0",".","(",")","%","+","-","^"];
const sciButtons = ["π","e","√","log","sin","cos","tan"];

buttons.forEach(b => {
    let btn = document.createElement("button");
    btn.textContent = b;
    pad.appendChild(btn);
});

sciButtons.forEach(b => {
    let btn = document.createElement("button");
    btn.textContent = b;
    sciPanel.appendChild(btn);
});

/* INPUT LOGIC */
function insert(val) {
    if (justCalculated && /[0-9.]/.test(val)) {
        display.value = "";
    }
    justCalculated = false;

    // Prevent double decimals in one number
    if (val === ".") {
        let parts = display.value.split(/[+\-*/%^]/);
        if (parts.at(-1).includes(".")) return;
    }

    // Replace operator if last char is an operator
    if (/[+\-*/%^]/.test(val) && /[+\-*/%^]$/.test(display.value)) {
        display.value = display.value.slice(0, -1) + val;
        return;
    }

    display.value += val;
    display.scrollLeft = display.scrollWidth;
}

/* CALCULATION LOGIC */
function calc() {
    try {
        let exp = display.value;
        if (!exp) return;

        // Security: Only allow specific math-related characters
        const safePattern = /^[0-9+\-*/%^.()πe√logsinconstan\s]+$/;
        if (!safePattern.test(exp)) throw new Error("Security Violation");

        // Replacements
        exp = exp.replace(/π/g, "Math.PI")
                 .replace(/e/g, "Math.E")
                 .replace(/\^/g, "**")
                 .replace(/√/g, "Math.sqrt")
                 .replace(/log\(/g, "Math.log10(");

        // Trig: Degree to Radian conversion
        exp = exp.replace(/sin\(([^)]+)\)/g, "Math.sin(($1)*Math.PI/180)");
        exp = exp.replace(/cos\(([^)]+)\)/g, "Math.cos(($1)*Math.PI/180)");
        exp = exp.replace(/tan\(([^)]+)\)/g, "Math.tan(($1)*Math.PI/180)");

        // Safe evaluation
        let res = new Function("return " + exp)();

        // Fix Floating Point Issues (e.g. 0.1+0.2)
        if (!Number.isInteger(res)) res = parseFloat(res.toFixed(10));

        resultBox.innerText = "Result: " + res;
        history.unshift(display.value + " = " + res);
        renderHistory();
        justCalculated = true;

        if (voiceToggle.checked) {
            speechSynthesis.speak(new SpeechSynthesisUtterance("The result is " + res));
        }

    } catch (err) {
        resultBox.innerText = "Error";
        console.error("Calc Error:", err);
    }
}

/* UI HELPERS */
function renderHistory() {
    historyList.innerHTML = "";
    history.slice(0, 10).forEach(h => {
        let li = document.createElement("li");
        li.textContent = h;
        li.onclick = () => display.value = h.split("=")[0].trim();
        historyList.appendChild(li);
    });
}

/* EVENT LISTENERS */
pad.addEventListener("click", e => {
    if (e.target.tagName !== "BUTTON") return;
    let t = e.target.textContent;
    if (t === "⌫") display.value = display.value.slice(0, -1);
    else insert(t);
});

sciPanel.addEventListener("click", e => {
    if (e.target.tagName !== "BUTTON") return;
    let val = e.target.textContent;
    if (val === "π" || val === "e") insert(val);
    else insert(val + "(");
});

document.getElementById("equals").onclick = calc;
document.getElementById("clear").onclick = () => { display.value = ""; resultBox.innerText = "Result:"; };
document.getElementById("clearHistory").onclick = () => { history = []; renderHistory(); };

// Menu and Theme Logic
menuBtn.onclick = (e) => { e.stopPropagation(); menu.classList.toggle("active"); };
document.onclick = () => menu.classList.remove("active");
menu.onclick = e => e.stopPropagation();

document.getElementById("historyToggle").onclick = () => historyBox.classList.toggle("show");
document.getElementById("scienceToggle").onclick = () => sciPanel.classList.toggle("hidden");
document.getElementById("themeToggle").onclick = () => document.getElementById("themeMenu").classList.toggle("hidden");

document.querySelectorAll("[data-theme]").forEach(btn => {
    btn.onclick = () => {
        const theme = btn.dataset.theme;
        document.body.className = theme;
        localStorage.setItem("calc-theme", theme);
    };
});

/* KEYBOARD SUPPORT */
document.addEventListener("keydown", e => {
    if (e.repeat) return;
    let k = e.key;
    if (/[0-9]/.test(k)) insert(k);
    else if (["+","-","*","/","%","^",".","(",")"].includes(k)) insert(k);
    else if (k === "Enter") { e.preventDefault(); calc(); }
    else if (k === "Backspace") display.value = display.value.slice(0, -1);
    else if (k === "Escape") { display.value = ""; resultBox.innerText = "Result:"; }
});

/* ENHANCED VOICE INPUT */
let rec;
if (window.SpeechRecognition || window.webkitSpeechRecognition) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    rec = new SR();
    rec.continuous = false;
    rec.lang = 'en-US';

    rec.onresult = e => {
        let t = e.results[0][0].transcript.toLowerCase()
            .replace(/plus/gi, "+")
            .replace(/minus/gi, "-")
            .replace(/times|multiplied by|into/gi, "*")
            .replace(/divided by/gi, "/")
            .replace(/square root of/gi, "√(")
            .replace(/sine/gi, "sin(")
            .replace(/cosine/gi, "cos(")
            .replace(/tangent/gi, "tan(")
            .replace(/to the power of/gi, "^");
        insert(t);
    };
    
    rec.onerror = () => console.log("Voice recognition error.");
}

document.getElementById("voice").onclick = () => {
    if (rec) {
        rec.start();
        resultBox.innerText = "Listening...";
    } else {
        alert("Speech recognition not supported in this browser.");
    }
};

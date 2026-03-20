// ================= STATE =================
const AppState = {
    expression: "",
    history: [],
    voiceOutput: false,
    scientificMode: false
};

// ================= DOM =================
const display = document.getElementById("display");
const resultBox = document.getElementById("result");
const keypad = document.getElementById("keypad");
const scientific = document.getElementById("scientific");
const historyBox = document.getElementById("historyBox");

// ================= INPUT CONTROLLER =================
const InputController = {

    isOperator(char){
        return "+-*/%^".includes(char);
    },

    insert(value){
        let exp = AppState.expression;
        let last = exp.slice(-1);

        // prevent invalid start
        if(exp === "" && "+*/%^".includes(value)) return;

        // decimal control
        if(value === "."){
            let parts = exp.split(/[+\-*/%^]/);
            if(parts[parts.length-1].includes(".")) return;
        }

        // operator overwrite
        if(this.isOperator(value) && this.isOperator(last)){
            AppState.expression = exp.slice(0,-1) + value;
            UI.updateDisplay();
            return;
        }

        // functions
        if(["sin","cos","tan","log"].includes(value)){
            AppState.expression += value + "(";
        } else {
            AppState.expression += value;
        }

        UI.updateDisplay();
    },

    backspace(){
        AppState.expression = AppState.expression.slice(0,-1);
        UI.updateDisplay();
    },

    clear(){
        AppState.expression = "";
        UI.updateDisplay();
        UI.updateResult("Result:");
    }
};

// ================= CALC ENGINE =================
const CalcEngine = {

    evaluate(exp){

        let expression = exp
        .replace(/π/g,"Math.PI")
        .replace(/e/g,"Math.E")
        .replace(/\^/g,"**")
        .replace(/√/g,"Math.sqrt")
        .replace(/log\(/g,"Math.log10(")
        .replace(/sin\(/g,"Math.sin((Math.PI/180)*")
        .replace(/cos\(/g,"Math.cos((Math.PI/180)*")
        .replace(/tan\(/g,"Math.tan((Math.PI/180)*");

        this.validate(expression);

        return Function('"use strict";return ('+expression+')')();
    },

    validate(expression){
        if(!/^[0-9+\-*/().%^Math\s]*$/.test(expression)){
            throw "Invalid Input";
        }

        let stack = 0;
        for(let c of expression){
            if(c==="(") stack++;
            if(c===")") stack--;
            if(stack<0) throw "Bracket Error";
        }
        if(stack!==0) throw "Bracket Error";
    }
};

// ================= UI =================
const UI = {

    updateDisplay(){
        display.value = AppState.expression;
        display.scrollLeft = display.scrollWidth;
    },

    updateResult(text){
        resultBox.textContent = text;
    },

    renderHistory(){
        historyBox.innerHTML = `<button id="clearHistory">Clear History</button>`;

        AppState.history.forEach(h=>{
            let p = document.createElement("p");
            p.textContent = h;
            p.onclick = ()=> {
                AppState.expression = h.split("=")[0];
                this.updateDisplay();
            };
            historyBox.appendChild(p);
        });

        document.getElementById("clearHistory").onclick = ()=>{
            AppState.history = [];
            this.renderHistory();
        };
    }
};

// ================= ACTIONS =================
function calculate(){
    try{
        let res = CalcEngine.evaluate(AppState.expression);

        UI.updateResult("Result: " + res);

        AppState.history.unshift(AppState.expression + "=" + res);
        UI.renderHistory();

        if(AppState.voiceOutput){
            speechSynthesis.cancel();
            speechSynthesis.speak(new SpeechSynthesisUtterance(res));
        }

    }catch(e){
        UI.updateResult("Error: " + e);
    }
}

// ================= BUTTON INIT =================
function createButtons(arr, container){
    arr.forEach(val=>{
        let b = document.createElement("button");
        b.textContent = val;
        b.onclick = ()=> InputController.insert(val);
        container.appendChild(b);
    });
}

createButtons(
["7","8","9","/","4","5","6","*","1","2","3","-","0",".","+","("],
keypad
);

createButtons(
[")","π","e","^","√","log","sin","cos","tan"],
scientific
);

// ================= CONTROLS =================
document.getElementById("equals").onclick = calculate;
document.getElementById("clear").onclick = InputController.clear.bind(InputController);
document.getElementById("backspace").onclick = InputController.backspace.bind(InputController);

// ================= MENU =================
const menu = document.getElementById("menu");

document.getElementById("menuBtn").onclick = ()=>{
    menu.classList.toggle("active");
};

document.addEventListener("click",(e)=>{
    if(!menu.contains(e.target) && e.target.id!=="menuBtn"){
        menu.classList.remove("active");
    }
});

document.getElementById("toggleSci").onclick = ()=>{
    AppState.scientificMode = !AppState.scientificMode;
    keypad.classList.toggle("hidden");
    scientific.classList.toggle("hidden");
};

document.getElementById("toggleHistory").onclick = ()=>{
    historyBox.classList.toggle("hidden");
};

document.getElementById("toggleVoice").onclick = ()=>{
    AppState.voiceOutput = !AppState.voiceOutput;
};

document.getElementById("toggleTheme").onclick = ()=>{
    document.getElementById("themeBox").classList.toggle("hidden");
};

document.querySelectorAll("[data-theme]").forEach(btn=>{
    btn.onclick = ()=>{
        document.body.className = btn.dataset.theme;
    };
});

// ================= KEYBOARD =================
document.addEventListener("keydown", e=>{

    if(e.repeat) return;

    if(/[0-9]/.test(e.key)) InputController.insert(e.key);
    else if("+-*/().%^".includes(e.key)) InputController.insert(e.key);

    else if(e.key==="Enter"){
        e.preventDefault();
        calculate();
    }
    else if(e.key==="Backspace"){
        e.preventDefault();
        InputController.backspace();
    }
    else if(e.key==="Escape"){
        InputController.clear();
    }
});

// ================= VOICE =================
let rec;

if(window.SpeechRecognition || window.webkitSpeechRecognition){
    rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    rec.onresult = e=>{
        let t = e.results[0][0].transcript.toLowerCase();

        t = t.replace(/plus/g,"+")
             .replace(/minus/g,"-")
             .replace(/multiply|into/g,"*")
             .replace(/divide/g,"/")
             .replace(/power/g,"^")
             .replace(/pi/g,"π");

        InputController.insert(t);
    };
}

document.getElementById("voice").onclick = ()=>{
    if(rec) rec.start();
};

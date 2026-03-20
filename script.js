// STATE
const AppState = {
expression: "",
history: [],
voiceOutput: false,
scientificMode: false
};

// DOM
const display = document.getElementById("display");
const resultBox = document.getElementById("result");
const keypad = document.getElementById("keypad");
const scientific = document.getElementById("scientific");
const historyBox = document.getElementById("historyBox");
const menu = document.getElementById("menu");

// INIT
window.onload = ()=>{
renderButtons();
UI.update();
};

// INPUT
const Input = {

isOperator(c){ return "+-*/%^".includes(c); },

insert(val){

// NEW SCIENTIFIC HANDLING
if(val === "ln") val = "ln(";
if(val === "|x|") val = "abs(";
if(val === "x²") val = "^2";
if(val === "x³") val = "^3";
if(val === "1/x") val = "1/(";

let exp = AppState.expression;
let last = exp.slice(-1);

if(exp==="" && "+*/%^".includes(val)) return;

if(val==="."){
let parts = exp.split(/[+\-*/%^]/);
if(parts[parts.length-1].includes(".")) return;
}

if(this.isOperator(val) && this.isOperator(last)){
AppState.expression = exp.slice(0,-1)+val;
UI.update();
return;
}

if(["sin","cos","tan","log","ln"].includes(val)){
AppState.expression += val+"(";
}else{
AppState.expression += val;
}

UI.update();
},

backspace(){
AppState.expression = AppState.expression.slice(0,-1);
UI.update();
},

clear(){
AppState.expression="";
UI.update();
UI.result("Result:");
}
};

// CALC
const Calc = {

evaluate(exp){

let e = exp
.replace(/π/g,"Math.PI")
.replace(/e/g,"Math.E")
.replace(/\^/g,"**")
.replace(/√/g,"Math.sqrt")
.replace(/log\(/g,"Math.log10(")
.replace(/ln\(/g,"Math.log(")
.replace(/abs\(/g,"Math.abs(")
.replace(/%/g,"/100")
.replace(/sin\(/g,"Math.sin((Math.PI/180)*")
.replace(/cos\(/g,"Math.cos((Math.PI/180)*")
.replace(/tan\(/g,"Math.tan((Math.PI/180)*");

return Function('"use strict";return ('+e+')')();
}
};

// UI
const UI = {

update(){
display.value = AppState.expression;
display.scrollLeft = display.scrollWidth;
},

result(txt){
resultBox.textContent = txt;
},

renderHistory(){
historyBox.innerHTML = `<button id="clearHistory">Clear History</button>`;

AppState.history.forEach(h=>{
let p=document.createElement("p");
p.textContent=h;
p.onclick=()=>{
AppState.expression=h.split("=")[0];
this.update();
};
historyBox.appendChild(p);
});

document.getElementById("clearHistory").onclick=()=>{
AppState.history=[];
this.renderHistory();
};
}
};

// CALCULATE
function calculate(){
try{
let res = Calc.evaluate(AppState.expression);

UI.result("Result: "+res);

AppState.history.unshift(AppState.expression+"="+res);
UI.renderHistory();

if(AppState.voiceOutput){
speechSynthesis.cancel();
speechSynthesis.speak(new SpeechSynthesisUtterance(res));
}

}catch{
UI.result("Error");
}
}

// BUTTONS
function renderButtons(){

keypad.innerHTML="";
scientific.innerHTML="";

makeButtons(
["7","8","9","/","4","5","6","*","1","2","3","-","0",".","+","("],
keypad
);

makeButtons(
[
")","π","e","^",
"√","log","ln","%",
"sin","cos","tan","|x|",
"x²","x³","1/x","("
],
scientific
);
}

function makeButtons(arr,container){
arr.forEach(v=>{
let b=document.createElement("button");
b.textContent=v;

// TYPE DETECTION
if(!isNaN(v) || v === ".") b.classList.add("num");
else if("+-*/^=".includes(v)) b.classList.add("op");
else b.classList.add("func");

b.onclick=(e)=>{
e.stopPropagation();
Input.insert(v);
};

container.appendChild(b);
});
}

document.getElementById("clear").classList.add("func");
document.getElementById("backspace").classList.add("func");
document.getElementById("voice").classList.add("func");
document.getElementById("equals").classList.add("op");

// CONTROLS
document.getElementById("equals").onclick=(e)=>{e.stopPropagation();calculate();};
document.getElementById("clear").onclick=(e)=>{e.stopPropagation();Input.clear();};
document.getElementById("backspace").onclick=(e)=>{e.stopPropagation();Input.backspace();};

// MENU
document.getElementById("menuBtn").onclick=(e)=>{
e.stopPropagation();
menu.classList.toggle("active");
};

menu.addEventListener("click",(e)=>e.stopPropagation());

document.addEventListener("click",()=>menu.classList.remove("active"));

// TOGGLES
document.getElementById("toggleSci").onclick=(e)=>{
e.stopPropagation();
AppState.scientificMode=!AppState.scientificMode;

keypad.classList.toggle("hidden");
scientific.classList.toggle("hidden");
};

document.getElementById("toggleHistory").onclick=(e)=>{
e.stopPropagation();
historyBox.classList.toggle("hidden");
};

document.getElementById("toggleTheme").onclick=(e)=>{
e.stopPropagation();
document.getElementById("themeBox").classList.toggle("hidden");
};

document.querySelectorAll("[data-theme]").forEach(b=>{
b.onclick=(e)=>{
e.stopPropagation();
document.body.className=b.dataset.theme;
};
});

// VOICE CHECKBOX
const voiceToggle = document.getElementById("voiceToggle");
voiceToggle.addEventListener("change",()=>{
AppState.voiceOutput = voiceToggle.checked;
});

// KEYBOARD
document.addEventListener("keydown",e=>{
if(e.repeat) return;

if(/[0-9]/.test(e.key)) Input.insert(e.key);
else if("+-*/().%^".includes(e.key)) Input.insert(e.key);

else if(e.key==="Enter"){
e.preventDefault();
calculate();
}
else if(e.key==="Backspace"){
e.preventDefault();
Input.backspace();
}
else if(e.key==="Escape"){
Input.clear();
}
});

// VOICE INPUT
let rec;

if(window.SpeechRecognition||window.webkitSpeechRecognition){
rec=new (window.SpeechRecognition||window.webkitSpeechRecognition)();

rec.onresult=e=>{
let t=e.results[0][0].transcript.toLowerCase();

t=t.replace(/plus/g,"+")
.replace(/minus/g,"-")
.replace(/multiply|into/g,"*")
.replace(/divide/g,"/")
.replace(/power/g,"^")
.replace(/pi/g,"π");

Input.insert(t);
};
}

document.getElementById("voice").onclick=(e)=>{
e.stopPropagation();
if(rec) rec.start();
};

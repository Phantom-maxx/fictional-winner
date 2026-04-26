const input = document.getElementById("input");
const resultBox = document.getElementById("result");

let expr = "";
let voiceOn = false;
let sciMode = false;

/* BUTTON DATA */
const keys = [
"7","8","9","/",
"4","5","6","*",
"1","2","3","-",
"0",".","+","="
];

const sciKeys = [
"sin","cos","tan","log",
"ln","π","e","^",
"√","%"
];

/* GENERATE BUTTONS */
function createButtons(arr, container){
container.innerHTML="";
arr.forEach(k=>{
let b=document.createElement("button");
b.innerText=k;

if(!isNaN(k)||k===".") b.classList.add("num");
else if("+-*/=".includes(k)) b.classList.add("op");
else b.classList.add("func");

b.onclick=()=>{
if(k==="=") calculate();
else insert(k);
};

container.appendChild(b);
});
}

createButtons(keys, document.getElementById("keypad"));
createButtons(sciKeys, document.getElementById("scientific"));

/* INPUT */
function insert(val){

let last = expr.slice(-1);

// decimal fix
let parts = expr.split(/[+\-*/]/);
if(val==="." && parts[parts.length-1].includes(".")) return;

// operator overwrite
if("+-*/".includes(val) && "+-*/".includes(last)){
expr = expr.slice(0,-1)+val;
update();
return;
}

// functions
if(["sin","cos","tan","log","ln"].includes(val)){
expr += val+"(";
}else{
expr += val;
}

update();
}

function update(){
input.value = expr;
}

/* CALCULATE */
function calculate(){
try{
let e = expr
.replace(/π/g,"Math.PI")
.replace(/e/g,"Math.E")
.replace(/\^/g,"**")
.replace(/√/g,"Math.sqrt")
.replace(/%/g,"/100")
.replace(/sin\(([^)]+)\)/g,"Math.sin(($1)*Math.PI/180)")
.replace(/cos\(([^)]+)\)/g,"Math.cos(($1)*Math.PI/180)")
.replace(/tan\(([^)]+)\)/g,"Math.tan(($1)*Math.PI/180)")
.replace(/log\(/g,"Math.log10(")
.replace(/ln\(/g,"Math.log(");

let res = Function('"use strict";return ('+e+')')();

resultBox.innerText = res;

if(voiceOn){
speechSynthesis.speak(new SpeechSynthesisUtterance(res));
}

}catch{
resultBox.innerText="Error";
}
}

/* CONTROLS */
document.getElementById("clear").onclick=()=>{
expr="";
update();
resultBox.innerText="0";
};

document.getElementById("back").onclick=()=>{
expr = expr.slice(0,-1);
update();
};

document.getElementById("equals").onclick=calculate;

/* SCI TOGGLE */
document.getElementById("toggleSci").onclick=()=>{
sciMode=!sciMode;
document.getElementById("scientific").classList.toggle("hidden");
};

/* VOICE */
document.getElementById("voiceToggle").onchange=e=>{
voiceOn=e.target.checked;
};

/* KEYBOARD */
document.addEventListener("keydown",e=>{
if(e.repeat) return;

if(/[0-9]/.test(e.key)) insert(e.key);
else if("+-*/.".includes(e.key)) insert(e.key);

if(e.key==="Enter"){
e.preventDefault();
calculate();
}

if(e.key==="Backspace"){
expr=expr.slice(0,-1);
update();
}
});

/* VOICE INPUT */
let rec;

if(window.SpeechRecognition||window.webkitSpeechRecognition){
rec=new (window.SpeechRecognition||window.webkitSpeechRecognition)();

rec.onresult=e=>{
let t=e.results[0][0].transcript
.replace(/plus/g,"+")
.replace(/minus/g,"-")
.replace(/into/g,"*")
.replace(/divide/g,"/");

insert(t);
};
}

document.getElementById("voice").onclick=()=>{
if(rec) rec.start();
};

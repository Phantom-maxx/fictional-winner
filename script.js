const input = document.getElementById("input");
const resultBox = document.getElementById("result");

let expr = "";
let history = [];
let voiceOn = false;

/* ===== KEYPAD ===== */
const keys = [
"7","8","9","/",
"4","5","6","*",
"1","2","3","-",
"0",".","+","="
];

const keypad = document.getElementById("keypad");

keys.forEach(k=>{
let b=document.createElement("button");
b.innerText=k;

if(!isNaN(k)||k===".") b.classList.add("num");
else b.classList.add("op");

b.onclick=()=>{
if(k==="=") calc();
else insert(k);
};

keypad.appendChild(b);
});

/* ===== INPUT ===== */
function insert(val){

let last = expr.slice(-1);

/* decimal fix */
let parts = expr.split(/[+\-*/]/);
if(val==="." && parts[parts.length-1].includes(".")) return;

/* operator overwrite */
if("+-*/".includes(val) && "+-*/".includes(last)){
expr = expr.slice(0,-1)+val;
update();
return;
}

expr += val;
update();
}

function update(){
input.value = expr;
}

/* ===== CALC ===== */
function calc(){
try{
let e = expr
.replace(/π/g,"Math.PI")
.replace(/\^/g,"**")
.replace(/√/g,"Math.sqrt")
.replace(/%/g,"/100");

let res = Function("return "+e)();

resultBox.innerText = res;

history.unshift(expr+"="+res);
renderHistory();

if(voiceOn){
speechSynthesis.speak(new SpeechSynthesisUtterance(res));
}

}catch{
resultBox.innerText="Error";
}
}

/* ===== HISTORY ===== */
function renderHistory(){
let box=document.getElementById("historyList");
box.innerHTML="";

history.forEach(h=>{
let div=document.createElement("div");
div.innerText=h;
div.onclick=()=>{
expr=h.split("=")[0];
update();
};
box.appendChild(div);
});
}

document.getElementById("clearHistory").onclick=()=>{
history=[];
renderHistory();
};

/* ===== MENU ===== */
document.getElementById("menuBtn").onclick=()=>{
document.getElementById("menu").classList.toggle("hidden");
};

document.getElementById("toggleHistory").onclick=()=>{
document.getElementById("history").classList.toggle("hidden");
};

document.getElementById("themeBtn").onclick=()=>{
document.getElementById("themes").classList.toggle("hidden");
};

document.querySelectorAll("[data-theme]").forEach(btn=>{
btn.onclick=()=>{
document.body.className=btn.dataset.theme;
};
});

/* ===== MORE FUNCTIONS ===== */
document.getElementById("moreBtn").onclick=()=>{
document.getElementById("morePanel").classList.toggle("hidden");
};

document.querySelectorAll("#morePanel button").forEach(b=>{
b.onclick=()=>insert(b.dataset.val);
});

/* ===== VOICE ===== */
document.getElementById("voiceToggle").onchange=e=>{
voiceOn=e.target.checked;
};

/* ===== KEYBOARD ===== */
document.addEventListener("keydown",e=>{
if(/[0-9]/.test(e.key)) insert(e.key);
if("+-*/.".includes(e.key)) insert(e.key);

if(e.key==="Enter"){
e.preventDefault();
calc();
}

if(e.key==="Backspace"){
expr=expr.slice(0,-1);
update();
}
});

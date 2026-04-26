const input = document.getElementById("input");
const resultBox = document.getElementById("result");

let expr = "";
let history = [];
let voiceOn = false;
let sciMode = false;

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

expr += val;
update();
}

function update(){
input.value = expr;
}

/* CALC */
function calc(){
try{
let e = expr
.replace(/π/g,"Math.PI")
.replace(/e/g,"Math.E")
.replace(/\^/g,"**")
.replace(/√/g,"Math.sqrt")
.replace(/sin\(/g,"Math.sin(($1)*Math.PI/180)")
.replace(/cos\(/g,"Math.cos(($1)*Math.PI/180)")
.replace(/tan\(/g,"Math.tan(($1)*Math.PI/180)")
.replace(/log\(/g,"Math.log10(")
.replace(/ln\(/g,"Math.log(");

let r = Function("return "+e)();
resultBox.innerText = r;

history.unshift(expr+"="+r);

if(voiceOn){
speechSynthesis.speak(new SpeechSynthesisUtterance(r));
}

}catch{
resultBox.innerText="Error";
}
}

/* BUTTON GEN */
const keys = ["7","8","9","/","4","5","6","*","1","2","3","-","0",".","+","("];
const sci = ["sin","cos","tan","log","ln","π","e","^","√","%"];

function gen(arr,box){
box.innerHTML="";
arr.forEach(k=>{
let b=document.createElement("button");
b.innerText=k;
b.onclick=()=>insert(k);
box.appendChild(b);
});
}

gen(keys, document.getElementById("keypad"));
gen(sci, document.getElementById("scientific"));

/* EVENTS */
document.getElementById("equals").onclick=calc;
document.getElementById("clear").onclick=()=>{expr="";update();};
document.getElementById("back").onclick=()=>{expr=expr.slice(0,-1);update();};

/* MENU */
document.getElementById("menuBtn").onclick=()=>{
document.getElementById("menuBox").classList.toggle("active");
};

/* TOGGLES */
document.getElementById("toggleSci").onclick=()=>{
sciMode=!sciMode;
document.getElementById("scientific").classList.toggle("hidden");
};

document.getElementById("voiceToggle").onchange=e=>voiceOn=e.target.checked;

/* KEYBOARD */
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

/* VOICE INPUT */
let rec = new(window.SpeechRecognition||window.webkitSpeechRecognition)();
rec.onresult=e=>{
let t=e.results[0][0].transcript
.replace(/plus/g,"+")
.replace(/minus/g,"-");
insert(t);
};

document.getElementById("voice").onclick=()=>rec.start();

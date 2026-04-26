// ================= STATE =================
let expression = "";
let voiceOutput = false;
let scientificMode = false;

// ================= DOM =================
const display = document.getElementById("display");
const resultBox = document.getElementById("result");
const sciPanel = document.getElementById("scientific");

// ================= INPUT =================
function insert(val){

// decimal fix
let parts = expression.split(/[+\-*/]/);
if(val==="." && parts[parts.length-1].includes(".")) return;

// operator overwrite
let last = expression.slice(-1);
if("+-*/^".includes(val) && "+-*/^".includes(last)){
expression = expression.slice(0,-1)+val;
update();
return;
}

// scientific functions
if(["sin","cos","tan","log"].includes(val)){
expression += val+"(";
}else{
expression += val;
}

update();
}

function update(){
display.value = expression;
display.scrollLeft = display.scrollWidth;
}

// ================= CALC =================
function calculate(){
try{

let exp = expression;

// constants
exp = exp.replace(/π/g,"Math.PI");

// sqrt
exp = exp.replace(/√/g,"Math.sqrt");

// powers
exp = exp.replace(/\^/g,"**");

// DEGREE FIX (IMPORTANT)
exp = exp.replace(/sin\(([^)]+)\)/g,"Math.sin(($1)*Math.PI/180)");
exp = exp.replace(/cos\(([^)]+)\)/g,"Math.cos(($1)*Math.PI/180)");
exp = exp.replace(/tan\(([^)]+)\)/g,"Math.tan(($1)*Math.PI/180)");

// log
exp = exp.replace(/log\(/g,"Math.log10(");

let result = Function('"use strict";return ('+exp+')')();

resultBox.innerText = result;

// voice output
if(voiceOutput){
speechSynthesis.cancel();
speechSynthesis.speak(new SpeechSynthesisUtterance(result));
}

}catch{
resultBox.innerText = "Error";
}
}

// ================= BUTTON EVENTS =================
document.addEventListener("click",(e)=>{

let val = e.target.innerText;

// keypad / sci
if(e.target.closest("#keypad") || e.target.closest("#scientific")){
if(val==="=") calculate();
else insert(val);
}

// clear
if(e.target.id==="clear"){
expression="";
update();
resultBox.innerText="0";
}

// backspace
if(e.target.id==="backspace"){
expression = expression.slice(0,-1);
update();
}

});

// ================= SCI MODE =================
document.getElementById("toggleSci").onclick = ()=>{
scientificMode = !scientificMode;

sciPanel.classList.toggle("hidden");

// visual feedback
document.getElementById("toggleSci").style.background =
scientificMode ? "#29b6f6" : "";
};

// ================= VOICE =================
document.getElementById("voiceToggle").onchange = (e)=>{
voiceOutput = e.target.checked;
};

// ================= KEYBOARD =================
document.addEventListener("keydown",(e)=>{

if(e.repeat) return;

if(/[0-9]/.test(e.key)) insert(e.key);
else if("+-*/.^".includes(e.key)) insert(e.key);

else if(e.key==="Enter"){
e.preventDefault();
calculate();
}
else if(e.key==="Backspace"){
e.preventDefault();
expression = expression.slice(0,-1);
update();
}
});

// ================= VOICE INPUT =================
let rec;

if(window.SpeechRecognition || window.webkitSpeechRecognition){
rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

rec.onresult = (e)=>{
let t = e.results[0][0].transcript.toLowerCase();

// smarter parsing
t = t.replace(/plus/g,"+")
.replace(/minus/g,"-")
.replace(/multiply|into/g,"*")
.replace(/divide/g,"/")
.replace(/power/g,"^")
.replace(/pi/g,"π");

insert(t);
};
}

document.getElementById("voice").onclick = ()=>{
if(rec) rec.start();
};

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

/* ================= INPUT ================= */

function isOperator(c){
return ["+","-","*","/","%","^"].includes(c);
}

function insert(val){

let text = display.value;
let last = text.slice(-1);

// reset after result
if(justCalculated && /[0-9.]/.test(val)){
display.value="";
text="";
}
justCalculated=false;

// prevent invalid chars
if(!/[0-9+\-*/%^().πe√a-z]/i.test(val)) return;

// decimal fix
if(val === "."){
let parts = text.split(/[+\-*/%^]/);
if(parts[parts.length-1].includes(".")) return;
}

// operator overwrite
if(isOperator(val) && isOperator(last)){
display.value = text.slice(0,-1)+val;
return;
}

// auto add bracket for functions
if(["sin","cos","tan","log"].includes(val)){
display.value += val + "(";
return;
}

display.value += val;
display.scrollLeft = display.scrollWidth;
}

/* ================= CALC ================= */

function calc(){

try{

let exp = display.value;

// constants
exp = exp.replace(/π/g,"Math.PI");
exp = exp.replace(/e/g,"Math.E");

// power
exp = exp.replace(/\^/g,"**");

// sqrt
exp = exp.replace(/√/g,"Math.sqrt");

// log
exp = exp.replace(/log\(/g,"Math.log10(");

// trig in degrees
exp = exp.replace(/sin\(([^)]+)\)/g,"Math.sin(($1)*Math.PI/180)");
exp = exp.replace(/cos\(([^)]+)\)/g,"Math.cos(($1)*Math.PI/180)");
exp = exp.replace(/tan\(([^)]+)\)/g,"Math.tan(($1)*Math.PI/180)");

let result = Function("return "+exp)();

resultBox.innerText = "Result: " + result;

history.unshift(display.value + " = " + result);
renderHistory();

justCalculated = true;

if(voiceToggle.checked){
speechSynthesis.cancel();
speechSynthesis.speak(new SpeechSynthesisUtterance(result));
}

}catch{
resultBox.innerText = "Error";
}

}

/* ================= HISTORY ================= */

function renderHistory(){
historyList.innerHTML="";
history.forEach(h=>{
let li=document.createElement("li");
li.textContent=h;
li.onclick=()=>display.value=h.split("=")[0];
historyList.appendChild(li);
});
}

/* ================= BUTTON INPUT ================= */

pad.addEventListener("click",e=>{
if(e.target.tagName!=="BUTTON") return;

let val = e.target.textContent;

if(val==="⌫"){
display.value = display.value.slice(0,-1);
}
else{
insert(val);
}
});

sciPanel.addEventListener("click",e=>{
if(e.target.tagName!=="BUTTON") return;

let val = e.target.textContent;

if(val==="π" || val==="e"){
insert(val);
}else{
insert(val); // sin cos handled inside insert
}
});

/* ================= CONTROLS ================= */

document.getElementById("equals").onclick = calc;

document.getElementById("clear").onclick = ()=>{
display.value="";
resultBox.innerText="Result:";
};

document.getElementById("clearHistory").onclick = ()=>{
history=[];
renderHistory();
};

/* ================= MENU ================= */

menuBtn.onclick = (e)=>{
e.stopPropagation();
menu.classList.toggle("active");
};

menu.onclick = e=>e.stopPropagation();

document.addEventListener("click", ()=>{
menu.classList.remove("active");
});

document.getElementById("historyToggle").onclick = ()=>{
historyBox.classList.toggle("show");
};

document.getElementById("scienceToggle").onclick = ()=>{
sciPanel.classList.toggle("hidden");
};

document.getElementById("themeToggle").onclick = ()=>{
document.getElementById("themeMenu").classList.toggle("hidden");
};

document.querySelectorAll("[data-theme]").forEach(btn=>{
btn.onclick = ()=>{
document.body.className = btn.dataset.theme;
};
});

/* ================= KEYBOARD ================= */

document.addEventListener("keydown",e=>{

if(e.repeat) return;

let k = e.key;

if(/[0-9]/.test(k)){
insert(k);
}
else if(["+","-","*","/","%","^",".","(",")"].includes(k)){
insert(k);
}
else if(k==="Enter"){
e.preventDefault();
calc();
}
else if(k==="Backspace"){
e.preventDefault();
display.value = display.value.slice(0,-1);
}
else if(k==="Escape"){
display.value="";
resultBox.innerText="Result:";
}

});

/* ================= VOICE ================= */

let recognition;

if(window.SpeechRecognition || window.webkitSpeechRecognition){

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

recognition = new SR();

recognition.lang = "en-US";

recognition.onresult = e=>{
let text = e.results[0][0].transcript;

text = text
.replace(/plus/gi,"+")
.replace(/minus/gi,"-")
.replace(/multiply|into/gi,"*")
.replace(/divide/gi,"/");

insert(text);
};

}

document.getElementById("voice").onclick = ()=>{
if(recognition){
recognition.start();
}else{
alert("Speech not supported");
}
};

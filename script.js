const display = document.getElementById("display");
const resultBox = document.getElementById("result");

const keypad = document.getElementById("keypad");
const scientific = document.getElementById("scientific");
const historyBox = document.getElementById("historyBox");

let voiceOutput = false;
let history = [];
let lastInput = "";

/* BUTTON LAYOUT */
const basic = [
"7","8","9","/",
"4","5","6","*",
"1","2","3","-",
"0",".","+","("
];

const sci = [
")","π","e","^",
"√","log","sin","cos",
"tan"
];

/* CREATE BUTTONS */
function createButtons(arr,container){
arr.forEach(val=>{
let b=document.createElement("button");
b.textContent=val;
b.onclick=()=>insert(val);
container.appendChild(b);
});
}

createButtons(basic,keypad);
createButtons(sci,scientific);

/* INSERT LOGIC */
function insert(val){

let text = display.value;
let last = text.slice(-1);

// decimal control
if(val==="." && /(\d*\.\d*)$/.test(text)) return;

// operator overwrite
if("+-*/^".includes(val) && "+-*/^".includes(last)){
display.value = text.slice(0,-1)+val;
return;
}

// functions
if(["sin","cos","tan","log"].includes(val)){
display.value += val+"(";
return;
}

display.value += val;
}

/* CALCULATE */
function calculate(){

try{
let exp = display.value;

exp = exp.replace(/π/g,"Math.PI");
exp = exp.replace(/e/g,"Math.E");
exp = exp.replace(/\^/g,"**");
exp = exp.replace(/√/g,"Math.sqrt");
exp = exp.replace(/log/g,"Math.log10");

exp = exp.replace(/sin\((.*?)\)/g,"Math.sin(($1)*Math.PI/180)");
exp = exp.replace(/cos\((.*?)\)/g,"Math.cos(($1)*Math.PI/180)");
exp = exp.replace(/tan\((.*?)\)/g,"Math.tan(($1)*Math.PI/180)");

let res = Function("return "+exp)();

resultBox.textContent="Result: "+res;

history.unshift(display.value+"="+res);
renderHistory();

if(voiceOutput){
speechSynthesis.speak(new SpeechSynthesisUtterance(res));
}

}catch{
resultBox.textContent="Error";
}
}

/* HISTORY */
function renderHistory(){
historyBox.innerHTML="";
history.forEach(h=>{
let p=document.createElement("p");
p.textContent=h;
p.onclick=()=>display.value=h.split("=")[0];
historyBox.appendChild(p);
});
}

/* CONTROLS */
document.getElementById("equals").onclick=calculate;

document.getElementById("clear").onclick=()=>{
display.value="";
resultBox.textContent="Result:";
};

document.getElementById("backspace").onclick=()=>{
display.value=display.value.slice(0,-1);
};

/* MENU */
const menu=document.getElementById("menu");
document.getElementById("menuBtn").onclick=()=>{
menu.classList.toggle("active");
};

document.addEventListener("click",(e)=>{
if(!menu.contains(e.target) && e.target.id!=="menuBtn"){
menu.classList.remove("active");
}
});

document.getElementById("toggleSci").onclick=()=>{
scientific.classList.toggle("hidden");
};

document.getElementById("toggleHistory").onclick=()=>{
historyBox.classList.toggle("hidden");
};

document.getElementById("toggleVoice").onclick=()=>{
voiceOutput=!voiceOutput;
};

document.getElementById("toggleTheme").onclick=()=>{
document.getElementById("themeBox").classList.toggle("hidden");
};

document.querySelectorAll("[data-theme]").forEach(btn=>{
btn.onclick=()=>{
document.body.className=btn.dataset.theme;
};
});

/* KEYBOARD FIXED */
document.addEventListener("keydown",e=>{

if(e.repeat) return;

if(/[0-9]/.test(e.key)) insert(e.key);
else if("+-*/().".includes(e.key)) insert(e.key);

else if(e.key==="Enter"){
e.preventDefault();
calculate();
}
else if(e.key==="Backspace"){
e.preventDefault();
display.value=display.value.slice(0,-1);
}
else if(e.key==="Escape"){
display.value="";
resultBox.textContent="Result:";
}
});

/* VOICE INPUT */
let rec;

if(window.SpeechRecognition||window.webkitSpeechRecognition){
rec=new (window.SpeechRecognition||window.webkitSpeechRecognition)();

rec.onresult=e=>{
let t=e.results[0][0].transcript;

t=t.replace(/plus/g,"+")
.replace(/minus/g,"-")
.replace(/multiply/g,"*")
.replace(/divide/g,"/");

insert(t);
};
}

document.getElementById("voice").onclick=()=>{
if(rec) rec.start();
};};

document.getElementById("toggleTheme").onclick=()=>{
document.getElementById("themeOptions").classList.toggle("hidden");
};

document.querySelectorAll("[data-theme]").forEach(btn=>{
btn.onclick=()=>{
document.body.className=btn.dataset.theme;
};
});

/* HISTORY */
function renderHistory(){
historyBox.innerHTML="";
history.forEach(h=>{
let p=document.createElement("p");
p.innerText=h;
p.onclick=()=>display.value=h.split("=")[0];
historyBox.appendChild(p);
});
}

/* VOICE */
let rec;
if(window.SpeechRecognition||window.webkitSpeechRecognition){
rec=new (window.SpeechRecognition||window.webkitSpeechRecognition)();

rec.onresult=e=>{
let t=e.results[0][0].transcript;
t=t.replace(/plus/g,"+").replace(/minus/g,"-");
insert(t);
};
}

document.getElementById("voice").onclick=()=>{
if(rec) rec.start();
else alert("Voice not supported");
};

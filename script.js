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

/* BUTTONS */
const buttons = [
"7","8","9","⌫",
"4","5","6","/",
"1","2","3","*",
"0",".","(",")",
"%","+","-","^"
];

const sciButtons = ["π","e","√","log","sin","cos","tan"];

buttons.forEach(b=>{
let btn=document.createElement("button");
btn.textContent=b;
pad.appendChild(btn);
});

sciButtons.forEach(b=>{
let btn=document.createElement("button");
btn.textContent=b;
sciPanel.appendChild(btn);
});

/* INPUT */
function insert(val){

if(justCalculated && /[0-9.]/.test(val)){
display.value="";
}
justCalculated=false;

if(val==="." ){
let parts=display.value.split(/[+\-*/%^]/);
if(parts.at(-1).includes(".")) return;
}

if(/[+\-*/%^]/.test(val) && /[+\-*/%^]$/.test(display.value)){
display.value=display.value.slice(0,-1)+val;
return;
}

display.value+=val;
display.scrollLeft = display.scrollWidth;
}

/* CALC */
function calc(){
try{
let exp=display.value
.replace(/\^/g,"**")
.replace(/π/g,"Math.PI")
.replace(/e/g,"Math.E")
.replace(/√/g,"Math.sqrt");

let res=Function("return "+exp)();
resultBox.innerText="Result: "+res;

history.unshift(display.value+"="+res);
renderHistory();

justCalculated=true;

if(voiceToggle.checked){
speechSynthesis.cancel();
speechSynthesis.speak(new SpeechSynthesisUtterance(res));
}

}catch{
resultBox.innerText="Error";
}
}

/* HISTORY */
function renderHistory(){
historyList.innerHTML="";
history.forEach(h=>{
let li=document.createElement("li");
li.textContent=h;
li.onclick=()=>display.value=h.split("=")[0];
historyList.appendChild(li);
});
}

/* EVENTS */
pad.addEventListener("click",e=>{
if(e.target.tagName!=="BUTTON")return;
let t=e.target.textContent;
if(t==="⌫") display.value=display.value.slice(0,-1);
else insert(t);
});

sciPanel.addEventListener("click",e=>{
if(e.target.tagName!=="BUTTON")return;
insert(e.target.textContent+"(");
});

document.getElementById("equals").onclick=calc;
document.getElementById("clear").onclick=()=>display.value="";

document.getElementById("clearHistory").onclick=()=>{
history=[];
renderHistory();
};

/* MENU */
menuBtn.onclick=(e)=>{
e.stopPropagation();
menu.classList.toggle("active");
};

document.onclick=()=>menu.classList.remove("active");
menu.onclick=e=>e.stopPropagation();

document.getElementById("historyToggle").onclick=()=>{
historyBox.classList.toggle("show");
};

document.getElementById("scienceToggle").onclick=()=>{
sciPanel.classList.toggle("hidden");
};

document.getElementById("themeToggle").onclick=()=>{
document.getElementById("themeMenu").classList.toggle("hidden");
};

document.querySelectorAll("[data-theme]").forEach(btn=>{
btn.onclick=()=>document.body.className=btn.dataset.theme;
});

/* KEYBOARD */
document.addEventListener("keydown",e=>{
if(e.repeat) return;

let k=e.key;

if(/[0-9]/.test(k)) insert(k);
else if(["+","-","*","/","%","^",".","(",")"].includes(k)) insert(k);

else if(k==="Enter") calc();
else if(k==="Backspace") display.value=display.value.slice(0,-1);
else if(k==="Escape") display.value="";
});

/* VOICE */
let rec;

if(window.SpeechRecognition || window.webkitSpeechRecognition){
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
rec = new SR();

rec.onresult = e=>{
let t=e.results[0][0].transcript
.replace(/plus/gi,"+")
.replace(/minus/gi,"-")
.replace(/into|multiply/gi,"*")
.replace(/divide/gi,"/");

insert(t);
};
}

document.getElementById("voice").onclick=()=>{
if(rec) rec.start();
else alert("Speech not supported");
};

/* HAPTIC + BUTTON FEEDBACK */
if(navigator.vibrate){
document.querySelectorAll("button").forEach(btn=>{
btn.addEventListener("click",()=>navigator.vibrate(10));
});
}

document.querySelectorAll("button").forEach(btn=>{
btn.addEventListener("click",()=>{
btn.style.transform="scale(0.9)";
setTimeout(()=>btn.style.transform="",100);
});
});

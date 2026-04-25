const display = document.getElementById("display");
const resultBox = document.getElementById("result");

let expression = "";
let history = [];
let voiceOutput = false;

/* INSERT */
const Input = {
insert(val){

// decimal fix
let parts = expression.split(/[+\-*/]/);
if(val==="." && parts[parts.length-1].includes(".")) return;

// operator overwrite
let last = expression.slice(-1);
if("+-*/".includes(val) && "+-*/".includes(last)){
expression = expression.slice(0,-1)+val;
update();
return;
}

expression += val;
update();
}
};

/* UPDATE */
function update(){
display.value = expression;
}

/* CALCULATE */
function calculate(){
try{
let exp = expression
.replace(/√/g,"Math.sqrt")
.replace(/%/g,"/100");

let res = Function("return "+exp)();
resultBox.innerText = res;

history.unshift(expression+"="+res);

if(voiceOutput){
speechSynthesis.speak(new SpeechSynthesisUtterance(res));
}

}catch{
resultBox.innerText="Error";
}
}

/* BUTTON EVENTS */
document.querySelectorAll(".num,.op").forEach(btn=>{
btn.onclick=()=>Input.insert(btn.innerText);
});

document.getElementById("equals").onclick=calculate;

document.getElementById("clear").onclick=()=>{
expression="";
update();
resultBox.innerText="0";
};

document.getElementById("backspace").onclick=()=>{
expression = expression.slice(0,-1);
update();
};

/* SCIENTIFIC */
document.getElementById("toggleSci").onclick=()=>{
let sci = document.getElementById("scientific");

if(sci.innerHTML===""){
["sin","cos","tan","log","π","^"].forEach(f=>{
let b=document.createElement("button");
b.innerText=f;
b.onclick=()=>Input.insert(f+"(");
sci.appendChild(b);
});
}

sci.classList.toggle("hidden");
};

/* VOICE */
const toggle = document.getElementById("voiceToggle");
toggle.onchange=()=>voiceOutput=toggle.checked;

/* KEYBOARD */
document.addEventListener("keydown",e=>{
if(e.repeat) return;

if(/[0-9]/.test(e.key)) Input.insert(e.key);
else if("+-*/.".includes(e.key)) Input.insert(e.key);

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

Input.insert(t);
};
}

document.getElementById("voice").onclick=()=>{
if(rec) rec.start();
};

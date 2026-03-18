const display = document.getElementById("display");
const resultBox = document.getElementById("result");

const keypad = document.getElementById("keypad");
const scientific = document.getElementById("scientific");

const historyBox = document.getElementById("history");

let history = [];

/* BUTTONS */
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

basic.forEach(x=>{
let b=document.createElement("button");
b.innerText=x;
keypad.appendChild(b);
});

sci.forEach(x=>{
let b=document.createElement("button");
b.innerText=x;
scientific.appendChild(b);
});

/* INPUT */
function insert(val){
display.value+=val;
}

/* CALC */
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

let res = eval(exp);

resultBox.innerText="Result: "+res;

history.unshift(display.value+"="+res);
renderHistory();

}catch{
resultBox.innerText="Error";
}
}

/* EVENTS */
keypad.onclick=e=>{
if(e.target.tagName==="BUTTON"){
insert(e.target.innerText);
}
};

scientific.onclick=e=>{
if(e.target.tagName==="BUTTON"){
let val=e.target.innerText;

if(["sin","cos","tan","log"].includes(val)){
insert(val+"(");
}else{
insert(val);
}
}
};

document.getElementById("equals").onclick=calculate;

document.getElementById("clear").onclick=()=>{
display.value="";
resultBox.innerText="Result:";
};

/* MENU */
const menu=document.getElementById("menu");
document.getElementById("menuBtn").onclick=()=>{
menu.classList.toggle("active");
};

document.getElementById("toggleSci").onclick=()=>{
scientific.classList.toggle("hidden");
};

document.getElementById("toggleHistory").onclick=()=>{
historyBox.classList.toggle("hidden");
};

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

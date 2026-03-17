const display=document.getElementById("display")
const resultBox=document.getElementById("result")

const historyList=document.getElementById("historyList")
const historyPanel=document.getElementById("historyPanel")

const menu=document.getElementById("menu")
const menuBtn=document.getElementById("menuBtn")

const voiceBtn=document.getElementById("voiceBtn")
const voiceOutput=document.getElementById("voiceOutput")

let history=[]
let justCalculated=false


function insert(val){

if(justCalculated && /[0-9]/.test(val)){
display.value=""
}

justCalculated=false

let text=display.value
let last=text.slice(-1)

if(val==="." ){
let parts=text.split(/[+\-*/]/)
let lastNum=parts[parts.length-1]
if(lastNum.includes(".")) return
}

const ops=["+","-","*","/","^"]

if(ops.includes(val) && ops.includes(last)){
display.value=text.slice(0,-1)+val
return
}

display.value+=val
}


function backspace(){
display.value=display.value.slice(0,-1)
}

function clearAll(){
display.value=""
resultBox.innerText="Result:"
}


function calculate(){

try{

let exp=display.value

exp=exp.replace(/\^/g,"**")
exp=exp.replace(/√/g,"Math.sqrt")
exp=exp.replace(/π/g,"Math.PI")
exp=exp.replace(/e/g,"Math.E")

let result=Function("return "+exp)()

resultBox.innerText="Result: "+result

history.unshift(display.value+" = "+result)
renderHistory()

justCalculated=true

if(voiceOutput.checked){
speechSynthesis.speak(new SpeechSynthesisUtterance(result))
}

}catch{
resultBox.innerText="Error"
}

}


function renderHistory(){

historyList.innerHTML=""

history.forEach(item=>{
let li=document.createElement("li")
li.textContent=item
li.onclick=()=>display.value=item.split("=")[0]
historyList.appendChild(li)
})

}


/* BUTTONS */

document.querySelectorAll(".pad button").forEach(btn=>{
btn.onclick=()=>{
let t=btn.innerText
if(t==="=") calculate()
else if(t==="⌫") backspace()
else if(t==="√") insert("√(")
else insert(t)
}
})

document.getElementById("clearBtn").onclick=clearAll
document.getElementById("clearHistory").onclick=()=>{
history=[]
renderHistory()
}


/* MENU */

menuBtn.onclick=e=>{
e.stopPropagation()
menu.classList.toggle("active")
}

menu.onclick=e=>e.stopPropagation()
document.onclick=()=>menu.classList.remove("active")

document.getElementById("historyToggle").onclick=()=>{
historyPanel.classList.toggle("show")
}

document.getElementById("scienceToggle").onclick=()=>{
document.querySelectorAll(".scientific").forEach(b=>{
b.classList.toggle("hidden")
})
}

document.getElementById("themeToggle").onclick=()=>{
document.getElementById("themeMenu").classList.toggle("hidden")
}

document.querySelectorAll("[data-theme]").forEach(btn=>{
btn.onclick=()=>{
document.body.className=btn.dataset.theme
}
})


/* KEYBOARD */

document.addEventListener("keydown",e=>{
let k=e.key
if(/[0-9]/.test(k)) insert(k)
else if(["+","-","*","/","^",".","(",")"].includes(k)) insert(k)
else if(k==="Enter") calculate()
else if(k==="Backspace"){e.preventDefault();backspace()}
else if(k==="Escape") clearAll()
})


/* SPEECH */

let recognition

if("webkitSpeechRecognition" in window){
recognition=new webkitSpeechRecognition()
recognition.lang="en-US"
recognition.continuous=false

recognition.onresult=e=>{
insert(e.results[0][0].transcript)
}
}

voiceBtn.onclick=()=>{
if(recognition){
recognition.start()
}else{
alert("Speech recognition not supported in this browser")
}
}

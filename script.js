/* KEYBOARD SHORTCUTS */

document.addEventListener("keydown",(e)=>{

let key = e.key
const operators = ["+","-","*","/","^"]

/* NUMBERS */

if(/^[0-9]$/.test(key)){
insert(key)
return
}

/* OPERATORS */

if(operators.includes(key)){
insert(key)
return
}

/* DECIMAL */

if(key === "."){
insert(".")
return
}

/* BRACKETS */

if(key === "(" || key === ")"){
insert(key)
return
}

/* ENTER CALCULATE */

if(key === "Enter"){
e.preventDefault()
calculate()
return
}

/* BACKSPACE */

if(key === "Backspace"){
e.preventDefault()
backspace()
return
}

/* ESC CLEAR */

if(key === "Escape"){
clearAll()
return
}

/* HISTORY */

if(key === "h" || key === "H"){
document.getElementById("historyToggle").click()
}

/* THEME */

if(key === "t" || key === "T"){
document.getElementById("themeToggle").click()
}

/* MENU */

if(key === "m" || key === "M"){
document.getElementById("menuBtn").click()
}

})/*
Developer Signature
Devender
0.dark.phantom.8@gmail.com
*/

const display = document.getElementById("display")
const resultBox = document.getElementById("result")

const buttons = document.querySelectorAll(".pad button")
const voiceBtn = document.getElementById("voiceBtn")

const historyPanel = document.getElementById("historyPanel")
const historyList = document.getElementById("historyList")

const voiceOutputToggle = document.getElementById("voiceOutput")

const menuBtn = document.getElementById("menuBtn")
const menu = document.getElementById("menu")

const themeMenu = document.getElementById("themeMenu")

const sciPad = document.getElementById("sciPad")
const basicPad = document.getElementById("basicPad")

let history=[]

/* =========================
   INSERT WITH VALIDATION
========================= */

function insert(value){

let start = display.selectionStart ?? display.value.length
let end = display.selectionEnd ?? display.value.length
let current = display.value

const operators = ["+","-","*","/","^"]

/* DECIMAL PROTECTION */

if(value === "."){

let left = current.substring(0,start)
let lastNumber = left.split(/[+\-*/^()]/).pop()

if(lastNumber.includes(".")){
return
}

}

/* OPERATOR OVERWRITE */

if(operators.includes(value)){

if(start === 0 && value !== "-") return

let prevChar = current[start-1]

if(operators.includes(prevChar)){

display.value =
current.substring(0,start-1) +
value +
current.substring(start)

display.selectionStart = display.selectionEnd = start
return

}

}

/* NORMAL INSERT */

display.value =
current.substring(0,start) +
value +
current.substring(end)

let pos = start + value.length
display.selectionStart = pos
display.selectionEnd = pos

}

/* =========================
   BACKSPACE
========================= */

function backspace(){

let start = display.selectionStart

if(start>0){

display.value =
display.value.slice(0,start-1) +
display.value.slice(start)

display.selectionStart = display.selectionEnd = start-1

}

}

/* =========================
   CLEAR
========================= */

function clearAll(){

display.value=""
resultBox.innerText="Result:"

}

/* =========================
   CALCULATE
========================= */

function calculate(){

let exp = display.value

try{

exp = exp.replace(/\^/g,"**")
exp = exp.replace(/sin/g,"Math.sin")
exp = exp.replace(/cos/g,"Math.cos")
exp = exp.replace(/tan/g,"Math.tan")
exp = exp.replace(/sqrt/g,"Math.sqrt")
exp = exp.replace(/log/g,"Math.log10")
exp = exp.replace(/ln/g,"Math.log")
exp = exp.replace(/pi/g,"Math.PI")
exp = exp.replace(/e/g,"Math.E")

let result = Function("return "+exp)()

resultBox.innerText="Result: "+result

addHistory(display.value,result)

if(voiceOutputToggle.checked){
speak(result)
}

}catch{

resultBox.innerText="Error"

}

}

/* =========================
   HISTORY
========================= */

function addHistory(exp,res){

history.unshift(exp+" = "+res)

if(history.length>30) history.pop()

renderHistory()

}

function renderHistory(){

historyList.innerHTML=""

history.forEach(item=>{

let li=document.createElement("li")
li.textContent=item

li.onclick=()=>{

display.value=item.split("=")[0]

}

historyList.appendChild(li)

})

}

/* =========================
   BUTTON INPUT
========================= */

buttons.forEach(btn=>{

btn.addEventListener("click",function(){

if(btn.id==="voiceBtn") return

let txt=btn.innerText

if(btn.dataset.op){
insert(btn.dataset.op)
}

else if(btn.dataset.func){
insert(btn.dataset.func)
}

else if(txt==="="){
calculate()
}

else if(txt==="⌫"){
backspace()
}

else if(txt==="C"){
clearAll()
}

else{
insert(txt)
}

})

})

/* =========================
   KEYBOARD SUPPORT
========================= */

document.addEventListener("keydown",(e)=>{

let key=e.key
const operators=["+","-","*","/","^"]

if(/^[0-9]$/.test(key)){
insert(key)
return
}

if(operators.includes(key)){
insert(key)
return
}

if(key==="."){
insert(".")
return
}

if(key==="(" || key===")"){
insert(key)
return
}

if(key==="Enter"){
e.preventDefault()
calculate()
return
}

if(key==="Backspace"){
e.preventDefault()
backspace()
return
}

if(key==="Escape"){
clearAll()
return
}

/* HISTORY */

if(key==="h" || key==="H"){
document.getElementById("historyToggle").click()
}

/* THEME */

if(key==="t" || key==="T"){
document.getElementById("themeToggle").click()
}

/* MENU */

if(key==="m" || key==="M"){
document.getElementById("menuBtn").click()
}

})

/* =========================
   VOICE OUTPUT
========================= */

function speak(text){

speechSynthesis.cancel()

let msg=new SpeechSynthesisUtterance("The result is "+text)

speechSynthesis.speak(msg)

}

/* =========================
   VOICE INPUT
========================= */

let recognition

if('webkitSpeechRecognition' in window){

recognition=new webkitSpeechRecognition()
recognition.lang="en-US"

recognition.onresult=(event)=>{

let speech=event.results[0][0].transcript

insert(speech)

}

}

voiceBtn.onclick=()=>{

if(recognition){
recognition.start()
}

}

/* =========================
   MENU
========================= */

menuBtn.onclick=(e)=>{

e.stopPropagation()

menu.style.display =
menu.style.display==="flex" ? "none":"flex"

}

/* CLOSE MENUS */

document.addEventListener("click",(e)=>{

if(!menu.contains(e.target) && e.target!==menuBtn){

menu.style.display="none"
themeMenu.style.display="none"

}

})

/* HISTORY TOGGLE */

document.getElementById("historyToggle").onclick=()=>{

historyPanel.style.display =
historyPanel.style.display==="block" ? "none":"block"

}

/* SCIENTIFIC PANEL */

document.getElementById("scienceToggle").onclick=()=>{

if(sciPad.classList.contains("hidden")){

sciPad.classList.remove("hidden")
basicPad.classList.add("hidden")

}else{

basicPad.classList.remove("hidden")
sciPad.classList.add("hidden")

}

}

/* THEME MENU */

document.getElementById("themeToggle").onclick=()=>{

themeMenu.style.display =
themeMenu.style.display==="flex" ? "none":"flex"

}

/* APPLY THEME */

document.querySelectorAll("[data-theme]").forEach(btn=>{

btn.onclick=()=>{

document.body.className=btn.dataset.theme

}

})

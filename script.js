/*
Developer Signature
Devender
0.dark.phantom.8@gmail.com
*/

/* ========= ELEMENTS ========= */

const display = document.getElementById("display")
const resultBox = document.getElementById("result")

const buttons = document.querySelectorAll(".pad button")

const menuBtn = document.getElementById("menuBtn")
const menu = document.getElementById("menu")
const themeMenu = document.getElementById("themeMenu")

const historyPanel = document.getElementById("historyPanel")
const historyList = document.getElementById("historyList")

const sciPad = document.getElementById("sciPad")
const basicPad = document.getElementById("basicPad")

const voiceOutputToggle = document.getElementById("voiceOutput")

let history = []

/* ========= CORE INPUT ENGINE ========= */

function insert(value){
display.value += value
}

function backspace(){
display.value = display.value.slice(0,-1)
}

function clearAll(){
display.value = ""
resultBox.innerText = "Result:"
}

function calculate(){

let exp = display.value

if(!exp) return

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

let res = Function("return "+exp)()

resultBox.innerText = "Result: " + res

addHistory(display.value,res)

if(voiceOutputToggle.checked){
speak(res)
}

}catch{

resultBox.innerText = "Error"

}

}

/* ========= HISTORY ========= */

function addHistory(exp,res){

history.unshift(exp + " = " + res)

if(history.length>30) history.pop()

renderHistory()

}

function renderHistory(){

historyList.innerHTML=""

history.forEach(item=>{

let li=document.createElement("li")
li.textContent=item

li.onclick=()=>{

display.value=item.split("=")[0].trim()

}

historyList.appendChild(li)

})

}

/* ========= VOICE OUTPUT ========= */

function speak(text){

if(!window.speechSynthesis) return

speechSynthesis.cancel()

let speech = new SpeechSynthesisUtterance("The result is " + text)

speech.rate = 1
speech.pitch = 1

speechSynthesis.speak(speech)

}

/* ---------- VOICE INPUT ---------- */

let recognition

if('webkitSpeechRecognition' in window){

recognition = new webkitSpeechRecognition()
recognition.lang="en-US"
recognition.continuous=false

recognition.onstart=()=>{
playDing()
}

recognition.onend=()=>{
playDong()
}

recognition.onresult=(event)=>{

let speech = event.results[0][0].transcript

display.value += speech

}

}

voiceBtn.onclick=()=>{

if(!recognition){
alert("Speech recognition not supported")
return
}

recognition.start()

}

/* ---------- SOUNDS ---------- */

function playDing(){
let audio=new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg")
audio.play()
}

function playDong(){
let audio=new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg")
audio.play()
}

/* ========= BUTTON INPUT ========= */

buttons.forEach(btn=>{

btn.addEventListener("click",()=>{

let txt = btn.innerText

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

/* ========= KEYBOARD CONTROLS ========= */

document.addEventListener("keydown",(e)=>{

const key = e.key.toLowerCase()

/* prevent shortcuts when typing in input */
if(document.activeElement === display) return

/* NUMBER INPUT */

if(/[0-9]/.test(key)){
insert(key)
return
}

/* OPERATORS */

if(["+","-","*","/","(",")","."].includes(key)){
insert(key)
return
}

/* POWER */

if(key==="^"){
insert("^")
return
}

/* ENTER = CALCULATE */

if(e.key==="Enter"){
e.preventDefault()
calculate()
return
}

/* BACKSPACE */

if(e.key==="Backspace"){
backspace()
return
}

/* ESC = CLEAR */

if(e.key==="Escape"){
clearAll()
return
}

/* HISTORY TOGGLE */

if(key==="h"){

historyPanel.style.display =
historyPanel.style.display==="block" ? "none":"block"

return
}

/* THEME MENU */

if(key==="t"){

themeMenu.style.display =
themeMenu.style.display==="flex" ? "none":"flex"

return
}

/* MAIN MENU */

if(key==="m"){

menu.style.display =
menu.style.display==="flex" ? "none":"flex"

return
}

})

/* ========= MENU ========= */

menuBtn.onclick=(e)=>{

e.stopPropagation()

menu.style.display =
menu.style.display==="flex" ? "none":"flex"

}

/* ========= CLOSE MENUS WHEN CLICKING OUTSIDE ========= */

document.addEventListener("click",(e)=>{

if(!menu.contains(e.target) && e.target!==menuBtn){

menu.style.display="none"
themeMenu.style.display="none"

}

})

/* ========= THEME ========= */

document.querySelectorAll("[data-theme]").forEach(btn=>{

btn.onclick=()=>{

document.body.className=btn.dataset.theme

}

})

/* ========= HISTORY TOGGLE ========= */

document.getElementById("historyToggle").onclick=()=>{

historyPanel.style.display =
historyPanel.style.display==="block" ? "none":"block"

}

/* ========= SCIENTIFIC PANEL ========= */

document.getElementById("scienceToggle").onclick=()=>{

if(sciPad.classList.contains("hidden")){

sciPad.classList.remove("hidden")
basicPad.classList.add("hidden")

}else{

basicPad.classList.remove("hidden")
sciPad.classList.add("hidden")

}

}

/* ========= THEME MENU ========= */

document.getElementById("themeToggle").onclick=(e)=>{

e.stopPropagation()

themeMenu.style.display =
themeMenu.style.display==="flex" ? "none":"flex"

}

/* ========= MOBILE RESIZE FIX ========= */

function adjustLayout(){

if(window.innerWidth < 600){

historyPanel.style.width="100%"

}

}

window.addEventListener("resize",adjustLayout)

adjustLayout()

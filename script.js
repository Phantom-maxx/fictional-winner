const display = document.getElementById("display")
const resultBox = document.getElementById("result")

const buttons = document.querySelectorAll(".pad button")

const historyPanel = document.getElementById("historyPanel")
const historyList = document.getElementById("historyList")

const menuBtn = document.getElementById("menuBtn")
const menu = document.getElementById("menu")

const sciPad = document.getElementById("sciPad")
const basicPad = document.getElementById("basicPad")

const voiceBtn = document.getElementById("voiceBtn")
const voiceOutputToggle = document.getElementById("voiceOutput")

let history = []

function insert(val){

let start = display.selectionStart
let end = display.selectionEnd
let text = display.value

display.value = text.slice(0,start) + val + text.slice(end)

display.selectionStart = display.selectionEnd = start + val.length
}

function backspace(){

let pos = display.selectionStart

display.value = display.value.slice(0,pos-1) + display.value.slice(pos)

display.selectionStart = display.selectionEnd = pos-1
}

function clearAll(){

display.value = ""
resultBox.innerText = "Result:"
}

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

let result = Function("return " + exp)()

resultBox.innerText = "Result: " + result

history.unshift(display.value + " = " + result)

renderHistory()

if(voiceOutputToggle.checked){

speechSynthesis.cancel()
let msg = new SpeechSynthesisUtterance("The result is " + result)
speechSynthesis.speak(msg)

}

}catch{

resultBox.innerText = "Error"

}

}

function renderHistory(){

historyList.innerHTML = ""

history.forEach(item => {

let li = document.createElement("li")

li.textContent = item

li.onclick = () => display.value = item.split("=")[0]

historyList.appendChild(li)

})

}


/* BUTTON INPUT */

buttons.forEach(btn => {

btn.addEventListener("click", () => {

let txt = btn.innerText

if(btn.dataset.func) insert(btn.dataset.func)
else if(btn.dataset.op) insert(btn.dataset.op)
else if(txt === "=") calculate()
else if(txt === "C") clearAll()
else insert(txt)

})

})


/* KEYBOARD */

document.addEventListener("keydown", e => {

let k = e.key

if(/^[0-9]$/.test(k)) insert(k)

else if(["+","-","*","/","^",".","(",")"].includes(k)) insert(k)

else if(k === "Enter") calculate()

else if(k === "Backspace") backspace()

else if(k === "Escape") clearAll()

else if(k === "h") historyPanel.classList.toggle("show")

else if(k === "m") menu.classList.toggle("active")

})


/* MENU */

menuBtn.onclick = e => {

e.stopPropagation()

menu.classList.toggle("active")

}

menu.onclick = e => e.stopPropagation()

document.onclick = () => menu.classList.remove("active")


document.getElementById("historyToggle").onclick = () =>
historyPanel.classList.toggle("show")

document.getElementById("scienceToggle").onclick = () => {

sciPad.classList.toggle("hidden")

basicPad.classList.toggle("hidden")

}

document.getElementById("themeToggle").onclick = () =>
document.getElementById("themeMenu").classList.toggle("hidden")

document.querySelectorAll("[data-theme]").forEach(btn => {

btn.onclick = () => document.body.className = btn.dataset.theme

})


/* VOICE INPUT */

if("webkitSpeechRecognition" in window){

let recognition = new webkitSpeechRecognition()

recognition.lang = "en-US"

recognition.onresult = e => {

insert(e.results[0][0].transcript)

}

voiceBtn.onclick = () => recognition.start()

}

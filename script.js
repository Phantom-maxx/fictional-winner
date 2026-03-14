const input = document.getElementById("input")
const resultBox = document.getElementById("result")

/* MENU */

function toggleMenu(){
document.getElementById("menu").classList.toggle("hidden")
document.getElementById("overlay").classList.toggle("hidden")
}

function toggleThemes(){
document.getElementById("themes").classList.toggle("hidden")
}

function toggleHistory(){
document.getElementById("historyPanel").classList.toggle("hidden")
}

/* THEMES */

function setTheme(theme){
document.body.className = theme
localStorage.setItem("theme",theme)
}

window.onload = function(){
const savedTheme = localStorage.getItem("theme")
if(savedTheme) document.body.className = savedTheme
loadHistory()
}

/* INPUT */

function append(value){
input.value += value
}

/* OPERATOR OVERWRITE */

function appendOperator(op){
let val = input.value
if(/[+\-*/]$/.test(val)){
input.value = val.slice(0,-1) + op
}else{
input.value += op
}
}

/* DECIMAL CONTROL */

function appendDecimal(){
let parts = input.value.split(/[+\-*/]/)
let last = parts.pop()
if(!last.includes(".")){
input.value += "."
}
}

/* BACKSPACE */

function backspace(){
input.value = input.value.slice(0,-1)
}

/* CLEAR */

function clearInput(){
input.value = ""
resultBox.innerText = "Result:"
}

/* SAFE EXPRESSION VALIDATION */

function isValidExpression(expr){

/* remove allowed math words */

expr = expr
.replace(/Math\.sqrt/g,"")
.replace(/Math\.PI/g,"")
.replace(/Math\.E/g,"")

/* after removing allowed functions,
no letters should remain */

if(/[a-zA-Z]/.test(expr)) return false

/* only allow safe characters */

if(!/^[0-9+\-*/().%^ ]*$/.test(expr)) return false

return true
}

/* CALCULATE */

function calculate(){

let expression = input.value

try{

if(!isValidExpression(expression)){
throw "Invalid input"
}

expression = expression.replace(/\^/g,"**")
expression = expression.replace(/(\d+)%/g,"($1/100)")

let result = Function('"use strict";return (' + expression + ')')()

resultBox.innerText = "Result: " + result

saveHistory(input.value + " = " + result)

}catch{

resultBox.innerText = "Error!"

}

}

/* HISTORY */

function saveHistory(item){

let history = JSON.parse(localStorage.getItem("calcHistory")) || []

history.unshift(item)

if(history.length > 20) history.pop()

localStorage.setItem("calcHistory",JSON.stringify(history))

loadHistory()

}

function loadHistory(){

let history = JSON.parse(localStorage.getItem("calcHistory")) || []

let list = document.getElementById("historyList")

list.innerHTML = ""

history.forEach(h=>{

let li = document.createElement("li")
li.textContent = h

li.onclick = function(){
input.value = h.split("=")[0].trim()
}

list.appendChild(li)

})

}

function clearHistory(){
localStorage.removeItem("calcHistory")
loadHistory()
}

/* VOICE */

function startVoiceInput(){

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

if(!SpeechRecognition){
resultBox.innerText = "Voice not supported"
return
}

const rec = new SpeechRecognition()

rec.start()

rec.onresult = function(e){

let text = e.results[0][0].transcript.toLowerCase()

const map = {
"plus":"+",
"minus":"-",
"times":"*",
"multiplied by":"*",
"divided by":"/",
"over":"/",
"power":"^"
}

Object.keys(map).forEach(k=>{
text = text.replace(new RegExp(k,"g"),map[k])
})

input.value = text

calculate()

}

}

/* BLOCK LETTER INPUT FROM KEYBOARD */

input.addEventListener("keypress", function(e){

if(/[a-zA-Z]/.test(e.key)){
e.preventDefault()
}

})

/* KEYBOARD + NUMPAD SUPPORT */

document.addEventListener("keydown", function(e){

const key = e.key

/* numbers */

if(/^[0-9]$/.test(key)){
append(key)
}

/* numpad numbers */

else if(e.code.startsWith("Numpad") && !isNaN(key)){
append(key)
}

/* operators */

else if(["+","-","*","/"].includes(key)){
appendOperator(key)
}

/* numpad operators */

else if(e.code === "NumpadAdd") appendOperator("+")
else if(e.code === "NumpadSubtract") appendOperator("-")
else if(e.code === "NumpadMultiply") appendOperator("*")
else if(e.code === "NumpadDivide") appendOperator("/")

/* decimal */

else if(key === "." || e.code === "NumpadDecimal"){
appendDecimal()
}

/* parentheses */

else if(key === "(" || key === ")"){
append(key)
}

/* power */

else if(key === "^"){
append("^")
}

/* percent */

else if(key === "%"){
append("%")
}

/* enter */

else if(key === "Enter" || e.code === "NumpadEnter"){
e.preventDefault()
calculate()
}

/* backspace */

else if(key === "Backspace"){
e.preventDefault()
backspace()
}

/* escape */

else if(key === "Escape"){
clearInput()
}

/* shortcuts */

else if(key.toLowerCase() === "m"){
toggleMenu()
}

else if(key.toLowerCase() === "h"){
toggleHistory()
}

else if(key.toLowerCase() === "t"){
toggleThemes()
}

/* history panel */

else if(key === "ArrowUp"){
document.getElementById("historyPanel").classList.remove("hidden")
}

else if(key === "ArrowDown"){
document.getElementById("historyPanel").classList.add("hidden")
}

})

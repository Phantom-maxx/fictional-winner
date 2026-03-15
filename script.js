/*
Developer Signature
Devender
0.dark.phantom.8@gmail.com
*/

const display=document.getElementById("display")
const resultBox=document.getElementById("result")

const buttons=document.querySelectorAll(".pad button")

const historyPanel=document.getElementById("historyPanel")
const historyList=document.getElementById("historyList")

const menuBtn=document.getElementById("menuBtn")
const menu=document.getElementById("menu")

const sciPad=document.getElementById("sciPad")
const basicPad=document.getElementById("basicPad")

const voiceBtn=document.getElementById("voiceBtn")
const voiceOutputToggle=document.getElementById("voiceOutput")

let history=[]


function insert(val){

let start=display.selectionStart
let end=display.selectionEnd
let text=display.value

const ops=["+","-","*","/","^"]

if(val=="."){
let left=text.substring(0,start)
let last=left.split(/[+\-*/^()]/).pop()
if(last.includes(".")) return
}

if(ops.includes(val)){
let prev=text[start-1]
if(ops.includes(prev)){
display.value=text.substring(0,start-1)+val+text.substring(start)
display.selectionStart=display.selectionEnd=start
return
}
}

display.value=text.substring(0,start)+val+text.substring(end)
display.selectionStart=display.selectionEnd=start+val.length

}


function backspace(){

let pos=display.selectionStart

if(pos>0){

display.value=display.value.slice(0,pos-1)+display.value.slice(pos)
display.selectionStart=display.selectionEnd=pos-1

}

}


function clearAll(){
display.value=""
resultBox.innerText="Result:"
}


function calculate(){

let exp=display.value

try{

exp=exp.replace(/\^/g,"**")
exp=exp.replace(/sin/g,"Math.sin")
exp=exp.replace(/cos/g,"Math.cos")
exp=exp.replace(/tan/g,"Math.tan")
exp=exp.replace(/sqrt/g,"Math.sqrt")
exp=exp.replace(/log/g,"Math.log10")
exp=exp.replace(/ln/g,"Math.log")
exp=exp.replace(/pi/g,"Math.PI")
exp=exp.replace(/e/g,"Math.E")

let result=Function("return "+exp)()

resultBox.innerText="Result: "+result

history.unshift(display.value+" = "+result)

renderHistory()

if(voiceOutputToggle.checked) speak(result)

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


/* BUTTON INPUT */

buttons.forEach(btn=>{

const action=()=>{

const txt=btn.innerText

if(btn.dataset.func) insert(btn.dataset.func)
else if(btn.dataset.op) insert(btn.dataset.op)
else if(txt==="=") calculate()
else if(txt==="C") clearAll()
else insert(txt)

}

btn.addEventListener("click",action)

btn.addEventListener("touchstart",e=>{
e.preventDefault()
action()
})

})


/* KEYBOARD INPUT */

document.addEventListener("keydown",e=>{

let k=e.key
const ops=["+","-","*","/","^"]

if(/^[0-9]$/.test(k)){e.preventDefault();insert(k)}
else if(ops.includes(k)){e.preventDefault();insert(k)}
else if(k=="."){e.preventDefault();insert(".")}
else if(k==="("||k===")"){e.preventDefault();insert(k)}

else if(k==="Enter"){e.preventDefault();calculate()}
else if(k==="Backspace"){e.preventDefault();backspace()}
else if(k==="Escape"){e.preventDefault();clearAll()}

else if(k==="h") document.getElementById("historyToggle").click()
else if(k==="t") document.getElementById("themeToggle").click()
else if(k==="m") menuBtn.click()

})


/* VOICE OUTPUT */

function speak(txt){

speechSynthesis.cancel()
let msg=new SpeechSynthesisUtterance("The result is "+txt)
speechSynthesis.speak(msg)

}


/* VOICE INPUT */

let recognition

if("webkitSpeechRecognition" in window){

recognition=new webkitSpeechRecognition()

recognition.lang="en-US"

recognition.onresult=e=>{

insert(e.results[0][0].transcript)

}

}

voiceBtn.onclick=()=>recognition?.start()


/* MENU */

menuBtn.onclick=e=>{
e.stopPropagation()
menu.classList.toggle("active")
}

document.addEventListener("click",e=>{
if(!menu.contains(e.target)&&e.target!==menuBtn)
menu.classList.remove("active")
})


document.getElementById("historyToggle").onclick=()=>{
historyPanel.classList.toggle("show")
}

document.getElementById("scienceToggle").onclick=()=>{
sciPad.classList.toggle("hidden")
basicPad.classList.toggle("hidden")
}


document.querySelectorAll("[data-theme]").forEach(btn=>{
btn.onclick=()=>document.body.className=btn.dataset.theme
})

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

if(justCalculated && /^[0-9]$/.test(val)){
display.value=""
}

justCalculated=false

let start=display.selectionStart
let end=display.selectionEnd
let text=display.value

display.value=text.slice(0,start)+val+text.slice(end)

display.selectionStart=display.selectionEnd=start+val.length
}


function backspace(){

let pos=display.selectionStart

display.value=
display.value.slice(0,pos-1)+display.value.slice(pos)

display.selectionStart=display.selectionEnd=pos-1
}


function clearAll(){

display.value=""
resultBox.innerText="Result:"
}


function calculate(){

try{

let exp=display.value

exp=exp.replace(/\^/g,"**")
exp=exp.replace(/sqrt/g,"Math.sqrt")
exp=exp.replace(/π/g,"Math.PI")
exp=exp.replace(/e/g,"Math.E")

let result=Function("return "+exp)()

resultBox.innerText="Result: "+result

history.unshift(display.value+" = "+result)

renderHistory()

justCalculated=true

if(voiceOutput.checked){
speechSynthesis.speak(
new SpeechSynthesisUtterance("The result is "+result)
)
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


document.querySelectorAll(".pad button").forEach(btn=>{

btn.addEventListener("click",()=>{

let txt=btn.innerText

if(txt==="=") calculate()

else if(txt==="⌫") backspace()

else if(txt==="√") insert("sqrt(")

else insert(txt)

})

})


document.getElementById("clearBtn").onclick=clearAll


document.getElementById("clearHistory").onclick=()=>{

history=[]
renderHistory()

}


menuBtn.onclick=e=>{
e.stopPropagation()
menu.classList.toggle("active")
}

menu.onclick=e=>e.stopPropagation()

document.onclick=()=>menu.classList.remove("active")


document.getElementById("historyToggle").onclick=()=>{

historyPanel.classList.toggle("show")

}


document.getElementById("themeToggle").onclick=()=>{

document.getElementById("themeMenu").classList.toggle("hidden")

}


document.querySelectorAll("[data-theme]").forEach(btn=>{

btn.onclick=()=>document.body.className=btn.dataset.theme

})


document.addEventListener("keydown",e=>{

let k=e.key

if(/[0-9]/.test(k)) insert(k)

else if(["+","-","*","/","^",".","(",")"].includes(k)) insert(k)

else if(k==="Enter") calculate()

else if(k==="Backspace"){
e.preventDefault()
backspace()
}

else if(k==="Escape") clearAll()

})


if("webkitSpeechRecognition" in window){

let recognition=new webkitSpeechRecognition()

recognition.onresult=e=>{

insert(e.results[0][0].transcript)

}

voiceBtn.onclick=()=>recognition.start()

}

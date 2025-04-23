
const resultDisplay = document.getElementById('result');
const inputField = document.getElementById('input');
const historyList = document.getElementById('historyList');
const historyArea = document.getElementById('historyArea');
let lastInputWasResult = false;
let recognition;

function append(value) {
    if (lastInputWasResult && !isNaN(parseFloat(value))) clearInput();
    inputField.value += value; lastInputWasResult = false;
}
function clearInput() { inputField.value = ''; resultDisplay.textContent = 'Result: '; lastInputWasResult = false; }
function backspace() { inputField.value = inputField.value.slice(0, -1); }
function calculate() {
    try {
        const result = Function("'use strict'; return (" + inputField.value + ")")();
        resultDisplay.textContent = 'Result: ' + result;
        speakResult(result); addToHistory(inputField.value, result);
        lastInputWasResult = true;
    } catch { resultDisplay.textContent = 'Error: Invalid Expression'; speakResult("Error"); }
}
function addToHistory(expr, result) {
    const li = document.createElement('li'); li.textContent = `${expr} = ${result}`;
    historyList.prepend(li); if (historyList.children.length > 10) historyList.removeChild(historyList.lastChild);
}
function toggleDarkMode() { document.body.classList.toggle('dark'); }
function toggleHistory() { historyArea.classList.toggle('active'); }
function toggleMenu() { document.getElementById('menuPanel').classList.toggle('active'); }
function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window)) { alert('Speech recognition not supported.'); return; }
    if (!recognition) {
        recognition = new webkitSpeechRecognition();
        recognition.lang = 'en-US'; recognition.interimResults = false; recognition.maxAlternatives = 1;
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            inputField.value = transcript;
            resultDisplay.textContent = `Heard: ${transcript}`;
            setTimeout(calculate, 500);
        };
        recognition.onerror = (event) => { alert('Speech recognition error: ' + event.error); };
    }
    window.speechSynthesis.speak(new SpeechSynthesisUtterance('Listening...'));
    recognition.start();
}
function speakResult(result) {
    const synth = window.speechSynthesis;
    synth.speak(new SpeechSynthesisUtterance('The result is ' + result));
}
document.addEventListener('keydown', (event) => { if (event.key === "Enter") calculate(); });

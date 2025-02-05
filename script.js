document.addEventListener("keydown", (event) => {
    const key = event.key;
    if (!isNaN(key) || ['+', '-', '*', '/', '(', ')', '.', '%', '^'].includes(key)) {
        append(key);
    } else if (key === 'Enter') {
        calculate();
    } else if (key === 'Backspace') {
        backspace();
    } else if (key === 'Escape') {
        clearInput();
    }
});

function append(value) {
    document.getElementById("input").value += value;
}

function appendDecimal() {
    let input = document.getElementById("input");
    let lastNumber = input.value.split(/[\+\-\*\/\(\)\^%]/).pop();
    if (!lastNumber.includes(".")) {
        input.value += ".";
    }
}

function backspace() {
    let input = document.getElementById("input");
    input.value = input.value.slice(0, -1);
}

function clearInput() {
    document.getElementById("input").value = "";
    document.getElementById("result").innerText = "Result: ";
}

function calculate() {
    let input = document.getElementById("input").value;
    try {
        let result = eval(input.replace("^", "**"));
        document.getElementById("result").innerText = "Result: " + result;
    } catch (error) {
        document.getElementById("result").innerText = "Error!";
    }
}

function startVoiceInput() {
    if ('speechRecognition' in window || 'webkitSpeechRecognition' in window) {
        let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";
        recognition.start();
        
        document.getElementById("result").innerText = "Listening...";
        
        recognition.onresult = function(event) {
            let transcript = event.results[0][0].transcript;
            let replacements = {
                "plus": "+",
                "minus": "-",
                "times": "*",
                "multiplied by": "*",
                "divided by": "/",
                "over": "/",
                "power": "^"
            };
            Object.keys(replacements).forEach((key) => {
                transcript = transcript.replace(new RegExp(key, "gi"), replacements[key]);
            });
            document.getElementById("input").value = transcript;
            calculate();
        };

        recognition.onerror = function() {
            document.getElementById("result").innerText = "Speech recognition failed.";
        };
    } else {
        document.getElementById("result").innerText = "Speech recognition not supported.";
    }
}

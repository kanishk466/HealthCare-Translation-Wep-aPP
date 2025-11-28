
document.addEventListener("DOMContentLoaded", () => {


const recordBtn = document.getElementById("record-btn");

const pulseRing = document.getElementById("pulse-ring");
const statusIndicator = document.getElementById("status-indicator");
const audioLevel = document.getElementById("audio-level");

const inputLang = document.getElementById("input-lang");
const outputLang = document.getElementById("output-lang");

const originalText = document.getElementById("original-text");
const translatedText = document.getElementById("translated-text");

const speakBtn = document.getElementById("speak-btn");
const copyOriginal = document.getElementById("copy-original");
const copyTranslated = document.getElementById("copy-translated");

const swapBtn = document.getElementById("swap-btn");
const swapBtnMobile = document.getElementById("swap-btn-mobile");

/************************************************************
 *                STATE
 ************************************************************/
let recognition;
let isRecording = false;
let lastProcessedText = "";
let audioInterval;

/************************************************************
 *                GEMINI CONFIG
 ************************************************************/
const GEMINI_API_KEY = 'AIzaSyBuZoPBlxDZrtThitzVexVgyAACL5MVaVA'; 
const GEMINI_MODEL = 'gemini-2.5-flash-lite';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

/************************************************************
 *                STATUS UI UPDATE
 ************************************************************/
function updateStatus(mode, message) {
    const config = {
        ready: { dot: "bg-gray-400", bg: "bg-gray-100", text: "text-gray-600" },
        recording: { dot: "bg-red-500", bg: "bg-red-100", text: "text-red-700" },
        processing: { dot: "bg-green-500", bg: "bg-green-100", text: "text-green-700" }
    };

    const s = config[mode];

    statusIndicator.className =
        `flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${s.bg} ${s.text}`;

    statusIndicator.innerHTML =
        `<div class="w-2 h-2 rounded-full ${s.dot}"></div><span>${message}</span>`;
}

/************************************************************
 *                INIT SPEECH RECOGNITION
 ************************************************************/
function initSpeechRecognition() {
    if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
        alert("Speech recognition not supported. Use Chrome/Edge.");
        return false;
    }

    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = inputLang.value;

    recognition.onresult = handleSpeechResult;

    recognition.onend = () => {
        if (isRecording) recognition.start();
    };

    recognition.onerror = (e) => console.error("Speech error:", e.error);

    return true;
}

/************************************************************
 *                HANDLE SPEECH STREAM
 ************************************************************/
async function handleSpeechResult(event) {
    let final = "";
    let interim = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        event.results[i].isFinal ? (final += t + " ") : (interim += t);
    }

    const fullText = final + interim;
    originalText.innerHTML = fullText || "<em>Listening...</em>";

    if (final.trim() && final.trim() !== lastProcessedText.trim()) {
        lastProcessedText = final.trim();

        updateStatus("processing", "Processing...");
        translatedText.innerHTML = "<em>Translating...</em>";

        const res = await processWithGemini(lastProcessedText);

        originalText.textContent = res.corrected;
        translatedText.textContent = res.translated;

        speakBtn.disabled = false;

        updateStatus("recording", "Recording...");
    }
}

/************************************************************
 *         ONE-REQUEST Gemini Translation + Correction
 ************************************************************/
async function processWithGemini(text) {
    const fromLang = inputLang.options[inputLang.selectedIndex].text.split(" ")[1] || "";
    const toLang = outputLang.options[outputLang.selectedIndex].text.split(" ")[1] || "";

    const prompt = `
You are a medical translator.

Task 1: Fix speech-to-text and medical terminology errors.
Task 2: Translate to ${toLang}.

Respond exactly in format:

CORRECTED: ...
TRANSLATED: ...
    
Text: "${text}"
`;

    try {
        const response = await fetch(GEMINI_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.3 }
            })
        });

        const json = await response.json();
        const output = json.candidates?.[0]?.content?.parts?.[0]?.text || "";

        return {
            corrected: output.match(/CORRECTED:\s*(.*?)(?=TRANSLATED:)/s)?.[1]?.trim() || text,
            translated: output.match(/TRANSLATED:\s*(.*)/s)?.[1]?.trim() || "Translation failed"
        };
    } catch (err) {
        return {
            corrected: text,
            translated: "Error. Try again."
        };
    }
}

/************************************************************
 *                RECORD BUTTON BEHAVIOR
 ************************************************************/
recordBtn.addEventListener("click", () => {
    console.log("Record button CLICKED");
    if (!isRecording) startRecording();
    else stopRecording();
});

function startRecording() {
    if (!initSpeechRecognition()) return;

    recognition.start();
    isRecording = true;

    pulseRing.classList.remove("opacity-0");
    pulseRing.classList.add("recording-pulse");

    recordBtn.innerHTML = `<i class="fas fa-stop text-white text-3xl"></i>`;

    originalText.innerHTML = "<em>Listening...</em>";
    translatedText.innerHTML = "<em>Translation will appear...</em>";

    updateStatus("recording", "Recording...");

    startAudioLevelMeter();

    speakBtn.disabled = true;
}

function stopRecording() {
    recognition?.stop();
    isRecording = false;

    pulseRing.classList.add("opacity-0");
    pulseRing.classList.remove("recording-pulse");

    recordBtn.innerHTML = `<i class="fas fa-microphone text-white text-3xl"></i>`;

    updateStatus("ready", "Ready to record");

    stopAudioLevelMeter();
}

/************************************************************
 *                AUDIO LEVEL METER (FAKE)
 ************************************************************/
function startAudioLevelMeter() {
    audioInterval = setInterval(() => {
        if (!isRecording) return;
        audioLevel.style.width = Math.random() * 60 + 20 + "%";
    }, 100);
}

function stopAudioLevelMeter() {
    clearInterval(audioInterval);
    audioLevel.style.width = "0%";
}

/************************************************************
 *                COPY BUTTONS
 ************************************************************/
copyOriginal.addEventListener("click", () => {
    navigator.clipboard.writeText(originalText.textContent);
});

copyTranslated.addEventListener("click", () => {
    navigator.clipboard.writeText(translatedText.textContent);
});

/************************************************************
 *                SPEAK TRANSLATION
 ************************************************************/
speakBtn.addEventListener("click", () => {
    const text = translatedText.textContent;
    if (!text) return;

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = outputLang.value;
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
});

/************************************************************
 *                SWAP LANGUAGES
 ************************************************************/
function swapLang() {
    const temp = inputLang.value;
    inputLang.value = outputLang.value;
    outputLang.value = temp;
}

swapBtn.addEventListener("click", swapLang);
swapBtnMobile.addEventListener("click", swapLang);

/************************************************************
 *                RETRANSLATE ON OUTPUT CHANGE
 ************************************************************/
outputLang.onchange = async () => {
    const text = originalText.textContent;
    if (!text || text.includes("Listening")) return;

    translatedText.innerHTML = "<em>Translating...</em>";
    const result = await processWithGemini(text);
    translatedText.textContent = result.translated;
};

/************************************************************
 *                INIT STATUS
 ************************************************************/
updateStatus("ready", "Ready to record");
})
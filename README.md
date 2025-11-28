# 📘 **Healthcare Translation Web App – README**

## 🏥 Project Title

**Healthcare Translation Web App with Generative AI**

## 🧠 Objective

This prototype demonstrates a real-time multilingual communication assistant for healthcare environments. It enables:

* Speech-to-text transcription
* AI-powered medical term correction
* Accurate translation
* Audio playback of translated text

The goal is to show **rapid development**, **technical proficiency**, and **generative AI integration** within 48 hours.

---

# 🚀 Features

## 🎤 **1. Voice-to-Text (STT)**

* Captures voice using the browser SpeechRecognition API
* Real-time transcription
* AI-enhanced medical transcription using Gemini
* Handles accents, noise, and mispronunciations

## 🌐 **2. AI Translation**

Gemini Flash Lite performs:

* Transcript correction
* Medical terminology refinement
* Translation into selected language

**Single API call → optimized speed + cost**

## 🔊 **3. Text-To-Speech (TTS)**

* Browser SpeechSynthesis API plays translated audio
* Supports multiple languages

## 📝 **4. Dual Transcript Display**

* Left panel → Original (AI-corrected)
* Right panel → Translated
* Updates in near real-time

## 🔄 **5. Language Controls**

* Input language selector
* Output language selector
* Swap button for quick switching
* Automatic re-translation when language changes

## 📱 **6. Mobile-First, Modern UI**

Built with TailwindCSS and includes:

* Big microphone button
* Pulse animation
* Live audio-level meter
* Scrollable transcript blocks
* Clean gradient background
* Fully responsive on mobile & desktop

---

# 🏗 **System Architecture**

```
User Voice
   │
   ▼
Browser SpeechRecognition API
   │ final transcript
   ▼
Gemini Flash Lite (Generative AI)
   │ corrected + translated text
   ▼
Frontend UI
   │
   └─► Dual transcript display
   └─► Speak Translation (TTS)
```

---

# 🧩 **Technology Stack**

### **Frontend**

* HTML5
* TailwindCSS
* JavaScript ES6

### **AI Services**

* Google Gemini 2.0 Flash Lite

  * Translation
  * Medical term correction
  * Transcription enhancement

### **Browser APIs**

* Web SpeechRecognition
* Web SpeechSynthesis
* Clipboard API

---

# 📁 **Folder Structure**

```
/project
│
├── index.html
├── script.js
└── README.md  
```

---

# 🔧 **Setup & Installation**

### **Step 1 — Add your Gemini API key**

In `script.js` update:

```js
const GEMINI_API_KEY = "YOUR_API_KEY_HERE";
```

You can generate a free key at:
🔗 [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

---

### **Step 2 — Open the App**

Just open **index.html** directly in:

* Chrome
* Edge

(Microphone requires HTTPS OR localhost)

---

### **Step 3 — Allow microphone access**

Click **Allow** when browser asks.

---

# ▶ **How to Use the App**

1. Choose **Input Language**
2. Choose **Output Language**
3. Tap the **microphone button**
4. Speak clearly

   * Real-time transcript appears
   * AI corrects text
   * AI translates text
5. Tap **Speak** to hear translation
6. Swap languages anytime
7. Copy transcripts with copy buttons

---

# 📡 **Generative AI Prompt Used**

```
You are a medical translator.

Task 1: Fix speech-to-text and medical terminology errors.
Task 2: Translate to {{targetLanguage}}.

Respond exactly in format:

CORRECTED: ...
TRANSLATED: ...

Text: "{{speechText}}"
```

---






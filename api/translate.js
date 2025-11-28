export default async function handler(req, res) {
  const { text, fromLang, toLang } = req.body;

  const prompt = `
You are a medical translator.

Task 1: Fix speech-to-text and medical terminology errors.
Task 2: Translate to ${toLang}.

Respond exactly in format:

CORRECTED: ...
TRANSLATED: ...

Text: "${text}"
`;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=" + process.env.GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3 }
      })
    }
  );

  const data = await response.json();
  res.status(200).json(data);
}


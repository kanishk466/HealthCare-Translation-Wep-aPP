// export default async function handler(req, res) {
//   const { text, fromLang, toLang } = req.body;

//   const prompt = `
// You are a medical translator.

// Task 1: Fix speech-to-text and medical terminology errors.
// Task 2: Translate to ${toLang}.

// Respond exactly in format:

// CORRECTED: ...
// TRANSLATED: ...

// Text: "${text}"
// `;

//   const response = await fetch(
//     console.log(process.env.GEMINI_API_KEY)
//     "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=" + process.env.GEMINI_API_KEY,
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         contents: [{ parts: [{ text: prompt }] }],
//         generationConfig: { temperature: 0.3 }
//       })
//     }
//   );

//   const data = await response.json();
//   res.status(200).json(data);
// }



export default async function handler(req, res) {
  console.log("FUNCTION STARTED");
  console.log("Method:", req.method);
  console.log("API KEY EXISTS:", !!process.env.GEMINI_API_KEY);

  if (req.method === "GET") {
    return res.status(200).json({
      message: "Use POST to call this translation endpoint."
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { text, fromLang, toLang } = req.body;

    console.log("REQUEST BODY:", req.body);

    if (!text) {
      console.log("ERROR: Missing text");
      return res.status(400).json({ error: "Missing text" });
    }

    const prompt = `
You are a medical translator.

Task 1: Fix speech-to-text and medical terminology errors.
Task 2: Translate to ${toLang}.

Respond exactly in format:

CORRECTED: ...
TRANSLATED: ...

Text: "${text}"
`;

    console.log("SENDING REQUEST TO GEMINI...");

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3 }
        })
      }
    );

    console.log("GEMINI RESPONSE STATUS:", response.status);

    const data = await response.json();

    console.log("GEMINI RESPONSE BODY:", data);

    if (!data.candidates) {
      return res.status(500).json({
        error: "Gemini returned no candidates",
        details: data
      });
    }

    const output = data.candidates[0].content.parts[0].text;

    return res.status(200).json({ output });

  } catch (err) {
    console.error("SERVER CRASH:", err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}




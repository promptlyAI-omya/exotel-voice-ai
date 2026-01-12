import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const FOUNDER_MOBILE = "91XXXXXXXXXX"; // <-- apna number (country code ke sath)

function detectLanguage(text) {
  if (/[अ-ह]/.test(text)) return "hi";
  if (/[ऀ-ॿ]/.test(text)) return "mr";
  return "en";
}

function isUrgent(text) {
  const keywords = [
    "founder", "omkar", "payment", "refund",
    "complaint", "urgent", "problem", "issue",
    "connect", "call"
  ];
  return keywords.some(k => text.includes(k));
}

app.post("/voice", async (req, res) => {
  const userSpeech =
    (req.body.SpeechResult || req.body.CallSid || "").toLowerCase();

  const lang = detectLanguage(userSpeech);
  const urgent = isUrgent(userSpeech);

  let reply = "";

  if (urgent) {
    reply =
      lang === "hi"
        ? "मैं समझ गई हूँ. क्या आप सच में हमारे founder से बात करना चाहते हैं? कृपया हाँ या नहीं बोलिए."
        : lang === "mr"
        ? "मी समजले आहे. तुम्हाला खरंच founder शी बोलायचं आहे का? कृपया हो किंवा नाही सांगा."
        : "I understand. Do you want to speak with our founder? Please say yes or no.";
  } else {
    reply =
      lang === "hi"
        ? "Promptly.ai एक AI prompt और services platform है, जहाँ आपको high quality AI prompts और creator solutions मिलती हैं. आप और बताना चाहें तो बोलिए."
        : lang === "mr"
        ? "Promptly.ai हे एक AI prompt आणि services platform आहे. तुम्हाला creators साठी advanced AI solutions मिळतात. अजून माहिती हवी असल्यास सांगा."
        : "Promptly.ai is an AI prompt and services platform helping creators and businesses get high quality AI results. Please tell me how I can help you.";
  }

  res.set("Content-Type", "text/xml");
  res.send(`
<Response>
  <Say voice="female">${reply}</Say>
</Response>
`);
});

app.post("/confirm", (req, res) => {
  const answer = (req.body.SpeechResult || "").toLowerCase();

  if (["yes", "haan", "ha", "ho"].some(w => answer.includes(w))) {
    res.set("Content-Type", "text/xml");
    res.send(`
<Response>
  <Say voice="female">ठीक है. आपको अभी founder से connect किया जा रहा है.</Say>
  <Dial>${FOUNDER_MOBILE}</Dial>
</Response>
`);
  } else {
    res.set("Content-Type", "text/xml");
    res.send(`
<Response>
  <Say voice="female">ठीक है. मैं आपकी मदद यहीं से कर सकती हूँ. कृपया बताइए.</Say>
</Response>
`);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Promptly AI Voice Server running");
});

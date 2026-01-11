import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/exotel", (req, res) => {
  const rawSpeech =
    req.body.SpeechResult ||
    req.body.Digits ||
    "";

  const speech = rawSpeech.toLowerCase();

  // ❌ Ignore generic words
  const ignoreWords = ["hello", "hi", "hey", "namaste"];
  const cleaned = ignoreWords.reduce(
    (t, w) => t.replace(new RegExp(w, "g"), ""),
    speech
  );

  // 🌐 Language detection (Indian-aware)
  const marathi = ["aahe", "kasa", "tumhi", "mala", "pahije", "kay", "bolaycha"];
  const hindi = ["hai", "kya", "mujhe", "chahiye", "baat", "madad", "payment"];
  const english = ["want", "need", "connect", "refund", "issue", "problem"];

  let language = "unknown";
  if (marathi.some(w => cleaned.includes(w))) language = "mr";
  else if (hindi.some(w => cleaned.includes(w))) language = "hi";
  else if (english.some(w => cleaned.includes(w))) language = "en";

  // 🚨 Urgency detection (language independent)
  const urgentKeywords = [
    "founder",
    "owner",
    "payment",
    "refund",
    "complaint",
    "legal",
    "urgent",
    "manager"
  ];

  const urgent = urgentKeywords.some(w => speech.includes(w));

  console.log("📞 Speech:", speech);
  console.log("🌐 Lang:", language);
  console.log("🚨 Urgent:", urgent);

  res.set("Content-Type", "text/xml");

  // 🔥 CONNECT FOUNDER
  if (urgent) {
    res.send(`
      <Response>
        <Connect>
          <Number>+917821017501</Number>
        </Connect>
      </Response>
    `);
    return;
  }

  // ✅ SAFE EXIT
  res.send(`
    <Response>
      <Hangup/>
    </Response>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log("🚀 Promptly.ai AI Receptionist LIVE")
);

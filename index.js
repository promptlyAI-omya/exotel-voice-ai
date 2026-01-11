import express from "express";

const app = express();

// Exotel sends application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ===============================
// EXOTEL PASSTHRU ENDPOINT
// ===============================
app.post("/exotel", (req, res) => {
  console.log("📞 Incoming Exotel Request");
  console.log(req.body);

  // Extract speech or fallback fields
  const speechText = (
    req.body.SpeechResult ||
    req.body.speech ||
    req.body.CallSid ||
    ""
  ).toLowerCase();

  console.log("🧠 Parsed Speech:", speechText);

  // Urgent keywords (future use)
  const urgentKeywords = [
    "founder",
    "owner",
    "payment",
    "refund",
    "urgent",
    "complaint",
    "problem",
    "issue",
    "support"
  ];

  const isUrgent = urgentKeywords.some(word =>
    speechText.includes(word)
  );

  console.log("🚨 Urgent:", isUrgent);

  /**
   * IMPORTANT:
   * Exotel ALWAYS expects valid XML
   * Even if you do nothing
   */
  res.set("Content-Type", "text/xml");

  // For now → clean hangup (NO LOOP)
  res.send(`
    <Response>
      <Hangup/>
    </Response>
  `);
});

// ===============================
// HEALTH CHECK (Browser test)
// ===============================
app.get("/", (req, res) => {
  res.send("✅ Exotel Voice AI backend running");
});

// ===============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Exotel Passthru endpoint
app.post("/exotel", (req, res) => {
  console.log("Incoming Exotel data:", req.body);

  const speechText =
    (req.body.SpeechResult || req.body.CallSid || "").toLowerCase();

  // 🔥 URGENT CONDITIONS
  const urgentKeywords = [
    "founder",
    "owner",
    "payment",
    "refund",
    "urgent",
    "complaint",
    "problem",
    "issue",
    "immediately",
    "abhi",
    "turant"
  ];

  const isUrgent = urgentKeywords.some(word =>
    speechText.includes(word)
  );

  if (isUrgent) {
    console.log("URGENT CALL → CONNECT FOUNDER");

    // 🔥 THIS is the key
    res
      .status(302)
      .set("Location", "exotel://connect")
      .end();
  } else {
    console.log("NORMAL CALL → END");

    res.status(200).send("OK");
  }
});

// Health check (important for Railway)
app.get("/", (req, res) => {
  res.send("Exotel Voice AI running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

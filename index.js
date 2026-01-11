import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/exotel", async (req, res) => {
  const userSpeech =
    req.body.SpeechResult ||
    req.body.CallSid ||
    "caller said nothing";

  console.log("Caller:", userSpeech);

  // 👉 Botpress webhook
  const bp = await fetch("https://webhook.botpress.cloud/4193e639-d6b9-4de1-95b0-b021b9053f05", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: userSpeech
    })
  });

  const ai = await bp.json();
  console.log("AI:", ai);

  // 👉 Decision
  if (ai.urgent === true) {
    return res.json({
      action: "connect",
      number: "+917821017501"
    });
  }

  return res.json({
    action: "hangup"
  });
});

app.get("/", (_, res) => res.send("Exotel AI live"));

app.listen(process.env.PORT || 3000);

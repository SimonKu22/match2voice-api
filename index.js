const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");
const path = require("path");


const audioData = JSON.parse(fs.readFileSync("./audioData.json", "utf8"));

app.use(cors());

// Middlewares
app.use(express.json());
app.use("/audio_files", express.static("./audio_files"));
app.use(
  "/celebrity_images",
  express.static(path.join(__dirname, "celebrity_images"))
);



//Function for Random Selection
let unplayedVoiceIds = audioData.map((voice) => voice.id);

function getRandomSelection(data) {
  if (unplayedVoiceIds.length === 0) {
    unplayedVoiceIds = audioData.map((voice) => voice.id);
  }

  const availableVoices = data.filter((voice) => unplayedVoiceIds.includes(voice.id));

  const randomIndex = Math.floor(Math.random() * availableVoices.length);
  const correctVoice = availableVoices[randomIndex];
  const correctVoiceGender = correctVoice.gender; 

  unplayedVoiceIds = unplayedVoiceIds.filter((id) => id !== correctVoice.id);

  let decoyVoices = [];
  const voicesOfSameGender = data.filter((voice) => voice.gender === correctVoiceGender); 

  while (decoyVoices.length < 2) {
    const randomVoice = voicesOfSameGender[Math.floor(Math.random() * voicesOfSameGender.length)];
    if (randomVoice.id !== correctVoice.id && !decoyVoices.includes(randomVoice)) {
      decoyVoices.push(randomVoice);
    }
  }

  const allVoices = [correctVoice, ...decoyVoices];
  for (let i = allVoices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allVoices[i], allVoices[j]] = [allVoices[j], allVoices[i]];
  }

  return {
    audio: correctVoice.filename,
    celebrities: allVoices,
    correctChoiceId: correctVoice.id,
  };
}

// Routes

// Get voices by gender
app.get("/voices/gender/:gender", (req, res) => {
  try {
    const voices = audioData.filter(
      (voice) => voice.gender === req.params.gender
    );
    res.json(voices);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Get voices by occupation
app.get("/voices/occupation/:occupation", (req, res) => {
  try {
    const voices = audioData.filter(
      (voice) => voice.occupation === req.params.occupation
    );
    res.json(voices);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Get voice by id
app.get("/voices/id/:id", (req, res) => {
  try {
    const voice = audioData.find((v) => v.id === parseInt(req.params.id));
    if (!voice) return res.status(404).send("Voice not found");
    res.json(voice);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Get a random voice
app.get("/voices/random", (req, res) => {
  try {
    const selection = getRandomSelection(audioData);
    if (!selection) return res.status(404).send("Voices not found");

    lastPlayedVoiceId = selection.correctChoiceId;
    res.json(selection);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});
// Display leaderboard
app.get("/display/leaderboard", (req, res) => {
  try {
    const leaderboardData = JSON.parse(fs.readFileSync("./leaderboard.json", "utf8"));
    res.status(200).json(leaderboardData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leaderboard", error });
  }
});


// Save the score
app.post("/savescore", (req, res) => {
  const { name, score } = req.body;
  try {
    // Read current leaderboard
    const leaderboardData = JSON.parse(fs.readFileSync("./leaderboard.json", "utf8"));
    
    // Generate a random ID
    const id = Math.floor(Math.random() * 1000000);
  
    // Add new entry
    leaderboardData.push({ name, score, id });
    
    // Save updated leaderboard
    fs.writeFileSync("./leaderboard.json", JSON.stringify(leaderboardData, null, 2));

    res.status(200).json({ message: "Score saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error saving score", error });
  }
});

// Server setup
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

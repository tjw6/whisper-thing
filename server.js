require("dotenv").config();
const axios = require("axios");
const express = require("express");
const multer = require("multer");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.static("public"));

app.post("/transcribe", upload.single("file"), async (req, res) => {
  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const transcriptionModel = "whisper-1";
    const formData = new FormData();
    formData.append("model", transcriptionModel);
    formData.append("file", req.file.buffer, req.file.originalname);

    const headers = {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
    };

    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      formData,
      { headers }
    );

    const transcription = response.data.text;
    const timestamp = new Date().toISOString().replace(/:/g, "-");
    const outputPath = `/home/tw/meetings/transcripts/transcription_${timestamp}`;

    fs.writeFileSync(outputPath, transcription);
    res.send(transcription);
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Data:", error.response.data);
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
    }
    res.status(500).send("Transcription failed");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

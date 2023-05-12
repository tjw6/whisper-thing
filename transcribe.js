// Load environment variables from .env file
require('dotenv').config();

// Import required modules
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Check if the input file was provided as an argument
if (process.argv.length < 3) {
    console.error('Usage: node file.js /path/to/inputfile.wav');
    process.exit(1);
}

// Set API key, input and output paths, and transcription model
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const inputFilePath = process.argv[2];
const outputDirectory = '/home/tw/';
const transcriptionModel = "whisper-1";

// Create form data object and append model and file data
const formData = new FormData();
formData.append("model", transcriptionModel);
formData.append("file", fs.createReadStream(inputFilePath));

// Set headers for axios request
const headers = {
    Authorization: `Bearer ${OPENAI_API_KEY}`,
    "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
};

// Generate an output file name based on the input file name
const generateOutputFileName = () => {
  const inputFileBaseName = path.basename(inputFilePath, path.extname(inputFilePath));
  return `${inputFileBaseName}.txt`;
};

// Make a POST request to the OpenAI API to transcribe the audio
axios
    .post("https://api.openai.com/v1/audio/transcriptions", formData, { headers })
    .then((response) => {
        // Extract the transcription text from the response object
        const transcription = response.data.text;
        
        // Print transcription to console and save to a file
        console.log(transcription);
        const outputFileName = generateOutputFileName();
        const outputFilePath = path.join(outputDirectory, outputFileName);
        fs.writeFileSync(outputFilePath, transcription);
    })    
    .catch((error) => {
        console.error('Error:', error.message);

        if (error.response) {
            console.error('Data:', error.response.data);
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        }
    });

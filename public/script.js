const audioFileInput = document.getElementById("audioFile");
const spectrogram = document.getElementById("spectrogram");
const transcription = document.getElementById("transcription");

audioFileInput.addEventListener("change", async (event) => {
    if (event.target.files && event.target.files[0]) {
        const audioFile = event.target.files[0];

        // Show the spectrogram animation
        spectrogram.style.display = "block";

        try {
            // Send the audio file to the backend for transcription
            const formData = new FormData();
            formData.append("file", audioFile);
            const response = await fetch("/transcribe", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Transcription failed");
            }

            // Display the transcribed text
            const transcribedText = await response.text();
            transcription.textContent = transcribedText;
        } catch (error) {
            console.error(error);
            transcription.textContent = "Error: Transcription failed";
        } finally {
            // Hide the spectrogram animation
            spectrogram.style.display = "none";
        }
    }
});

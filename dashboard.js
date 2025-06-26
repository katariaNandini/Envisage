document.addEventListener("DOMContentLoaded", () => {
    const voiceSelect = document.getElementById("voiceSelect");
    const speechRate = document.getElementById("speechRate");
    const calibrateGestures = document.getElementById("calibrateGestures");
    const calibrateEye = document.getElementById("calibrateEye");
  
    // Handle voice selection
    voiceSelect.addEventListener("change", () => {
      const selectedVoice = voiceSelect.value;
      console.log(`Voice selected: ${selectedVoice}`);
      // Save the voice setting (use chrome.storage.sync if needed)
    });
  
    // Handle speech rate adjustment
    speechRate.addEventListener("input", () => {
      const rate = speechRate.value;
      console.log(`Speech rate adjusted to: ${rate}`);
      // Save the speech rate setting
    });
  
    // Handle gesture calibration
    calibrateGestures.addEventListener("click", () => {
      console.log("Gesture calibration started.");
      // Trigger gesture calibration logic
    });
  
    // Handle eye tracking calibration
    calibrateEye.addEventListener("click", () => {
      console.log("Eye tracking calibration started.");
      // Trigger eye tracking calibration logic
    });
  });
  
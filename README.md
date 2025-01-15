# Envisage'25
# Hybrid Accessibility Tool-Navigo

## Overview
The Hybrid Accessibility Tool is an innovative application designed to enhance accessibility for individuals with disabilities. It leverages a combination of speech-to-text (STT), text-to-speech (TTS), gesture recognition, and browser automation to allow users to interact with digital content through multiple input methods. The app is designed to be cross-platform and will be packaged as a standalone desktop application using Electron.js.

## Features
- **Speech-to-Text (STT)**: Converts spoken language into text, using the Google Cloud Speech API.
- **Text-to-Speech (TTS)**: Converts written text into synthesized speech, using the Google Cloud Text-to-Speech API.
- **Gesture Recognition**: Detects hand gestures using MediaPipe and allows users to control the browser (e.g., scrolling, clicking) with gestures.
- **Browser Automation**: Uses Puppeteer to interact with live web pages, enabling users to automate actions like clicking, navigation, and scrolling based on input/gestures.
- **Cross-Platform Desktop App**: The application will be packaged using Electron.js, making it available for Windows, macOS, and Linux.

## Project Structure
This project will be organized into two main parts: the frontend (React.js) and the backend (Node.js + Express.js). Each part will handle different functionalities:

### Backend
- **Node.js + Express.js**: The backend will handle API requests, processing speech data, and browser automation tasks.
- **Google Cloud APIs**: Integrates with Google Cloud APIs for Speech-to-Text and Text-to-Speech functionalities.
- **Puppeteer**: Used for browser automation to handle user commands like clicking and scrolling.

### Frontend
- **React.js**: The user interface, which will include input fields for text, a microphone for voice input, and a webcam for gesture recognition.
- **MediaPipe**: Provides gesture recognition, running locally in the frontend.

### Desktop Framework
- **Electron.js**: Wraps the application into a cross-platform desktop app, hosting the frontend React app and allowing integration with native system capabilities.

## Folder Structure



## Getting Started

### Prerequisites
1. **Node.js**: Make sure you have Node.js installed (>= 16.x recommended).
2. **Google Cloud Account**: You will need to enable the Speech-to-Text and Text-to-Speech APIs from Google Cloud.
3. **Electron**: If you want to run the app as a desktop application, you need to have Electron installed.



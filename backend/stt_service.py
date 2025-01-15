import sounddevice as sd
import queue
import sys
from vosk import Model, KaldiRecognizer

# Path to the Vosk model
MODEL_PATH = r"C:\Users\Nandini\Downloads\vosk-model-small-en-us-0.15"

# Load the Vosk model
print("Loading Vosk model...")
model = Model(MODEL_PATH)
recognizer = KaldiRecognizer(model, 16000)  # 16kHz sample rate
audio_queue = queue.Queue()

def audio_callback(indata, frames, time, status):
    """Callback function to handle audio input."""
    if status:
        print(f"Audio Input Error: {status}", file=sys.stderr)
    audio_queue.put(bytes(indata))

def start_stt():
    """Main function to capture audio and perform speech-to-text."""
    print("Initializing microphone...")
    with sd.RawInputStream(samplerate=16000, blocksize=8000, dtype='int16',
                           channels=1, callback=audio_callback):
        print("Speak into the microphone (Ctrl+C to stop)...")
        while True:
            data = audio_queue.get()
            if recognizer.AcceptWaveform(data):
                result = recognizer.Result()
                print(f"Recognized: {result}")  # Print recognized text
            else:
                partial_result = recognizer.PartialResult()
                print(f"Partial: {partial_result}")

if __name__ == "__main__":
    try:
        start_stt()
    except KeyboardInterrupt:
        print("\nExiting...")
    except Exception as e:
        print(f"An error occurred: {e}")

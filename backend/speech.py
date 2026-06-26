import speech_recognition as sr
from gtts import gTTS
import pygame
import time
import os

# =========================
# AUDIO INITIALIZATION
# =========================

pygame.mixer.init()

# =========================
# SPEAK FUNCTION
# =========================

def speak(text):

    try:

        print("\nAssistant:", text)

        filename = f"voice_{int(time.time())}.mp3"

        tts = gTTS(
            text=text,
            lang='en'
        )

        tts.save(filename)

        pygame.mixer.music.load(filename)

        pygame.mixer.music.play()

        while pygame.mixer.music.get_busy():

            continue

        pygame.mixer.music.unload()

        os.remove(filename)

    except Exception as e:

        print("Speech Error:", e)

# =========================
# SPEECH RECOGNITION
# =========================

recognizer = sr.Recognizer()

def listen():

    try:

        with sr.Microphone() as source:

            print("\nListening...")

            recognizer.adjust_for_ambient_noise(
                source,
                duration=1
            )

            audio = recognizer.listen(
                source,
                timeout=5,
                phrase_time_limit=5
            )

        text = recognizer.recognize_google(audio)

        print("You:", text)

        return text.lower()

    except:

        return ""
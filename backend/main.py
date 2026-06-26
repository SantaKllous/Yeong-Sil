from vision_ai import generate_scene_description
from detector import detect_objects
from speech import speak, listen
from assistant import ask_ai

speak("AI Blind Assistant Activated")

# =========================================
# OBJECT FINDER
# =========================================

def find_specific_object(target_object):

    detections = detect_objects()

    found = False

    for obj in detections:

        label = obj["label"]

        if target_object.lower() in label.lower():

            position = obj["position"]

            distance = obj["distance"]

            response = (
                f"{label} detected on your "
                f"{position}. Approximately "
                f"{distance} centimeters away"
            )

            speak(response)

            found = True

    if not found:

        response = f"I could not find any {target_object}"

        speak(response)

# =========================================
# MAIN LOOP
# =========================================

while True:

    command = listen()

    # Skip empty voice input
    if not command:
        continue

    command = command.lower()

    # =====================================
    # STOP SYSTEM
    # =====================================

    if "stop" in command or "exit" in command:

        speak("Stopping assistant")

        break

    # =====================================
    # SURROUNDING SCAN
    # =====================================

    elif (
        "around" in command
        or "detect" in command
        or "scan" in command
        or "front of me" in command
        or "object" in command
    ):

        detections = detect_objects()

        if len(detections) == 0:

            response = "I could not detect anything important"

        else:

            response = generate_scene_description(detections)

        speak(response)

    # =====================================
    # SMART OBJECT FINDER
    # =====================================

    elif (
        "find" in command
        or "where is" in command
        or "locate" in command
    ):

        important_objects = [
            "person",
            "bottle",
            "chair",
            "cell phone",
            "phone",
            "cup",
            "laptop",
            "book",
            "backpack"
        ]

        target = None

        for item in important_objects:

            if item in command:

                target = item

                break

        if target is not None:

            if target == "phone":
                target = "cell phone"

            find_specific_object(target)

        else:

            response = (
                "Please tell me which object "
                "you want to find"
            )

            speak(response)

    # =====================================
    # GENERAL AI QUESTIONS
    # =====================================

    else:

        answer = ask_ai(command)

        speak(answer)
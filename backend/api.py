from flask import Flask, jsonify, request
from flask_cors import CORS
from assistant import ask_ai
from detector import detect_objects, detect_objects_from_frame
from ocr_ai import process_document

import cv2
import numpy as np
import base64
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

CORS(app)

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)
# ===================================
# NAVIGATION MEMORY
# ===================================

last_navigation_message = ""

# ===================================
# START ASSISTANT
# ===================================


@app.route("/assistant/start", methods=["GET"])
def start_assistant():

    return jsonify({
        "status": "success",
        "message": "Hello Sana, what can I help you with today?"
    })

# ===================================
# NORMAL ASSISTANT COMMANDS
# ===================================


@app.route("/assistant/command", methods=["POST"])
def assistant_command():

    try:

        data = request.get_json()

        command = data.get("command", "")

        print("User said:", command)

        if "surroundings" in command.lower():

            objects = detect_objects()

            if len(objects) == 0:

                return jsonify({
                    "status": "success",
                    "message": "I cannot detect any important objects."
                })

            response = ""

            for obj in objects:

                response += (
                    f"There is a {obj['label']} "
                    f"on your {obj['position']} "
                    f"approximately {obj['distance']} centimeters away. "
                )

            return jsonify({
                "status": "success",
                "message": response
            })

        response = ask_ai(command)

        return jsonify({
            "status": "success",
            "message": response
        })

    except Exception as e:

        print("ASSISTANT ERROR:", str(e))

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# ===================================
# LIVE CAMERA FRAME DETECTION
# ===================================


@app.route("/detect-frame", methods=["POST"])
def detect_frame():

    global last_navigation_message

    data = request.get_json()

    image_data = data["image"]

    image_data = image_data.split(",")[1]

    image_bytes = base64.b64decode(image_data)

    np_arr = np.frombuffer(
        image_bytes,
        np.uint8
    )

    frame = cv2.imdecode(
        np_arr,
        cv2.IMREAD_COLOR
    )

    objects = detect_objects_from_frame(
        frame
    )

    if len(objects) == 0:

        return jsonify({
            "message":
            "I cannot detect any important objects."
        })

    response = ""

    for obj in objects:

        response += (
            f"There is a {obj['label']} "
            f"on your {obj['position']} "
            f"approximately {obj['distance']} "
            f"centimeters away. "
        )

    # ===================================
    # SMART NAVIGATION MEMORY
    # ===================================

    if response == last_navigation_message:

        return jsonify({
            "message": ""
        })

    last_navigation_message = response

    return jsonify({
        "message": response
    })

# ===================================


@app.route("/ocr-frame", methods=["POST"])
def ocr_frame():

    data = request.get_json()

    command = data.get("command", "").lower()

    image_data = data["image"]

    image_data = image_data.split(",")[1]

    image_bytes = base64.b64decode(image_data)

    print("Received command:", command)

    # ==========================
    # DETERMINE MODE
    # ==========================

    if any(word in command for word in [
        "summarize",
        "summarise",
        "summary",
        "brief"
    ]):

        mode = "summarize"

    elif any(word in command for word in [
        "explain",
        "meaning",
        "understand"
    ]):

        mode = "explain"

    else:

        mode = "read"

    # ==========================
    # AI OCR
    # ==========================

    result = process_document(
        image_bytes,
        mode
    )

    return jsonify({
        "message": result
    })
     
     
@app.route("/")
def home():

    return jsonify({

        "status":"success",

        "message":"Yeong-Sil Backend Running"

    })
        
if __name__ == "__main__":
    app.run(debug=True)

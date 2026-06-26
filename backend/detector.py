import cv2
from ultralytics import YOLO
import os

# =========================
# LOAD YOLO MODEL
# =========================

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "yolov8n.pt"
)

model = YOLO(MODEL_PATH)

# =========================
# IMPORTANT OBJECTS
# =========================


IMPORTANT_OBJECTS = [
    "person",
    "chair",
    "bottle",
    "cell phone",
    "laptop",
    "backpack",
    "cup",
    "book",
    "keyboard",
    "mouse"
]

# =========================
# DISTANCE SETTINGS
# =========================

KNOWN_WIDTH = 50
FOCAL_LENGTH = 700

# =========================
# DISTANCE FUNCTION
# =========================


def distance_to_camera(
    known_width,
    focal_length,
    pixel_width
):

    return (
        known_width * focal_length
    ) / (pixel_width + 1e-6)

# =========================
# DETECT OBJECTS
# =========================


def detect_objects():

    cap = cv2.VideoCapture(0)

    ret, frame = cap.read()
    cv2.imwrite("test_capture.jpg", frame)
    print("Frame saved")

    cap.release()

    if not ret:

        return []

    results = model(frame)[0]

    frame_width = frame.shape[1]

    detected_objects = []

    for det in results.boxes:

        confidence = float(det.conf[0])

        if confidence < 0.5:
            continue

        label = model.names[int(det.cls[0])]

        print("Detected:", label)

        if label not in IMPORTANT_OBJECTS:
            continue

        x1, y1, x2, y2 = map(
            int,
            det.xyxy[0]
        )

        # =====================
        # POSITION DETECTION
        # =====================

        object_center = (x1 + x2) // 2

        if object_center < frame_width * 0.35:

            position = "left side"

        elif object_center > frame_width * 0.65:

            position = "right side"

        else:

            position = "front"

        # =====================
        # DISTANCE
        # =====================

        pixel_width = x2 - x1

        distance = distance_to_camera(
            KNOWN_WIDTH,
            FOCAL_LENGTH,
            pixel_width
        )

        # =====================
        # SAVE OBJECT DATA
        # =====================

        detected_objects.append({

            "label": label,

            "position": position,

            "distance": round(distance)

        })

    return detected_objects

def detect_objects_from_frame(frame):

    results = model(frame)[0]

    frame_width = frame.shape[1]

    detected_objects = []

    for det in results.boxes:

        confidence = float(det.conf[0])

        if confidence < 0.5:
            continue

        label = model.names[int(det.cls[0])]

        if label not in IMPORTANT_OBJECTS:
            continue

        x1, y1, x2, y2 = map(
            int,
            det.xyxy[0]
        )

        object_center = (x1 + x2) // 2

        if object_center < frame_width * 0.35:

            position = "left side"

        elif object_center > frame_width * 0.65:

            position = "right side"

        else:

            position = "front"

        pixel_width = x2 - x1

        distance = distance_to_camera(
            KNOWN_WIDTH,
            FOCAL_LENGTH,
            pixel_width
        )

        detected_objects.append({

            "label": label,
            "position": position,
            "distance": round(distance)

        })

    return detected_objects

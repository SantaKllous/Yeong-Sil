# =========================
# GENERATE NATURAL SCENE
# =========================

def generate_scene_description(objects):

    # No objects
    if len(objects) == 0:

        return (
            "I could not detect any important objects nearby."
        )

    descriptions = []

    for obj in objects:

        label = obj["label"]

        position = obj["position"]

        distance = obj["distance"]

        # =====================
        # CLOSE OBJECT
        # =====================

        if distance < 80:

            sentence = (
                f"There is a {label} very close "
                f"on your {position}"
            )

        # =====================
        # MID DISTANCE
        # =====================

        elif distance < 150:

            sentence = (
                f"There is a {label} nearby "
                f"on your {position}"
            )

        # =====================
        # FAR OBJECT
        # =====================

        else:

            sentence = (
                f"A {label} is detected "
                f"on your {position}"
            )

        descriptions.append(sentence)

    # =========================
    # FINAL SPEECH
    # =========================

    final_description = ". ".join(descriptions)

    return final_description
from dotenv import load_dotenv
import os
from openai import OpenAI

# =========================
# LOAD ENV
# =========================

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# =========================
# OPENROUTER CLIENT
# =========================

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY,
)

# =========================
# ASK AI
# =========================

def ask_ai(question):

    completion = client.chat.completions.create(
        model="openai/gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are Yeong-Sil, a smart AI assistant for visually impaired individuals. "
                    "Give short, clear, helpful responses."
                )
            },
            {
                "role": "user",
                "content": question
            }
        ]
    )

    return completion.choices[0].message.content
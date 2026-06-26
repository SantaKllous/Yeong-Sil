import os
import base64
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)


def process_document(image_bytes, mode):

    image_base64 = base64.b64encode(image_bytes).decode("utf-8")

    if mode == "read":

        instruction = (
            "Read every visible piece of text in this image. "
            "Return only the extracted text exactly as it appears."
        )

    elif mode == "summarize":

        instruction = (
            "This image contains a document. "
            "Read it carefully and summarize it in clear, concise, natural language "
            "for a visually impaired person."
        )

    else:

        instruction = (
            "Read the document in this image and explain it in very simple language "
            "for a visually impaired person."
        )

    completion = client.chat.completions.create(

        model="openai/gpt-4o-mini",

        messages=[

            {
                "role": "user",
                "content": [

                    {
                        "type": "text",
                        "text": instruction
                    },

                    {
                        "type": "image_url",
                        "image_url": {
                            "url":
                            f"data:image/jpeg;base64,{image_base64}"
                        }
                    }

                ]
            }

        ]

    )

    return completion.choices[0].message.content

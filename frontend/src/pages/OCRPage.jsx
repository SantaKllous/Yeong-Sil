import { useEffect, useRef, useState } from "react";

function OCRPage({ goBack }) {

  const videoRef = useRef(null);

  const canvasRef = useRef(null);

const [message, setMessage] = useState("");

  useEffect(() => {

    let stream;

    const startCamera = async () => {

      try {

        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

      } catch (error) {

        console.error(error);

      }

    };

    startCamera();

    return () => {

      if (stream) {

        stream
          .getTracks()
          .forEach(track => track.stop());

      }

    };

  }, []);

const captureFrame = async () => {

  const canvas = canvasRef.current;

  const video = videoRef.current;

  const ctx = canvas.getContext("2d");

  canvas.width = video.videoWidth;

  canvas.height = video.videoHeight;

  ctx.drawImage(
    video,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const image =
    canvas.toDataURL("image/jpeg");

  const response = await fetch(
    "http://127.0.0.1:5000/ocr-frame",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: image,
      }),
    }
  );

  const data = await response.json();

  setMessage(data.message);

  window.speechSynthesis.cancel();
  const speech = new SpeechSynthesisUtterance(
  data.message
);

window.speechSynthesis.speak(speech);

};

  const startListening = () => {

  const recognition =
    new window.webkitSpeechRecognition();

  recognition.lang = "en-US";

  recognition.start();

  setMessage("Listening...");

  recognition.onresult = async (event) => {

  const command =
  event.results[0][0].transcript.toLowerCase().trim();

console.log(command);

setMessage(command);

  // Capture the current camera frame

  const canvas = canvasRef.current;

  const video = videoRef.current;

  const ctx = canvas.getContext("2d");

  canvas.width = video.videoWidth;

  canvas.height = video.videoHeight;

  ctx.drawImage(
    video,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const image =
    canvas.toDataURL("image/jpeg");

  // Send both image and command

  const response = await fetch(
    "http://127.0.0.1:5000/ocr-frame",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: image,
        command: command,
      }),
    }
  );

  const data = await response.json();

  setMessage(data.message);

  window.speechSynthesis.cancel();

  const speech =
    new SpeechSynthesisUtterance(
      data.message
    );

  window.speechSynthesis.speak(speech);

};

};

  return (

    <div className="w-full h-screen bg-black relative">

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="
          absolute
          inset-0
          w-full
          h-full
          object-cover
        "
      />
      <canvas
  ref={canvasRef}
  style={{ display: "none" }}
/>

      <div className="absolute top-6 left-0 right-0 flex justify-center">

  <div
    className="
      bg-black/60
      text-white
      px-6
      py-3
      rounded-full
    "
  >
    OCR Mode
  </div>

</div>

{message && (

  <div
    className="
      absolute
      bottom-48
      left-4
      right-4
      bg-black/70
      text-white
      p-4
      rounded-2xl
      text-center
    "
  >
    {message}
  </div>

)}

      <div className="absolute bottom-32 left-0 right-0 flex justify-center">

  <button
    onClick={startListening}
    className="
      px-8
      py-4
      rounded-full
      bg-blue-500
      text-white
      font-semibold
    "
  >
    Speak Command
  </button>

</div>

      <div className="absolute bottom-10 left-0 right-0 flex justify-center">


        <button
          onClick={goBack}
          className="
            px-8
            py-3
            rounded-full
            bg-white
            text-black
            font-semibold


            border border-zinc-700
              flex flex-col items-center justify-center
              text-zinc-300 bg-zinc-800/80 backdrop-blur-lg
              hover:bg-zinc-700/80 transition
          "
        >
          Back
        </button>

      </div>

    </div>

  );

}

export default OCRPage;
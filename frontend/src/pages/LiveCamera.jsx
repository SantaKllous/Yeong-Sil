import { useRef, useEffect, useState } from "react";

function LiveCamera({ goBack }) {
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const canvasRef = useRef(null);

  const navigationRef = useRef(false);

  const [detectionResult, setDetectionResult] =
  useState("");
  const [navigationMode, setNavigationMode] =
  useState(false);

  useEffect(() => {
    let stream;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
             width: { ideal: 1280 },
             height: { ideal: 720 },
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Camera Error:", error);
      }
    };

    startCamera();

    return () => {

         clearInterval(
    intervalRef.current
  );

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

 const scanSurroundings = async () => {

  try {

    setDetectionResult("Scanning...");

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
      "http://yeong-sil-t922.onrender.com/detect-frame",
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

    if (data.message) {

  setDetectionResult(data.message);

  if (!window.speechSynthesis.speaking) {

    const speech =
  new SpeechSynthesisUtterance(
    data.message
  );

speech.onend = () => {

  if (navigationRef.current) {
    setTimeout(() => {

      scanSurroundings();

    }, 1000);

  }

};

window.speechSynthesis.speak(speech);

  }

}

  } catch (error) {

    console.error(error);

    setDetectionResult(
      "Unable to detect surroundings"
    );
  }
};

const startNavigation = () => {

  if (navigationMode) return;

  setNavigationMode(true);
  navigationRef.current = true;

  scanSurroundings();

};

const stopNavigation = () => {

  setNavigationMode(false);
  navigationRef.current = false;

  clearInterval(
    intervalRef.current
  );

  window.speechSynthesis.cancel();

};
  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">

      {/* LIVE CAMERA FEED */}

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

      {/* TOP TITLE */}

      <div className="absolute top-8 left-0 right-0 flex justify-center">

        <div
          className="
            bg-black/50
            backdrop-blur-md
            px-6
            py-3
            rounded-full
            text-white
            font-semibold
          "
        >
          Live Camera Mode
        </div>

      </div>


    {detectionResult && (

  <div
    className="
      absolute
      bottom-48
      left-4
      right-4
      bg-black/70
      backdrop-blur-md
      text-white
      p-4
      rounded-2xl
      text-center
    "
  >
    {detectionResult}
  </div>

)}



<div className="absolute bottom-32 left-0 right-0 flex justify-center gap-4">

  {!navigationMode ? (

    <button
      onClick={startNavigation}
      className="
        px-8
        py-4
        rounded-full
        bg-green-600
        text-white
        font-semibold
      "
    >
      Start Navigation
    </button>

  ) : (

    <button
      onClick={stopNavigation}
      className="
        px-8
        py-4
        rounded-full
        bg-red-600
        text-white
        font-semibold
      "
    >
      Stop Navigation
    </button>

  )}

  <button
    onClick={scanSurroundings}
    className="
      px-8
      py-4
      rounded-full
      bg-blue-500
      text-white
      font-semibold
      shadow-lg
    "
  >
    Scan Surroundings
  </button>

</div>

      {/* BOTTOM BUTTON */}

      <div className="absolute bottom-10 left-0 right-0 flex justify-center">

      <button
  onClick={() => {

    stopNavigation();

    window.speechSynthesis.cancel();

    goBack();

  }}
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

export default LiveCamera;
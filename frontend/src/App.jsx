import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import LiveCamera from "./pages/LiveCamera";
import OCRPage from "./pages/OCRPage";

import {
  FaBars,
  FaBook,
  FaCompass,
  FaCog,
  FaMicrophone,
  FaCamera,
  FaUserCircle,
} from "react-icons/fa";

import { FaFaceSmile } from "react-icons/fa6";

import logo from "./assets/logo.jpeg";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [assistantState, setAssistantState] = useState("idle");
  const [assistantMessage, setAssistantMessage] = useState("");
  const [currentScreen, setCurrentScreen] = useState("home");
  const speak = (text) => {

  window.speechSynthesis.cancel();

  const utterance =
    new SpeechSynthesisUtterance(text);

  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  window.speechSynthesis.speak(utterance);
};
  const startAssistant = async () => {
  try {

    setAssistantState("listening");

    await new Promise(resolve =>
      setTimeout(resolve, 1000)
    );

    setAssistantState("processing");

    const response = await fetch(
      "http://127.0.0.1:5000/assistant/start"
    );

    const data = await response.json();

    setAssistantMessage(data.message);
    speak(data.message);
    setAssistantState("speaking");

    setTimeout(() => {
      setAssistantState("idle");
    }, 4000);

  } catch (error) {

    console.error(error);

    setAssistantMessage("Backend connection failed");

    setAssistantState("idle");
  }
};

const startListening = () => {

  const recognition =
    new window.webkitSpeechRecognition();

  recognition.lang = "en-US";

  recognition.start();


  setAssistantState("listening");

  recognition.onresult = async (event) => {

    const text =
      event.results[0][0].transcript;

    console.log("You said:", text);

    setAssistantMessage(text);

    setAssistantState("processing");

    try {

      const response = await fetch(
        "http://127.0.0.1:5000/assistant/command",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            command: text,
          }),
        }
      );

      const data = await response.json();

      setAssistantMessage(data.message);

      console.log("AI RESPONSE:", data.message);

      speak(data.message);

      setAssistantState("speaking");

      setTimeout(() => {
  setAssistantState("idle");
}, 5000);

setTimeout(() => {
  setAssistantMessage("");
}, 10000);

    } catch (error) {

      console.error(error);

      setAssistantMessage(
        "Unable to connect to Yeong-Sil"
      );

      setAssistantState("idle");
    }
  };
};

 if (currentScreen === "camera") {
  return (
    <LiveCamera
      goBack={() => setCurrentScreen("home")}
    />
  );
}

if (currentScreen === "ocr") {
  return (
    <OCRPage
      goBack={() => setCurrentScreen("home")}
    />
  );
}

  return (
    <div className="w-full h-screen bg-[#0d0d0d] overflow-hidden relative">

      {/* ================= OUTER BACKGROUND ================= */}

      <div className="absolute inset-0 overflow-hidden">

        {/* BIG SOFT GLOW */}

        <div className="absolute top-[-200px] left-[-150px] w-[500px] h-[500px] bg-zinc-500/10 rounded-full blur-3xl"></div>

        <div className="absolute bottom-[-200px] right-[-150px] w-[500px] h-[500px] bg-zinc-400/10 rounded-full blur-3xl"></div>

        {/* FLOATING LIGHTS */}

        <motion.div
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-[20%] left-[15%] w-40 h-40 bg-white/5 rounded-full blur-3xl"
        />

        <motion.div
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute bottom-[20%] right-[10%] w-52 h-52 bg-zinc-300/5 rounded-full blur-3xl"
        />

      </div>

      {/* ================= STARS BACKGROUND ================= */}

      <div className="absolute inset-0 -z-10">
        {[...Array(60)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.1, 0.5, 0.1], scale: [1, 1.4, 1] }}
            transition={{ duration: 2 + (i % 3), repeat: Infinity }}
            className="absolute bg-white rounded-full"
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              top: `${(i * 13) % 100}%`,
              left: `${(i * 17) % 100}%`,
            }}
          />
        ))}
      </div>

      {/* ================= MOBILE CONTAINER ================= */}

      <div className="relative w-full h-screen bg-[#161616]/95 overflow-hidden shadow-2xl">

        {/* ===== MAGIC BACKGROUND EFFECTS ===== */}

        <div className="absolute inset-0 overflow-hidden pointer-events-none">

          {/* SHIMMER LIGHT */}

          <div
            className="
              absolute top-[-50%] left-[-50%] w-[200%] h-[200%]
              bg-gradient-to-r from-transparent via-white/5 to-transparent
              rotate-12 animate-[shimmer_10s_linear_infinite]
            "
          />

          {/* GLOW BALL 1 */}

          <div className="absolute top-10 left-5 w-40 h-40 bg-zinc-400/10 rounded-full blur-3xl animate-pulse"></div>

          {/* GLOW BALL 2 */}

          <div className="absolute bottom-10 right-5 w-52 h-52 bg-zinc-500/10 rounded-full blur-3xl animate-pulse"></div>

          {/* FLOATING SPARKLES */}

          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-zinc-300"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                boxShadow: "0 0 6px rgba(255,255,255,0.3)",
              }}
              animate={{ opacity: [0.1, 0.5, 0.1], y: [0, -10, 0] }}
              transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }}
            />
          ))}

        </div>

        {/* ================= HEADER ================= */}

        <div className="flex items-center justify-between px-5 pt-5 relative z-10">

          {/* PROFILE BUTTON */}

          <button onClick={() => setProfileOpen(true)}>
            <FaUserCircle className="text-zinc-300 text-5xl hover:text-white transition" />
          </button>

          {/* LOGO + TITLE */}

          <div className="flex items-center gap-2">

  <img
    src={logo}
    alt="logo"
    className="w-13 h-13 rounded-full object-cover"
  />

  <div>

    <h1
      className="text-white text-4xl"
      style={{ fontFamily: "Times New Roman" }}
    >
      Yeong-Sil AI-powered Vision Assistant
    </h1>

    {/* <p className="text-zinc-500 text-xs font-[Poppins]">
      AI-powered Blind Assistant
    </p> */}

  </div>

</div>

          {/* MENU BUTTON */}

          <button onClick={() => setMenuOpen(true)}>
            <FaBars className="text-zinc-300 text-4xl hover:text-white transition" />
          </button>

        </div>

        {/* ================= PROFILE SIDEBAR ================= */}

        {profileOpen && (
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setProfileOpen(false)}
          >

            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.35 }}
              onClick={(e) => e.stopPropagation()}
              className="
                absolute top-0 left-0 h-full w-[260px]
                bg-[#0f0f0f]/98 backdrop-blur-xl
                border-r border-zinc-800/60
                rounded-r-[35px] px-7 py-8 shadow-2xl
              "
            >

              <button
                onClick={() => setProfileOpen(false)}
                className="
                  w-10 h-10 rounded-full bg-zinc-800
                  flex items-center justify-center
                  text-zinc-300 text-2xl hover:bg-zinc-700 transition
                "
              >
                ×
              </button>

              <div className="flex flex-col items-center mt-10">

                <img
                  src={logo}
                  alt="profile"
                  className="w-24 h-24 rounded-full border-2 border-zinc-600 object-cover shadow-lg"
                />

                <h2 className="mt-5 text-white text-2xl font-semibold font-[Poppins]">
                  John Doe
                </h2>

                <p className="text-zinc-500 text-sm mt-1 font-[Poppins]">
                  Yeong-Sil User
                </p>

                <button
                  className="
                    mt-8 px-6 py-2 rounded-full
                    bg-zinc-800 text-zinc-300
                    border border-zinc-700
                    hover:bg-zinc-700 transition font-[Poppins]
                  "
                >
                  Log Out
                </button>

              </div>

            </motion.div>

          </div>
        )}

        {/* ================= MENU SIDEBAR ================= */}

        {menuOpen && (
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setMenuOpen(false)}
          >

            <motion.div
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.35 }}
              onClick={(e) => e.stopPropagation()}
              className="
                absolute top-0 right-0 h-full w-[260px]
                bg-[#0f0f0f]/98 backdrop-blur-xl
                border-l border-zinc-800/60
                shadow-2xl rounded-l-[35px]
                px-7 py-8 flex flex-col
              "
            >

              <button
                onClick={() => setMenuOpen(false)}
                className="
                  w-10 h-10 rounded-full bg-zinc-800
                  flex items-center justify-center
                  text-zinc-300 text-2xl hover:bg-zinc-700 transition
                "
              >
                ×
              </button>

              <div className="flex flex-col gap-7 text-zinc-300 text-lg mt-16">

                <button className="flex items-center gap-2 hover:text-white transition font-[Poppins]">
                  <FaFaceSmile />
                  Face Recognition
                </button>

                <button className="flex items-center gap-2 hover:text-white transition font-[Poppins]">
                  <FaCompass />
                  Navigation
                </button>

                <button className="flex items-center gap-2 hover:text-white transition font-[Poppins]">
                  <FaCog />
                  Settings
                </button>

              </div>

              <div className="mt-auto mb-8">

                <button
                  className="
                    w-full py-3 rounded-full
                    bg-zinc-800 text-zinc-300
                    hover:bg-zinc-700 transition font-[Poppins]
                    border border-zinc-700
                  "
                >
                  About Yeong-Sil
                </button>

              </div>

            </motion.div>

          </div>
        )}

        {/* ================= MAIN CONTENT ================= */}

        <div className="flex flex-col items-center justify-center mt-22 px-8 relative z-10">

          <p className="text-zinc-400 text-xl mt-10 font-[Poppins]">
            {assistantState === "idle" && "Hey, John Doe"}
            {assistantState === "listening" && "Listening..."}
            {assistantState === "processing" && "Processing..."}
            {assistantState === "speaking" && "Speaking..."}
          </p>

          <h2 className="text-white text-3xl leading-[60px] text-center mt-3">
            {assistantState === "idle" && (
              <>
                What can I help
                <br />
                you with today?
              </>
            )}
            {assistantState === "listening" && (
              <>
                I'm listening...
                <br />
                Tell me your command
              </>
            )}
            {assistantState === "processing" && (
              <>
                Detecting your
                <br />
                surroundings...
              </>
            )}
            {assistantState === "speaking" && (
              <>
                Here is what
                <br />
                I found...
              </>
            )}
          </h2>

          {/* BACKEND RESPONSE */}

{/* BACKEND RESPONSE */}

<div
  className="
    mt-4
    h-[110px]
    w-full
    overflow-y-auto
    px-4
    text-center
    font-[Poppins]
    text-white
  "
>
  {assistantMessage}
</div>

          {/* ================= MIC BUTTON ================= */}

          <motion.div
            onClick={startListening}

            animate={{
              scale:
                assistantState === "idle"
                  ? [1, 1.03, 1]
                  : assistantState === "listening"
                  ? [1, 1.15, 1]
                  : assistantState === "processing"
                  ? [1, 1.08, 1]
                  : [1, 1.12, 1],
            }}
            transition={{
              duration: assistantState === "listening" ? 0.8 : 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`
              mt-8 w-36 h-36 rounded-full
              bg-gradient-to-br from-zinc-600 to-zinc-900
              flex items-center justify-center cursor-pointer
              ${
                assistantState === "listening"
                  ? "shadow-[0_0_80px_rgba(255,255,255,0.18)]"
                  : assistantState === "speaking"
                  ? "shadow-[0_0_70px_rgba(255,255,255,0.14)]"
                  : "shadow-[0_0_50px_rgba(255,255,255,0.08)]"
              }
            `}
          >
            <div className="relative flex items-center justify-center">

              {/* PROCESSING RING */}

              {assistantState === "processing" && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="
                    absolute w-44 h-44 rounded-full
                    border-[3px] border-zinc-600/20 border-t-zinc-400
                  "
                />
              )}

              {/* INNER GLOW RING */}

              {assistantState === "processing" && (
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="
                    absolute w-40 h-40 rounded-full
                    border border-zinc-600/20 border-b-zinc-500
                  "
                />
              )}

              {/* SPEAKING WAVES */}

              {assistantState === "speaking" && (
                <>
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 1, opacity: 0.6 }}
                      animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeOut",
                      }}
                      className="absolute w-40 h-40 rounded-full border border-zinc-400"
                    />
                  ))}
                </>
              )}

              {/* MIC ICON */}

              <FaMicrophone className="text-white text-6xl relative z-10" />

            </div>
          </motion.div>

        </div>

        {/* ================= BOTTOM BUTTONS ================= */}

        <div className="absolute bottom-10 left-0 right-0 flex justify-around px-6 z-10">

          <button
            onClick={() => setCurrentScreen("camera")}
            className="
              w-28 h-28 rounded-full ml-40
              border border-zinc-700
              flex flex-col items-center justify-center
              text-zinc-300 bg-zinc-800/80 backdrop-blur-lg
              hover:bg-zinc-700/80 transition
              mr-22
            "
          >
            <FaCamera className="text-3xl mb-2" />
            <span className="text-sm">Live Camera</span>
          </button>

          <button
          onClick={() => setCurrentScreen("ocr")}
            className="
              w-28 h-28 rounded-full mr-40
              border border-zinc-700
              flex flex-col items-center justify-center
              text-zinc-300 bg-zinc-800/80 backdrop-blur-lg
              hover:bg-zinc-700/80 transition
            "
          >
            <FaBook className="text-5xl mb-2" />
            <span className="text-sm">OCR</span>
          </button>

        </div>

      </div>
    </div>
  );
}

export default App;
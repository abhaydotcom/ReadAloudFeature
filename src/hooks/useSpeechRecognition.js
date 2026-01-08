import { useRef, useState } from "react";

export const useSpeechRecognition = () => {
  const recognitionRef = useRef(null);
  const [text, setText] = useState("");

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = e => {
      let transcript = "";
      for (let i = 0; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript + " ";
      }
      setText(transcript.trim());
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  return { text, startListening, stopListening, setText };
};

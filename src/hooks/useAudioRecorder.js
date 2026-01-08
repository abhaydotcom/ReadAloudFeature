import { useRef, useState } from "react";

export const useAudioRecorder = () => {
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const [audioURL, setAudioURL] = useState(null);

  const startAudio = async () => {
    if (!mediaRecorderRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        mediaRecorderRef.current = new MediaRecorder(stream);
        chunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (e) => {
          chunksRef.current.push(e.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          setAudioURL(URL.createObjectURL(blob));
        };

        mediaRecorderRef.current.start();
      } catch (err) {
        console.error("Microphone access denied or error:", err);
      }
    }
  };

  const stopAudio = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      // Stop all tracks so browser doesn’t keep mic open
      streamRef.current?.getTracks().forEach(track => track.stop());
      mediaRecorderRef.current = null;
      streamRef.current = null;
    }
  };

  return { startAudio, stopAudio, audioURL };
};

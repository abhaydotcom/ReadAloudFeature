import { useState } from "react";
import { Mic, MicOff, Award, Clock, RotateCcw } from "lucide-react";
import { SAMPLE_PARAGRAPH } from "../constants/data";
import { useTimer } from "../hooks/useTimer";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { calculateScore } from "../utils/scoring";

const TIME_LIMIT = 20;

export default function ReadAloud() {
  const [recording, setRecording] = useState(false);
  const [score, setScore] = useState(null);
  const [timerEnded, setTimerEnded] = useState(false);

  const { timeLeft, startTimer, stopTimer } = useTimer(TIME_LIMIT, handleTimerEnd);
  const { startAudio, stopAudio, audioURL } = useAudioRecorder();
  const { text, startListening, stopListening, setText } = useSpeechRecognition();

  function startAll() {
    setText("");
    setScore(null);
    setRecording(true);
    setTimerEnded(false);
    startTimer();
    startAudio();
    startListening();
  }

  function stopAll() {
    setRecording(false);
   
    stopListening();
    stopAudio();
  }
  

  function handleTimerEnd() {
    setTimerEnded(true);
    stopAll(); 
    
  }

  function submit() {
    setScore(calculateScore(SAMPLE_PARAGRAPH, text));

    stopTimer();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Read Aloud Assessment</h1>
          <Award className="w-8 h-8 text-indigo-600" />
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p className="text-gray-800 text-lg leading-relaxed">{SAMPLE_PARAGRAPH}</p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Clock className={`w-10 h-10 ${timeLeft <= 5 ? "text-red-600" : "text-indigo-600"}`} />
          <div className={`text-6xl font-bold ${timeLeft <= 5 ? "text-red-600" : "text-indigo-600"}`}>
            {timeLeft}
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${timeLeft <= 5 ? "bg-red-500" : "bg-indigo-600"}`}
              style={{ width: `${(timeLeft / TIME_LIMIT) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex justify-center gap-4">
          {!recording && !score && !timerEnded && (
            <button
              onClick={startAll}
              className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold text-lg hover:bg-indigo-700 transition shadow"
            >
              <Mic className="w-6 h-6" />
              Start Reading
            </button>
          )}

          {recording && (
            <button
              onClick={stopAll}
              className="flex items-center gap-3 px-8 py-4 bg-red-600 text-white rounded-lg font-semibold text-lg hover:bg-red-700 transition shadow"
            >
              <MicOff className="w-6 h-6" />
              Stop
            </button>
          )}

          {(!recording || timerEnded) && text && !score && (
            <button
              onClick={submit}
              className="flex items-center gap-3 px-8 py-4 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition shadow"
            >
              Submit
            </button>
          )}
        </div>

        {text && !score && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <h3 className="font-semibold text-gray-700 mb-2">Recognized Text</h3>
            <p className="text-gray-800">{text}</p>
          </div>
        )}

        {score && (
          <div className="bg-green-50 border border-green-300 rounded-lg p-6 space-y-4 text-center">
            <div className="text-4xl font-bold text-green-700">{score.total} / 15</div>
            <p className="text-gray-700 font-medium">Reading Score</p>
            <audio controls className="mx-auto">
              <source src={audioURL} />
            </audio>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
            >
              <RotateCcw className="w-5 h-5" />
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

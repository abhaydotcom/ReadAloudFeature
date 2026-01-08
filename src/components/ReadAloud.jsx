import React, { useState, useEffect } from 'react';
import { Volume2, Square, Loader2 } from 'lucide-react';

const ReadAloud = () => {
  const [question, setQuestion] = useState(null);
  const [isReading, setIsReading] = useState(false);

  const fetchQuestion = async () => {
    setTimeout(() => {
      setQuestion({
       text: 'Climate change represents one of the most significant challenges facing our planet today. Rising global temperatures are causing widespread environmental impacts, including melting ice caps, rising sea levels, and more frequent extreme weather events. Scientists worldwide emphasize the urgent need for coordinated action to reduce greenhouse gas emissions and transition to renewable energy sources.'
      });
    }, 500);
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const speakText = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeech = new SpeechSynthesisUtterance(question.text);
      
      textToSpeech.rate = 0.9; 
      textToSpeech.pitch = 0.7;
      textToSpeech.volume = 1.0;
      textToSpeech.lang = 'en-US';

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.includes('en') && 
        (voice.name.includes('Google') || voice.name.includes('Microsoft'))) || voices.find(voice => voice.lang.includes('en'));
      
      if (preferredVoice) {
        textToSpeech.voice = preferredVoice;
      }

      textToSpeech.onstart = () => {
        setIsReading(true);
      };

      textToSpeech.onend = () => {
        setIsReading(false);
      };

      textToSpeech.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsReading(false);
      };

      window.speechSynthesis.speak(textToSpeech);
    } else {
      alert('Text-to-speech is not supported in your browser. Please use a modern browser like Chrome, Edge, or Safari.');
    }
  };

  const stopReading = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    }
  };

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
       
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="border-l-4 border-indigo-500 pl-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              {question.text}
            </p>
          </div>
        </div>

     
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col items-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Practice Tools</h3>
   
            <div className="flex space-x-4">
              {!isReading ? (
                <button
                  onClick={speakText}
                  className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>Read Aloud</span>
                </button>
              ) : (
                <button
                  onClick={stopReading}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
                >
                  <Square className="w-5 h-5" />
                  <span>Stop Reading</span>
                </button>
              )}
            </div>

            {isReading && (
              <div className="flex items-center space-x-2 text-indigo-600 animate-pulse">
                <Volume2 className="w-5 h-5" />
                <span className="font-medium">Reading text aloud...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadAloud;